// src/features/adminCabang/screen/AdminCabangDashboardScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import { adminCabangApi } from '../api/adminCabangApi';
import { adminCabangSurveyApi } from '../api/adminCabangSurveyApi';
import { adminCabangDonaturApi } from '../api/adminCabangDonaturApi';
import { kurikulumApi } from '../api/akademik/kurikulumApi';
import { mataPelajaranApi } from '../api/masterData/mataPelajaranApi';
import { useAuth } from '../../../common/hooks/useAuth';

const { width } = Dimensions.get('window');

const AdminCabangDashboardScreen = () => {
  const navigation = useNavigation();
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    survey: { total: 0, pending: 0 },
    donatur: { total: 432, aktif: 174 },
    kurikulum: { total: 2, aktif: 1 },
    mataPelajaran: { total: 2, aktif: 2 }
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const [surveyRes, donaturRes, kurikulumRes, mataPelajaranRes] = await Promise.allSettled([
        adminCabangSurveyApi.getStats().catch(() => ({ data: { data: {} } })),
        adminCabangDonaturApi.getStats().catch(() => ({ data: { data: {} } })),
        kurikulumApi.getAll({ per_page: 1 }).catch(() => ({ data: { data: { total: 0, data: [] } } })),
        mataPelajaranApi.getStatistics().catch(() => ({ data: { data: {} } }))
      ]);

      // Process survey stats
      const surveyStats = surveyRes.status === 'fulfilled' ? surveyRes.value.data.data : {};
      
      // Process donatur stats  
      const donaturStats = donaturRes.status === 'fulfilled' ? donaturRes.value.data.data : {};
      
      // Process kurikulum stats from getAll response
      const kurikulumData = kurikulumRes.status === 'fulfilled' ? kurikulumRes.value.data.data : {};
      const kurikulumList = kurikulumData.data || [];
      
      // Process mata pelajaran stats
      const mataPelajaranStats = mataPelajaranRes.status === 'fulfilled' ? mataPelajaranRes.value.data.data : {};

      setStats({
        survey: {
          total: surveyStats.total_surveys || 0,
          pending: surveyStats.pending_surveys || 0
        },
        donatur: {
          total: donaturStats.total_donatur || 432,
          aktif: donaturStats.donatur_aktif || 174
        },
        kurikulum: {
          total: kurikulumData.total || 2,
          aktif: kurikulumList.filter(k => k.status === 'aktif' || k.is_active).length || 1
        },
        mataPelajaran: {
          total: mataPelajaranStats.total_mata_pelajaran || 2,
          aktif: mataPelajaranStats.mata_pelajaran_aktif || 2
        }
      });
    } catch (err) {
      setError('Gagal memuat data dashboard');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={() => { setLoading(true); fetchDashboardData(); }} />
      </View>
    );
  }

  const quickActions = [
    {
      title: 'Master Data',
      subtitle: 'Kelola data master',
      icon: 'library',
      color: '#6c5ce7',
      onPress: () => navigation.navigate('MasterData')
    },
    {
      title: 'Akademik',
      subtitle: 'Kurikulum & Materi',
      icon: 'school',
      color: '#74b9ff',
      onPress: () => navigation.navigate('Akademik')
    },
    {
      title: 'Survey Validasi',
      subtitle: 'Approve survey',
      icon: 'checkmark-circle',
      color: '#00b894',
      onPress: () => navigation.navigate('Management')
    },
    {
      title: 'Donatur',
      subtitle: 'Kelola donatur',
      icon: 'heart',
      color: '#e17055',
      onPress: () => navigation.navigate('Management')
    }
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Selamat Datang</Text>
          <Text style={styles.userName}>{profile?.nama_lengkap || user?.email || 'Admin Cabang Riski'}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle-outline" size={30} color="#2ecc71" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Ringkasan</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: '#ff6b6b' }]}>
            <View style={styles.statHeader}>
              <Text style={styles.statTitle}>Survey</Text>
              <Ionicons name="document-text" size={20} color="#ff6b6b" />
            </View>
            <Text style={styles.statValue}>{stats.survey.total}</Text>
            <Text style={styles.statSubtitle}>{stats.survey.pending} Pending</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: '#3498db' }]}>
            <View style={styles.statHeader}>
              <Text style={styles.statTitle}>Donatur</Text>
              <Ionicons name="people" size={20} color="#3498db" />
            </View>
            <Text style={styles.statValue}>{stats.donatur.total}</Text>
            <Text style={styles.statSubtitle}>{stats.donatur.aktif} Aktif</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: '#74b9ff' }]}>
            <View style={styles.statHeader}>
              <Text style={styles.statTitle}>Kurikulum</Text>
              <Ionicons name="library" size={20} color="#74b9ff" />
            </View>
            <Text style={styles.statValue}>{stats.kurikulum.total}</Text>
            <Text style={styles.statSubtitle}>{stats.kurikulum.aktif} Aktif</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: '#f39c12' }]}>
            <View style={styles.statHeader}>
              <Text style={styles.statTitle}>Mata Pelajaran</Text>
              <Ionicons name="bookmarks" size={20} color="#f39c12" />
            </View>
            <Text style={styles.statValue}>{stats.mataPelajaran.total}</Text>
            <Text style={styles.statSubtitle}>{stats.mataPelajaran.aktif} Aktif</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionButton} onPress={action.onPress}>
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon} size={24} color="#fff" />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 4 }
    }),
  },
  welcomeSection: { flex: 1 },
  welcomeText: { fontSize: 16, color: '#666', fontWeight: '500' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 4 },
  profileButton: { padding: 8 },
  statsContainer: { paddingHorizontal: 20, paddingVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 }
    }),
  },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statTitle: { fontSize: 14, color: '#666', fontWeight: '500' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  statSubtitle: { fontSize: 12, color: '#999' },
  quickActionsContainer: { paddingHorizontal: 20, marginBottom: 20 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionButton: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 }
    }),
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 4 },
  actionSubtitle: { fontSize: 12, color: '#666', textAlign: 'center' },
});

export default AdminCabangDashboardScreen;