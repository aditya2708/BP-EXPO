// src/features/adminCabang/screens/akademik/kurikulum/KurikulumListScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import SafeAreaWrapper from '../../../../../common/components/SafeAreaWrapper';
import HeaderWithSearch from '../../../../../common/components/HeaderWithSearch';
import DataList from '../../../../../common/components/DataList';
import FilterChips from '../../../../../common/components/FilterChips';
import FloatingActionButton from '../../../../../common/components/FloatingActionButton';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import { 
  fetchKurikulumList, 
  deleteKurikulum, 
  clearError,
  selectKurikulumList,
  selectKurikulumLoading,
  selectKurikulumError,
  selectKurikulumPagination
} from '../../../redux/akademik/kurikulumSlice';
import { fetchJenjang } from '../../../redux/masterData/jenjangSlice';

const KurikulumListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const kurikulum = useSelector(selectKurikulumList);
  const loading = useSelector(selectKurikulumLoading);
  const error = useSelector(selectKurikulumError);
  const pagination = useSelector(selectKurikulumPagination);
  const { jenjang } = useSelector(state => state.jenjang);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJenjang, setSelectedJenjang] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchJenjang());
    dispatch(fetchKurikulumList({ page: 1 }));
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchKurikulumList({ 
      search: searchTerm, 
      jenjang_id: selectedJenjang?.id_jenjang,
      page: 1 
    }));
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!loading && pagination.current_page < pagination.last_page) {
      dispatch(fetchKurikulumList({ 
        search: searchTerm, 
        jenjang_id: selectedJenjang?.id_jenjang,
        page: pagination.current_page + 1 
      }));
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    dispatch(fetchKurikulumList({ 
      search: term, 
      jenjang_id: selectedJenjang?.id_jenjang,
      page: 1 
    }));
  };

  const handleJenjangFilter = (jenjang) => {
    setSelectedJenjang(jenjang);
    dispatch(fetchKurikulumList({ 
      search: searchTerm, 
      jenjang_id: jenjang?.id_jenjang,
      page: 1 
    }));
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Hapus Kurikulum',
      `Yakin hapus "${item.nama_kurikulum}"?\nSemester yang menggunakan kurikulum ini akan terpengaruh.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => dispatch(deleteKurikulum(item.id_kurikulum))
        }
      ]
    );
  };

  const renderItem = ({ item }) => ({
    title: item.nama_kurikulum,
    subtitle: `Tahun ${item.tahun_berlaku} • ${item.kurikulum_materi_count || 0} Materi • ${item.semester_count || 0} Semester`,
    onPress: () => navigation.navigate('KurikulumDetail', { id: item.id_kurikulum }),
    onEdit: () => navigation.navigate('KurikulumForm', { id: item.id_kurikulum }),
    onDelete: () => handleDelete(item),
    icon: 'library',
    iconColor: '#8e44ad',
    badge: item.is_active ? 'Aktif' : item.status === 'draft' ? 'Draft' : null,
    badgeColor: item.is_active ? '#2ecc71' : item.status === 'draft' ? '#f39c12' : null
  });

  const filterOptions = [
    { label: 'Semua Jenjang', value: null },
    ...(Array.isArray(jenjang) ? jenjang.map(j => ({ 
      label: j.nama_jenjang, 
      value: j 
    })) : [])
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
          keyExtractor={(item) => item?.id_jenjang || 'all'}
          labelExtractor={(item) => item?.label || 'Semua'}
        />
      </View>
      
      <DataList
        data={kurikulum}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_kurikulum.toString()}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        loading={loading}
        onEndReached={handleLoadMore}
        emptyMessage="Belum ada kurikulum"
        emptySubmessage="Buat kurikulum pertama"
      />
      
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