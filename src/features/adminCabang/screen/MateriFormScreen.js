import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import JenjangSelector from '../components/JenjangSelector';
import KelasSelector from '../components/KelasSelector';

import {
  createMateri,
  updateMateri,
  selectMateriLoading,
  selectMateriError
} from '../redux/materiSlice';

import {
  fetchJenjangForDropdown
} from '../redux/jenjangSlice';

import {
  fetchKelasByJenjang
} from '../redux/kelasSlice';

const MateriFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { materi } = route.params || {};
  const isEdit = !!materi;
  
  const loading = useSelector(selectMateriLoading);
  const error = useSelector(selectMateriError);
  
  const [formData, setFormData] = useState({
    jenjang: '',
    id_kelas: '',
    mata_pelajaran: '',
    nama_materi: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchJenjangForDropdown());
  }, []);

  useEffect(() => {
    if (materi) {
      const jenjangId = materi.kelas?.id_jenjang?.toString() || '';
      setFormData({
        jenjang: jenjangId,
        id_kelas: materi.id_kelas?.toString() || '',
        mata_pelajaran: materi.mata_pelajaran || '',
        nama_materi: materi.nama_materi || ''
      });
      
      if (jenjangId) {
        dispatch(fetchKelasByJenjang(jenjangId));
      }
    }
  }, [materi]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.jenjang) {
      newErrors.jenjang = 'Jenjang wajib dipilih';
    }
    
    if (!formData.id_kelas) {
      newErrors.id_kelas = 'Kelas wajib dipilih';
    }
    
    if (!formData.mata_pelajaran.trim()) {
      newErrors.mata_pelajaran = 'Mata pelajaran wajib diisi';
    }
    
    if (!formData.nama_materi.trim()) {
      newErrors.nama_materi = 'Nama materi wajib diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    const submitData = {
      id_kelas: formData.id_kelas,
      mata_pelajaran: formData.mata_pelajaran.trim(),
      nama_materi: formData.nama_materi.trim()
    };
    
    try {
      if (isEdit) {
        await dispatch(updateMateri({
          id: materi.id_materi,
          materiData: submitData
        })).unwrap();
        Alert.alert('Sukses', 'Materi berhasil diperbarui', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await dispatch(createMateri(submitData)).unwrap();
        Alert.alert('Sukses', 'Materi berhasil ditambahkan', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Terjadi kesalahan');
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleJenjangChange = (jenjangId) => {
    updateField('jenjang', jenjangId);
    updateField('id_kelas', '');
    
    if (jenjangId) {
      dispatch(fetchKelasByJenjang(jenjangId));
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formContainer}>
        <JenjangSelector
          selectedValue={formData.jenjang}
          onValueChange={handleJenjangChange}
          required
        />
        {errors.jenjang && (
          <Text style={styles.errorText}>{errors.jenjang}</Text>
        )}

        <KelasSelector
          selectedValue={formData.id_kelas}
          onValueChange={(value) => updateField('id_kelas', value)}
          jenjangId={formData.jenjang}
          disabled={!formData.jenjang}
          required
        />
        {errors.id_kelas && (
          <Text style={styles.errorText}>{errors.id_kelas}</Text>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mata Pelajaran *</Text>
          <TextInput
            style={[styles.input, errors.mata_pelajaran && styles.inputError]}
            value={formData.mata_pelajaran}
            onChangeText={(value) => updateField('mata_pelajaran', value)}
            placeholder="Contoh: Matematika, Bahasa Indonesia"
            placeholderTextColor="#999"
          />
          <Text style={styles.helpText}>Nama mata pelajaran untuk materi ini</Text>
          {errors.mata_pelajaran && (
            <Text style={styles.errorText}>{errors.mata_pelajaran}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Materi *</Text>
          <TextInput
            style={[styles.input, errors.nama_materi && styles.inputError]}
            value={formData.nama_materi}
            onChangeText={(value) => updateField('nama_materi', value)}
            placeholder="Contoh: Penjumlahan dan Pengurangan"
            placeholderTextColor="#999"
          />
          <Text style={styles.helpText}>Nama spesifik materi pembelajaran</Text>
          {errors.nama_materi && (
            <Text style={styles.errorText}>{errors.nama_materi}</Text>
          )}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Batal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>
                {isEdit ? 'Perbarui' : 'Simpan'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorMessage: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MateriFormScreen;