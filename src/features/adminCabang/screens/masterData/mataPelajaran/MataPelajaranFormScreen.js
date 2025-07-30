// src/features/adminCabang/screens/mataPelajaran/MataPelajaranFormScreen.js
import React, { useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MataPelajaranForm from '../../specific/mataPelajaran/MataPelajaranForm';
import { useStoreSelectors } from '../../../stores';
import { ENTITIES } from '../../../stores/masterDataStore';

/**
 * MataPelajaranFormScreen - Screen wrapper untuk MataPelajaranForm
 * Handles navigation, success/error states, dan integration dengan navigation stack
 */
const MataPelajaranFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // ==================== ZUSTAND STORES ====================
  const uiActions = useStoreSelectors.ui.actions();
  
  // ==================== ROUTE PARAMS ====================
  const { mode, id, item } = route.params || {};
  const isEditMode = mode === 'edit';
  
  // ==================== HANDLERS ====================
  
  const handleSuccess = useCallback((data) => {
    const message = isEditMode 
      ? `Mata pelajaran "${data.nama_mata_pelajaran}" berhasil diperbarui`
      : `Mata pelajaran "${data.nama_mata_pelajaran}" berhasil ditambahkan`;
    
    // Show success toast
    uiActions.setSuccess(message, isEditMode ? 'update' : 'create');
    
    // Navigate back to list
    navigation.goBack();
    
    // If creating, optionally navigate to detail screen
    if (!isEditMode && data.id_mata_pelajaran) {
      setTimeout(() => {
        navigation.navigate('MataPelajaranDetail', {
          id: data.id_mata_pelajaran,
          item: data
        });
      }, 100);
    }
  }, [isEditMode, navigation, uiActions]);
  
  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  
  const handleError = useCallback((error) => {
    Alert.alert(
      'Error',
      error.message || 'Terjadi kesalahan saat menyimpan data mata pelajaran',
      [{ text: 'OK' }]
    );
  }, []);
  
  // ==================== NAVIGATION OPTIONS ====================
  
  // Set header title dynamically
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran',
      headerShown: false // Let the form handle its own header
    });
  }, [navigation, isEditMode]);
  
  // Handle back button press
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Check if form has unsaved changes
      const formState = useStoreSelectors.ui.getFormState(ENTITIES.MATA_PELAJARAN);
      
      if (!formState.dirty) {
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
              uiActions.setFormState(ENTITIES.MATA_PELAJARAN, { dirty: false });
              navigation.dispatch(e.data.action);
            }
          }
        ]
      );
    });
    
    return unsubscribe;
  }, [navigation, uiActions]);
  
  // ==================== RENDER ====================
  
  return (
    <View style={styles.container}>
      <MataPelajaranForm
        mode={mode}
        initialData={item}
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
  }
});

export default MataPelajaranFormScreen;