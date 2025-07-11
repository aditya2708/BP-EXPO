// src/features/adminCabang/screens/masterData/mataPelajaran/MataPelajaranFormScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import SafeAreaWrapper from '../../../../components/common/SafeAreaWrapper';
import FormHeader from '../../../../components/common/FormHeader';
import FormInput from '../../../../components/common/FormInput';
import FormDropdown from '../../../../components/common/FormDropdown';
import FormSubmitButton from '../../../../components/common/FormSubmitButton';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import { createMataPelajaran, updateMataPelajaran, fetchMataPelajaranById, clearForm } from '../../../redux/masterData/mataPelajaranSlice';
import { fetchJenjang } from '../../../redux/masterData/jenjangSlice';

const MataPelajaranFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { currentMataPelajaran, loading, error } = useSelector(state => state.mataPelajaran);
  const { jenjang } = useSelector(state => state.jenjang);
  const { id } = route.params || {};
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nama: '',
    jenjang_id: '',
    deskripsi: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchJenjang());
    if (isEdit && id) {
      dispatch(fetchMataPelajaranById(id));
    } else {
      dispatch(clearForm());
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentMataPelajaran) {
      setFormData({
        nama: currentMataPelajaran.nama || '',
        jenjang_id: currentMataPelajaran.jenjang_id || '',
        deskripsi: currentMataPelajaran.deskripsi || ''
      });
    }
  }, [currentMataPelajaran, isEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama mata pelajaran wajib diisi';
    if (formData.nama.length > 100) newErrors.nama = 'Nama maksimal 100 karakter';
    if (!formData.jenjang_id) newErrors.jenjang_id = 'Jenjang wajib dipilih';
    if (formData.deskripsi.length > 500) newErrors.deskripsi = 'Deskripsi maksimal 500 karakter';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await dispatch(updateMataPelajaran({ id, data: formData })).unwrap();
        Alert.alert('Sukses', 'Mata pelajaran berhasil diupdate');
      } else {
        await dispatch(createMataPelajaran(formData)).unwrap();
        Alert.alert('Sukses', 'Mata pelajaran berhasil ditambahkan');
      }
      navigation.goBack();
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

  const jenjangOptions = jenjang.map(j => ({ label: j.nama, value: j.id }));

  if (loading && isEdit && !currentMataPelajaran) {
    return <LoadingSpinner fullScreen message="Memuat data mata pelajaran..." />;
  }

  return (
    <SafeAreaWrapper>
      <FormHeader
        title={isEdit ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
        onBack={() => navigation.goBack()}
        error={error}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <FormInput
            label="Nama Mata Pelajaran"
            value={formData.nama}
            onChangeText={(value) => updateField('nama', value)}
            placeholder="Contoh: Matematika, Bahasa Indonesia"
            error={errors.nama}
            required
            maxLength={100}
          />
          
          <FormDropdown
            label="Jenjang"
            value={formData.jenjang_id}
            onValueChange={(value) => updateField('jenjang_id', value)}
            options={jenjangOptions}
            placeholder="Pilih jenjang"
            error={errors.jenjang_id}
            required
          />
          
          <FormInput
            label="Deskripsi"
            value={formData.deskripsi}
            onChangeText={(value) => updateField('deskripsi', value)}
            placeholder="Deskripsi optional..."
            multiline
            numberOfLines={4}
            error={errors.deskripsi}
            maxLength={500}
          />
        </View>
      </ScrollView>
      
      <FormSubmitButton
        title={isEdit ? 'Update Mata Pelajaran' : 'Tambah Mata Pelajaran'}
        onPress={handleSubmit}
        loading={loading}
        disabled={!formData.nama.trim() || !formData.jenjang_id}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
    gap: 16,
  },
});

export default MataPelajaranFormScreen;