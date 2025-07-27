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
  selectJenjangValidationErrors,
  selectExistingUrutan,
  selectUrutanValidation,
  clearError,
  clearUrutanValidation,
  createJenjang,
  updateJenjang,
  getExistingUrutan,
  checkUrutanAvailability
} from '../../../redux/masterData/jenjangSlice';
import { formatValidationErrors } from '../../../../../common/utils/errorHandler';

const JenjangFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectJenjangLoading);
  const error = useSelector(selectJenjangError);
  const validationErrors = useSelector(selectJenjangValidationErrors);
  const existingUrutan = useSelector(selectExistingUrutan);
  const urutanValidation = useSelector(selectUrutanValidation);

  const { jenjang, isEdit } = route.params || {};
  const [namaJenjang, setNamaJenjang] = useState(jenjang?.nama_jenjang || '');
  const [kodeJenjang, setKodeJenjang] = useState(jenjang?.kode_jenjang || '');
  const [urutan, setUrutan] = useState(jenjang?.urutan?.toString() || '');
  const [deskripsi, setDeskripsi] = useState(jenjang?.deskripsi || '');
  const [isActive, setIsActive] = useState(jenjang?.is_active !== undefined ? jenjang.is_active : true);
  
  // Local validation states
  const [urutanError, setUrutanError] = useState('');
  const [checkingUrutan, setCheckingUrutan] = useState(false);


  // Load existing urutan on component mount
  useEffect(() => {
    dispatch(getExistingUrutan());
  }, [dispatch]);

  // Handle general errors
  useEffect(() => {
    if (error) {
      let alertMessage = error;
      
      // If there are validation errors, format them nicely
      if (validationErrors) {
        const formattedErrors = formatValidationErrors(validationErrors);
        if (formattedErrors) {
          alertMessage = `${error}\n\nDetail kesalahan:\n${formattedErrors}`;
        }
      }
      
      Alert.alert(
        'Error Validasi', 
        alertMessage, 
        [{ text: 'OK', onPress: () => dispatch(clearError()) }]
      );
    }
  }, [error, validationErrors, dispatch]);

  // Real-time urutan validation
  const validateUrutan = (urutanValue) => {
    if (!urutanValue || urutanValue.trim() === '') {
      setUrutanError('');
      return true;
    }

    const urutanNum = parseInt(urutanValue);
    if (isNaN(urutanNum)) {
      setUrutanError('Urutan harus berupa angka');
      return false;
    }

    if (urutanNum < 1) {
      setUrutanError('Urutan harus lebih besar dari 0');
      return false;
    }

    // Check for duplicates
    const isDuplicate = existingUrutan.includes(urutanNum) && 
                       (!isEdit || urutanNum !== jenjang?.urutan);
    
    if (isDuplicate) {
      setUrutanError(`Urutan ${urutanNum} sudah digunakan`);
      return false;
    }

    setUrutanError('');
    return true;
  };

  // Handle urutan change with validation
  const handleUrutanChange = (value) => {
    setUrutan(value);
    validateUrutan(value);
  };

  const handleSubmit = () => {
    // Clear previous validation errors
    dispatch(clearError());
    dispatch(clearUrutanValidation());

    // Basic validation
    if (!namaJenjang.trim()) {
      Alert.alert('Error', 'Nama jenjang harus diisi');
      return;
    }
    if (!kodeJenjang.trim()) {
      Alert.alert('Error', 'Kode jenjang harus diisi');
      return;
    }
    if (!urutan.trim()) {
      Alert.alert('Error', 'Urutan harus diisi');
      return;
    }

    // Validate urutan before submission
    if (!validateUrutan(urutan)) {
      Alert.alert('Error', urutanError || 'Urutan tidak valid');
      return;
    }

    // Additional urutan validation
    const urutanNum = parseInt(urutan);
    if (existingUrutan.includes(urutanNum) && (!isEdit || urutanNum !== jenjang?.urutan)) {
      Alert.alert(
        'Error', 
        `Urutan ${urutanNum} sudah digunakan oleh jenjang lain. Silakan pilih urutan yang berbeda.`
      );
      return;
    }

    const data = {
      nama_jenjang: namaJenjang.trim(),
      kode_jenjang: kodeJenjang.trim().toUpperCase(),
      urutan: parseInt(urutan),
      deskripsi: deskripsi.trim(),
      is_active: isActive
    };

    if (isEdit) {
      dispatch(updateJenjang({ id: jenjang.id_jenjang, data }))
        .unwrap()
        .then(() => {
          Alert.alert('Berhasil', 'Jenjang berhasil diperbarui');
          navigation.goBack();
        })
        .catch(err => {
          // Error akan ditangani oleh useEffect di atas
          console.log('Update error handled by useEffect:', err);
        });
    } else {
      dispatch(createJenjang(data))
        .unwrap()
        .then(() => {
          Alert.alert('Berhasil', 'Jenjang berhasil dibuat');
          navigation.goBack();
        })
        .catch(err => {
          // Error akan ditangani oleh useEffect di atas
          console.log('Create error handled by useEffect:', err);
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Edit Jenjang' : 'Tambah Jenjang'}</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nama Jenjang *</Text>
        <TextInput
          style={[
            styles.input,
            validationErrors?.nama_jenjang && styles.inputError
          ]}
          placeholder="Contoh: Sekolah Dasar"
          value={namaJenjang}
          onChangeText={setNamaJenjang}
        />
        {validationErrors?.nama_jenjang && (
          <Text style={styles.errorText}>
            {Array.isArray(validationErrors.nama_jenjang) 
              ? validationErrors.nama_jenjang[0] 
              : validationErrors.nama_jenjang}
          </Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Kode Jenjang *</Text>
        <TextInput
          style={[
            styles.input,
            validationErrors?.kode_jenjang && styles.inputError
          ]}
          placeholder="Contoh: SD"
          value={kodeJenjang}
          onChangeText={setKodeJenjang}
          maxLength={10}
          autoCapitalize="characters"
        />
        {validationErrors?.kode_jenjang && (
          <Text style={styles.errorText}>
            {Array.isArray(validationErrors.kode_jenjang) 
              ? validationErrors.kode_jenjang[0] 
              : validationErrors.kode_jenjang}
          </Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Urutan *</Text>
        <TextInput
          style={[
            styles.input,
            (validationErrors?.urutan || urutanError) && styles.inputError
          ]}
          placeholder="Contoh: 1"
          value={urutan}
          onChangeText={handleUrutanChange}
          keyboardType="numeric"
        />
        {(validationErrors?.urutan || urutanError) && (
          <Text style={styles.errorText}>
            {urutanError || 
             (Array.isArray(validationErrors.urutan) 
               ? validationErrors.urutan[0] 
               : validationErrors.urutan)}
          </Text>
        )}
        {urutan && !urutanError && existingUrutan.length > 0 && (
          <Text style={styles.successText}>
            ✓ Urutan {urutan} tersedia
          </Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Deskripsi</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Deskripsi jenjang..."
          value={deskripsi}
          onChangeText={setDeskripsi}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={isActive}
            onValueChange={(val) => setIsActive(val)}
            style={styles.picker}
          >
            <Picker.Item label="Aktif" value={true} />
            <Picker.Item label="Tidak Aktif" value={false} />
          </Picker>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator />
          : <Text style={styles.submitButtonText}>{isEdit ? 'Update' : 'Submit'}</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333'
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  picker: {
    height: 50
  },
  submitButton: {
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
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic'
  },
  successText: {
    color: '#27ae60',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic'
  }
});

export default JenjangFormScreen;
