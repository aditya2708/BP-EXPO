import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
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
import { adminShelterAnakApi } from '../api/adminShelterAnakApi';

// Import utils
import { calculateAge, getStatusLabel } from '../../../common/utils/ageCalculator';

const AnakManagementScreen = () => {
  const navigation = useNavigation();
  const [anakList, setAnakList] = useState([]);
  const [filteredAnakList, setFilteredAnakList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    anak_aktif: 0,
    anak_tidak_aktif: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState(''); // '', 'aktif', or 'non-aktif'

  // Fetch anak data
  const fetchAnakData = async (page = 1, refresh = false) => {
    try {
      if (refresh) {
        setCurrentPage(1);
        page = 1;
      }
      
      setError(null);
      
      // Prepare params
      const params = {
        page,
        per_page: 10
      };
      
      // Add status filter if set
      if (statusFilter) {
        params.status = statusFilter;
      }
      
      // Add search query if provided
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      const response = await adminShelterAnakApi.getAllAnak(params);
      
      if (response.data.success) {
        const newData = response.data.data || [];
        
        // If refreshing or first page, replace data
        // Otherwise, append data
        if (refresh || page === 1) {
          setAnakList(newData);
          setFilteredAnakList(newData);
        } else {
          setAnakList(prev => [...prev, ...newData]);
          setFilteredAnakList(prev => [...prev, ...newData]);
        }
        
        // Set pagination info
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.current_page);
          setTotalPages(response.data.pagination.last_page);
        }
        
        // Set summary data if available
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
      } else {
        setError(response.data.message || 'Gagal memuat data');
      }
    } catch (err) {
      console.error('Error fetching anak:', err);
      setError('Gagal memuat data anak. Silakan coba lagi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAnakData();
  }, [statusFilter]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnakData(1, true);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (loadingMore || currentPage >= totalPages) return;
    
    setLoadingMore(true);
    fetchAnakData(currentPage + 1);
  };

  // Handle search
  const handleSearch = () => {
    // Reset to first page and fetch with search query
    setCurrentPage(1);
    fetchAnakData(1, true);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchAnakData(1, true);
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    // Fetch will be triggered by the useEffect
  };

  // Navigate to anak detail screen
  const handleViewAnak = (anakId) => {
    navigation.navigate('AnakDetail', { id: anakId });
  };

  // Navigate to add new anak screen
  const handleAddAnak = () => {
    navigation.navigate('AnakDetail', { isNew: true });
  };

  // Handle toggle status
  const handleToggleStatus = async (anak) => {
    try {
      setLoading(true);
      await adminShelterAnakApi.toggleAnakStatus(anak.id_anak);
      
      // Refresh data after updating
      handleRefresh();
      
      // Show success message
      Alert.alert(
        'Status Diperbarui',
        `Status anak berhasil diubah menjadi ${anak.status_validasi === 'aktif' ? 'non-aktif' : 'aktif'}`
      );
    } catch (err) {
      console.error('Error toggling status:', err);
      Alert.alert('Error', 'Gagal memperbarui status');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete anak
  const handleDeleteAnak = (anak) => {
    Alert.alert(
      'Hapus Anak',
      `Anda yakin ingin menghapus ${anak.full_name || anak.nick_name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await adminShelterAnakApi.deleteAnak(anak.id_anak);
              
              // Refresh data after deleting
              handleRefresh();
              
              Alert.alert('Sukses', 'Anak berhasil dihapus');
            } catch (err) {
              console.error('Error deleting anak:', err);
              Alert.alert('Error', 'Gagal menghapus anak');
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
  };

  // Render anak item
  const renderAnakItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.anakCard}
      onPress={() => handleViewAnak(item.id_anak)}
    >
      <View style={styles.anakImageContainer}>
        {item.foto_url ? (
          <Image
            source={{ uri: item.foto_url }}
            style={styles.anakImage}
          />
        ) : (
          <View style={styles.anakImagePlaceholder}>
            <Ionicons name="person" size={36} color="#ffffff" />
          </View>
        )}
      </View>
      
      <View style={styles.anakInfo}>
        <Text style={styles.anakName}>{item.full_name || item.nick_name}</Text>
        {item.nick_name && item.full_name && (
          <Text style={styles.anakNickname}>{item.nick_name}</Text>
        )}
        <View style={styles.anakDetailsRow}>
          <View style={styles.anakDetail}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.anakDetailText}>
              {calculateAge(item.tanggal_lahir)}
            </Text>
          </View>
          <View style={styles.anakDetail}>
            <Ionicons name="bookmark-outline" size={16} color="#666" />
            <Text style={styles.anakDetailText}>
              {getStatusLabel(item.status_cpb)}
            </Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status_validasi === 'aktif' ? '#2ecc71' : '#e74c3c' }
          ]}>
            <Text style={styles.statusText}>{item.status_validasi === 'aktif' ? 'Aktif' : 'Non-Aktif'}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.toggleButton]}
          onPress={() => handleToggleStatus(item)}
        >
          <Ionicons 
            name={item.status_validasi === 'aktif' ? "close-circle-outline" : "checkmark-circle-outline"} 
            size={24} 
            color={item.status_validasi === 'aktif' ? "#e74c3c" : "#2ecc71"} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteAnak(item)}
        >
          <Ionicons name="trash-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
  if (loading && !refreshing && !loadingMore) {
    return <LoadingSpinner fullScreen message="Memuat data anak..." />;
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
            placeholder="Cari anak..."
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
          onPress={handleAddAnak}
          style={styles.addButton}
        />
      </View>
      
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            statusFilter === '' && styles.filterButtonActive
          ]}
          onPress={() => handleStatusFilter('')}
        >
          <Text style={[
            styles.filterButtonText,
            statusFilter === '' && styles.filterButtonTextActive
          ]}>
            Semua ({summary.total || 0})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            statusFilter === 'aktif' && styles.filterButtonActive
          ]}
          onPress={() => handleStatusFilter('aktif')}
        >
          <Text style={[
            styles.filterButtonText,
            statusFilter === 'aktif' && styles.filterButtonTextActive
          ]}>
            Aktif ({summary.anak_aktif || 0})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            statusFilter === 'non-aktif' && styles.filterButtonActive
          ]}
          onPress={() => handleStatusFilter('non-aktif')}
        >
          <Text style={[
            styles.filterButtonText,
            statusFilter === 'non-aktif' && styles.filterButtonTextActive
          ]}>
            Non-Aktif ({summary.anak_tidak_aktif || 0})
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Children List */}
      {anakList.length > 0 ? (
        <FlatList
          data={anakList}
          renderItem={renderAnakItem}
          keyExtractor={(item) => item.id_anak?.toString()}
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
              <Text style={styles.emptyText}>Tidak ada anak ditemukan dengan "{searchQuery}"</Text>
              <Button 
                title="Hapus Pencarian" 
                onPress={clearSearch} 
                type="outline"
                style={styles.emptyButton}
              />
            </>
          ) : (
            <>
              <Ionicons name="people" size={60} color="#cccccc" />
              <Text style={styles.emptyText}>Belum ada anak terdaftar</Text>
              <Button 
                title="Tambah Anak Pertama" 
                onPress={handleAddAnak} 
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
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  filterButtonActive: {
    backgroundColor: '#e74c3c',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  anakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  anakImageContainer: {
    marginRight: 16,
  },
  anakImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  anakImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  anakInfo: {
    flex: 1,
  },
  anakName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  anakNickname: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  anakDetailsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  anakDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  anakDetailText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 60,
  },
  actionButton: {
    padding: 6,
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

export default AnakManagementScreen;