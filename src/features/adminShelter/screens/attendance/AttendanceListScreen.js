import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Components
import AttendanceCard from '../../components/AttendanceCard';
import LoadingSpinner from '../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../common/components/ErrorMessage';

// Redux actions and selectors
import {
  getAttendanceByActivity,
  manualVerify,
  rejectVerification,
  selectActivityAttendance,
  selectAttendanceLoading,
  selectAttendanceError,
  resetAttendanceError
} from '../../redux/attendanceSlice';

/**
 * AttendanceListScreen
 * Displays attendance records for an activity
 */
const AttendanceListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  
  // Get activity ID from route params
  const { id_aktivitas, activityName, activityDate } = route.params || {};
  
  // Redux state
  const attendanceRecords = useSelector(state => selectActivityAttendance(state, id_aktivitas));
  const loading = useSelector(selectAttendanceLoading);
  const error = useSelector(selectAttendanceError);
  
  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, verified, pending, rejected
  
  // Fetch attendance records on mount
  useEffect(() => {
    if (id_aktivitas) {
      fetchAttendanceRecords();
    }
    
    return () => {
      dispatch(resetAttendanceError());
    };
  }, [id_aktivitas, dispatch]);
  
  // Fetch attendance records
  const fetchAttendanceRecords = async () => {
    if (!id_aktivitas) return;
    
    try {
      await dispatch(getAttendanceByActivity({ id_aktivitas })).unwrap();
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setRefreshing(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchAttendanceRecords();
  };
  
  // Filter records based on search query and status filter
  const filteredRecords = attendanceRecords.filter(record => {
    const studentName = record.absen_user?.anak?.name || '';
    const matchesSearch = studentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === 'verified') {
      matchesFilter = record.is_verified;
    } else if (filterStatus === 'pending') {
      matchesFilter = !record.is_verified && record.verification_status === 'pending';
    } else if (filterStatus === 'rejected') {
      matchesFilter = record.verification_status === 'rejected';
    }
    
    return matchesSearch && matchesFilter;
  });
  
  // Get stats for filter buttons
  const getFilterCounts = () => {
    const verified = attendanceRecords.filter(r => r.is_verified).length;
    const pending = attendanceRecords.filter(r => !r.is_verified && r.verification_status === 'pending').length;
    const rejected = attendanceRecords.filter(r => r.verification_status === 'rejected').length;
    
    return { verified, pending, rejected, all: attendanceRecords.length };
  };
  
  const counts = getFilterCounts();
  
  // Handle manual verification
  const handleVerify = (id_absen) => {
    Alert.prompt(
      'Manual Verification',
      'Enter verification notes:',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Verify',
          onPress: (notes) => {
            if (!notes) {
              Alert.alert('Error', 'Verification notes are required');
              return;
            }
            
            dispatch(manualVerify({ id_absen, notes }))
              .unwrap()
              .then(() => {
                Alert.alert('Success', 'Attendance manually verified');
              })
              .catch((err) => {
                Alert.alert('Error', err.message || 'Failed to verify attendance');
              });
          }
        }
      ],
      'plain-text'
    );
  };
  
  // Handle verification rejection
  const handleReject = (id_absen) => {
    Alert.prompt(
      'Reject Verification',
      'Enter reason for rejection:',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reject',
          onPress: (reason) => {
            if (!reason) {
              Alert.alert('Error', 'Rejection reason is required');
              return;
            }
            
            dispatch(rejectVerification({ id_absen, reason }))
              .unwrap()
              .then(() => {
                Alert.alert('Success', 'Attendance verification rejected');
              })
              .catch((err) => {
                Alert.alert('Error', err.message || 'Failed to reject verification');
              });
          }
        }
      ],
      'plain-text'
    );
  };
  
  // Navigate to QR scanner
  const navigateToScanner = () => {
    navigation.navigate('QrScanner', {
      id_aktivitas,
      activityName,
      activityDate
    });
  };
  
  // Navigate to manual attendance entry
  const navigateToManualEntry = () => {
    navigation.navigate('ManualAttendance', {
      id_aktivitas,
      activityName,
      activityDate
    });
  };
  
  // Render an attendance card
  const renderAttendanceCard = ({ item }) => (
    <AttendanceCard
      attendance={item}
      onPress={() => setExpandedCardId(expandedCardId === item.id_absen ? null : item.id_absen)}
      onVerify={handleVerify}
      onReject={handleReject}
      expanded={expandedCardId === item.id_absen}
    />
  );
  
  // Render empty list message
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={64} color="#bdc3c7" />
      <Text style={styles.emptyText}>No attendance records found</Text>
      <Text style={styles.emptySubText}>
        {searchQuery 
          ? 'Try changing your search or filters' 
          : 'Tap the + button to record attendance'}
      </Text>
    </View>
  );
  
  // Render error message
  if (error && !refreshing) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          message={error}
          onRetry={fetchAttendanceRecords}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Activity Info Header */}
      <View style={styles.activityHeader}>
        <Text style={styles.activityName}>{activityName || 'Activity'}</Text>
        <Text style={styles.activityDate}>{activityDate || 'Date not specified'}</Text>
      </View>
      
      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#7f8c8d" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
      </View>
      
      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterStatus === 'all' && styles.activeFilterTab
          ]}
          onPress={() => setFilterStatus('all')}
        >
          <Text style={[
            styles.filterTabText,
            filterStatus === 'all' && styles.activeFilterTabText
          ]}>
            All ({counts.all})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterStatus === 'verified' && styles.activeFilterTab
          ]}
          onPress={() => setFilterStatus('verified')}
        >
          <Text style={[
            styles.filterTabText,
            filterStatus === 'verified' && styles.activeFilterTabText
          ]}>
            Verified ({counts.verified})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterStatus === 'pending' && styles.activeFilterTab
          ]}
          onPress={() => setFilterStatus('pending')}
        >
          <Text style={[
            styles.filterTabText,
            filterStatus === 'pending' && styles.activeFilterTabText
          ]}>
            Pending ({counts.pending})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterStatus === 'rejected' && styles.activeFilterTab
          ]}
          onPress={() => setFilterStatus('rejected')}
        >
          <Text style={[
            styles.filterTabText,
            filterStatus === 'rejected' && styles.activeFilterTabText
          ]}>
            Rejected ({counts.rejected})
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Attendance List */}
      <FlatList
        data={filteredRecords}
        renderItem={renderAttendanceCard}
        keyExtractor={item => item.id_absen.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3498db']}
          />
        }
      />
      
      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, styles.secondaryFab]}
          onPress={navigateToManualEntry}
        >
          <Ionicons name="create" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.fab}
          onPress={navigateToScanner}
        >
          <Ionicons name="qr-code" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Loading Indicator */}
      {loading && !refreshing && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner />
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
  activityHeader: {
    backgroundColor: '#3498db',
    padding: 16,
    alignItems: 'center',
  },
  activityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  activityDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  searchContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  filterTabText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  activeFilterTabText: {
    color: '#3498db',
    fontWeight: '500',
  },
  listContainer: {
    padding: 12,
    paddingBottom: 80, // Make room for FAB
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
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
  },
  fab: {
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
  },
  secondaryFab: {
    backgroundColor: '#9b59b6',
    marginRight: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AttendanceListScreen;