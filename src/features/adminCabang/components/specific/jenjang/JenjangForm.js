import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import TextInput from '../../../../../common/components/TextInput';
import ActionButton from '../../shared/ActionButton';
import { useJenjang } from '../../../hooks/useJenjang';

const JenjangForm = ({ 
  initialData = null, 
  mode = 'create', // 'create' or 'edit'
  onSubmit,
  onCancel,
  submitting = false
}) => {
  const { checkUrutanAvailability } = useJenjang();
  
  const [formData, setFormData] = useState({
    nama_jenjang: '',
    kode_jenjang: '',
    urutan: '',
    deskripsi: '',
    is_active: true
  });
  
  const [errors, setErrors] = useState({});
  const [urutanChecking, setUrutanChecking] = useState(false);

  // Initialize form with data if edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        nama_jenjang: initialData.nama_jenjang || '',
        kode_jenjang: initialData.kode_jenjang || '',
        urutan: initialData.urutan?.toString() || '',
        deskripsi: initialData.deskripsi || '',
        is_active: initialData.is_active ?? true
      });
    }
  }, [mode, initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama_jenjang.trim()) {
      newErrors.nama_jenjang = 'Nama jenjang harus diisi';
    }

    if (!formData.kode_jenjang.trim()) {
      newErrors.kode_jenjang = 'Kode jenjang harus diisi';
    } else if (formData.kode_jenjang.length > 10) {
      newErrors.kode_jenjang = 'Kode jenjang maksimal 10 karakter';
    }

    if (!formData.urutan.trim()) {
      newErrors.urutan = 'Urutan harus diisi';
    } else if (isNaN(formData.urutan) || parseInt(formData.urutan) < 1) {
      newErrors.urutan = 'Urutan harus berupa angka positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkUrutan = async (urutan) => {
    if (!urutan || isNaN(urutan)) return;
    
    setUrutanChecking(true);
    try {
      const excludeId = mode === 'edit' ? initialData?.id_jenjang : null;
      const result = await checkUrutanAvailability(parseInt(urutan), excludeId);
      
      if (!result.available) {
        setErrors(prev => ({
          ...prev,
          urutan: 'Urutan sudah digunakan'
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.urutan;
          return newErrors;
        });
      }
    } catch (err) {
      console.error('Error checking urutan:', err);
    } finally {
      setUrutanChecking(false);
    }
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

    // Check urutan availability when changed
    if (field === 'urutan' && value) {
      const timeoutId = setTimeout(() => checkUrutan(value), 500);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const submitData = {
      ...formData,
      kode_jenjang: formData.kode_jenjang.toUpperCase(),
      urutan: parseInt(formData.urutan)
    };
    
    onSubmit(submitData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Nama Jenjang *"
          value={formData.nama_jenjang}
          onChangeText={(value) => handleInputChange('nama_jenjang', value)}
          placeholder="Contoh: Sekolah Dasar"
          error={errors.nama_jenjang}
          disabled={submitting}
        />

        <TextInput
          label="Kode Jenjang *"
          value={formData.kode_jenjang}
          onChangeText={(value) => handleInputChange('kode_jenjang', value)}
          placeholder="Contoh: SD"
          error={errors.kode_jenjang}
          disabled={submitting}
          inputProps={{ maxLength: 10, autoCapitalize: 'characters' }}
        />

        <TextInput
          label="Urutan *"
          value={formData.urutan}
          onChangeText={(value) => handleInputChange('urutan', value)}
          placeholder="Urutan tampil (angka)"
          error={errors.urutan}
          disabled={submitting}
          inputProps={{ keyboardType: 'numeric' }}
          rightIcon={urutanChecking ? 'hourglass-outline' : null}
        />

        <TextInput
          label="Deskripsi"
          value={formData.deskripsi}
          onChangeText={(value) => handleInputChange('deskripsi', value)}
          placeholder="Deskripsi jenjang (opsional)"
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

export default JenjangForm;