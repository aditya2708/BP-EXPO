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
  Switch
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Button from '../../../common/components/Button';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Import API
import { adminShelterSurveyApi } from '../api/adminShelterSurveyApi';

const SurveyManagementScreen = () => {
  const navigation = useNavigation();
  
  // State
  const [surveyList, setSurveyList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch survey data
  const fetchSurveyData = async (page = 1, refresh = false) => {
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
        show_all: showAll
      };
      
      // Add search query if provided
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      // Fetch data
      const response = await adminShelterSurveyApi.getSurveys(params);
      
      if (response.data.success) {
        const newData = response.data.data || [];
        
        // If refreshing or first page, replace data
        // Otherwise, append data
        if (refresh || page === 1) {
          setSurveyList(newData);
        } else {
          setSurveyList(prev => [...prev, ...newData]);
        }
        
        // Set pagination info
        if (response.data.pagination) {
          console.log('Pagination data:', response.data.pagination);
          setCurrentPage(response.data.pagination.current_page || page);
          setTotalPages(response.data.pagination.last_page || 1);
          console.log(`Updated pagination: page ${response.data.pagination.current_page} of ${response.data.pagination.last_page}`);
        }
      } else {
        setError(response.data.message || 'Failed to load data');
      }
    } catch (err) {
      console.error('Error fetching survey data:', err);
      setError('Failed to load survey data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSurveyData();
  }, [showAll]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchSurveyData(1, true);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (loadingMore || currentPage >= totalPages) return;
    
    console.log(`Loading more data: page ${currentPage + 1} of ${totalPages}`);
    setLoadingMore(true);
    fetchSurveyData(currentPage + 1);
  };

  // Handle search
  const handleSearch = () => {
    // Reset to first page and fetch with search query
    setCurrentPage(1);
    fetchSurveyData(1, true);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchSurveyData(1, true);
  };

  // Toggle between showing all surveys or just pending ones
  const toggleShowAll = () => {
    setShowAll(prev => !prev);
  };

  // Navigate to survey detail/create screen
  const handleViewSurvey = (item) => {
    if (showAll) {
      // View existing survey
      navigation.navigate('SurveyDetail', { id_keluarga: item.id_keluarga || item.keluarga.id_keluarga });
    } else {
      // Create new survey
      navigation.navigate('SurveyForm', { keluarga: item });
    }
  };

  // Handle delete survey
  const handleDeleteSurvey = (survey) => {
    Alert.alert(
      'Delete Survey',
      'Are you sure you want to delete this survey? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              const id_keluarga = survey.id_keluarga || survey.keluarga.id_keluarga;
              await adminShelterSurveyApi.deleteSurvey(id_keluarga);
              
              // Refresh data after deleting
              handleRefresh();
              
              Alert.alert('Success', 'Survey has been deleted');
            } catch (err) {
              console.error('Error deleting survey:', err);
              Alert.alert('Error', 'Failed to delete survey');
            } finally {
              setLoading(false);
            }
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
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  // Render item based on mode (pending families or existing surveys)
  const renderItem = ({ item }) => {
    if (showAll) {
      // Render existing survey
      const survey = item;
      const keluargaData = survey.keluarga || {};
      
      return (
        <TouchableOpacity 
          style={styles.surveyItem}
          onPress={() => handleViewSurvey(survey)}
        >
          <View style={styles.surveyContent}>
            <View style={styles.surveyHeader}>
              <Text style={styles.keluargaName}>{keluargaData.kepala_keluarga || 'Unknown'}</Text>
              <View style={styles.surveyActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('SurveyForm', { 
                    id_keluarga: survey.id_keluarga || keluargaData.id_keluarga,
                    surveyData: survey
                  })}
                >
                  <Ionicons name="create-outline" size={18} color="#3498db" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteSurvey(survey)}
                >
                  <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.surveyDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>KK Number:</Text>
                <Text style={styles.detailValue}>{keluargaData.no_kk || '-'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={styles.detailValue}>{keluargaData.status_ortu || '-'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Result:</Text>
                <View style={[
                  styles.resultBadge,
                  survey.hasil_survey === 'Layak' && styles.resultLayak,
                  survey.hasil_survey === 'Tidak Layak' && styles.resultTidakLayak
                ]}>
                  <Text style={styles.resultText}>{survey.hasil_survey || 'Pending'}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      // Render family without survey
      const keluarga = item;
      
      return (
        <TouchableOpacity 
          style={styles.surveyItem}
          onPress={() => handleViewSurvey(keluarga)}
        >
          <View style={styles.surveyContent}>
            <View style={styles.surveyHeader}>
              <Text style={styles.keluargaName}>{keluarga.kepala_keluarga}</Text>
              <Ionicons name="add-circle-outline" size={22} color="#2ecc71" />
            </View>
            
            <View style={styles.surveyDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>KK Number:</Text>
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
            </View>
            
            <View style={styles.pendingSurvey}>
              <Ionicons name="alert-circle-outline" size={16} color="#e74c3c" />
              <Text style={styles.pendingText}>Needs survey</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  // Loading state
  if (loading && !refreshing && !loadingMore) {
    return <LoadingSpinner fullScreen message="Loading survey data..." />;
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
      
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by family head or KK..."
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
      </View>
      
      {/* Toggle View */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>
          {showAll ? 'Showing all surveys' : 'Showing families needing survey'}
        </Text>
        <Switch
          value={showAll}
          onValueChange={toggleShowAll}
          trackColor={{ false: '#cbd5e0', true: '#e74c3c' }}
          thumbColor="#ffffff"
        />
      </View>
      
      {/* Survey List */}
      {surveyList.length > 0 ? (
        <FlatList
          data={surveyList}
          renderItem={renderItem}
          keyExtractor={(item) => {
            if (showAll) {
              return (item.id_survey || item.id_keluarga || item.keluarga?.id_keluarga || '').toString();
            } else {
              return item.id_keluarga?.toString();
            }
          }}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      ) : (
        <View style={styles.emptyContainer}>
          {searchQuery.trim() !== '' ? (
            <>
              <Ionicons name="search" size={60} color="#cccccc" />
              <Text style={styles.emptyText}>No results found for "{searchQuery}"</Text>
              <Button 
                title="Clear Search" 
                onPress={clearSearch} 
                type="outline"
                style={styles.emptyButton}
              />
            </>
          ) : (
            <>
              <Ionicons name="clipboard-outline" size={60} color="#cccccc" />
              <Text style={styles.emptyText}>
                {showAll 
                  ? 'No surveys have been conducted yet' 
                  : 'All families have been surveyed'
                }
              </Text>
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
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  surveyItem: {
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
  surveyContent: {
    padding: 16,
  },
  surveyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  keluargaName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  surveyActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
  surveyDetails: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
  },
  detailLabel: {
    width: 90,
    fontSize: 14,
    color: '#777',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#9e9e9e',
  },
  resultLayak: {
    backgroundColor: '#2ecc71',
  },
  resultTidakLayak: {
    backgroundColor: '#e74c3c',
  },
  resultText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  pendingSurvey: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 14,
    color: '#e74c3c',
    marginLeft: 6,
    fontWeight: '500',
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
});

export default SurveyManagementScreen;