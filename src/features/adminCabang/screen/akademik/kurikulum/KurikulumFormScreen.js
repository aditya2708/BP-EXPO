// src/features/adminCabang/screens/akademik/kurikulum/KurikulumFormScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import SafeAreaWrapper from '../../../../components/common/SafeAreaWrapper';
import FormHeader from '../../../../components/common/FormHeader';
import FormInput from '../../../../components/common/FormInput';
import FormDropdown from '../../../../components/common/FormDropdown';
import FormToggle from '../../../../components/common/FormToggle';
import FormSubmitButton from '../../../../components/common/FormSubmitButton';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import { createKurikulum, updateKurikulum, fetchKurikulumById, clearForm } from '../../../redux/akademik/kurikulumSlice';
import { fetchJenjang } from '../../../redux/masterData/jenjangSlice';

const KurikulumFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { currentKurikulum, loading, error } = useSelector(state => state.kurikulum);
  const { jenjang } = useSelector(state => state.jenjang);
  const { id } = route.params || {};
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nama: '',
    jenjang_id: '',
    tahun_ajaran: '',
    semester: '',
    deskripsi: '',
    is_active: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchJenjang());
    if (isEdit && id) {
      dispatch(fetchKurikulumById(id));
    } else {
      dispatch(clearForm());
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentKurikulum) {
      setFormData({
        nama: currentKurikulum.nama || '',
        jenjang_id: currentKurikulum.jenjang_id || '',
        tahun_ajaran: currentKurikulum.tahun_ajaran || '',
        semester: currentKurikulum.semester || '',
        deskripsi: currentKurikulum.deskripsi || '',
        is_active: currentKurikulum.is_active ?? true
      });
    }
  }, [currentKurikulum, isEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama kurikulum wajib diisi';
    if (formData.nama.length > 100) newErrors.nama = 'Nama maksimal 100 karakter';
    if (!formData.jenjang_id) newErrors.jenjang_id = 'Jenjang wajib dipilih';
    if (!formData.tahun_ajaran) newErrors.tahun_ajaran = 'Tahun ajaran wajib diisi';
    if (!formData.semester) newErrors.semester = 'Semester wajib dipilih';
    if (formData.deskripsi.length > 500) newErrors.deskripsi = 'Deskripsi maksimal 500 karakter';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await dispatch(updateKurikulum({ id, data: formData })).unwrap();
        Alert.alert('Sukses', 'Kurikulum berhasil diupdate');
      } else {
        await dispatch(createKurikulum(formData)).unwrap();
        Alert.alert('Sukses', 'Kurikulum berhasil dibuat. Selanjutnya assign materi dari master data.');
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
  const semesterOptions = [
    { label: 'Ganjil', value: 'ganjil' },
    { label: 'Genap', value: 'genap' }
  ];

  const currentYear = new Date().getFullYear();
  const tahunAjaranOptions = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear + i - 2;
    return { label: `${year}/${year + 1}`, value: `${year}/${year + 1}` };
  });

  if (loading && isEdit && !currentKurikulum) {
    return <LoadingSpinner fullScreen message="Memuat data kurikulum..." />;
  }

  return (
    <SafeAreaWrapper>
      <FormHeader
        title={isEdit ? 'Edit Kurikulum' : 'Buat Kurikulum'}
        onBack={() => navigation.goBack()}
        error={error}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <FormInput
            label="Nama Kurikulum"
            value={formData.nama}
            onChangeText={(value) => updateField('nama', value)}
            placeholder="Contoh: Kurikulum Merdeka SD 2024"
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
            label="Tahun Ajaran"
            value={formData.tahun_ajaran}
            onValueChange={(value) => updateField('tahun_ajaran', value)}
            options={tahunAjaranOptions}
            placeholder="Pilih tahun ajaran"
            error={errors.tahun_ajaran}
            required
          />
          
          <FormDropdown
            label="Semester"
            value={formData.semester}
            onValueChange={(value) => updateField('semester', value)}
            options={semesterOptions}
            placeholder="Pilih semester"
            error={errors.semester}
            required
          />
          
          <FormToggle
            label="Status Aktif"
            value={formData.is_active}
            onValueChange={(value) => updateField('is_active', value)}
            description="Kurikulum aktif dapat digunakan untuk semester baru"
          />
          
          <FormInput
            label="Deskripsi"
            value={formData.deskripsi}
            onChangeText={(value) => updateField('deskripsi', value)}
            placeholder="Deskripsi kurikulum..."
            multiline
            numberOfLines={4}
            error={errors.deskripsi}
            maxLength={500}
          />
        </View>
      </ScrollView>
      
      <FormSubmitButton
        title={isEdit ? 'Update Kurikulum' : 'Buat Kurikulum'}
        onPress={handleSubmit}
        loading={loading}
        disabled={!formData.nama.trim() || !formData.jenjang_id || !formData.tahun_ajaran || !formData.semester}
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

export default KurikulumFormScreen;