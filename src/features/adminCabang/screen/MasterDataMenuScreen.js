// src/features/adminCabang/screens/MasterDataMenuScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../../common/components/SafeAreaWrapper';
import StatCard from '../../../common/components/StatCard';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import { fetchMasterDataStats } from '../redux/masterData/masterDataSlice';

const MasterDataMenuScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector(state => state.masterData);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchStats = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    await dispatch(fetchMasterDataStats());
    if (refresh) setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const menuItems = [
    {
      title: 'Jenjang',
      subtitle: `${stats?.jenjang || 0} jenjang`,
      icon: 'school',
      color: '#3498db',
      onPress: () => navigation.navigate('JenjangList'),
      description: 'Kelola jenjang pendidikan'
    },
    {
      title: 'Mata Pelajaran',
      subtitle: `${stats?.mata_pelajaran || 0} mata pelajaran`,
      icon: 'book',
      color: '#2ecc71',
      onPress: () => navigation.navigate('MataPelajaranList'),
      description: 'Kelola mata pelajaran per jenjang'
    },
    {
      title: 'Kelas',
      subtitle: `${stats?.kelas || 0} kelas`,
      icon: 'library',
      color: '#e74c3c',
      onPress: () => navigation.navigate('KelasList'),
      description: 'Kelola kelas per jenjang'
    },
    {
      title: 'Materi',
      subtitle: `${stats?.materi || 0} materi`,
      icon: 'document-text',
      color: '#f39c12',
      onPress: () => navigation.navigate('MateriList'),
      description: 'Kelola materi pembelajaran'
    }
  ];

  const quickActions = [
    { title: 'Tambah Jenjang', icon: 'add-circle', color: '#3498db', onPress: () => navigation.navigate('JenjangForm') },
    { title: 'Tambah Mata Pelajaran', icon: 'add-circle', color: '#2ecc71', onPress: () => navigation.navigate('MataPelajaranForm') },
    { title: 'Tambah Kelas', icon: 'add-circle', color: '#e74c3c', onPress: () => navigation.navigate('KelasForm') },
    { title: 'Tambah Materi', icon: 'add-circle', color: '#f39c12', onPress: () => navigation.navigate('MateriForm') }
  ];

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat statistik..." />;
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.header}>
        <Text style={styles.title}>Master Data</Text>
        <Text style={styles.subtitle}>Kelola data dasar sistem</Text>
      </View>

      <ScrollView 
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchStats(true)} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Ringkasan Data</Text>
          <View style={styles.statsGrid}>
            {menuItems.map((item, index) => (
              <StatCard
                key={index}
                label={item.title}
                value={stats?.[item.title.toLowerCase().replace(' ', '_')] || 0}
                icon={item.icon}
                color={item.color}
                onPress={item.onPress}
              />
            ))}
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu Utama</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuCard} onPress={item.onPress}>
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={32} color="#fff" />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" style={styles.chevron} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.quickSection}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
          <View style={styles.quickGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickButton} onPress={action.onPress}>
                <Ionicons name={action.icon} size={24} color={action.color} />
                <Text style={styles.quickText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  statsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuSection: {
    padding: 16,
    paddingTop: 0,
  },
  menuGrid: {
    gap: 12,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  menuDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  chevron: {
    marginLeft: 8,
  },
  quickSection: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 32,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  quickText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default MasterDataMenuScreen;