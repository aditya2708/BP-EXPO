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

const AkademikMenuScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [statistics, setStatistics] = useState({
    kurikulum: {
      total: 0,
      active: 0,
      draft: 0,
      published: 0,
    },
    totalMateri: 0,
    avgMateriPerKurikulum: 0,
  });

  const loadStatistics = async () => {
    try {
      // TODO: Replace with actual API calls
      // const kurikulumStats = await dispatch(fetchKurikulumStatistics()).unwrap();
      
      // Mock data - replace with actual API responses
      setStatistics({
        kurikulum: {
          total: 8,
          active: 6,
          draft: 2,
          published: 6,
        },
        totalMateri: 145,
        avgMateriPerKurikulum: 18,
      });
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat statistik akademik');
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

  const handleCreateKurikulum = () => {
    navigation.navigate('KurikulumForm');
  };

  const handleManageKurikulum = () => {
    navigation.navigate('KurikulumManagement');
  };

  const quickActions = [
    {
      id: 'create',
      title: 'Buat Kurikulum',
      icon: 'add-circle',
      color: '#27ae60',
      action: handleCreateKurikulum,
    },
    {
      id: 'manage',
      title: 'Kelola Kurikulum',
      icon: 'settings',
      color: '#3498db',
      action: handleManageKurikulum,
    },
  ];

  const renderQuickAction = (action) => (
    <TouchableOpacity
      key={action.id}
      style={[styles.quickActionCard, { borderColor: action.color }]}
      onPress={action.action}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
        <Ionicons name={action.icon} size={24} color="#fff" />
      </View>
      <Text style={styles.quickActionTitle}>{action.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Akademik</Text>
        <Text style={styles.headerSubtitle}>
          Kelola kurikulum dengan menggabungkan materi dari Master Data
        </Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <View style={styles.statsIconContainer}>
            <Ionicons name="school" size={28} color="#fff" />
          </View>
          <View style={styles.statsHeaderText}>
            <Text style={styles.statsTitle}>Statistik Kurikulum</Text>
            <Text style={styles.statsSubtitle}>Overview sistem kurikulum</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{statistics.kurikulum.total}</Text>
            <Text style={styles.statLabel}>Total Kurikulum</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#27ae60' }]}>
              {statistics.kurikulum.published}
            </Text>
            <Text style={styles.statLabel}>Dipublikasi</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#f39c12' }]}>
              {statistics.kurikulum.draft}
            </Text>
            <Text style={styles.statLabel}>Draft</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#9b59b6' }]}>
              {statistics.totalMateri}
            </Text>
            <Text style={styles.statLabel}>Total Materi</Text>
          </View>
        </View>

        <View style={styles.additionalStats}>
          <View style={styles.additionalStatItem}>
            <Ionicons name="analytics" size={16} color="#7f8c8d" />
            <Text style={styles.additionalStatText}>
              Rata-rata {statistics.avgMateriPerKurikulum} materi per kurikulum
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map(renderQuickAction)}
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Ionicons name="lightbulb" size={20} color="#f39c12" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Tips Kurikulum</Text>
            <Text style={styles.infoText}>
              Gunakan materi dari Master Data untuk menyusun kurikulum yang terstruktur dan konsisten
            </Text>
          </View>
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
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statsHeaderText: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'center',
  },
  additionalStats: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  additionalStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  additionalStatText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#fff9e6',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e67e22',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#d68910',
    lineHeight: 20,
  },
});

export default AkademikMenuScreen;