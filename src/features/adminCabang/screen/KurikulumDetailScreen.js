import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  FlatList 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import MateriKurikulumCard from '../components/MateriKurikulumCard';

import {
  fetchKurikulumDetail,
  fetchKurikulumStatistics,
  addMateri,
  removeMateri,
  selectKurikulumDetail,
  selectKurikulumStatistics,
  selectKurikulumLoading,
  selectKurikulumError
} from '../redux/kurikulumSlice';

const KurikulumDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const isMounted = useRef(true);
  
  const { kurikulumId } = route.params;
  
  const kurikulum = useSelector(selectKurikulumDetail);
  const statistics = useSelector(selectKurikulumStatistics);
  const loading = useSelector(selectKurikulumLoading);
  const error = useSelector(selectKurikulumError);
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    isMounted.current = true;
    loadKurikulumDetail();
    
    return () => {
      isMounted.current = false;
    };
  }, [kurikulumId]);

  const safeAlert = (title, message, buttons) => {
    if (isMounted.current) {
      setTimeout(() => {
        if (isMounted.current) {
          Alert.alert(title, message, buttons);
        }
      }, 100);
    }
  };

  const loadKurikulumDetail = async () => {
    dispatch(fetchKurikulumDetail(kurikulumId));
    dispatch(fetchKurikulumStatistics(kurikulumId));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadKurikulumDetail();
    setRefreshing(false);
  };

  const handleEditKurikulum = () => {
    navigation.navigate('KurikulumForm', {
      kurikulumId: kurikulum.id_kurikulum,
      kurikulum: kurikulum,
      mode: 'edit'
    });
  };

  const handleDeleteKurikulum = () => {
    safeAlert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menghapus kurikulum ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            // Handle delete
          }
        }
      ]
    );
  };

  const handleAddMateri = () => {
    navigation.navigate('MateriKurikulum', {
      kurikulumId: kurikulum.id_kurikulum,
      kurikulum: kurikulum
    });
  };

  const handleDeleteMateri = (materiId) => {
    safeAlert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menghapus materi ini dari kurikulum?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(removeMateri({ kurikulumId, materiId })).unwrap();
              safeAlert('Sukses', 'Materi berhasil dihapus dari kurikulum');
            } catch (err) {
              safeAlert('Error', err.message || 'Gagal menghapus materi');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aktif': return '#2ecc71';
      case 'draft': return '#f39c12';
      case 'nonaktif': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'info' && styles.activeTab]}
        onPress={() => setActiveTab('info')}
      >
        <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
          Info
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'materi' && styles.activeTab]}
        onPress={() => setActiveTab('materi')}
      >
        <Text style={[styles.tabText, activeTab === 'materi' && styles.activeTabText]}>
          Materi ({kurikulum?.kurikulum_materi?.length || 0})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Text style={styles.kurikulumTitle}>{kurikulum?.nama_kurikulum}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(kurikulum?.status) }]}>
            <Text style={styles.statusText}>{kurikulum?.status}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>Tahun Berlaku: {kurikulum?.tahun_berlaku}</Text>
        </View>
        
        {kurikulum?.deskripsi && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Deskripsi:</Text>
            <Text style={styles.descriptionText}>{kurikulum.deskripsi}</Text>
          </View>
        )}
      </View>

      {statistics && (
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Statistik</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.total_materi || 0}</Text>
              <Text style={styles.statLabel}>Total Materi</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.mata_pelajaran_count || 0}</Text>
              <Text style={styles.statLabel}>Mata Pelajaran</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.total_jenjang || 0}</Text>
              <Text style={styles.statLabel}>Jenjang</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderMateriTab = () => {
    const materiList = kurikulum?.kurikulum_materi || [];
    
    return (
      <View style={styles.tabContent}>
        <View style={styles.materiHeader}>
          <Text style={styles.materiTitle}>Daftar Materi</Text>
          <TouchableOpacity
            style={styles.addMateriButton}
            onPress={handleAddMateri}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addMateriText}>Tambah</Text>
          </TouchableOpacity>
        </View>

        {materiList.length === 0 ? (
          <View style={styles.emptyMateri}>
            <Ionicons name="document-outline" size={60} color="#bdc3c7" />
            <Text style={styles.emptyText}>Belum ada materi</Text>
            <Text style={styles.emptySubtext}>Tap tombol Tambah untuk menambah materi</Text>
          </View>
        ) : (
          <View>
            {materiList.map((item) => (
              <MateriKurikulumCard
                key={item.id.toString()}
                kurikulumMateri={item}
                onDelete={() => handleDeleteMateri(item.id)}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  if (loading && !kurikulum) {
    return <LoadingSpinner />;
  }

  if (error && !kurikulum) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadKurikulumDetail}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Kurikulum</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEditKurikulum}
          >
            <Ionicons name="create-outline" size={20} color="#3498db" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDeleteKurikulum}
          >
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>

      {renderTabBar()}

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2ecc71']}
          />
        }
      >
        {activeTab === 'info' ? renderInfoTab() : renderMateriTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2ecc71',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#2ecc71',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  kurikulumTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  descriptionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  materiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  materiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addMateriButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addMateriText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyMateri: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default KurikulumDetailScreen;