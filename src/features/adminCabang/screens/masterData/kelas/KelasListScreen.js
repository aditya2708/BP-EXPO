import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BaseListScreen from '../../../components/base/BaseListScreen';
import KelasCard from '../../../components/specific/kelas/KelasCard';
import ActionButton from '../../../components/shared/ActionButton';
import StatsCard from '../../../components/shared/StatsCard';
import DropdownSelector from '../../../components/shared/DropdownSelector';
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
    handleRefresh,
    loadMore,
    clearError,
    deleteKelas,
    filterByJenjang,
    filterByJenisKelas
  } = useKelas();

  const [selectedJenjang, setSelectedJenjang] = useState('');
  const [selectedJenisKelas, setSelectedJenisKelas] = useState('');

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
    const hasMateri = (item.materi?.length || item.materi_count || 0) > 0;
    
    Alert.alert(
      'Hapus Kelas',
      `Yakin ingin menghapus kelas "${item.nama_kelas}"?${hasMateri ? '\n\nPerhatian: Kelas yang memiliki materi tidak dapat dihapus.' : ''}`,
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

  const handleJenjangFilter = (jenjangId) => {
    setSelectedJenjang(jenjangId);
    if (jenjangId) {
      filterByJenjang(parseInt(jenjangId));
    } else {
      handleRefresh();
    }
  };

  const handleJenisKelasFilter = (jenisKelas) => {
    setSelectedJenisKelas(jenisKelas);
    if (jenisKelas) {
      filterByJenisKelas(jenisKelas);
    } else {
      handleRefresh();
    }
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

  const jenjangOptions = [
    { label: 'Semua Jenjang', value: '' },
    ...(cascadeData?.jenjang?.map(item => ({
      label: `${item.kode_jenjang} - ${item.nama_jenjang}`,
      value: item.id_jenjang.toString()
    })) || [])
  ];

  const jenisKelasOptions = [
    { label: 'Semua Jenis', value: '' },
    { label: 'Standard', value: 'standard' },
    { label: 'Custom', value: 'custom' }
  ];

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
          title="Statistik"
          icon="bar-chart-outline"
          variant="outline"
          onPress={() => navigation.navigate('KelasStats')}
          style={styles.statsButton}
        />
      </View>

      <View style={styles.filterContainer}>
        <DropdownSelector
          value={selectedJenjang}
          onValueChange={handleJenjangFilter}
          options={jenjangOptions}
          placeholder="Filter Jenjang"
          style={styles.filterDropdown}
        />
        
        <DropdownSelector
          value={selectedJenisKelas}
          onValueChange={handleJenisKelasFilter}
          options={jenisKelasOptions}
          placeholder="Filter Jenis"
          style={styles.filterDropdown}
        />
      </View>

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
          
          <View style={styles.typeStats}>
            <StatsCard
              title="Standard"
              value={statistics.standard_vs_custom?.standard || 0}
              icon="layers-outline"
              iconColor="#007bff"
              backgroundColor="#e7f3ff"
              style={styles.typeStatCard}
            />
            
            <StatsCard
              title="Custom"
              value={statistics.standard_vs_custom?.custom || 0}
              icon="create-outline"
              iconColor="#28a745"
              backgroundColor="#d4edda"
              style={styles.typeStatCard}
            />
          </View>
        </View>
      )}
    </View>
  );

  return (
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
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8
  },
  filterDropdown: {
    flex: 1
  },
  statsContainer: {
    gap: 8
  },
  typeStats: {
    flexDirection: 'row',
    gap: 8
  },
  typeStatCard: {
    flex: 1
  }
});

export default KelasListScreen;