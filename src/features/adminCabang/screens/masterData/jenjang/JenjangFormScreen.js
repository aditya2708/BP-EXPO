import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import {
  selectJenjangLoading,
  selectJenjangError,
  clearJenjangError
} from '../../../redux/masterData/jenjangSlice';
import {
  createJenjang,
  updateJenjang
} from '../../../redux/masterData/jenjangThunks';

const JenjangFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectJenjangLoading);
  const error = useSelector(selectJenjangError);

  const { jenjang, isEdit } = route.params || {};

  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    status: 'aktif'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && jenjang) {
      setFormData({
        nama: jenjang.nama || '',
        deskripsi: jenjang.deskripsi || '',
        status: jenjang.status || 'aktif'
      });
    }
  }, [isEdit, jenjang]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearJenjangError());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama jenjang harus diisi';
    } else if (formData.nama.trim().length < 2) {
      newErrors.nama = 'Nama jenjang minimal 2 karakter';
    }

    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = 'Deskripsi harus diisi';
    } else if (formData.deskripsi.trim().length < 5) {
      newErrors.deskripsi = 'Deskripsi minimal 5 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const submitData = {
        nama: formData.nama.trim(),
        deskripsi: formData.deskripsi.trim(),
        status: formData.status
      };

      if (isEdit) {
        await dispatch(updateJenjang({ 
          id: jenjang.id, 
          data: submitData 
        })).unwrap();
        Alert.alert(
          'Berhasil',
          'Jenjang berhasil diperbarui',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        await dispatch(createJenjang(submitData)).unwrap();
        Alert.alert(
          'Berhasil',
          'Jenjang berhasil ditambahkan',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (err) {
      Alert.alert(
        'Error',
        err.message || `Gagal ${isEdit ? 'memperbarui' : 'menambahkan'} jenjang`
      );
    }
  };

  const renderInput = (label, field, placeholder, multiline = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
          errors[field] && styles.inputError
        ]}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Text style={styles.title}>
            {isEdit ? 'Edit Jenjang' : 'Tambah Jenjang'}
          </Text>

          {renderInput(
            'Nama Jenjang *',
            'nama',
            'Masukkan nama jenjang (contoh: SD, SMP, SMA)'
          )}

          {renderInput(
            'Deskripsi *',
            'deskripsi',
            'Masukkan deskripsi jenjang',
            true
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
                style={styles.picker}
              >
                <Picker.Item label="Aktif" value="aktif" />
                <Picker.Item label="Tidak Aktif" value="tidak_aktif" />
              </Picker>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isEdit ? 'Perbarui' : 'Simpan'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1
  },
  form: {
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333'
  },
  textArea: {
    height: 100,
    paddingTop: 12
  },
  inputError: {
    borderColor: '#dc3545'
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden'
  },
  picker: {
    height: 50
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 12
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d'
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default JenjangFormScreen;