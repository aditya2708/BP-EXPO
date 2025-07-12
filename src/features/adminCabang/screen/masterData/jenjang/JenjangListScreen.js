// src/features/adminCabang/screens/masterData/jenjang/JenjangListScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../../../../common/components/SafeAreaWrapper';
import HeaderWithSearch from '../../../../../common/components/HeaderWithSearch';
import DataList from '../../../../../common/components/DataList';
import EmptyState from '../../../../../common/components/EmptyState';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import FloatingActionButton from '../../../../../common/components/FloatingActionButton';
import { fetchJenjang, deleteJenjang, clearError } from '../../../redux/masterData/jenjangSlice';

const JenjangListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { jenjang, loading, error, pagination } = useSelector(state => state.jenjang);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    await dispatch(fetchJenjang({ search: searchTerm, page: 1 }));
    if (refresh) setRefreshing(false);
  }, [dispatch, searchTerm]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
    dispatch(fetchJenjang({ search: term, page: 1 }));
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Hapus Jenjang',
      `Yakin hapus "${item.nama}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => dispatch(deleteJenjang(item.id))
        }
      ]
    );
  };

  const renderItem = ({ item }) => ({
    title: item.nama,
    subtitle: `${item.kelas_count || 0} Kelas • ${item.mata_pelajaran_count || 0} Mata Pelajaran`,
    onPress: () => navigation.navigate('JenjangDetail', { id: item.id }),
    onEdit: () => navigation.navigate('JenjangForm', { id: item.id }),
    onDelete: () => handleDelete(item),
    icon: 'school',
    iconColor: '#3498db'
  });

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat jenjang..." />;
  }

  return (
    <SafeAreaWrapper>
      <HeaderWithSearch
        title="Jenjang"
        subtitle={`${pagination.total || 0} jenjang`}
        onSearch={handleSearch}
        placeholder="Cari jenjang..."
        error={error}
        onErrorDismiss={() => dispatch(clearError())}
      />
      
      {jenjang.length === 0 ? (
        <EmptyState
          icon="school"
          title="Belum ada jenjang"
          message="Tambah jenjang pertama untuk memulai"
          actionText="Tambah Jenjang"
          onAction={() => navigation.navigate('JenjangForm')}
        />
      ) : (
        <DataList
          data={jenjang}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchData(true)} />
          }
          onEndReached={() => {
            if (pagination.current_page < pagination.last_page) {
              dispatch(fetchJenjang({ 
                search: searchTerm, 
                page: pagination.current_page + 1 
              }));
            }
          }}
        />
      )}
      
      <FloatingActionButton
        icon="add"
        onPress={() => navigation.navigate('JenjangForm')}
      />
    </SafeAreaWrapper>
  );
};

export default JenjangListScreen;