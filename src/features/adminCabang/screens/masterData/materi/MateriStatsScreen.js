import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../../common/components/ErrorMessage';
import ActionButton from '../../../components/shared/ActionButton';
import StatsCard from '../../../components/shared/StatsCard';
import { useMateri } from '../../../hooks/useMateri';
import { useStatistics } from '../../../hooks/useStatistics';

const MateriStatsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, item } = route.params || {};
  
  const { fetchStatistics } = useMateri();
  const { materiStats, loading, refreshing, error, handleRefresh } = useStatistics('materi');
  
  useEffect(() => {
    navigation.setOptions({ 
      headerTitle: item ? `Statistik ${item.nama_materi}` : 'Statistik Materi'
    });
  }, [item, navigation]);

  const handleExport = () => {
    console.log('Export materi statistics');
  };

  const handleAddMateri = () => {
    navigation.navigate('MateriForm', { mode: 'create' });
  };

  if (loading && !refreshing && !materiStats) {
    return (
      <View style={styles.container}>
        <LoadingSpinner fullScreen message="Memuat statistik..." />
      </View>
    );
  }

  if (error && !materiStats) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={handleRefresh} />
      </View>
    );
  }

  const stats = materiStats || {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007bff']}
            tintColor="#007bff"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Action Buttons */}
        <View style={styles.actions}>
          <ActionButton
            title="Tambah Materi"
            icon="add"
            onPress={handleAddMateri}
            style={styles.addButton}
          />
          
          <ActionButton
            title="Export"
            icon="download-outline"
            variant="outline"
            onPress={handleExport}
            style={styles.exportButton}
          />
        </View>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          
          <StatsCard
            title="Total Materi"
            value={stats.total_materi || 0}
            subtitle="Materi terdaftar"
            icon="document-text-outline"
            iconColor="#007bff"
            loading={loading}
          />

          <StatsCard
            title="Digunakan Kurikulum"
            value={stats.used_in_kurikulum || 0}
            subtitle={`${Math.round(((stats.used_in_kurikulum || 0) / (stats.total_materi || 1)) * 100)}% dari total`}
            icon="checkmark-circle-outline"
            iconColor="#28a745"
            loading={loading}
          />

          <StatsCard
            title="Belum Digunakan"
            value={stats.not_used_in_kurikulum || 0}
            subtitle="Perlu optimasi"
            icon="alert-circle-outline"
            iconColor="#ffc107"
            loading={loading}
          />
        </View>

        {/* Distribution by Mata Pelajaran */}
        {stats.by_mata_pelajaran && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distribusi Mata Pelajaran</Text>
            {Object.entries(stats.by_mata_pelajaran).map(([mapel, count], index) => (
              <StatsCard
                key={index}
                title={mapel}
                value={count}
                subtitle="materi"
                icon="book-outline"
                iconColor="#17a2b8"
                loading={loading}
              />
            ))}
          </View>
        )}

        {/* Distribution by Kelas */}
        {stats.by_kelas && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distribusi Kelas</Text>
            {Object.entries(stats.by_kelas).slice(0, 5).map(([kelas, count], index) => (
              <StatsCard
                key={index}
                title={kelas}
                value={count}
                subtitle="materi"
                icon="people-outline"
                iconColor="#6f42c1"
                loading={loading}
              />
            ))}
          </View>
        )}

        {/* Usage Analytics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analitik Penggunaan</Text>
          
          <View style={styles.analyticsCard}>
            <View style={styles.analyticsHeader}>
              <Text style={styles.analyticsTitle}>Tingkat Penggunaan</Text>
              <Text style={styles.analyticsValue}>
                {stats.usage_percentage || 0}%
              </Text>
            </View>
            
            <View style={styles.analyticsDetails}>
              <View style={styles.analyticsItem}>
                <View style={[
                  styles.analyticsIndicator, 
                  { backgroundColor: '#28a745' }
                ]} />
                <Text style={styles.analyticsItemText}>
                  {stats.used_in_kurikulum || 0} materi aktif digunakan
                </Text>
              </View>
              
              <View style={styles.analyticsItem}>
                <View style={[
                  styles.analyticsIndicator, 
                  { backgroundColor: '#ffc107' }
                ]} />
                <Text style={styles.analyticsItemText}>
                  {stats.not_used_in_kurikulum || 0} materi belum dioptimalkan
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekomendasi</Text>
          
          <View style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <Ionicons name="bulb-outline" size={24} color="#ffc107" />
              <Text style={styles.recommendationTitle}>Optimasi</Text>
            </View>
            
            <View style={styles.recommendationContent}>
              {stats.not_used_in_kurikulum > 0 && (
                <Text style={styles.recommendationText}>
                  • Review {stats.not_used_in_kurikulum} materi yang belum digunakan
                </Text>
              )}
              
              {stats.usage_percentage < 50 && (
                <Text style={styles.recommendationText}>
                  • Tingkatkan penggunaan materi dalam kurikulum
                </Text>
              )}
              
              {stats.total_materi > 100 && (
                <Text style={styles.recommendationText}>
                  • Pertimbangkan kategorisasi materi untuk kemudahan pengelolaan
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  content: {
    flex: 1,
    padding: 16
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12
  },
  addButton: {
    flex: 1
  },
  exportButton: {
    flex: 1
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  analyticsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff'
  },
  analyticsDetails: {
    gap: 8
  },
  analyticsItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  analyticsIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  analyticsItemText: {
    fontSize: 14,
    color: '#666'
  },
  recommendationCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginLeft: 8
  },
  recommendationContent: {
    gap: 4
  },
  recommendationText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20
  }
});

export default MateriStatsScreen;