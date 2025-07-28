import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../../common/components/ErrorMessage';
import ActionButton from '../../../components/shared/ActionButton';
import JenjangStatsCards from '../../../components/specific/jenjang/JenjangStatsCards';
import { useJenjang } from '../../../hooks/useJenjang';

const JenjangStatsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, item } = route.params || {};
  
  const { fetchStatistics } = useJenjang();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set header title
    if (item) {
      navigation.setOptions({ 
        headerTitle: `Statistik ${item.nama_jenjang}` 
      });
    } else {
      navigation.setOptions({ 
        headerTitle: 'Statistik Jenjang' 
      });
    }
    
    loadStatistics();
  }, [item, navigation]);

  const loadStatistics = async () => {
    try {
      setError(null);
      if (!refreshing) setLoading(true);
      
      await fetchStatistics();
      
      // For now, we'll use simulated statistics
      // TODO: In future, we can add specific jenjang statistics by ID
      const statsData = await fetchJenjangStatistics();
      setStatistics(statsData);
      
    } catch (err) {
      console.error('Error loading statistics:', err);
      setError('Gagal memuat statistik jenjang');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchJenjangStatistics = async () => {
    // Simulate API call for jenjang statistics
    // In real implementation, this would call jenjangApi.getStatistics()
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve({
          total_jenjang: 5,
          total_jenjang_aktif: 4,
          total_with_kelas: 3,
          total_with_mata_pelajaran: 4,
          most_used_jenjang: {
            nama: 'Sekolah Dasar',
            kelas_count: 6
          }
        });
      }, 1000);
      
      // Cleanup timeout on unmount
      return () => clearTimeout(timeoutId);
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

  const handleAddJenjang = () => {
    navigation.navigate('JenjangForm', { mode: 'create' });
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
        {/* Action Buttons */}
        <View style={styles.actions}>
          <ActionButton
            title="Tambah Jenjang"
            icon="add"
            onPress={handleAddJenjang}
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

        {/* Statistics Cards */}
        <JenjangStatsCards 
          statistics={statistics} 
          loading={loading || refreshing}
        />

        {/* Additional Info */}
        {statistics && (
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoTitle}>Informasi</Text>
              </View>
              
              <View style={styles.infoContent}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Total Data:</Text>
                  <Text style={styles.infoValue}>{statistics.total_jenjang} jenjang</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Status Aktif:</Text>
                  <Text style={styles.infoValue}>
                    {statistics.total_jenjang_aktif}/{statistics.total_jenjang}
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Tingkat Penggunaan:</Text>
                  <Text style={styles.infoValue}>
                    {Math.round((statistics.total_with_kelas / statistics.total_jenjang) * 100)}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
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
  infoSection: {
    marginTop: 16
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  infoHeader: {
    marginBottom: 12
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  infoContent: {
    gap: 12
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoLabel: {
    fontSize: 14,
    color: '#666'
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  }
});

export default JenjangStatsScreen;