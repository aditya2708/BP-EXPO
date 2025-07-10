import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import KelasCard from '../components/KelasCard';
import MataPelajaranCard from '../components/MataPelajaranCard';

import {
  fetchJenjangDetail,
  fetchJenjangKelas,
  fetchJenjangMataPelajaran,
  selectJenjangDetail,
  selectJenjangKelas,
  selectJenjangMataPelajaran,
  selectJenjangLoading,
  selectJenjangError
} from '../redux/jenjangSlice';

const JenjangDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { jenjangId, jenjang } = route.params;
  
  const detail = useSelector(selectJenjangDetail);
  const kelasList = useSelector(selectJenjangKelas);
  const mataPelajaranList = useSelector(selectJenjangMataPelajaran);
  const loading = useSelector(selectJenjangLoading);
  const error = useSelector(selectJenjangError);
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (jenjangId) {
      loadJenjangDetail();
    }
  }, [jenjangId]);

  const loadJenjangDetail = async () => {
    dispatch(fetchJenjangDetail(jenjangId));
    dispatch(fetchJenjangKelas(jenjangId));
    dispatch(fetchJenjangMataPelajaran(jenjangId));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadJenjangDetail();
    setRefreshing(false);
  };

  const handleEdit = () => {
    navigation.navigate('JenjangForm', { 
      jenjang: detail || jenjang 
    });
  };

  const getStatusColor = (isActive) => {
    return isActive ? '#27ae60' : '#e74c3c';
  };

  const getRomanNumeral = (tingkat) => {
    const numerals = {
      1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
      7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
    };
    return numerals[tingkat] || tingkat;
  };

  const getKelasDisplayName = (kelas) => {
    if (kelas.jenis_kelas === 'standard' && kelas.tingkat) {
      return `Kelas ${getRomanNumeral(kelas.tingkat)}`;
    }
    return kelas.nama_kelas;
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
        style={[styles.tab, activeTab === 'kelas' && styles.activeTab]}
        onPress={() => setActiveTab('kelas')}
      >
        <Text style={[styles.tabText, activeTab === 'kelas' && styles.activeTabText]}>
          Kelas ({kelasList?.length || 0})
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'mapel' && styles.activeTab]}
        onPress={() => setActiveTab('mapel')}
      >
        <Text style={[styles.tabText, activeTab === 'mapel' && styles.activeTabText]}>
          Mata Pelajaran ({mataPelajaranList?.length || 0})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Text style={styles.jenjangTitle}>{currentData?.nama_jenjang}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentData?.is_active) }]}>
            <Text style={styles.statusText}>
              {currentData?.is_active ? 'Aktif' : 'Non Aktif'}
            </Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="code-outline" size={16} color="#666" />
          <Text style={styles.infoText}>Kode: {currentData?.kode_jenjang}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="list-outline" size={16} color="#666" />
          <Text style={styles.infoText}>Urutan: {currentData?.urutan}</Text>
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
            <Text style={styles.statNumber}>{currentData?.kelas_count || 0}</Text>
            <Text style={styles.statLabel}>Total Kelas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentData?.kelas_standard_count || 0}</Text>
            <Text style={styles.statLabel}>Kelas Standard</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentData?.kelas_custom_count || 0}</Text>
            <Text style={styles.statLabel}>Kelas Custom</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentData?.mata_pelajaran_count || 0}</Text>
            <Text style={styles.statLabel}>Mata Pelajaran</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderKelasItem = ({ item }) => (
    <KelasCard
      kelas={item}
      onPress={() => navigation.navigate('KelasDetail', { 
        kelasId: item.id_kelas,
        kelas: item 
      })}
      onEdit={() => navigation.navigate('KelasForm', { kelas: item })}
      onDelete={() => {}} // Implement if needed
    />
  );

  const renderKelasTab = () => (
    <View style={styles.tabContent}>
      {kelasList?.length > 0 ? (
        <FlatList
          data={kelasList}
          renderItem={renderKelasItem}
          keyExtractor={(item) => item.id_kelas.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="school-outline" size={64} color="#bdc3c7" />
          <Text style={styles.emptyText}>Belum ada kelas</Text>
          <Text style={styles.emptySubText}>Kelas akan muncul setelah ditambahkan</Text>
        </View>
      )}
    </View>
  );

  const renderMataPelajaranItem = ({ item }) => (
    <MataPelajaranCard
      mataPelajaran={item}
      onPress={() => navigation.navigate('MataPelajaranDetail', { 
        mataPelajaranId: item.id_mata_pelajaran,
        mataPelajaran: item 
      })}
      onEdit={() => navigation.navigate('MataPelajaranForm', { mataPelajaran: item })}
      onDelete={() => {}} // Implement if needed
    />
  );

  const renderMataPelajaranTab = () => (
    <View style={styles.tabContent}>
      {mataPelajaranList?.length > 0 ? (
        <FlatList
          data={mataPelajaranList}
          renderItem={renderMataPelajaranItem}
          keyExtractor={(item) => item.id_mata_pelajaran.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="library-outline" size={64} color="#bdc3c7" />
          <Text style={styles.emptyText}>Belum ada mata pelajaran</Text>
          <Text style={styles.emptySubText}>Mata pelajaran akan muncul setelah ditambahkan</Text>
        </View>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat detail jenjang..." />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={loadJenjangDetail} />
      </View>
    );
  }

  const currentData = detail || jenjang;
  
  if (!currentData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Data jenjang tidak ditemukan</Text>
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
        {activeTab === 'kelas' && renderKelasTab()}
        {activeTab === 'mapel' && renderMataPelajaranTab()}
      </ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Edit</Text>
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
    fontSize: 14,
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
  jenjangTitle: {
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
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    minWidth: '45%',
    marginBottom: 16,
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
  editButtonText: {
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

export default JenjangDetailScreen;