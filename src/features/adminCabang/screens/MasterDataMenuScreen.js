import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import MasterDataCard from '../components/masterData/MasterDataCard';

// ✨ REFACTORED: Use unified entity hooks instead of individual slices
import { useEntityCRUD } from '../logic/entityHooks';
import { navigateToEntity } from '../logic/entityHelpers';

const MasterDataMenuScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // ✨ REFACTORED: Use unified hooks for all entities
  const {
    statistics: jenjangStats,
    loading: jenjangLoading,
    error: jenjangError,
    loadStatistics: loadJenjangStats
  } = useEntityCRUD('jenjang');
  
  const {
    statistics: mataPelajaranStats,
    loading: mataPelajaranLoading,
    error: mataPelajaranError,
    loadStatistics: loadMataPelajaranStats
  } = useEntityCRUD('mataPelajaran');
  
  const {
    statistics: kelasStats,
    loading: kelasLoading,
    error: kelasError,
    loadStatistics: loadKelasStats
  } = useEntityCRUD('kelas');
  
  const {
    statistics: materiStats,
    loading: materiLoading,
    error: materiError,
    loadStatistics: loadMateriStats
  } = useEntityCRUD('materi');
  
  // Overall loading state
  const isLoading = jenjangLoading || mataPelajaranLoading || kelasLoading || materiLoading;

  useFocusEffect(
    React.useCallback(() => {
      loadStatistics();
    }, [])
  );

  const loadStatistics = async () => {
    try {
      await Promise.all([
        loadJenjangStats(),
        loadMataPelajaranStats(),
        loadKelasStats(),
        loadMateriStats()
      ]);
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  // ✨ REFACTORED: Update navigation to use Entity screen
  const handleJenjangPress = () => {
    navigateToEntity(navigation, 'jenjang', 'list');
  };

  const handleMataPelajaranPress = () => {
    navigateToEntity(navigation, 'mataPelajaran', 'list');
  };

  const handleKelasPress = () => {
    navigateToEntity(navigation, 'kelas', 'list');
  };

  const handleMateriPress = () => {
    navigateToEntity(navigation, 'materi', 'list');
  };

  const handleAddJenjang = () => {
    navigateToEntity(navigation, 'jenjang', 'create');
  };

  const handleAddMataPelajaran = () => {
    navigateToEntity(navigation, 'mataPelajaran', 'create');
  };

  const handleAddKelas = () => {
    navigateToEntity(navigation, 'kelas', 'create');
  };

  const handleAddMateri = () => {
    navigateToEntity(navigation, 'materi', 'create');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadStatistics}
            colors={['#3498db']}
            tintColor="#3498db"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Master Data</Text>
          <Text style={styles.subtitle}>Kelola data master sistem</Text>
        </View>

        <View style={styles.cardsContainer}>
          <MasterDataCard
            title="Jenjang"
            icon="school-outline"
            statistics={{
              total: jenjangStats?.data?.total_jenjang || 0,
              active: jenjangStats?.data?.total_jenjang_aktif || 0,
            }}
            loading={jenjangLoading}
            error={jenjangError}
            onPress={handleJenjangPress}
            onAddNew={handleAddJenjang}
            primaryColor="#3498db"
            testID="jenjang-card"
          />
          
          <MasterDataCard
            title="Mata Pelajaran"
            icon="book-outline"
            statistics={{
              total: mataPelajaranStats?.data?.total_mata_pelajaran || 0,
              active: mataPelajaranStats?.data?.total_mata_pelajaran_aktif || 0,
            }}
            loading={mataPelajaranLoading}
            error={mataPelajaranError}
            onPress={handleMataPelajaranPress}
            onAddNew={handleAddMataPelajaran}
            primaryColor="#27ae60"
            testID="mata-pelajaran-card"
          />
          
          <MasterDataCard
            title="Kelas"
            icon="library-outline"
            statistics={{
              total: kelasStats?.data?.total_kelas || 0,
              active: kelasStats?.data?.total_kelas_aktif || 0,
            }}
            loading={kelasLoading}
            error={kelasError}
            onPress={handleKelasPress}
            onAddNew={handleAddKelas}
            primaryColor="#f39c12"
            testID="kelas-card"
          />
          
          <MasterDataCard
            title="Materi"
            icon="document-text-outline"
            statistics={{
              total: materiStats?.data?.total_materi || 0,
              active: materiStats?.data?.total_materi_aktif || 0,
            }}
            loading={materiLoading}
            error={materiError}
            onPress={handleMateriPress}
            onAddNew={handleAddMateri}
            primaryColor="#e74c3c"
            testID="materi-card"
          />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan Master Data</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Jenjang Aktif:</Text>
            <Text style={styles.summaryValue}>{jenjangStats?.data?.total_jenjang_aktif || 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Mata Pelajaran:</Text>
            <Text style={styles.summaryValue}>{mataPelajaranStats?.data?.total_mata_pelajaran || 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Kelas Aktif:</Text>
            <Text style={styles.summaryValue}>{kelasStats?.data?.total_kelas_aktif || 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Materi:</Text>
            <Text style={styles.summaryValue}>{materiStats?.data?.total_materi || 0}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  cardsContainer: {
    padding: 15,
    gap: 15,
  },
  summaryCard: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    flex: 1,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
});

export default MasterDataMenuScreen;