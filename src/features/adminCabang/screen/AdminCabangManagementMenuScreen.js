// src/features/adminCabang/screen/AdminCabangManagementMenuScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../../common/components/SafeAreaWrapper';

const AdminCabangManagementMenuScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ donatur: 432, survey: 0, pengajuan: 12 });

  const fetchStats = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    // TODO: Implement API call
    setTimeout(() => {
      setStats({ donatur: 432, survey: 0, pengajuan: 12 });
      if (refresh) setRefreshing(false);
    }, 1000);
  };

  useEffect(() => { fetchStats(); }, []);

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
      title: 'Survey Validasi',
      subtitle: `${stats.survey} survey`,
      icon: 'checkmark-circle',
      color: '#2ecc71',
      onPress: () => {
        // For now, show alert since Survey screens are not implemented
        alert('Fitur Survey Validasi sedang dalam pengembangan');
      },
      description: 'Approve survey dan validasi'
    },
  ];

  const quickActions = [
    { icon: 'add-circle', title: 'Tambah Donatur', onPress: () => navigation.navigate('DonaturForm') },
    { icon: 'stats-chart', title: 'Laporan', onPress: () => alert('Fitur laporan akan segera hadir') },
    { icon: 'settings', title: 'Pengaturan', onPress: () => alert('Fitur pengaturan akan segera hadir') },
    { icon: 'download', title: 'Export Data', onPress: () => alert('Fitur export akan segera hadir') },
  ];

  return (
    <SafeAreaWrapper>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchStats(true)} />}
      >
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Ringkasan</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderLeftColor: '#3498db' }]}>
              <Text style={styles.statNumber}>{stats.donatur}</Text>
              <Text style={styles.statLabel}>Total Donatur</Text>
              <Text style={styles.statSubtext}>174 Aktif</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: '#2ecc71' }]}>
              <Text style={styles.statNumber}>{stats.survey}</Text>
              <Text style={styles.statLabel}>Survey Pending</Text>
              <Text style={styles.statSubtext}>Perlu Review</Text>
            </View>
          </View>
        </View>

        {/* Main Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu Utama</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuCard} onPress={item.onPress}>
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={28} color="#fff" />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#bdc3c7" style={styles.chevron} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickSection}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
          <View style={styles.quickGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickButton} onPress={action.onPress}>
                <Ionicons name={action.icon} size={24} color="#3498db" />
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
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  statsSection: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16,
    borderLeftWidth: 4, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2,
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 4 },
  statSubtext: { fontSize: 12, color: '#999', marginTop: 2 },
  menuSection: { padding: 16, paddingTop: 0 },
  menuGrid: { gap: 12 },
  menuCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    flexDirection: 'row', alignItems: 'center', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2,
  },
  iconContainer: {
    width: 60, height: 60, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  menuSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  menuDescription: { fontSize: 12, color: '#999', marginTop: 4 },
  chevron: { marginLeft: 8 },
  quickSection: { padding: 16, paddingTop: 0, paddingBottom: 32 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickButton: {
    backgroundColor: '#fff', borderRadius: 8, padding: 12,
    alignItems: 'center', flex: 1, minWidth: '45%', elevation: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 1,
  },
  quickText: { fontSize: 12, color: '#333', marginTop: 4, textAlign: 'center' },
});

export default AdminCabangManagementMenuScreen;