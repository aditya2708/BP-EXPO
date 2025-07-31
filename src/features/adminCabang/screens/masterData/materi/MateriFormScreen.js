// src/features/adminCabang/screens/materi/MateriFormScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MateriForm from '../../../components/specific/materi/MateriForm';
import { useStoreSelectors } from '../../../stores';
import { ENTITIES } from '../../../stores/masterDataStore';

/**
 * MateriFormScreen - Screen wrapper untuk MateriForm
 * Handles navigation, success/error states, dan triple dependency context
 */
const MateriFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // ==================== ZUSTAND STORES ====================
  const uiActions = useStoreSelectors.ui.actions();
  const masterDataActions = useStoreSelectors.masterData.actions();
  
  // ==================== ROUTE PARAMS ====================
  const { mode, id, item, contextData } = route.params || {};
  const isEditMode = mode === 'edit';
  
  // Pre-selected values from context (navigation from mata pelajaran or kelas)
  const preSelectedMataPelajaran = contextData?.id_mata_pelajaran;
  const preSelectedKelas = contextData?.id_kelas;
  const preSelectedJenjang = contextData?.id_jenjang;
  
  // ==================== LOCAL STATE ====================
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // ==================== EFFECTS ====================
  
  // Set navigation header title
  useEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Edit Materi' : 'Tambah Materi',
      headerShown: false // Let the form handle its own header
    });
  }, [navigation, isEditMode]);
  
  // Fetch initial data for edit mode
  useEffect(() => {
    if (isEditMode && id && !item) {
      fetchMateriData();
    } else if (item) {
      setInitialData(item);
    } else if (!isEditMode && (preSelectedMataPelajaran || preSelectedKelas || preSelectedJenjang)) {
      // Set initial data with pre-selected context
      setInitialData({
        id_mata_pelajaran: preSelectedMataPelajaran,
        id_kelas: preSelectedKelas,
        nama_materi: '',
        kode_materi: '',
        deskripsi: '',
        is_active: true
      });
    }
  }, [isEditMode, id, item, preSelectedMataPelajaran, preSelectedKelas, preSelectedJenjang]);
  
  // Handle back button with dirty state check
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Check if form has unsaved changes
      const formState = useStoreSelectors.ui.formState(ENTITIES.MATERI);
      
      if (!formState?.dirty) {
        // No unsaved changes, allow normal back behavior
        return;
      }
      
      // Prevent default behavior
      e.preventDefault();
      
      // Show confirmation dialog
      Alert.alert(
        'Batalkan Perubahan?',
        'Ada perubahan yang belum disimpan. Yakin ingin keluar?',
        [
          { text: 'Lanjut Edit', style: 'cancel' },
          {
            text: 'Keluar',
            style: 'destructive',
            onPress: () => {
              // Clear form state and go back
              uiActions.setFormState(ENTITIES.MATERI, { dirty: false });
              navigation.dispatch(e.data.action);
            }
          }
        ]
      );
    });
    
    return unsubscribe;
  }, [navigation, uiActions]);
  
  // ==================== HANDLERS ====================
  
  const fetchMateriData = async () => {
    setLoading(true);
    try {
      const result = await masterDataActions.getById(ENTITIES.MATERI, id);
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
  
  const handleSuccess = useCallback((data) => {
    const message = isEditMode 
      ? `Materi "${data.nama_materi}" berhasil diperbarui`
      : `Materi "${data.nama_materi}" berhasil ditambahkan`;
    
    // Show success toast
    uiActions.setSuccess(message, isEditMode ? 'update' : 'create');
    
    // Clear form dirty state
    uiActions.setFormState(ENTITIES.MATERI, { dirty: false });
    
    // Navigate based on context
    if (contextData?.returnTo) {
      // Return to specific screen with updated data
      navigation.navigate(contextData.returnTo, {
        ...contextData.returnParams,
        refreshData: true,
        newItemId: data.id_materi
      });
    } else {
      // Normal navigation flow
      navigation.goBack();
      
      // If creating, optionally navigate to detail screen
      if (!isEditMode && data.id_materi) {
        setTimeout(() => {
          navigation.navigate('MateriDetail', {
            id: data.id_materi,
            item: data
          });
        }, 100);
      }
    }
  }, [isEditMode, navigation, uiActions, contextData]);
  
  const handleCancel = useCallback(() => {
    // Check if form has changes
    const formState = useStoreSelectors.ui.formState(ENTITIES.MATERI);
    
    if (formState?.dirty) {
      Alert.alert(
        'Batalkan Perubahan?',
        'Ada perubahan yang belum disimpan. Yakin ingin keluar?',
        [
          { text: 'Lanjut Edit', style: 'cancel' },
          {
            text: 'Keluar',
            style: 'destructive',
            onPress: () => {
              uiActions.setFormState(ENTITIES.MATERI, { dirty: false });
              navigation.goBack();
            }
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  }, [navigation, uiActions]);
  
  const handleError = useCallback((error) => {
    Alert.alert(
      'Error',
      error.message || 'Terjadi kesalahan saat menyimpan data materi',
      [{ text: 'OK' }]
    );
  }, []);
  
  // Show context info in development
  const showContextInfo = useCallback(() => {
    if (__DEV__ && (preSelectedMataPelajaran || preSelectedKelas || preSelectedJenjang)) {
      console.log('MateriFormScreen Context:', {
        preSelectedJenjang,
        preSelectedMataPelajaran,
        preSelectedKelas,
        contextData
      });
    }
  }, [preSelectedJenjang, preSelectedMataPelajaran, preSelectedKelas, contextData]);
  
  useEffect(() => {
    showContextInfo();
  }, [showContextInfo]);
  
  // ==================== RENDER ====================
  
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        {/* Loading indicator could be added here */}
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <MateriForm
        mode={mode}
        initialData={initialData}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        onError={handleError}
      />
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default MateriFormScreen;