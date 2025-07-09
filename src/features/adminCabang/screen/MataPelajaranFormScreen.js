// 16. src/features/adminCabang/screens/MataPelajaranFormScreen.js
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
import { Picker } from '@react-native-picker/picker';

import {
  createMataPelajaran,
  updateMataPelajaran,
  fetchKategoriOptions,
  selectMataPelajaranLoading,
  selectMataPelajaranError,
  selectKategoriOptions
} from '../redux/mataPelajaranSlice';

const MataPelajaranFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { mataPelajaran } = route.params || {};
  const isEdit = !!mataPelajaran;
  
  const loading = useSelector(selectMataPelajaranLoading);
  const error = useSelector(selectMataPelajaranError);
  const kategoriOptions = useSelector(selectKategoriOptions);
  
  const [formData, setFormData] = useState({
    nama_mata_pelajaran: '',
    kategori: 'wajib',
    bobot_sks: '1'
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchKategoriOptions());
  }, []);

  useEffect(() => {
    if (mataPelajaran) {
      setFormData({
        nama_mata_pelajaran: mataPelajaran.nama_mata_pelajaran || '',
        kategori: mataPelajaran.kategori || 'wajib',
        bobot_sks: mataPelajaran.bobot_sks?.toString() || '1'
      });
    }
  }, [mataPelajaran]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama_mata_pelajaran.trim()) {
      newErrors.nama_mata_pelajaran = 'Nama mata pelajaran wajib diisi';
    }
    
    if (!formData.kategori) {
      newErrors.kategori = 'Kategori wajib dipilih';
    }
    
    const bobotSks = parseInt(formData.bobot_sks);
    if (!bobotSks || bobotSks < 1 || bobotSks > 10) {
      newErrors.bobot_sks = 'Bobot SKS harus antara 1-10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    const submitData = {
      ...formData,
      bobot_sks: parseInt(formData.bobot_sks)
    };
    
    try {
      if (isEdit) {
        await dispatch(updateMataPelajaran({
          id: mataPelajaran.id_mata_pelajaran,
          mataPelajaranData: submitData
        })).unwrap();
        Alert.alert('Sukses', 'Mata pelajaran berhasil diperbarui', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await dispatch(createMataPelajaran(submitData)).unwrap();
        Alert.alert('Sukses', 'Mata pelajaran berhasil ditambahkan', [
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

  const defaultKategoriOptions = [
    { label: 'Wajib', value: 'wajib' },
    { label: 'Pilihan', value: 'pilihan' },
    { label: 'Muatan Lokal', value: 'muatan_lokal' },
    { label: 'Ekstrakurikuler', value: 'ekstrakurikuler' }
  ];

  const kategoriToShow = kategoriOptions.length > 0 ? kategoriOptions : defaultKategoriOptions;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Mata Pelajaran *</Text>
          <TextInput
            style={[styles.input, errors.nama_mata_pelajaran && styles.inputError]}
            value={formData.nama_mata_pelajaran}
            onChangeText={(value) => updateField('nama_mata_pelajaran', value)}
            placeholder="Masukkan nama mata pelajaran"
            placeholderTextColor="#999"
          />
          {errors.nama_mata_pelajaran && (
            <Text style={styles.errorText}>{errors.nama_mata_pelajaran}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kategori *</Text>
          <View style={[styles.pickerContainer, errors.kategori && styles.inputError]}>
            <Picker
              selectedValue={formData.kategori}
              onValueChange={(value) => updateField('kategori', value)}
              style={styles.picker}
            >
              {kategoriToShow.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
          {errors.kategori && (
            <Text style={styles.errorText}>{errors.kategori}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bobot SKS *</Text>
          <TextInput
            style={[styles.input, errors.bobot_sks && styles.inputError]}
            value={formData.bobot_sks}
            onChangeText={(value) => updateField('bobot_sks', value)}
            placeholder="1-10"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={2}
          />
          <Text style={styles.helpText}>Bobot SKS antara 1-10</Text>
          {errors.bobot_sks && (
            <Text style={styles.errorText}>{errors.bobot_sks}</Text>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
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

export default MataPelajaranFormScreen;