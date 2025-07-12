// src/features/adminCabang/screen/AdminCabangManagementMenuScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../../common/components/SafeAreaWrapper';
import StatCard from '../../../common/components/StatCard';

const AdminCabangManagementMenuScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    donatur: 0,
    survey: 0,
    pengajuan: 0,
  });

  const fetchStats = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    // TODO: Implement API call for management stats
    setTimeout(() => {
      setStats({
        donatur: 25,
        survey: 8,
        pengajuan: 12,
      });
      if (refresh) setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const menuItems = [
    {
      title: 'Donatur',
      subtitle: `${stats.donatur} donatur`,
      icon: 'people',
      color: '#3498db',
      onPress: () => navigation.navigate('DonaturManagement'),
      description: 'Kelola data donatur dan sponsor'
    },
    {
      title: 'Survey',
      subtitle: `${stats.survey} survey`,
      icon: 'document-text',
      color: '#2ecc71',
      onPress: () => navigation.navigate('SurveyManagement'),
      description: 'Kelola survey dan feedback'
    },
    {
      title: 'Pengajuan',
      subtitle: `${stats.pengajuan} pending`,
      icon: 'clipboard',
      color: '#e74c3c',
      onPress: () => navigation.navigate('PengajuanDonatur'),
      description: 'Kelola pengajuan donatur'
    },
  ];

  const quickActions = [
    {
      title: 'Tambah Donatur',
      icon: 'person-add',
      color: '#3498db',
      onPress: () => navigation.navigate('DonaturForm')
    },
    {
      title: 'Buat Survey',
      icon: 'add-circle',
      color: '#2ecc71',
      onPress: () => navigation.navigate('SurveyForm')
    },
  ];

  return (
    <SafeAreaWrapper>
      <View style={styles.header}>
        <Text style={styles.title}>Manajemen</Text>
        <Text style={styles.subtitle}>Kelola donatur, survey & pengajuan</Text>
      </View>

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchStats(true)} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Ringkasan Data</Text>
          <View style={styles.statsGrid}>
            {menuItems.map((item, index) => (
              <StatCard
                key={index}
                label={item.title}
                value={stats[item.title.toLowerCase()] || 0}
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
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
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

export default AdminCabangManagementMenuScreen;