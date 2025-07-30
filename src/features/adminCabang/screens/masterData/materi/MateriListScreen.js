// src/features/adminCabang/screens/materi/MateriListScreen.js
import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, RefreshControl, 
  FlatList, SectionList, SafeAreaView, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useStoreSelectors } from '../../../stores';
import MateriCard from '../../specific/materi/MateriCard';
import MateriFilter from '../../specific/materi/MateriFilter';
import SearchBar from '../../shared/SearchBar';
import CascadeDropdown from '../../shared/CascadeDropdown';
import DropdownSelector from '../../shared/DropdownSelector';
import { ENTITIES } from '../../../stores/masterDataStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * MateriListScreen - Complete screen untuk manage materi data
 * Dengan triple cascade hierarchy filtering dan CRUD operations
 */
const MateriListScreen = ({ navigation }) => {
  // ==================== ZUSTAND STORES ====================
  const masterDataActions = useStoreSelectors.masterData.actions();
  const uiActions = useStoreSelectors.ui.actions();
  const cascadeActions = useStoreSelectors.cascade.actions();
  
  const materiData = useStoreSelectors.masterData.entitiesWithRelations(ENTITIES.MATERI);
  const loading = useStoreSelectors.ui.loading(ENTITIES.MATERI);
  const refreshing = useStoreSelectors.ui.loading(ENTITIES.MATERI, 'refreshing');
  const error = useStoreSelectors.ui.error(ENTITIES.MATERI);
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
  const [searchText, setSearchText] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('nama_materi');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('hierarchy'); // 'hierarchy' | 'list' | 'compact'
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // ==================== COMPUTED VALUES ====================
  
  // Apply filters, search, and sorting
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...materiData];
    
    // Apply search
    if (searchText.trim()) {
      const searchTerm = searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.nama_materi?.toLowerCase().includes(searchTerm) ||
        item.kode_materi?.toLowerCase().includes(searchTerm) ||
        item.deskripsi?.toLowerCase().includes(searchTerm) ||
        item.mataPelajaran?.nama_mata_pelajaran?.toLowerCase().includes(searchTerm) ||
        item.kelas?.nama_kelas?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply active filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (!value && value !== false) return;
      
      switch (key) {
        case 'id_jenjang':
          filtered = filtered.filter(item => 
            item.mataPelajaran?.id_jenjang?.toString() === value.toString() ||
            item.kelas?.id_jenjang?.toString() === value.toString()
          );
          break;
        case 'id_mata_pelajaran':
          filtered = filtered.filter(item => 
            item.id_mata_pelajaran?.toString() === value.toString()
          );
          break;
        case 'id_kelas':
          filtered = filtered.filter(item => 
            item.id_kelas?.toString() === value.toString()
          );
          break;
        case 'status':
          filtered = filtered.filter(item => {
            const itemStatus = item.status || (item.is_active === false ? 'tidak_aktif' : 'aktif');
            return itemStatus === value;
          });
          break;
        case 'has_files':
          filtered = filtered.filter(item => {
            const hasFiles = (item.files_count || 0) > 0;
            return hasFiles === value;
          });
          break;
        case 'kategori_mata_pelajaran':
          filtered = filtered.filter(item => 
            item.mataPelajaran?.kategori === value
          );
          break;
        case 'jenis_kelas':
          filtered = filtered.filter(item => 
            item.kelas?.jenis_kelas === value
          );
          break;
        case 'usage_min':
          filtered = filtered.filter(item => 
            (item.usage_count || 0) >= parseInt(value)
          );
          break;
        case 'usage_max':
          filtered = filtered.filter(item => 
            (item.usage_count || 0) <= parseInt(value)
          );
          break;
        case 'only_with_kurikulum':
          if (value) {
            filtered = filtered.filter(item => (item.kurikulum_count || 0) > 0);
          }
          break;
        case 'show_inactive':
          if (!value) {
            filtered = filtered.filter(item => item.is_active !== false);
          }
          break;
      }
    });
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'nama_materi':
          aValue = a.nama_materi?.toLowerCase() || '';
          bValue = b.nama_materi?.toLowerCase() || '';
          break;
        case 'mata_pelajaran':
          aValue = a.mataPelajaran?.nama_mata_pelajaran?.toLowerCase() || '';
          bValue = b.mataPelajaran?.nama_mata_pelajaran?.toLowerCase() || '';
          break;
        case 'kelas':
          aValue = a.kelas?.nama_kelas?.toLowerCase() || '';
          bValue = b.kelas?.nama_kelas?.toLowerCase() || '';
          break;
        case 'usage_count':
          aValue = a.usage_count || 0;
          bValue = b.usage_count || 0;
          break;
        case 'created_at':
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        default:
          aValue = a[sortBy] || '';
          bValue = b[sortBy] || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [materiData, searchText, activeFilters, sortBy, sortOrder]);
  
  // Group data by hierarchy for hierarchy view
  const groupedData = useMemo(() => {
    if (viewMode !== 'hierarchy') return null;
    
    const groups = {};
    
    filteredAndSortedData.forEach(item => {
      const jenjangNama = item.mataPelajaran?.jenjang?.nama_jenjang || 
                         item.kelas?.jenjang?.nama_jenjang || 'Tanpa Jenjang';
      const mataPelajaranNama = item.mataPelajaran?.nama_mata_pelajaran || 'Tanpa Mata Pelajaran';
      const kelasNama = item.kelas?.nama_kelas || 'Tanpa Kelas';
      
      const groupKey = `${jenjangNama} › ${mataPelajaranNama} › ${kelasNama}`;
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          title: groupKey,
          data: []
        };
      }
      
      groups[groupKey].data.push(item);
    });
    
    return Object.values(groups).sort((a, b) => a.title.localeCompare(b.title));
  }, [filteredAndSortedData, viewMode]);
  
  // Statistics
  const statistics = useMemo(() => ({
    total: materiData.length,
    aktif: materiData.filter(item => item.is_active !== false).length,
    tidak_aktif: materiData.filter(item => item.is_active === false).length,
    dengan_file: materiData.filter(item => (item.files_count || 0) > 0).length,
    tanpa_file: materiData.filter(item => (item.files_count || 0) === 0).length,
    belum_digunakan: materiData.filter(item => (item.usage_count || 0) === 0).length,
    populer: materiData.filter(item => (item.usage_count || 0) >= 5).length,
    di_kurikulum: materiData.filter(item => (item.kurikulum_count || 0) > 0).length
  }), [materiData]);
  
  const activeFiltersCount = Object.keys(activeFilters).length;
  
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
      await Promise.all([
        masterDataActions.load(ENTITIES.MATERI),
        masterDataActions.load(ENTITIES.MATA_PELAJARAN),
        masterDataActions.load(ENTITIES.KELAS),
        masterDataActions.load(ENTITIES.JENJANG)
      ]);
    } catch (err) {
      uiActions.setError(ENTITIES.MATERI, err.message);
    }
  }, [masterDataActions, uiActions]);
  
  const handleRefresh = useCallback(async () => {
    try {
      uiActions.setLoading(ENTITIES.MATERI, 'refreshing', true);
      await Promise.all([
        masterDataActions.refresh(ENTITIES.MATERI),
        masterDataActions.refresh(ENTITIES.MATA_PELAJARAN),
        masterDataActions.refresh(ENTITIES.KELAS),
        masterDataActions.refresh(ENTITIES.JENJANG)
      ]);
    } catch (err) {
      uiActions.setError(ENTITIES.MATERI, err.message);
    } finally {
      uiActions.setLoading(ENTITIES.MATERI, 'refreshing', false);
    }
  }, [masterDataActions, uiActions]);
  
  const handleItemPress = useCallback((item) => {
    if (selectionMode) {
      handleItemSelect(item);
    } else {
      navigation.navigate('MateriDetail', { id: item.id_materi, item });
    }
  }, [selectionMode, navigation]);
  
  const handleItemSelect = useCallback((item) => {
    setSelectedItems(prev => {
      const isSelected = prev.find(selected => selected.id_materi === item.id_materi);
      if (isSelected) {
        return prev.filter(selected => selected.id_materi !== item.id_materi);
      } else {
        return [...prev, item];
      }
    });
  }, []);
  
  const handleCreatePress = useCallback(() => {
    navigation.navigate('MateriForm', { mode: 'create' });
  }, [navigation]);
  
  const handleEditPress = useCallback((item) => {
    navigation.navigate('MateriForm', { 
      mode: 'edit', 
      id: item.id_materi, 
      item 
    });
  }, [navigation]);
  
  const handleDeletePress = useCallback((item) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus materi "${item.nama_materi}"?\n\n` +
      `Mata Pelajaran: ${item.mataPelajaran?.nama_mata_pelajaran || 'Unknown'}\n` +
      `Kelas: ${item.kelas?.nama_kelas || 'Unknown'}\n\n` +
      `Perhatian: Ini akan mempengaruhi kurikulum yang menggunakan materi ini.`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: () => performDelete(item)
        }
      ]
    );
  }, []);
  
  const performDelete = useCallback(async (item) => {
    try {
      await masterDataActions.delete(ENTITIES.MATERI, item.id_materi);
      uiActions.setSuccess(`Materi "${item.nama_materi}" berhasil dihapus`, 'delete');
    } catch (err) {
      uiActions.setError(ENTITIES.MATERI, err.message || 'Gagal menghapus materi');
    }
  }, [masterDataActions, uiActions]);
  
  const handleViewFiles = useCallback((item) => {
    navigation.navigate('MateriFiles', { id: item.id_materi, item });
  }, [navigation]);
  
  const handleSearch = useCallback((text) => {
    setSearchText(text);
  }, []);
  
  const handleFilterApply = useCallback((filters) => {
    setActiveFilters(filters);
    setShowFilter(false);
  }, []);
  
  const handleFilterReset = useCallback(() => {
    setActiveFilters({});
    setSearchText('');
    cascadeActions.reset();
  }, [cascadeActions]);
  
  const handleJenjangChange = useCallback((jenjangId) => {
    cascadeActions.setSelected('jenjang', jenjangId);
    setActiveFilters(prev => ({ 
      ...prev, 
      id_jenjang: jenjangId,
      id_mata_pelajaran: '',
      id_kelas: ''
    }));
  }, [cascadeActions]);
  
  const handleMataPelajaranChange = useCallback((mataPelajaranId) => {
    cascadeActions.setSelected('mataPelajaran', mataPelajaranId);
    setActiveFilters(prev => ({ 
      ...prev, 
      id_mata_pelajaran: mataPelajaranId,
      id_kelas: ''
    }));
  }, [cascadeActions]);
  
  const handleKelasChange = useCallback((kelasId) => {
    cascadeActions.setSelected('kelas', kelasId);
    setActiveFilters(prev => ({ ...prev, id_kelas: kelasId }));
  }, [cascadeActions]);
  
  const handleBulkDelete = useCallback(() => {
    if (selectedItems.length === 0) return;
    
    Alert.alert(
      'Hapus Massal',
      `Apakah Anda yakin ingin menghapus ${selectedItems.length} materi yang dipilih?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: async () => {
            try {
              const ids = selectedItems.map(item => item.id_materi);
              await masterDataActions.bulkDelete(ENTITIES.MATERI, ids);
              setSelectedItems([]);
              setSelectionMode(false);
              uiActions.setSuccess(`${selectedItems.length} materi berhasil dihapus`, 'delete');
            } catch (err) {
              uiActions.setError(ENTITIES.MATERI, err.message || 'Gagal menghapus materi');
            }
          }
        }
      ]
    );
  }, [selectedItems, masterDataActions, uiActions]);
  
  const toggleSelectionMode = useCallback(() => {
    setSelectionMode(!selectionMode);
    setSelectedItems([]);
  }, [selectionMode]);
  
  // ==================== RENDER HELPERS ====================
  
  const renderMateriCard = useCallback(({ item }) => (
    <MateriCard
      materi={item}
      onPress={handleItemPress}
      onEdit={handleEditPress}
      onDelete={handleDeletePress}
      onViewFiles={handleViewFiles}
      selectable={selectionMode}
      selected={selectedItems.find(selected => selected.id_materi === item.id_materi)}
      onSelect={handleItemSelect}
      compact={viewMode === 'compact'}
      showHierarchy={viewMode !== 'hierarchy'}
    />
  ), [
    handleItemPress, handleEditPress, handleDeletePress, handleViewFiles,
    selectionMode, selectedItems, handleItemSelect, viewMode
  ]);
  
  const renderSectionHeader = useCallback(({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length} materi</Text>
    </View>
  ), []);
  
  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Ionicons name="document-outline" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>Belum Ada Materi</Text>
      <Text style={styles.emptySubtitle}>
        {activeFiltersCount > 0 || searchText
          ? 'Tidak ada materi yang sesuai dengan filter atau pencarian'
          : 'Tambahkan materi pertama Anda'
        }
      </Text>
      {!activeFiltersCount && !searchText && (
        <TouchableOpacity style={styles.emptyAction} onPress={handleCreatePress}>
          <Text style={styles.emptyActionText}>Tambah Materi</Text>
        </TouchableOpacity>
      )}
    </View>
  ), [activeFiltersCount, searchText, handleCreatePress]);
  
  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      {/* Search Bar */}
      <SearchBar
        value={searchText}
        onChangeText={handleSearch}
        placeholder="Cari materi..."
        style={styles.searchBar}
      />
      
      {/* Quick Cascade Filters */}
      <View style={styles.cascadeFilters}>
        <View style={styles.cascadeRow}>
          <View style={styles.cascadeItem}>
            <Text style={styles.cascadeLabel}>Jenjang</Text>
            <CascadeDropdown
              value={selectedJenjang}
              options={[{ label: 'Semua', value: '' }, ...jenjangOptions]}
              onValueChange={handleJenjangChange}
              placeholder="Pilih jenjang"
              style={styles.cascadeDropdown}
            />
          </View>
          
          {selectedJenjang && (
            <View style={styles.cascadeItem}>
              <Text style={styles.cascadeLabel}>Mata Pelajaran</Text>
              <DropdownSelector
                value={selectedMataPelajaran}
                options={[{ label: 'Semua', value: '' }, ...mataPelajaranOptions]}
                onValueChange={handleMataPelajaranChange}
                placeholder="Pilih MP"
                style={styles.cascadeDropdown}
              />
            </View>
          )}
          
          {selectedJenjang && (
            <View style={styles.cascadeItem}>
              <Text style={styles.cascadeLabel}>Kelas</Text>
              <DropdownSelector
                value={selectedKelas}
                options={[{ label: 'Semua', value: '' }, ...kelasOptions]}
                onValueChange={handleKelasChange}
                placeholder="Pilih kelas"
                style={styles.cascadeDropdown}
              />
            </View>
          )}
        </View>
      </View>
      
      {/* Stats */}
      {showStats && (
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.aktif}</Text>
              <Text style={styles.statLabel}>Aktif</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.dengan_file}</Text>
              <Text style={styles.statLabel}>Ada File</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.di_kurikulum}</Text>
              <Text style={styles.statLabel}>Di Kurikulum</Text>
            </View>
          </View>
        </View>
      )}
      
      {/* Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.actionLeft}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilter(true)}
          >
            <Ionicons name="funnel-outline" size={20} color="#007bff" />
            <Text style={styles.filterButtonText}>
              Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.statsButton}
            onPress={() => setShowStats(!showStats)}
          >
            <Ionicons 
              name={showStats ? "stats-chart" : "stats-chart-outline"} 
              size={20} 
              color="#28a745" 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionRight}>
          <TouchableOpacity
            style={styles.viewModeButton}
            onPress={() => {
              const modes = ['hierarchy', 'list', 'compact'];
              const currentIndex = modes.indexOf(viewMode);
              const nextMode = modes[(currentIndex + 1) % modes.length];
              setViewMode(nextMode);
            }}
          >
            <Ionicons 
              name={
                viewMode === 'hierarchy' ? "list-outline" :
                viewMode === 'list' ? "grid-outline" : "apps-outline"
              } 
              size={20} 
              color="#6c757d" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={toggleSelectionMode}
          >
            <Ionicons 
              name={selectionMode ? "checkmark-circle" : "checkmark-circle-outline"} 
              size={20} 
              color={selectionMode ? "#007bff" : "#6c757d"} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Selection Bar */}
      {selectionMode && (
        <View style={styles.selectionBar}>
          <Text style={styles.selectionText}>
            {selectedItems.length} materi dipilih
          </Text>
          {selectedItems.length > 0 && (
            <TouchableOpacity style={styles.bulkDeleteButton} onPress={handleBulkDelete}>
              <Ionicons name="trash-outline" size={18} color="#dc3545" />
              <Text style={styles.bulkDeleteText}>Hapus</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  ), [
    searchText, handleSearch, selectedJenjang, jenjangOptions, handleJenjangChange,
    selectedMataPelajaran, mataPelajaranOptions, handleMataPelajaranChange,
    selectedKelas, kelasOptions, handleKelasChange, showStats, statistics,
    activeFiltersCount, viewMode, selectionMode, toggleSelectionMode,
    selectedItems.length, handleBulkDelete
  ]);
  
  // ==================== RENDER ====================
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {renderHeader()}
      
      {/* Content */}
      {viewMode === 'hierarchy' && groupedData ? (
        <SectionList
          sections={groupedData}
          renderItem={renderMateriCard}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id_materi.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={filteredAndSortedData}
          renderItem={renderMateriCard}
          keyExtractor={(item) => item.id_materi.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
          numColumns={viewMode === 'compact' ? 2 : 1}
          columnWrapperStyle={viewMode === 'compact' ? styles.compactRow : null}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreatePress}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
      
      {/* Filter Modal */}
      <MateriFilter
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
        initialFilters={activeFilters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    backgroundColor: '#fff',
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  searchBar: {
    margin: 16,
    marginBottom: 8
  },
  cascadeFilters: {
    paddingHorizontal: 16,
    paddingBottom: 12
  },
  cascadeRow: {
    flexDirection: 'row',
    gap: 12
  },
  cascadeItem: {
    flex: 1
  },
  cascadeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500'
  },
  cascadeDropdown: {
    minHeight: 40
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  actionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e3f2fd'
  },
  filterButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4
  },
  statsButton: {
    padding: 6
  },
  viewModeButton: {
    padding: 6
  },
  selectionButton: {
    padding: 6
  },
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e3f2fd',
    borderTopWidth: 1,
    borderTopColor: '#007bff'
  },
  selectionText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500'
  },
  bulkDeleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#f8d7da'
  },
  bulkDeleteText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    flex: 1
  },
  sectionCount: {
    fontSize: 12,
    color: '#6c757d'
  },
  compactRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 8
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24
  },
  emptyAction: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  emptyActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
});

export default MateriListScreen;