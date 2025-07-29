import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DropdownSelector from '../../shared/DropdownSelector';
import FilterChip from '../../shared/FilterChip';
import ActionButton from '../../shared/ActionButton';
import { useCascadeData } from '../../../hooks/useCascadeData';

const MataPelajaranFilter = ({
  filters = {},
  onApplyFilters,
  onResetFilters,
  onClose,
  visible = true
}) => {
  const { getJenjangOptions, getKategoriOptions } = useCascadeData();
  
  const [localFilters, setLocalFilters] = useState({
    id_jenjang: null,
    kategori: null,
    status: null,
    ...filters
  });

  const [activeFilterCount, setActiveFilterCount] = useState(0);

  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }));
  }, [filters]);

  useEffect(() => {
    const count = Object.values(localFilters).filter(value => value !== null && value !== '').length;
    setActiveFilterCount(count);
  }, [localFilters]);

  const statusOptions = [
    { label: 'Semua Status', value: null },
    { label: 'Aktif', value: 'aktif' },
    { label: 'Nonaktif', value: 'nonaktif' }
  ];

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(localFilters).filter(([key, value]) => value !== null && value !== '')
    );
    onApplyFilters(cleanFilters);
    onClose?.();
  };

  const handleReset = () => {
    const resetFilters = {
      id_jenjang: null,
      kategori: null,
      status: null
    };
    setLocalFilters(resetFilters);
    onResetFilters();
  };

  const removeFilter = (key) => {
    handleFilterChange(key, null);
  };

  const getFilterLabel = (key, value) => {
    switch (key) {
      case 'id_jenjang':
        const jenjang = getJenjangOptions().find(j => j.value === value);
        return jenjang ? jenjang.label : 'Jenjang';
      case 'kategori':
        const kategori = getKategoriOptions().find(k => k.value === value);
        return kategori ? kategori.label : 'Kategori';
      case 'status':
        return value === 'aktif' ? 'Status: Aktif' : 'Status: Nonaktif';
      default:
        return value;
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter Mata Pelajaran</Text>
        {activeFilterCount > 0 && (
          <View style={styles.filterCount}>
            <Text style={styles.filterCountText}>{activeFilterCount}</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <View style={styles.activeFiltersSection}>
            <Text style={styles.sectionTitle}>Filter Aktif</Text>
            <View style={styles.activeFilters}>
              {Object.entries(localFilters).map(([key, value]) => {
                if (value === null || value === '') return null;
                return (
                  <FilterChip
                    key={key}
                    label={getFilterLabel(key, value)}
                    onRemove={() => removeFilter(key)}
                    style={styles.filterChip}
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* Filter Options */}
        <View style={styles.filtersSection}>
          <DropdownSelector
            label="Jenjang"
            value={localFilters.id_jenjang}
            onSelect={(value) => handleFilterChange('id_jenjang', value)}
            options={getJenjangOptions()}
            placeholder="Semua Jenjang"
            style={styles.filterDropdown}
          />

          <DropdownSelector
            label="Kategori"
            value={localFilters.kategori}
            onSelect={(value) => handleFilterChange('kategori', value)}
            options={getKategoriOptions()}
            placeholder="Semua Kategori"
            style={styles.filterDropdown}
          />

          <DropdownSelector
            label="Status"
            value={localFilters.status}
            onSelect={(value) => handleFilterChange('status', value)}
            options={statusOptions}
            placeholder="Semua Status"
            style={styles.filterDropdown}
          />
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <ActionButton
          title="Reset"
          variant="outline"
          onPress={handleReset}
          disabled={activeFilterCount === 0}
          style={styles.resetButton}
        />
        
        <ActionButton
          title="Terapkan Filter"
          onPress={handleApply}
          style={styles.applyButton}
          icon="checkmark"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  filterCount: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    paddingHorizontal: 20
  },
  activeFiltersSection: {
    paddingVertical: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  filterChip: {
    marginBottom: 8
  },
  filtersSection: {
    paddingVertical: 16
  },
  filterDropdown: {
    marginBottom: 16
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12
  },
  resetButton: {
    flex: 1
  },
  applyButton: {
    flex: 2
  }
});

export default MataPelajaranFilter;