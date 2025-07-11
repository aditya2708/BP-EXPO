import React, { useState, useEffect } from 'react';
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
  deleteMateri,
  selectKurikulumDetail,
  selectKurikulumStatistics,
  selectKurikulumLoading,
  selectKurikulumError
} from '../redux/kurikulumSlice';

const KurikulumDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { kurikulumId } = route.params;
  
  const kurikulum = useSelector(selectKurikulumDetail);
  const statistics = useSelector(selectKurikulumStatistics);
  const loading = useSelector(selectKurikulumLoading);
  const error = useSelector(selectKurikulumError);
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    loadKurikulumDetail();
  }, [kurikulumId]);

  const loadKurikulumDetail = async () => {
    dispatch(fetchKurikulumDetail(kurikulumId));
    dispatch(fetchKurikulumStatistics(kurikulumId));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadKurikulumDetail();
    setRefreshing(false);
  };

  const navigateToMateriManagement = () => {
    navigation.navigate('MateriKurikulum', { kurikulumId });
  };

  const handleEditKurikulum = () => {
    navigation.navigate('KurikulumForm', { kurikulum });
  };

  const handleDeleteMateri = (materiItem) => {
    Alert.alert(
      'Hapus Materi',
      `Hapus ${materiItem.materi?.nama_materi} dari kurikulum?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteMateri({
                kurikulumId,
                materiId: materiItem.id
              })).unwrap();
              Alert.alert('Sukses', 'Materi berhasil dihapus dari kurikulum');
            } catch (err) {
              Alert.alert('Error', err.message || 'Gagal menghapus materi');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aktif': return '#28a745';
      case 'draft': return '#ffc107';
      case 'nonaktif': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'aktif': return 'Aktif';
      case 'draft': return 'Draft';
      case 'nonaktif': return 'Non Aktif';
      default: return status;
    }
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'info' && styles.activeTab]}
        onPress={() => setActiveTab('info')}
      >
        <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
          Informasi
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
        <View style={styles.cardHeader}>
          <View style={styles.headerInfo}>
            <Text style={styles.kurikulumTitle}>{kurikulum?.nama_kurikulum}</Text>
            <Text style={styles.tahunBerlaku}>Tahun Berlaku: {kurikulum?.tahun_berlaku}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(kurikulum?.status) }]}>
            <Text style={styles.statusText}>{getStatusText(kurikulum?.status)}</Text>
          </View>
        </View>

        {kurikulum?.deskripsi && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Deskripsi:</Text>
            <Text style={styles.descriptionText}>{kurikulum.deskripsi}</Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditKurikulum}
          >
            <Ionicons name="create-outline" size={18} color="#007bff" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {statistics && (
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Statistik Kurikulum</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.total_mata_pelajaran || 0}</Text>
              <Text style={styles.statLabel}>Mata Pelajaran</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.total_materi || 0}</Text>
              <Text style={styles.statLabel}>Total Materi</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderMateriItem = ({ item }) => (
    <MateriKurikulumCard
      materiItem={item}
      onDelete={() => handleDeleteMateri(item)}
    />
  );

  const renderMateriTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.actionHeader}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={navigateToMateriManagement}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Kelola Materi</Text>
        </TouchableOpacity>
      </View>

      {kurikulum?.kurikulum_materi?.length > 0 ? (
        <FlatList
          data={kurikulum.kurikulum_materi}
          renderItem={renderMateriItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.materiList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={64} color="#bdc3c7" />
          <Text style={styles.emptyText}>Belum ada materi</Text>
          <Text style={styles.emptySubText}>Tap "Kelola Materi" untuk menambah materi</Text>
        </View>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat detail kurikulum..." />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={loadKurikulumDetail} />
      </View>
    );
  }

  if (!kurikulum) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Data kurikulum tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderTabBar()}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {activeTab === 'info' ? renderInfoTab() : renderMateriTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeTab: {
    borderBottomColor: '#007bff'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d'
  },
  activeTabText: {
    color: '#007bff'
  },
  content: {
    flex: 1
  },
  tabContent: {
    padding: 16
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  headerInfo: {
    flex: 1,
    marginRight: 12
  },
  kurikulumTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4
  },
  tahunBerlaku: {
    fontSize: 14,
    color: '#6c757d'
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  descriptionContainer: {
    marginBottom: 16
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 4
  },
  descriptionText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007bff'
  },
  editButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745'
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
    textAlign: 'center'
  },
  actionHeader: {
    marginBottom: 16
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 8
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  materiList: {
    paddingBottom: 16
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginTop: 16
  },
  emptySubText: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 4,
    textAlign: 'center'
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 50
  }
});

export default KurikulumDetailScreen;