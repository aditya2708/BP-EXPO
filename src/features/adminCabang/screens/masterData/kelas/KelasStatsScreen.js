import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../../common/components/ErrorMessage';
import ActionButton from '../../../components/shared/ActionButton';
import StatsCard from '../../../components/shared/StatsCard';
import { useKelas } from '../../../hooks/useKelas';

const KelasStatsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, item } = route.params || {};
  
  const { fetchStatistics } = useKelas();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (item) {
      navigation.setOptions({ 
        headerTitle: `Statistik ${item.nama_kelas || `Tingkat ${item.tingkat}`}` 
      });
    } else {
      navigation.setOptions({ 
        headerTitle: 'Statistik Kelas' 
      });
    }
    
    loadStatistics();
  }, [item, navigation]);

  const loadStatistics = async () => {
    try {
      setError(null);
      if (!refreshing) setLoading(true);
      
      await fetchStatistics();
      
      // Simulate fetching kelas statistics
      const statsData = await fetchKelasStatistics();
      setStatistics(statsData);
      
    } catch (err) {
      console.error('Error loading statistics:', err);
      setError('Gagal memuat statistik kelas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchKelasStatistics = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          total_kelas: 12,
          total_kelas_aktif: 10,
          by_jenis: {
            standard: 8,
            custom: 4
          },
          by_jenjang: [
            { jenjang_name: 'Sekolah Dasar', total: 6 },
            { jenjang_name: 'Sekolah Menengah Pertama', total: 3 },
            { jenjang_name: 'Sekolah Menengah Atas', total: 3 }
          ],
          with_materi: 8,
          without_materi: 4,
          most_used_jenjang: {
            nama: 'Sekolah Dasar',
            kelas_count: 6
          }
        });
      }, 1000);
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadStatistics();
  };

  const handleRetry = () => {
    setError(null);
    loadStatistics();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export statistics');
  };

  const handleAddKelas = () => {
    navigation.navigate('KelasForm', { mode: 'create' });
  };

  const getPercentage = (value, total) => {
    if (!total || total === 0 || !value) return 0;
    return Math.round((value / total) * 100);
  };

  const safeValue = (value) => value || 0;

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
        {/* Action Buttons */}
        <View style={styles.actions}>
          <ActionButton
            title="Tambah Kelas"
            icon="add"
            onPress={handleAddKelas}
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

        {/* Overview Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          
          <StatsCard
            title="Total Kelas"
            value={safeValue(statistics?.total_kelas)}
            subtitle="Kelas yang terdaftar"
            icon="library-outline"
            iconColor="#007bff"
            loading={loading}
          />

          <StatsCard
            title="Kelas Aktif"
            value={safeValue(statistics?.total_kelas_aktif)}
            subtitle={`${getPercentage(statistics?.total_kelas_aktif, statistics?.total_kelas)}% dari total`}
            icon="checkmark-circle-outline"
            iconColor="#28a745"
            loading={loading}
          />
        </View>

        {/* Type Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Berdasarkan Jenis</Text>
          
          <View style={styles.typeStatsContainer}>
            <StatsCard
              title="Standard"
              value={safeValue(statistics?.by_jenis?.standard)}
              subtitle={`${getPercentage(statistics?.by_jenis?.standard, statistics?.total_kelas)}% dari total`}
              icon="library-outline"
              iconColor="#007bff"
              loading={loading}
              style={styles.typeStatCard}
            />
            
            <StatsCard
              title="Custom"
              value={safeValue(statistics?.by_jenis?.custom)}
              subtitle={`${getPercentage(statistics?.by_jenis?.custom, statistics?.total_kelas)}% dari total`}
              icon="create-outline"
              iconColor="#28a745"
              loading={loading}
              style={styles.typeStatCard}
            />
          </View>
        </View>

        {/* Usage Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Penggunaan Materi</Text>
          
          <StatsCard
            title="Dengan Materi"
            value={safeValue(statistics?.with_materi)}
            subtitle={`${getPercentage(statistics?.with_materi, statistics?.total_kelas)}% memiliki materi`}
            icon="document-text-outline"
            iconColor="#28a745"
            loading={loading}
          />

          <StatsCard
            title="Tanpa Materi"
            value={safeValue(statistics?.without_materi)}
            subtitle={`${getPercentage(statistics?.without_materi, statistics?.total_kelas)}% belum ada materi`}
            icon="document-outline"
            iconColor="#ffc107"
            loading={loading}
          />
        </View>

        {/* Jenjang Distribution */}
        {statistics?.by_jenjang && statistics.by_jenjang.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distribusi per Jenjang</Text>
            
            {statistics.by_jenjang.map((item, index) => (
              <StatsCard
                key={index}
                title={item.jenjang_name}
                value={item.total}
                subtitle={`${getPercentage(item.total, statistics.total_kelas)}% dari total`}
                icon="library-outline"
                iconColor="#17a2b8"
                loading={loading}
              />
            ))}
          </View>
        )}

        {/* Top Performance */}
        {statistics?.most_used_jenjang && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Jenjang Terbanyak</Text>
            
            <View style={styles.topJenjangCard}>
              <View style={styles.topJenjangHeader}>
                <View style={styles.topJenjangIcon}>
                  <Text style={styles.topJenjangIconText}>🏆</Text>
                </View>
                <View style={styles.topJenjangContent}>
                  <Text style={styles.topJenjangName}>
                    {statistics.most_used_jenjang.nama}
                  </Text>
                  <Text style={styles.topJenjangCount}>
                    {statistics.most_used_jenjang.kelas_count} kelas terdaftar
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Health Score */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kesehatan Data</Text>
          
          <View style={styles.healthScoreCard}>
            <View style={styles.healthScoreHeader}>
              <Text style={styles.healthScoreTitle}>Skor Kelengkapan</Text>
              <Text style={styles.healthScoreValue}>
                {Math.round((safeValue(statistics?.with_materi) / safeValue(statistics?.total_kelas)) * 100)}%
              </Text>
            </View>
            
            <View style={styles.healthDetails}>
              <View style={styles.healthItem}>
                <View style={[
                  styles.healthIndicator, 
                  { backgroundColor: safeValue(statistics?.with_materi) > 0 ? '#28a745' : '#dc3545' }
                ]} />
                <Text style={styles.healthItemText}>
                  {safeValue(statistics?.with_materi) > 0 ? 'Ada kelas dengan materi' : 'Belum ada kelas dengan materi'}
                </Text>
              </View>
              
              <View style={styles.healthItem}>
                <View style={[
                  styles.healthIndicator, 
                  { backgroundColor: safeValue(statistics?.total_kelas_aktif) > 0 ? '#28a745' : '#dc3545' }
                ]} />
                <Text style={styles.healthItemText}>
                  {safeValue(statistics?.total_kelas_aktif) > 0 ? 'Ada kelas aktif' : 'Belum ada kelas aktif'}
                </Text>
              </View>
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
    flex: 1
  },
  contentContainer: {
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
  typeStatsContainer: {
    flexDirection: 'row',
    gap: 8
  },
  typeStatCard: {
    flex: 1
  },
  topJenjangCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  topJenjangHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  topJenjangIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff3cd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  topJenjangIconText: {
    fontSize: 24
  },
  topJenjangContent: {
    flex: 1
  },
  topJenjangName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  topJenjangCount: {
    fontSize: 14,
    color: '#856404'
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

export default KelasStatsScreen;