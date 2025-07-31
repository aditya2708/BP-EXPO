// src/features/adminCabang/components/specific/materi/MateriForm.js
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Alert, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import BaseFormScreen from '../../base/BaseFormScreen';
import CascadeDropdown from '../../../components/shared/CascadeDropdown';
import DropdownSelector from '../../../components//DropdownSelector';
import { useStoreSelectors } from '../../../stores';
import { useFormValidation } from '../../../hooks';
import { ENTITIES } from '../../../stores/masterDataStore';

/**
 * MateriForm - Form untuk create/edit materi dengan triple cascade dependencies
 * Supports jenjang > mataPelajaran > kelas > materi validation
 */
const MateriForm = ({
  mode: propMode,
  initialData: propInitialData,
  onSuccess: propOnSuccess,
  onCancel: propOnCancel
}) => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Get params from route or props
  const mode = propMode || route.params?.mode || 'create';
  const routeInitialData = route.params?.item || {};
  const initialData = propInitialData || routeInitialData;
  
  // ==================== ZUSTAND STORES ====================
  const masterDataActions = useStoreSelectors.masterData.actions();
  const cascadeActions = useStoreSelectors.cascade.actions();
  const uiActions = useStoreSelectors.ui.actions();
  
  const materiData = useStoreSelectors.masterData.entitiesArray(ENTITIES.MATERI);
  const loading = useStoreSelectors.ui.loading(ENTITIES.MATERI, mode === 'create' ? 'creating' : 'updating');
  const jenjangOptions = useStoreSelectors.cascade.jenjangOptions();
  const selectedJenjang = useStoreSelectors.cascade.selected('jenjang');
  const selectedMataPelajaran = useStoreSelectors.cascade.selected('mataPelajaran');
  const selectedKelas = useStoreSelectors.cascade.selected('kelas');
  
  // ==================== LOCAL STATE ====================
  const [formData, setFormData] = useState(() => getInitialFormData());
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [cascadeData, setCascadeData] = useState({
    jenjang: [],
    mataPelajaran: [],
    kelas: []
  });
  
  // ==================== FORM VALIDATION ====================
  const { validateForm, validateField, clearFieldError } = useFormValidation();
  
  function getInitialFormData() {
    if (mode === 'edit') {
      return {
        nama_materi: initialData.nama_materi || '',
        kode_materi: initialData.kode_materi || '',
        deskripsi: initialData.deskripsi || '',
        id_mata_pelajaran: initialData.id_mata_pelajaran || null,
        id_kelas: initialData.id_kelas || null,
        is_active: initialData.is_active !== false
      };
    }
    
    return {
      nama_materi: '',
      kode_materi: '',
      deskripsi: '',
      id_mata_pelajaran: null,
      id_kelas: null,
      is_active: true
    };
  }
  
  // ==================== COMPUTED VALUES ====================
  
  const mataPelajaranOptions = useMemo(() => {
    return useStoreSelectors.cascade.mataPelajaranOptions(selectedJenjang);
  }, [selectedJenjang]);
  
  const kelasOptions = useMemo(() => {
    return useStoreSelectors.cascade.kelasOptions(selectedJenjang);
  }, [selectedJenjang]);
  
  const isEditMode = mode === 'edit';
  const formTitle = isEditMode ? 'Edit Materi' : 'Tambah Materi';
  
  // Validate triple dependency consistency
  const dependencyValidation = useMemo(() => {
    if (!formData.id_mata_pelajaran || !formData.id_kelas) {
      return { valid: true };
    }
    
    const mataPelajaran = cascadeData.mataPelajaran.find(
      mp => mp.value === formData.id_mata_pelajaran?.toString()
    );
    const kelas = cascadeData.kelas.find(
      k => k.value === formData.id_kelas?.toString()
    );
    
    if (mataPelajaran && kelas) {
      const mpJenjang = mataPelajaran.data?.id_jenjang;
      const kelasJenjang = kelas.data?.id_jenjang;
      
      if (mpJenjang && kelasJenjang && mpJenjang !== kelasJenjang) {
        return {
          valid: false,
          message: 'Mata pelajaran dan kelas harus berada dalam jenjang yang sama'
        };
      }
    }
    
    return { valid: true };
  }, [formData.id_mata_pelajaran, formData.id_kelas, cascadeData]);
  
  // ==================== VALIDATION RULES ====================
  
  const checkNamaUnique = useCallback(async (value) => {
    if (!value || value.length < 2) return true;
    
    const existing = materiData.find(item => 
      item.nama_materi?.toLowerCase() === value.toLowerCase() &&
      item.id_mata_pelajaran === formData.id_mata_pelajaran &&
      item.id_kelas === formData.id_kelas &&
      item.id_materi !== initialData.id_materi
    );
    
    return !existing;
  }, [materiData, formData.id_mata_pelajaran, formData.id_kelas, initialData.id_materi]);
  
  const checkKodeUnique = useCallback(async (value) => {
    if (!value || value.length < 2) return true;
    
    const existing = materiData.find(item => 
      item.kode_materi?.toLowerCase() === value.toLowerCase() &&
      item.id_materi !== initialData.id_materi
    );
    
    return !existing;
  }, [materiData, initialData.id_materi]);
  
  const validationRules = {
    nama_materi: [
      'required',
      { type: 'maxLength', params: [255] },
      { type: 'unique', params: [checkNamaUnique] }
    ],
    kode_materi: [
      { type: 'maxLength', params: [50] },
      { type: 'unique', params: [checkKodeUnique] }
    ],
    id_mata_pelajaran: [
      'required'
    ],
    id_kelas: [
      'required'
    ],
    deskripsi: [
      { type: 'maxLength', params: [1000] }
    ]
  };
  
  // ==================== EFFECTS ====================
  
  // Initialize cascade selections on edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData.mataPelajaran && initialData.kelas) {
      const jenjangId = initialData.mataPelajaran.id_jenjang || initialData.kelas.id_jenjang;
      if (jenjangId) {
        cascadeActions.setSelected('jenjang', jenjangId.toString());
      }
      cascadeActions.setSelected('mataPelajaran', initialData.id_mata_pelajaran?.toString());
      cascadeActions.setSelected('kelas', initialData.id_kelas?.toString());
    }
  }, [mode, initialData, cascadeActions]);
  
  // Load cascade data
  useEffect(() => {
    const loadCascadeData = async () => {
      try {
        const jenjangData = await masterDataActions.load(ENTITIES.JENJANG);
        const mpData = await masterDataActions.load(ENTITIES.MATA_PELAJARAN);
        const kelasData = await masterDataActions.load(ENTITIES.KELAS);
        
        setCascadeData({
          jenjang: jenjangData || [],
          mataPelajaran: mpData || [],
          kelas: kelasData || []
        });
      } catch (err) {
        console.error('Error loading cascade data:', err);
      }
    };
    
    loadCascadeData();
  }, [masterDataActions]);
  
  // Track form changes
  useEffect(() => {
    if (mode === 'create' || JSON.stringify(formData) !== JSON.stringify(getInitialFormData())) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [formData, mode]);
  
  // ==================== HANDLERS ====================
  
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field errors
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Handle cascade dependencies
    if (field === 'id_mata_pelajaran' || field === 'id_kelas') {
      // Clear dependency validation error
      if (errors.dependency) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.dependency;
          return newErrors;
        });
      }
    }
  }, [errors]);
  
  const handleJenjangChange = useCallback((jenjangId) => {
    cascadeActions.setSelected('jenjang', jenjangId);
    
    // Clear mata pelajaran dan kelas when jenjang changes
    if (formData.id_mata_pelajaran || formData.id_kelas) {
      setFormData(prev => ({
        ...prev,
        id_mata_pelajaran: null,
        id_kelas: null
      }));
      cascadeActions.setSelected('mataPelajaran', null);
      cascadeActions.setSelected('kelas', null);
    }
  }, [cascadeActions, formData]);
  
  const handleMataPelajaranChange = useCallback((mataPelajaranId) => {
    setFormData(prev => ({ ...prev, id_mata_pelajaran: mataPelajaranId }));
    cascadeActions.setSelected('mataPelajaran', mataPelajaranId);
    
    // Clear dependency error if exists
    if (errors.dependency) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dependency;
        return newErrors;
      });
    }
  }, [cascadeActions, errors]);
  
  const handleKelasChange = useCallback((kelasId) => {
    setFormData(prev => ({ ...prev, id_kelas: kelasId }));
    cascadeActions.setSelected('kelas', kelasId);
    
    // Clear dependency error if exists
    if (errors.dependency) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dependency;
        return newErrors;
      });
    }
  }, [cascadeActions, errors]);
  
  const handleValidation = useCallback(async () => {
    const newErrors = {};
    
    // Basic field validation
    if (!formData.nama_materi?.trim()) {
      newErrors.nama_materi = 'Nama materi harus diisi';
    }
    
    if (!formData.id_mata_pelajaran) {
      newErrors.id_mata_pelajaran = 'Mata pelajaran harus dipilih';
    }
    
    if (!formData.id_kelas) {
      newErrors.id_kelas = 'Kelas harus dipilih';
    }
    
    // Triple dependency validation
    if (!dependencyValidation.valid) {
      newErrors.dependency = dependencyValidation.message;
    }
    
    // Unique validation
    if (formData.nama_materi?.trim()) {
      const isNamaUnique = await checkNamaUnique(formData.nama_materi.trim());
      if (!isNamaUnique) {
        newErrors.nama_materi = 'Nama materi sudah digunakan untuk kombinasi mata pelajaran dan kelas ini';
      }
    }
    
    if (formData.kode_materi?.trim()) {
      const isKodeUnique = await checkKodeUnique(formData.kode_materi.trim());
      if (!isKodeUnique) {
        newErrors.kode_materi = 'Kode materi sudah digunakan';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, dependencyValidation, checkNamaUnique, checkKodeUnique]);
  
  const handleSubmit = useCallback(async () => {
    try {
      const isValid = await handleValidation();
      if (!isValid) {
        Alert.alert('Validasi Gagal', 'Mohon periksa kembali data yang diinput');
        return;
      }
      
      const submitData = {
        ...formData,
        nama_materi: formData.nama_materi.trim(),
        kode_materi: formData.kode_materi?.trim() || null,
        deskripsi: formData.deskripsi?.trim() || null
      };
      
      let result;
      if (isEditMode) {
        result = await masterDataActions.update(ENTITIES.MATERI, initialData.id_materi, submitData);
      } else {
        result = await masterDataActions.create(ENTITIES.MATERI, submitData);
      }
      
      if (result.success) {
        const message = `Materi berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}`;
        uiActions.setSuccess(message, isEditMode ? 'update' : 'create');
        setIsDirty(false);
        
        if (propOnSuccess) {
          propOnSuccess(result.data);
        } else {
          navigation.goBack();
        }
      }
    } catch (err) {
      uiActions.setError(ENTITIES.MATERI, err.message || 'Gagal menyimpan data materi');
    }
  }, [formData, handleValidation, isEditMode, masterDataActions, uiActions, initialData, propOnSuccess, navigation]);
  
  const handleCancel = useCallback(() => {
    if (isDirty) {
      Alert.alert(
        'Konfirmasi',
        'Ada perubahan yang belum disimpan. Apakah Anda yakin ingin keluar?',
        [
          { text: 'Tidak', style: 'cancel' },
          { 
            text: 'Ya', 
            onPress: () => {
              if (propOnCancel) {
                propOnCancel();
              } else {
                navigation.goBack();
              }
            }
          }
        ]
      );
    } else {
      if (propOnCancel) {
        propOnCancel();
      } else {
        navigation.goBack();
      }
    }
  }, [isDirty, propOnCancel, navigation]);
  
  // ==================== RENDER ====================
  
  return (
    <BaseFormScreen
      title={formTitle}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isDirty={isDirty}
      submitText={isEditMode ? 'Update' : 'Simpan'}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Triple Dependency Alert */}
        {errors.dependency && (
          <View style={styles.errorAlert}>
            <Ionicons name="warning-outline" size={20} color="#dc3545" />
            <Text style={styles.errorAlertText}>{errors.dependency}</Text>
          </View>
        )}
        
        {/* Jenjang Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pilih Jenjang</Text>
          <CascadeDropdown
            label="Jenjang"
            value={selectedJenjang}
            options={jenjangOptions}
            onValueChange={handleJenjangChange}
            placeholder="Pilih jenjang terlebih dahulu"
            required
          />
        </View>
        
        {/* Mata Pelajaran Selection */}
        {selectedJenjang && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pilih Mata Pelajaran</Text>
            <DropdownSelector
              label="Mata Pelajaran"
              value={formData.id_mata_pelajaran}
              options={mataPelajaranOptions}
              onValueChange={handleMataPelajaranChange}
              placeholder="Pilih mata pelajaran"
              error={errors.id_mata_pelajaran}
              required
            />
          </View>
        )}
        
        {/* Kelas Selection */}
        {selectedJenjang && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pilih Kelas</Text>
            <DropdownSelector
              label="Kelas"
              value={formData.id_kelas}
              options={kelasOptions}
              onValueChange={handleKelasChange}
              placeholder="Pilih kelas"
              error={errors.id_kelas}
              required
            />
          </View>
        )}
        
        {/* Materi Details */}
        {formData.id_mata_pelajaran && formData.id_kelas && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detail Materi</Text>
            
            {/* Nama Materi */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nama Materi <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.nama_materi && styles.inputError]}
                value={formData.nama_materi}
                onChangeText={(value) => handleInputChange('nama_materi', value)}
                placeholder="Masukkan nama materi"
                maxLength={255}
              />
              {errors.nama_materi && (
                <Text style={styles.errorText}>{errors.nama_materi}</Text>
              )}
            </View>
            
            {/* Kode Materi */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kode Materi</Text>
              <TextInput
                style={[styles.input, errors.kode_materi && styles.inputError]}
                value={formData.kode_materi}
                onChangeText={(value) => handleInputChange('kode_materi', value)}
                placeholder="Masukkan kode materi (opsional)"
                maxLength={50}
              />
              {errors.kode_materi && (
                <Text style={styles.errorText}>{errors.kode_materi}</Text>
              )}
            </View>
            
            {/* Deskripsi */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Deskripsi</Text>
              <TextInput
                style={[styles.textArea, errors.deskripsi && styles.inputError]}
                value={formData.deskripsi}
                onChangeText={(value) => handleInputChange('deskripsi', value)}
                placeholder="Masukkan deskripsi materi (opsional)"
                multiline
                numberOfLines={4}
                maxLength={1000}
              />
              {errors.deskripsi && (
                <Text style={styles.errorText}>{errors.deskripsi}</Text>
              )}
            </View>
            
            {/* Status Aktif */}
            <View style={styles.switchGroup}>
              <Text style={styles.label}>Status Aktif</Text>
              <Switch
                value={formData.is_active}
                onValueChange={(value) => handleInputChange('is_active', value)}
                trackColor={{ false: '#767577', true: '#28a745' }}
                thumbColor={formData.is_active ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </BaseFormScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8
  },
  required: {
    color: '#dc3545'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  inputError: {
    borderColor: '#dc3545'
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 100,
    textAlignVertical: 'top'
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 4
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 16,
    marginBottom: 8
  },
  errorAlertText: {
    color: '#721c24',
    fontSize: 14,
    marginLeft: 8,
    flex: 1
  }
});

export default MateriForm;