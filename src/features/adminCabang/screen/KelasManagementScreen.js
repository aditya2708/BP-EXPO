import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import KelasCard from '../components/KelasCard';

import {
  fetchKelasList,
  deleteKelas,
  selectKelasList,
  selectKelasLoading,
  selectKelasError,
  selectKelasPagination
} from '../redux/kelasSlice';

import {
  fetchJenjangForDropdown,
  selectJenjangDropdownData
} from '../redux/jenjangSlice';

const KelasManagementScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const kelasList = useSelector(selectKelasList);
  const loading = useSelector(selectKelasLoading);
  const error = useSelector(selectKelasError);
  const pagination = useSelector(selectKelasPagination);
  const jenjangData = useSelector(selectJenjangDropdownData);
  
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterJenjang, setFilterJenjang] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadKelas();
    dispatch(fetchJenjangForDropdown());
  }, []);

  const loadKelas = async (page = 1) => {
    const params = { page };
    if (filterJenjang) params.id_jenjang = filterJenjang;
    if (filterJenis) params.jenis_kelas = filterJenis;
    if (filterStatus !== '') params.is_active = filterStatus;
    
    dispatch(fetchKelasList(params));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadKelas(1);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (pagination.current_page < pagination.last_page && !loadingMore) {
      setLoadingMore(true);
      await loadKelas(pagination.current_page + 1);
      setLoadingMore(false);
    }
  };

  const navigateToForm = (kelas = null) => {
    navigation.navigate('KelasForm', { kelas });
  };

  const navigateToDetail = (kelas) => {
    navigation.navigate('KelasDetail', { 
      kelasId: kelas.id_kelas,
      kelas 
    });
  };

  const handleDelete = (kelas) => {
    Alert.alert(
      'Hapus Kelas',
      `Hapus ${kelas.nama_kelas}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteKelas(kelas.id_kelas)).unwrap();
              Alert.alert('Sukses', 'Kelas berhasil dihapus');
            } catch (err) {
              Alert.alert('Error', err.message || 'Gagal menghapus kelas');
            }
          }
        }
      ]
    );
  };

  const applyFilters = () => {
    loadKelas(1);
  };

  const clearFilters = () => {
    setFilterJenjang('');
    setFilterJenis('');
    setFilterStatus('');
    loadKelas(1);
  };

  const renderKelas = ({ item }) => (
    <KelasCard
      kelas={item}
      onPress={() => navigateToDetail(item)}
      onEdit={() => navigateToForm(item)}
      onDelete={() => handleDelete(item)}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <LoadingSpinner size="small" />
      </View>
    );
  };

  const renderFilterButtons = () => {
    const jenisOptions = [
      { label: 'Semua Jenis', value: '' },
      { label: 'Standard', value: 'standard' },
      { label: 'Custom', value: 'custom' }
    ];

    const statusOptions = [
      { label: 'Semua Status', value: '' },
      { label: 'Aktif', value: '1' },
      { label: 'Non Aktif', value: '0' }
    ];

    return (
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filter:</Text>
        
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Jenjang:</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[styles.filterButton, !filterJenjang && styles.filterButtonActive]}
              onPress={() => setFilterJenjang('')}
            >
              <Text style={[styles.filterButtonText, !filterJenjang && styles.filterButtonTextActive]}>
                Semua
              </Text>
            </TouchableOpacity>
            {jenjangData.map((jenjang) => (
              <TouchableOpacity
                key={jenjang.id_jenjang}
                style={[
                  styles.filterButton,
                  filterJenjang === jenjang.id_jenjang.toString() && styles.filterButtonActive
                ]}
                onPress={() => setFilterJenjang(jenjang.id_jenjang.toString())}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterJenjang === jenjang.id_jenjang.toString() && styles.filterButtonTextActive
                  ]}
                >
                  {jenjang.kode_jenjang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Jenis:</Text>
          <View style={styles.filterButtons}>
            {jenisOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterButton,
                  filterJenis === option.value && styles.filterButtonActive
                ]}
                onPress={() => setFilterJenis(option.value)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterJenis === option.value && styles.filterButtonTextActive
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Status:</Text>
          <View style={styles.filterButtons}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterButton,
                  filterStatus === option.value && styles.filterButtonActive
                ]}
                onPress={() => setFilterStatus(option.value)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterStatus === option.value && styles.filterButtonTextActive
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterActions}>
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat kelas..." />;
  }

  return (
    <View style={styles.container}>
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => loadKelas()}
        />
      )}

      {renderFilterButtons()}

      <FlatList
        data={kelasList}
        renderItem={renderKelas}
        keyExtractor={(item) => item.id_kelas.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyText}>Belum ada kelas</Text>
            <Text style={styles.emptySubText}>Tap tombol + untuk menambah kelas</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigateToForm()}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#95a5a6',
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#2ecc71',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 4,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default KelasManagementScreen;