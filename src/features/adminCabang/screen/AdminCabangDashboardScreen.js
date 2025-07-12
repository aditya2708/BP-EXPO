import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image, Dimensions, Platform } from 'react-native';
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
  const [dashboardData, setDashboardData] = useState(null);
  const [surveyStats, setSurveyStats] = useState({});
  const [donaturStats, setDonaturStats] = useState({});
  const [kurikulumStats, setKurikulumStats] = useState({});
  const [mataPelajaranStats, setMataPelajaranStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const [
        dashboardResponse, 
        statsResponse, 
        donaturStatsResponse,
        kurikulumStatsResponse,
        mataPelajaranStatsResponse
      ] = await Promise.all([
        adminCabangApi.getDashboard().catch(err => {
          console.warn('Dashboard API failed:', err.message);
          return { data: { data: {} } };
        }),
        adminCabangSurveyApi.getStats().catch(err => {
          console.warn('Survey stats API failed:', err.message);
          return { data: { data: {} } };
        }),
        adminCabangDonaturApi.getStats().catch(err => {
          console.warn('Donatur stats API failed:', err.message);
          return { data: { data: {} } };
        }),
        kurikulumApi.getAll({ per_page: 1 }).catch(err => {
          console.warn('Kurikulum API failed:', err.message);
          return { data: { data: { total: 0, data: [] } } };
        }),
        mataPelajaranApi.getStatistics().catch(err => {
          console.warn('Mata pelajaran stats API failed:', err.message);
          return { data: { data: {} } };
        })
      ]);
      
      setDashboardData(dashboardResponse.data.data || {});
      setSurveyStats(statsResponse.data.data || {});
      setDonaturStats(donaturStatsResponse.data.data || {});
      
      const kurikulumData = kurikulumStatsResponse.data.data;
      setKurikulumStats({
        total_kurikulum: kurikulumData?.total || 0,
        active_kurikulum: kurikulumData?.data?.filter(k => k.status === 'aktif' || k.is_active).length || 0
      });
      setMataPelajaranStats(mataPelajaranStatsResponse.data.data || {});
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleRetry = () => {
    setLoading(true);
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
        <ErrorMessage 
          message={error}
          onRetry={handleRetry}
          retryText="Coba Lagi"
        />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#007bff']}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Selamat Datang</Text>
          <Text style={styles.userName}>{profile?.nama_lengkap || user?.email || 'Admin Cabang'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('AdminCabangProfile')}
        >
          <Ionicons name="person-circle-outline" size={30} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            title="Survey"
            value={surveyStats.total_surveys || 0}
            subtitle={`${surveyStats.pending_surveys || 0} Pending`}
            color="#ff6b6b"
            icon="document-text"
            onPress={() => navigation.navigate('AdminCabangSurveyList')}
          />
          <StatCard
            title="Donatur"
            value={donaturStats.total_donatur || 0}
            subtitle={`${donaturStats.donatur_with_children || 0} Aktif`}
            color="#4ecdc4"
            icon="people"
            onPress={() => navigation.navigate('AdminCabangDonaturList')}
          />
        </View>
        
        <View style={styles.statsRow}>
          <StatCard
            title="Kurikulum"
            value={kurikulumStats.total_kurikulum || 0}
            subtitle={`${kurikulumStats.active_kurikulum || 0} Aktif`}
            color="#45b7d1"
            icon="book"
            onPress={() => navigation.navigate('AdminCabangKurikulumList')}
          />
          <StatCard
            title="Mata Pelajaran"
            value={mataPelajaranStats.total_mata_pelajaran || 0}
            subtitle={`${mataPelajaranStats.active_mata_pelajaran || 0} Aktif`}
            color="#f9ca24"
            icon="library"
            onPress={() => navigation.navigate('AdminCabangMataPelajaranList')}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View style={styles.actionsGrid}>
          <ActionButton
            title="Master Data"
            subtitle="Kelola data master"
            icon="settings"
            color="#6c5ce7"
            onPress={() => navigation.navigate('AdminCabangMasterData')}
          />
          <ActionButton
            title="Akademik"
            subtitle="Kurikulum & Materi"
            icon="school"
            color="#a29bfe"
            onPress={() => navigation.navigate('AdminCabangAkademik')}
          />
          <ActionButton
            title="Survey Validasi"
            subtitle="Approve survey"
            icon="checkmark-circle"
            color="#00b894"
            onPress={() => navigation.navigate('AdminCabangSurveyList')}
          />
          <ActionButton
            title="Donatur"
            subtitle="Kelola donatur"
            icon="heart"
            color="#e17055"
            onPress={() => navigation.navigate('AdminCabangDonaturList')}
          />
        </View>
      </View>
    </ScrollView>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtitle, color, icon, onPress }) => (
  <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
    <View style={styles.statContent}>
      <View style={styles.statHeader}>
        <Text style={styles.statTitle}>{title}</Text>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

// Action Button Component
const ActionButton = ({ title, subtitle, icon, color, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <View style={[styles.actionIcon, { backgroundColor: color }]}>
      <Ionicons name={icon} size={24} color="#fff" />
    </View>
    <Text style={styles.actionTitle}>{title}</Text>
    <Text style={styles.actionSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    padding: 8,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
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
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default AdminCabangDashboardScreen;