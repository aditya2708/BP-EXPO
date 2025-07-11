import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import KurikulumCard from '../components/KurikulumCard';

import {
  fetchKurikulumList,
  deleteKurikulum,
  setActiveKurikulum,
  selectKurikulumList,
  selectKurikulumLoading,
  selectKurikulumError,
  selectKurikulumPagination
} from '../redux/kurikulumSlice';

const KurikulumManagementScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isMounted = useRef(true);
  
  const kurikulumList = useSelector(selectKurikulumList);
  const loading = useSelector(selectKurikulumLoading);
  const error = useSelector(selectKurikulumError);
  const pagination = useSelector(selectKurikulumPagination);
  
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    loadKurikulum();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  const safeAlert = (title, message, buttons) => {
    if (isMounted.current) {
      setTimeout(() => {
        if (isMounted.current) {
          Alert.alert(title, message, buttons);
        }
      }, 100);
    }
  };

  const loadKurikulum = async (page = 1) => {
    dispatch(fetchKurikulumList({ page }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadKurikulum(1);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (pagination.current_page < pagination.last_page && !loadingMore) {
      setLoadingMore(true);
      await loadKurikulum(pagination.current_page + 1);
      setLoadingMore(false);
    }
  };

  const navigateToForm = (kurikulum = null) => {
    if (isMounted.current) {
      navigation.navigate('KurikulumForm', { 
        kurikulum: kurikulum || undefined 
      });
    }
  };

  const navigateToDetail = (kurikulum) => {
    if (isMounted.current && kurikulum?.id_kurikulum) {
      navigation.navigate('KurikulumDetail', { 
        kurikulumId: kurikulum.id_kurikulum,
        kurikulum: kurikulum
      });
    }
  };

  const handleSetActive = (kurikulum) => {
    if (kurikulum.status === 'aktif') {
      safeAlert('Info', 'Kurikulum ini sudah aktif');
      return;
    }

    safeAlert(
      'Set Kurikulum Aktif',
      `Jadikan ${kurikulum.nama_kurikulum} sebagai kurikulum aktif?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya',
          onPress: async () => {
            try {
              await dispatch(setActiveKurikulum(kurikulum.id_kurikulum)).unwrap();
              safeAlert('Sukses', 'Kurikulum berhasil diaktifkan');
            } catch (err) {
              safeAlert('Error', err.message || 'Gagal mengaktifkan kurikulum');
            }
          }
        }
      ]
    );
  };

  const handleDelete = (kurikulum) => {
    if (kurikulum.status === 'aktif') {
      safeAlert('Error', 'Kurikulum aktif tidak dapat dihapus');
      return;
    }

    safeAlert(
      'Hapus Kurikulum',
      `Hapus ${kurikulum.nama_kurikulum}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteKurikulum(kurikulum.id_kurikulum)).unwrap();
              safeAlert('Sukses', 'Kurikulum berhasil dihapus');
            } catch (err) {
              safeAlert('Error', err.message || 'Gagal menghapus kurikulum');
            }
          }
        }
      ]
    );
  };

  const renderKurikulum = ({ item }) => (
    <KurikulumCard
      kurikulum={item}
      onPress={() => navigateToDetail(item)}
      onEdit={() => navigateToForm(item)}
      onSetActive={() => handleSetActive(item)}
      onDelete={() => handleDelete(item)}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <LoadingSpinner size="small" />
      </View>
    );
  };

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat kurikulum..." />;
  }

  return (
    <View style={styles.container}>
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => loadKurikulum()}
        />
      )}

      <FlatList
        data={kurikulumList}
        renderItem={renderKurikulum}
        keyExtractor={(item) => item.id_kurikulum?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyText}>Belum ada kurikulum</Text>
            <Text style={styles.emptySubText}>Tap tombol + untuk menambah kurikulum</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigateToForm()}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 4,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default KurikulumManagementScreen;