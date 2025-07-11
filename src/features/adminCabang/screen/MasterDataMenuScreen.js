import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

const MasterDataMenuScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [statistics, setStatistics] = useState({
    jenjang: { total: 0, active: 0 },
    mataPelajaran: { total: 0, active: 0 },
    kelas: { total: 0, active: 0 },
    materi: { total: 0, active: 0 },
  });

  const masterDataItems = [
    {
      id: 'jenjang',
      title: 'Jenjang',
      icon: 'layers-outline',
      color: '#3498db',
      navigateTo: 'JenjangManagement',
      description: 'Kelola jenjang pendidikan',
    },
    {
      id: 'mataPelajaran',
      title: 'Mata Pelajaran',
      icon: 'book-outline',
      color: '#e74c3c',
      navigateTo: 'MataPelajaranManagement',
      description: 'Kelola mata pelajaran',
    },
    {
      id: 'kelas',
      title: 'Kelas',
      icon: 'people-outline',
      color: '#f39c12',
      navigateTo: 'KelasManagement',
      description: 'Kelola tingkatan kelas',
    },
    {
      id: 'materi',
      title: 'Materi',
      icon: 'document-text-outline',
      color: '#9b59b6',
      navigateTo: 'MateriManagement',
      description: 'Kelola materi pembelajaran',
    },
  ];

  const loadStatistics = async () => {
    try {
      // TODO: Replace with actual API calls
      // const jenjangStats = await dispatch(fetchJenjangStatistics()).unwrap();
      // const mataPelajaranStats = await dispatch(fetchMataPelajaranStatistics()).unwrap();
      // const kelasStats = await dispatch(fetchKelasStatistics()).unwrap();
      // const materiStats = await dispatch(fetchMateriStatistics()).unwrap();
      
      // Mock data - replace with actual API responses
      setStatistics({
        jenjang: { total: 4, active: 4 },
        mataPelajaran: { total: 12, active: 11 },
        kelas: { total: 15, active: 15 },
        materi: { total: 48, active: 45 },
      });
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat statistik master data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const handleCardPress = (item) => {
    navigation.navigate(item.navigateTo);
  };

  const handleQuickAdd = (item) => {
    const formScreens = {
      jenjang: 'JenjangForm',
      mataPelajaran: 'MataPelajaranForm',
      kelas: 'KelasForm',
      materi: 'MateriForm',
    };
    navigation.navigate(formScreens[item.id]);
  };

  const renderMasterDataCard = (item) => {
    const stats = statistics[item.id];
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.card, { borderLeftColor: item.color }]}
        onPress={() => handleCardPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon} size={24} color="#fff" />
          </View>
          <TouchableOpacity
            style={styles.quickAddButton}
            onPress={() => handleQuickAdd(item)}
          >
            <Ionicons name="add" size={20} color={item.color} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#27ae60' }]}>
                {stats.active}
              </Text>
              <Text style={styles.statLabel}>Aktif</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Master Data</Text>
        <Text style={styles.headerSubtitle}>
          Kelola data dasar untuk sistem pembelajaran
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {masterDataItems.map(renderMasterDataCard)}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#3498db" />
          <Text style={styles.infoText}>
            Master Data digunakan sebagai dasar untuk membuat kurikulum di menu Akademik
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAddButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cardContent: {
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  infoContainer: {
    marginTop: 24,
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
});

export default MasterDataMenuScreen;