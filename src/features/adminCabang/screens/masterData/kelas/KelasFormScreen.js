// src/features/adminCabang/screens/masterData/kelas/KelasFormScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import KelasForm from '../../../components/specific/kelas/KelasForm';
import { useStoreSelectors } from '../../../stores';
import { ENTITIES } from '../../../stores/masterDataStore';

/**
 * KelasFormScreen - Screen wrapper untuk KelasForm
 * Handles navigation, route params, data loading, dan success/error states
 */
const KelasFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // ==================== ZUSTAND STORES ====================
  const masterDataActions = useStoreSelectors.masterData.actions();
  const uiActions = useStoreSelectors.ui.actions();
  
  const submitting = useStoreSelectors.ui.loading(ENTITIES.KELAS, 'creating') || 
                    useStoreSelectors.ui.loading(ENTITIES.KELAS, 'updating');
  const error = useStoreSelectors.ui.error(ENTITIES.KELAS);
  
  // ==================== ROUTE PARAMS ====================
  const { mode = 'create', kelasId, id, item } = route.params || {};
  const actualId = kelasId || id;
  const isEditMode = mode === 'edit';
  
  // ==================== LOCAL STATE ====================
  const [initialData, setInitialData] = useState(item || null);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // ==================== EFFECTS ====================
  
  // Set header title based on mode
  useEffect(() => {
    let title = 'Tambah Kelas';
    if (isEditMode) {
      title = initialData?.nama_kelas ? `Edit ${initialData.nama_kelas}` : 'Edit Kelas';
    }
    
    navigation.setOptions({
      headerTitle: title,
      headerBackTitle: 'Kembali'
    });
  }, [navigation, isEditMode, initialData]);
  
  // Load data for edit mode
  useEffect(() => {
    if (isEditMode && actualId && !initialData && !dataLoaded) {
      fetchKelasData();
    } else if (!isEditMode || initialData) {
      setDataLoaded(true);
    }
  }, [isEditMode, actualId, initialData, dataLoaded]);
  
  // ==================== HANDLERS ====================
  
  const fetchKelasData = useCallback(async () => {
    setLoading(true);
    try {
      // Use the getEntityById selector to get data from store first
      const existingData = useStoreSelectors.masterData.entityById(ENTITIES.KELAS, actualId);
      
      if (existingData) {
        setInitialData(existingData);
        setDataLoaded(true);
      } else {
        // If not in store, fetch from API
        const result = await masterDataActions.loadById(ENTITIES.KELAS, actualId);
        if (result?.success && result.data) {
          setInitialData(result.data);
          setDataLoaded(true);
        } else {
          throw new Error(result?.message || 'Data kelas tidak ditemukan');
        }
      }
    } catch (err) {
      console.error('Error fetching kelas data:', err);
      
      Alert.alert(
        'Error',
        err.message || 'Gagal mengambil data kelas',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  }, [actualId, masterDataActions, navigation]);
  
  const handleSuccess = useCallback((data) => {
    const kelasName = data.nama_kelas || 'Kelas';
    const message = isEditMode 
      ? `Kelas "${kelasName}" berhasil diperbarui`
      : `Kelas "${kelasName}" berhasil ditambahkan`;
    
    // Show success message
    uiActions.showSuccess(message);
    
    // Navigate back to list
    navigation.goBack();
    
    // For new kelas, optionally navigate to detail screen
    if (!isEditMode && data.id_kelas) {
      setTimeout(() => {
        navigation.navigate('KelasDetail', {
          kelasId: data.id_kelas,
          title: kelasName,
          item: data
        });
      }, 100);
    }
  }, [isEditMode, navigation, uiActions]);
  
  const handleCancel = useCallback(() => {
    if (submitting) return;
    
    navigation.goBack();
  }, [submitting, navigation]);
  
  const handleError = useCallback((error) => {
    console.error('Form submission error:', error);
    
    const errorMessage = error.message || 
      `Terjadi kesalahan saat ${isEditMode ? 'memperbarui' : 'menyimpan'} data kelas`;
    
    Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
  }, [isEditMode]);
  
  // ==================== RENDER ====================
  
  // Show loading state while fetching data
  if (isEditMode && loading && !dataLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Memuat data kelas...</Text>
      </View>
    );
  }
  
  // Don't render form until data is loaded for edit mode
  if (isEditMode && !dataLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Menyiapkan form...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <KelasForm
        mode={mode}
        initialData={initialData}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        onError={handleError}
      />
      
      {/* Global Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center'
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 16
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
    textAlign: 'center'
  }
});

export default KelasFormScreen;