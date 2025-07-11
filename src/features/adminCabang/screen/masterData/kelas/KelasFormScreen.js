// src/features/adminCabang/screens/masterData/kelas/KelasFormScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import SafeAreaWrapper from '../../../../components/common/SafeAreaWrapper';
import FormHeader from '../../../../components/common/FormHeader';
import FormInput from '../../../../components/common/FormInput';
import FormDropdown from '../../../../components/common/FormDropdown';
import FormSubmitButton from '../../../../components/common/FormSubmitButton';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import { createKelas, updateKelas, fetchKelasById, clearForm } from '../../../redux/masterData/kelasSlice';
import { fetchJenjang } from '../../../redux/masterData/jenjangSlice';

const KelasFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { currentKelas, loading, error } = useSelector(state => state.kelas);
  const { jenjang } = useSelector(state => state.jenjang);
  const { id } = route.params || {};
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nama: '',
    jenjang_id: '',
    tingkat: '',
    deskripsi: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchJenjang());
    if (isEdit && id) {
      dispatch(fetchKelasById(id));
    } else {
      dispatch(clearForm());
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentKelas) {
      setFormData({
        nama: currentKelas.nama || '',
        jenjang_id: currentKelas.jenjang_id || '',
        tingkat: currentKelas.tingkat?.toString() || '',
        deskripsi: currentKelas.deskripsi || ''
      });
    }
  }, [currentKelas, isEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama kelas wajib diisi';
    if (formData.nama.length > 100) newErrors.nama = 'Nama maksimal 100 karakter';
    if (!formData.jenjang_id) newErrors.jenjang_id = 'Jenjang wajib dipilih';
    if (!formData.tingkat) newErrors.tingkat = 'Tingkat wajib diisi';
    if (isNaN(formData.tingkat) || formData.tingkat < 1 || formData.tingkat > 12) {
      newErrors.tingkat = 'Tingkat harus angka 1-12';
    }
    if (formData.deskripsi.length > 500) newErrors.deskripsi = 'Deskripsi maksimal 500 karakter';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      tingkat: parseInt(formData.tingkat)
    };

    try {
      if (isEdit) {
        await dispatch(updateKelas({ id, data: submitData })).unwrap();
        Alert.alert('Sukses', 'Kelas berhasil diupdate');
      } else {
        await dispatch(createKelas(submitData)).unwrap();
        Alert.alert('Sukses', 'Kelas berhasil ditambahkan');
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
  const tingkatOptions = Array.from({ length: 12 }, (_, i) => ({ 
    label: `Tingkat ${i + 1}`, 
    value: (i + 1).toString() 
  }));

  if (loading && isEdit && !currentKelas) {
    return <LoadingSpinner fullScreen message="Memuat data kelas..." />;
  }

  return (
    <SafeAreaWrapper>
      <FormHeader
        title={isEdit ? 'Edit Kelas' : 'Tambah Kelas'}
        onBack={() => navigation.goBack()}
        error={error}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <FormInput
            label="Nama Kelas"
            value={formData.nama}
            onChangeText={(value) => updateField('nama', value)}
            placeholder="Contoh: Kelas 1A, VII-A"
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
          
          <FormDropdown
            label="Tingkat"
            value={formData.tingkat}
            onValueChange={(value) => updateField('tingkat', value)}
            options={tingkatOptions}
            placeholder="Pilih tingkat"
            error={errors.tingkat}
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
        title={isEdit ? 'Update Kelas' : 'Tambah Kelas'}
        onPress={handleSubmit}
        loading={loading}
        disabled={!formData.nama.trim() || !formData.jenjang_id || !formData.tingkat}
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

export default KelasFormScreen;