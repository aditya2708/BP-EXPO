import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ConfirmDialog from '../../../common/components/ConfirmDialog';
import {
  fetchSemesterDetail,
  fetchSemesterStatistics,
  deleteSemester,
  setActiveSemester,
  clearDetail,
  clearStatistics,
  selectSemesterDetail,
  selectSemesterLoading,
  selectSemesterStatistics,
  selectSemesterError
} from '../redux/semesterSlice';

const SemesterDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { semesterId } = route.params;
  
  const semester = useSelector(selectSemesterDetail);
  const loading = useSelector(selectSemesterLoading);
  const statistics = useSelector(selectSemesterStatistics);
  const error = useSelector(selectSemesterError);
  
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
      
      return () => {
        dispatch(clearDetail());
        dispatch(clearStatistics());
      };
    }, [semesterId])
  );

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(fetchSemesterDetail(semesterId)),
        dispatch(fetchSemesterStatistics(semesterId))
      ]);
    } catch (error) {
      console.error('Error loading semester data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleEdit = () => {
    navigation.navigate('SemesterForm', { semester });
  };

  const handleSetActive = async () => {
    try {
      await dispatch(setActiveSemester(semesterId)).unwrap();
      Alert.alert('Sukses', 'Semester berhasil diaktifkan');
      loadData();
    } catch (error) {
      Alert.alert('Error', error.message || 'Gagal mengaktifkan semester');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteSemester(semesterId)).unwrap();
      Alert.alert('Sukses', 'Semester berhasil dihapus');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Gagal menghapus semester');
    }
  };

  const handleKurikulumPreview = () => {
    if (semester?.kurikulum) {
      navigation.navigate('KurikulumPreview', { 
        kurikulumId: semester.kurikulum.id_kurikulum 
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return '#27ae60';
      case 'finished': return '#7f8c8d';
      case 'upcoming': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ongoing': return 'Berlangsung';
      case 'finished': return 'Selesai';
      case 'upcoming': return 'Akan Datang';
      default: return 'Tidak Diketahui';
    }
  };

  if (loading && !semester) {
    return <LoadingSpinner fullScreen message="Memuat detail semester..." />;
  }

  if (error && !semester) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#e74c3c" />
        <Text style={styles.errorText}>Gagal memuat data semester</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!semester) return null;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.semesterName}>{semester.nama_semester}</Text>
          <View style={styles.headerRow}>
            <Text style={styles.tahunAjaran}>{semester.tahun_ajaran}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(semester.status) }]}>
              <Text style={styles.statusText}>{getStatusLabel(semester.status)}</Text>
            </View>
          </View>
          {semester.is_active && (
            <View style={styles.activeBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
              <Text style={styles.activeText}>Semester Aktif</Text>
            </View>
          )}
        </View>
      </View>

      {/* Basic Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informasi Dasar</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Periode</Text>
            <Text style={styles.infoValue}>
              {semester.periode === 'ganjil' ? 'Ganjil' : 'Genap'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tahun Ajaran</Text>
            <Text style={styles.infoValue}>{semester.tahun_ajaran}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tanggal Mulai</Text>
            <Text style={styles.infoValue}>{formatDate(semester.tanggal_mulai)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tanggal Selesai</Text>
            <Text style={styles.infoValue}>{formatDate(semester.tanggal_selesai)}</Text>
          </View>
        </View>
      </View>

      {/* Kurikulum Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kurikulum</Text>
        
        {semester.kurikulum ? (
          <TouchableOpacity 
            style={styles.kurikulumCard}
            onPress={handleKurikulumPreview}
          >
            <View style={styles.kurikulumContent}>
              <View style={styles.kurikulumHeader}>
                <Ionicons name="book" size={24} color="#27ae60" />
                <View style={styles.kurikulumInfo}>
                  <Text style={styles.kurikulumName}>
                    {semester.kurikulum.nama_kurikulum}
                  </Text>
                  <Text style={styles.kurikulumYear}>
                    Tahun: {semester.kurikulum.tahun_berlaku}
                  </Text>
                  {semester.kurikulum.deskripsi && (
                    <Text style={styles.kurikulumDesc}>
                      {semester.kurikulum.deskripsi}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.noKurikulumCard}>
            <Ionicons name="book-outline" size={32} color="#bdc3c7" />
            <Text style={styles.noKurikulumText}>Belum ada kurikulum dipilih</Text>
            <Text style={styles.noKurikulumSubtext}>
              Edit semester untuk menambahkan kurikulum
            </Text>
          </View>
        )}
      </View>

      {/* Statistics Section */}
      {statistics && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistik</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.total_kelas}</Text>
              <Text style={styles.statLabel}>Total Kelas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.total_siswa}</Text>
              <Text style={styles.statLabel}>Total Siswa</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.total_jadwal}</Text>
              <Text style={styles.statLabel}>Total Jadwal</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: statistics.periode_aktif ? '#27ae60' : '#e74c3c' }
              ]} />
              <Text style={styles.statLabel}>
                {statistics.periode_aktif ? 'Periode Aktif' : 'Periode Tidak Aktif'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="create" size={20} color="#ffffff" />
          <Text style={styles.editButtonText}>Edit Semester</Text>
        </TouchableOpacity>
        
        {!semester.is_active && (
          <TouchableOpacity style={styles.activateButton} onPress={handleSetActive}>
            <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
            <Text style={styles.activateButtonText}>Aktifkan</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => setShowDeleteDialog(true)}
        >
          <Ionicons name="trash" size={20} color="#ffffff" />
          <Text style={styles.deleteButtonText}>Hapus</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        visible={showDeleteDialog}
        title="Hapus Semester"
        message={`Yakin ingin menghapus semester "${semester.nama_semester}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={() => {
          setShowDeleteDialog(false);
          handleDelete();
        }}
        onCancel={() => setShowDeleteDialog(false)}
        confirmButtonStyle={{ backgroundColor: '#e74c3c' }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#e74c3c',
    padding: 20,
    paddingBottom: 24,
  },
  headerContent: {
    marginTop: 8,
  },
  semesterName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tahunAjaran: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  activeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 4,
  },
  section: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  kurikulumCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27ae60',
    backgroundColor: '#f8fff8',
  },
  kurikulumContent: {
    padding: 16,
  },
  kurikulumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kurikulumInfo: {
    flex: 1,
    marginLeft: 12,
  },
  kurikulumName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
    marginBottom: 4,
  },
  kurikulumYear: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  kurikulumDesc: {
    fontSize: 12,
    color: '#95a5a6',
  },
  noKurikulumCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  noKurikulumText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '600',
    marginTop: 8,
  },
  noKurikulumSubtext: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e74c3c',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    fontWeight: '500',
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 8,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  activateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  activateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default SemesterDetailScreen;