import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import BaseFormScreen from '../../../components/base/BaseFormScreen';
import KelasForm from '../../../components/specific/kelas/KelasForm';
import { useKelas } from '../../../hooks/useKelas';

const KelasFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { mode = 'create', id, item } = route.params || {};
  const { 
    createKelas, 
    updateKelas, 
    getKelasById, 
    cascadeData, 
    fetchCascadeData,
    submitting, 
    error, 
    clearError 
  } = useKelas();
  
  const [initialData, setInitialData] = useState(item || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: mode === 'create' ? 'Tambah Kelas' : 'Edit Kelas'
    });
  }, [navigation, mode]);

  useEffect(() => {
    if (mode === 'edit' && id && !initialData) {
      fetchKelasData();
    }
    if (!cascadeData) {
      fetchCascadeData();
    }
  }, [mode, id, initialData, cascadeData]);

  const fetchKelasData = async () => {
    setLoading(true);
    try {
      const result = await getKelasById(id);
      if (result.success) {
        setInitialData(result.data);
      } else {
        Alert.alert('Error', result.error || 'Gagal mengambil data kelas');
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('Error', 'Gagal mengambil data kelas');
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
        result = await createKelas(formData);
      } else {
        result = await updateKelas(id, formData);
      }

      if (result.success) {
        Alert.alert(
          'Berhasil',
          `Kelas berhasil ${mode === 'create' ? 'ditambahkan' : 'diperbarui'}`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || `Gagal ${mode === 'create' ? 'menambah' : 'memperbarui'} kelas`);
      }
    } catch (err) {
      Alert.alert('Error', `Gagal ${mode === 'create' ? 'menambah' : 'memperbarui'} kelas`);
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
      fetchKelasData();
    }
    if (!cascadeData) {
      fetchCascadeData();
    }
  };

  return (
    <BaseFormScreen
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <KelasForm
        initialData={initialData}
        mode={mode}
        cascadeData={cascadeData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={submitting}
      />
    </BaseFormScreen>
  );
};

export default KelasFormScreen;