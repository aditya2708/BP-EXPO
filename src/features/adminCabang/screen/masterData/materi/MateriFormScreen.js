// src/features/adminCabang/screens/masterData/materi/MateriFormScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import SafeAreaWrapper from '../../../../components/common/SafeAreaWrapper';
import FormHeader from '../../../../components/common/FormHeader';
import FormInput from '../../../../components/common/FormInput';
import FormDropdown from '../../../../components/common/FormDropdown';
import FormSubmitButton from '../../../../components/common/FormSubmitButton';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import { createMateri, updateMateri, fetchMateriById, clearForm } from '../../../redux/masterData/materiSlice';
import { fetchKelas } from '../../../redux/masterData/kelasSlice';
import { fetchMataPelajaran } from '../../../redux/masterData/mataPelajaranSlice';

const MateriFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { currentMateri, loading, error } = useSelector(state => state.materi);
  const { kelas } = useSelector(state => state.kelas);
  const { mataPelajaran } = useSelector(state => state.mataPelajaran);
  const { id } = route.params || {};
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nama: '',
    mata_pelajaran_id: '',
    kelas_id: '',
    deskripsi: '',
    konten: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchKelas());
    dispatch(fetchMataPelajaran());
    if (isEdit && id) {
      dispatch(fetchMateriById(id));
    } else {
      dispatch(clearForm());
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentMateri) {
      setFormData({
        nama: currentMateri.nama || '',
        mata_pelajaran_id: currentMateri.mata_pelajaran_id || '',
        kelas_id: currentMateri.kelas_id || '',
        deskripsi: currentMateri.deskripsi || '',
        konten: currentMateri.konten || ''
      });
    }
  }, [currentMateri, isEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama materi wajib diisi';
    if (formData.nama.length > 100) newErrors.nama = 'Nama maksimal 100 karakter';
    if (!formData.mata_pelajaran_id) newErrors.mata_pelajaran_id = 'Mata pelajaran wajib dipilih';
    if (!formData.kelas_id) newErrors.kelas_id = 'Kelas wajib dipilih';
    if (formData.deskripsi.length > 500) newErrors.deskripsi = 'Deskripsi maksimal 500 karakter';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await dispatch(updateMateri({ id, data: formData })).unwrap();
        Alert.alert('Sukses', 'Materi berhasil diupdate');
      } else {
        await dispatch(createMateri(formData)).unwrap();
        Alert.alert('Sukses', 'Materi berhasil ditambahkan');
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

  const mataPelajaranOptions = mataPelajaran.map(mp => ({ 
    label: `${mp.nama} (${mp.jenjang?.nama || 'Tanpa Jenjang'})`, 
    value: mp.id 
  }));

  const kelasOptions = kelas.map(k => ({ 
    label: `${k.nama} - T${k.tingkat} (${k.jenjang?.nama || 'Tanpa Jenjang'})`, 
    value: k.id 
  }));

  if (loading && isEdit && !currentMateri) {
    return <LoadingSpinner fullScreen message="Memuat data materi..." />;
  }

  return (
    <SafeAreaWrapper>
      <FormHeader
        title={isEdit ? 'Edit Materi' : 'Tambah Materi'}
        onBack={() => navigation.goBack()}
        error={error}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <FormInput
            label="Nama Materi"
            value={formData.nama}
            onChangeText={(value) => updateField('nama', value)}
            placeholder="Contoh: Perkalian Dasar, Sejarah Indonesia"
            error={errors.nama}
            required
            maxLength={100}
          />
          
          <FormDropdown
            label="Mata Pelajaran"
            value={formData.mata_pelajaran_id}
            onValueChange={(value) => updateField('mata_pelajaran_id', value)}
            options={mataPelajaranOptions}
            placeholder="Pilih mata pelajaran"
            error={errors.mata_pelajaran_id}
            required
          />
          
          <FormDropdown
            label="Kelas"
            value={formData.kelas_id}
            onValueChange={(value) => updateField('kelas_id', value)}
            options={kelasOptions}
            placeholder="Pilih kelas"
            error={errors.kelas_id}
            required
          />
          
          <FormInput
            label="Deskripsi"
            value={formData.deskripsi}
            onChangeText={(value) => updateField('deskripsi', value)}
            placeholder="Deskripsi singkat materi..."
            multiline
            numberOfLines={3}
            error={errors.deskripsi}
            maxLength={500}
          />
          
          <FormInput
            label="Konten Materi"
            value={formData.konten}
            onChangeText={(value) => updateField('konten', value)}
            placeholder="Isi detail materi pembelajaran..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
      
      <FormSubmitButton
        title={isEdit ? 'Update Materi' : 'Tambah Materi'}
        onPress={handleSubmit}
        loading={loading}
        disabled={!formData.nama.trim() || !formData.mata_pelajaran_id || !formData.kelas_id}
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

export default MateriFormScreen;