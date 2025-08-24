import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, Alert, Animated
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { Audio } from 'expo-av';
import { format, startOfDay, isFuture, isPast } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';

import QrScanner from '../../../components/QrScanner';
import {
  validateToken, selectQrTokenLoading, selectValidationResult, resetValidationResult
} from '../../../redux/qrTokenSlice';
import {
  recordAttendanceByQr, selectAttendanceLoading, selectAttendanceError,
  selectDuplicateError, resetAttendanceError
} from '../../../redux/attendanceSlice';
import {
  recordTutorAttendanceByQr, selectTutorAttendanceLoading,
  selectTutorAttendanceError, selectTutorDuplicateError, resetTutorAttendanceError
} from '../../../redux/tutorAttendanceSlice';

import OfflineSync from '../../../utils/offlineSync';
import { adminShelterKelompokApi } from '../../../api/adminShelterKelompokApi';
import { tutorAttendanceApi } from '../../../api/tutorAttendanceApi';

const QrScannerTab = ({ navigation, id_aktivitas, activityName, activityDate, activityType, kelompokId, kelompokName }) => {
  const dispatch = useDispatch();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const sound = useRef(null);
  const toastTimeout = useRef(null);
  const processingTimeout = useRef(null);
  
  const tokenLoading = useSelector(selectQrTokenLoading);
  const validationResult = useSelector(selectValidationResult);
  const attendanceLoading = useSelector(selectAttendanceLoading);
  const attendanceError = useSelector(selectAttendanceError);
  const duplicateError = useSelector(selectDuplicateError);
  const tutorAttendanceLoading = useSelector(selectTutorAttendanceLoading);
  const tutorAttendanceError = useSelector(selectTutorAttendanceError);
  const tutorDuplicateError = useSelector(selectTutorDuplicateError);
  
  const [isConnected, setIsConnected] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isBimbelActivity = useMemo(() => activityType === 'Bimbel', [activityType]);
  const isLoading = useMemo(() => 
    tokenLoading || attendanceLoading || tutorAttendanceLoading || isProcessing,
    [tokenLoading, attendanceLoading, tutorAttendanceLoading, isProcessing]
  );

  // Calculate activity date status
  const activityDateStatus = useMemo(() => {
    if (!activityDate) return 'valid';
    const activityStartOfDay = startOfDay(new Date(activityDate));
    const today = startOfDay(new Date());
    
    if (isFuture(activityStartOfDay)) return 'future';
    if (isPast(activityStartOfDay) && activityStartOfDay < today) return 'past';
    return 'valid';
  }, [activityDate]);

  // Sound cleanup
  useEffect(() => {
    let isMounted = true;
    
    const loadSound = async () => {
      try {
        if (isMounted) {
          const { sound: cameraSound } = await Audio.Sound.createAsync(
            require('../../../../../assets/sounds/camera-shutter.wav')
          );
          sound.current = cameraSound;
        }
      } catch (error) {
        console.error('Gagal memuat suara', error);
      }
    };
    
    loadSound();
    
    return () => {
      isMounted = false;
      sound.current?.unloadAsync();
    };
  }, []);

  // Network listener cleanup
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });
    return unsubscribe;
  }, []);

  // Cleanup on unmount
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Clear all timeouts
        if (toastTimeout.current) {
          clearTimeout(toastTimeout.current);
          toastTimeout.current = null;
        }
        if (processingTimeout.current) {
          clearTimeout(processingTimeout.current);
          processingTimeout.current = null;
        }
        // Reset states
        dispatch(resetValidationResult());
        dispatch(resetAttendanceError());
        dispatch(resetTutorAttendanceError());
        setIsProcessing(false);
        setToastVisible(false);
      };
    }, [dispatch])
  );

  const playSound = useCallback(async () => {
    try {
      if (sound.current) {
        await sound.current.replayAsync();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    
    toastTimeout.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setToastVisible(false);
      });
      toastTimeout.current = null;
    }, 3000);
  }, [fadeAnim]);

  const handleScan = useCallback(async (qrData) => {
    if (!qrData?.token || isProcessing) return;
    
    if (!id_aktivitas) {
      Alert.alert('Aktivitas Tidak Dipilih', 'Silakan kembali dan pilih aktivitas terlebih dahulu.');
      return;
    }
    
    if (activityDateStatus === 'future') {
      Alert.alert('Aktivitas Belum Dimulai', 'Aktivitas ini belum dimulai. Silakan tunggu sampai tanggal aktivitas.');
      return;
    }
    
    if (activityDateStatus === 'past') {
      Alert.alert(
        'Aktivitas Lampau', 
        'Aktivitas ini sudah berlalu. Kehadiran akan ditandai sebagai tidak hadir.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Lanjutkan', onPress: () => proceedWithScan(qrData) }
        ]
      );
      return;
    }
    
    proceedWithScan(qrData);
  }, [id_aktivitas, isProcessing, activityDateStatus]);

  const proceedWithScan = useCallback(async (qrData) => {
    setIsProcessing(true);
    
    try {
      const isTutorToken = await validateIfTutorToken(qrData.token);
      
      processingTimeout.current = setTimeout(() => {
        if (isTutorToken) {
          handleTutorAttendanceRecording(qrData.token);
        } else {
          dispatch(validateToken(qrData.token));
        }
        processingTimeout.current = null;
      }, 100);
    } catch (error) {
      console.error('Error menentukan jenis token:', error);
      processingTimeout.current = setTimeout(() => {
        dispatch(validateToken(qrData.token));
        processingTimeout.current = null;
      }, 100);
    } finally {
      setTimeout(() => setIsProcessing(false), 1000);
    }
  }, [dispatch]);

  const validateIfTutorToken = useCallback(async (token) => {
    try {
      const response = await tutorAttendanceApi.validateTutorToken(token);
      return response.data.success;
    } catch (error) {
      return false;
    }
  }, []);

  const handleTutorAttendanceRecording = useCallback(async (token) => {
    try {
      const now = new Date();
      const formattedArrivalTime = format(now, 'yyyy-MM-dd HH:mm:ss');
      
      const result = await dispatch(recordTutorAttendanceByQr({
        token,
        id_aktivitas,
        arrival_time: formattedArrivalTime
      })).unwrap();
      
      await playSound();
      showToast(`Tutor berhasil hadir`, 'success');
    } catch (error) {
      if (tutorDuplicateError) {
        showToast('Tutor sudah melakukan absen', 'warning');
      } else {
        showToast('Gagal mencatat kehadiran tutor', 'error');
      }
    }
  }, [dispatch, id_aktivitas, playSound, showToast, tutorDuplicateError]);

  // Effect for handling student attendance after validation
  useEffect(() => {
    if (validationResult?.success && validationResult?.anak?.id) {
      handleAttendanceRecording(validationResult.anak.token, validationResult.anak.id);
    }
  }, [validationResult]);

  const handleAttendanceRecording = useCallback(async (token, id_anak) => {
    try {
      if (isConnected) {
        const now = new Date();
        const formattedArrivalTime = format(now, 'yyyy-MM-dd HH:mm:ss');
        
        const result = await dispatch(recordAttendanceByQr({ 
          id_anak, 
          id_aktivitas, 
          status: null, 
          token, 
          arrival_time: formattedArrivalTime
        })).unwrap();
        
        await playSound();
        
        const studentName = validationResult?.anak?.full_name || 'Siswa';
        let status = 'Hadir', toastType = 'success';
        
        if (result.data?.absen === 'Tidak Hadir') {
          status = 'Tidak Hadir';
          toastType = 'warning';
        }
        
        showToast(`${studentName} - ${status}`, toastType);
      } else {
        // Offline handling
        await OfflineSync.saveOfflineAttendance({
          id_anak,
          id_aktivitas,
          token,
          timestamp: new Date().toISOString()
        });
        
        await playSound();
        showToast('Absensi disimpan offline', 'warning');
      }
    } catch (error) {
      if (duplicateError) {
        showToast('Siswa sudah melakukan absen', 'warning');
      } else {
        showToast('Gagal mencatat kehadiran', 'error');
      }
    }
  }, [dispatch, id_aktivitas, isConnected, validationResult, playSound, showToast, duplicateError]);

  const getToastStyle = useCallback(() => {
    switch (toastType) {
      case 'success': return styles.successToast;
      case 'warning': return styles.warningToast;
      case 'error': return styles.errorToast;
      default: return styles.successToast;
    }
  }, [toastType]);

  const getToastIcon = useCallback(() => {
    switch (toastType) {
      case 'success': return 'checkmark-circle';
      case 'warning': return 'warning';
      case 'error': return 'close-circle';
      default: return 'checkmark-circle';
    }
  }, [toastType]);

  const getActivityStatusInfo = useCallback(() => {
    switch (activityDateStatus) {
      case 'future':
        return {
          show: true, color: '#f39c12', icon: 'time-outline',
          text: 'Aktivitas belum dimulai'
        };
      case 'past':
        return {
          show: true, color: '#e74c3c', icon: 'alert-circle',
          text: 'Aktivitas lampau - kehadiran akan ditandai tidak hadir'
        };
      default:
        return { show: false };
    }
  }, [activityDateStatus]);

  const activityStatus = getActivityStatusInfo();

  return (
    <View style={styles.container}>
      <QrScanner 
        onScan={handleScan}
        isLoading={isLoading}
        disabled={activityDateStatus === 'future'}
      />
      
      <View style={styles.bottomBar}>
        <Text style={styles.activityName}>
          {activityName || 'Tidak ada aktivitas dipilih'}
        </Text>
        
        {isBimbelActivity && kelompokName && (
          <Text style={styles.kelompokInfo}>
            Kelompok: {kelompokName}
          </Text>
        )}
        
        {activityStatus.show && (
          <View style={[styles.activityStatusNote, { backgroundColor: activityStatus.color }]}>
            <Ionicons name={activityStatus.icon} size={16} color="#fff" />
            <Text style={styles.activityStatusText}>
              {activityStatus.text}
            </Text>
          </View>
        )}
        
        {activityDateStatus === 'valid' && (
          <View style={styles.autoDetectionNote}>
            <Ionicons name="time-outline" size={16} color="#fff" />
            <Text style={styles.autoDetectionText}>
              Status kehadiran akan ditentukan otomatis berdasarkan jadwal
            </Text>
          </View>
        )}
        
        {!isConnected && (
          <View style={styles.offlineIndicator}>
            <Ionicons name="cloud-offline" size={16} color="#fff" />
            <Text style={styles.offlineText}>Mode Offline</Text>
          </View>
        )}
      </View>
      
      {toastVisible && (
        <Animated.View style={[styles.toast, getToastStyle(), { opacity: fadeAnim }]}>
          <Ionicons name={getToastIcon()} size={20} color="#fff" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 16, paddingBottom: 30
  },
  activityName: { color: '#fff', fontSize: 14, textAlign: 'center', marginBottom: 6 },
  kelompokInfo: { color: '#fff', fontSize: 12, textAlign: 'center', marginBottom: 10, opacity: 0.8 },
  activityStatusNote: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 10, borderRadius: 6, marginBottom: 10
  },
  activityStatusText: { color: '#fff', marginLeft: 8, fontSize: 12, textAlign: 'center', fontWeight: '500' },
  autoDetectionNote: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(52, 152, 219, 0.7)', padding: 10, borderRadius: 6, marginBottom: 10
  },
  autoDetectionText: { color: '#fff', marginLeft: 8, fontSize: 12, textAlign: 'center' },
  offlineIndicator: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#e74c3c', padding: 6, borderRadius: 4
  },
  offlineText: { color: '#fff', marginLeft: 6, fontSize: 12 },
  toast: {
    position: 'absolute', bottom: 100, left: 20, right: 20,
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 3, elevation: 5
  },
  successToast: { backgroundColor: 'rgba(46, 204, 113, 0.9)' },
  warningToast: { backgroundColor: 'rgba(243, 156, 18, 0.9)' },
  errorToast: { backgroundColor: 'rgba(231, 76, 60, 0.9)' },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '500', marginLeft: 10, flex: 1 }
});

export default QrScannerTab;
