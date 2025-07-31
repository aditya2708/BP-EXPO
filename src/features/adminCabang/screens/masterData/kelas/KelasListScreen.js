// src/features/adminCabang/screens/masterData/kelas/KelasListScreen.js
import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, RefreshControl, 
  FlatList, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useStoreSelectors } from '../../../stores';
import KelasCard from '../../../components/specific/kelas/KelasCard';
import KelasFilter from '../../../components/specific/kelas/KelasFilter';
import SearchBar from '../../../components/shared/SearchBar';
import CascadeDropdown from '../../../components/shared/CascadeDropdown';
import { ENTITIES } from '../../../stores/masterDataStore';

/**
 * KelasListScreen - Complete screen untuk manage kelas data
 * Dengan jenjang cascade, jenis kelas filtering, tingkat logic, dan CRUD operations
 */
const KelasListScreen = ({ navigation }) => {
  // ==================== ZUSTAND STORES ====================
  const masterDataActions = useStoreSelectors.masterData.actions();
  const cascadeActions = useStoreSelectors.cascade.actions();
  const uiActions = useStoreSelectors.ui.actions();
  
  const kelasData = useStoreSelectors.masterData.entitiesWithRelations(ENTITIES.KELAS);
  const loading = useStoreSelectors.ui.loading(ENTITIES.KELAS);
  const refreshing = useStoreSelectors.ui.loading(ENTITIES.KELAS, 'refreshing');
  const error = useStoreSelectors.ui.error(ENTITIES.KELAS);
  const jenjangOptions = useStoreSelectors.cascade.jenjangOptions();
  
  // ==================== LOCAL STATE ====================
  const [searchText, setSearchText] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('urutan');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'compact'
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedJenjang, setSelectedJenjang] = useState(null);
  
  // ==================== COMPUTED VALUES ====================
  
  // Calculate statistics
  const statistics = useMemo(() => {
    const total = kelasData.length;
    const standard = kelasData.filter(k => k.jenis_kelas === 'standard').length;
    const custom = kelasData.filter(k => k.jenis_kelas === 'custom').length;
    const active = kelasData.filter(k => k.is_active !== false).length;
    const inactive = total - active;
    
    return { total, standard, custom, active, inactive };
  }, [kelasData]);
  
  // Apply filters and search to kelas data
  const filteredData = useMemo(() => {
    let filtered = [...kelasData];
    
    // Apply search
    if (searchText.trim()) {
      const searchTerm = searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.nama_kelas?.toLowerCase().includes(searchTerm) ||
        item.jenjang?.nama_jenjang?.toLowerCase().includes(searchTerm) ||
        item.jenjang?.kode_jenjang?.toLowerCase().includes(searchTerm) ||
        item.deskripsi?.toLowerCase().includes(searchTerm) ||
        item.urutan?.toString().includes(searchTerm) ||
        item.tingkat?.toString().includes(searchTerm)
      );
    }
    
    // Apply jenjang filter
    if (selectedJenjang) {
      filtered = filtered.filter(item => 
        item.id_jenjang?.toString() === selectedJenjang.toString()
      );
    }
    
    // Apply other filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (!value) return;
      
      switch (key) {
        case 'id_jenjang':
          filtered = filtered.filter(item => 
            item.id_jenjang?.toString() === value.toString()
          );
          break;
          
        case 'jenis_kelas':
          filtered = filtered.filter(item => item.jenis_kelas === value);
          break;
          
        case 'tingkat':
          filtered = filtered.filter(item => 
            item.tingkat?.toString() === value.toString()
          );
          break;
          
        case 'status':
          filtered = filtered.filter(item => {
            const isActive = item.is_active !== false;
            return value === 'true' ? isActive : !isActive;
          });
          break;
          
        case 'urutan_min':
          filtered = filtered.filter(item => 
            (item.urutan || 0) >= parseInt(value)
          );
          break;
          
        case 'urutan_max':
          filtered = filtered.filter(item => 
            (item.urutan || 0) <= parseInt(value)
          );
          break;
      }
    });
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle special sorting cases
      if (sortBy === 'urutan' || sortBy === 'tingkat') {
        aValue = a[sortBy] || 0;
        bValue = b[sortBy] || 0;
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase() || '';
      }
      
      let result = 0;
      if (aValue < bValue) result = -1;
      else if (aValue > bValue) result = 1;
      
      return sortOrder === 'desc' ? -result : result;
    });
    
    return filtered;
  }, [kelasData, searchText, selectedJenjang, activeFilters, sortBy, sortOrder]);
  
  const hasActiveFilters = useMemo(() => {
    return Object.values(activeFilters).some(value => value !== '' && value !== null) || 
           selectedJenjang || searchText.trim();
  }, [activeFilters, selectedJenjang, searchText]);
  
  // ==================== EFFECTS ====================
  
  // Load data when screen is focused
  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [])
  );
  
  // ==================== HANDLERS ====================
  
  const handleRefresh = useCallback(async () => {
    try {
      await masterDataActions.load(ENTITIES.KELAS, { 
        refreshing: true,
        with_relations: true 
      });
    } catch (err) {
      console.error('Error refreshing kelas:', err);
    }
  }, [masterDataActions]);
  
  const handleItemPress = useCallback((item) => {
    if (selectionMode) {
      handleItemSelect(item.id_kelas);
      return;
    }
    
    navigation.navigate('KelasDetail', { 
      kelasId: item.id_kelas,
      title: item.nama_kelas 
    });
  }, [selectionMode, navigation]);
  
  const handleCreatePress = useCallback(() => {
    navigation.navigate('KelasForm', { 
      mode: 'create',
      title: 'Tambah Kelas Baru' 
    });
  }, [navigation]);
  
  const handleEditPress = useCallback((item) => {
    navigation.navigate('KelasForm', { 
      mode: 'edit',
      item,
      title: `Edit ${item.nama_kelas}` 
    });
  }, [navigation]);
  
  const handleDeletePress = useCallback(async (item) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus kelas "${item.nama_kelas}"?\n\nTindakan ini tidak dapat dibatalkan.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await masterDataActions.delete(ENTITIES.KELAS, item.id_kelas);
              uiActions.showSuccess(`Kelas "${item.nama_kelas}" berhasil dihapus`);
            } catch (err) {
              console.error('Error deleting kelas:', err);
              uiActions.setError(ENTITIES.KELAS, err.message || 'Gagal menghapus kelas');
            }
          }
        }
      ]
    );
  }, [masterDataActions, uiActions]);
  
  const handleStatsPress = useCallback((item) => {
    navigation.navigate('KelasStats', { 
      kelasId: item.id_kelas,
      title: `Statistik ${item.nama_kelas}` 
    });
  }, [navigation]);
  
  const handleFilterApply = useCallback((filters) => {
    setActiveFilters(filters);
    setShowFilter(false);
  }, []);
  
  const handleFilterReset = useCallback(() => {
    setActiveFilters({});
    setSelectedJenjang(null);
    setSearchText('');
    setShowFilter(false);
  }, []);
  
  const handleSortChange = useCallback((field, order = null) => {
    setSortBy(field);
    setSortOrder(order || (sortOrder === 'asc' ? 'desc' : 'asc'));
  }, [sortOrder]);
  
  const handleItemSelect = useCallback((itemId) => {
    setSelectedItems(prev => {
      const isSelected = prev.includes(itemId);
      if (isSelected) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);
  
  const handleBulkAction = useCallback(async (action) => {
    if (selectedItems.length === 0) return;
    
    const selectedKelas = kelasData.filter(item => 
      selectedItems.includes(item.id_kelas)
    );
    
    switch (action) {
      case 'delete':
        Alert.alert(
          'Konfirmasi Hapus',
          `Hapus ${selectedItems.length} kelas yang dipilih?`,
          [
            { text: 'Batal', style: 'cancel' },
            {
              text: 'Hapus',
              style: 'destructive',
              onPress: async () => {
                try {
                  await Promise.all(
                    selectedItems.map(id => 
                      masterDataActions.delete(ENTITIES.KELAS, id)
                    )
                  );
                  setSelectedItems([]);
                  setSelectionMode(false);
                  uiActions.showSuccess(`${selectedItems.length} kelas berhasil dihapus`);
                } catch (err) {
                  uiActions.setError(ENTITIES.KELAS, err.message);
                }
              }
            }
          ]
        );
        break;
        
      case 'activate':
        try {
          await Promise.all(
            selectedItems.map(id => 
              masterDataActions.update(ENTITIES.KELAS, id, { is_active: true })
            )
          );
          setSelectedItems([]);
          setSelectionMode(false);
          uiActions.showSuccess(`${selectedItems.length} kelas berhasil diaktifkan`);
        } catch (err) {
          uiActions.setError(ENTITIES.KELAS, err.message);
        }
        break;
        
      case 'deactivate':
        try {
          await Promise.all(
            selectedItems.map(id => 
              masterDataActions.update(ENTITIES.KELAS, id, { is_active: false })
            )
          );
          setSelectedItems([]);
          setSelectionMode(false);
          uiActions.showSuccess(`${selectedItems.length} kelas berhasil dinonaktifkan`);
        } catch (err) {
          uiActions.setError(ENTITIES.KELAS, err.message);
        }
        break;
    }
  }, [selectedItems, kelasData, masterDataActions, uiActions]);
  
  // ==================== RENDER FUNCTIONS ====================
  
  const renderHeader = () => (
    <View style={styles.header}>
      {/* Title and Statistics */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Data Kelas</Text>
        <Text style={styles.subtitle}>
          {statistics.total} total • {statistics.standard} standard • {statistics.custom} custom • {statistics.active} aktif
        </Text>
      </View>
      
      {/* Search Bar */}
      <SearchBar
        value={searchText}
        onValueChange={setSearchText}
        placeholder="Cari nama kelas, jenjang..."
        style={styles.searchBar}
      />
      
      {/* Jenjang Filter */}
      <View style={styles.jenjangFilter}>
        <CascadeDropdown
          entityType={ENTITIES.JENJANG}
          value={selectedJenjang}
          onValueChange={setSelectedJenjang}
          placeholder="Semua Jenjang"
          allowClear
          style={styles.jenjangDropdown}
        />
      </View>
      
      {/* Filter and View Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, hasActiveFilters && styles.controlButtonActive]}
          onPress={() => setShowFilter(true)}
        >
          <Ionicons 
            name="filter" 
            size={16} 
            color={hasActiveFilters ? '#fff' : '#666'} 
          />
          <Text style={[
            styles.controlButtonText,
            hasActiveFilters && styles.controlButtonTextActive
          ]}>
            Filter {hasActiveFilters && `(${Object.values(activeFilters).filter(Boolean).length + (selectedJenjang ? 1 : 0)})`}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            handleSortChange(sortBy, newOrder);
          }}
        >
          <Ionicons 
            name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} 
            size={16} 
            color="#666" 
          />
          <Text style={styles.controlButtonText}>
            {sortBy === 'urutan' ? 'Urutan' : 'Nama'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setViewMode(viewMode === 'card' ? 'compact' : 'card')}
        >
          <Ionicons 
            name={viewMode === 'card' ? 'list-outline' : 'grid-outline'} 
            size={16} 
            color="#666" 
          />
        </TouchableOpacity>
        
        {kelasData.length > 0 && (
          <TouchableOpacity
            style={[styles.controlButton, selectionMode && styles.controlButtonActive]}
            onPress={() => {
              setSelectionMode(!selectionMode);
              if (selectionMode) {
                setSelectedItems([]);
              }
            }}
          >
            <Ionicons 
              name="checkmark-circle-outline" 
              size={16} 
              color={selectionMode ? '#fff' : '#666'} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersTitle}>Filter Aktif:</Text>
          <View style={styles.filterChips}>
            {selectedJenjang && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  {jenjangOptions.find(j => j.value === selectedJenjang)?.label || 'Jenjang'}
                </Text>
                <TouchableOpacity onPress={() => setSelectedJenjang(null)}>
                  <Ionicons name="close" size={14} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            
            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value) return null;
              
              let displayValue = value;
              if (key === 'jenis_kelas') {
                displayValue = value === 'standard' ? 'Standard' : 'Custom';
              } else if (key === 'status') {
                displayValue = value === 'true' ? 'Aktif' : 'Tidak Aktif';
              } else if (key === 'tingkat') {
                const romans = {
                  1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
                  7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
                };
                displayValue = `Tingkat ${romans[parseInt(value)] || value}`;
              } else if (key === 'urutan_min' || key === 'urutan_max') {
                displayValue = `Urutan ${key.includes('min') ? '≥' : '≤'} ${value}`;
              }
              
              return (
                <View key={key} style={styles.filterChip}>
                  <Text style={styles.filterChipText}>{displayValue}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const newFilters = { ...activeFilters };
                      delete newFilters[key];
                      setActiveFilters(newFilters);
                    }}
                  >
                    <Ionicons name="close" size={14} color="#666" />
                  </TouchableOpacity>
                </View>
              );
            })}
            
            <TouchableOpacity style={styles.clearFiltersButton} onPress={handleFilterReset}>
              <Text style={styles.clearFiltersText}>Hapus Semua</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Bulk Actions Bar */}
      {selectionMode && selectedItems.length > 0 && (
        <View style={styles.bulkActionsBar}>
          <Text style={styles.bulkActionsText}>
            {selectedItems.length} item dipilih
          </Text>
          <View style={styles.bulkActions}>
            <TouchableOpacity
              style={styles.bulkActionButton}
              onPress={() => handleBulkAction('activate')}
            >
              <Ionicons name="eye" size={16} color="#28a745" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.bulkActionButton}
              onPress={() => handleBulkAction('deactivate')}
            >
              <Ionicons name="eye-off" size={16} color="#ffc107" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.bulkActionButton}
              onPress={() => handleBulkAction('delete')}
            >
              <Ionicons name="trash" size={16} color="#dc3545" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
  
  const renderItem = ({ item, index }) => (
    <KelasCard
      kelas={item}
      onPress={() => handleItemPress(item)}
      onEdit={() => handleEditPress(item)}
      onDelete={() => handleDeletePress(item)}
      onStats={() => handleStatsPress(item)}
      showStatistics={viewMode === 'card'}
      compact={viewMode === 'compact'}
      selectable={selectionMode}
      selected={selectedItems.includes(item.id_kelas)}
      onSelect={() => handleItemSelect(item.id_kelas)}
      style={viewMode === 'compact' && styles.compactItem}
    />
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="library-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {hasActiveFilters ? 'Tidak ada hasil' : 'Belum ada kelas'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {hasActiveFilters 
          ? 'Coba ubah filter atau kata kunci pencarian'
          : 'Mulai dengan menambahkan kelas pertama'
        }
      </Text>
      
      {!hasActiveFilters && (
        <TouchableOpacity style={styles.emptyButton} onPress={handleCreatePress}>
          <Text style={styles.emptyButtonText}>Tambah Kelas</Text>
        </TouchableOpacity>
      )}
      
      {hasActiveFilters && (
        <TouchableOpacity style={styles.emptyButton} onPress={handleFilterReset}>
          <Text style={styles.emptyButtonText}>Hapus Filter</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  const renderMainContent = () => {
    if (loading && kelasData.length === 0) {
      return (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Memuat data kelas...</Text>
        </View>
      );
    }
    
    return (
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_kelas.toString()}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filteredData.length === 0 ? styles.emptyContainer : undefined}
        
        // Performance optimization
        removeClippedSubviews={true}
        initialNumToRender={10}
        windowSize={10}
        maxToRenderPerBatch={5}
      />
    );
  };
  
  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderMainContent()}
      
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreatePress}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
      
      {/* Filter Modal */}
      <KelasFilter
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
        initialFilters={activeFilters}
      />
    </View>
  );
};

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  emptyContainer: { flexGrow: 1 },
  compactItem: { marginVertical: 2 },
  
  // Header
  header: { backgroundColor: '#fff', paddingVertical: 16, marginBottom: 8 },
  titleSection: { paddingHorizontal: 16, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  
  searchBar: { marginHorizontal: 16, marginBottom: 12 },
  
  // Jenjang filter
  jenjangFilter: { paddingHorizontal: 16, marginBottom: 12 },
  jenjangDropdown: { borderRadius: 8 },
  
  // Controls
  controls: {
    flexDirection: 'row', alignItems: 'center', 
    paddingHorizontal: 16, gap: 8
  },
  controlButton: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 8, backgroundColor: '#f8f9fa',
    borderWidth: 1, borderColor: '#e9ecef'
  },
  controlButtonActive: {
    backgroundColor: '#007bff', borderColor: '#007bff'
  },
  controlButtonText: {
    fontSize: 12, color: '#666', marginLeft: 4, fontWeight: '500'
  },
  controlButtonTextActive: { color: '#fff' },
  
  // Active filters
  activeFilters: {
    paddingHorizontal: 16, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: '#f0f0f0'
  },
  activeFiltersTitle: {
    fontSize: 12, color: '#666', marginBottom: 8, fontWeight: '600'
  },
  filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4,
    backgroundColor: '#e7f3ff', borderRadius: 12, gap: 4
  },
  filterChipText: { fontSize: 11, color: '#007bff', fontWeight: '500' },
  clearFiltersButton: {
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 12, backgroundColor: '#f8d7da'
  },
  clearFiltersText: { fontSize: 11, color: '#721c24', fontWeight: '500' },
  
  // Bulk actions
  bulkActionsBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#e7f3ff', borderRadius: 8, marginHorizontal: 16, marginTop: 12
  },
  bulkActionsText: { fontSize: 14, color: '#007bff', fontWeight: '600' },
  bulkActions: { flexDirection: 'row', gap: 12 },
  bulkActionButton: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'
  },
  
  // States
  loadingState: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32
  },
  loadingText: {
    fontSize: 14, color: '#666', marginTop: 12, textAlign: 'center'
  },
  
  emptyState: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32
  },
  emptyTitle: {
    fontSize: 18, fontWeight: '600', color: '#333', marginTop: 16, textAlign: 'center'
  },
  emptySubtitle: {
    fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center', lineHeight: 20
  },
  emptyButton: {
    marginTop: 24, paddingHorizontal: 24, paddingVertical: 12,
    backgroundColor: '#007bff', borderRadius: 8
  },
  emptyButtonText: {
    fontSize: 14, color: '#fff', fontWeight: '600'
  },
  
  // FAB
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#007bff', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8
  }
});

export default KelasListScreen;