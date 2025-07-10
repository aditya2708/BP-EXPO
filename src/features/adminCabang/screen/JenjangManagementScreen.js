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
import JenjangCard from '../components/JenjangCard';

import {
  fetchJenjangList,
  fetchJenjangStatistics,
  selectJenjangList,
  selectJenjangStatistics,
  selectJenjangLoading,
  selectJenjangError
} from '../redux/jenjangSlice';

const JenjangManagementScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const jenjangList = useSelector(selectJenjangList);
  const statistics = useSelector(selectJenjangStatistics);
  const loading = useSelector(selectJenjangLoading);
  const error = useSelector(selectJenjangError);
  
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadJenjang();
    dispatch(fetchJenjangStatistics());
  }, []);

  const loadJenjang = async () => {
    const params = {};
    if (filterStatus !== '') params.is_active = filterStatus;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    
    dispatch(fetchJenjangList(params));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadJenjang();
    await dispatch(fetchJenjangStatistics());
    setRefreshing(false);
  };

  const navigateToForm = (jenjang = null) => {
    navigation.navigate('JenjangForm', { jenjang });
  };

  const navigateToDetail = (jenjang) => {
    navigation.navigate('JenjangDetail', { 
      jenjangId: jenjang.id_jenjang,
      jenjang 
    });
  };

  const applyFilters = () => {
    loadJenjang();
  };

  const clearFilters = () => {
    setFilterStatus('');
    setSearchQuery('');
    loadJenjang();
  };

  const handleSearch = () => {
    loadJenjang();
  };

  const renderJenjang = ({ item }) => (
    <JenjangCard
      jenjang={item}
      onPress={() => navigateToDetail(item)}
      onEdit={() => navigateToDetail(item)}
    />
  );

  const renderSearchAndFilter = () => {
    const statusOptions = [
      { label: 'Semua Status', value: '' },
      { label: 'Aktif', value: '1' },
      { label: 'Non Aktif', value: '0' }
    ];

    return (
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cari nama atau kode jenjang..."
              placeholderTextColor="#999"
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => {
                setSearchQuery('');
                loadJenjang();
              }}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <Text style={styles.filterTitle}>Filter:</Text>
        
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

  const renderStatistics = () => {
    if (!statistics) return null;

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Statistik Jenjang</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statistics.total_jenjang || 0}</Text>
            <Text style={styles.statLabel}>Total Jenjang</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statistics.active_jenjang || 0}</Text>
            <Text style={styles.statLabel}>Aktif</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statistics.total_kelas || 0}</Text>
            <Text style={styles.statLabel}>Total Kelas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statistics.total_mata_pelajaran || 0}</Text>
            <Text style={styles.statLabel}>Mata Pelajaran</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat jenjang..." />;
  }

  return (
    <View style={styles.container}>
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => loadJenjang()}
        />
      )}

      {renderSearchAndFilter()}
      {renderStatistics()}

      <FlatList
        data={jenjangList}
        renderItem={renderJenjang}
        keyExtractor={(item) => item.id_jenjang.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyText}>Belum ada jenjang</Text>
            <Text style={styles.emptySubText}>Data jenjang dikelola oleh admin pusat</Text>
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
  statsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
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
    textAlign: 'center',
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

export default JenjangManagementScreen;