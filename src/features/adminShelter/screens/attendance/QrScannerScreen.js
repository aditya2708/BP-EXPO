import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';

// Components
import QrScanner from '../../components/QrScanner';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Hooks and Redux
import { 
  validateToken, 
  selectQrTokenLoading,
  selectValidationResult,
  resetValidationResult
} from '../redux/qrTokenSlice';
import {
  recordAttendanceByQr,
  selectAttendanceLoading,
  selectAttendanceError,
  resetAttendanceError
} from '../redux/attendanceSlice';

// Utils
import OfflineSync from '../utils/offlineSync';

/**
 * QR Scanner Screen for Attendance Recording
 * 
 * @param {Object} props - Component props from navigation
 */
const QrScannerScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  
  // Get params from route
  const { id_aktivitas, activityName, activityDate } = route.params || {};
  
  // Redux state
  const tokenLoading = useSelector(selectQrTokenLoading);
  const validationResult = useSelector(selectValidationResult);
  const attendanceLoading = useSelector(selectAttendanceLoading);
  const attendanceError = useSelector(selectAttendanceError);
  
  // Local state
  const [scannerActive, setScannerActive] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('present');
  const [isConnected, setIsConnected] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [processingResult, setProcessingResult] = useState(null);
  
  // Check network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Reset validation when screen unmounts
  useEffect(() => {
    return () => {
      dispatch(resetValidationResult());
      dispatch(resetAttendanceError());
    };
  }, [dispatch]);
  
  // Handle successful validation result
  useEffect(() => {
    if (validationResult && validationResult.valid && validationResult.token && validationResult.anak) {
      handleAttendanceRecording(validationResult.token.token, validationResult.anak.id_anak);
    }
  }, [validationResult]);
  
  // Handle QR scan result
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
  
  // Record attendance after successful validation
  const handleAttendanceRecording = async (token, id_anak) => {
    try {
      // If online, record directly via Redux
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
      } 
      // If offline, use offline sync
      else {
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
      setProcessingResult({
        success: false,
        message: error.message || 'Failed to record attendance'
      });
      setShowResultModal(true);
    }
  };
  
  // Close scanner and go back
  const handleClose = () => {
    navigation.goBack();
  };
  
  // Toggle attendance status
  const toggleStatus = () => {
    setSelectedStatus(selectedStatus === 'present' ? 'absent' : 'present');
  };
  
  // Reset for another scan
  const handleRescan = () => {
    dispatch(resetValidationResult());
    dispatch(resetAttendanceError());
    setShowResultModal(false);
    setScannerActive(true);
  };
  
  // Loading indicator
  const isLoading = tokenLoading || attendanceLoading;
  
  return (
    <View style={styles.container}>
      {scannerActive ? (
        <>
          <QrScanner 
            onScan={handleScan}
            onClose={handleClose}
            isLoading={isLoading}
          />
          
          {/* Bottom status selector */}
          <View style={styles.bottomBar}>
            <Text style={styles.activityName}>
              {activityName || 'No activity selected'}
            </Text>
            
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
        </>
      ) : (
        <View style={styles.manualContainer}>
          {/* Content for manual entry mode if needed */}
          <Text>Manual entry mode</Text>
        </View>
      )}
      
      {/* Result Modal */}
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
              { backgroundColor: processingResult?.success ? '#2ecc71' : '#e74c3c' }
            ]}>
              <Ionicons 
                name={processingResult?.success ? 'checkmark-circle' : 'close-circle'} 
                size={36} 
                color="#fff" 
              />
              <Text style={styles.resultHeaderText}>
                {processingResult?.success ? 'Success' : 'Error'}
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
    </View>
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
    marginBottom: 10,
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
  manualContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  // Modal styles
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