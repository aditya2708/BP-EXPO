import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BaseListScreen from '../../../components/base/BaseListScreen';
import MateriCard from '../../../components/specific/materi/MateriCard';
import ActionButton from '../../../components/shared/ActionButton';
import StatsCard from '../../../components/shared/StatsCard';
import MultiFieldSearch from '../../../components/shared/MultiFieldSearch';
import FilterChip from '../../../components/shared/FilterChip';
import MateriCascadeFilter from '../../../components/specific/materi/MateriCascadeFilter';
import { useMateri } from '../../../hooks/useMateri';
import { useCascadeData } from '../../../hooks/useCascadeData';
import { useFilterPersistence } from '../../../hooks/useFilterPersistence';

const MateriListScreen = () => {
  const navigation = useNavigation();
  const {
    materiData,
    statistics,
    loading,
    refreshing,
    error,
    handleRefresh,
    loadMore,
    clearError,
    deleteMateri,
    searchMateri
  } = useMateri({ includeStatistics: true });

  const cascadeData = useCascadeData({ autoLoad: true });
  
  const { 
    filters, 
    updateFilter, 
    clearFilters, 
    getActiveFiltersCount,
    hasActiveFilters 
  } = useFilterPersistence('materi', {
    search: '',
    id_jenjang: '',
    id_mata_pelajaran: '',
    id_kelas: '',
    kategori: ''
  });

  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const searchFields = [
    { key: 'nama_materi', label: 'Nama Materi', description: 'Cari berdasarkan nama materi' },
    { key: 'mata_pelajaran', label: 'Mata Pelajaran', description: 'Nama mata pelajaran' },
    { key: 'kelas', label: 'Kelas', description: 'Nama kelas' },
    { key: 'jenjang', label: 'Jenjang', description: 'Nama jenjang' }
  ];

  const handleItemPress = (item) => {
    navigation.navigate('MateriDetail', { id: item.id_materi, item });
  };

  const handleEdit = (item) => {
    navigation.navigate('MateriForm', { 
      mode: 'edit', 
      id: item.id_materi, 
      item 
    });
  };

  const handleDelete = (item) => {
    if (item.kurikulum_materi_count > 0) {
      Alert.alert(
        'Tidak Dapat Dihapus',
        `Materi "${item.nama_materi}" sedang digunakan dalam ${item.kurikulum_materi_count} kurikulum dan tidak dapat dihapus.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Hapus Materi',
      `Yakin ingin menghapus materi "${item.nama_materi}"?\n\nMateri dari ${item.mata_pelajaran?.nama_mata_pelajaran} untuk ${item.kelas?.nama_kelas}`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: () => confirmDelete(item)
        }
      ]
    );
  };

  const confirmDelete = async (item) => {
    const result = await deleteMateri(item.id_materi);
    
    if (result.success) {
      Alert.alert('Berhasil', 'Materi berhasil dihapus');
    } else {
      Alert.alert('Error', result.error || 'Gagal menghapus materi');
    }
  };

  const handleAdd = () => {
    navigation.navigate('MateriForm', { mode: 'create' });
  };

  const handleMultiFieldSearch = async (searchData) => {
    updateFilter('search', searchData.query);
    await searchMateri(searchData.query, {
      id_jenjang: filters.id_jenjang || undefined,
      id_mata_pelajaran: filters.id_mata_pelajaran || undefined,
      id_kelas: filters.id_kelas || undefined,
      kategori: filters.kategori || undefined,
      search_fields: searchData.fields
    });
  };

  const handleAdvancedFilter = async (newFilters) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      updateFilter(key, value);
    });
    
    await searchMateri(filters.search, newFilters);
  };

  const getJenjangName = (id) => {
    const jenjang = cascadeData.data.jenjang.find(j => j.id_jenjang.toString() === id);
    return jenjang?.nama_jenjang || '';
  };

  const getMataPelajaranName = (id) => {
    const mataPelajaran = cascadeData.data.mata_pelajaran.find(mp => mp.id_mata_pelajaran.toString() === id);
    return mataPelajaran?.nama_mata_pelajaran || '';
  };

  const getKelasName = (id) => {
    const kelas = cascadeData.data.kelas.find(k => k.id_kelas.toString() === id);
    return kelas?.nama_kelas || '';
  };

  const renderItem = ({ item }) => (
    <MateriCard
      item={item}
      onPress={handleItemPress}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.actionContainer}>
        <ActionButton
          title="Tambah Materi"
          icon="add"
          onPress={handleAdd}
          style={styles.addButton}
        />
        
        <ActionButton
          title="Filter"
          icon="filter-outline"
          variant="outline"
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterButton}
          badge={getActiveFiltersCount() > 0 ? getActiveFiltersCount().toString() : null}
        />
      </View>

      <MultiFieldSearch
        value={filters.search}
        onSearch={handleMultiFieldSearch}
        searchFields={searchFields}
        placeholder="Cari materi di semua field..."
        style={styles.searchBar}
      />

      <View style={styles.filterActions}>
        <ActionButton
          title="Filter Lanjutan"
          icon="funnel-outline"
          variant="outline"
          onPress={() => setShowAdvancedFilter(true)}
          badge={getActiveFiltersCount() > 0 ? getActiveFiltersCount().toString() : null}
          style={styles.advancedFilterButton}
        />
        
        {hasActiveFilters() && (
          <ActionButton
            title="Reset"
            variant="outline"
            size="small"
            onPress={() => {
              clearFilters();
              searchMateri('');
            }}
            style={styles.resetButton}
          />
        )}
      </View>

      <MateriCascadeFilter
        visible={showAdvancedFilter}
        onClose={() => setShowAdvancedFilter(false)}
        onApply={handleAdvancedFilter}
        initialFilters={filters}
      />

      {statistics && (
        <View style={styles.statsContainer}>
          <StatsCard
            title="Total Materi"
            value={statistics.total_materi || 0}
            icon="document-text-outline"
            iconColor="#007bff"
          />
          
          <StatsCard
            title="Digunakan Kurikulum"
            value={statistics.used_in_kurikulum || 0}
            subtitle={`${statistics.usage_percentage || 0}% dari total`}
            icon="link-outline"
            iconColor="#28a745"
          />
          
          <StatsCard
            title="Belum Digunakan"
            value={statistics.not_used_in_kurikulum || 0}
            subtitle="Dapat dihapus"
            icon="unlink-outline"
            iconColor="#ffc107"
          />
        </View>
      )}
    </View>
  );

  return (
    <BaseListScreen
      data={materiData}
      loading={loading}
      refreshing={refreshing}
      error={error}
      onRefresh={handleRefresh}
      onRetry={() => {
        clearError();
        handleRefresh();
      }}
      onLoadMore={loadMore}
      renderItem={renderItem}
      keyExtractor={(item) => item.id_materi?.toString()}
      ListHeaderComponent={renderHeader}
      emptyStateProps={{
        icon: 'document-text-outline',
        title: 'Belum ada materi',
        message: 'Tambahkan materi pembelajaran pertama',
        actionButtonText: 'Tambah Materi',
        onActionPress: handleAdd
      }}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8
  },
  actionContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  addButton: {
    flex: 1,
    marginRight: 8
  },
  filterButton: {
    flex: 1,
    marginLeft: 8
  },
  searchBar: {
    marginBottom: 12
  },
  filtersContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  resetButton: {
    alignSelf: 'flex-start',
    marginTop: 8
  },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6
  },
  activeFilterChip: {
    backgroundColor: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  activeFilterText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600'
  },
  statsContainer: {
    gap: 8
  }
});

export default MateriListScreen;