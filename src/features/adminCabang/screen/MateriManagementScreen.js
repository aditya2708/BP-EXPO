import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import MateriCard from '../components/MateriCard';

import {
  fetchMateriList,
  deleteMateri,
  selectMateriList,
  selectMateriLoading,
  selectMateriError,
  selectMateriPagination
} from '../redux/materiSlice';

import {
  fetchJenjangForDropdown,
  selectJenjangDropdownData
} from '../redux/jenjangSlice';

import {
  fetchKelasByJenjang,
  selectKelasByJenjang
} from '../redux/kelasSlice';

const MateriManagementScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const materiList = useSelector(selectMateriList);
  const loading = useSelector(selectMateriLoading);
  const error = useSelector(selectMateriError);
  const pagination = useSelector(selectMateriPagination);
  const jenjangData = useSelector(selectJenjangDropdownData);
  const kelasByJenjang = useSelector(selectKelasByJenjang);
  
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterJenjang, setFilterJenjang] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMateri();
    dispatch(fetchJenjangForDropdown());
  }, []);

  useEffect(() => {
    if (filterJenjang) {
      dispatch(fetchKelasByJenjang(filterJenjang));
      setFilterKelas('');
    }
  }, [filterJenjang]);

  const loadMateri = async (page = 1) => {
    const params = { page };
    if (filterJenjang) params.id_jenjang = filterJenjang;
    if (filterKelas) params.id_kelas = filterKelas;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    
    dispatch(fetchMateriList(params));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMateri(1);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (pagination.current_page < pagination.last_page && !loadingMore) {
      setLoadingMore(true);
      await loadMateri(pagination.current_page + 1);
      setLoadingMore(false);
    }
  };

  const navigateToForm = (materi = null) => {
    navigation.navigate('MateriForm', { materi });
  };

  const navigateToDetail = (materi) => {
    navigation.navigate('MateriDetail', { 
      materiId: materi.id_materi,
      materi 
    });
  };

  const handleDelete = (materi) => {
    Alert.alert(
      'Hapus Materi',
      `Hapus ${materi.nama_materi}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteMateri(materi.id_materi)).unwrap();
              Alert.alert('Sukses', 'Materi berhasil dihapus');
            } catch (err) {
              Alert.alert('Error', err.message || 'Gagal menghapus materi');
            }
          }
        }
      ]
    );
  };

  const applyFilters = () => {
    loadMateri(1);
  };

  const clearFilters = () => {
    setFilterJenjang('');
    setFilterKelas('');
    setSearchQuery('');
    loadMateri(1);
  };

  const handleSearch = () => {
    loadMateri(1);
  };

  const getRomanNumeral = (tingkat) => {
    const numerals = {
      1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
      7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
    };
    return numerals[tingkat] || tingkat;
  };

  const getKelasDisplayName = (kelas) => {
    if (kelas.jenis_kelas === 'standard' && kelas.tingkat) {
      return `Kelas ${getRomanNumeral(kelas.tingkat)}`;
    }
    return kelas.nama_kelas;
  };

  const renderMateri = ({ item }) => (
    <MateriCard
      materi={item}
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

  const renderSearchAndFilter = () => {
    const kelasData = filterJenjang ? (kelasByJenjang[filterJenjang] || []) : [];

    return (
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cari nama materi..."
              placeholderTextColor="#999"
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => {
                setSearchQuery('');
                loadMateri(1);
              }}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

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

        {filterJenjang && kelasData.length > 0 && (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Kelas:</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[styles.filterButton, !filterKelas && styles.filterButtonActive]}
                onPress={() => setFilterKelas('')}
              >
                <Text style={[styles.filterButtonText, !filterKelas && styles.filterButtonTextActive]}>
                  Semua
                </Text>
              </TouchableOpacity>
              {kelasData.map((kelas) => (
                <TouchableOpacity
                  key={kelas.id_kelas}
                  style={[
                    styles.filterButton,
                    filterKelas === kelas.id_kelas.toString() && styles.filterButtonActive
                  ]}
                  onPress={() => setFilterKelas(kelas.id_kelas.toString())}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      filterKelas === kelas.id_kelas.toString() && styles.filterButtonTextActive
                    ]}
                  >
                    {getKelasDisplayName(kelas)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

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
    return <LoadingSpinner fullScreen message="Memuat materi..." />;
  }

  return (
    <View style={styles.container}>
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => loadMateri()}
        />
      )}

      {renderSearchAndFilter()}

      <FlatList
        data={materiList}
        renderItem={renderMateri}
        keyExtractor={(item) => item.id_materi.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyText}>Belum ada materi</Text>
            <Text style={styles.emptySubText}>Tap tombol + untuk menambah materi</Text>
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
  searchContainer: {
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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

export default MateriManagementScreen;