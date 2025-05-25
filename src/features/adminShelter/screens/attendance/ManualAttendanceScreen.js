import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import NetInfo from '@react-native-community/netinfo';

// Components
import LoadingSpinner from '../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../common/components/ErrorMessage';

// API Services
import { adminShelterAnakApi } from '../../api/adminShelterAnakApi';
import { adminShelterKelompokApi } from '../../api/adminShelterKelompokApi';
import { aktivitasApi } from '../../api/aktivitasApi';

// Redux
import {
  recordAttendanceManually,
  selectAttendanceLoading,
  selectAttendanceError,
  selectDuplicateError,
  resetAttendanceError
} from '../../redux/attendanceSlice';

// Utils
import OfflineSync from '../../utils/offlineSync';

const ManualAttendanceScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  
  // Get activity data from route params
  const { 
    id_aktivitas, 
    activityName, 
    activityDate, 
    kelompokId, 
    kelompokName,
    activityType 
  } = route.params || {};
  
  // Redux state
  const loading = useSelector(selectAttendanceLoading);
  const error = useSelector(selectAttendanceError);
  const duplicateError = useSelector(selectDuplicateError);
  
  // Local state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notes, setNotes] = useState('');
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentError, setStudentError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isBimbelActivity, setIsBimbelActivity] = useState(activityType === 'Bimbel');
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  
  // Activity details state
  const [activityDetails, setActivityDetails] = useState(null);
  const [loadingActivityDetails, setLoadingActivityDetails] = useState(false);
  const [expectedStatus, setExpectedStatus] = useState('present');
  
  // Time arrival state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(new Date());
  
  // Check network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Determine activity type when component mounts
  useEffect(() => {
    setIsBimbelActivity(activityType === 'Bimbel');
    
    // Fetch activity details to get schedule information
    fetchActivityDetails();
  }, [activityType, id_aktivitas]);
  
  // Fetch students based on activity type and kelompok
  useEffect(() => {
    if (isBimbelActivity && kelompokId) {
      fetchStudentsByKelompok(kelompokId);
    } else {
      fetchAllStudents();
    }
  }, [isBimbelActivity, kelompokId]);
  
  // Watch for duplicate errors
  useEffect(() => {
    if (duplicateError) {
      setShowDuplicateAlert(true);
    }
    
    return () => {
      dispatch(resetAttendanceError());
    };
  }, [duplicateError, dispatch]);
  
  // Update expected status when arrival time changes
  useEffect(() => {
    updateExpectedStatus();
  }, [arrivalTime, activityDetails]);
  
  // Fetch activity details to get schedule info
  const fetchActivityDetails = async () => {
    if (!id_aktivitas) return;
    
    setLoadingActivityDetails(true);
    
    try {
      const response = await aktivitasApi.getAktivitasDetail(id_aktivitas);
      if (response.data && response.data.data) {
        setActivityDetails(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch activity details:', err);
    } finally {
      setLoadingActivityDetails(false);
    }
  };
  
  // Determine the expected status based on current time and activity schedule
  const updateExpectedStatus = () => {
    if (!activityDetails || !arrivalTime) {
      return;
    }
    
    let status = 'present';
    
    // If activity has end time and arrival is after that, mark as absent
    if (activityDetails.end_time) {
      const activityDate = new Date(activityDetails.tanggal);
      const endTimeStr = activityDetails.end_time;
      
      // Parse end time if it's a string
      if (typeof endTimeStr === 'string') {
        const [hours, minutes] = endTimeStr.split(':');
        const endTime = new Date(activityDate);
        endTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        
        if (arrivalTime > endTime) {
          status = 'absent';
        }
      }
    }
    
    // If not absent, check if late based on late threshold
    if (status !== 'absent' && activityDetails.start_time) {
      const activityDate = new Date(activityDetails.tanggal);
      const startTimeStr = activityDetails.start_time;
      
      // Parse start time if it's a string
      if (typeof startTimeStr === 'string') {
        const [hours, minutes] = startTimeStr.split(':');
        const startTime = new Date(activityDate);
        startTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        
        // Check if late threshold is defined
        if (activityDetails.late_threshold) {
          const lateThresholdStr = activityDetails.late_threshold;
          const [lateHours, lateMinutes] = lateThresholdStr.split(':');
          const lateThreshold = new Date(activityDate);
          lateThreshold.setHours(parseInt(lateHours, 10), parseInt(lateMinutes, 10));
          
          if (arrivalTime > lateThreshold) {
            status = 'late';
          }
        } else if (activityDetails.late_minutes_threshold) {
          // Use minutes-based threshold
          const lateThreshold = new Date(startTime);
          lateThreshold.setMinutes(lateThreshold.getMinutes() + activityDetails.late_minutes_threshold);
          
          if (arrivalTime > lateThreshold) {
            status = 'late';
          }
        }
      }
    }
    
    setExpectedStatus(status);
  };
  
  // Fetch all students from API
 const fetchAllStudents = async () => {
  setLoadingStudents(true);
  setStudentError(null);
  
  try {
    // Initialize an empty array for all students
    let allStudents = [];
    let currentPage = 1;
    let lastPage = 1;
    
    // First request to get initial data and pagination info
    const initialResponse = await adminShelterAnakApi.getAllAnak({ page: 1 });
    
    if (initialResponse.data && initialResponse.data.pagination) {
      lastPage = initialResponse.data.pagination.last_page;
      allStudents = [...initialResponse.data.data];
      
      // Fetch remaining pages if any
      if (lastPage > 1) {
        for (let page = 2; page <= lastPage; page++) {
          const pageResponse = await adminShelterAnakApi.getAllAnak({ page });
          if (pageResponse.data && pageResponse.data.data) {
            allStudents = [...allStudents, ...pageResponse.data.data];
          }
        }
      }
      
      // Filter for active students
      const activeStudents = allStudents.filter(
        student => student.status_validasi === 'aktif'
      );
      
      setStudents(activeStudents);
    } else {
      // Fallback: try with high per_page to get all data at once
      const fallbackResponse = await adminShelterAnakApi.getAllAnak({ per_page: 1000 });
      if (fallbackResponse.data && fallbackResponse.data.data) {
        const activeStudents = fallbackResponse.data.data.filter(
          student => student.status_validasi === 'aktif'
        );
        setStudents(activeStudents);
      } else {
        setStudents([]);
      }
    }
  } catch (err) {
    console.error('Failed to fetch students:', err);
    setStudentError('Failed to load students. Please try again.');
  } finally {
    setLoadingStudents(false);
  }
};
  
  // Fetch students for a specific kelompok
  const fetchStudentsByKelompok = async (kelompokId) => {
    setLoadingStudents(true);
    setStudentError(null);
    
    try {
      const response = await adminShelterKelompokApi.getGroupChildren(kelompokId);
      if (response.data && response.data.data) {
        // Filter for active students
        const activeStudents = response.data.data.filter(
          student => student.status_validasi === 'aktif'
        );
        setStudents(activeStudents);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Failed to fetch students by kelompok:', err);
      setStudentError('Failed to load students from this group. Using all students instead.');
      
      // Fallback to all students if kelompok fetch fails
      fetchAllStudents();
    } finally {
      setLoadingStudents(false);
    }
  };
  
  // Handle time change
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setArrivalTime(selectedTime);
    }
  };
  
  // Filter students by search query
  const filteredStudents = students.filter(student => 
    (student.full_name || student.nick_name || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  
  // Handle student selection
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
  };
  
  // Render student item
  const renderStudentItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.studentItem,
        selectedStudent?.id_anak === item.id_anak && styles.selectedStudentItem
      ]}
      onPress={() => handleSelectStudent(item)}
    >
      <View style={styles.studentAvatar}>
        <Ionicons name="person" size={24} color="#95a5a6" />
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>
          {item.full_name || item.nick_name || `Student ${item.id_anak}`}
        </Text>
        {item.id_anak && (
          <Text style={styles.studentId}>ID: {item.id_anak}</Text>
        )}
      </View>
      {selectedStudent?.id_anak === item.id_anak && (
        <Ionicons name="checkmark-circle" size={24} color="#3498db" />
      )}
    </TouchableOpacity>
  );
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedStudent) {
      Alert.alert('Error', 'Please select a student');
      return;
    }
    
    if (!id_aktivitas) {
      Alert.alert('Error', 'Activity not specified');
      return;
    }
    
    if (!notes) {
      Alert.alert('Error', 'Please provide verification notes');
      return;
    }
    
    const formattedArrivalTime = format(arrivalTime, 'yyyy-MM-dd HH:mm:ss');
    
    const attendanceData = {
      id_anak: selectedStudent.id_anak,
      id_aktivitas,
      status: null, // Send null to let the backend auto-determine the status
      notes,
      arrival_time: formattedArrivalTime
    };
    
    try {
      // If online, use Redux
      if (isConnected) {
        await dispatch(recordAttendanceManually(attendanceData)).unwrap();
        Alert.alert(
          'Success', 
          'Attendance recorded successfully',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } 
      // If offline, use offline sync
      else {
        const result = await OfflineSync.processAttendance(attendanceData, 'manual');
        Alert.alert(
          'Offline Mode', 
          result.message || 'Attendance saved for syncing when online',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (err) {
      // Duplicate errors are handled by the useEffect watching duplicateError
      if (!err.isDuplicate) {
        Alert.alert('Error', err.message || 'Failed to record attendance');
      }
    }
  };
  
  // Handle closing duplicate alert
  const handleCloseDuplicateAlert = () => {
    setShowDuplicateAlert(false);
    dispatch(resetAttendanceError());
  };

  // Get status color for the expected status indicator
  const getStatusColor = (status) => {
    switch (status) {
      case 'absent':
        return '#e74c3c';
      case 'late':
        return '#f39c12';
      default:
        return '#2ecc71';
    }
  };

  // Get status icon for the expected status indicator
  const getStatusIcon = (status) => {
    switch (status) {
      case 'absent':
        return 'close-circle';
      case 'late':
        return 'time';
      default:
        return 'checkmark-circle';
    }
  };

  // Create header component for the FlatList  
  const HeaderComponent = () => (
    <>
      <Text style={styles.label}>
        {`Student${isBimbelActivity ? ` from ${kelompokName || 'this group'}` : ''}`}
      </Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#7f8c8d" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search student..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>
    </>
  );
  
  // Create footer component for the FlatList
  const FooterComponent = () => (
    <>
      {/* Time Arrived */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Arrival Time</Text>
        <TouchableOpacity 
          style={styles.timePickerButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons name="time-outline" size={20} color="#3498db" />
          <Text style={styles.timePickerText}>
            {format(arrivalTime, 'HH:mm')}
          </Text>
        </TouchableOpacity>
        
        {showTimePicker && (
          <DateTimePicker
            value={arrivalTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
      
      {/* Expected Status */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Expected Status</Text>
        <View style={[styles.expectedStatus, { backgroundColor: getStatusColor(expectedStatus) }]}>
          <Ionicons name={getStatusIcon(expectedStatus)} size={20} color="#fff" />
          <Text style={styles.expectedStatusText}>
            {expectedStatus.charAt(0).toUpperCase() + expectedStatus.slice(1)}
          </Text>
        </View>
        <Text style={styles.helperText}>
          Status is automatically determined based on activity schedule and arrival time
        </Text>
      </View>
      
      {/* Notes Input */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Verification Notes (Required)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Enter verification notes..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>
      
      {/* Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Record Attendance</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Activity Info */}
        <View style={styles.activityInfo}>
          <Text style={styles.activityName}>{activityName || 'Activity'}</Text>
          <Text style={styles.activityDate}>{activityDate || 'Date not specified'}</Text>
          
          {/* Show Kelompok info for Bimbel activities */}
          {isBimbelActivity && kelompokName && (
            <View style={styles.kelompokInfoContainer}>
              <Text style={styles.kelompokInfo}>Group: {kelompokName}</Text>
            </View>
          )}
        </View>
        
        {/* Network Status Indicator */}
        {!isConnected && (
          <View style={styles.offlineIndicator}>
            <Ionicons name="cloud-offline" size={18} color="#fff" />
            <Text style={styles.offlineText}>Offline Mode - Data will be synced later</Text>
          </View>
        )}
        
        {/* Duplicate Alert */}
        {showDuplicateAlert && (
          <View style={styles.duplicateAlert}>
            <Ionicons name="alert-circle" size={20} color="#fff" />
            <Text style={styles.duplicateAlertText}>
              {duplicateError || 'This student already has an attendance record for this activity'}
            </Text>
            <TouchableOpacity
              style={styles.duplicateAlertCloseButton}
              onPress={handleCloseDuplicateAlert}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Error Message */}
        {error && <ErrorMessage message={error} />}
        {studentError && <ErrorMessage message={studentError} onRetry={fetchAllStudents} />}
        
        {/* Main Form Content */}
        <View style={styles.formContainer}>
          {loadingStudents || loadingActivityDetails ? (
            <ActivityIndicator size="large" color="#3498db" style={styles.loadingIndicator} />
          ) : (
            <FlatList
              data={filteredStudents}
              renderItem={renderStudentItem}
              keyExtractor={(item) => item.id_anak.toString()}
              ListHeaderComponent={HeaderComponent}
              ListFooterComponent={FooterComponent}
              ListEmptyComponent={
                <Text style={styles.emptyListText}>No students found</Text>
              }
              contentContainerStyle={styles.studentListContent}
            />
          )}
        </View>
        
        {/* Loading Overlay */}
        {loading && (
          <LoadingSpinner 
            fullScreen 
            message="Recording attendance..."
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  activityInfo: {
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
  kelompokInfoContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  kelompokInfo: {
    fontSize: 14,
    color: '#fff',
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 0,
  },
  offlineText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  duplicateAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f39c12',
    padding: 12,
    borderRadius: 0,
  },
  duplicateAlertText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  duplicateAlertCloseButton: {
    padding: 5,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    color: '#2c3e50',
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  studentListContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginHorizontal: 16,
    backgroundColor: '#fff',
  },
  selectedStudentItem: {
    backgroundColor: '#e1f5fe',
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  studentId: {
    fontSize: 12,
    color: '#777',
  },
  emptyListText: {
    textAlign: 'center',
    padding: 20,
    color: '#7f8c8d',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  timePickerText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#2c3e50',
  },
  expectedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ecc71',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  expectedStatusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 6,
    fontStyle: 'italic',
  },
  notesInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  buttonSection: {
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  submitButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
});

export default ManualAttendanceScreen;