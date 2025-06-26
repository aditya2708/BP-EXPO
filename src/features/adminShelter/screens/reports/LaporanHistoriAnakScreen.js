import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Modal,
  Image,
  TouchableOpacity
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../common/components/ErrorMessage';
import EmptyState from '../../../../common/components/EmptyState';
import SearchBar from '../../../../common/components/SearchBar';
import HistoriCard from '../../components/HistoriCard';
import {
  fetchLaporanHistori,
  fetchHistoriDetail,
  initializeHistoriLaporanPage,
  updateFiltersAndRefresh
} from '../../redux/historiLaporanThunks';
import {
  selectHistoriList,
  selectSummary,
  selectFilterOptions,
  selectFilters,
  selectSelectedHistori,
  selectLoading,
  selectDetailLoading,
  selectError,
  selectDetailError,
  clearSelectedHistori,
  setSearch
} from '../../redux/historiLaporanSlice';

const LaporanHistoriAnakScreen = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const historiList = useSelector(selectHistoriList);
  const summary = useSelector(selectSummary);
  const filterOptions = useSelector(selectFilterOptions);
  const filters = useSelector(selectFilters);
  const selectedHistori = useSelector(selectSelectedHistori);
  const loading = useSelector(selectLoading);
  const detailLoading = useSelector(selectDetailLoading);
  const error = useSelector(selectError);
  const detailError = useSelector(selectDetailError);
  
  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Initialize page data
  useEffect(() => {
    dispatch(initializeHistoriLaporanPage());
  }, [dispatch]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchLaporanHistori(filters));
    } finally {
      setRefreshing(false);
    }
  };

  // Handle search
  const handleSearch = (searchText) => {
    dispatch(setSearch(searchText));
    dispatch(updateFiltersAndRefresh({ search: searchText }));
  };

  // Handle histori card press
  const handleHistoriPress = async (histori) => {
    await dispatch(fetchHistoriDetail(histori.id_histori));
    setDetailModalVisible(true);
  };

  // Handle close detail modal
  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    dispatch(clearSelectedHistori());
  };

  // Render summary stats
  const renderSummary = () => {
    if (!summary) return null;

    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Ringkasan Histori</Text>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.total_histori}</Text>
            <Text style={styles.summaryLabel}>Total Histori</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.affected_children_count}</Text>
            <Text style={styles.summaryLabel}>Anak Terdampak</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.this_month_count}</Text>
            <Text style={styles.summaryLabel}>Bulan Ini</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.opname_count}</Text>
            <Text style={styles.summaryLabel}>Opname</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.non_opname_count}</Text>
            <Text style={styles.summaryLabel}>Non-Opname</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValueText}>{summary.most_common_jenis || '-'}</Text>
            <Text style={styles.summaryLabel}>Terbanyak</Text>
          </View>
        </View>

        {summary.most_recent_date && (
          <View style={styles.recentInfo}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.recentText}>
              Histori terakhir: {summary.most_recent_date}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Render detail modal
  const renderDetailModal = () => {
    if (!selectedHistori) return null;

    return (
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseDetail}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detail Histori</Text>
            <TouchableOpacity 
              onPress={handleCloseDetail}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {detailLoading ? (
            <LoadingSpinner message="Memuat detail..." />
          ) : detailError ? (
            <ErrorMessage message={detailError} />
          ) : (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Child Info */}
              <View style={styles.childSection}>
                <Image
                  source={{ uri: selectedHistori.anak.foto_url }}
                  style={styles.childPhotoLarge}
                />
                <View style={styles.childInfoDetail}>
                  <Text style={styles.childNameLarge}>{selectedHistori.anak.full_name}</Text>
                  <Text style={styles.childNicknameLarge}>({selectedHistori.anak.nick_name})</Text>
                  <Text style={styles.childAgeGender}>
                    {selectedHistori.anak.umur} tahun • {selectedHistori.anak.jenis_kelamin}
                  </Text>
                </View>
              </View>

              {/* Histori Detail */}
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Detail Histori</Text>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Jenis Histori:</Text>
                  <Text style={styles.detailValue}>{selectedHistori.jenis_histori}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nama Histori:</Text>
                  <Text style={styles.detailValue}>{selectedHistori.nama_histori}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tanggal:</Text>
                  <Text style={styles.detailValue}>{selectedHistori.tanggal_formatted}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status Opname:</Text>
                  <Text style={[
                    styles.detailValue,
                    selectedHistori.di_opname === 'Ya' ? styles.opnameYes : styles.opnameNo
                  ]}>
                    {selectedHistori.di_opname === 'Ya' ? 'Ya (Dirawat)' : 'Tidak'}
                  </Text>
                </View>
              </View>

              {/* Histori Photo */}
              {selectedHistori.foto_url && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Foto Histori</Text>
                  <Image
                    source={{ uri: selectedHistori.foto_url }}
                    style={styles.historiPhoto}
                    resizeMode="contain"
                  />
                </View>
              )}

              {/* Other Histori */}
              {selectedHistori.other_histori && selectedHistori.other_histori.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Histori Lainnya</Text>
                  {selectedHistori.other_histori.map((histori, index) => (
                    <View key={index} style={styles.otherHistoriItem}>
                      <Text style={styles.otherHistoriJenis}>{histori.jenis_histori}</Text>
                      <Text style={styles.otherHistoriNama}>{histori.nama_histori}</Text>
                      <Text style={styles.otherHistoriTanggal}>{histori.tanggal_formatted}</Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </Modal>
    );
  };

  // Loading state
  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat laporan histori..." />;
  }

  // Error state
  if (error && !refreshing) {
    return (
      <View style={styles.container}>
        <ErrorMessage 
          message={error} 
          onRetry={() => dispatch(fetchLaporanHistori(filters))}
        />
      </View>
    );
  }

  // Empty state
  if (!loading && historiList.length === 0 && !error) {
    return (
      <View style={styles.container}>
        <SearchBar
          value={filters.search}
          onChangeText={handleSearch}
          placeholder="Cari nama anak..."
          style={styles.searchBar}
        />
        <EmptyState
          icon="document-text-outline"
          title="Tidak ada data histori"
          message="Tidak ada data histori anak untuk filter yang dipilih"
          actionButtonText="Refresh"
          onActionPress={handleRefresh}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#9b59b6']}
            tintColor="#9b59b6"
          />
        }
      >
        {/* Search Bar */}
        <SearchBar
          value={filters.search}
          onChangeText={handleSearch}
          placeholder="Cari nama anak..."
          style={styles.searchBar}
        />

        {renderSummary()}
        
        {/* Histori List */}
        <View style={styles.historiContainer}>
          <Text style={styles.sectionTitle}>Daftar Histori Anak</Text>
          {historiList.map((histori) => (
            <HistoriCard
              key={histori.id_histori}
              histori={histori}
              onPress={handleHistoriPress}
            />
          ))}
        </View>
      </ScrollView>

      {renderDetailModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 20
  },
  searchBar: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8
  },

  // Summary styles
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9b59b6'
  },
  summaryValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9b59b6',
    textAlign: 'center'
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center'
  },
  recentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  recentText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },

  // Histori list styles
  historiContainer: {
    paddingHorizontal: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  closeButton: {
    padding: 4
  },
  modalContent: {
    flex: 1,
    padding: 16
  },

  // Child section styles
  childSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12
  },
  childPhotoLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16
  },
  childInfoDetail: {
    flex: 1
  },
  childNameLarge: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  childNicknameLarge: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4
  },
  childAgeGender: {
    fontSize: 14,
    color: '#999'
  },

  // Detail section styles
  detailSection: {
    marginBottom: 24
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right'
  },
  opnameYes: {
    color: '#e74c3c',
    fontWeight: '600'
  },
  opnameNo: {
    color: '#27ae60'
  },

  // Histori photo styles
  historiPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0'
  },

  // Other histori styles
  otherHistoriItem: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8
  },
  otherHistoriJenis: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  otherHistoriNama: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2
  },
  otherHistoriTanggal: {
    fontSize: 12,
    color: '#999'
  }
});

export default LaporanHistoriAnakScreen;