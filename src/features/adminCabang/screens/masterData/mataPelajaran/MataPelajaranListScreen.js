// src/features/adminCabang/screens/mataPelajaran/MataPelajaranListScreen.js
import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, RefreshControl, 
  FlatList, SectionList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useStoreSelectors } from '../../../stores';
import MataPelajaranCard from '../../specific/mataPelajaran/MataPelajaranCard';
import MataPelajaranFilter from '../../specific/mataPelajaran/MataPelajaranFilter';
import SearchBar from '../../shared/SearchBar';
import CascadeDropdown from '../../shared/CascadeDropdown';
import { ENTITIES } from '../../../stores/masterDataStore';

/**
 * MataPelajaranListScreen - Complete screen untuk manage mata pelajaran data
 * Dengan kategori grouping, jenjang filtering, dan CRUD operations
 */
const MataPelajaranListScreen = ({ navigation }) => {
  // ==================== ZUSTAND STORES ====================
  const masterDataActions = useStoreSelectors.masterData.actions();
  const uiActions = useStoreSelectors.ui.actions();
  const cascadeActions = useStoreSelectors.cascade.actions();
  
  const mataPelajaranData = useStoreSelectors.masterData.entitiesWithRelations(ENTITIES.MATA_PELAJARAN);
  const loading = useStoreSelectors.ui.loading(ENTITIES.MATA_PELAJARAN);
  const refreshing = useStoreSelectors.ui.loading(ENTITIES.MATA_PELAJARAN, 'refreshing');
  const error = useStoreSelectors.ui.error(ENTITIES.MATA_PELAJARAN);
  const jenjangOptions = useStoreSelectors.cascade.jenjangOptions();
  
  // ==================== LOCAL STATE ====================
  const [searchText, setSearchText] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('nama_mata_pelajaran');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' | 'list' | 'compact'
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedJenjang, setSelectedJenjang] = useState(null);
  
  // ==================== COMPUTED VALUES ====================
  
  // Apply filters and search to mata pelajaran data
  const filteredData = useMemo(() => {
    let filtered = [...mataPelajaranData];
    
    // Apply search
    if (searchText.trim()) {
      const searchTerm = searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.nama_mata_pelajaran?.toLowerCase().includes(searchTerm) ||
        item.kode_mata_pelajaran?.toLowerCase().includes(searchTerm) ||
        item.kategori?.toLowerCase().includes(searchTerm) ||
        item.deskripsi?.toLowerCase().includes(searchTerm) ||
        item.jenjang?.nama_jenjang?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply jenjang filter
    if (selectedJenjang) {
      filtered = filtered.filter(item => 
        !item.id_jenjang || item.id_jenjang.toString() === selectedJenjang.toString()
      );
    }
    
    // Apply other filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (!value) return;
      
      switch (key) {
        case 'status':
          filtered = filtered.filter(item => {
            const itemStatus = item.status || (item.is_active === false ? 'tidak_aktif' : 'aktif');
            return itemStatus === value;
          });
          break;
          
        case 'kategori':
          if (Array.isArray(value)) {
            filtered = filtered.filter(item => value.includes(item.kategori));
          } else {
            filtered = filtered.filter(item => item.kategori === value);
          }
          break;
          
        case 'id_jenjang':
          if (value === 'null') {
            filtered = filtered.filter(item => !item.id_jenjang);
          } else {
            filtered = filtered.filter(item => item.id_jenjang?.toString() === value.toString());
          }
          break;
          
        case 'kode_mata_pelajaran':
          filtered = filtered.filter(item => item.kode_mata_pelajaran === value);
          break;
          
        case 'has_materi':
          filtered = filtered.filter(item => 
            value ? (item.materi_count || 0) > 0 : (item.materi_count || 0) === 0
          );
          break;
      }
    });
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase() || '';
      }
      
      let result = 0;
      if (aValue < bValue) result = -1;
      else if (aValue > bValue) result = 1;
      
      return sortOrder === 'desc' ? -result : result;
    });
    
    return filtered;
  }, [mataPelajaranData, searchText, selectedJenjang, activeFilters, sortBy, sortOrder]);
  
  // Group data by kategori for grouped view
  const groupedData = useMemo(() => {
    if (viewMode !== 'grouped') return [];
    
    const groups = filteredData.reduce((acc, item) => {
      const kategori = item.kategori || 'unknown';
      if (!acc[kategori]) {
        acc[kategori] = [];
      }
      acc[kategori].push(item);
      return acc;
    }, {});
    
    const kategoriOrder = ['wajib', 'muatan_lokal', 'pengembangan_diri', 'pilihan', 'ekstrakurikuler', 'unknown'];
    const kategoriLabels = {
      'wajib': 'Mata Pelajaran Wajib',
      'muatan_lokal': 'Muatan Lokal',
      'pengembangan_diri': 'Pengembangan Diri',
      'pilihan': 'Mata Pelajaran Pilihan',
      'ekstrakurikuler': 'Ekstrakurikuler',
      'unknown': 'Lainnya'
    };
    
    return kategoriOrder
      .filter(kategori => groups[kategori]?.length > 0)
      .map(kategori => ({
        title: kategoriLabels[kategori],
        key: kategori,
        data: groups[kategori],
        count: groups[kategori].length
      }));
  }, [filteredData, viewMode]);
  
  const hasActiveFilters = Object.values(activeFilters).some(value => 
    value !== '' && value !== null && value !== undefined
  ) || selectedJenjang;
  
  const statistics = useMemo(() => ({
    total: mataPelajaranData.length,
    active: mataPelajaranData.filter(item => item.is_active !== false).length,
    inactive: mataPelajaranData.filter(item => item.is_active === false).length,
    byKategori: {
      wajib: mataPelajaranData.filter(item => item.kategori === 'wajib').length,
      muatan_lokal: mataPelajaranData.filter(item => item.kategori === 'muatan_lokal').length,
      pengembangan_diri: mataPelajaranData.filter(item => item.kategori === 'pengembangan_diri').length,
      pilihan: mataPelajaranData.filter(item => item.kategori === 'pilihan').length,
      ekstrakurikuler: mataPelajaranData.filter(item => item.kategori === 'ekstrakurikuler').length
    },
    withMateri: mataPelajaranData.filter(item => (item.materi_count || 0) > 0).length,
    semua_jenjang: mataPelajaranData.filter(item => !item.id_jenjang).length
  }), [mataPelajaranData]);
  
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
      await masterDataActions.load(ENTITIES.MATA_PELAJARAN);
      await masterDataActions.load(ENTITIES.JENJANG); // Load jenjang for cascade
    } catch (err) {
      uiActions.setError(ENTITIES.MATA_PELAJARAN, err.message);
    }
  }, [masterDataActions, uiActions]);
  
  const handleRefresh = useCallback(async () => {
    try {
      uiActions.setLoading(ENTITIES.MATA_PELAJARAN, 'refreshing', true);
      await masterDataActions.refresh(ENTITIES.MATA_PELAJARAN);
      await masterDataActions.refresh(ENTITIES.JENJANG);
    } catch (err) {
      uiActions.setError(ENTITIES.MATA_PELAJARAN, err.message);
    } finally {
      uiActions.setLoading(ENTITIES.MATA_PELAJARAN, 'refreshing', false);
    }
  }, [masterDataActions, uiActions]);
  
  const handleItemPress = useCallback((item) => {
    if (selectionMode) {
      handleItemSelect(item);
    } else {
      navigation.navigate('MataPelajaranDetail', { id: item.id_mata_pelajaran, item });
    }
  }, [selectionMode, navigation]);
  
  const handleItemSelect = useCallback((item) => {
    setSelectedItems(prev => {
      const isSelected = prev.find(selected => selected.id_mata_pelajaran === item.id_mata_pelajaran);
      if (isSelected) {
        return prev.filter(selected => selected.id_mata_pelajaran !== item.id_mata_pelajaran);
      } else {
        return [...prev, item];
      }
    });
  }, []);
  
  const handleCreatePress = useCallback(() => {
    navigation.navigate('MataPelajaranForm', { mode: 'create' });
  }, [navigation]);
  
  const handleEditPress = useCallback((item) => {
    navigation.navigate('MataPelajaranForm', { 
      mode: 'edit', 
      id: item.id_mata_pelajaran, 
      item 
    });
  }, [navigation]);
  
  const handleDeletePress = useCallback((item) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus mata pelajaran "${item.nama_mata_pelajaran}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await masterDataActions.delete(ENTITIES.MATA_PELAJARAN, item.id_mata_pelajaran);
              uiActions.setSuccess(`Mata pelajaran "${item.nama_mata_pelajaran}" berhasil dihapus`, 'delete');
            } catch (err) {
              uiActions.setError(ENTITIES.MATA_PELAJARAN, err.message);
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
    setSelectedJenjang(null);
    cascadeActions.clearFilters();
  }, [cascadeActions]);
  
  const handleSortChange = useCallback((field, order) => {
    setSortBy(field);
    setSortOrder(order);
  }, []);
  
  const handleBulkAction = useCallback((action) => {
    if (selectedItems.length === 0) return;
    
    const itemNames = selectedItems.map(item => item.nama_mata_pelajaran).join(', ');
    
    switch (action) {
      case 'delete':
        Alert.alert(
          'Konfirmasi Hapus',
          `Apakah Anda yakin ingin menghapus ${selectedItems.length} mata pelajaran?\n${itemNames}`,
          [
            { text: 'Batal', style: 'cancel' },
            {
              text: 'Hapus',
              style: 'destructive',
              onPress: async () => {
                try {
                  await Promise.all(
                    selectedItems.map(item => 
                      masterDataActions.delete(ENTITIES.MATA_PELAJARAN, item.id_mata_pelajaran)
                    )
                  );
                  setSelectedItems([]);
                  setSelectionMode(false);
                  uiActions.setSuccess(`${selectedItems.length} mata pelajaran berhasil dihapus`, 'delete');
                } catch (err) {
                  uiActions.setError(ENTITIES.MATA_PELAJARAN, err.message);
                }
              }
            }
          ]
        );
        break;
    }
  }, [selectedItems, masterDataActions, uiActions]);
  
  // ==================== RENDER FUNCTIONS ====================
  
  const renderHeader = () => (
    <View style={styles.header}>
      {/* Title and Statistics */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Mata Pelajaran</Text>
        <Text style={styles.subtitle}>
          {statistics.total} total • {statistics.active} aktif • {statistics.byKategori.wajib} wajib
        </Text>
      </View>
      
      {/* Search Bar */}
      <SearchBar
        value={searchText}
        onValueChange={setSearchText}
        placeholder="Cari mata pelajaran..."
        style={styles.searchBar}
      />
      
      {/* Jenjang Filter */}
      <View style={styles.jenjangFilter}>
        <CascadeDropdown
          entityType={ENTITIES.JENJANG}
          value={selectedJenjang}
          onValueChange={setSelectedJenjang}
          placeholder="Semua Jenjang"
          style={styles.jenjangDropdown}
          allowClear
        />
      </View>
      
      {/* Controls */}
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
          <Text style={styles.controlButtonText}>Sort</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, viewMode === 'grouped' && styles.controlButtonActive]}
          onPress={() => setViewMode(viewMode === 'grouped' ? 'list' : 'grouped')}
        >
          <Ionicons 
            name={viewMode === 'grouped' ? 'apps' : 'list'} 
            size={16} 
            color={viewMode === 'grouped' ? '#fff' : '#666'} 
          />
          <Text style={[
            styles.controlButtonText,
            viewMode === 'grouped' && styles.controlButtonTextActive
          ]}>
            {viewMode === 'grouped' ? 'Grup' : 'List'}
          </Text>
        </TouchableOpacity>
        
        {mataPelajaranData.length > 0 && (
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
      
      {/* Kategori Statistics */}
      <View style={styles.kategoriStats}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.kategoriStatsRow}>
            {Object.entries(statistics.byKategori).map(([kategori, count]) => {
              const labels = {
                wajib: 'Wajib',
                muatan_lokal: 'Muatan Lokal',
                pengembangan_diri: 'Pengembangan Diri',
                pilihan: 'Pilihan',
                ekstrakurikuler: 'Ekskul'
              };
              
              if (count === 0) return null;
              
              return (
                <TouchableOpacity
                  key={kategori}
                  style={[
                    styles.kategoriStatItem,
                    activeFilters.kategori === kategori && styles.kategoriStatItemActive
                  ]}
                  onPress={() => {
                    const newFilters = { ...activeFilters };
                    if (newFilters.kategori === kategori) {
                      delete newFilters.kategori;
                    } else {
                      newFilters.kategori = kategori;
                    }
                    setActiveFilters(newFilters);
                  }}
                >
                  <Text style={[
                    styles.kategoriStatCount,
                    activeFilters.kategori === kategori && styles.kategoriStatCountActive
                  ]}>
                    {count}
                  </Text>
                  <Text style={[
                    styles.kategoriStatLabel,
                    activeFilters.kategori === kategori && styles.kategoriStatLabelActive
                  ]}>
                    {labels[kategori]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
  
  const renderItem = ({ item, index }) => (
    <MataPelajaranCard
      mataPelajaran={item}
      onPress={() => handleItemPress(item)}
      onEdit={() => handleEditPress(item)}
      onDelete={() => handleDeletePress(item)}
      showStatistics={viewMode !== 'compact'}
      compact={viewMode === 'compact'}
      selectable={selectionMode}
      selected={selectedItems.some(selected => selected.id_mata_pelajaran === item.id_mata_pelajaran)}
      onSelect={handleItemSelect}
      style={viewMode === 'compact' && styles.compactItem}
    />
  );
  
  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionBadge}>
        <Text style={styles.sectionCount}>{section.count}</Text>
      </View>
    </View>
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="book-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {hasActiveFilters || searchText ? 'Tidak ada hasil' : 'Belum ada mata pelajaran'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {hasActiveFilters || searchText 
          ? 'Coba ubah filter atau kata kunci pencarian'
          : 'Mulai dengan menambahkan mata pelajaran pertama'
        }
      </Text>
      
      {!hasActiveFilters && !searchText && (
        <TouchableOpacity style={styles.emptyButton} onPress={handleCreatePress}>
          <Text style={styles.emptyButtonText}>Tambah Mata Pelajaran</Text>
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
  
  const renderMainContent = () => {
    if (viewMode === 'grouped' && groupedData.length > 0) {
      return (
        <SectionList
          sections={groupedData}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id_mata_pelajaran.toString()}
          stickySectionHeadersEnabled={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={groupedData.length === 0 ? styles.emptyContainer : undefined}
        />
      );
    }
    
    return (
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_mata_pelajaran.toString()}
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
      <MataPelajaranFilter
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
  
  searchBar: { marginHorizontal: 16, marginBottom: 12 },
  
  // Jenjang filter
  jenjangFilter: { paddingHorizontal: 16, marginBottom: 12 },
  jenjangDropdown: { borderRadius: 8 },
  
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
  
  // Kategori stats
  kategoriStats: { paddingVertical: 8 },
  kategoriStatsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  kategoriStatItem: {
    alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 12, backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#dee2e6'
  },
  kategoriStatItemActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  kategoriStatCount: { fontSize: 16, fontWeight: '700', color: '#333' },
  kategoriStatCountActive: { color: '#fff' },
  kategoriStatLabel: { fontSize: 10, color: '#666', marginTop: 2 },
  kategoriStatLabelActive: { color: '#fff' },
  
  // Section headers
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f8f9fa',
    borderBottomWidth: 1, borderBottomColor: '#dee2e6'
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  sectionBadge: {
    backgroundColor: '#007bff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12
  },
  sectionCount: { fontSize: 12, color: '#fff', fontWeight: '600' },
  
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

export default MataPelajaranListScreen;