import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import BaseFormScreen from '../../../components/base/BaseFormScreen';
import MateriForm from '../../../components/specific/materi/MateriForm';
import { useMateri } from '../../../hooks/useMateri';

const MateriFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { mode = 'create', id, item } = route.params || {};
  const { createMateri, updateMateri, getMateriById, submitting, error, clearError } = useMateri();
  
  const [initialData, setInitialData] = useState(item || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: mode === 'create' ? 'Tambah Materi' : 'Edit Materi'
    });
  }, [navigation, mode]);

  useEffect(() => {
    if (mode === 'edit' && id && !initialData) {
      fetchMateriData();
    }
  }, [mode, id, initialData]);

  const fetchMateriData = async () => {
    setLoading(true);
    try {
      const result = await getMateriById(id);
      if (result.success) {
        setInitialData(result.data);
      } else {
        Alert.alert('Error', result.error || 'Gagal mengambil data materi');
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('Error', 'Gagal mengambil data materi');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    clearError();
    
    try {
      let result;
      
      if (mode === 'create') {
        result = await createMateri(formData);
      } else {
        result = await updateMateri(id, formData);
      }

      if (result.success) {
        Alert.alert(
          'Berhasil',
          `Materi berhasil ${mode === 'create' ? 'ditambahkan' : 'diperbarui'}`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', result.error || `Gagal ${mode === 'create' ? 'menambah' : 'memperbarui'} materi`);
      }
    } catch (err) {
      Alert.alert('Error', `Gagal ${mode === 'create' ? 'menambah' : 'memperbarui'} materi`);
    }
  };

  const handleCancel = () => {
    if (submitting) return;
    
    Alert.alert(
      'Batal',
      'Yakin ingin membatalkan? Data yang belum disimpan akan hilang.',
      [
        { text: 'Tidak', style: 'cancel' },
        { text: 'Ya, Batal', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  };

  const handleRetry = () => {
    clearError();
    if (mode === 'edit' && id) {
      fetchMateriData();
    }
  };

  return (
    <BaseFormScreen
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <MateriForm
        initialData={initialData}
        mode={mode}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={submitting}
      />
    </BaseFormScreen>
  );
};

export default MateriFormScreen;