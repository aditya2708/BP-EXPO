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

  // Set header title based on mode
  useEffect(() => {
    navigation.setOptions({
      headerTitle: mode === 'create' ? 'Tambah Mata Pelajaran' : 'Edit Mata Pelajaran'
    });
  }, [navigation, mode]);

  // Load data for edit mode
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
        Alert.alert('Error', result.message || 'Gagal mengambil data mata pelajaran');
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('Error', 'Terjadi kesalahan saat mengambil data');
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
        const successMessage = mode === 'create' 
          ? 'Mata pelajaran berhasil ditambahkan' 
          : 'Mata pelajaran berhasil diperbarui';
          
        Alert.alert(
          'Berhasil',
          successMessage,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back with updated data if available
                if (result.data) {
                  navigation.navigate('MataPelajaranDetail', {
                    id: result.data.id_mata_pelajaran,
                    item: result.data
                  });
                } else {
                  navigation.goBack();
                }
              }
            }
          ]
        );
      } else {
        const errorMessage = result.message || 
          `Gagal ${mode === 'create' ? 'menambah' : 'memperbarui'} mata pelajaran`;
        Alert.alert('Error', errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || 
        `Terjadi kesalahan saat ${mode === 'create' ? 'menambah' : 'memperbarui'} mata pelajaran`;
      Alert.alert('Error', errorMessage);
    }
  };

  const handleCancel = () => {
    if (submitting) return;
    
    Alert.alert(
      'Konfirmasi',
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
    if (mode === 'edit' && id && !initialData) {
      fetchMataPelajaranData();
    }
  };

  return (
    <BaseFormScreen
      loading={loading}
      error={error}
      onRetry={handleRetry}
      loadingMessage={mode === 'edit' ? 'Memuat data mata pelajaran...' : undefined}
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