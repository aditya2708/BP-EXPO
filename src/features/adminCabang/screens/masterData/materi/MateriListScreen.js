import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BaseListScreen from '../../../components/base/BaseListScreen';
import MateriCard from '../../../components/specific/materi/MateriCard';
import ActionButton from '../../../components/shared/ActionButton';
import StatsCard from '../../../components/shared/StatsCard';
import { useMateri } from '../../../hooks/useMateri';

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
    deleteMateri
  } = useMateri();

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
    const usage = item.kurikulum_materi_count || 0;
    Alert.alert(
      'Hapus Materi',
      usage > 0 
        ? `Materi "${item.nama_materi}" digunakan dalam ${usage} kurikulum dan tidak dapat dihapus.`
        : `Yakin ingin menghapus materi "${item.nama_materi}"?`,
      usage > 0 
        ? [{ text: 'OK' }]
        : [
            { text: 'Batal', style: 'cancel' },
            { text: 'Hapus', style: 'destructive', onPress: () => confirmDelete(item) }
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
          title="Statistik"
          icon="bar-chart-outline"
          variant="outline"
          onPress={() => navigation.navigate('MateriStats')}
          style={styles.statsButton}
        />
      </View>

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
            icon="checkmark-circle-outline"
            iconColor="#28a745"
          />
          
          <StatsCard
            title="Belum Digunakan"
            value={statistics.not_used_in_kurikulum || 0}
            subtitle="Perlu optimasi"
            icon="alert-circle-outline"
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
        message: 'Mulai dengan menambahkan materi pertama',
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
  statsButton: {
    flex: 1,
    marginLeft: 8
  },
  statsContainer: {
    gap: 8
  }
});

export default MateriListScreen;