// src/features/adminCabang/screens/jenjang/JenjangListScreen.js
import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, RefreshControl, FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useStoreSelectors } from '../../../stores';
import JenjangCard from '../../../components/specific/jenjang/JenjangCard';
import JenjangFilter from '../../../components/specific/jenjang/JenjangFilter';
import SearchBar from '../../../components/shared/SearchBar';
import { ENTITIES } from '../../../stores/masterDataStore';

/**
 * JenjangListScreen - Complete screen untuk manage jenjang data
 * Combines list, filter, search, dan CRUD operations
 */
const JenjangListScreen = ({ navigation }) => {
  // ==================== ZUSTAND STORES ====================
  const masterDataActions = useStoreSelectors.masterData.actions();
  const uiActions = useStoreSelectors.ui.actions();
  
  const jenjangData = useStoreSelectors.masterData.entitiesWithRelations(ENTITIES.JENJANG);
  const loading = useStoreSelectors.ui.loading(ENTITIES.JENJANG);
  const refreshing = useStoreSelectors.ui.loading(ENTITIES.JENJANG, 'refreshing');
  const error = useStoreSelectors.ui.error(ENTITIES.JENJANG);
  const pagination = useStoreSelectors.ui.pagination(ENTITIES.JENJANG);
  
  // ==================== LOCAL STATE ====================
  const [searchText, setSearchText] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('urutan');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'compact'
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  
  // ==================== COMPUTED VALUES ====================
  
  // Apply filters and search to jenjang data
  const filteredData = useMemo(() => {
    let filtered = [...jenjangData];
    
    // Apply search
    if (searchText.trim()) {
      const searchTerm = searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.nama_jenjang?.toLowerCase().includes(searchTerm) ||
        item.kode_jenjang?.toLowerCase().includes(searchTerm) ||
        item.deskripsi?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (!value) return;
      
      switch (key) {
        case 'status':
          filtered = filtered.filter(item => {
            const itemStatus = item.status || (item.is_active === false ? 'tidak_aktif' : 'aktif');
            return itemStatus === value;
          });
          break;
          
        case 'kode_jenjang':
          filtered = filtered.filter(item => item.kode_jenjang === value);
          break;
          
        case 'urutan_min':
          filtered = filtered.filter(item => (item.urutan || 0) >= parseInt(value));
          break;
          
        case 'urutan_max':
          filtered = filtered.filter(item => (item.urutan || 0) <= parseInt(value));
          break;
          
        case 'has_mata_pelajaran':
          filtered = filtered.filter(item => 
            value ? (item.mata_pelajaran_count || 0) > 0 : (item.mata_pelajaran_count || 0) === 0
          );
          break;
          
        case 'has_kelas':
          filtered = filtered.filter(item => 
            value ? (item.kelas_count || 0) > 0 : (item.kelas_count || 0) === 0
          );
          break;
      }
    });
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle special sorting cases
      if (sortBy === 'urutan') {
        aValue = a.urutan || 0;
        bValue = b.urutan || 0;
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
  }, [jenjangData, searchText, activeFilters, sortBy, sortOrder]);
  
  const hasActiveFilters = Object.values(activeFilters).some(value => 
    value !== '' && value !== null && value !== undefined
  );
  
  const statistics = useMemo(() => ({
    total: jenjangData.length,
    active: jenjangData.filter(item => item.is_active !== false).length,
    inactive: jenjangData.filter(item => item.is_active === false).length,
    withMataPelajaran: jenjangData.filter(item => (item.mata_pelajaran_count || 0) > 0).length,
    withKelas: jenjangData.filter(item => (item.kelas_count || 0) > 0).length
  }), [jenjangData]);
  
  // ==================== EFFECTS ====================
  
  // Load data when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );
  
  // ==================== HANDLERS ====================
  
  const loadData = useCallback(async () => {
    try {
      await masterDataActions.load(ENTITIES.JENJANG);
    } catch (err) {
      uiActions.setError(ENTITIES.JENJANG, err.message);
    }
  }, [masterDataActions, uiActions]);
  
  const handleRefresh = useCallback(async () => {
    try {
      uiActions.setLoading(ENTITIES.JENJANG, 'refreshing', true);
      await masterDataActions.refresh(ENTITIES.JENJANG);
    } catch (err) {
      uiActions.setError(ENTITIES.JENJANG, err.message);
    } finally {
      uiActions.setLoading(ENTITIES.JENJANG, 'refreshing', false);
    }
  }, [masterDataActions, uiActions]);
  
  const handleItemPress = useCallback((item) => {
    if (selectionMode) {
      handleItemSelect(item);
    } else {
      navigation.navigate('JenjangDetail', { id: item.id_jenjang, item });
    }
  }, [selectionMode, navigation]);
  
  const handleItemSelect = useCallback((item) => {
    setSelectedItems(prev => {
      const isSelected = prev.find(selected => selected.id_jenjang === item.id_jenjang);
      if (isSelected) {
        return prev.filter(selected => selected.id_jenjang !== item.id_jenjang);
      } else {
        return [...prev, item];
      }
    });
  }, []);
  
  const handleCreatePress = useCallback(() => {
    navigation.navigate('JenjangForm', { mode: 'create' });
  }, [navigation]);
  
  const handleEditPress = useCallback((item) => {
    navigation.navigate('JenjangForm', { 
      mode: 'edit', 
      id: item.id_jenjang, 
      item 
    });
  }, [navigation]);
  
  const handleDeletePress = useCallback((item) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus jenjang "${item.nama_jenjang}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await masterDataActions.delete(ENTITIES.JENJANG, item.id_jenjang);
              uiActions.setSuccess(`Jenjang "${item.nama_jenjang}" berhasil dihapus`, 'delete');
            } catch (err) {
              uiActions.setError(ENTITIES.JENJANG, err.message);
            }
          }
        }
      ]
    );
  }, [masterDataActions, uiActions]);
  
  const handleFilterApply = useCallback((filters) => {
    setActiveFilters(filters);
    setShowFilter(false);
  }, []);
  
  const handleFilterReset = useCallback(() => {
    setActiveFilters({});
    setSearchText('');
  }, []);
  
  const handleSortChange = useCallback((field, order) => {
    setSortBy(field);
    setSortOrder(order);
  }, []);
  
  const handleBulkAction = useCallback((action) => {
    if (selectedItems.length === 0) return;
    
    const itemNames = selectedItems.map(item => item.nama_jenjang).join(', ');
    
    switch (action) {
      case 'delete':
        Alert.alert(
          'Konfirmasi Hapus',
          `Apakah Anda yakin ingin menghapus ${selectedItems.length} jenjang?\n${itemNames}`,
          [
            { text: 'Batal', style: 'cancel' },
            {
              text: 'Hapus',
              style: 'destructive',
              onPress: async () => {
                try {
                  await Promise.all(
                    selectedItems.map(item => 
                      masterDataActions.delete(ENTITIES.JENJANG, item.id_jenjang)
                    )
                  );
                  setSelectedItems([]);
                  setSelectionMode(false);
                  uiActions.setSuccess(`${selectedItems.length} jenjang berhasil dihapus`, 'delete');
                } catch (err) {
                  uiActions.setError(ENTITIES.JENJANG, err.message);
                }
              }
            }
          ]
        );
        break;
        
      case 'activate':
        // Implementation for bulk activate
        break;
        
      case 'deactivate':
        // Implementation for bulk deactivate
        break;
    }
  }, [selectedItems, masterDataActions, uiActions]);
  
  // ==================== RENDER FUNCTIONS ====================
  
  const renderHeader = () => (
    <View style={styles.header}>
      {/* Title and Statistics */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Jenjang Pendidikan</Text>
        <Text style={styles.subtitle}>
          {statistics.total} total • {statistics.active} aktif • {statistics.inactive} tidak aktif
        </Text>
      </View>
      
      {/* Search Bar */}
      <SearchBar
        value={searchText}
        onValueChange={setSearchText}
        placeholder="Cari nama atau kode jenjang..."
        style={styles.searchBar}
      />
      
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
            Filter {hasActiveFilters && `(${Object.values(activeFilters).filter(Boolean).length})`}
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
          <Text style={styles.controlButtonText}>Urutan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setViewMode(viewMode === 'card' ? 'compact' : 'card')}
        >
          <Ionicons 
            name={viewMode === 'card' ? 'list' : 'grid'} 
            size={16} 
            color="#666" 
          />
        </TouchableOpacity>
        
        {jenjangData.length > 0 && (
          <TouchableOpacity
            style={[styles.controlButton, selectionMode && styles.controlButtonActive]}
            onPress={() => {
              setSelectionMode(!selectionMode);
              setSelectedItems([]);
            }}
          >
            <Ionicons 
              name="checkmark-circle" 
              size={16} 
              color={selectionMode ? '#fff' : '#666'} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Selection Mode Actions */}
      {selectionMode && (
        <View style={styles.selectionActions}>
          <Text style={styles.selectionText}>
            {selectedItems.length} dari {filteredData.length} dipilih
          </Text>
          
          {selectedItems.length > 0 && (
            <View style={styles.bulkActions}>
              <TouchableOpacity
                style={styles.bulkActionButton}
                onPress={() => handleBulkAction('delete')}
              >
                <Ionicons name="trash" size={16} color="#dc3545" />
                <Text style={[styles.bulkActionText, { color: '#dc3545' }]}>Hapus</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersLabel}>Filter aktif:</Text>
          <View style={styles.activeFilterTags}>
            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value) return null;
              return (
                <View key={key} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>
                    {key === 'status' && `Status: ${value}`}
                    {key === 'kode_jenjang' && `Kode: ${value}`}
                    {key === 'urutan_min' && `Min: ${value}`}
                    {key === 'urutan_max' && `Max: ${value}`}
                    {key === 'has_mata_pelajaran' && (value ? 'Ada Mapel' : 'Tanpa Mapel')}
                    {key === 'has_kelas' && (value ? 'Ada Kelas' : 'Tanpa Kelas')}
                  </Text>
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
    </View>
  );
  
  const renderItem = ({ item, index }) => (
    <JenjangCard
      jenjang={item}
      onPress={() => handleItemPress(item)}
      onEdit={() => handleEditPress(item)}
      onDelete={() => handleDeletePress(item)}
      showStatistics={viewMode === 'card'}
      compact={viewMode === 'compact'}
      selectable={selectionMode}
      selected={selectedItems.some(selected => selected.id_jenjang === item.id_jenjang)}
      onSelect={handleItemSelect}
      style={viewMode === 'compact' && styles.compactItem}
    />
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="school-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {hasActiveFilters || searchText ? 'Tidak ada hasil' : 'Belum ada jenjang'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {hasActiveFilters || searchText 
          ? 'Coba ubah filter atau kata kunci pencarian'
          : 'Mulai dengan menambahkan jenjang pendidikan pertama'
        }
      </Text>
      
      {!hasActiveFilters && !searchText && (
        <TouchableOpacity style={styles.emptyButton} onPress={handleCreatePress}>
          <Text style={styles.emptyButtonText}>Tambah Jenjang</Text>
        </TouchableOpacity>
      )}
      
      {(hasActiveFilters || searchText) && (
        <TouchableOpacity style={styles.emptyButton} onPress={handleFilterReset}>
          <Text style={styles.emptyButtonText}>Hapus Filter</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  // ==================== RENDER ====================
  
  return (
    <View style={styles.container}>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_jenjang.toString()}
        ListHeaderComponent={renderHeader}
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
      
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreatePress}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
      
      {/* Filter Modal */}
      <JenjangFilter
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
  
  // Header
  header: { backgroundColor: '#fff', paddingVertical: 16, marginBottom: 8 },
  titleSection: { paddingHorizontal: 16, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  
  searchBar: { marginHorizontal: 16, marginBottom: 16 },
  
  // Controls
  controls: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    marginBottom: 12, gap: 8
  },
  controlButton: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#dee2e6'
  },
  controlButtonActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  controlButtonText: { marginLeft: 4, fontSize: 12, color: '#666' },
  controlButtonTextActive: { color: '#fff' },
  
  // Selection
  selectionActions: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#e3f2fd',
    borderTopWidth: 1, borderTopColor: '#dee2e6'
  },
  selectionText: { fontSize: 14, color: '#1976d2', fontWeight: '500' },
  bulkActions: { flexDirection: 'row', gap: 16 },
  bulkActionButton: { flexDirection: 'row', alignItems: 'center' },
  bulkActionText: { marginLeft: 4, fontSize: 12, fontWeight: '500' },
  
  // Active filters
  activeFilters: { paddingHorizontal: 16, paddingVertical: 8 },
  activeFiltersLabel: { fontSize: 12, color: '#666', marginBottom: 8 },
  activeFilterTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterTag: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4,
    backgroundColor: '#e3f2fd', borderRadius: 12, gap: 4
  },
  filterTagText: { fontSize: 12, color: '#1976d2' },
  clearFiltersButton: { paddingHorizontal: 8, paddingVertical: 4 },
  clearFiltersText: { fontSize: 12, color: '#dc3545', fontWeight: '500' },
  
  // List items
  compactItem: { marginVertical: 1 },
  
  // Empty state
  emptyState: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32
  },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#666', marginTop: 16 },
  emptySubtitle: {
    fontSize: 14, color: '#999', textAlign: 'center', marginTop: 8,
    lineHeight: 20, maxWidth: 280
  },
  emptyButton: {
    backgroundColor: '#007bff', paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 8, marginTop: 24
  },
  emptyButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  
  // FAB
  fab: {
    position: 'absolute', bottom: 24, right: 24, width: 56, height: 56,
    backgroundColor: '#007bff', borderRadius: 28, justifyContent: 'center',
    alignItems: 'center', elevation: 8, shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8
  }
});

export default JenjangListScreen;