import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import BaseFormScreen from '../../../components/base/BaseFormScreen';
import JenjangForm from '../../../components/specific/jenjang/JenjangForm';
import { useJenjang } from '../../../hooks/useJenjang';

const JenjangFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { mode = 'create', id, item } = route.params || {};
  const { createJenjang, updateJenjang, getJenjangById, submitting, error, clearError } = useJenjang();
  
  const [initialData, setInitialData] = useState(item || null);
  const [loading, setLoading] = useState(false);

  // Set header title based on mode
  useEffect(() => {
    navigation.setOptions({
      headerTitle: mode === 'create' ? 'Tambah Jenjang' : 'Edit Jenjang'
    });
  }, [navigation, mode]);

  // Fetch data if edit mode and no initial data
  useEffect(() => {
    if (mode === 'edit' && id && !initialData) {
      fetchJenjangData();
    }
  }, [mode, id, initialData]);

  const fetchJenjangData = async () => {
    setLoading(true);
    try {
      const result = await getJenjangById(id);
      if (result.success) {
        setInitialData(result.data);
      } else {
        Alert.alert('Error', result.error || 'Gagal mengambil data jenjang');
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('Error', 'Gagal mengambil data jenjang');
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
        result = await createJenjang(formData);
      } else {
        result = await updateJenjang(id, formData);
      }

      if (result.success) {
        Alert.alert(
          'Berhasil',
          `Jenjang berhasil ${mode === 'create' ? 'ditambahkan' : 'diperbarui'}`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || `Gagal ${mode === 'create' ? 'menambah' : 'memperbarui'} jenjang`);
      }
    } catch (err) {
      Alert.alert('Error', `Gagal ${mode === 'create' ? 'menambah' : 'memperbarui'} jenjang`);
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
      fetchJenjangData();
    }
  };

  return (
    <BaseFormScreen
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <JenjangForm
        initialData={initialData}
        mode={mode}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={submitting}
      />
    </BaseFormScreen>
  );
};

export default JenjangFormScreen;