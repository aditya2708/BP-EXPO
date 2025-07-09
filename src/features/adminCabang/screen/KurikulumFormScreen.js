// 14. src/features/adminCabang/screens/KurikulumFormScreen.js
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
  createKurikulum,
  updateKurikulum,
  selectKurikulumLoading,
  selectKurikulumError
} from '../redux/kurikulumSlice';

const KurikulumFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { kurikulum } = route.params || {};
  const isEdit = !!kurikulum;
  
  const loading = useSelector(selectKurikulumLoading);
  const error = useSelector(selectKurikulumError);
  
  const [formData, setFormData] = useState({
    nama_kurikulum: '',
    deskripsi: '',
    tahun_berlaku: new Date().getFullYear().toString(),
    status: 'draft'
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (kurikulum) {
      setFormData({
        nama_kurikulum: kurikulum.nama_kurikulum || '',
        deskripsi: kurikulum.deskripsi || '',
        tahun_berlaku: kurikulum.tahun_berlaku || new Date().getFullYear().toString(),
        status: kurikulum.status || 'draft'
      });
    }
  }, [kurikulum]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama_kurikulum.trim()) {
      newErrors.nama_kurikulum = 'Nama kurikulum wajib diisi';
    }
    
    if (!formData.tahun_berlaku.trim()) {
      newErrors.tahun_berlaku = 'Tahun berlaku wajib diisi';
    }
    
    if (!/^\d{4}$/.test(formData.tahun_berlaku)) {
      newErrors.tahun_berlaku = 'Format tahun tidak valid (contoh: 2024)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      if (isEdit) {
        await dispatch(updateKurikulum({
          id: kurikulum.id_kurikulum,
          kurikulumData: formData
        })).unwrap();
        Alert.alert('Sukses', 'Kurikulum berhasil diperbarui', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await dispatch(createKurikulum(formData)).unwrap();
        Alert.alert('Sukses', 'Kurikulum berhasil ditambahkan', [
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

  const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Aktif', value: 'aktif' },
    { label: 'Non Aktif', value: 'nonaktif' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Kurikulum *</Text>
          <TextInput
            style={[styles.input, errors.nama_kurikulum && styles.inputError]}
            value={formData.nama_kurikulum}
            onChangeText={(value) => updateField('nama_kurikulum', value)}
            placeholder="Masukkan nama kurikulum"
            placeholderTextColor="#999"
          />
          {errors.nama_kurikulum && (
            <Text style={styles.errorText}>{errors.nama_kurikulum}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.deskripsi}
            onChangeText={(value) => updateField('deskripsi', value)}
            placeholder="Masukkan deskripsi kurikulum"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tahun Berlaku *</Text>
          <TextInput
            style={[styles.input, errors.tahun_berlaku && styles.inputError]}
            value={formData.tahun_berlaku}
            onChangeText={(value) => updateField('tahun_berlaku', value)}
            placeholder="Contoh: 2024"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={4}
          />
          {errors.tahun_berlaku && (
            <Text style={styles.errorText}>{errors.tahun_berlaku}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.status}
              onValueChange={(value) => updateField('status', value)}
              style={styles.picker}
            >
              {statusOptions.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
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
  textArea: {
    height: 100,
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

export default KurikulumFormScreen;