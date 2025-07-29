import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BaseListScreen from '../../../components/base/BaseListScreen';
import JenjangCard from '../../../components/specific/jenjang/JenjangCard';
import ActionButton from '../../../components/shared/ActionButton';
import StatsCard from '../../../components/shared/StatsCard';
import { useJenjang } from '../../../hooks/useJenjang';

const JenjangListScreen = () => {
  const navigation = useNavigation();
  const {
    jenjangData,
    statistics,
    loading,
    refreshing,
    error,
    handleRefresh,
    loadMore,
    clearError,
    deleteJenjang
  } = useJenjang();

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemPress = (item) => {
    navigation.navigate('JenjangDetail', { id: item.id_jenjang, item });
  };

  const handleEdit = (item) => {
    navigation.navigate('JenjangForm', { 
      mode: 'edit', 
      id: item.id_jenjang, 
      item 
    });
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Hapus Jenjang',
      `Yakin ingin menghapus jenjang "${item.nama_jenjang}"?\n\nPerhatian: Jenjang yang memiliki kelas atau mata pelajaran tidak dapat dihapus.`,
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
    const result = await deleteJenjang(item.id_jenjang);
    
    if (result.success) {
      Alert.alert('Berhasil', 'Jenjang berhasil dihapus');
    } else {
      Alert.alert('Error', result.error || 'Gagal menghapus jenjang');
    }
  };

  const handleStats = (item) => {
    navigation.navigate('JenjangStats', { id: item.id_jenjang, item });
  };

  const handleAdd = () => {
    navigation.navigate('JenjangForm', { mode: 'create' });
  };

  const renderItem = ({ item }) => (
    <JenjangCard
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
          title="Tambah Jenjang"
          icon="add"
          onPress={handleAdd}
          style={styles.addButton}
        />
        
        <ActionButton
          title="Statistik"
          icon="bar-chart-outline"
          variant="outline"
          onPress={() => navigation.navigate('JenjangStats')}
          style={styles.statsButton}
        />
      </View>

      {statistics && (
        <View style={styles.statsContainer}>
          <StatsCard
            title="Total Jenjang"
            value={statistics.total_jenjang || 0}
            icon="library-outline"
            iconColor="#007bff"
          />
          
          <StatsCard
            title="Jenjang Aktif"
            value={statistics.total_jenjang_aktif || 0}
            subtitle={`${statistics.total_with_kelas || 0} dengan kelas`}
            icon="checkmark-circle-outline"
            iconColor="#28a745"
          />
          
          {statistics.most_used_jenjang && (
            <StatsCard
              title="Paling Banyak Digunakan"
              value={statistics.most_used_jenjang.nama}
              subtitle={`${statistics.most_used_jenjang.kelas_count} kelas`}
              icon="trending-up-outline"
              iconColor="#ffc107"
            />
          )}
        </View>
      )}
    </View>
  );

  return (
    <BaseListScreen
      data={jenjangData}
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
      keyExtractor={(item) => item.id_jenjang?.toString()}
      ListHeaderComponent={renderHeader}
      emptyStateProps={{
        icon: 'library-outline',
        title: 'Belum ada jenjang',
        message: 'Mulai dengan menambahkan jenjang pertama',
        actionButtonText: 'Tambah Jenjang',
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
  statsContainer: {
    gap: 8
  }
});

export default JenjangListScreen;