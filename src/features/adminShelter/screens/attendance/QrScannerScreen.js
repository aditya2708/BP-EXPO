import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';

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

// Utils
import OfflineSync from '../../utils/offlineSync';
import { adminShelterKelompokApi } from '../../api/adminShelterKelompokApi';

const QrScannerScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  
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
  
  // Local state
  const [selectedStatus, setSelectedStatus] = useState('present');
  const [isConnected, setIsConnected] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [processingResult, setProcessingResult] = useState(null);
  const [isBimbelActivity, setIsBimbelActivity] = useState(activityType === 'Bimbel');
  const [kelompokStudentIds, setKelompokStudentIds] = useState([]);
  const [loadingKelompokData, setLoadingKelompokData] = useState(false);
  
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
    if (duplicateError) {
      setProcessingResult({
        success: false,
        isDuplicate: true,
        message: duplicateError || 'Attendance already recorded for this student in this activity'
      });
      setShowResultModal(true);
    }
  }, [duplicateError]);
  
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
  
  // Process validation result
  useEffect(() => {
    if (validationResult && validationResult.valid && validationResult.token && validationResult.anak) {
      // For Bimbel activities, validate that student is in the kelompok
      if (isBimbelActivity && kelompokStudentIds.length > 0) {
        const studentId = validationResult.anak.id_anak;
        
        if (!kelompokStudentIds.includes(studentId)) {
          // Student not in this kelompok
          setProcessingResult({
            success: false,
            message: `This student is not in the ${kelompokName || 'selected'} group for this activity`
          });
          setShowResultModal(true);
          return;
        }
      }
      
      // If passed validation, record attendance
      handleAttendanceRecording(validationResult.token.token, validationResult.anak.id_anak);
    }
  }, [validationResult, isBimbelActivity, kelompokStudentIds]);
  
  // Handle QR scan
  const handleScan = (qrData) => {
    if (!id_aktivitas) {
      Alert.alert(
        'Error',
        'No activity selected. Please go back and select an activity first.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    dispatch(validateToken(qrData.token));
  };
  
  // Record attendance
  const handleAttendanceRecording = async (token, id_anak) => {
    try {
      if (isConnected) {
        await dispatch(recordAttendanceByQr({ 
          id_anak, 
          id_aktivitas, 
          status: selectedStatus, 
          token 
        })).unwrap();
        
        setProcessingResult({
          success: true,
          offline: false,
          student: validationResult.anak,
          message: `${selectedStatus === 'present' ? 'Attendance' : 'Absence'} recorded successfully`
        });
      } else {
        const result = await OfflineSync.processAttendance({
          id_anak,
          id_aktivitas,
          status: selectedStatus,
          token
        }, 'qr');
        
        setProcessingResult({
          success: true,
          offline: true,
          student: validationResult.anak,
          message: result.message || 'Attendance saved for syncing when online'
        });
      }
      
      setShowResultModal(true);
    } catch (error) {
      // Duplicate errors are handled via the useEffect watching duplicateError
      if (!error.isDuplicate) {
        setProcessingResult({
          success: false,
          message: error.message || 'Failed to record attendance'
        });
        setShowResultModal(true);
      }
    }
  };
  
  // Close scanner
  const handleClose = () => {
    navigation.goBack();
  };
  
  // Rescan
  const handleRescan = () => {
    dispatch(resetValidationResult());
    dispatch(resetAttendanceError());
    setShowResultModal(false);
  };
  
  const isLoading = tokenLoading || attendanceLoading || loadingKelompokData;

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
        
        <View style={styles.statusSelector}>
          <Text style={styles.statusLabel}>Status:</Text>
          <TouchableOpacity 
            style={[
              styles.statusButton,
              { backgroundColor: selectedStatus === 'present' ? '#2ecc71' : '#bdc3c7' }
            ]}
            onPress={() => setSelectedStatus('present')}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.statusButtonText}>Present</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.statusButton,
              { backgroundColor: selectedStatus === 'absent' ? '#e74c3c' : '#bdc3c7' }
            ]}
            onPress={() => setSelectedStatus('absent')}
          >
            <Ionicons name="close" size={20} color="#fff" />
            <Text style={styles.statusButtonText}>Absent</Text>
          </TouchableOpacity>
        </View>
        
        {!isConnected && (
          <View style={styles.offlineIndicator}>
            <Ionicons name="cloud-offline" size={16} color="#fff" />
            <Text style={styles.offlineText}>Offline Mode</Text>
          </View>
        )}
      </View>
      
      <Modal
        visible={showResultModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResultModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[
              styles.resultHeader,
              { 
                backgroundColor: processingResult?.success ? '#2ecc71' : 
                                 processingResult?.isDuplicate ? '#f39c12' : '#e74c3c' 
              }
            ]}>
              <Ionicons 
                name={
                  processingResult?.success ? 'checkmark-circle' : 
                  processingResult?.isDuplicate ? 'alert-circle' : 'close-circle'
                } 
                size={36} 
                color="#fff" 
              />
              <Text style={styles.resultHeaderText}>
                {processingResult?.success ? 'Success' : 
                 processingResult?.isDuplicate ? 'Already Recorded' : 'Error'}
              </Text>
            </View>
            
            <View style={styles.resultContent}>
              {processingResult?.student && (
                <Text style={styles.resultStudent}>
                  Student: {processingResult.student.full_name || processingResult.student.name}
                </Text>
              )}
              
              <Text style={styles.resultMessage}>
                {processingResult?.message || 'Attendance processed'}
              </Text>
              
              {processingResult?.isDuplicate && (
                <View style={styles.duplicateNote}>
                  <Ionicons name="information-circle" size={16} color="#7f8c8d" />
                  <Text style={styles.duplicateNoteText}>
                    A student can only have one attendance record per activity.
                  </Text>
                </View>
              )}
              
              {processingResult?.offline && (
                <View style={styles.offlineNote}>
                  <Ionicons name="cloud-offline" size={16} color="#7f8c8d" />
                  <Text style={styles.offlineNoteText}>
                    Saved offline. Will sync when connection is restored.
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.resultActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleRescan}
              >
                <Text style={styles.actionButtonText}>Scan Another</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.closeButton]}
                onPress={handleClose}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  statusSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLabel: {
    color: '#fff',
    marginRight: 10,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  statusButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#e74c3c',
    padding: 6,
    borderRadius: 4,
  },
  offlineText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    overflow: 'hidden',
  },
  resultHeader: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#2ecc71',
  },
  resultHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  resultContent: {
    padding: 20,
  },
  resultStudent: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  resultMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  duplicateNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffd54f',
    marginBottom: 10,
  },
  duplicateNoteText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#825b00',
    flex: 1,
  },
  offlineNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
  },
  offlineNoteText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#7f8c8d',
  },
  resultActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#3498db',
    fontWeight: '500',
  },
  closeButton: {
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  closeButtonText: {
    color: '#7f8c8d',
  },
});

export default QrScannerScreen;