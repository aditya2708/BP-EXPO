import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Components
import ActivityCard from '../../components/ActivityCard';
import LoadingSpinner from '../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../common/components/ErrorMessage';

// Redux
import {
  fetchAllAktivitas,
  deleteAktivitas,
  selectAktivitasList,
  selectAktivitasLoading,
  selectAktivitasError,
  resetAktivitasError
} from '../../redux/aktivitasSlice';

const ActivitiesListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Redux state
  const activities = useSelector(selectAktivitasList);
  const loading = useSelector(selectAktivitasLoading);
  const error = useSelector(selectAktivitasError);
  
  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'bimbel', 'kegiatan'
  
  // Load activities on mount
  useEffect(() => {
    fetchActivities();
    
    return () => {
      dispatch(resetAktivitasError());
    };
  }, [dispatch]);
  
  // Fetch activities data
  const fetchActivities = async () => {
    const params = {};
    
    if (searchQuery) {
      params.search = searchQuery;
    }
    
    if (filterType !== 'all') {
      params.jenis_kegiatan = filterType;
    }
    
    try {
      await dispatch(fetchAllAktivitas(params)).unwrap();
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    } finally {
      setRefreshing(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };
  
  // Handle search
  const handleSearch = () => {
    fetchActivities();
  };
  
  // Handle type filter
// Handle type filter
const handleFilterChange = (type) => {
  setFilterType(type);
  
  const params = {};
  
  if (searchQuery) {
    params.search = searchQuery;
  }
  
  // Perbaikan untuk filter Kegiatan
  if (type !== 'all') {
    if (type === 'Kegiatan') {
      // Tambahkan log untuk debug
      console.log('Filtering by Kegiatan');
      params.jenis_kegiatan_not = 'Bimbel'; // Parameter untuk mengecualikan Bimbel
    } else {
      params.jenis_kegiatan = type;
    }
  }
  
  console.log('Filter params:', params); // Untuk debugging
  
  dispatch(fetchAllAktivitas(params))
    .unwrap()
    .catch(err => console.error('Failed to fetch activities:', err))
    .finally(() => setRefreshing(false));
};
  
  // Handle activity selection
  const handleSelectActivity = (activity) => {
    navigation.navigate('ActivityDetail', { 
      id_aktivitas: activity.id_aktivitas
    });
  };
  
  // Handle create new activity
  const handleCreateActivity = () => {
    navigation.navigate('ActivityForm');
  };
  
  // Handle edit activity
  const handleEditActivity = (activity) => {
    navigation.navigate('ActivityForm', { activity });
  };
  
  // Handle delete activity
  const handleDeleteActivity = (id) => {
    Alert.alert(
      'Delete Activity',
      'Are you sure you want to delete this activity? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteAktivitas(id)).unwrap();
              Alert.alert('Success', 'Activity deleted successfully');
            } catch (err) {
              Alert.alert('Error', err || 'Failed to delete activity');
            }
          }
        }
      ]
    );
  };
  
  // Render activity item
  const renderActivityItem = ({ item }) => (
    <ActivityCard
      activity={item}
      onPress={() => handleSelectActivity(item)}
      onEdit={() => handleEditActivity(item)}
      onDelete={() => handleDeleteActivity(item.id_aktivitas)}
    />
  );
  
  // Render empty list
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={64} color="#bdc3c7" />
      <Text style={styles.emptyText}>No activities found</Text>
      <Text style={styles.emptySubText}>
        {searchQuery || filterType !== 'all' 
          ? 'Try changing your search or filters' 
          : 'Tap the + button to create an activity'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#7f8c8d" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search activities..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filterType === 'all' && styles.activeFilterTab
            ]}
            onPress={() => handleFilterChange('all')}
          >
            <Text style={[
              styles.filterTabText,
              filterType === 'all' && styles.activeFilterTabText
            ]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterTab,
              filterType === 'Bimbel' && styles.activeFilterTab
            ]}
            onPress={() => handleFilterChange('Bimbel')}
          >
            <Text style={[
              styles.filterTabText,
              filterType === 'Bimbel' && styles.activeFilterTabText
            ]}>
              Bimbel
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterTab,
              filterType === 'Kegiatan' && styles.activeFilterTab
            ]}
            onPress={() => handleFilterChange('Kegiatan')}
          >
            <Text style={[
              styles.filterTabText,
              filterType === 'Kegiatan' && styles.activeFilterTabText
            ]}>
              Kegiatan
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={fetchActivities}
          />
        )}
        
        {/* Activities List */}
        <FlatList
          data={activities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id_aktivitas.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#3498db']}
            />
          }
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={true}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
        
        {/* Create Activity Button */}
        <TouchableOpacity 
          style={styles.fab}
          onPress={handleCreateActivity}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
        
        {/* Loading Overlay */}
        {loading && !refreshing && (
          <LoadingSpinner fullScreen />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#3498db',
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    zIndex: 1,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  filterTabText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  activeFilterTabText: {
    color: '#3498db',
    fontWeight: '500',
  },
  listContainer: {
    padding: 12,
    paddingBottom: 100, // Extra padding for FAB
    flexGrow: 1, // Important for scrolling
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 2,
  },
});

export default ActivitiesListScreen;