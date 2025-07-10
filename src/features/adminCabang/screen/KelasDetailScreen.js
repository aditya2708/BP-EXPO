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
import MateriCard from '../components/MateriCard';

import {
  fetchKelasDetail,
  deleteKelas,
  selectKelasDetail,
  selectKelasLoading,
  selectKelasError
} from '../redux/kelasSlice';

import {
  fetchMateriByKelas,
  selectMateriByKelas
} from '../redux/materiSlice';

const KelasDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { kelasId, kelas } = route.params;
  
  const detail = useSelector(selectKelasDetail);
  const loading = useSelector(selectKelasLoading);
  const error = useSelector(selectKelasError);
  const materiByKelas = useSelector(selectMateriByKelas);
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const materiData = kelasId ? (materiByKelas[kelasId] || []) : [];

  useEffect(() => {
    if (kelasId) {
      loadKelasDetail();
    }
  }, [kelasId]);

  const loadKelasDetail = async () => {
    dispatch(fetchKelasDetail(kelasId));
    dispatch(fetchMateriByKelas(kelasId));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadKelasDetail();
    setRefreshing(false);
  };

  const handleEdit = () => {
    navigation.navigate('KelasForm', { 
      kelas: detail || kelas 
    });
  };

  const handleDelete = () => {
    const itemToDelete = detail || kelas;
    
    Alert.alert(
      'Hapus Kelas',
      `Hapus ${itemToDelete.nama_kelas}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteKelas(itemToDelete.id_kelas)).unwrap();
              Alert.alert('Sukses', 'Kelas berhasil dihapus', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (err) {
              Alert.alert('Error', err.message || 'Gagal menghapus kelas');
            }
          }
        }
      ]
    );
  };

  const getRomanNumeral = (tingkat) => {
    const numerals = {
      1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
      7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
    };
    return numerals[tingkat] || tingkat;
  };

  const getDisplayName = (kelasData) => {
    if (kelasData?.jenis_kelas === 'standard' && kelasData?.tingkat) {
      return `Kelas ${getRomanNumeral(kelasData.tingkat)}`;
    }
    return kelasData?.nama_kelas || 'N/A';
  };

  const getJenisColor = (jenis) => {
    return jenis === 'standard' ? '#3498db' : '#e74c3c';
  };

  const getJenisText = (jenis) => {
    return jenis === 'standard' ? 'Standard' : 'Custom';
  };

  const getStatusColor = (isActive) => {
    return isActive ? '#27ae60' : '#95a5a6';
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
          Materi ({materiData?.length || 0})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Text style={styles.kelasTitle}>{getDisplayName(currentData)}</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.jenisBadge, { backgroundColor: getJenisColor(currentData?.jenis_kelas) }]}>
              <Text style={styles.badgeText}>{getJenisText(currentData?.jenis_kelas)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.hierarchyContainer}>
          <View style={styles.hierarchyRow}>
            <Ionicons name="git-branch-outline" size={16} color="#666" />
            <Text style={styles.hierarchyText}>
              {currentData?.jenjang?.nama_jenjang || 'N/A'} {'>'}  {getDisplayName(currentData)}
            </Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            Jenjang: {currentData?.jenjang?.nama_jenjang || 'N/A'}
          </Text>
        </View>
        
        {currentData?.tingkat && (
          <View style={styles.infoRow}>
            <Ionicons name="bar-chart-outline" size={16} color="#666" />
            <Text style={styles.infoText}>Tingkat: {currentData.tingkat}</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Ionicons name="list-outline" size={16} color="#666" />
          <Text style={styles.infoText}>Urutan: {currentData?.urutan}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="checkmark-circle-outline" size={16} color={getStatusColor(currentData?.is_active)} />
          <Text style={[styles.infoText, { color: getStatusColor(currentData?.is_active) }]}>
            {currentData?.is_active ? 'Aktif' : 'Non Aktif'}
          </Text>
        </View>
        
        {currentData?.deskripsi && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Deskripsi:</Text>
            <Text style={styles.descriptionText}>{currentData.deskripsi}</Text>
          </View>
        )}
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Statistik</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentData?.materi_count || materiData?.length || 0}</Text>
            <Text style={styles.statLabel}>Total Materi</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {materiData?.reduce((acc, curr) => {
                const subjects = new Set();
                materiData.forEach(m => subjects.add(m.mata_pelajaran));
                return subjects.size;
              }, 0) || 0}
            </Text>
            <Text style={styles.statLabel}>Mata Pelajaran</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderMateriItem = ({ item }) => (
    <MateriCard
      materi={item}
      onPress={() => navigation.navigate('MateriDetail', { 
        materiId: item.id_materi,
        materi: item 
      })}
      onEdit={() => navigation.navigate('MateriForm', { materi: item })}
      onDelete={() => {}} // Implement if needed
    />
  );

  const renderMateriTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.actionHeader}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('MateriForm', { 
            materi: { kelas: currentData } 
          })}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Tambah Materi</Text>
        </TouchableOpacity>
      </View>

      {materiData?.length > 0 ? (
        <FlatList
          data={materiData}
          renderItem={renderMateriItem}
          keyExtractor={(item) => item.id_materi.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={64} color="#bdc3c7" />
          <Text style={styles.emptyText}>Belum ada materi</Text>
          <Text style={styles.emptySubText}>Tap "Tambah Materi" untuk menambah materi</Text>
        </View>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat detail kelas..." />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={loadKelasDetail} />
      </View>
    );
  }

  const currentData = detail || kelas;
  
  if (!currentData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Data kelas tidak ditemukan</Text>
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
        {activeTab === 'info' && renderInfoTab()}
        {activeTab === 'materi' && renderMateriTab()}
      </ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
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
  kelasTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  jenisBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  hierarchyContainer: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
  },
  hierarchyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hierarchyText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    fontWeight: '500',
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
  listContainer: {
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
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default KelasDetailScreen;