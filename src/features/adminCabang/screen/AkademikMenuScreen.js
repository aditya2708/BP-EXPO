// src/features/adminCabang/screens/AkademikMenuScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../../common/components/SafeAreaWrapper';
import StatCard from '../../../common/components/StatCard';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import { fetchAkademikStats } from '../redux/akademik/akademikSlice';

const AkademikMenuScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector(state => state.akademik);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchStats = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    await dispatch(fetchAkademikStats());
    if (refresh) setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const menuItems = [
    {
      title: 'Kurikulum',
      subtitle: `${stats?.kurikulum || 0} kurikulum`,
      icon: 'library',
      color: '#8e44ad',
      onPress: () => navigation.navigate('KurikulumList'),
      description: 'Kelola kurikulum dan assignment materi'
    }
  ];

  const quickActions = [
    { title: 'Buat Kurikulum', icon: 'add-circle', color: '#8e44ad', onPress: () => navigation.navigate('KurikulumForm') },
    { title: 'Assign Materi', icon: 'link', color: '#3498db', onPress: () => navigation.navigate('KurikulumList') },
    { title: 'Lihat Master Data', icon: 'library-outline', color: '#2ecc71', onPress: () => navigation.navigate('MasterData') }
  ];

  const recentKurikulum = stats?.recent_kurikulum || [];

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat statistik akademik..." />;
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.header}>
        <Text style={styles.title}>Akademik</Text>
        <Text style={styles.subtitle}>Kelola kurikulum dan assignment materi</Text>
      </View>

      <ScrollView 
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchStats(true)} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Ringkasan Akademik</Text>
          <View style={styles.statsGrid}>
            <StatCard
              label="Total Kurikulum"
              value={stats?.kurikulum || 0}
              icon="library"
              color="#8e44ad"
            />
            <StatCard
              label="Materi Assigned"
              value={stats?.assigned_materi || 0}
              icon="link"
              color="#3498db"
            />
            <StatCard
              label="Semester Aktif"
              value={stats?.active_semester || 0}
              icon="calendar"
              color="#2ecc71"
            />
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
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {recentKurikulum.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Kurikulum Terbaru</Text>
            <View style={styles.recentGrid}>
              {recentKurikulum.slice(0, 3).map((kurikulum, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.recentCard}
                  onPress={() => navigation.navigate('KurikulumDetail', { id: kurikulum.id })}
                >
                  <Text style={styles.recentTitle}>{kurikulum.nama}</Text>
                  <Text style={styles.recentSubtitle}>
                    {kurikulum.jenjang?.nama} • {kurikulum.materi_count || 0} materi
                  </Text>
                  <Text style={styles.recentDate}>
                    {new Date(kurikulum.created_at).toLocaleDateString('id-ID')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

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

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#3498db" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Tentang Akademik</Text>
              <Text style={styles.infoText}>
                Bagian akademik fokus pada pengelolaan kurikulum dan assignment materi dari master data. 
                Materi dibuat di Master Data, kemudian di-assign ke kurikulum di sini.
              </Text>
            </View>
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
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
  recentSection: {
    padding: 16,
    paddingTop: 0,
  },
  recentGrid: {
    gap: 8,
  },
  recentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#8e44ad',
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recentSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  recentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  quickSection: {
    padding: 16,
    paddingTop: 0,
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
    minWidth: '30%',
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
  infoSection: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 32,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default AkademikMenuScreen;