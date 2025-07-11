// src/features/adminCabang/screens/masterData/kelas/KelasListScreen.js
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
import { fetchKelas, deleteKelas, clearError } from '../../../redux/masterData/kelasSlice';
import { fetchJenjang } from '../../../redux/masterData/jenjangSlice';

const KelasListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { kelas, loading, error, pagination } = useSelector(state => state.kelas);
  const { jenjang } = useSelector(state => state.jenjang);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJenjang, setSelectedJenjang] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    await dispatch(fetchKelas({ 
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
    dispatch(fetchKelas({ 
      search: term, 
      jenjang_id: selectedJenjang?.id,
      page: 1 
    }));
  };

  const handleJenjangFilter = (jenjang) => {
    setSelectedJenjang(jenjang);
    dispatch(fetchKelas({ 
      search: searchTerm, 
      jenjang_id: jenjang?.id,
      page: 1 
    }));
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Hapus Kelas',
      `Yakin hapus "${item.nama}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => dispatch(deleteKelas(item.id))
        }
      ]
    );
  };

  const renderItem = ({ item }) => ({
    title: item.nama,
    subtitle: `${item.jenjang?.nama || 'Tanpa Jenjang'} • Tingkat ${item.tingkat} • ${item.materi_count || 0} Materi`,
    onPress: () => navigation.navigate('KelasDetail', { id: item.id }),
    onEdit: () => navigation.navigate('KelasForm', { id: item.id }),
    onDelete: () => handleDelete(item),
    icon: 'library',
    iconColor: '#3498db',
    badge: `T${item.tingkat}`
  });

  const filterOptions = [
    { label: 'Semua Jenjang', value: null },
    ...jenjang.map(j => ({ label: j.nama, value: j }))
  ];

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat kelas..." />;
  }

  return (
    <SafeAreaWrapper>
      <HeaderWithSearch
        title="Kelas"
        subtitle={`${pagination.total || 0} kelas`}
        onSearch={handleSearch}
        placeholder="Cari kelas..."
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
      
      {kelas.length === 0 ? (
        <EmptyState
          icon="library"
          title="Belum ada kelas"
          message="Tambah kelas pertama untuk memulai"
          actionText="Tambah Kelas"
          onAction={() => navigation.navigate('KelasForm')}
        />
      ) : (
        <DataList
          data={kelas}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchData(true)} />
          }
          onEndReached={() => {
            if (pagination.current_page < pagination.last_page) {
              dispatch(fetchKelas({ 
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
        onPress={() => navigation.navigate('KelasForm')}
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

export default KelasListScreen;