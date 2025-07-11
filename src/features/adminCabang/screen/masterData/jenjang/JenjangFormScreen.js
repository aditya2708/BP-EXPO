// src/features/adminCabang/screens/masterData/jenjang/JenjangFormScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import SafeAreaWrapper from '../../../../components/common/SafeAreaWrapper';
import FormHeader from '../../../../components/common/FormHeader';
import FormInput from '../../../../components/common/FormInput';
import FormSubmitButton from '../../../../components/common/FormSubmitButton';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import { createJenjang, updateJenjang, fetchJenjangById, clearForm } from '../../../redux/masterData/jenjangSlice';

const JenjangFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { currentJenjang, loading, error } = useSelector(state => state.jenjang);
  const { id } = route.params || {};
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchJenjangById(id));
    } else {
      dispatch(clearForm());
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentJenjang) {
      setFormData({
        nama: currentJenjang.nama || '',
        deskripsi: currentJenjang.deskripsi || ''
      });
    }
  }, [currentJenjang, isEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama jenjang wajib diisi';
    if (formData.nama.length > 100) newErrors.nama = 'Nama maksimal 100 karakter';
    if (formData.deskripsi.length > 500) newErrors.deskripsi = 'Deskripsi maksimal 500 karakter';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await dispatch(updateJenjang({ id, data: formData })).unwrap();
        Alert.alert('Sukses', 'Jenjang berhasil diupdate');
      } else {
        await dispatch(createJenjang(formData)).unwrap();
        Alert.alert('Sukses', 'Jenjang berhasil ditambahkan');
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

  if (loading && isEdit && !currentJenjang) {
    return <LoadingSpinner fullScreen message="Memuat data jenjang..." />;
  }

  return (
    <SafeAreaWrapper>
      <FormHeader
        title={isEdit ? 'Edit Jenjang' : 'Tambah Jenjang'}
        onBack={() => navigation.goBack()}
        error={error}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <FormInput
            label="Nama Jenjang"
            value={formData.nama}
            onChangeText={(value) => updateField('nama', value)}
            placeholder="Contoh: SD, SMP, SMA"
            error={errors.nama}
            required
            maxLength={100}
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
        title={isEdit ? 'Update Jenjang' : 'Tambah Jenjang'}
        onPress={handleSubmit}
        loading={loading}
        disabled={!formData.nama.trim()}
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

export default JenjangFormScreen;