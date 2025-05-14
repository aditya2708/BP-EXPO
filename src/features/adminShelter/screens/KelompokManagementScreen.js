import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Button from '../../../common/components/Button';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import KelompokListItem from '../../../common/components/Kelompok/KelompokListItem';

// Import actions and selectors
import {
  fetchKelompok,
  fetchLevels,
  deleteKelompok,
  setSearchFilter,
  setLevelFilter,
  resetFilters,
  resetStatus,
  resetActionStatus,
  selectAllKelompok,
  selectLevels,
  selectKelompokStatus,
  selectKelompokError,
  selectKelompokPagination,
  selectKelompokFilters,
  selectKelompokActionStatus,
  selectKelompokActionError,
} from '../redux/kelompokSlice';

const KelompokManagementScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Get data from Redux
  const kelompokList = useSelector(selectAllKelompok);
  const levels = useSelector(selectLevels);
  const status = useSelector(selectKelompokStatus);
  const error = useSelector(selectKelompokError);
  const { currentPage, totalPages, total } = useSelector(selectKelompokPagination);
  const filters = useSelector(selectKelompokFilters);
  const deleteStatus = useSelector(state => selectKelompokActionStatus(state, 'delete'));
  const deleteError = useSelector(state => selectKelompokActionError(state, 'delete'));
  
  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [selectedLevelId, setSelectedLevelId] = useState(filters.levelId);
  
  // Load initial data
  useEffect(() => {
    fetchKelompokData();
    dispatch(fetchLevels());
    
    // Clean up on unmount
    return () => {
      dispatch(resetStatus());
      dispatch(resetActionStatus());
    };
  }, [dispatch]);
  
  // Monitor delete status
  useEffect(() => {
    if (deleteStatus === 'succeeded') {
      // Show success message
      Alert.alert('Sukses', 'Kelompok berhasil dihapus');
      // Reset action status
      dispatch(resetActionStatus('delete'));
    } else if (deleteStatus === 'failed' && deleteError) {
      // Show error message
      Alert.alert('Error', deleteError);
      // Reset action status
      dispatch(resetActionStatus('delete'));
    }
  }, [deleteStatus, deleteError, dispatch]);
  
  // Handle changes to filters
  useEffect(() => {
    // Update local state when redux filters change
    setSearchQuery(filters.search);
    setSelectedLevelId(filters.levelId);
  }, [filters]);

  // Fetch kelompok data
  const fetchKelompokData = async (page = 1, refreshData = false) => {
    if (refreshData) {
      setRefreshing(true);
    } else if (page > 1) {
      setLoadingMore(true);
    }

    await dispatch(fetchKelompok({ page }));
    
    setRefreshing(false);
    setLoadingMore(false);
  };

  // Pull-to-refresh handler
  const handleRefresh = () => {
    dispatch(resetStatus());
    fetchKelompokData(1, true);
  };

  // Load more handler for pagination
  const handleLoadMore = () => {
    if (loadingMore || status === 'loading' || currentPage >= totalPages) return;
    fetchKelompokData(currentPage + 1);
  };

  // Apply search filter
  const handleSearch = () => {
    dispatch(setSearchFilter(searchQuery));
    dispatch(fetchKelompok({ page: 1, search: searchQuery }));
  };

  // Clear search filter
  const clearSearch = () => {
    setSearchQuery('');
    dispatch(setSearchFilter(''));
    dispatch(fetchKelompok({ page: 1, search: '' }));
  };

  // Apply level filter
  const handleLevelFilter = (levelId) => {
    // Toggle off if already selected
    const newLevelId = selectedLevelId === levelId ? '' : levelId;
    setSelectedLevelId(newLevelId);
    dispatch(setLevelFilter(newLevelId));
    dispatch(fetchKelompok({ page: 1, levelId: newLevelId }));
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedLevelId('');
    dispatch(resetFilters());
    dispatch(fetchKelompok({ page: 1 }));
  };

  // Navigation handlers
  const handleViewKelompok = (kelompokId) => {
    navigation.navigate('KelompokDetail', { id: kelompokId });
  };

  const handleAddKelompok = () => {
    navigation.navigate('KelompokForm');
  };

  const handleEditKelompok = (kelompok) => {
    navigation.navigate('KelompokForm', { 
      kelompok,
      isEdit: true
    });
  };

  // Delete kelompok handler
  const handleDeleteKelompok = (kelompok) => {
    Alert.alert(
      'Hapus Kelompok',
      `Anda yakin ingin menghapus kelompok "${kelompok.nama_kelompok}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: () => {
            dispatch(deleteKelompok(kelompok.id_kelompok));
          }
        }
      ]
    );
  };

  // Render footer (loading indicator when loading more data)
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#e74c3c" />
        <Text style={styles.footerText}>Memuat data...</Text>
      </View>
    );
  };

  // Loading state
  if (status === 'loading' && !refreshing && !loadingMore && kelompokList.length === 0) {
    return <LoadingSpinner fullScreen message="Memuat data kelompok..." />;
  }

  return (
    <View style={styles.container}>
      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={handleRefresh}
          retryText="Coba Lagi"
        />
      )}
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari kelompok..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
        
        <Button
          leftIcon={<Ionicons name="add" size={20} color="#ffffff" />}
          type="primary"
          onPress={handleAddKelompok}
          style={styles.addButton}
        />
      </View>
      
      {/* Level Filter Buttons */}
      {levels.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.levelFilterContainer}
        >
          <TouchableOpacity
            style={[
              styles.levelFilterButton,
              selectedLevelId === '' && styles.levelFilterButtonActive
            ]}
            onPress={() => handleLevelFilter('')}
          >
            <Text style={[
              styles.levelFilterText,
              selectedLevelId === '' && styles.levelFilterTextActive
            ]}>
              Semua
            </Text>
          </TouchableOpacity>
          
          {levels.map(level => (
            <TouchableOpacity
              key={level.id_level_anak_binaan}
              style={[
                styles.levelFilterButton,
                selectedLevelId === level.id_level_anak_binaan.toString() && styles.levelFilterButtonActive
              ]}
              onPress={() => handleLevelFilter(level.id_level_anak_binaan.toString())}
            >
              <Text style={[
                styles.levelFilterText,
                selectedLevelId === level.id_level_anak_binaan.toString() && styles.levelFilterTextActive
              ]}>
                {level.nama_level_binaan}
              </Text>
            </TouchableOpacity>
          ))}
          
          {(searchQuery !== '' || selectedLevelId !== '') && (
            <TouchableOpacity
              style={styles.resetFilterButton}
              onPress={resetAllFilters}
            >
              <Ionicons name="refresh" size={16} color="#e74c3c" />
              <Text style={styles.resetFilterText}>Reset</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
      
      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Total Kelompok: <Text style={styles.statsValue}>{total}</Text>
        </Text>
      </View>
      
      {/* Kelompok List */}
      {kelompokList.length > 0 ? (
        <FlatList
          data={kelompokList}
          renderItem={({ item }) => (
            <KelompokListItem 
              kelompok={item}
              onPress={() => handleViewKelompok(item.id_kelompok)}
              onEdit={() => handleEditKelompok(item)}
              onDelete={() => handleDeleteKelompok(item)}
            />
          )}
          keyExtractor={(item) => item.id_kelompok?.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.emptyContainer}>
          {searchQuery.trim() !== '' || selectedLevelId !== '' ? (
            <>
              <Ionicons name="search" size={60} color="#cccccc" />
              <Text style={styles.emptyText}>
                Tidak ada kelompok ditemukan
                {searchQuery.trim() !== '' ? ` dengan "${searchQuery}"` : ''}
              </Text>
              <Button 
                title="Reset Filter" 
                onPress={resetAllFilters} 
                type="outline"
                style={styles.emptyButton}
              />
            </>
          ) : (
            <>
              <Ionicons name="people" size={60} color="#cccccc" />
              <Text style={styles.emptyText}>Belum ada kelompok terdaftar</Text>
              <Button 
                title="Tambah Kelompok Pertama" 
                onPress={handleAddKelompok} 
                type="primary"
                style={styles.emptyButton}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
};

// ScrollView component for horizontal filters
const ScrollView = ({ children, ...props }) => {
  return (
    <FlatList
      {...props}
      data={[1]}
      renderItem={() => <>{children}</>}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333333',
  },
  clearButton: {
    padding: 4,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelFilterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  levelFilterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e74c3c',
    backgroundColor: 'transparent',
  },
  levelFilterButtonActive: {
    backgroundColor: '#e74c3c',
  },
  levelFilterText: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '500',
  },
  levelFilterTextActive: {
    color: '#ffffff',
  },
  resetFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e74c3c',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  resetFilterText: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '500',
    marginLeft: 4,
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  statsText: {
    fontSize: 14,
    color: '#666666',
  },
  statsValue: {
    fontWeight: 'bold',
    color: '#333333',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 180,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
});

export default KelompokManagementScreen;