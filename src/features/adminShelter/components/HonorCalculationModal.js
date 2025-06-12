import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import MonthYearPicker from './MonthYearPicker';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import Button from '../../../common/components/Button';

import {
  calculateHonor,
  selectHonorActionStatus,
  selectHonorActionError,
  resetActionStatus
} from '../redux/tutorHonorSlice';

const { width } = Dimensions.get('window');

const HonorCalculationModal = ({ 
  visible, 
  onClose, 
  tutorId, 
  tutorName,
  onSuccess 
}) => {
  const dispatch = useDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isConfirming, setIsConfirming] = useState(false);

  const calculateStatus = useSelector(state => selectHonorActionStatus(state, 'calculate'));
  const calculateError = useSelector(state => selectHonorActionError(state, 'calculate'));

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handleClose = () => {
    if (calculateStatus === 'loading') return;
    
    dispatch(resetActionStatus('calculate'));
    setIsConfirming(false);
    setShowPicker(false);
    onClose();
  };

  const handlePeriodSelect = () => {
    setShowPicker(true);
  };

  const handlePeriodConfirm = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setShowPicker(false);
  };

  const handleCalculate = () => {
    setIsConfirming(true);
    
    dispatch(calculateHonor({
      tutorId,
      data: { month: selectedMonth, year: selectedYear }
    }))
      .unwrap()
      .then(() => {
        Alert.alert('Berhasil', 'Honor berhasil dihitung', [
          {
            text: 'OK',
            onPress: () => {
              if (onSuccess) onSuccess();
              handleClose();
            }
          }
        ]);
      })
      .catch((error) => {
        Alert.alert('Gagal', error || 'Gagal menghitung honor');
        setIsConfirming(false);
      });
  };

  const isLoading = calculateStatus === 'loading';

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity 
                onPress={handleClose}
                disabled={isLoading}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.title}>Hitung Honor Tutor</Text>
              <View style={{ width: 24 }} />
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <LoadingSpinner size="large" />
                <Text style={styles.loadingText}>Menghitung honor...</Text>
              </View>
            ) : (
              <>
                <View style={styles.content}>
                  <View style={styles.tutorInfo}>
                    <Ionicons name="person-circle" size={40} color="#3498db" />
                    <View style={styles.tutorDetails}>
                      <Text style={styles.tutorName}>{tutorName}</Text>
                      <Text style={styles.tutorLabel}>Tutor</Text>
                    </View>
                  </View>

                  <View style={styles.periodSection}>
                    <Text style={styles.sectionLabel}>Periode Perhitungan</Text>
                    <TouchableOpacity
                      style={styles.periodSelector}
                      onPress={handlePeriodSelect}
                    >
                      <View style={styles.periodInfo}>
                        <Ionicons name="calendar" size={20} color="#3498db" />
                        <Text style={styles.periodText}>
                          {months[selectedMonth - 1]} {selectedYear}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.infoSection}>
                    <View style={styles.infoItem}>
                      <Ionicons name="information-circle" size={16} color="#f39c12" />
                      <Text style={styles.infoText}>
                        Honor dihitung berdasarkan aktivitas yang sudah dilakukan
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Ionicons name="cash" size={16} color="#27ae60" />
                      <Text style={styles.infoText}>
                        Rp 10.000 per siswa yang hadir
                      </Text>
                    </View>
                  </View>

                  {calculateError && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={16} color="#e74c3c" />
                      <Text style={styles.errorText}>{calculateError}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    title="Batal"
                    onPress={handleClose}
                    type="outline"
                    style={styles.cancelButton}
                    disabled={isLoading}
                  />
                  <Button
                    title="Hitung Honor"
                    onPress={handleCalculate}
                    style={styles.calculateButton}
                    disabled={isLoading}
                    loading={isConfirming}
                    leftIcon={<Ionicons name="calculator" size={20} color="#fff" />}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <MonthYearPicker
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onConfirm={handlePeriodConfirm}
        initialMonth={selectedMonth}
        initialYear={selectedYear}
        maxYear={new Date().getFullYear()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: width * 0.9,
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  tutorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  tutorDetails: {
    marginLeft: 12,
    flex: 1,
  },
  tutorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tutorLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  periodSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  periodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf2f2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#e74c3c',
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#e74c3c',
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  calculateButton: {
    flex: 2,
    marginLeft: 8,
  },
});

export default HonorCalculationModal;