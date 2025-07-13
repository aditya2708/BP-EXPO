// src/features/adminCabang/screens/akademik/kurikulum/KurikulumFormScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import SafeAreaWrapper from '../../../../../common/components/SafeAreaWrapper';
import FormHeader from '../../../../../common/components/FormHeader';
import FormInput from '../../../../../common/components/FormInput';
import FormDropdown from '../../../../../common/components/FormDropdown';
import FormToggle from '../../../../../common/components/FormToggle';
import FormSubmitButton from '../../../../../common/components/FormSubmitButton';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import { 
  createKurikulum, 
  updateKurikulum, 
  fetchKurikulumById, 
  clearCurrentKurikulum,
  selectCurrentKurikulum,
  selectKurikulumLoading,
  selectKurikulumError
} from '../../../redux/akademik/kurikulumSlice';
import { fetchJenjang } from '../../../redux/masterData/jenjangSlice';

const KurikulumFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const currentKurikulum = useSelector(selectCurrentKurikulum);
  const loading = useSelector(selectKurikulumLoading);
  const error = useSelector(selectKurikulumError);
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
      dispatch(clearCurrentKurikulum());
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
  }, [isEdit, currentKurikulum]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama kurikulum harus diisi';
    }
    
    if (!formData.jenjang_id) {
      newErrors.jenjang_id = 'Jenjang harus dipilih';
    }
    
    if (!formData.tahun_ajaran.trim()) {
      newErrors.tahun_ajaran = 'Tahun ajaran harus diisi';
    }
    
    if (!formData.semester.trim()) {
      newErrors.semester = 'Semester harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await dispatch(updateKurikulum({ id, data: formData })).unwrap();
        Alert.alert('Sukses', 'Kurikulum berhasil diperbarui');
      } else {
        await dispatch(createKurikulum(formData)).unwrap();
        Alert.alert('Sukses', 'Kurikulum berhasil dibuat');
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || `Gagal ${isEdit ? 'memperbarui' : 'membuat'} kurikulum`);
    }
  };

  // Generate dropdown options
  const jenjangOptions = Array.isArray(jenjang) ? jenjang.map(j => ({
    label: j.nama_jenjang,
    value: j.id_jenjang
  })) : [];

  const semesterOptions = [
    { label: 'Ganjil', value: 'Ganjil' },
    { label: 'Genap', value: 'Genap' }
  ];

  // Generate tahun ajaran options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const tahunAjaranOptions = [];
  for (let i = currentYear - 2; i <= currentYear + 3; i++) {
    tahunAjaranOptions.push({
      label: `${i}/${i + 1}`,
      value: `${i}/${i + 1}`
    });
  }

  if (loading && isEdit && !currentKurikulum) {
    return <LoadingSpinner fullScreen message="Memuat data kurikulum..." />;
  }

  return (
    <SafeAreaWrapper>
      <FormHeader
        title={isEdit ? 'Edit Kurikulum' : 'Tambah Kurikulum'}
        subtitle={isEdit ? 'Perbarui informasi kurikulum' : 'Buat kurikulum baru'}
        onBack={() => navigation.goBack()}
        error={error}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <FormInput
            label="Nama Kurikulum"
            value={formData.nama}
            onChangeText={(value) => handleInputChange('nama', value)}
            placeholder="Masukkan nama kurikulum"
            error={errors.nama}
            required
          />

          <FormDropdown
            label="Jenjang"
            value={formData.jenjang_id}
            onSelect={(value) => handleInputChange('jenjang_id', value)}
            options={jenjangOptions}
            placeholder="Pilih jenjang"
            error={errors.jenjang_id}
            required
          />

          <FormDropdown
            label="Tahun Ajaran"
            value={formData.tahun_ajaran}
            onSelect={(value) => handleInputChange('tahun_ajaran', value)}
            options={tahunAjaranOptions}
            placeholder="Pilih tahun ajaran"
            error={errors.tahun_ajaran}
            required
          />

          <FormDropdown
            label="Semester"
            value={formData.semester}
            onSelect={(value) => handleInputChange('semester', value)}
            options={semesterOptions}
            placeholder="Pilih semester"
            error={errors.semester}
            required
          />

          <FormInput
            label="Deskripsi"
            value={formData.deskripsi}
            onChangeText={(value) => handleInputChange('deskripsi', value)}
            placeholder="Masukkan deskripsi kurikulum"
            multiline
            numberOfLines={4}
            error={errors.deskripsi}
          />

          <FormToggle
            label="Status Aktif"
            description="Kurikulum aktif dapat digunakan untuk semester baru"
            value={formData.is_active}
            onValueChange={(value) => handleInputChange('is_active', value)}
          />
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <FormSubmitButton
          title={isEdit ? 'Perbarui Kurikulum' : 'Simpan Kurikulum'}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
        />
      </View>
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
  buttonContainer: {
    padding: 16,
    paddingTop: 0,
  },
});

export default KurikulumFormScreen;