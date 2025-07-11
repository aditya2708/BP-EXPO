// src/features/adminCabang/screens/masterData/materi/MateriListScreen.js
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
import { fetchMateri, deleteMateri, clearError } from '../../../redux/masterData/materiSlice';
import { fetchKelas } from '../../../redux/masterData/kelasSlice';
import { fetchMataPelajaran } from '../../../redux/masterData/mataPelajaranSlice';

const MateriListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { materi, loading, error, pagination } = useSelector(state => state.materi);
  const { kelas } = useSelector(state => state.kelas);
  const { mataPelajaran } = useSelector(state => state.mataPelajaran);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [selectedMataPelajaran, setSelectedMataPelajaran] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    await dispatch(fetchMateri({ 
      search: searchTerm, 
      kelas_id: selectedKelas?.id,
      mata_pelajaran_id: selectedMataPelajaran?.id,
      page: 1 
    }));
    if (refresh) setRefreshing(false);
  }, [dispatch, searchTerm, selectedKelas, selectedMataPelajaran]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchKelas());
      dispatch(fetchMataPelajaran());
      fetchData();
    }, [fetchData])
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
    dispatch(fetchMateri({ 
      search: term, 
      kelas_id: selectedKelas?.id,
      mata_pelajaran_id: selectedMataPelajaran?.id,
      page: 1 
    }));
  };

  const handleKelasFilter = (kelas) => {
    setSelectedKelas(kelas);
    dispatch(fetchMateri({ 
      search: searchTerm, 
      kelas_id: kelas?.id,
      mata_pelajaran_id: selectedMataPelajaran?.id,
      page: 1 
    }));
  };

  const handleMataPelajaranFilter = (mataPelajaran) => {
    setSelectedMataPelajaran(mataPelajaran);
    dispatch(fetchMateri({ 
      search: searchTerm, 
      kelas_id: selectedKelas?.id,
      mata_pelajaran_id: mataPelajaran?.id,
      page: 1 
    }));
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Hapus Materi',
      `Yakin hapus "${item.nama}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => dispatch(deleteMateri(item.id))
        }
      ]
    );
  };

  const renderItem = ({ item }) => ({
    title: item.nama,
    subtitle: `${item.mata_pelajaran?.nama || 'Tanpa Mata Pelajaran'} • ${item.kelas?.nama || 'Tanpa Kelas'}`,
    onPress: () => navigation.navigate('MateriDetail', { id: item.id }),
    onEdit: () => navigation.navigate('MateriForm', { id: item.id }),
    onDelete: () => handleDelete(item),
    icon: 'document-text',
    iconColor: '#f39c12',
    badge: item.kurikulum_count > 0 ? `${item.kurikulum_count} Kurikulum` : null
  });

  const kelasOptions = [
    { label: 'Semua Kelas', value: null },
    ...kelas.map(k => ({ label: k.nama, value: k }))
  ];

  const mataPelajaranOptions = [
    { label: 'Semua Mata Pelajaran', value: null },
    ...mataPelajaran.map(mp => ({ label: mp.nama, value: mp }))
  ];

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat materi..." />;
  }

  return (
    <SafeAreaWrapper>
      <HeaderWithSearch
        title="Materi"
        subtitle={`${pagination.total || 0} materi`}
        onSearch={handleSearch}
        placeholder="Cari materi..."
        error={error}
        onErrorDismiss={() => dispatch(clearError())}
      />
      
      <View style={styles.filterContainer}>
        <FilterChips
          options={kelasOptions}
          selected={selectedKelas}
          onSelect={handleKelasFilter}
          keyExtractor={(item) => item?.id || 'all'}
          labelExtractor={(item) => item?.label || 'Semua'}
        />
        <FilterChips
          options={mataPelajaranOptions}
          selected={selectedMataPelajaran}
          onSelect={handleMataPelajaranFilter}
          keyExtractor={(item) => item?.id || 'all'}
          labelExtractor={(item) => item?.label || 'Semua'}
        />
      </View>
      
      {materi.length === 0 ? (
        <EmptyState
          icon="document-text"
          title="Belum ada materi"
          message="Tambah materi pertama untuk memulai"
          actionText="Tambah Materi"
          onAction={() => navigation.navigate('MateriForm')}
        />
      ) : (
        <DataList
          data={materi}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchData(true)} />
          }
          onEndReached={() => {
            if (pagination.current_page < pagination.last_page) {
              dispatch(fetchMateri({ 
                search: searchTerm,
                kelas_id: selectedKelas?.id,
                mata_pelajaran_id: selectedMataPelajaran?.id,
                page: pagination.current_page + 1 
              }));
            }
          }}
        />
      )}
      
      <FloatingActionButton
        icon="add"
        onPress={() => navigation.navigate('MateriForm')}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
});

export default MateriListScreen;