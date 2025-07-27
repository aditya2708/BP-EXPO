import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import LoadingSpinner from '../../../common/components/LoadingSpinner';

// ✨ REFACTORED: Use unified entity hooks instead of individual slice
import { useEntityCRUD } from '../logic/entityHooks';

const AkademikMenuScreen = ({ navigation }) => {
  // ✨ REFACTORED: Use unified hook for kurikulum
  const {
    statistics,
    loading: isLoading,
    error,
    loadStatistics
  } = useEntityCRUD('kurikulum');

  useFocusEffect(
    useCallback(() => {
      loadStatistics();
    }, [])
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aktif': return '#27ae60';
      case 'draft': return '#f39c12';
      default: return '#7f8c8d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'aktif': return 'Aktif';
      case 'draft': return 'Draft';
      default: return 'Tidak Aktif';
    }
  };

  // ✨ UPDATED: Navigation calls to use AkademikEntity screen
  const handleCreateKurikulum = () => {
    navigation.navigate('AkademikEntity', { 
      entityType: 'kurikulum', 
      mode: 'create' 
    });
  };

  const handleViewAllKurikulum = () => {
    navigation.navigate('AkademikEntity', { 
      entityType: 'kurikulum', 
      mode: 'list' 
    });
  };

  const handleKurikulumPress = (kurikulum) => {
    navigation.navigate('AkademikEntity', { 
      entityType: 'kurikulum', 
      mode: 'detail', 
      itemId: kurikulum.id_kurikulum || kurikulum.id,
      item: kurikulum
    });
  };

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: '#3498db' }]}
        onPress={handleCreateKurikulum}
      >
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text style={styles.actionText}>Buat Kurikulum</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: '#27ae60' }]}
        onPress={handleViewAllKurikulum}
      >
        <Ionicons name="list-outline" size={24} color="white" />
        <Text style={styles.actionText}>Lihat Semua</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <Text style={styles.cardTitle}>Statistik Kurikulum</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#e8f5e8' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
          </View>
          <Text style={styles.statNumber}>{statistics?.kurikulum?.total_aktif || 0}</Text>
          <Text style={styles.statLabel}>Kurikulum Aktif</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#fff3cd' }]}>
            <Ionicons name="document-text" size={20} color="#f39c12" />
          </View>
          <Text style={styles.statNumber}>{statistics?.kurikulum?.total_draft || 0}</Text>
          <Text style={styles.statLabel}>Draft</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#e1f5fe' }]}>
            <Ionicons name="library" size={20} color="#3498db" />
          </View>
          <Text style={styles.statNumber}>{statistics?.materi?.total_assigned || 0}</Text>
          <Text style={styles.statLabel}>Materi Terpasang</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#fce4ec' }]}>
            <Ionicons name="school" size={20} color="#e91e63" />
          </View>
          <Text style={styles.statNumber}>{statistics?.jenjang?.total_covered || 0}</Text>
          <Text style={styles.statLabel}>Jenjang Tercakup</Text>
        </View>
      </View>
    </View>
  );

  const renderKurikulumItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.kurikulumItem}
      onPress={() => handleKurikulumPress(item)}
    >
      <View style={styles.kurikulumHeader}>
        <View style={styles.kurikulumInfo}>
          <Text style={styles.kurikulumName}>{item.nama_kurikulum}</Text>
          <Text style={styles.kurikulumJenjang}>{item.jenjang?.nama_jenjang || 'Semua Jenjang'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.kurikulumFooter}>
        <View style={styles.kurikulumMeta}>
          <Ionicons name="calendar-outline" size={12} color="#7f8c8d" />
          <Text style={styles.metaText}>{formatDate(item.created_at)}</Text>
        </View>
        <View style={styles.kurikulumMeta}>
          <Ionicons name="library-outline" size={12} color="#7f8c8d" />
          <Text style={styles.metaText}>{item.total_materi || 0} Materi</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecentKurikulum = () => (
    <View style={styles.recentSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Kurikulum Terbaru</Text>
        <TouchableOpacity onPress={handleViewAllKurikulum}>
          <Text style={styles.seeAllText}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>
      
      {statistics?.recent_kurikulum?.length > 0 ? (
        <FlatList
          data={statistics.recent_kurikulum}
          renderItem={renderKurikulumItem}
          keyExtractor={(item) => (item.id_kurikulum || item.id).toString()}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="library-outline" size={48} color="#bdc3c7" />
          <Text style={styles.emptyText}>Belum ada kurikulum</Text>
          <Text style={styles.emptySubtext}>Buat kurikulum pertama Anda</Text>
        </View>
      )}
    </View>
  );

  if (isLoading && (!statistics || statistics.kurikulum === undefined)) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error && (!statistics || statistics.kurikulum === undefined)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
          <Text style={styles.errorTitle}>Gagal memuat data</Text>
          <Text style={styles.errorMessage}>
            {typeof error === 'string' ? error : error?.message || 'Terjadi kesalahan saat memuat data'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadStatistics}>
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
          <Text style={styles.headerTitle}>Akademik</Text>
          <Text style={styles.headerSubtitle}>
            Kelola kurikulum dan sistem pembelajaran
          </Text>
        </View>

        {renderQuickActions()}
        {renderStatsCard()}
        {renderRecentKurikulum()}
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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'center',
  },
  recentSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  kurikulumItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  kurikulumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  kurikulumInfo: {
    flex: 1,
  },
  kurikulumName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  kurikulumJenjang: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  kurikulumFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kurikulumMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  separator: {
    height: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AkademikMenuScreen;