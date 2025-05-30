import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  SafeAreaView,
  Vibration
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { Audio } from 'expo-av';
import { format } from 'date-fns';

// Components
import QrScanner from '../../components/QrScanner';

// Redux
import {
  validateToken,
  selectQrTokenLoading,
  selectValidationResult,
  resetValidationResult
} from '../../redux/qrTokenSlice';

import {
  recordAttendanceByQr,
  selectAttendanceLoading,
  selectAttendanceError,
  selectDuplicateError,
  resetAttendanceError
} from '../../redux/attendanceSlice';

import {
  recordTutorAttendanceByQr,
  selectTutorAttendanceLoading,
  selectTutorAttendanceError,
  selectTutorDuplicateError,
  resetTutorAttendanceError
} from '../../redux/tutorAttendanceSlice';

// Utils
import OfflineSync from '../../utils/offlineSync';
import { adminShelterKelompokApi } from '../../api/adminShelterKelompokApi';

const QrScannerScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  
  // Animation ref
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Sound ref
  const sound = useRef(null);
  
  // Get params
  const { 
    id_aktivitas, 
    activityName, 
    activityDate, 
    activityType,
    kelompokId,
    kelompokName
  } = route.params || {};
  
  // Redux state
  const tokenLoading = useSelector(selectQrTokenLoading);
  const validationResult = useSelector(selectValidationResult);
  const attendanceLoading = useSelector(selectAttendanceLoading);
  const attendanceError = useSelector(selectAttendanceError);
  const duplicateError = useSelector(selectDuplicateError);
  
  // Add tutor attendance state
  const tutorAttendanceLoading = useSelector(selectTutorAttendanceLoading);
  const tutorAttendanceError = useSelector(selectTutorAttendanceError);
  const tutorDuplicateError = useSelector(selectTutorDuplicateError);
  
  // Local state
  const [isConnected, setIsConnected] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // success, error, warning
  const [isBimbelActivity, setIsBimbelActivity] = useState(activityType === 'Bimbel');
  const [kelompokStudentIds, setKelompokStudentIds] = useState([]);
  const [loadingKelompokData, setLoadingKelompokData] = useState(false);
  
  // Load sound effect
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound: cameraSound } = await Audio.Sound.createAsync(
          require('../../../../assets/sounds/camera-shutter.wav')
        );
        sound.current = cameraSound;
      } catch (error) {
        console.error('Failed to load sound', error);
      }
    };
    
    loadSound();
    
    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);
  
  // Check connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Reset validation when unmounting
  useEffect(() => {
    return () => {
      dispatch(resetValidationResult());
      dispatch(resetAttendanceError());
      dispatch(resetTutorAttendanceError());
    };
  }, [dispatch]);
  
  // Determine activity type and load kelompok data if needed
  useEffect(() => {
    setIsBimbelActivity(activityType === 'Bimbel');
    
    if (activityType === 'Bimbel' && kelompokId) {
      fetchKelompokStudents(kelompokId);
    }
  }, [activityType, kelompokId]);
  
  // Check for duplicate error
  useEffect(() => {
    if (duplicateError || tutorDuplicateError) {
      showToast(duplicateError || tutorDuplicateError, 'warning');
    }
  }, [duplicateError, tutorDuplicateError]);
  
  // Process validation result
  useEffect(() => {
    if (validationResult && validationResult.valid && validationResult.token && validationResult.anak) {
      // For Bimbel activities, validate that student is in the kelompok
      if (isBimbelActivity && kelompokStudentIds.length > 0) {
        const studentId = validationResult.anak.id_anak;
        
        if (!kelompokStudentIds.includes(studentId)) {
          // Student not in this kelompok
          showToast(`Student not in the ${kelompokName || 'selected'} group`, 'error');
          return;
        }
      }
      
      // If passed validation, record attendance
      handleAttendanceRecording(validationResult.token.token, validationResult.anak.id_anak);
    }
  }, [validationResult, isBimbelActivity, kelompokStudentIds]);
  
  // Fetch students in kelompok for validation
  const fetchKelompokStudents = async (kelompokId) => {
    if (!kelompokId) return;
    
    setLoadingKelompokData(true);
    
    try {
      const response = await adminShelterKelompokApi.getGroupChildren(kelompokId);
      
      if (response.data && response.data.data) {
        // Extract student IDs for quick validation
        const studentIds = response.data.data
          .filter(student => student.status_validasi === 'aktif')
          .map(student => student.id_anak);
        
        setKelompokStudentIds(studentIds);
      }
    } catch (error) {
      console.error('Error fetching kelompok students:', error);
      // Still continue - we'll just validate all students
      setKelompokStudentIds([]);
    } finally {
      setLoadingKelompokData(false);
    }
  };
  
  // Play camera sound
  const playSound = async () => {
    try {
      if (sound.current) {
        await sound.current.setPositionAsync(0);
        await sound.current.playAsync();
      } else {
        // Fallback to vibration if sound can't be played
        Vibration.vibrate(100);
      }
    } catch (error) {
      console.error('Error playing sound', error);
      // Fallback to vibration
      Vibration.vibrate(100);
    }
  };
  
  // Show toast message
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    
    // Animate in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
    
    // Auto hide after 2 seconds
    setTimeout(() => {
      hideToast();
    }, 2000);
  };
  
  // Hide toast message
  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setToastVisible(false);
    });
  };
  
  // Handle QR scan
  const handleScan = async (qrData) => {
    if (!id_aktivitas) {
      Alert.alert('Error', 'No activity selected. Please go back and select an activity first.');
      return;
    }
    
    // Parse QR data to check if it's a tutor token
    const isTutorToken = qrData.token && qrData.token.startsWith('t');
    
    if (isTutorToken) {
      // Direct tutor attendance recording
      handleTutorAttendanceRecording(qrData.token);
    } else {
      // Student token validation flow
      dispatch(validateToken(qrData.token));
    }
  };
  
  // Record attendance
  const handleAttendanceRecording = async (token, id_anak) => {
    try {
      if (isConnected) {
        // Get current time in proper format
        const currentTime = new Date();
        const formattedArrivalTime = format(currentTime, 'yyyy-MM-dd HH:mm:ss');
        
        const result = await dispatch(recordAttendanceByQr({ 
          id_anak, 
          id_aktivitas, 
          status: null, // Let backend determine status
          token,
          arrival_time: formattedArrivalTime // Add explicit arrival time
        })).unwrap();
        
        // Play camera sound on success
        playSound();
        
        const studentName = validationResult.anak.full_name || 'Student';
        
        // Use the status from the response
        let status = 'Present';
        let toastType = 'success';
        
        if (result.data && result.data.absen) {
          if (result.data.absen === 'Tidak') {
            status = 'Absent';
            toastType = 'error';
          } else if (result.data.absen === 'Terlambat') {
            status = 'Late';
            toastType = 'warning';
          }
        }
        
        showToast(`${status}: ${studentName}`, toastType);
      } else {
        // Offline handling remains the same
        const currentTime = new Date();
        const formattedArrivalTime = format(currentTime, 'yyyy-MM-dd HH:mm:ss');
        
        const result = await OfflineSync.processAttendance({
          id_anak,
          id_aktivitas,
          status: null,
          token,
          arrival_time: formattedArrivalTime
        }, 'qr');
        
        playSound();
        showToast('Saved for syncing when online', 'warning');
      }
    } catch (error) {
      if (!error.isDuplicate) {
        showToast(error.message || 'Failed to record', 'error');
      }
    }
  };
  
  // Handle tutor attendance recording
  const handleTutorAttendanceRecording = async (token) => {
    try {
      if (isConnected) {
        const currentTime = new Date();
        const formattedArrivalTime = format(currentTime, 'yyyy-MM-dd HH:mm:ss');
        
        const result = await dispatch(recordTutorAttendanceByQr({ 
          id_aktivitas, 
          token,
          arrival_time: formattedArrivalTime
        })).unwrap();
        
        playSound();
        
        // Determine status for toast
        let status = 'Present';
        let toastType = 'success';
        
        if (result.data && result.data.absen) {
          if (result.data.absen === 'Tidak') {
            status = 'Absent';
            toastType = 'error';
          } else if (result.data.absen === 'Terlambat') {
            status = 'Late';
            toastType = 'warning';
          }
        }
        
        const tutorName = result.data?.absenUser?.tutor?.nama || 'Tutor';
        showToast(`${status}: ${tutorName} (Tutor)`, toastType);
      } else {
        // Offline handling
        const result = await OfflineSync.processAttendance({
          id_aktivitas,
          token,
          arrival_time: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          type: 'tutor'
        }, 'qr');
        
        playSound();
        showToast('Saved for syncing when online', 'warning');
      }
    } catch (error) {
      if (!error.isDuplicate) {
        showToast(error.message || 'Failed to record tutor attendance', 'error');
      }
    }
  };
  
  // Close scanner
  const handleClose = () => {
    navigation.goBack();
  };
  
  const isLoading = tokenLoading || attendanceLoading || loadingKelompokData || tutorAttendanceLoading;
  
  // Get toast style based on type
  const getToastStyle = () => {
    switch(toastType) {
      case 'error':
        return styles.errorToast;
      case 'warning':
        return styles.warningToast;
      case 'success':
      default:
        return styles.successToast;
    }
  };
  
  // Get toast icon based on type
  const getToastIcon = () => {
    switch(toastType) {
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'alert-circle';
      case 'success':
      default:
        return 'checkmark-circle';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <QrScanner 
        onScan={handleScan}
        onClose={handleClose}
        isLoading={isLoading}
      />
      
      <View style={styles.bottomBar}>
        <Text style={styles.activityName}>
          {activityName || 'No activity selected'}
        </Text>
        
        {/* Show Kelompok info for Bimbel activities */}
        {isBimbelActivity && kelompokName && (
          <Text style={styles.kelompokInfo}>
            Group: {kelompokName}
          </Text>
        )}
        
        {/* Attendance status is auto-determined based on schedule */}
        <View style={styles.autoDetectionNote}>
          <Ionicons name="time-outline" size={16} color="#fff" />
          <Text style={styles.autoDetectionText}>
            Attendance status will be automatically determined based on schedule
          </Text>
        </View>
        
        {!isConnected && (
          <View style={styles.offlineIndicator}>
            <Ionicons name="cloud-offline" size={16} color="#fff" />
            <Text style={styles.offlineText}>Offline Mode</Text>
          </View>
        )}
      </View>
      
      {/* Toast Notification */}
      {toastVisible && (
        <Animated.View 
          style={[
            styles.toast,
            getToastStyle(),
            { opacity: fadeAnim }
          ]}
        >
          <Ionicons name={getToastIcon()} size={20} color="#fff" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    paddingBottom: 30,
  },
  activityName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 6,
  },
  kelompokInfo: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
    opacity: 0.8,
  },
  autoDetectionNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 152, 219, 0.7)',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  autoDetectionText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    padding: 6,
    borderRadius: 4,
  },
  offlineText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 12,
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  successToast: {
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
  },
  warningToast: {
    backgroundColor: 'rgba(243, 156, 18, 0.9)',
  },
  errorToast: {
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
  },
});

export default QrScannerScreen;