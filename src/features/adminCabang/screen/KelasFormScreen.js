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
import { Picker } from '@react-native-picker/picker';

import JenjangSelector from '../components/JenjangSelector';

import {
  createKelas,
  updateKelas,
  selectKelasLoading,
  selectKelasError
} from '../redux/kelasSlice';

import {
  fetchJenjangForDropdown
} from '../redux/jenjangSlice';

const KelasFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { kelas } = route.params || {};
  const isEdit = !!kelas;
  
  const loading = useSelector(selectKelasLoading);
  const error = useSelector(selectKelasError);
  
  const [formData, setFormData] = useState({
    id_jenjang: '',
    nama_kelas: '',
    jenis_kelas: 'standard',
    tingkat: '1',
    urutan: '1',
    deskripsi: '',
    is_active: true
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchJenjangForDropdown());
  }, []);

  useEffect(() => {
    if (kelas) {
      setFormData({
        id_jenjang: kelas.id_jenjang?.toString() || '',
        nama_kelas: kelas.nama_kelas || '',
        jenis_kelas: kelas.jenis_kelas || 'standard',
        tingkat: kelas.tingkat?.toString() || '1',
        urutan: kelas.urutan?.toString() || '1',
        deskripsi: kelas.deskripsi || '',
        is_active: kelas.is_active ?? true
      });
    }
  }, [kelas]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.id_jenjang) {
      newErrors.id_jenjang = 'Jenjang wajib dipilih';
    }
    
    if (!formData.nama_kelas.trim()) {
      newErrors.nama_kelas = 'Nama kelas wajib diisi';
    }
    
    if (formData.jenis_kelas === 'standard' && !formData.tingkat) {
      newErrors.tingkat = 'Tingkat wajib diisi untuk kelas standard';
    }
    
    if (formData.jenis_kelas === 'standard') {
      const tingkat = parseInt(formData.tingkat);
      if (isNaN(tingkat) || tingkat < 1 || tingkat > 12) {
        newErrors.tingkat = 'Tingkat harus antara 1-12';
      }
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
      tingkat: formData.jenis_kelas === 'standard' ? parseInt(formData.tingkat) : null,
      urutan: parseInt(formData.urutan)
    };
    
    try {
      if (isEdit) {
        await dispatch(updateKelas({
          id: kelas.id_kelas,
          kelasData: submitData
        })).unwrap();
        Alert.alert('Sukses', 'Kelas berhasil diperbarui', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await dispatch(createKelas(submitData)).unwrap();
        Alert.alert('Sukses', 'Kelas berhasil ditambahkan', [
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

  const handleJenisKelasChange = (jenis) => {
    updateField('jenis_kelas', jenis);
    if (jenis === 'standard') {
      updateField('nama_kelas', `Kelas ${getRomanNumeral(parseInt(formData.tingkat))}`);
    } else {
      updateField('nama_kelas', '');
    }
  };

  const handleTingkatChange = (tingkat) => {
    updateField('tingkat', tingkat);
    if (formData.jenis_kelas === 'standard') {
      updateField('nama_kelas', `Kelas ${getRomanNumeral(parseInt(tingkat))}`);
    }
  };

  const getRomanNumeral = (num) => {
    const numerals = {
      1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
      7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
    };
    return numerals[num] || num;
  };

  const jenisKelasOptions = [
    { label: 'Standard', value: 'standard' },
    { label: 'Custom', value: 'custom' }
  ];

  const tingkatOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1} (${getRomanNumeral(i + 1)})`,
    value: (i + 1).toString()
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formContainer}>
        <JenjangSelector
          selectedValue={formData.id_jenjang}
          onValueChange={(value) => updateField('id_jenjang', value)}
          required
        />
        {errors.id_jenjang && (
          <Text style={styles.errorText}>{errors.id_jenjang}</Text>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Jenis Kelas *</Text>
          <View style={[styles.pickerContainer, errors.jenis_kelas && styles.inputError]}>
            <Picker
              selectedValue={formData.jenis_kelas}
              onValueChange={handleJenisKelasChange}
              style={styles.picker}
            >
              {jenisKelasOptions.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
          {errors.jenis_kelas && (
            <Text style={styles.errorText}>{errors.jenis_kelas}</Text>
          )}
        </View>

        {formData.jenis_kelas === 'standard' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tingkat *</Text>
            <View style={[styles.pickerContainer, errors.tingkat && styles.inputError]}>
              <Picker
                selectedValue={formData.tingkat}
                onValueChange={handleTingkatChange}
                style={styles.picker}
              >
                {tingkatOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
            {errors.tingkat && (
              <Text style={styles.errorText}>{errors.tingkat}</Text>
            )}
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Kelas *</Text>
          <TextInput
            style={[styles.input, errors.nama_kelas && styles.inputError]}
            value={formData.nama_kelas}
            onChangeText={(value) => updateField('nama_kelas', value)}
            placeholder={formData.jenis_kelas === 'standard' ? 'Auto-generated' : 'Masukkan nama kelas custom'}
            placeholderTextColor="#999"
            editable={formData.jenis_kelas === 'custom'}
          />
          {formData.jenis_kelas === 'standard' && (
            <Text style={styles.helpText}>Nama otomatis berdasarkan tingkat</Text>
          )}
          {errors.nama_kelas && (
            <Text style={styles.errorText}>{errors.nama_kelas}</Text>
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
            placeholder="Deskripsi kelas"
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
            {formData.is_active ? 'Kelas aktif dan dapat digunakan' : 'Kelas tidak aktif'}
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

export default KelasFormScreen;