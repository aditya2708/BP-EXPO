// src/features/adminCabang/components/specific/materi/MateriFilter.js
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView,
  TextInput, Switch, SafeAreaView, Animated, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStoreSelectors } from '../../../stores';
import CascadeDropdown from '../../shared/CascadeDropdown';
import DropdownSelector from '../../shared/DropdownSelector';
import { ENTITIES } from '../../../stores/masterDataStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * MateriFilter - Specialized filter untuk materi dengan triple cascade dependencies
 * Supports jenjang > mata pelajaran > kelas filtering plus materi-specific filters
 */
const MateriFilter = ({
  visible = false,
  onClose,
  onApply,
  onReset,
  initialFilters = {}
}) => {
  // ==================== ZUSTAND STORES ====================
  const cascadeActions = useStoreSelectors.cascade.actions();
  const materiData = useStoreSelectors.masterData.entitiesArray(ENTITIES.MATERI);
  const jenjangOptions = useStoreSelectors.cascade.jenjangOptions();
  const selectedJenjang = useStoreSelectors.cascade.selected('jenjang');
  const selectedMataPelajaran = useStoreSelectors.cascade.selected('mataPelajaran');
  const selectedKelas = useStoreSelectors.cascade.selected('kelas');
  
  // Get cascade options
  const mataPelajaranOptions = useMemo(() => {
    return useStoreSelectors.cascade.mataPelajaranOptions(selectedJenjang);
  }, [selectedJenjang]);
  
  const kelasOptions = useMemo(() => {
    return useStoreSelectors.cascade.kelasOptions(selectedJenjang);
  }, [selectedJenjang]);
  
  // ==================== LOCAL STATE ====================
  const [filters, setFilters] = useState({
    // Text search
    search: '',
    
    // Cascade filters
    id_jenjang: '',
    id_mata_pelajaran: '',
    id_kelas: '',
    
    // Materi-specific filters
    status: '',
    has_files: null,
    usage_min: '',
    usage_max: '',
    created_after: '',
    created_before: '',
    kategori_mata_pelajaran: '',
    jenis_kelas: '',
    
    // Advanced filters
    show_inactive: false,
    only_with_kurikulum: false,
    ...initialFilters
  });
  
  const [animationValue] = useState(new Animated.Value(0));
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // ==================== COMPUTED VALUES ====================
  
  // Get unique values for filter options dari data yang ada
  const filterOptions = useMemo(() => {
    const kategoriOptions = [...new Set(
      materiData
        .map(m => m.mataPelajaran?.kategori)
        .filter(Boolean)
    )].map(kategori => ({ 
      label: kategori.replace('_', ' ').toUpperCase(), 
      value: kategori 
    }));
    
    const jenisKelasOptions = [...new Set(
      materiData
        .map(m => m.kelas?.jenis_kelas)
        .filter(Boolean)
    )].map(jenis => ({ 
      label: jenis.replace('_', ' ').toUpperCase(), 
      value: jenis 
    }));
    
    const usageCounts = materiData.map(m => m.usage_count || 0).filter(count => count > 0);
    const maxUsage = usageCounts.length > 0 ? Math.max(...usageCounts) : 100;
    
    return { kategoriOptions, jenisKelasOptions, maxUsage };
  }, [materiData]);
  
  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'show_inactive' || key === 'only_with_kurikulum') {
        return value === true;
      }
      return value !== '' && value !== null && value !== undefined;
    }).length;
  }, [filters]);
  
  const presetFilters = useMemo(() => ([
    {
      id: 'aktif_banyak_dipakai',
      label: 'Populer & Aktif',
      description: 'Materi aktif dengan usage tinggi',
      filters: { status: 'aktif', usage_min: '5' }
    },
    {
      id: 'ada_file',
      label: 'Ada File',
      description: 'Materi yang memiliki file attachment',
      filters: { has_files: true }
    },
    {
      id: 'belum_dipakai',
      label: 'Belum Digunakan',
      description: 'Materi yang belum pernah digunakan',
      filters: { usage_max: '0' }
    },
    {
      id: 'wajib_standard',
      label: 'Mata Pelajaran Wajib - Kelas Standard',
      description: 'Materi untuk MP wajib di kelas standard',
      filters: { kategori_mata_pelajaran: 'wajib', jenis_kelas: 'standard' }
    },
    {
      id: 'ekstrakurikuler',
      label: 'Ekstrakurikuler',
      description: 'Materi untuk kegiatan ekstrakurikuler',
      filters: { kategori_mata_pelajaran: 'ekstrakurikuler' }
    }
  ]), []);
  
  // ==================== EFFECTS ====================
  
  // Open animation
  useEffect(() => {
    if (visible) {
      Animated.spring(animationValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8
      }).start();
    } else {
      animationValue.setValue(0);
    }
  }, [visible, animationValue]);
  
  // Update cascade selections when filters change
  useEffect(() => {
    if (filters.id_jenjang) {
      cascadeActions.setSelected('jenjang', filters.id_jenjang);
    }
    if (filters.id_mata_pelajaran) {
      cascadeActions.setSelected('mataPelajaran', filters.id_mata_pelajaran);
    }
    if (filters.id_kelas) {
      cascadeActions.setSelected('kelas', filters.id_kelas);
    }
  }, [filters.id_jenjang, filters.id_mata_pelajaran, filters.id_kelas, cascadeActions]);
  
  // ==================== HANDLERS ====================
  
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Handle cascade dependencies
    if (key === 'id_jenjang') {
      setFilters(prev => ({
        ...prev,
        id_mata_pelajaran: '',
        id_kelas: ''
      }));
      cascadeActions.setSelected('mataPelajaran', null);
      cascadeActions.setSelected('kelas', null);
    } else if (key === 'id_mata_pelajaran') {
      // Keep kelas selection if compatible
      cascadeActions.setSelected('mataPelajaran', value);
    } else if (key === 'id_kelas') {
      cascadeActions.setSelected('kelas', value);
    }
  }, [cascadeActions]);
  
  const handlePresetSelect = useCallback((preset) => {
    setFilters(prev => ({ ...prev, ...preset.filters }));
  }, []);
  
  const handleReset = useCallback(() => {
    const resetFilters = {
      search: '',
      id_jenjang: '',
      id_mata_pelajaran: '',
      id_kelas: '',
      status: '',
      has_files: null,
      usage_min: '',
      usage_max: '',
      created_after: '',
      created_before: '',
      kategori_mata_pelajaran: '',
      jenis_kelas: '',
      show_inactive: false,
      only_with_kurikulum: false
    };
    
    setFilters(resetFilters);
    
    // Reset cascade selections
    cascadeActions.setSelected('jenjang', null);
    cascadeActions.setSelected('mataPelajaran', null);
    cascadeActions.setSelected('kelas', null);
    
    if (onReset) {
      onReset();
    }
  }, [cascadeActions, onReset]);
  
  const handleApply = useCallback(() => {
    // Clean filters - remove empty values
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (key === 'show_inactive' || key === 'only_with_kurikulum') {
        if (value === true) acc[key] = value;
      } else if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    onApply(cleanFilters);
    onClose();
  }, [filters, onApply, onClose]);
  
  const handleClose = useCallback(() => {
    Animated.timing(animationValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      onClose();
    });
  }, [animationValue, onClose]);
  
  // ==================== RENDER ====================
  
  if (!visible) return null;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modal,
            {
              transform: [{
                translateY: animationValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [SCREEN_WIDTH, 0]
                })
              }]
            }
          ]}
        >
          <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.title}>Filter Materi</Text>
                {activeFiltersCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{activeFiltersCount}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Search */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pencarian</Text>
                <TextInput
                  style={styles.searchInput}
                  value={filters.search}
                  onChangeText={(value) => handleFilterChange('search', value)}
                  placeholder="Cari nama materi..."
                  clearButtonMode="while-editing"
                />
              </View>
              
              {/* Cascade Filters */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Filter Hierarki</Text>
                
                {/* Jenjang */}
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Jenjang</Text>
                  <CascadeDropdown
                    value={filters.id_jenjang}
                    options={[{ label: 'Semua Jenjang', value: '' }, ...jenjangOptions]}
                    onValueChange={(value) => handleFilterChange('id_jenjang', value)}
                    placeholder="Pilih jenjang"
                  />
                </View>
                
                {/* Mata Pelajaran */}
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Mata Pelajaran</Text>
                  <DropdownSelector
                    value={filters.id_mata_pelajaran}
                    options={[{ label: 'Semua Mata Pelajaran', value: '' }, ...mataPelajaranOptions]}
                    onValueChange={(value) => handleFilterChange('id_mata_pelajaran', value)}
                    placeholder="Pilih mata pelajaran"
                    disabled={!filters.id_jenjang}
                  />
                </View>
                
                {/* Kelas */}
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Kelas</Text>
                  <DropdownSelector
                    value={filters.id_kelas}
                    options={[{ label: 'Semua Kelas', value: '' }, ...kelasOptions]}
                    onValueChange={(value) => handleFilterChange('id_kelas', value)}
                    placeholder="Pilih kelas"
                    disabled={!filters.id_jenjang}
                  />
                </View>
              </View>
              
              {/* Quick Filters */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Filter Cepat</Text>
                <View style={styles.presetGrid}>
                  {presetFilters.map((preset) => (
                    <TouchableOpacity
                      key={preset.id}
                      style={styles.presetCard}
                      onPress={() => handlePresetSelect(preset)}
                    >
                      <Text style={styles.presetLabel}>{preset.label}</Text>
                      <Text style={styles.presetDescription}>{preset.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Status & Files */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Status & File</Text>
                
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Status</Text>
                  <DropdownSelector
                    value={filters.status}
                    options={[
                      { label: 'Semua Status', value: '' },
                      { label: 'Aktif', value: 'aktif' },
                      { label: 'Tidak Aktif', value: 'tidak_aktif' }
                    ]}
                    onValueChange={(value) => handleFilterChange('status', value)}
                    placeholder="Pilih status"
                  />
                </View>
                
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>File Attachment</Text>
                  <DropdownSelector
                    value={filters.has_files}
                    options={[
                      { label: 'Semua', value: null },
                      { label: 'Ada File', value: true },
                      { label: 'Tidak Ada File', value: false }
                    ]}
                    onValueChange={(value) => handleFilterChange('has_files', value)}
                    placeholder="Pilih kondisi file"
                  />
                </View>
              </View>
              
              {/* Category Filters */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Kategori</Text>
                
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Kategori Mata Pelajaran</Text>
                  <DropdownSelector
                    value={filters.kategori_mata_pelajaran}
                    options={[
                      { label: 'Semua Kategori', value: '' },
                      ...filterOptions.kategoriOptions
                    ]}
                    onValueChange={(value) => handleFilterChange('kategori_mata_pelajaran', value)}
                    placeholder="Pilih kategori"
                  />
                </View>
                
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Jenis Kelas</Text>
                  <DropdownSelector
                    value={filters.jenis_kelas}
                    options={[
                      { label: 'Semua Jenis', value: '' },
                      ...filterOptions.jenisKelasOptions
                    ]}
                    onValueChange={(value) => handleFilterChange('jenis_kelas', value)}
                    placeholder="Pilih jenis kelas"
                  />
                </View>
              </View>
              
              {/* Usage Analytics */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Analisis Penggunaan</Text>
                
                <View style={styles.rangeGroup}>
                  <Text style={styles.filterLabel}>Rentang Usage Count</Text>
                  <View style={styles.rangeInputs}>
                    <TextInput
                      style={styles.rangeInput}
                      value={filters.usage_min}
                      onChangeText={(value) => handleFilterChange('usage_min', value)}
                      placeholder="Min"
                      keyboardType="numeric"
                    />
                    <Text style={styles.rangeSeparator}>-</Text>
                    <TextInput
                      style={styles.rangeInput}
                      value={filters.usage_max}
                      onChangeText={(value) => handleFilterChange('usage_max', value)}
                      placeholder="Max"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
              
              {/* Advanced Toggle */}
              <TouchableOpacity
                style={styles.advancedToggle}
                onPress={() => setShowAdvanced(!showAdvanced)}
              >
                <Text style={styles.advancedText}>Filter Lanjutan</Text>
                <Ionicons 
                  name={showAdvanced ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#007bff" 
                />
              </TouchableOpacity>
              
              {/* Advanced Filters */}
              {showAdvanced && (
                <View style={styles.section}>
                  <View style={styles.switchGroup}>
                    <Text style={styles.switchLabel}>Tampilkan Tidak Aktif</Text>
                    <Switch
                      value={filters.show_inactive}
                      onValueChange={(value) => handleFilterChange('show_inactive', value)}
                      trackColor={{ false: '#767577', true: '#007bff' }}
                      thumbColor={filters.show_inactive ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                  
                  <View style={styles.switchGroup}>
                    <Text style={styles.switchLabel}>Hanya yang Ada di Kurikulum</Text>
                    <Switch
                      value={filters.only_with_kurikulum}
                      onValueChange={(value) => handleFilterChange('only_with_kurikulum', value)}
                      trackColor={{ false: '#767577', true: '#007bff' }}
                      thumbColor={filters.only_with_kurikulum ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                  
                  <View style={styles.dateGroup}>
                    <Text style={styles.filterLabel}>Rentang Tanggal Dibuat</Text>
                    <View style={styles.dateInputs}>
                      <TextInput
                        style={styles.dateInput}
                        value={filters.created_after}
                        onChangeText={(value) => handleFilterChange('created_after', value)}
                        placeholder="YYYY-MM-DD"
                      />
                      <Text style={styles.dateSeparator}>sampai</Text>
                      <TextInput
                        style={styles.dateInput}
                        value={filters.created_before}
                        onChangeText={(value) => handleFilterChange('created_before', value)}
                        placeholder="YYYY-MM-DD"
                      />
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
            
            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyText}>
                  Terapkan {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
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
    maxHeight: '90%'
  },
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  badge: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  closeButton: {
    padding: 4
  },
  content: {
    flex: 1
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  filterGroup: {
    marginBottom: 16
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  presetCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    minWidth: '45%'
  },
  presetLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  presetDescription: {
    fontSize: 12,
    color: '#666'
  },
  rangeGroup: {
    marginBottom: 16
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  rangeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlign: 'center'
  },
  rangeSeparator: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold'
  },
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa'
  },
  advancedText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
    marginRight: 8
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1
  },
  dateGroup: {
    marginBottom: 16
  },
  dateInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    textAlign: 'center'
  },
  dateSeparator: {
    fontSize: 14,
    color: '#666'
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12
  },
  resetButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6c757d',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  resetText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '500'
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  applyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default MateriFilter;