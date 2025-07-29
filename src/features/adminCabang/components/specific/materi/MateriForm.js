import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import TextInput from '../../../../../common/components/TextInput';
import ActionButton from '../../shared/ActionButton';
import DropdownSelector from '../../shared/DropdownSelector';
import { useMateri } from '../../../hooks/useMateri';
import { useCascadeData } from '../../../hooks/useCascadeData';

const MateriForm = ({ 
  initialData = null, 
  mode = 'create', // 'create' or 'edit'
  onSubmit,
  onCancel,
  submitting = false
}) => {
  const { validateCombination, validating } = useMateri({ autoLoad: false });
  const cascadeData = useCascadeData({ autoLoad: true, includeMateri: false });
  
  const [formData, setFormData] = useState({
    id_mata_pelajaran: '',
    id_kelas: '',
    nama_materi: ''
  });
  
  const [errors, setErrors] = useState({});
  const [selectedJenjang, setSelectedJenjang] = useState('');
  const [availableMataPelajaran, setAvailableMataPelajaran] = useState([]);
  const [availableKelas, setAvailableKelas] = useState([]);

  // Initialize form with data if edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        id_mata_pelajaran: initialData.id_mata_pelajaran?.toString() || '',
        id_kelas: initialData.id_kelas?.toString() || '',
        nama_materi: initialData.nama_materi || ''
      });

      // Set initial jenjang based on existing data
      if (initialData.mata_pelajaran?.jenjang) {
        setSelectedJenjang(initialData.mata_pelajaran.jenjang.id_jenjang?.toString() || '');
      } else if (initialData.kelas?.jenjang) {
        setSelectedJenjang(initialData.kelas.jenjang.id_jenjang?.toString() || '');
      }
    }
  }, [mode, initialData]);

  // Update available options when jenjang changes
  useEffect(() => {
    if (selectedJenjang && cascadeData.data.jenjang.length > 0) {
      // Filter mata pelajaran by jenjang (include global ones)
      const filteredMataPelajaran = cascadeData.data.mata_pelajaran.filter(mp => 
        !mp.id_jenjang || mp.id_jenjang.toString() === selectedJenjang
      );
      setAvailableMataPelajaran(filteredMataPelajaran);

      // Filter kelas by jenjang
      const filteredKelas = cascadeData.data.kelas.filter(k => 
        k.id_jenjang?.toString() === selectedJenjang
      );
      setAvailableKelas(filteredKelas);

      // Reset mata pelajaran and kelas if they don't match new jenjang
      if (formData.id_mata_pelajaran) {
        const currentMataPelajaran = cascadeData.data.mata_pelajaran.find(
          mp => mp.id_mata_pelajaran.toString() === formData.id_mata_pelajaran
        );
        if (currentMataPelajaran?.id_jenjang && 
            currentMataPelajaran.id_jenjang.toString() !== selectedJenjang) {
          setFormData(prev => ({ ...prev, id_mata_pelajaran: '' }));
        }
      }

      if (formData.id_kelas) {
        const currentKelas = cascadeData.data.kelas.find(
          k => k.id_kelas.toString() === formData.id_kelas
        );
        if (currentKelas?.id_jenjang?.toString() !== selectedJenjang) {
          setFormData(prev => ({ ...prev, id_kelas: '' }));
        }
      }
    } else {
      setAvailableMataPelajaran(cascadeData.data.mata_pelajaran);
      setAvailableKelas(cascadeData.data.kelas);
    }
  }, [selectedJenjang, cascadeData.data, formData.id_mata_pelajaran, formData.id_kelas]);

  // Real-time validation when form changes
  useEffect(() => {
    const { id_mata_pelajaran, id_kelas, nama_materi } = formData;
    
    if (id_mata_pelajaran && id_kelas && nama_materi.trim()) {
      const timeoutId = setTimeout(() => {
        validateCombination(
          parseInt(id_mata_pelajaran),
          parseInt(id_kelas),
          nama_materi.trim(),
          mode === 'edit' ? initialData?.id_materi : null
        ).then(result => {
          if (!result.valid) {
            setErrors(prev => ({
              ...prev,
              combination: result.error
            }));
          } else {
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.combination;
              return newErrors;
            });
          }
        });
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [formData, validateCombination, mode, initialData?.id_materi]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id_mata_pelajaran) {
      newErrors.id_mata_pelajaran = 'Mata pelajaran harus dipilih';
    }

    if (!formData.id_kelas) {
      newErrors.id_kelas = 'Kelas harus dipilih';
    }

    if (!formData.nama_materi.trim()) {
      newErrors.nama_materi = 'Nama materi harus diisi';
    }

    // Check jenjang consistency
    if (formData.id_mata_pelajaran && formData.id_kelas) {
      const mataPelajaran = cascadeData.data.mata_pelajaran.find(
        mp => mp.id_mata_pelajaran.toString() === formData.id_mata_pelajaran
      );
      const kelas = cascadeData.data.kelas.find(
        k => k.id_kelas.toString() === formData.id_kelas
      );

      const consistencyCheck = cascadeData.validateJenjangConsistency(mataPelajaran, kelas);
      if (!consistencyCheck.valid) {
        newErrors.consistency = consistencyCheck.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user changes input
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Auto-set jenjang when mata pelajaran or kelas is selected
    if (field === 'id_mata_pelajaran' && value) {
      const mataPelajaran = cascadeData.data.mata_pelajaran.find(
        mp => mp.id_mata_pelajaran.toString() === value
      );
      if (mataPelajaran?.jenjang) {
        setSelectedJenjang(mataPelajaran.jenjang.id_jenjang.toString());
      }
    }

    if (field === 'id_kelas' && value) {
      const kelas = cascadeData.data.kelas.find(
        k => k.id_kelas.toString() === value
      );
      if (kelas?.jenjang) {
        setSelectedJenjang(kelas.jenjang.id_jenjang.toString());
      }
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const submitData = {
      id_mata_pelajaran: parseInt(formData.id_mata_pelajaran),
      id_kelas: parseInt(formData.id_kelas),
      nama_materi: formData.nama_materi.trim()
    };
    
    onSubmit(submitData);
  };

  const getJenjangOptions = () => {
    return cascadeData.data.jenjang.map(item => ({
      label: item.nama_jenjang,
      value: item.id_jenjang.toString(),
      subtitle: item.kode_jenjang
    }));
  };

  const getMataPelajaranOptions = () => {
    return availableMataPelajaran.map(item => ({
      label: item.nama_mata_pelajaran,
      value: item.id_mata_pelajaran.toString(),
      subtitle: `${item.kode_mata_pelajaran} - ${item.kategori}`,
      badge: item.jenjang ? item.jenjang.kode_jenjang : 'Umum'
    }));
  };

  const getKelasOptions = () => {
    return availableKelas.map(item => ({
      label: item.nama_kelas,
      value: item.id_kelas.toString(),
      subtitle: `${item.jenis_kelas} - Urutan ${item.urutan}`,
      badge: item.jenjang?.kode_jenjang
    }));
  };

  if (cascadeData.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        {/* Jenjang Filter */}
        <DropdownSelector
          label="Filter Jenjang (Opsional)"
          value={selectedJenjang}
          onValueChange={setSelectedJenjang}
          options={getJenjangOptions()}
          placeholder="Pilih jenjang untuk filter"
          style={styles.filterDropdown}
        />

        {/* Mata Pelajaran */}
        <DropdownSelector
          label="Mata Pelajaran *"
          value={formData.id_mata_pelajaran}
          onValueChange={(value) => handleInputChange('id_mata_pelajaran', value)}
          options={getMataPelajaranOptions()}
          placeholder="Pilih mata pelajaran"
          error={errors.id_mata_pelajaran}
          disabled={submitting}
          searchable
        />

        {/* Kelas */}
        <DropdownSelector
          label="Kelas *"
          value={formData.id_kelas}
          onValueChange={(value) => handleInputChange('id_kelas', value)}
          options={getKelasOptions()}
          placeholder="Pilih kelas"
          error={errors.id_kelas}
          disabled={submitting}
          searchable
        />

        {/* Nama Materi */}
        <TextInput
          label="Nama Materi *"
          value={formData.nama_materi}
          onChangeText={(value) => handleInputChange('nama_materi', value)}
          placeholder="Contoh: Pengenalan Huruf Vokal"
          error={errors.nama_materi}
          disabled={submitting}
          rightIcon={validating ? 'hourglass-outline' : null}
        />

        {/* Validation Messages */}
        {errors.consistency && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.consistency}</Text>
          </View>
        )}

        {errors.combination && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.combination}</Text>
          </View>
        )}

        {cascadeData.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Gagal memuat data: {cascadeData.error}
            </Text>
          </View>
        )}

        {/* Dependency Info */}
        {formData.id_mata_pelajaran && formData.id_kelas && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Informasi Dependency:</Text>
            <Text style={styles.infoText}>
              Mata Pelajaran: {availableMataPelajaran.find(mp => 
                mp.id_mata_pelajaran.toString() === formData.id_mata_pelajaran
              )?.nama_mata_pelajaran}
            </Text>
            <Text style={styles.infoText}>
              Kelas: {availableKelas.find(k => 
                k.id_kelas.toString() === formData.id_kelas
              )?.nama_kelas}
            </Text>
          </View>
        )}
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
          loading={submitting || validating}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  filterDropdown: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef'
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
    textAlign: 'center'
  },
  infoContainer: {
    backgroundColor: '#d1ecf1',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0c5460',
    marginBottom: 4
  },
  infoText: {
    fontSize: 12,
    color: '#0c5460',
    marginBottom: 2
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

export default MateriForm;