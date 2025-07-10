import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import {
  createJenjang,
  updateJenjang,
  selectJenjangLoading,
  selectJenjangError
} from '../redux/jenjangSlice';

const JenjangFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { jenjang } = route.params || {};
  const isEdit = !!jenjang;
  
  const loading = useSelector(selectJenjangLoading);
  const error = useSelector(selectJenjangError);
  
  const [formData, setFormData] = useState({
    nama_jenjang: '',
    kode_jenjang: '',
    urutan: '1',
    deskripsi: '',
    is_active: true
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (jenjang) {
      setFormData({
        nama_jenjang: jenjang.nama_jenjang || '',
        kode_jenjang: jenjang.kode_jenjang || '',
        urutan: jenjang.urutan?.toString() || '1',
        deskripsi: jenjang.deskripsi || '',
        is_active: jenjang.is_active ?? true
      });
    }
  }, [jenjang]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama_jenjang.trim()) {
      newErrors.nama_jenjang = 'Nama jenjang wajib diisi';
    }
    
    if (!formData.kode_jenjang.trim()) {
      newErrors.kode_jenjang = 'Kode jenjang wajib diisi';
    }
    
    if (!/^[A-Z]{2,5}$/.test(formData.kode_jenjang.trim())) {
      newErrors.kode_jenjang = 'Kode harus huruf kapital 2-5 karakter (contoh: SD, SMP)';
    }
    
    const urutan = parseInt(formData.urutan);
    if (!urutan || urutan < 1 || urutan > 100) {
      newErrors.urutan = 'Urutan harus angka 1-100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    const submitData = {
      ...formData,
      urutan: parseInt(formData.urutan)
    };
    
    try {
      if (isEdit) {
        await dispatch(updateJenjang({
          id: jenjang.id_jenjang,
          jenjangData: submitData
        })).unwrap();
        Alert.alert('Sukses', 'Jenjang berhasil diperbarui', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await dispatch(createJenjang(submitData)).unwrap();
        Alert.alert('Sukses', 'Jenjang berhasil ditambahkan', [
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Jenjang *</Text>
          <TextInput
            style={[styles.input, errors.nama_jenjang && styles.inputError]}
            value={formData.nama_jenjang}
            onChangeText={(value) => updateField('nama_jenjang', value)}
            placeholder="Contoh: Sekolah Dasar"
            placeholderTextColor="#999"
          />
          {errors.nama_jenjang && (
            <Text style={styles.errorText}>{errors.nama_jenjang}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kode Jenjang *</Text>
          <TextInput
            style={[styles.input, errors.kode_jenjang && styles.inputError]}
            value={formData.kode_jenjang}
            onChangeText={(value) => updateField('kode_jenjang', value.toUpperCase())}
            placeholder="Contoh: SD"
            placeholderTextColor="#999"
            maxLength={5}
            autoCapitalize="characters"
          />
          <Text style={styles.helpText}>Huruf kapital 2-5 karakter</Text>
          {errors.kode_jenjang && (
            <Text style={styles.errorText}>{errors.kode_jenjang}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Urutan *</Text>
          <TextInput
            style={[styles.input, errors.urutan && styles.inputError]}
            value={formData.urutan}
            onChangeText={(value) => updateField('urutan', value)}
            placeholder="1"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={3}
          />
          <Text style={styles.helpText}>Urutan tampilan (1-100)</Text>
          {errors.urutan && (
            <Text style={styles.errorText}>{errors.urutan}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.deskripsi}
            onChangeText={(value) => updateField('deskripsi', value)}
            placeholder="Deskripsi jenjang pendidikan"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.switchGroup}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Status Aktif</Text>
            <Switch
              value={formData.is_active}
              onValueChange={(value) => updateField('is_active', value)}
              trackColor={{ false: '#767577', true: '#2ecc71' }}
              thumbColor={formData.is_active ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          <Text style={styles.switchHelp}>
            {formData.is_active ? 'Jenjang aktif dan dapat digunakan' : 'Jenjang tidak aktif'}
          </Text>
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
  switchGroup: {
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  switchHelp: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
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

export default JenjangFormScreen;