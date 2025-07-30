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
  const cascadeData = useCascadeData({ autoLoad: true });
  
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

  const jenjangOptions = [
    { label: 'Semua Jenjang', value: null },
    ...cascadeData.getJenjangOptions()
  ];

  const kategoriOptions = [
    { label: 'Semua Kategori', value: null },
    ...cascadeData.getKategoriOptions()
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
        const jenjang = cascadeData.getJenjangOptions().find(j => j.value === value);
        return jenjang ? jenjang.label : 'Jenjang';
      case 'kategori':
        const kategori = cascadeData.getKategoriOptions().find(k => k.value === value);
        return kategori ? kategori.label : 'Kategori';
      case 'status':
        return value === 'aktif' ? 'Aktif' : 'Nonaktif';
      default:
        return value;
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Filter Mata Pelajaran</Text>
          {activeFilterCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </View>

        {/* Active Filters Chips */}
        {activeFilterCount > 0 && (
          <View style={styles.chipsContainer}>
            <Text style={styles.chipsLabel}>Filter Aktif:</Text>
            <View style={styles.chipsRow}>
              {Object.entries(localFilters).map(([key, value]) => {
                if (value === null || value === '') return null;
                return (
                  <FilterChip
                    key={key}
                    label={getFilterLabel(key, value)}
                    onRemove={() => removeFilter(key)}
                    style={styles.chip}
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* Filter Controls */}
        <View style={styles.filtersSection}>
          <DropdownSelector
            label="Jenjang"
            value={localFilters.id_jenjang}
            options={jenjangOptions}
            onSelect={(value) => handleFilterChange('id_jenjang', value)}
            placeholder="Pilih Jenjang"
            style={styles.dropdown}
            loading={cascadeData.loading.jenjang}
          />

          <DropdownSelector
            label="Kategori"
            value={localFilters.kategori}
            options={kategoriOptions}
            onSelect={(value) => handleFilterChange('kategori', value)}
            placeholder="Pilih Kategori"
            style={styles.dropdown}
          />

          <DropdownSelector
            label="Status"
            value={localFilters.status}
            options={statusOptions}
            onSelect={(value) => handleFilterChange('status', value)}
            placeholder="Pilih Status"
            style={styles.dropdown}
          />
        </View>

        {/* Error handling */}
        {cascadeData.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{cascadeData.error}</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <ActionButton
          title="Reset"
          onPress={handleReset}
          variant="outline"
          style={styles.resetButton}
          disabled={activeFilterCount === 0}
        />
        <ActionButton
          title={`Terapkan${activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}`}
          onPress={handleApply}
          style={styles.applyButton}
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
    flex: 1,
    paddingHorizontal: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827'
  },
  badge: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center'
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },
  chipsContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  chipsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    marginBottom: 4
  },
  filtersSection: {
    paddingVertical: 16,
    gap: 16
  },
  dropdown: {
    marginBottom: 8
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
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
  resetButton: {
    flex: 1
  },
  applyButton: {
    flex: 2
  }
});

export default MataPelajaranFilter;