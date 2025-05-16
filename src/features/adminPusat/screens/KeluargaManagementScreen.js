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
import { Ionicons } from '@expo/vector-icons';

// Import components
import Button from '../../../common/components/Button';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Import API
import { adminPusatKeluargaApi } from '../api/adminPusatKeluargaApi';

const KeluargaManagementScreen = () => {
  const navigation = useNavigation();
  
  // State
  const [keluargaList, setKeluargaList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    id_kacab: '',
    id_wilbin: '',
    id_shelter: ''
  });
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Fetch keluarga data
  const fetchKeluargaData = async (page = 1, refresh = false) => {
    try {
      if (refresh) {
        setCurrentPage(1);
        page = 1;
      }
      
      setError(null);
      
      // Prepare params
      const params = {
        page,
        per_page: 10,
        search: debouncedSearchQuery.trim(),
        ...filters
      };
      
      // Fetch data
      const response = await adminPusatKeluargaApi.getAllKeluarga(params);
      
      if (response.data.success) {
        const newData = response.data.data || [];
        
        // If refreshing or first page, replace data
        // Otherwise, append data
        if (refresh || page === 1) {
          setKeluargaList(newData);
        } else {
          setKeluargaList(prev => [...prev, ...newData]);
        }
        
        // Set pagination info
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.current_page);
          setTotalPages(response.data.pagination.last_page);
        }
      } else {
        setError(response.data.message || 'Failed to load data');
      }
    } catch (err) {
      console.error('Error fetching keluarga:', err);
      setError('Failed to load family data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Trigger search on debounced query change
  useEffect(() => {
    fetchKeluargaData(1, true);
  }, [debouncedSearchQuery, filters]);

  // Initial data fetch
  useEffect(() => {
    fetchKeluargaData();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchKeluargaData(1, true);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (loadingMore || currentPage >= totalPages) return;
    
    setLoadingMore(true);
    fetchKeluargaData(currentPage + 1);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      id_kacab: '',
      id_wilbin: '',
      id_shelter: ''
    });
  };

  // Navigate to keluarga detail screen
  const handleViewKeluarga = (keluargaId) => {
    navigation.navigate('KeluargaDetail', { id: keluargaId });
  };

  // Navigate to filter screen
  const handleOpenFilters = () => {
    // TODO: Implement filter screen navigation
    Alert.alert('Filter', 'Filter functionality will be implemented later');
  };

  // Render footer (loading indicator when loading more data)
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#3498db" />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  // Render keluarga item
  const renderKeluargaItem = ({ item }) => {
    const keluarga = item;
    
    return (
      <TouchableOpacity 
        style={styles.keluargaItem}
        onPress={() => handleViewKeluarga(keluarga.id_keluarga)}
      >
        <View style={styles.keluargaContent}>
        <View style={styles.keluargaHeader}>
            <Text style={styles.keluargaName}>{keluarga.kepala_keluarga}</Text>
            <View style={styles.keluargaActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('KeluargaForm', { keluarga })}
              >
                <Ionicons name="create-outline" size={18} color="#3498db" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteKeluarga(keluarga)}
              >
                <Ionicons name="trash-outline" size={18} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.keluargaDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>No. KK:</Text>
              <Text style={styles.detailValue}>{keluarga.no_kk || '-'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={styles.detailValue}>{keluarga.status_ortu || '-'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shelter:</Text>
              <Text style={styles.detailValue}>{keluarga.shelter?.nama_shelter || '-'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cabang:</Text>
              <Text style={styles.detailValue}>{keluarga.kacab?.nama_kacab || '-'}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Loading state
  if (loading && !refreshing && !loadingMore) {
    return <LoadingSpinner fullScreen message="Loading families..." />;
  }

  return (
    <View style={styles.container}>
      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={handleRefresh}
          retryText="Try Again"
        />
      )}
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Family or KK"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={handleOpenFilters}
        >
          <Ionicons name="filter" size={20} color="#3498db" />
        </TouchableOpacity>
      </View>
      
      {/* Keluarga List */}
      {keluargaList.length > 0 ? (
        <FlatList
          data={keluargaList}
          renderItem={renderKeluargaItem}
          keyExtractor={(item) => item.id_keluarga?.toString()}
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
          {searchQuery.trim() !== '' ? (
            <>
              <Ionicons name="search" size={60} color="#cccccc" />
              <Text style={styles.emptyText}>No families found with "{searchQuery}"</Text>
              <Button 
                title="Clear Search" 
                onPress={clearSearch} 
                type="outline"
                style={styles.emptyButton}
              />
            </>
          ) : (
            <>
              <Ionicons name="people" size={60} color="#cccccc" />
              <Text style={styles.emptyText}>No families found</Text>
              <Button 
                title="Reset Filters" 
                onPress={resetFilters} 
                type="outline"
                style={styles.emptyButton}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    flexDirection: 'row',
    alignItems: 'center',
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  keluargaItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  keluargaContent: {
    padding: 16,
  },
  keluargaHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  keluargaName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  keluargaDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    width: 70,
    fontSize: 14,
    color: '#777',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
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

export default KeluargaManagementScreen;