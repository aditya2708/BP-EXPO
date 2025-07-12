import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import LoadingSpinner from '../../../common/components/LoadingSpinner';
import FormDropdown from '../../../common/components/FormDropdown';
import {
  createSemester,
  updateSemester,
  fetchKurikulumDropdown,
  setSelectedKurikulum,
  clearSelectedKurikulum,
  selectSemesterLoading,
  selectKurikulumList,
  selectSelectedKurikulum,
  selectKurikulumOptions
} from '../redux/semesterSlice';

const SemesterFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { semester } = route.params || {};
  const isEdit = !!semester;
  
  const loading = useSelector(selectSemesterLoading);
  const kurikulumList = useSelector(selectKurikulumList);
  const selectedKurikulum = useSelector(selectSelectedKurikulum);
  const kurikulumOptions = useSelector(selectKurikulumOptions);
  
  const [formData, setFormData] = useState({
    nama_semester: '',
    tahun_ajaran: '',
    periode: 'ganjil',
    tanggal_mulai: new Date(),
    tanggal_selesai: new Date(),
    kurikulum_id: null,
    is_active: false
  });
  
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchKurikulumDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (semester) {
      setFormData({
        nama_semester: semester.nama_semester || '',
        tahun_ajaran: semester.tahun_ajaran || '',
        periode: semester.periode || 'ganjil',
        tanggal_mulai: semester.tanggal_mulai ? new Date(semester.tanggal_mulai) : new Date(),
        tanggal_selesai: semester.tanggal_selesai ? new Date(semester.tanggal_selesai) : new Date(),
        kurikulum_id: semester.kurikulum_id || null,
        is_active: semester.is_active || false
      });
      
      if (semester.kurikulum) {
        dispatch(setSelectedKurikulum(semester.kurikulum));
      }
    }
  }, [semester, dispatch]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleDateChange = (event, selectedDate, field) => {
    if (field === 'tanggal_mulai') {
      setShowStartDate(false);
    } else {
      setShowEndDate(false);
    }
    
    if (selectedDate) {
      handleInputChange(field, selectedDate);
    }
  };

  const handleKurikulumChange = (kurikulumId) => {
    const kurikulum = kurikulumList.find(k => k.id_kurikulum === kurikulumId);
    handleInputChange('kurikulum_id', kurikulumId);
    dispatch(setSelectedKurikulum(kurikulum || null));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama_semester.trim()) {
      newErrors.nama_semester = 'Nama semester harus diisi';
    }
    
    if (!formData.tahun_ajaran.trim()) {
      newErrors.tahun_ajaran = 'Tahun ajaran harus diisi';
    }
    
    if (formData.tanggal_selesai <= formData.tanggal_mulai) {
      newErrors.tanggal_selesai = 'Tanggal selesai harus setelah tanggal mulai';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        tanggal_mulai: formData.tanggal_mulai.toISOString().split('T')[0],
        tanggal_selesai: formData.tanggal_selesai.toISOString().split('T')[0]
      };

      if (isEdit) {
        await dispatch(updateSemester({
          id: semester.id_semester,
          semesterData: submitData
        })).unwrap();
        Alert.alert('Sukses', 'Semester berhasil diperbarui');
      } else {
        await dispatch(createSemester(submitData)).unwrap();
        Alert.alert('Sukses', 'Semester berhasil ditambahkan');
      }
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Gagal menyimpan semester');
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCurrentKurikulum = () => {
    return kurikulumList.find(k => k.id_kurikulum === formData.kurikulum_id);
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Menyimpan semester..." />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        
        {/* Basic Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Dasar</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Semester *</Text>
            <TextInput
              style={[styles.input, errors.nama_semester && styles.inputError]}
              value={formData.nama_semester}
              onChangeText={(value) => handleInputChange('nama_semester', value)}
              placeholder="Contoh: Semester Ganjil 2024/2025"
              maxLength={255}
            />
            {errors.nama_semester && (
              <Text style={styles.errorText}>{errors.nama_semester}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tahun Ajaran *</Text>
            <TextInput
              style={[styles.input, errors.tahun_ajaran && styles.inputError]}
              value={formData.tahun_ajaran}
              onChangeText={(value) => handleInputChange('tahun_ajaran', value)}
              placeholder="Contoh: 2024/2025"
              maxLength={20}
            />
            {errors.tahun_ajaran && (
              <Text style={styles.errorText}>{errors.tahun_ajaran}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Periode *</Text>
            <View style={styles.periodeContainer}>
              <TouchableOpacity
                style={[
                  styles.periodeButton,
                  formData.periode === 'ganjil' && styles.periodeButtonActive
                ]}
                onPress={() => handleInputChange('periode', 'ganjil')}
              >
                <Text style={[
                  styles.periodeText,
                  formData.periode === 'ganjil' && styles.periodeTextActive
                ]}>
                  Ganjil
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.periodeButton,
                  formData.periode === 'genap' && styles.periodeButtonActive
                ]}
                onPress={() => handleInputChange('periode', 'genap')}
              >
                <Text style={[
                  styles.periodeText,
                  formData.periode === 'genap' && styles.periodeTextActive
                ]}>
                  Genap
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Kurikulum Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kurikulum</Text>
          <Text style={styles.sectionSubtitle}>
            Pilih kurikulum yang akan digunakan (opsional)
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kurikulum</Text>
            <FormDropdown
              value={formData.kurikulum_id}
              onValueChange={handleKurikulumChange}
              options={kurikulumOptions}
              placeholder="Pilih kurikulum"
              style={styles.dropdown}
            />
            
            {getCurrentKurikulum() && (
              <View style={styles.kurikulumInfo}>
                <View style={styles.kurikulumHeader}>
                  <Ionicons name="book" size={16} color="#27ae60" />
                  <Text style={styles.kurikulumName}>
                    {getCurrentKurikulum().nama_kurikulum}
                  </Text>
                </View>
                <Text style={styles.kurikulumTahun}>
                  Tahun: {getCurrentKurikulum().tahun_berlaku}
                </Text>
                {getCurrentKurikulum().deskripsi && (
                  <Text style={styles.kurikulumDesc}>
                    {getCurrentKurikulum().deskripsi}
                  </Text>
                )}
                <TouchableOpacity 
                  style={styles.clearKurikulumButton}
                  onPress={() => handleKurikulumChange(null)}
                >
                  <Text style={styles.clearKurikulumText}>Hapus Kurikulum</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Date Range Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Periode Waktu</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tanggal Mulai *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartDate(true)}
            >
              <Text style={styles.dateText}>{formatDate(formData.tanggal_mulai)}</Text>
              <Ionicons name="calendar" size={20} color="#7f8c8d" />
            </TouchableOpacity>
            {showStartDate && (
              <DateTimePicker
                value={formData.tanggal_mulai}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => handleDateChange(event, date, 'tanggal_mulai')}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tanggal Selesai *</Text>
            <TouchableOpacity
              style={[styles.dateButton, errors.tanggal_selesai && styles.inputError]}
              onPress={() => setShowEndDate(true)}
            >
              <Text style={styles.dateText}>{formatDate(formData.tanggal_selesai)}</Text>
              <Ionicons name="calendar" size={20} color="#7f8c8d" />
            </TouchableOpacity>
            {showEndDate && (
              <DateTimePicker
                value={formData.tanggal_selesai}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => handleDateChange(event, date, 'tanggal_selesai')}
              />
            )}
            {errors.tanggal_selesai && (
              <Text style={styles.errorText}>{errors.tanggal_selesai}</Text>
            )}
          </View>
        </View>

        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          
          <View style={styles.switchContainer}>
            <View>
              <Text style={styles.label}>Semester Aktif</Text>
              <Text style={styles.switchNote}>
                Hanya satu semester yang dapat aktif dalam satu waktu
              </Text>
            </View>
            <Switch
              value={formData.is_active}
              onValueChange={(value) => handleInputChange('is_active', value)}
              trackColor={{ false: '#e0e0e0', true: '#e74c3c' }}
              thumbColor={formData.is_active ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {isEdit ? 'Perbarui Semester' : 'Simpan Semester'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  periodeContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    overflow: 'hidden',
  },
  periodeButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  periodeButtonActive: {
    backgroundColor: '#e74c3c',
  },
  periodeText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  periodeTextActive: {
    color: '#ffffff',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  dateText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  kurikulumInfo: {
    backgroundColor: '#f8fff8',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  kurikulumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  kurikulumName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
    marginLeft: 8,
    flex: 1,
  },
  kurikulumTahun: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  kurikulumDesc: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 8,
  },
  clearKurikulumButton: {
    alignSelf: 'flex-start',
  },
  clearKurikulumText: {
    fontSize: 12,
    color: '#e74c3c',
    textDecorationLine: 'underline',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchNote: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default SemesterFormScreen;