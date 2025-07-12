// src/features/adminCabang/screens/akademik/kurikulum/KurikulumListScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import SafeAreaWrapper from '../../../../../common/components/SafeAreaWrapper';
import HeaderWithSearch from '../../../../../common/components/HeaderWithSearch';
import DataList from '../../../../../common/components/DataList';
import EmptyState from '../../../../../common/components/EmptyState';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import FloatingActionButton from '../../../../../common/components/FloatingActionButton';
import FilterChips from '../../../../../common/components/FilterChips';
import { fetchKurikulum, deleteKurikulum, clearError } from '../../../redux/akademik/kurikulumSlice';
import { fetchJenjang } from '../../../redux/masterData/jenjangSlice';

const KurikulumListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { kurikulum, loading, error, pagination } = useSelector(state => state.kurikulum);
  const { jenjang } = useSelector(state => state.jenjang);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJenjang, setSelectedJenjang] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    await dispatch(fetchKurikulum({ 
      search: searchTerm, 
      jenjang_id: selectedJenjang?.id,
      page: 1 
    }));
    if (refresh) setRefreshing(false);
  }, [dispatch, searchTerm, selectedJenjang]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchJenjang());
      fetchData();
    }, [fetchData])
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
    dispatch(fetchKurikulum({ 
      search: term, 
      jenjang_id: selectedJenjang?.id,
      page: 1 
    }));
  };

  const handleJenjangFilter = (jenjang) => {
    setSelectedJenjang(jenjang);
    dispatch(fetchKurikulum({ 
      search: searchTerm, 
      jenjang_id: jenjang?.id,
      page: 1 
    }));
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Hapus Kurikulum',
      `Yakin hapus "${item.nama}"? Semester yang menggunakan kurikulum ini akan terpengaruh.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => dispatch(deleteKurikulum(item.id))
        }
      ]
    );
  };

  const renderItem = ({ item }) => ({
    title: item.nama,
    subtitle: `${item.jenjang?.nama || 'Tanpa Jenjang'} • ${item.materi_count || 0} Materi • ${item.semester_count || 0} Semester`,
    onPress: () => navigation.navigate('KurikulumDetail', { id: item.id }),
    onEdit: () => navigation.navigate('KurikulumForm', { id: item.id }),
    onDelete: () => handleDelete(item),
    icon: 'library',
    iconColor: '#8e44ad',
    badge: item.is_active ? 'Aktif' : null,
    badgeColor: item.is_active ? '#2ecc71' : null
  });

  const filterOptions = [
    { label: 'Semua Jenjang', value: null },
    ...jenjang.map(j => ({ label: j.nama, value: j }))
  ];

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat kurikulum..." />;
  }

  return (
    <SafeAreaWrapper>
      <HeaderWithSearch
        title="Kurikulum"
        subtitle={`${pagination.total || 0} kurikulum`}
        onSearch={handleSearch}
        placeholder="Cari kurikulum..."
        error={error}
        onErrorDismiss={() => dispatch(clearError())}
      />
      
      <View style={styles.filterContainer}>
        <FilterChips
          options={filterOptions}
          selected={selectedJenjang}
          onSelect={handleJenjangFilter}
          keyExtractor={(item) => item?.id || 'all'}
          labelExtractor={(item) => item?.label || 'Semua'}
        />
      </View>
      
      {kurikulum.length === 0 ? (
        <EmptyState
          icon="library"
          title="Belum ada kurikulum"
          message="Buat kurikulum pertama dan assign materi dari master data"
          actionText="Buat Kurikulum"
          onAction={() => navigation.navigate('KurikulumForm')}
        />
      ) : (
        <DataList
          data={kurikulum}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchData(true)} />
          }
          onEndReached={() => {
            if (pagination.current_page < pagination.last_page) {
              dispatch(fetchKurikulum({ 
                search: searchTerm,
                jenjang_id: selectedJenjang?.id,
                page: pagination.current_page + 1 
              }));
            }
          }}
        />
      )}
      
      <FloatingActionButton
        icon="add"
        onPress={() => navigation.navigate('KurikulumForm')}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});

export default KurikulumListScreen;