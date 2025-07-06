import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import Button from '../../../common/components/Button';

import {
  fetchTutorHonor,
  calculateHonor,
  fetchCurrentSettings,
  calculatePreview,
  resetPreview,
  selectHonorList,
  selectHonorLoading,
  selectHonorError,
  selectHonorSummary,
  selectHonorActionStatus,
  selectCurrentSettings,
  selectPreview,
  resetActionStatus
} from '../redux/tutorHonorSlice';

const TutorHonorScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const { tutorId, tutorName } = route.params;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [previewData, setPreviewData] = useState({
    cpb_count: 5,
    pb_count: 3,
    npb_count: 2
  });

  const honorList = useSelector(selectHonorList);
  const loading = useSelector(selectHonorLoading);
  const error = useSelector(selectHonorError);
  const summary = useSelector(selectHonorSummary);
  const calculateStatus = useSelector(state => selectHonorActionStatus(state, 'calculate'));
  const currentSettings = useSelector(selectCurrentSettings);
  const preview = useSelector(selectPreview);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      dispatch(fetchCurrentSettings());
    }, [selectedYear])
  );

  useEffect(() => {
    const delayedPreview = setTimeout(() => {
      if (showPreviewModal && currentSettings) {
        dispatch(calculatePreview(previewData));
      }
    }, 500);
    
    return () => clearTimeout(delayedPreview);
  }, [previewData, showPreviewModal, currentSettings]);

  const fetchData = () => {
    dispatch(fetchTutorHonor({ 
      tutorId, 
      params: { year: selectedYear } 
    }));
  };

  const handleCalculateHonor = (month) => {
    if (!currentSettings) {
      Alert.alert(
        'Setting Honor Tidak Ditemukan',
        'Setting honor tutor belum dikonfigurasi. Hubungi admin pusat untuk mengatur setting honor.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Hitung Honor',
      `Hitung honor untuk bulan ${getMonthName(month)} ${selectedYear}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hitung',
          onPress: () => {
            dispatch(calculateHonor({
              tutorId,
              data: { month, year: selectedYear }
            }))
              .unwrap()
              .then(() => {
                Alert.alert('Berhasil', 'Honor berhasil dihitung');
                fetchData();
              })
              .catch((err) => {
                Alert.alert('Gagal', err || 'Gagal menghitung honor');
              });
          }
        }
      ]
    );
  };

  const handleOpenCalculationModal = () => {
    navigation.navigate('HonorCalculation', { tutorId, tutorName });
  };

  const handleShowPreview = () => {
    if (!currentSettings) {
      Alert.alert(
        'Setting Honor Tidak Ditemukan',
        'Setting honor tutor belum dikonfigurasi.',
        [{ text: 'OK' }]
      );
      return;
    }
    setShowPreviewModal(true);
  };

  const handlePreviewInputChange = (field, value) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setPreviewData(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const getMonthName = (month) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return '#f39c12';
      case 'approved': return '#27ae60';
      case 'paid': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'approved': return 'Disetujui';
      case 'paid': return 'Dibayar';
      default: return 'Unknown';
    }
  };

  const getPaymentSystemName = (paymentSystem) => {
    const systems = {
      'flat_monthly': 'Honor Bulanan Tetap',
      'per_session': 'Per Sesi/Pertemuan',
      'per_student_category': 'Per Kategori Siswa',
      'per_hour': 'Per Jam',
      'base_per_session': 'Dasar + Per Sesi',
      'base_per_student': 'Dasar + Per Siswa',
      'base_per_hour': 'Dasar + Per Jam',
      'session_per_student': 'Per Sesi + Per Siswa'
    };
    return systems[paymentSystem] || paymentSystem;
  };

  const renderSettingsInfo = () => {
    if (!currentSettings) {
      return (
        <View style={styles.settingsCard}>
          <View style={styles.settingsHeader}>
            <Ionicons name="warning" size={20} color="#f39c12" />
            <Text style={styles.settingsTitle}>Setting Honor Belum Dikonfigurasi</Text>
          </View>
          <Text style={styles.settingsSubtitle}>
            Hubungi admin pusat untuk mengatur setting honor tutor
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.settingsCard}
        onPress={() => setShowSettingsModal(true)}
      >
        <View style={styles.settingsHeader}>
          <Ionicons name="settings" size={20} color="#3498db" />
          <Text style={styles.settingsTitle}>Setting Honor Aktif</Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </View>
        <Text style={styles.settingsSubtitle}>
          {getPaymentSystemName(currentSettings.payment_system)}
        </Text>
        {currentSettings.payment_system === 'per_student_category' && (
          <View style={styles.ratesPreview}>
            <Text style={styles.rateText}>CPB: Rp {currentSettings.cpb_rate?.toLocaleString('id-ID')}</Text>
            <Text style={styles.rateText}>PB: Rp {currentSettings.pb_rate?.toLocaleString('id-ID')}</Text>
            <Text style={styles.rateText}>NPB: Rp {currentSettings.npb_rate?.toLocaleString('id-ID')}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderRateInfo = (setting) => {
    const { payment_system } = setting;

    switch (payment_system) {
      case 'flat_monthly':
        return (
          <View style={styles.rateItem}>
            <Text style={styles.rateLabel}>Honor Bulanan</Text>
            <Text style={styles.rateValue}>
              Rp {setting.flat_monthly_rate?.toLocaleString('id-ID')}
            </Text>
          </View>
        );

      case 'per_session':
        return (
          <View style={styles.rateItem}>
            <Text style={styles.rateLabel}>Per Sesi</Text>
            <Text style={styles.rateValue}>
              Rp {setting.session_rate?.toLocaleString('id-ID')}
            </Text>
          </View>
        );

      case 'per_student_category':
        return (
          <View style={styles.ratesContainer}>
            <View style={styles.rateItem}>
              <Text style={styles.rateLabel}>CPB</Text>
              <Text style={styles.rateValue}>
                Rp {setting.cpb_rate?.toLocaleString('id-ID')}
              </Text>
            </View>
            <View style={styles.rateItem}>
              <Text style={styles.rateLabel}>PB</Text>
              <Text style={styles.rateValue}>
                Rp {setting.pb_rate?.toLocaleString('id-ID')}
              </Text>
            </View>
            <View style={styles.rateItem}>
              <Text style={styles.rateLabel}>NPB</Text>
              <Text style={styles.rateValue}>
                Rp {setting.npb_rate?.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
        );

      case 'per_hour':
        return (
          <View style={styles.rateItem}>
            <Text style={styles.rateLabel}>Per Jam</Text>
            <Text style={styles.rateValue}>
              Rp {setting.hourly_rate?.toLocaleString('id-ID')}
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  const renderSettingsModal = () => (
    <Modal
      visible={showSettingsModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Detail Setting Honor</Text>
          <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        {currentSettings && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.settingDetailCard}>
              <Text style={styles.settingDetailTitle}>Sistem Pembayaran</Text>
              <Text style={styles.settingDetailValue}>
                {getPaymentSystemName(currentSettings.payment_system)}
              </Text>
            </View>

            <View style={styles.settingDetailCard}>
              <Text style={styles.settingDetailTitle}>Rate Honor</Text>
              {renderRateInfo(currentSettings)}
            </View>

            <View style={styles.settingDetailCard}>
              <Text style={styles.settingDetailTitle}>Informasi Setting</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ID Setting:</Text>
                <Text style={styles.infoValue}>#{currentSettings.id_setting}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Dibuat:</Text>
                <Text style={styles.infoValue}>
                  {new Date(currentSettings.created_at).toLocaleDateString('id-ID')}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>AKTIF</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );

  const renderPreviewModal = () => (
    <Modal
      visible={showPreviewModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Preview Kalkulasi Honor</Text>
          <TouchableOpacity onPress={() => {
            setShowPreviewModal(false);
            dispatch(resetPreview());
          }}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {currentSettings && (
            <>
              <View style={styles.previewInputSection}>
                <Text style={styles.sectionTitle}>Input Jumlah Siswa</Text>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>CPB</Text>
                    <TextInput
                      style={styles.previewInput}
                      value={previewData.cpb_count.toString()}
                      onChangeText={(value) => handlePreviewInputChange('cpb_count', value)}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>PB</Text>
                    <TextInput
                      style={styles.previewInput}
                      value={previewData.pb_count.toString()}
                      onChangeText={(value) => handlePreviewInputChange('pb_count', value)}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>NPB</Text>
                    <TextInput
                      style={styles.previewInput}
                      value={previewData.npb_count.toString()}
                      onChangeText={(value) => handlePreviewInputChange('npb_count', value)}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                </View>
              </View>

              {preview && (
                <View style={styles.previewResult}>
                  <Text style={styles.sectionTitle}>Hasil Kalkulasi</Text>
                  <View style={styles.previewBreakdown}>
                    {Object.entries(preview.calculation.breakdown).map(([key, data]) => (
                      <View key={key} style={styles.breakdownItem}>
                        <View style={styles.breakdownHeader}>
                          <Text style={styles.breakdownLabel}>{key.toUpperCase()}</Text>
                          <Text style={styles.breakdownAmount}>
                            Rp {data.amount?.toLocaleString('id-ID')}
                          </Text>
                        </View>
                        <Text style={styles.breakdownDetail}>
                          {data.count} siswa × Rp {data.rate?.toLocaleString('id-ID')}
                        </Text>
                      </View>
                    ))}
                    <View style={[styles.breakdownItem, styles.totalBreakdown]}>
                      <View style={styles.breakdownHeader}>
                        <Text style={styles.totalLabel}>Total Honor</Text>
                        <Text style={styles.totalAmount}>
                          {preview.formatted_total}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  const renderHonorItem = ({ item }) => (
    <TouchableOpacity
      style={styles.honorItem}
      onPress={() => navigation.navigate('TutorHonorDetail', {
        tutorId,
        tutorName,
        month: item.bulan,
        year: item.tahun
      })}
    >
      <View style={styles.honorHeader}>
        <Text style={styles.monthText}>{item.bulan_nama} {item.tahun}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.honorDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.total_aktivitas} aktivitas</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.total_siswa_hadir} siswa hadir</Text>
        </View>
      </View>
      
      <Text style={styles.honorAmount}>Rp {item.total_honor?.toLocaleString('id-ID')}</Text>
      
      <View style={styles.actionRow}>
        {item.status === 'draft' && (
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={(e) => {
              e.stopPropagation();
              handleCalculateHonor(item.bulan);
            }}
          >
            <Ionicons name="calculator-outline" size={16} color="#3498db" />
            <Text style={styles.calculateButtonText}>Hitung Ulang</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.viewButton}>
          <Ionicons name="eye-outline" size={16} color="#666" />
          <Text style={styles.viewButtonText}>Lihat Detail</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color="#e0e0e0" />
      <Text style={styles.emptyTitle}>Belum Ada Data Honor</Text>
      <Text style={styles.emptySubtitle}>
        Hitung honor tutor untuk melihat data
      </Text>
      <Button
        title="Hitung Honor"
        onPress={handleOpenCalculationModal}
        style={styles.calculateHonorButton}
        leftIcon={<Ionicons name="calculator" size={20} color="#fff" />}
      />
    </View>
  );

  if (loading && honorList.length === 0) {
    return <LoadingSpinner fullScreen message="Memuat data honor..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View>
            <Text style={styles.tutorName}>{tutorName}</Text>
            <Text style={styles.yearText}>Tahun {selectedYear}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={handleShowPreview}
            >
              <Ionicons name="calculator" size={20} color="#3498db" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleOpenCalculationModal}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>Rp {summary.yearlyTotal?.toLocaleString('id-ID')}</Text>
            <Text style={styles.summaryLabel}>Total Honor</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.totalActivities}</Text>
            <Text style={styles.summaryLabel}>Total Aktivitas</Text>
          </View>
        </View>
      </View>

      {renderSettingsInfo()}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchData}
        />
      )}

      <FlatList
        data={honorList}
        renderItem={renderHonorItem}
        keyExtractor={(item) => `${item.bulan}_${item.tahun}`}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {renderSettingsModal()}
      {renderPreviewModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed'
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tutorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  yearText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  previewButton: {
    backgroundColor: '#f8f9fa',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3498db'
  },
  addButton: {
    backgroundColor: '#3498db',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  summaryItem: {
    alignItems: 'center'
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71'
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  settingsCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1
  },
  settingsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 28
  },
  ratesPreview: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 28,
    gap: 16
  },
  rateText: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '500'
  },
  listContainer: {
    padding: 16
  },
  honorItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  honorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  honorDetails: {
    marginBottom: 12
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666'
  },
  honorAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 12
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#ebf3fd'
  },
  calculateButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#3498db',
    fontWeight: '500'
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12
  },
  viewButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24
  },
  calculateHonorButton: {
    minWidth: 200
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  modalContent: {
    flex: 1,
    padding: 16
  },
  settingDetailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  settingDetailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  settingDetailValue: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500'
  },
  ratesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  rateItem: {
    alignItems: 'center',
    minWidth: 80
  },
  rateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  rateValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  infoLabel: {
    fontSize: 14,
    color: '#666'
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500'
  },
  activeBadge: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  previewInputSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12
  },
  inputGroup: {
    flex: 1,
    alignItems: 'center'
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500'
  },
  previewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#f8f9fa',
    width: '100%'
  },
  previewResult: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16
  },
  previewBreakdown: {
    gap: 12
  },
  breakdownItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  breakdownLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  breakdownAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2ecc71'
  },
  breakdownDetail: {
    fontSize: 12,
    color: '#666'
  },
  totalBreakdown: {
    borderBottomWidth: 0,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71'
  }
});

export default TutorHonorScreen;