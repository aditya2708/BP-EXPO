import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BaseListScreen from '../../../components/base/BaseListScreen';
import KelasCard from '../../../components/specific/kelas/KelasCard';
import KelasFilter from '../../../components/specific/kelas/KelasFilter';
import ActionButton from '../../../components/shared/ActionButton';
import StatsCard from '../../../components/shared/StatsCard';
import FilterChip from '../../../components/shared/FilterChip';
import { useKelas } from '../../../hooks/useKelas';

const KelasListScreen = () => {
  const navigation = useNavigation();
  const {
    kelasData,
    statistics,
    cascadeData,
    loading,
    refreshing,
    error,
    fetchKelas,
    handleRefresh,
    loadMore,
    clearError,
    deleteKelas
  } = useKelas();

  const [selectedItem, setSelectedItem] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    applyFilters(activeFilters);
  }, [activeFilters]);

  const applyFilters = (filters) => {
    const params = {};
    
    if (filters.search) params.search = filters.search;
    if (filters.id_jenjang) params.id_jenjang = filters.id_jenjang;
    if (filters.jenis_kelas) params.jenis_kelas = filters.jenis_kelas;
    if (filters.is_active) params.is_active = filters.is_active;
    if (filters.sort_field) {
      params.sort = filters.sort_field;
      params.direction = filters.sort_direction || 'asc';
    }

    fetchKelas(params);
  };

  const handleFilterApply = (filters) => {
    setActiveFilters(filters);
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  const getActiveFilterCount = () => {
    return Object.entries(activeFilters).filter(([key, value]) => {
      if (key === 'sort_field' || key === 'sort_direction') return false;
      return value !== '' && value !== null && value !== undefined;
    }).length;
  };

  const handleItemPress = (item) => {
    navigation.navigate('KelasDetail', { id: item.id_kelas, item });
  };

  const handleEdit = (item) => {
    navigation.navigate('KelasForm', { 
      mode: 'edit', 
      id: item.id_kelas, 
      item 
    });
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Hapus Kelas',
      `Yakin ingin menghapus kelas "${item.nama_kelas || `Tingkat ${item.tingkat}`}"?\n\nPerhatian: Kelas yang memiliki materi tidak dapat dihapus.`,
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
    const result = await deleteKelas(item.id_kelas);
    
    if (result.success) {
      Alert.alert('Berhasil', 'Kelas berhasil dihapus');
    } else {
      Alert.alert('Error', result.error || 'Gagal menghapus kelas');
    }
  };

  const handleStats = (item) => {
    navigation.navigate('KelasStats', { id: item.id_kelas, item });
  };

  const handleAdd = () => {
    navigation.navigate('KelasForm', { mode: 'create' });
  };

  const renderItem = ({ item }) => (
    <KelasCard
      item={item}
      onPress={handleItemPress}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onStats={handleStats}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.actionContainer}>
        <ActionButton
          title="Tambah Kelas"
          icon="add"
          onPress={handleAdd}
          style={styles.addButton}
        />
        
        <ActionButton
          title={`Filter${getActiveFilterCount() > 0 ? ` (${getActiveFilterCount()})` : ''}`}
          icon="funnel-outline"
          variant="outline"
          onPress={() => setShowFilter(true)}
          style={styles.filterButton}
        />
      </View>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <View style={styles.activeFiltersContainer}>
          <View style={styles.activeFiltersHeader}>
            {activeFilters.jenis_kelas && (
              <FilterChip
                label={activeFilters.jenis_kelas === 'standard' ? 'Standard' : 'Custom'}
                active={true}
                onPress={() => setActiveFilters(prev => ({ ...prev, jenis_kelas: '' }))}
                color={activeFilters.jenis_kelas === 'standard' ? '#007bff' : '#28a745'}
                showClose
              />
            )}
            {activeFilters.is_active && (
              <FilterChip
                label={activeFilters.is_active === 'true' ? 'Aktif' : 'Nonaktif'}
                active={true}
                onPress={() => setActiveFilters(prev => ({ ...prev, is_active: '' }))}
                color={activeFilters.is_active === 'true' ? '#28a745' : '#dc3545'}
                showClose
              />
            )}
            <ActionButton
              title="Hapus Semua"
              size="small"
              variant="outline"
              onPress={clearFilters}
              style={styles.clearFiltersButton}
            />
          </View>
        </View>
      )}

      {statistics && (
        <View style={styles.statsContainer}>
          <StatsCard
            title="Total Kelas"
            value={statistics.total_kelas || 0}
            icon="library-outline"
            iconColor="#007bff"
          />
          
          <StatsCard
            title="Kelas Aktif"
            value={statistics.total_kelas_aktif || 0}
            subtitle={`${statistics.with_materi || 0} dengan materi`}
            icon="checkmark-circle-outline"
            iconColor="#28a745"
          />
          
          <View style={styles.typeStatsContainer}>
            <StatsCard
              title="Kelas Standard"
              value={statistics.standard_vs_custom?.standard || 0}
              icon="library-outline"
              iconColor="#007bff"
              style={styles.typeStatCard}
            />
            
            <StatsCard
              title="Kelas Custom"
              value={statistics.standard_vs_custom?.custom || 0}
              icon="create-outline"
              iconColor="#28a745"
              style={styles.typeStatCard}
            />
          </View>
        </View>
      )}
    </View>
  );

  return (
    <>
      <BaseListScreen
        data={kelasData}
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
        keyExtractor={(item) => item.id_kelas?.toString()}
        ListHeaderComponent={renderHeader}
        emptyStateProps={{
          icon: 'library-outline',
          title: 'Belum ada kelas',
          message: 'Mulai dengan menambahkan kelas pertama',
          actionButtonText: 'Tambah Kelas',
          onActionPress: handleAdd
        }}
      />

      <KelasFilter
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleFilterApply}
        filters={activeFilters}
        cascadeData={cascadeData}
      />
    </>
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
  activeFiltersContainer: {
    marginBottom: 16
  },
  activeFiltersHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8
  },
  clearFiltersButton: {
    height: 32
  },
  statsContainer: {
    gap: 8
  },
  typeStatsContainer: {
    flexDirection: 'row',
    gap: 8
  },
  typeStatCard: {
    flex: 1
  }
});

export default KelasListScreen;