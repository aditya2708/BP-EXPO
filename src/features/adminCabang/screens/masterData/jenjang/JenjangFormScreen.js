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
  clearError
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
  const [namaJenjang, setNamaJenjang] = useState(jenjang?.nama || '');
  const [status, setStatus] = useState(jenjang?.status || 'aktif');

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: () => dispatch(clearError()) }]);
    }
  }, [error, dispatch]);

  const handleSubmit = () => {
    const data = { nama: namaJenjang, status };
    if (isEdit) {
      dispatch(updateJenjang({ id: jenjang.id_jenjang, data }))
        .unwrap()
        .then(() => navigation.goBack());
    } else {
      dispatch(createJenjang(data))
        .unwrap()
        .then(() => navigation.goBack());
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Edit Jenjang' : 'Tambah Jenjang'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama Jenjang"
        value={namaJenjang}
        onChangeText={setNamaJenjang}
      />
      <Picker
        selectedValue={status}
        onValueChange={(val) => setStatus(val)}
        style={styles.picker}
      >
        <Picker.Item label="Aktif" value="aktif" />
        <Picker.Item label="Tidak Aktif" value="tidak_aktif" />
      </Picker>
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
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  picker: {
    marginBottom: 16
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
