import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
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
  const { getJenjangOptions, selectedJenjang, handleJenjangChange } = useCascadeData();
  
  const [formData, setFormData] = useState({
    id_jenjang: null,
    nama_mata_pelajaran: '',
    kode_mata_pelajaran: '',
    kategori: '',
    deskripsi: '',
    status: 'aktif'
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        id_jenjang: initialData.id_jenjang || null,
        nama_mata_pelajaran: initialData.nama_mata_pelajaran || '',
        kode_mata_pelajaran: initialData.kode_mata_pelajaran || '',
        kategori: initialData.kategori || '',
        deskripsi: initialData.deskripsi || '',
        status: initialData.status || 'aktif'
      });
      
      if (initialData.id_jenjang) {
        handleJenjangChange(initialData.id_jenjang);
      }
    }
  }, [mode, initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama_mata_pelajaran.trim()) {
      newErrors.nama_mata_pelajaran = 'Nama mata pelajaran harus diisi';
    }

    if (!formData.kode_mata_pelajaran.trim()) {
      newErrors.kode_mata_pelajaran = 'Kode mata pelajaran harus diisi';
    } else if (formData.kode_mata_pelajaran.length > 50) {
      newErrors.kode_mata_pelajaran = 'Kode mata pelajaran maksimal 50 karakter';
    }

    if (!formData.kategori) {
      newErrors.kategori = 'Kategori harus dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleJenjangSelect = (jenjangId) => {
    handleInputChange('id_jenjang', jenjangId);
    handleJenjangChange(jenjangId);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const submitData = {
      ...formData,
      kode_mata_pelajaran: formData.kode_mata_pelajaran.toUpperCase()
    };
    
    onSubmit(submitData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <DropdownSelector
          label="Jenjang"
          value={formData.id_jenjang}
          onSelect={handleJenjangSelect}
          options={getJenjangOptions()}
          placeholder="Pilih jenjang (opsional)"
          error={errors.id_jenjang}
          disabled={submitting}
        />

        <TextInput
          label="Nama Mata Pelajaran *"
          value={formData.nama_mata_pelajaran}
          onChangeText={(value) => handleInputChange('nama_mata_pelajaran', value)}
          placeholder="Contoh: Matematika"
          error={errors.nama_mata_pelajaran}
          disabled={submitting}
        />

        <TextInput
          label="Kode Mata Pelajaran *"
          value={formData.kode_mata_pelajaran}
          onChangeText={(value) => handleInputChange('kode_mata_pelajaran', value)}
          placeholder="Contoh: MTK"
          error={errors.kode_mata_pelajaran}
          disabled={submitting}
          inputProps={{ maxLength: 50, autoCapitalize: 'characters' }}
        />

        <KategoriSelector
          label="Kategori *"
          value={formData.kategori}
          onSelect={(value) => handleInputChange('kategori', value)}
          error={errors.kategori}
          disabled={submitting}
        />

        <TextInput
          label="Deskripsi"
          value={formData.deskripsi}
          onChangeText={(value) => handleInputChange('deskripsi', value)}
          placeholder="Deskripsi mata pelajaran (opsional)"
          error={errors.deskripsi}
          disabled={submitting}
          multiline
          inputProps={{ numberOfLines: 3 }}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Status Aktif</Text>
          <Switch
            value={formData.status === 'aktif'}
            onValueChange={(value) => handleInputChange('status', value ? 'aktif' : 'nonaktif')}
            disabled={submitting}
            trackColor={{ false: '#ccc', true: '#007bff' }}
            thumbColor={formData.status === 'aktif' ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.actions}>
        <ActionButton
          title="Batal"
          variant="outline"
          onPress={onCancel}
          disabled={submitting}
          style={styles.cancelButton}
        />
        
        <ActionButton
          title={mode === 'create' ? 'Simpan' : 'Update'}
          onPress={handleSubmit}
          loading={submitting}
          disabled={Object.keys(errors).length > 0}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  form: {
    flex: 1
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  actions: {
    flexDirection: 'row',
    paddingTop: 16,
    gap: 12
  },
  cancelButton: {
    flex: 1
  },
  submitButton: {
    flex: 1
  }
});

export default MataPelajaranForm;