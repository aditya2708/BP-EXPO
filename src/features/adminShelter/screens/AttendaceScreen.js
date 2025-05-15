import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Button from '../../../common/components/Button';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Import API
import { adminShelterApi } from '../api/adminShelterApi';

const AttendanceScreen = () => {
  const navigation = useNavigation();
  const [children, setChildren] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setError(null);
      
      // Fetch children and today's attendance in parallel
      const [childrenResponse, attendanceResponse] = await Promise.all([
        adminShelterApi.getChildren(),
        adminShelterApi.getTodayAttendance()
      ]);
      
      // Process children data
      setChildren(childrenResponse.data.data || []);
      
      // Process attendance data into a map for easy lookup
      const attendanceMap = {};
      const attendanceData = attendanceResponse.data.data || [];
      
      attendanceData.forEach(attendance => {
        attendanceMap[attendance.id_anak] = attendance.status;
      });
      
      setTodayAttendance(attendanceMap);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Mark child as present
  const markPresent = async (childId) => {
    try {
      setSubmitting(true);
      await adminShelterApi.markPresent(childId);
      
      // Update local state
      setTodayAttendance(prev => ({
        ...prev,
        [childId]: true
      }));
      
      Alert.alert('Success', 'Child marked as present');
    } catch (err) {
      console.error('Error marking present:', err);
      Alert.alert('Error', 'Failed to mark child as present');
    } finally {
      setSubmitting(false);
    }
  };

  // Mark child as absent
  const markAbsent = async (childId) => {
    try {
      setSubmitting(true);
      await adminShelterApi.markAbsent(childId);
      
      // Update local state
      setTodayAttendance(prev => ({
        ...prev,
        [childId]: false
      }));
      
      Alert.alert('Success', 'Child marked as absent');
    } catch (err) {
      console.error('Error marking absent:', err);
      Alert.alert('Error', 'Failed to mark child as absent');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle attendance action
  const handleAttendanceAction = (childId, status) => {
    if (submitting) return;
    
    if (status) {
      markPresent(childId);
    } else {
      markAbsent(childId);
    }
  };

  // Confirm before marking multiple children
  const confirmMarkAll = (status) => {
    Alert.alert(
      status ? 'Mark All Present' : 'Mark All Absent',
      `Are you sure you want to mark all children as ${status ? 'present' : 'absent'}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => markAllChildren(status),
        },
      ],
      { cancelable: true }
    );
  };

  // Mark all children with the same status
  const markAllChildren = async (status) => {
    try {
      setSubmitting(true);
      
      // Create a new object for all children's attendance
      const newAttendance = {};
      
      // Process each child
      for (const child of children) {
        try {
          if (status) {
            await adminShelterApi.markPresent(child.id_anak);
          } else {
            await adminShelterApi.markAbsent(child.id_anak);
          }
          newAttendance[child.id_anak] = status;
        } catch (err) {
          console.error(`Error marking child ${child.id_anak}:`, err);
          // Continue with the next child even if one fails
        }
      }
      
      // Update state with new attendance data
      setTodayAttendance(prev => ({
        ...prev,
        ...newAttendance
      }));
      
      Alert.alert('Success', `All children marked as ${status ? 'present' : 'absent'}`);
    } catch (err) {
      console.error('Error marking all children:', err);
      Alert.alert('Error', 'Some children could not be updated');
    } finally {
      setSubmitting(false);
    }
  };

  // Render child item
  const renderChildItem = ({ item }) => {
    const attendanceStatus = todayAttendance[item.id_anak];
    const isMarked = attendanceStatus !== undefined;
    
    return (
      <View style={styles.childItem}>
        <View style={styles.childInfo}>
          {/* Child Avatar */}
          {item.foto ? (
            <Image
              source={{ uri: `https://berbagipendidikan.org/storage/Children/${item.id_anak}/${item.foto}` }}
              style={styles.childAvatar}
            />
          ) : (
            <View style={styles.childAvatarPlaceholder}>
              <Ionicons name="person" size={24} color="#ffffff" />
            </View>
          )}
          
          {/* Child Details */}
          <View style={styles.childDetails}>
            <Text style={styles.childName}>{item.nama_lengkap}</Text>
            <Text style={styles.childInfo}>
              {item.umur ? `${item.umur} years old` : 'Age unknown'}
            </Text>
          </View>
        </View>
        
        {/* Attendance Actions */}
        <View style={styles.attendanceActions}>
          {/* Present Button */}
          <TouchableOpacity
            style={[
              styles.attendanceButton,
              styles.presentButton,
              isMarked && attendanceStatus && styles.activeButton
            ]}
            onPress={() => handleAttendanceAction(item.id_anak, true)}
            disabled={submitting}
          >
            <Ionicons 
              name={isMarked && attendanceStatus ? "checkmark" : "checkmark-outline"} 
              size={20} 
              color="#ffffff" 
            />
          </TouchableOpacity>
          
          {/* Absent Button */}
          <TouchableOpacity
            style={[
              styles.attendanceButton,
              styles.absentButton,
              isMarked && !attendanceStatus && styles.activeButton
            ]}
            onPress={() => handleAttendanceAction(item.id_anak, false)}
            disabled={submitting}
          >
            <Ionicons 
              name={isMarked && !attendanceStatus ? "close" : "close-outline"} 
              size={20} 
              color="#ffffff" 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Loading state
  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Loading attendance data..." />;
  }

  return (
    <View style={styles.container}>
      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchData}
        />
      )}
      
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        
        {/* Mark All Buttons */}
        <View style={styles.markAllContainer}>
          <Button 
            title="Mark All Present" 
            onPress={() => confirmMarkAll(true)} 
            size="small"
            type="success"
            style={styles.markAllButton}
            disabled={submitting}
          />
          <Button 
            title="Mark All Absent" 
            onPress={() => confirmMarkAll(false)} 
            size="small"
            type="danger"
            style={styles.markAllButton}
            disabled={submitting}
          />
        </View>
      </View>
      
      {/* Children List */}
      {children.length > 0 ? (
        <FlatList
          data={children}
          renderItem={renderChildItem}
          keyExtractor={(item) => item.id_anak.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No children found</Text>
          <Button 
            title="Refresh" 
            onPress={handleRefresh} 
            type="outline"
            style={styles.refreshButton}
          />
        </View>
      )}
      
      {/* Loading Overlay */}
      {submitting && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner message="Updating attendance..." />
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
  headerContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  markAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  markAllButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  listContent: {
    padding: 16,
  },
  childItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  childAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  childAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  childDetails: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  childInfo: {
    fontSize: 14,
    color: '#666666',
  },
  attendanceActions: {
    flexDirection: 'row',
  },
  attendanceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  presentButton: {
    backgroundColor: '#2ecc71',
  },
  absentButton: {
    backgroundColor: '#e74c3c',
  },
  activeButton: {
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999999',
    marginVertical: 16,
  },
  refreshButton: {
    marginTop: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

export default AttendanceScreen;