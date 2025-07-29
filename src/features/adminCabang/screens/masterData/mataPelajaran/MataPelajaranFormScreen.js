import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import BaseFormScreen from '../../../components/base/BaseFormScreen';
import MataPelajaranForm from '../../../components/specific/mataPelajaran/MataPelajaranForm';
import { useMataPelajaran } from '../../../hooks/useMataPelajaran';

const MataPelajaranFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { mode = 'create', id, item } = route.params || {};
  const { 
    createMataPelajaran, 
    updateMataPelajaran, 
    getMataPelajaranById, 
    submitting, 
    error, 
    clearError 
  } = useMataPelajaran();
  
  const [initialData, setInitialData] = useState(item || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: mode === 'create' ? 'Tambah Mata Pelajaran' : 'Edit Mata Pelajaran'
    });
  }, [navigation, mode]);

  useEffect(() => {
    if (mode === 'edit' && id && !initialData) {
      fetchMataPelajaranData();
    }
  }, [mode, id, initialData]);

  const fetchMataPelajaranData = async () => {
    setLoading(true);
    try {
      const result = await getMataPelajaranById(id);
      if (result.success) {
        setInitialData(result.data);
      } else {
        Alert.alert('Error', result.error || 'Gagal mengambil data mata pelajaran');
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('Error', 'Gagal mengambil data mata pelajaran');
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
        result = await createMataPelajaran(formData);
      } else {
        result = await updateMataPelajaran(id, formData);
      }

      if (result.success) {
        Alert.alert(
          'Berhasil',
          `Mata pelajaran berhasil ${mode === 'create' ? 'ditambahkan' : 'diperbarui'}`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || `Gagal ${mode === 'create' ? 'menambah' : 'memperbarui'} mata pelajaran`);
      }
    } catch (err) {
      Alert.alert('Error', `Gagal ${mode === 'create' ? 'menambah' : 'memperbarui'} mata pelajaran`);
    }
  };

  const handleCancel = () => {
    if (submitting) return;
    
    Alert.alert(
      'Batal',
      'Yakin ingin membatalkan? Data yang belum disimpan akan hilang.',
      [
        { text: 'Tidak', style: 'cancel' },
        { 
          text: 'Ya, Batal', 
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const handleRetry = () => {
    clearError();
    if (mode === 'edit' && id) {
      fetchMataPelajaranData();
    }
  };

  return (
    <BaseFormScreen
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <MataPelajaranForm
        initialData={initialData}
        mode={mode}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={submitting}
      />
    </BaseFormScreen>
  );
};

export default MataPelajaranFormScreen;