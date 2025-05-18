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

// Components
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Let's use a more direct approach - import from a model we know exists
import { adminShelterApi } from '../api/adminShelterApi';

const AttendanceScreen = () => {
  const navigation = useNavigation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch activities on component mount
  useEffect(() => {
    fetchAktivitas();
  }, []);

  // Fetch activities directly (simpler approach)
  const fetchAktivitas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Using adminShelterApi to get dashboard data which might include recent activities
      const response = await adminShelterApi.getDashboard();
      
      // Extract activities from dashboard data if available
      if (response.data?.data?.recent_activities) {
        setActivities(response.data.data.recent_activities);
      } else {
        // If no recent activities in dashboard, use demo data
        useDemoData();
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Failed to load activities. Using demo data instead.');
      useDemoData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Use demo data when API fails
  const useDemoData = () => {
    setActivities([
      {
        id_aktivitas: '1',
        jenis_kegiatan: 'Belajar Bersama',
        tanggal: '2025-05-17',
        materi: 'Matematika'
      },
      {
        id_aktivitas: '2',
        jenis_kegiatan: 'Kegiatan Rohani',
        tanggal: '2025-05-17',
        materi: 'Mengaji'
      }
    ]);
    if (error) {
      setError('Using demo data (API endpoint not found)');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchAktivitas();
  };

  // Navigate to attendance detail screen
  const navigateToAttendanceList = (activity) => {
    navigation.navigate('AttendanceList', {
      id_aktivitas: activity.id_aktivitas,
      activityName: activity.jenis_kegiatan,
      activityDate: activity.tanggal
    });
  };

  // Navigate to QR scanner screen
  const navigateToQrScanner = () => {
    // Check if there are activities first
    if (activities.length === 0) {
      Alert.alert(
        'No Activities',
        'There are no activities available for attendance. Please create an activity first.',
        [{ text: 'OK' }]
      );
      return;
    }

    // If multiple activities, show picker
    if (activities.length > 1) {
      // Show activity picker alert
      let options = activities.map(a => ({ 
        text: `${a.jenis_kegiatan} (${a.tanggal})`, 
        onPress: () => navigation.navigate('QrScanner', {
          id_aktivitas: a.id_aktivitas,
          activityName: a.jenis_kegiatan,
          activityDate: a.tanggal
        })
      }));

      // Add cancel option
      options.push({ text: 'Cancel', style: 'cancel' });

      Alert.alert(
        'Select Activity',
        'Choose an activity for attendance:',
        options
      );
    } else {
      // If only one activity, navigate directly
      const activity = activities[0];
      navigation.navigate('QrScanner', {
        id_aktivitas: activity.id_aktivitas,
        activityName: activity.jenis_kegiatan,
        activityDate: activity.tanggal
      });
    }
  };

  // Navigate to manual attendance screen
  const navigateToManualAttendance = () => {
    // Similar logic as QR scanner
    if (activities.length === 0) {
      Alert.alert(
        'No Activities',
        'There are no activities available for attendance. Please create an activity first.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (activities.length > 1) {
      let options = activities.map(a => ({ 
        text: `${a.jenis_kegiatan} (${a.tanggal})`, 
        onPress: () => navigation.navigate('ManualAttendance', {
          id_aktivitas: a.id_aktivitas,
          activityName: a.jenis_kegiatan,
          activityDate: a.tanggal
        })
      }));

      options.push({ text: 'Cancel', style: 'cancel' });

      Alert.alert(
        'Select Activity',
        'Choose an activity for attendance:',
        options
      );
    } else {
      const activity = activities[0];
      navigation.navigate('ManualAttendance', {
        id_aktivitas: activity.id_aktivitas,
        activityName: activity.jenis_kegiatan,
        activityDate: activity.tanggal
      });
    }
  };

  // Navigate to reports
  const navigateToReports = () => {
    navigation.navigate('AttendanceReport');
  };

  // Render an activity item
  const renderActivityItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.activityItem}
      onPress={() => navigateToAttendanceList(item)}
    >
      <View style={styles.activityIcon}>
        <Ionicons name="calendar" size={24} color="#3498db" />
      </View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityName}>{item.jenis_kegiatan}</Text>
        <Text style={styles.activityDate}>{item.tanggal}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#bdc3c7" />
    </TouchableOpacity>
  );

  // Show loading spinner
  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Loading attendance records..." />;
  }

  return (
    <View style={styles.container}>
      {/* Show demo data notice if using fallback */}
      {error && (
        <View style={styles.demoNotice}>
          <Ionicons name="information-circle" size={20} color="#fff" />
          <Text style={styles.demoNoticeText}>{error}</Text>
        </View>
      )}

      {/* Activities List */}
      <FlatList
        data={activities}
        renderItem={renderActivityItem}
        keyExtractor={(item, index) => item.id_aktivitas?.toString() || index.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyText}>No activities found</Text>
            <Text style={styles.emptySubText}>Create an activity to start recording attendance</Text>
          </View>
        }
      />

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.qrButton]}
          onPress={navigateToQrScanner}
        >
          <Ionicons name="qr-code" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>QR Scan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.manualButton]}
          onPress={navigateToManualAttendance}
        >
          <Ionicons name="create" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Manual Entry</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.reportButton]}
          onPress={navigateToReports}
        >
          <Ionicons name="bar-chart" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Reports</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f39c12',
    padding: 10,
    paddingHorizontal: 16,
  },
  demoNoticeText: {
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for action buttons
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 8,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  qrButton: {
    backgroundColor: '#3498db',
  },
  manualButton: {
    backgroundColor: '#9b59b6',
  },
  reportButton: {
    backgroundColor: '#2ecc71',
  },
  actionButtonText: {
    color: '#fff',
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
  }
});

export default AttendanceScreen;

