import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import TextInput from '../../../../../common/components/TextInput';
import DropdownSelector from '../../shared/DropdownSelector';
import KategoriSelector from './KategoriSelector';
import ActionButton from '../../shared/ActionButton';
import { useCascadeData } from '../../../hooks/useCascadeData';

const MataPelajaranForm = ({ 
  initialData = null, 
  mode = 'create',
  onSubmit,
  onCancel,
  submitting = false
}) => {
  const cascadeData = useCascadeData({ autoLoad: true });
  
  const [formData, setFormData] = useState({
    id_jenjang: null,
    nama_mata_pelajaran: '',
    kode_mata_pelajaran: '',
    kategori: '',
    deskripsi: '',
    status: 'aktif'
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Initialize form data
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const newFormData = {
        id_jenjang: initialData.id_jenjang || null,
        nama_mata_pelajaran: initialData.nama_mata_pelajaran || '',
        kode_mata_pelajaran: initialData.kode_mata_pelajaran || '',
        kategori: initialData.kategori || '',
        deskripsi: initialData.deskripsi || '',
        status: initialData.status || 'aktif'
      };
      
      setFormData(newFormData);
      
      // Set jenjang in cascade data if exists
      if (initialData.id_jenjang) {
        cascadeData.handleJenjangChange(initialData.id_jenjang);
      }
    }
  }, [mode, initialData]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama_mata_pelajaran.trim()) {
      newErrors.nama_mata_pelajaran = 'Nama mata pelajaran wajib diisi';
    } else if (formData.nama_mata_pelajaran.length < 3) {
      newErrors.nama_mata_pelajaran = 'Nama mata pelajaran minimal 3 karakter';
    }

    if (!formData.kode_mata_pelajaran.trim()) {
      newErrors.kode_mata_pelajaran = 'Kode mata pelajaran wajib diisi';
    } else if (!/^[A-Z0-9]{2,10}$/.test(formData.kode_mata_pelajaran)) {
      newErrors.kode_mata_pelajaran = 'Kode harus 2-10 karakter, huruf besar dan angka';
    }

    if (!formData.kategori) {
      newErrors.kategori = 'Kategori wajib dipilih';
    }

    if (formData.deskripsi && formData.deskripsi.length > 500) {
      newErrors.deskripsi = 'Deskripsi maksimal 500 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Field change handlers
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleJenjangChange = async (jenjangId) => {
    await cascadeData.handleJenjangChange(jenjangId);
    handleFieldChange('id_jenjang', jenjangId);
  };

  const handleKodeChange = (text) => {
    // Auto uppercase for kode
    const upperText = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    handleFieldChange('kode_mata_pelajaran', upperText);
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    const allFields = Object.keys(formData);
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    if (!validateForm()) {
      Alert.alert('Error', 'Mohon perbaiki kesalahan pada form');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      Alert.alert('Error', error.message || 'Terjadi kesalahan saat menyimpan');
    }
  };

  // Options
  const jenjangOptions = [
    { label: 'Pilih Jenjang (Opsional)', value: null },
    ...cascadeData.getJenjangOptions()
  ];

  const isFormValid = () => {
    return formData.nama_mata_pelajaran.trim() && 
           formData.kode_mata_pelajaran.trim() && 
           formData.kategori &&
           Object.keys(errors).length === 0;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {mode === 'edit' ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {/* Jenjang Dropdown */}
          <DropdownSelector
            label="Jenjang (Opsional)"
            value={formData.id_jenjang}
            options={jenjangOptions}
            onSelect={handleJenjangChange}
            placeholder="Pilih jenjang atau kosongkan untuk semua jenjang"
            style={styles.field}
            loading={cascadeData.loading.jenjang}
            error={touched.id_jenjang && errors.id_jenjang}
          />

          {/* Nama Mata Pelajaran */}
          <TextInput
            label="Nama Mata Pelajaran *"
            value={formData.nama_mata_pelajaran}
            onChangeText={(text) => handleFieldChange('nama_mata_pelajaran', text)}
            placeholder="Contoh: Matematika"
            error={touched.nama_mata_pelajaran && errors.nama_mata_pelajaran}
            style={styles.field}
            maxLength={100}
          />

          {/* Kode Mata Pelajaran */}
          <TextInput
            label="Kode Mata Pelajaran *"
            value={formData.kode_mata_pelajaran}
            onChangeText={handleKodeChange}
            placeholder="Contoh: MTK"
            error={touched.kode_mata_pelajaran && errors.kode_mata_pelajaran}
            style={styles.field}
            maxLength={10}
            autoCapitalize="characters"
          />

          {/* Kategori Selector */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Kategori *</Text>
            <KategoriSelector
              value={formData.kategori}
              onSelect={(kategori) => handleFieldChange('kategori', kategori)}
              error={touched.kategori && errors.kategori}
            />
            {touched.kategori && errors.kategori && (
              <Text style={styles.errorText}>{errors.kategori}</Text>
            )}
          </View>

          {/* Deskripsi */}
          <TextInput
            label="Deskripsi"
            value={formData.deskripsi}
            onChangeText={(text) => handleFieldChange('deskripsi', text)}
            placeholder="Deskripsi mata pelajaran (opsional)"
            error={touched.deskripsi && errors.deskripsi}
            style={styles.field}
            multiline
            numberOfLines={3}
            maxLength={500}
          />

          {/* Status Switch */}
          <View style={styles.field}>
            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <Text style={styles.fieldLabel}>Status</Text>
                <Text style={styles.switchDescription}>
                  {formData.status === 'aktif' ? 'Mata pelajaran aktif' : 'Mata pelajaran nonaktif'}
                </Text>
              </View>
              <Switch
                value={formData.status === 'aktif'}
                onValueChange={(value) => handleFieldChange('status', value ? 'aktif' : 'nonaktif')}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                thumbColor={formData.status === 'aktif' ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        </View>

        {/* Cascade Data Error */}
        {cascadeData.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{cascadeData.error}</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <ActionButton
          title="Batal"
          onPress={onCancel}
          variant="outline"
          style={styles.cancelButton}
          disabled={submitting}
        />
        <ActionButton
          title={mode === 'edit' ? 'Simpan Perubahan' : 'Simpan'}
          onPress={handleSubmit}
          style={styles.submitButton}
          loading={submitting}
          disabled={!isFormValid() || submitting}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  content: {
    flex: 1
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827'
  },
  form: {
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  field: {
    marginBottom: 16
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  switchLabel: {
    flex: 1
  },
  switchDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF'
  },
  cancelButton: {
    flex: 1
  },
  submitButton: {
    flex: 2
  }
});

export default MataPelajaranForm;