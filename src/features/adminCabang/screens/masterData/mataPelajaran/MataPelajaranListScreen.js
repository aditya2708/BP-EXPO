import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BaseListScreen from '../../../components/base/BaseListScreen';
import MataPelajaranCard from '../../../components/specific/mataPelajaran/MataPelajaranCard';
import ActionButton from '../../../components/shared/ActionButton';
import StatsCard from '../../../components/shared/StatsCard';
import DropdownSelector from '../../../components/shared/DropdownSelector';
import { useMataPelajaran } from '../../../hooks/useMataPelajaran';
import { useCascadeData } from '../../../hooks/useCascadeData';

const MataPelajaranListScreen = () => {
  const navigation = useNavigation();
  const {
    mataPelajaranData,
    statistics,
    loading,
    refreshing,
    error,
    handleRefresh,
    loadMore,
    clearError,
    deleteMataPelajaran,
    filterByJenjang,
    filterByKategori
  } = useMataPelajaran();

  const {
    getJenjangOptions,
    getKategoriOptions,
    selectedJenjang,
    handleJenjangChange
  } = useCascadeData();

  const [selectedKategori, setSelectedKategori] = useState(null);

  const handleJenjangFilter = (jenjangId) => {
    handleJenjangChange(jenjangId);
    filterByJenjang(jenjangId);
  };

  const handleKategoriFilter = (kategori) => {
    setSelectedKategori(kategori);
    filterByKategori(kategori);
  };

  const handleItemPress = (item) => {
    navigation.navigate('MataPelajaranDetail', { id: item.id_mata_pelajaran, item });
  };

  const handleEdit = (item) => {
    navigation.navigate('MataPelajaranForm', { 
      mode: 'edit', 
      id: item.id_mata_pelajaran, 
      item 
    });
  };

  const handleDelete = async (item) => {
    const result = await deleteMataPelajaran(item.id_mata_pelajaran);
    
    if (!result.success) {
      Alert.alert('Error', result.error || 'Gagal menghapus mata pelajaran');
    }
  };

  const handleAdd = () => {
    navigation.navigate('MataPelajaranForm', { mode: 'create' });
  };

  const renderItem = ({ item }) => (
    <MataPelajaranCard
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
          title="Tambah Mata Pelajaran"
          icon="add"
          onPress={handleAdd}
          style={styles.addButton}
        />
        
        <ActionButton
          title="Statistik"
          icon="bar-chart-outline"
          variant="outline"
          onPress={() => navigation.navigate('MataPelajaranStats')}
          style={styles.statsButton}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <DropdownSelector
          label="Filter Jenjang"
          value={selectedJenjang}
          onSelect={handleJenjangFilter}
          options={getJenjangOptions()}
          placeholder="Semua Jenjang"
          style={styles.filterDropdown}
        />
        
        <DropdownSelector
          label="Filter Kategori"
          value={selectedKategori}
          onSelect={handleKategoriFilter}
          options={getKategoriOptions()}
          placeholder="Semua Kategori"
          style={styles.filterDropdown}
        />
      </View>

      {/* Statistics */}
      {statistics && (
        <View style={styles.statsContainer}>
          <StatsCard
            title="Total Mata Pelajaran"
            value={statistics.total_mata_pelajaran || 0}
            icon="book-outline"
            iconColor="#007bff"
          />
          
          <StatsCard
            title="Mata Pelajaran Aktif"
            value={statistics.active_mata_pelajaran || 0}
            subtitle={`${statistics.inactive_mata_pelajaran || 0} nonaktif`}
            icon="checkmark-circle-outline"
            iconColor="#28a745"
          />
          
          <StatsCard
            title="Dengan Materi"
            value={statistics.with_materi || 0}
            subtitle={`${statistics.without_materi || 0} belum ada materi`}
            icon="document-text-outline"
            iconColor="#17a2b8"
          />
        </View>
      )}
    </View>
  );

  return (
    <BaseListScreen
      data={mataPelajaranData}
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
      keyExtractor={(item) => item.id_mata_pelajaran?.toString()}
      ListHeaderComponent={renderHeader}
      emptyStateProps={{
        icon: 'book-outline',
        title: 'Belum ada mata pelajaran',
        message: 'Mulai dengan menambahkan mata pelajaran pertama',
        actionButtonText: 'Tambah Mata Pelajaran',
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
  statsButton: {
    flex: 1,
    marginLeft: 8
  },
  filtersContainer: {
    marginBottom: 16
  },
  filterDropdown: {
    marginBottom: 8
  },
  statsContainer: {
    gap: 8
  }
});

export default MataPelajaranListScreen;