// src/features/adminCabang/components/specific/kelas/KelasFilter.js
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView,
  TextInput, SafeAreaView, Animated, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStoreSelectors } from '../../../stores';
import CascadeDropdown from '../../shared/CascadeDropdown';
import DropdownSelector from '../../shared/DropdownSelector';
import { ENTITIES } from '../../../stores/masterDataStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * KelasFilter - Specialized filter untuk kelas data
 * Dengan jenis kelas, tingkat, urutan range, dan jenjang dependency
 */
const KelasFilter = ({
  visible = false,
  onClose,
  onApply,
  onReset,
  initialFilters = {}
}) => {
  // ==================== ZUSTAND STORES ====================
  const cascadeActions = useStoreSelectors.cascade.actions();
  const kelasData = useStoreSelectors.masterData.entitiesArray(ENTITIES.KELAS);
  const jenjangOptions = useStoreSelectors.cascade.jenjangOptions();
  
  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const urutanValues = [...new Set(kelasData.map(k => k.urutan).filter(Boolean))].sort((a, b) => a - b);
    const tingkatValues = [...new Set(kelasData.map(k => k.tingkat).filter(Boolean))].sort((a, b) => a - b);
    
    const jenisKelasCounts = kelasData.reduce((acc, k) => {
      acc[k.jenis_kelas] = (acc[k.jenis_kelas] || 0) + 1;
      return acc;
    }, {});
    
    const jenjangCounts = kelasData.reduce((acc, k) => {
      if (k.jenjang) {
        acc[k.jenjang.nama_jenjang] = (acc[k.jenjang.nama_jenjang] || 0) + 1;
      }
      return acc;
    }, {});
    
    return { 
      urutanValues, 
      tingkatValues, 
      jenisKelasCounts, 
      jenjangCounts,
      minUrutan: Math.min(...urutanValues),
      maxUrutan: Math.max(...urutanValues)
    };
  }, [kelasData]);
  
  // ==================== LOCAL STATE ====================
  const [filters, setFilters] = useState({
    search: '',
    id_jenjang: '',
    jenis_kelas: '',
    tingkat: '',
    urutan_min: '',
    urutan_max: '',
    status: '',
    sort_by: 'urutan',
    sort_order: 'asc',
    ...initialFilters
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));
  
  // ==================== COMPUTED VALUES ====================
  
  const jenisKelasOptions = useMemo(() => [
    { 
      label: 'Semua Jenis', 
      value: '',
      count: kelasData.length
    },
    { 
      label: 'Standard', 
      value: 'standard',
      description: 'Kelas dengan tingkat I-XII',
      count: filterOptions.jenisKelasCounts.standard || 0
    },
    { 
      label: 'Custom', 
      value: 'custom',
      description: 'Kelas dengan nama bebas',
      count: filterOptions.jenisKelasCounts.custom || 0
    }
  ], [kelasData.length, filterOptions.jenisKelasCounts]);
  
  const tingkatOptions = useMemo(() => {
    const romans = {
      1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
      7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
    };
    
    return [
      { label: 'Semua Tingkat', value: '' },
      ...filterOptions.tingkatValues.map(tingkat => ({
        label: `Tingkat ${romans[tingkat] || tingkat}`,
        value: tingkat.toString(),
        subtitle: `Tingkat ${tingkat}`
      }))
    ];
  }, [filterOptions.tingkatValues]);
  
  const statusOptions = useMemo(() => [
    { label: 'Semua Status', value: '' },
    { label: 'Aktif', value: 'true' },
    { label: 'Tidak Aktif', value: 'false' }
  ], []);
  
  const sortOptions = useMemo(() => [
    { label: 'Urutan', value: 'urutan' },
    { label: 'Nama Kelas', value: 'nama_kelas' },
    { label: 'Jenis Kelas', value: 'jenis_kelas' },
    { label: 'Tingkat', value: 'tingkat' },
    { label: 'Dibuat', value: 'created_at' },
    { label: 'Diperbarui', value: 'updated_at' }
  ], []);
  
  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (['sort_by', 'sort_order'].includes(key)) return false;
      return value !== '' && value !== null && value !== undefined;
    }).length;
  }, [filters]);
  
  const hasAdvancedFilters = useMemo(() => {
    return filters.urutan_min || filters.urutan_max || filters.tingkat;
  }, [filters.urutan_min, filters.urutan_max, filters.tingkat]);
  
  // ==================== EFFECTS ====================
  
  useEffect(() => {
    if (visible) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [visible, animationValue]);
  
  // ==================== HANDLERS ====================
  
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Handle cascade dependencies
    if (key === 'jenis_kelas' && value !== 'standard') {
      setFilters(prev => ({ ...prev, tingkat: '' }));
    }
  }, []);
  
  const handleApply = useCallback(() => {
    // Validate urutan range
    if (filters.urutan_min && filters.urutan_max) {
      const min = parseInt(filters.urutan_min);
      const max = parseInt(filters.urutan_max);
      
      if (min > max) {
        // Swap values if min > max
        setFilters(prev => ({
          ...prev,
          urutan_min: max.toString(),
          urutan_max: min.toString()
        }));
      }
    }
    
    // Remove empty filters
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    onApply?.(cleanFilters);
    onClose?.();
  }, [filters, onApply, onClose]);
  
  const handleReset = useCallback(() => {
    const resetFilters = {
      search: '',
      id_jenjang: '',
      jenis_kelas: '',
      tingkat: '',
      urutan_min: '',
      urutan_max: '',
      status: '',
      sort_by: 'urutan',
      sort_order: 'asc'
    };
    
    setFilters(resetFilters);
    setShowAdvanced(false);
    
    onReset?.(resetFilters);
  }, [onReset]);
  
  const handleQuickFilter = useCallback((key, value) => {
    const newValue = filters[key] === value ? '' : value;
    handleFilterChange(key, newValue);
  }, [filters, handleFilterChange]);
  
  const handleSortChange = useCallback((field) => {
    if (filters.sort_by === field) {
      // Toggle sort order
      handleFilterChange('sort_order', filters.sort_order === 'asc' ? 'desc' : 'asc');
    } else {
      // Change sort field
      setFilters(prev => ({
        ...prev,
        sort_by: field,
        sort_order: 'asc'
      }));
    }
  }, [filters.sort_by, filters.sort_order, handleFilterChange]);
  
  // ==================== RENDER FUNCTIONS ====================
  
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.title}>Filter Kelas</Text>
        {activeFiltersCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{activeFiltersCount}</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );
  
  const renderBasicFilters = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Filter Dasar</Text>
      
      {/* Search */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Pencarian</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={16} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={filters.search}
            onChangeText={(value) => handleFilterChange('search', value)}
            placeholder="Cari nama kelas..."
            placeholderTextColor="#999"
          />
          {filters.search !== '' && (
            <TouchableOpacity onPress={() => handleFilterChange('search', '')}>
              <Ionicons name="close-circle" size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Jenjang */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Jenjang</Text>
        <CascadeDropdown
          entityType={ENTITIES.JENJANG}
          value={filters.id_jenjang}
          onValueChange={(value) => handleFilterChange('id_jenjang', value)}
          placeholder="Semua Jenjang"
          allowClear
        />
      </View>
      
      {/* Jenis Kelas */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Jenis Kelas</Text>
        <DropdownSelector
          value={filters.jenis_kelas}
          onValueChange={(value) => handleFilterChange('jenis_kelas', value)}
          options={jenisKelasOptions}
          placeholder="Semua Jenis"
        />
      </View>
      
      {/* Status */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Status</Text>
        <DropdownSelector
          value={filters.status}
          onValueChange={(value) => handleFilterChange('status', value)}
          options={statusOptions}
          placeholder="Semua Status"
        />
      </View>
    </View>
  );
  
  const renderAdvancedFilters = () => (
    <View style={styles.section}>
      <TouchableOpacity 
        style={styles.advancedToggle}
        onPress={() => setShowAdvanced(!showAdvanced)}
      >
        <Text style={styles.sectionTitle}>Filter Lanjutan</Text>
        <Ionicons 
          name={showAdvanced ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#666" 
        />
      </TouchableOpacity>
      
      {showAdvanced && (
        <View style={styles.advancedContent}>
          {/* Tingkat (only for standard classes) */}
          {filters.jenis_kelas === 'standard' && (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Tingkat</Text>
              <DropdownSelector
                value={filters.tingkat}
                onValueChange={(value) => handleFilterChange('tingkat', value)}
                options={tingkatOptions}
                placeholder="Semua Tingkat"
              />
            </View>
          )}
          
          {/* Urutan Range */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>
              Rentang Urutan ({filterOptions.minUrutan}-{filterOptions.maxUrutan})
            </Text>
            <View style={styles.rangeContainer}>
              <TextInput
                style={styles.rangeInput}
                value={filters.urutan_min}
                onChangeText={(value) => handleFilterChange('urutan_min', value.replace(/[^0-9]/g, ''))}
                placeholder="Min"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={styles.rangeSeparator}>-</Text>
              <TextInput
                style={styles.rangeInput}
                value={filters.urutan_max}
                onChangeText={(value) => handleFilterChange('urutan_max', value.replace(/[^0-9]/g, ''))}
                placeholder="Max"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
  
  const renderQuickFilters = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Filter Cepat</Text>
      <View style={styles.chipContainer}>
        <TouchableOpacity
          style={[
            styles.chip,
            filters.jenis_kelas === 'standard' && styles.chipActive
          ]}
          onPress={() => handleQuickFilter('jenis_kelas', 'standard')}
        >
          <Text style={[
            styles.chipText,
            filters.jenis_kelas === 'standard' && styles.chipTextActive
          ]}>
            Standard ({jenisKelasOptions[1]?.count || 0})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.chip,
            filters.jenis_kelas === 'custom' && styles.chipActive
          ]}
          onPress={() => handleQuickFilter('jenis_kelas', 'custom')}
        >
          <Text style={[
            styles.chipText,
            filters.jenis_kelas === 'custom' && styles.chipTextActive
          ]}>
            Custom ({jenisKelasOptions[2]?.count || 0})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.chip,
            filters.status === 'true' && styles.chipActive
          ]}
          onPress={() => handleQuickFilter('status', 'true')}
        >
          <Text style={[
            styles.chipText,
            filters.status === 'true' && styles.chipTextActive
          ]}>
            Aktif
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderSortOptions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Urutan</Text>
      <View style={styles.sortContainer}>
        <DropdownSelector
          value={filters.sort_by}
          onValueChange={(value) => handleFilterChange('sort_by', value)}
          options={sortOptions}
          placeholder="Pilih urutan"
          style={styles.sortDropdown}
        />
        
        <TouchableOpacity
          style={[
            styles.sortOrderButton,
            filters.sort_order === 'desc' && styles.sortOrderButtonActive
          ]}
          onPress={() => handleFilterChange('sort_order', filters.sort_order === 'asc' ? 'desc' : 'asc')}
        >
          <Ionicons 
            name={filters.sort_order === 'asc' ? "arrow-up" : "arrow-down"} 
            size={16} 
            color={filters.sort_order === 'desc' ? '#fff' : '#666'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderActions = () => (
    <View style={styles.actions}>
      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={handleReset}
      >
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.applyButton]}
        onPress={handleApply}
      >
        <Text style={styles.applyButtonText}>
          Terapkan {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  if (!visible) return null;
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderBasicFilters()}
          {renderAdvancedFilters()}
          {renderQuickFilters()}
          {renderSortOptions()}
        </ScrollView>
        
        {renderActions()}
      </SafeAreaView>
    </Modal>
  );
};

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  badge: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600'
  },
  closeButton: {
    padding: 4
  },
  content: {
    flex: 1
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  field: {
    marginBottom: 16
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff'
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333'
  },
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  advancedContent: {
    marginTop: 8
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rangeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    textAlign: 'center'
  },
  rangeSeparator: {
    marginHorizontal: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '600'
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  chipActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff'
  },
  chipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500'
  },
  chipTextActive: {
    color: '#fff'
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sortDropdown: {
    flex: 1,
    marginRight: 12
  },
  sortOrderButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sortOrderButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff'
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  resetButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  applyButton: {
    backgroundColor: '#007bff'
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff'
  }
});

export default KelasFilter;