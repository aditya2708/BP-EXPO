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
  clearError,
  createJenjang,
  updateJenjang
} from '../../../redux/masterData/jenjangSlice';

const JenjangFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectJenjangLoading);
  const error = useSelector(selectJenjangError);

  const { jenjang, isEdit } = route.params || {};
  const [namaJenjang, setNamaJenjang] = useState(jenjang?.nama_jenjang || '');
  const [kodeJenjang, setKodeJenjang] = useState(jenjang?.kode_jenjang || '');
  const [urutan, setUrutan] = useState(jenjang?.urutan?.toString() || '');
  const [deskripsi, setDeskripsi] = useState(jenjang?.deskripsi || '');
  const [isActive, setIsActive] = useState(jenjang?.is_active !== undefined ? jenjang.is_active : true);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: () => dispatch(clearError()) }]);
    }
  }, [error, dispatch]);

  const handleSubmit = () => {
    // Validation
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
          Alert.alert('Error', err.message || 'Gagal memperbarui jenjang');
        });
    } else {
      dispatch(createJenjang(data))
        .unwrap()
        .then(() => {
          Alert.alert('Berhasil', 'Jenjang berhasil dibuat');
          navigation.goBack();
        })
        .catch(err => {
          Alert.alert('Error', err.message || 'Gagal membuat jenjang');
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Edit Jenjang' : 'Tambah Jenjang'}</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nama Jenjang *</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Sekolah Dasar"
          value={namaJenjang}
          onChangeText={setNamaJenjang}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Kode Jenjang *</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: SD"
          value={kodeJenjang}
          onChangeText={setKodeJenjang}
          maxLength={10}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Urutan *</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 1"
          value={urutan}
          onChangeText={setUrutan}
          keyboardType="numeric"
        />
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
  }
});

export default JenjangFormScreen;
