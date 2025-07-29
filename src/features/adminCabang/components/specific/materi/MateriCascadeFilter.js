import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../shared/ActionButton';
import DropdownSelector from '../../shared/DropdownSelector';
import { useCascadeData } from '../../../hooks/useCascadeData';

const MateriCascadeFilter = ({
  visible,
  onClose,
  onApply,
  initialFilters = {},
  title = 'Filter Materi'
}) => {
  const cascadeData = useCascadeData({ autoLoad: true });
  
  const [filters, setFilters] = useState({
    id_jenjang: '',
    id_mata_pelajaran: '',
    id_kelas: '',
    kategori: '',
    ...initialFilters
  });

  const [availableMataPelajaran, setAvailableMataPelajaran] = useState([]);
  const [availableKelas, setAvailableKelas] = useState([]);

  useEffect(() => {
    if (visible) {
      setFilters({ 
        id_jenjang: '',
        id_mata_pelajaran: '',
        id_kelas: '',
        kategori: '',
        ...initialFilters 
      });
    }
  }, [visible, initialFilters]);

  // Update cascade options when jenjang changes
  useEffect(() => {
    if (filters.id_jenjang && cascadeData.data.jenjang.length > 0) {
      const jenjangId = parseInt(filters.id_jenjang);
      
      // Filter mata pelajaran
      const filteredMataPelajaran = cascadeData.data.mata_pelajaran.filter(mp => 
        !mp.id_jenjang || mp.id_jenjang === jenjangId
      );
      setAvailableMataPelajaran(filteredMataPelajaran);

      // Filter kelas
      const filteredKelas = cascadeData.data.kelas.filter(k => 
        k.id_jenjang === jenjangId
      );
      setAvailableKelas(filteredKelas);

      // Reset child selections if they don't match
      if (filters.id_mata_pelajaran) {
        const currentMataPelajaran = cascadeData.data.mata_pelajaran.find(
          mp => mp.id_mata_pelajaran.toString() === filters.id_mata_pelajaran
        );
        if (currentMataPelajaran?.id_jenjang && currentMataPelajaran.id_jenjang !== jenjangId) {
          setFilters(prev => ({ ...prev, id_mata_pelajaran: '' }));
        }
      }

      if (filters.id_kelas) {
        const currentKelas = cascadeData.data.kelas.find(
          k => k.id_kelas.toString() === filters.id_kelas
        );
        if (currentKelas?.id_jenjang !== jenjangId) {
          setFilters(prev => ({ ...prev, id_kelas: '' }));
        }
      }
    } else {
      setAvailableMataPelajaran(cascadeData.data.mata_pelajaran);
      setAvailableKelas(cascadeData.data.kelas);
    }
  }, [filters.id_jenjang, cascadeData.data]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      id_jenjang: '',
      id_mata_pelajaran: '',
      id_kelas: '',
      kategori: ''
    });
  };

  const handleApply = () => {
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {});
    
    onApply(activeFilters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
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

  const getKategoriOptions = () => [
    { label: 'Mata Pelajaran Wajib', value: 'wajib' },
    { label: 'Muatan Lokal', value: 'muatan_lokal' },
    { label: 'Pengembangan Diri', value: 'pengembangan_diri' },
    { label: 'Mata Pelajaran Pilihan', value: 'pilihan' },
    { label: 'Ekstrakurikuler', value: 'ekstrakurikuler' }
  ];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Filter Content */}
          <View style={styles.content}>
            {cascadeData.isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Memuat data filter...</Text>
              </View>
            ) : (
              <>
                {/* Jenjang Filter */}
                <DropdownSelector
                  label="Jenjang"
                  value={filters.id_jenjang}
                  onValueChange={(value) => handleFilterChange('id_jenjang', value)}
                  options={getJenjangOptions()}
                  placeholder="Semua Jenjang"
                  searchable
                />

                {/* Mata Pelajaran Filter */}
                <DropdownSelector
                  label="Mata Pelajaran"
                  value={filters.id_mata_pelajaran}
                  onValueChange={(value) => handleFilterChange('id_mata_pelajaran', value)}
                  options={getMataPelajaranOptions()}
                  placeholder="Semua Mata Pelajaran"
                  searchable
                />

                {/* Kelas Filter */}
                <DropdownSelector
                  label="Kelas"
                  value={filters.id_kelas}
                  onValueChange={(value) => handleFilterChange('id_kelas', value)}
                  options={getKelasOptions()}
                  placeholder="Semua Kelas"
                  searchable
                />

                {/* Kategori Filter */}
                <DropdownSelector
                  label="Kategori Mata Pelajaran"
                  value={filters.kategori}
                  onValueChange={(value) => handleFilterChange('kategori', value)}
                  options={getKategoriOptions()}
                  placeholder="Semua Kategori"
                />

                {/* Filter Summary */}
                {getActiveFiltersCount() > 0 && (
                  <View style={styles.summary}>
                    <Text style={styles.summaryText}>
                      {getActiveFiltersCount()} filter aktif
                    </Text>
                  </View>
                )}

                {/* Cascade Validation Warning */}
                {filters.id_mata_pelajaran && filters.id_kelas && (
                  <View style={styles.validationInfo}>
                    <Ionicons name="information-circle" size={16} color="#007bff" />
                    <Text style={styles.validationText}>
                      Filter akan menampilkan materi yang sesuai dengan kombinasi mata pelajaran dan kelas yang dipilih
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <ActionButton
              title="Reset"
              variant="outline"
              onPress={handleReset}
              style={styles.resetButton}
              disabled={getActiveFiltersCount() === 0}
            />
            
            <ActionButton
              title={`Terapkan${getActiveFiltersCount() > 0 ? ` (${getActiveFiltersCount()})` : ''}`}
              onPress={handleApply}
              style={styles.applyButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '60%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  closeButton: {
    padding: 4
  },
  content: {
    flex: 1,
    padding: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 16,
    color: '#666'
  },
  summary: {
    backgroundColor: '#e7f3ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 16
  },
  summaryText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
    textAlign: 'center'
  },
  validationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#d1ecf1',
    padding: 12,
    borderRadius: 8,
    marginTop: 16
  },
  validationText: {
    fontSize: 12,
    color: '#0c5460',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12
  },
  resetButton: {
    flex: 1
  },
  applyButton: {
    flex: 2
  }
});

export default MateriCascadeFilter;