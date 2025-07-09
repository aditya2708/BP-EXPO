// 21. src/features/adminCabang/screens/KurikulumDetailScreen.js
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
// import MateriKurikulumCard from '../components/MateriKurikulumCard';

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
    navigation.navigate('MateriKurikulum', { kurikulumId, kurikulum });
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
              await dispatch(removeMateri({
                id: kurikulumId,
                materiId: materiItem.id
              })).unwrap();
              Alert.alert('Sukses', 'Materi berhasil dihapus dari kurikulum');
            } catch (err) {
              Alert.alert('Error', 'Gagal menghapus materi');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aktif': return '#27ae60';
      case 'draft': return '#95a5a6';
      case 'nonaktif': return '#e74c3c';
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
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.total_jam_pelajaran || 0}</Text>
              <Text style={styles.statLabel}>Jam Pelajaran</Text>
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
    backgroundColor: '#f5f5f5',
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
    fontWeight: '500',
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
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  kurikulumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  descriptionContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  descriptionLabel: {
    fontSize: 16,
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
    shadowOpacity: 0.2,
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
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  actionHeader: {
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  materiList: {
    paddingBottom: 16,
  },
  emptyContainer: {
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
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default KurikulumDetailScreen;