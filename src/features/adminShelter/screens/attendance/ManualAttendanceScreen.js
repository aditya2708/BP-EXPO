import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

// Components
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// API Services
import { adminShelterAnakApi } from '../api/adminShelterAnakApi';

// Redux
import {
  recordAttendanceManually,
  selectAttendanceLoading,
  selectAttendanceError
} from '../redux/attendanceSlice';

// Utils
import OfflineSync from '../utils/offlineSync';
import NetInfo from '@react-native-community/netinfo';

/**
 * Manual Attendance Entry Screen
 * Allows recording attendance without QR code
 */
const ManualAttendanceScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  
  // Get activity ID from route params
  const { id_aktivitas, activityName, activityDate } = route.params || {};
  
  // Redux state
  const loading = useSelector(selectAttendanceLoading);
  const error = useSelector(selectAttendanceError);
  
  // Local state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('present');
  const [notes, setNotes] = useState('');
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentError, setStudentError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  
  // Check network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Fetch students for the dropdown
  useEffect(() => {
    fetchStudents();
  }, []);
  
  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Fetch students from API
  const fetchStudents = async () => {
    setLoadingStudents(true);
    setStudentError(null);
    
    try {
      const response = await adminShelterAnakApi.getAllAnak();
      setStudents(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setStudentError('Failed to load students. Please try again.');
    } finally {
      setLoadingStudents(false);
    }
  };
  
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
    
    const attendanceData = {
      id_anak: selectedStudent.id_anak,
      id_aktivitas,
      status: selectedStatus,
      notes
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
      Alert.alert('Error', err.message || 'Failed to record attendance');
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Activity Info */}
      <View style={styles.activityInfo}>
        <Text style={styles.activityName}>{activityName || 'Activity'}</Text>
        <Text style={styles.activityDate}>{activityDate || 'Date not specified'}</Text>
      </View>
      
      {/* Network Status Indicator */}
      {!isConnected && (
        <View style={styles.offlineIndicator}>
          <Ionicons name="cloud-offline" size={18} color="#fff" />
          <Text style={styles.offlineText}>Offline Mode - Data will be synced later</Text>
        </View>
      )}
      
      {/* Error Message */}
      {error && <ErrorMessage message={error} />}
      {studentError && <ErrorMessage message={studentError} onRetry={fetchStudents} />}
      
      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Student</Text>
        
        {/* Student Search */}
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
        
        {/* Student Picker */}
        {loadingStudents ? (
          <ActivityIndicator size="small" color="#3498db" style={styles.loadingIndicator} />
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedStudent?.id_anak}
              onValueChange={(itemValue) => {
                const student = students.find(s => s.id_anak === itemValue);
                setSelectedStudent(student || null);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select a student" value={null} color="#95a5a6" />
              {filteredStudents.map((student) => (
                <Picker.Item 
                  key={student.id_anak} 
                  label={student.full_name} 
                  value={student.id_anak} 
                />
              ))}
            </Picker>
          </View>
        )}
        
        {/* Status Selection */}
        <Text style={styles.label}>Attendance Status</Text>
        <View style={styles.statusButtons}>
          <TouchableOpacity 
            style={[
              styles.statusButton,
              selectedStatus === 'present' && styles.statusButtonActive,
              { backgroundColor: selectedStatus === 'present' ? '#2ecc71' : '#f5f5f5' }
            ]}
            onPress={() => setSelectedStatus('present')}
          >
            <Ionicons 
              name="checkmark-circle" 
              size={24} 
              color={selectedStatus === 'present' ? 'white' : '#7f8c8d'} 
            />
            <Text 
              style={[
                styles.statusButtonText,
                { color: selectedStatus === 'present' ? 'white' : '#7f8c8d' }
              ]}
            >
              Present
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.statusButton,
              selectedStatus === 'absent' && styles.statusButtonActive,
              { backgroundColor: selectedStatus === 'absent' ? '#e74c3c' : '#f5f5f5' }
            ]}
            onPress={() => setSelectedStatus('absent')}
          >
            <Ionicons 
              name="close-circle" 
              size={24} 
              color={selectedStatus === 'absent' ? 'white' : '#7f8c8d'} 
            />
            <Text 
              style={[
                styles.statusButtonText,
                { color: selectedStatus === 'absent' ? 'white' : '#7f8c8d' }
              ]}
            >
              Absent
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Notes Input */}
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
        
        {/* Submit Button */}
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
        
        {/* Cancel Button */}
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  activityInfo: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
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
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  offlineText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#2c3e50',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  statusButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  statusButtonActive: {
    borderWidth: 2,
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  notesInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 100,
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