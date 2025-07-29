import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../../common/components/ErrorMessage';
import ActionButton from '../../../components/shared/ActionButton';
import StatsCard from '../../../components/shared/StatsCard';
import { useMataPelajaran } from '../../../hooks/useMataPelajaran';

const MataPelajaranStatsScreen = () => {
  const navigation = useNavigation();
  const { fetchStatistics } = useMataPelajaran();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({ 
      headerTitle: 'Statistik Mata Pelajaran' 
    });
    loadStatistics();
  }, [navigation]);

  const loadStatistics = async () => {
    try {
      setError(null);
      if (!refreshing) setLoading(true);
      
      const result = await fetchStatistics();
      if (result.success) {
        setStatistics(result.data);
      } else {
        setError('Gagal memuat statistik mata pelajaran');
      }
    } catch (err) {
      console.error('Error loading statistics:', err);
      setError('Gagal memuat statistik mata pelajaran');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadStatistics();
  };

  const handleRetry = () => {
    setError(null);
    loadStatistics();
  };

  const handleAdd = () => {
    navigation.navigate('MataPelajaranForm', { mode: 'create' });
  };

  const safeValue = (value) => value || 0;
  const getPercentage = (value, total) => {
    if (!total || total === 0 || !value) return 0;
    return Math.round((value / total) * 100);
  };

  if (loading && !refreshing && !statistics) {
    return (
      <View style={styles.container}>
        <LoadingSpinner fullScreen message="Memuat statistik..." />
      </View>
    );
  }

  if (error && !statistics) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={handleRetry} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
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
        <View style={styles.actions}>
          <ActionButton
            title="Tambah Mata Pelajaran"
            icon="add"
            onPress={handleAdd}
            style={styles.addButton}
          />
        </View>

        {statistics && (
          <>
            {/* Overview */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overview</Text>
              
              <StatsCard
                title="Total Mata Pelajaran"
                value={safeValue(statistics.total_mata_pelajaran)}
                subtitle="Mata pelajaran terdaftar"
                icon="book-outline"
                iconColor="#007bff"
                loading={loading || refreshing}
              />

              <StatsCard
                title="Mata Pelajaran Aktif"
                value={safeValue(statistics.active_mata_pelajaran)}
                subtitle={`${getPercentage(statistics.active_mata_pelajaran, statistics.total_mata_pelajaran)}% dari total`}
                icon="checkmark-circle-outline"
                iconColor="#28a745"
                loading={loading || refreshing}
              />

              <StatsCard
                title="Mata Pelajaran Nonaktif"
                value={safeValue(statistics.inactive_mata_pelajaran)}
                subtitle={`${getPercentage(statistics.inactive_mata_pelajaran, statistics.total_mata_pelajaran)}% dari total`}
                icon="close-circle-outline"
                iconColor="#dc3545"
                loading={loading || refreshing}
              />
            </View>

            {/* By Kategori */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Berdasarkan Kategori</Text>
              
              {statistics.by_kategori && Object.entries(statistics.by_kategori).map(([kategori, count]) => {
                const kategoriLabels = {
                  'wajib': 'Mata Pelajaran Wajib',
                  'muatan_lokal': 'Muatan Lokal',
                  'pengembangan_diri': 'Pengembangan Diri',
                  'pilihan': 'Mata Pelajaran Pilihan',
                  'ekstrakurikuler': 'Ekstrakurikuler'
                };
                
                const kategoriColors = {
                  'wajib': '#007bff',
                  'muatan_lokal': '#28a745',
                  'pengembangan_diri': '#17a2b8',
                  'pilihan': '#ffc107',
                  'ekstrakurikuler': '#6f42c1'
                };

                return (
                  <StatsCard
                    key={kategori}
                    title={kategoriLabels[kategori] || kategori}
                    value={count}
                    subtitle={`${getPercentage(count, statistics.total_mata_pelajaran)}% dari total`}
                    icon="bookmark-outline"
                    iconColor={kategoriColors[kategori] || '#6c757d'}
                    loading={loading || refreshing}
                  />
                );
              })}
            </View>

            {/* By Jenjang */}
            {statistics.by_jenjang && statistics.by_jenjang.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Berdasarkan Jenjang</Text>
                
                {statistics.by_jenjang.map((item, index) => (
                  <StatsCard
                    key={index}
                    title={item.jenjang_name}
                    value={item.total}
                    subtitle={`${getPercentage(item.total, statistics.total_mata_pelajaran)}% dari total`}
                    icon="library-outline"
                    iconColor="#17a2b8"
                    loading={loading || refreshing}
                  />
                ))}
              </View>
            )}

            {/* Usage Statistics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Penggunaan</Text>
              
              <StatsCard
                title="Dengan Materi"
                value={safeValue(statistics.with_materi)}
                subtitle={`${getPercentage(statistics.with_materi, statistics.total_mata_pelajaran)}% memiliki materi`}
                icon="document-text-outline"
                iconColor="#28a745"
                loading={loading || refreshing}
              />

              <StatsCard
                title="Belum Ada Materi"
                value={safeValue(statistics.without_materi)}
                subtitle={`${getPercentage(statistics.without_materi, statistics.total_mata_pelajaran)}% belum memiliki materi`}
                icon="document-outline"
                iconColor="#ffc107"
                loading={loading || refreshing}
              />
            </View>

            {/* Health Score */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kesehatan Data</Text>
              
              <View style={styles.healthScoreCard}>
                <View style={styles.healthScoreHeader}>
                  <Text style={styles.healthScoreTitle}>Skor Kelengkapan</Text>
                  <Text style={styles.healthScoreValue}>
                    {getPercentage(statistics.with_materi, statistics.total_mata_pelajaran)}%
                  </Text>
                </View>
                
                <View style={styles.healthDetails}>
                  <View style={styles.healthItem}>
                    <View style={[
                      styles.healthIndicator, 
                      { backgroundColor: safeValue(statistics.with_materi) > 0 ? '#28a745' : '#dc3545' }
                    ]} />
                    <Text style={styles.healthItemText}>
                      {safeValue(statistics.with_materi) > 0 ? 'Ada mata pelajaran dengan materi' : 'Belum ada mata pelajaran dengan materi'}
                    </Text>
                  </View>
                  
                  <View style={styles.healthItem}>
                    <View style={[
                      styles.healthIndicator, 
                      { backgroundColor: safeValue(statistics.active_mata_pelajaran) > 0 ? '#28a745' : '#dc3545' }
                    ]} />
                    <Text style={styles.healthItemText}>
                      {safeValue(statistics.active_mata_pelajaran) > 0 ? 'Ada mata pelajaran aktif' : 'Belum ada mata pelajaran aktif'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
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
    flex: 1
  },
  contentContainer: {
    padding: 16
  },
  actions: {
    marginBottom: 20
  },
  addButton: {
    width: '100%'
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
  healthScoreCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  healthScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  healthScoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  healthScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff'
  },
  healthDetails: {
    marginTop: 8
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  healthIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  healthItemText: {
    fontSize: 14,
    color: '#666'
  }
});

export default MataPelajaranStatsScreen;