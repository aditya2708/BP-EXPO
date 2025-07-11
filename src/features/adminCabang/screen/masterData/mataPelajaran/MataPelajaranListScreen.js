// src/features/adminCabang/screens/masterData/mataPelajaran/MataPelajaranListScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import SafeAreaWrapper from '../../../../components/common/SafeAreaWrapper';
import HeaderWithSearch from '../../../../components/common/HeaderWithSearch';
import DataList from '../../../../components/common/DataList';
import EmptyState from '../../../../components/common/EmptyState';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import FloatingActionButton from '../../../../components/common/FloatingActionButton';
import FilterChips from '../../../../components/common/FilterChips';
import { fetchMataPelajaran, deleteMataPelajaran, clearError } from '../../../redux/masterData/mataPelajaranSlice';
import { fetchJenjang } from '../../../redux/masterData/jenjangSlice';

const MataPelajaranListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { mataPelajaran, loading, error, pagination } = useSelector(state => state.mataPelajaran);
  const { jenjang } = useSelector(state => state.jenjang);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJenjang, setSelectedJenjang] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    await dispatch(fetchMataPelajaran({ 
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
    dispatch(fetchMataPelajaran({ 
      search: term, 
      jenjang_id: selectedJenjang?.id,
      page: 1 
    }));
  };

  const handleJenjangFilter = (jenjang) => {
    setSelectedJenjang(jenjang);
    dispatch(fetchMataPelajaran({ 
      search: searchTerm, 
      jenjang_id: jenjang?.id,
      page: 1 
    }));
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Hapus Mata Pelajaran',
      `Yakin hapus "${item.nama}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => dispatch(deleteMataPelajaran(item.id))
        }
      ]
    );
  };

  const renderItem = ({ item }) => ({
    title: item.nama,
    subtitle: `${item.jenjang?.nama || 'Tanpa Jenjang'} • ${item.materi_count || 0} Materi`,
    onPress: () => navigation.navigate('MataPelajaranDetail', { id: item.id }),
    onEdit: () => navigation.navigate('MataPelajaranForm', { id: item.id }),
    onDelete: () => handleDelete(item),
    icon: 'book',
    iconColor: '#2ecc71',
    badge: item.jenjang?.nama
  });

  const filterOptions = [
    { label: 'Semua Jenjang', value: null },
    ...jenjang.map(j => ({ label: j.nama, value: j }))
  ];

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat mata pelajaran..." />;
  }

  return (
    <SafeAreaWrapper>
      <HeaderWithSearch
        title="Mata Pelajaran"
        subtitle={`${pagination.total || 0} mata pelajaran`}
        onSearch={handleSearch}
        placeholder="Cari mata pelajaran..."
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
      
      {mataPelajaran.length === 0 ? (
        <EmptyState
          icon="book"
          title="Belum ada mata pelajaran"
          message="Tambah mata pelajaran pertama untuk memulai"
          actionText="Tambah Mata Pelajaran"
          onAction={() => navigation.navigate('MataPelajaranForm')}
        />
      ) : (
        <DataList
          data={mataPelajaran}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchData(true)} />
          }
          onEndReached={() => {
            if (pagination.current_page < pagination.last_page) {
              dispatch(fetchMataPelajaran({ 
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
        onPress={() => navigation.navigate('MataPelajaranForm')}
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

export default MataPelajaranListScreen;