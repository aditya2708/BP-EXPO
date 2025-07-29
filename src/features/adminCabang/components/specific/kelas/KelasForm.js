import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import TextInput from '../../../../../common/components/TextInput';
import ActionButton from '../../shared/ActionButton';
import CascadeDropdown from '../../shared/CascadeDropdown';
import JenisKelasToggle from './JenisKelasToggle';
import TingkatSelector from './TingkatSelector';

const KelasForm = ({ 
  initialData = null, 
  mode = 'create',
  cascadeData,
  onSubmit,
  onCancel,
  submitting = false
}) => {
  const [formData, setFormData] = useState({
    id_jenjang: '',
    nama_kelas: '',
    jenis_kelas: 'standard',
    tingkat: '',
    urutan: '',
    deskripsi: '',
    is_active: true
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        id_jenjang: initialData.id_jenjang || '',
        nama_kelas: initialData.nama_kelas || '',
        jenis_kelas: initialData.jenis_kelas || 'standard',
        tingkat: initialData.tingkat || '',
        urutan: initialData.urutan?.toString() || '',
        deskripsi: initialData.deskripsi || '',
        is_active: initialData.is_active ?? true
      });
    }
  }, [mode, initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id_jenjang) {
      newErrors.id_jenjang = 'Jenjang harus dipilih';
    }

    if (formData.jenis_kelas === 'standard') {
      if (!formData.tingkat) {
        newErrors.tingkat = 'Tingkat harus diisi untuk kelas standard';
      }
    } else {
      if (!formData.nama_kelas.trim()) {
        newErrors.nama_kelas = 'Nama kelas harus diisi untuk kelas custom';
      }
    }

    if (!formData.urutan.trim()) {
      newErrors.urutan = 'Urutan harus diisi';
    } else if (isNaN(formData.urutan) || parseInt(formData.urutan) < 1) {
      newErrors.urutan = 'Urutan harus berupa angka positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Auto-generate nama_kelas for standard type
    if (field === 'tingkat' && formData.jenis_kelas === 'standard' && value) {
      const romans = {1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',11:'XI',12:'XII'};
      setFormData(prev => ({
        ...prev,
        nama_kelas: `Kelas ${value} (${romans[value]})`
      }));
    }

    // Clear tingkat when switching to custom
    if (field === 'jenis_kelas' && value === 'custom') {
      setFormData(prev => ({
        ...prev,
        tingkat: '',
        nama_kelas: ''
      }));
    }

    // Auto-generate nama_kelas when switching to standard
    if (field === 'jenis_kelas' && value === 'standard') {
      setFormData(prev => ({ ...prev, nama_kelas: '' }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const submitData = {
      ...formData,
      urutan: parseInt(formData.urutan),
      tingkat: formData.jenis_kelas === 'standard' ? parseInt(formData.tingkat) : null
    };
    
    onSubmit(submitData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <CascadeDropdown
          cascadeData={cascadeData}
          parentKey="jenjang"
          childKey="kelas"
          parentValue={formData.id_jenjang}
          onParentChange={(value) => handleInputChange('id_jenjang', value)}
          parentLabel="Jenjang"
          parentPlaceholder="Pilih jenjang"
          error={{ parent: errors.id_jenjang }}
          required
          // We don't use child dropdown for this form
          childLabel=""
          onChildChange={() => {}}
        />

        <JenisKelasToggle
          value={formData.jenis_kelas}
          onValueChange={(value) => handleInputChange('jenis_kelas', value)}
          disabled={submitting}
        />

        {formData.jenis_kelas === 'standard' ? (
          <TingkatSelector
            value={formData.tingkat}
            onValueChange={(value) => handleInputChange('tingkat', value)}
            error={errors.tingkat}
            disabled={submitting}
            required
          />
        ) : (
          <TextInput
            label="Nama Kelas *"
            value={formData.nama_kelas}
            onChangeText={(value) => handleInputChange('nama_kelas', value)}
            placeholder="Contoh: Kelas Akselerasi"
            error={errors.nama_kelas}
            disabled={submitting}
          />
        )}

        <TextInput
          label="Urutan *"
          value={formData.urutan}
          onChangeText={(value) => handleInputChange('urutan', value)}
          placeholder="Urutan tampil (angka)"
          error={errors.urutan}
          disabled={submitting}
          inputProps={{ keyboardType: 'numeric' }}
        />

        <TextInput
          label="Deskripsi"
          value={formData.deskripsi}
          onChangeText={(value) => handleInputChange('deskripsi', value)}
          placeholder="Deskripsi kelas (opsional)"
          error={errors.deskripsi}
          disabled={submitting}
          multiline
          inputProps={{ numberOfLines: 3 }}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Status Aktif</Text>
          <Switch
            value={formData.is_active}
            onValueChange={(value) => handleInputChange('is_active', value)}
            disabled={submitting}
            trackColor={{ false: '#ccc', true: '#007bff' }}
            thumbColor={formData.is_active ? '#fff' : '#f4f3f4'}
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

export default KelasForm;