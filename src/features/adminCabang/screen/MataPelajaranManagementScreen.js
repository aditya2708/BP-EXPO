// 15. src/features/adminCabang/screens/MataPelajaranManagementScreen.js
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
import MataPelajaranCard from '../components/MataPelajaranCard';

import {
  fetchMataPelajaranList,
  deleteMataPelajaran,
  selectMataPelajaranList,
  selectMataPelajaranLoading,
  selectMataPelajaranError,
  selectMataPelajaranPagination
} from '../redux/mataPelajaranSlice';

const MataPelajaranManagementScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const mataPelajaranList = useSelector(selectMataPelajaranList);
  const loading = useSelector(selectMataPelajaranLoading);
  const error = useSelector(selectMataPelajaranError);
  const pagination = useSelector(selectMataPelajaranPagination);
  
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterKategori, setFilterKategori] = useState('');

  useEffect(() => {
    loadMataPelajaran();
  }, []);

  const loadMataPelajaran = async (page = 1) => {
    const params = { page };
    if (filterKategori) {
      params.kategori = filterKategori;
    }
    dispatch(fetchMataPelajaranList(params));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMataPelajaran(1);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (pagination.current_page < pagination.last_page && !loadingMore) {
      setLoadingMore(true);
      await loadMataPelajaran(pagination.current_page + 1);
      setLoadingMore(false);
    }
  };

  const navigateToForm = (mataPelajaran = null) => {
    navigation.navigate('MataPelajaranForm', { mataPelajaran });
  };

  const navigateToDetail = (mataPelajaran) => {
    navigation.navigate('MataPelajaranDetail', { 
      mataPelajaranId: mataPelajaran.id_mata_pelajaran,
      mataPelajaran 
    });
  };

  const handleDelete = (mataPelajaran) => {
    Alert.alert(
      'Hapus Mata Pelajaran',
      `Hapus ${mataPelajaran.nama_mata_pelajaran}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteMataPelajaran(mataPelajaran.id_mata_pelajaran)).unwrap();
              Alert.alert('Sukses', 'Mata pelajaran berhasil dihapus');
            } catch (err) {
              Alert.alert('Error', err.message || 'Gagal menghapus mata pelajaran');
            }
          }
        }
      ]
    );
  };

  const renderMataPelajaran = ({ item }) => (
    <MataPelajaranCard
      mataPelajaran={item}
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
    const categories = [
      { label: 'Semua', value: '' },
      { label: 'Wajib', value: 'wajib' },
      { label: 'Pilihan', value: 'pilihan' },
      { label: 'Muatan Lokal', value: 'muatan_lokal' },
      { label: 'Ekstrakurikuler', value: 'ekstrakurikuler' }
    ];

    return (
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filter Kategori:</Text>
        <View style={styles.filterButtons}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.value}
              style={[
                styles.filterButton,
                filterKategori === category.value && styles.filterButtonActive
              ]}
              onPress={() => {
                setFilterKategori(category.value);
                loadMataPelajaran(1);
              }}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterKategori === category.value && styles.filterButtonTextActive
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat mata pelajaran..." />;
  }

  return (
    <View style={styles.container}>
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => loadMataPelajaran()}
        />
      )}

      {renderFilterButtons()}

      <FlatList
        data={mataPelajaranList}
        renderItem={renderMataPelajaran}
        keyExtractor={(item) => item.id_mata_pelajaran.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="library-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyText}>Belum ada mata pelajaran</Text>
            <Text style={styles.emptySubText}>Tap tombol + untuk menambah mata pelajaran</Text>
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

export default MataPelajaranManagementScreen;