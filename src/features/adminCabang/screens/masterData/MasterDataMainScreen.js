// src/features/adminCabang/screens/MasterDataMain.js
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  SafeAreaView, Alert, RefreshControl, Dimensions
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useStoreSelectors } from '../../stores';
import { ENTITIES } from '../../stores/masterDataStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * MasterDataMainScreen - Updated dengan Zustand integration
 * Real-time statistics, cache management, dan full system integration
 */
const MasterDataMainScreen = () => {
  const navigation = useNavigation();
  
  // ==================== ZUSTAND STORES ====================
  const masterDataActions = useStoreSelectors.masterData.actions();
  const uiActions = useStoreSelectors.ui.actions();
  const cacheActions = useStoreSelectors.cache.actions();
  
  // Entity data
  const jenjangData = useStoreSelectors.masterData.entitiesArray(ENTITIES.JENJANG);
  const mataPelajaranData = useStoreSelectors.masterData.entitiesArray(ENTITIES.MATA_PELAJARAN);
  const kelasData = useStoreSelectors.masterData.entitiesArray(ENTITIES.KELAS);
  const materiData = useStoreSelectors.masterData.entitiesArray(ENTITIES.MATERI);
  
  // Loading states
  const jenjangLoading = useStoreSelectors.ui.loading(ENTITIES.JENJANG);
  const mataPelajaranLoading = useStoreSelectors.ui.loading(ENTITIES.MATA_PELAJARAN);
  const kelasLoading = useStoreSelectors.ui.loading(ENTITIES.KELAS);
  const materiLoading = useStoreSelectors.ui.loading(ENTITIES.MATERI);
  
  // Error states
  const jenjangError = useStoreSelectors.ui.error(ENTITIES.JENJANG);
  const mataPelajaranError = useStoreSelectors.ui.error(ENTITIES.MATA_PELAJARAN);
  const kelasError = useStoreSelectors.ui.error(ENTITIES.KELAS);
  const materiError = useStoreSelectors.ui.error(ENTITIES.MATERI);
  
  // Cache statistics
  const cacheStats = useStoreSelectors.cache.stats();
  const cacheHitRatio = useStoreSelectors.cache.hitRatio();
  
  // ==================== LOCAL STATE ====================
  const [refreshing, setRefreshing] = useState(false);
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  
  // ==================== COMPUTED VALUES ====================
  
  // Overall loading state
  const isLoading = jenjangLoading || mataPelajaranLoading || kelasLoading || materiLoading;
  const hasErrors = jenjangError || mataPelajaranError || kelasError || materiError;
  
  // Real-time statistics
  const statistics = useMemo(() => ({
    jenjang: {
      total: jenjangData.length,
      aktif: jenjangData.filter(item => item.is_active !== false).length,
      tidak_aktif: jenjangData.filter(item => item.is_active === false).length,
      dengan_mp: jenjangData.filter(item => (item.mata_pelajaran_count || 0) > 0).length,
      dengan_kelas: jenjangData.filter(item => (item.kelas_count || 0) > 0).length
    },
    mataPelajaran: {
      total: mataPelajaranData.length,
      aktif: mataPelajaranData.filter(item => item.is_active !== false).length,
      tidak_aktif: mataPelajaranData.filter(item => item.is_active === false).length,
      wajib: mataPelajaranData.filter(item => item.kategori === 'wajib').length,
      pilihan: mataPelajaranData.filter(item => item.kategori === 'pilihan').length,
      ekstrakurikuler: mataPelajaranData.filter(item => item.kategori === 'ekstrakurikuler').length,
      dengan_materi: mataPelajaranData.filter(item => (item.materi_count || 0) > 0).length
    },
    kelas: {
      total: kelasData.length,
      aktif: kelasData.filter(item => item.is_active !== false).length,
      tidak_aktif: kelasData.filter(item => item.is_active === false).length,
      standard: kelasData.filter(item => item.jenis_kelas === 'standard').length,
      custom: kelasData.filter(item => item.jenis_kelas === 'custom').length,
      dengan_materi: kelasData.filter(item => (item.materi_count || 0) > 0).length
    },
    materi: {
      total: materiData.length,
      aktif: materiData.filter(item => item.is_active !== false).length,
      tidak_aktif: materiData.filter(item => item.is_active === false).length,
      dengan_file: materiData.filter(item => (item.files_count || 0) > 0).length,
      tanpa_file: materiData.filter(item => (item.files_count || 0) === 0).length,
      belum_digunakan: materiData.filter(item => (item.usage_count || 0) === 0).length,
      populer: materiData.filter(item => (item.usage_count || 0) >= 5).length,
      di_kurikulum: materiData.filter(item => (item.kurikulum_count || 0) > 0).length
    }
  }), [jenjangData, mataPelajaranData, kelasData, materiData]);
  
  // System health score
  const systemHealth = useMemo(() => {
    const totalEntities = statistics.jenjang.total + statistics.mataPelajaran.total + 
                         statistics.kelas.total + statistics.materi.total;
    
    if (totalEntities === 0) return 0;
    
    const activeEntities = statistics.jenjang.aktif + statistics.mataPelajaran.aktif + 
                          statistics.kelas.aktif + statistics.materi.aktif;
    
    const healthScore = (activeEntities / totalEntities) * 100;
    const cacheScore = cacheHitRatio * 100;
    const errorScore = hasErrors ? 0 : 100;
    
    return Math.round((healthScore + cacheScore + errorScore) / 3);
  }, [statistics, cacheHitRatio, hasErrors]);
  
  // Menu items configuration
  const menuItems = useMemo(() => [
    {
      id: 'jenjang',
      title: 'Jenjang',
      description: 'Kelola data jenjang pendidikan',
      icon: 'library-outline',
      color: '#3B82F6',
      route: 'JenjangList',
      formRoute: 'JenjangForm',
      statsRoute: 'JenjangStats',
      stats: statistics.jenjang,
      loading: jenjangLoading,
      error: jenjangError,
      available: true
    },
    {
      id: 'mata_pelajaran',
      title: 'Mata Pelajaran',
      description: 'Kelola data mata pelajaran',
      icon: 'book-outline',
      color: '#10B981',
      route: 'MataPelajaranList',
      formRoute: 'MataPelajaranForm',
      statsRoute: 'MataPelajaranStats',
      stats: statistics.mataPelajaran,
      loading: mataPelajaranLoading,
      error: mataPelajaranError,
      available: true
    },
    {
      id: 'kelas',
      title: 'Kelas',
      description: 'Kelola data kelas',
      icon: 'people-outline',
      color: '#F59E0B',
      route: 'KelasList',
      formRoute: 'KelasForm',
      statsRoute: 'KelasStats',
      stats: statistics.kelas,
      loading: kelasLoading,
      error: kelasError,
      available: true
    },
    {
      id: 'materi',
      title: 'Materi',
      description: 'Kelola data materi pembelajaran',
      icon: 'document-text-outline',
      color: '#06B6D4',
      route: 'MateriList',
      formRoute: 'MateriForm',
      statsRoute: 'MateriStats',
      stats: statistics.materi,
      loading: materiLoading,
      error: materiError,
      available: true
    },
    {
      id: 'kurikulum',
      title: 'Kurikulum',
      description: 'Kelola kurikulum dan silabus',
      icon: 'layers-outline',
      color: '#8B5CF6',
      route: 'KurikulumList',
      formRoute: 'KurikulumForm',
      statsRoute: 'KurikulumStats',
      stats: { total: 0, aktif: 0 },
      loading: false,
      error: null,
      available: false, // Future implementation
      comingSoon: true
    }
  ], [statistics, jenjangLoading, mataPelajaranLoading, kelasLoading, materiLoading, 
      jenjangError, mataPelajaranError, kelasError, materiError]);
  
  // ==================== EFFECTS ====================
  
  // Load all data when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadAllData();
    }, [])
  );
  
  // ==================== HANDLERS ====================
  
  const loadAllData = useCallback(async () => {
    try {
      await Promise.allSettled([
        masterDataActions.load(ENTITIES.JENJANG),
        masterDataActions.load(ENTITIES.MATA_PELAJARAN),
        masterDataActions.load(ENTITIES.KELAS),
        masterDataActions.load(ENTITIES.MATERI)
      ]);
    } catch (err) {
      console.error('Error loading master data:', err);
    }
  }, [masterDataActions]);
  
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.allSettled([
        masterDataActions.refresh(ENTITIES.JENJANG),
        masterDataActions.refresh(ENTITIES.MATA_PELAJARAN),
        masterDataActions.refresh(ENTITIES.KELAS),
        masterDataActions.refresh(ENTITIES.MATERI)
      ]);
      
      // Clear all caches for fresh data
      await cacheActions.clearAll();
      
      uiActions.setSuccess('Data berhasil diperbarui', 'refresh');
    } catch (err) {
      uiActions.setError('SYSTEM', err.message || 'Gagal memperbarui data');
    } finally {
      setRefreshing(false);
    }
  }, [masterDataActions, cacheActions, uiActions]);
  
  const handleMenuPress = useCallback((item) => {
    if (!item.available) {
      if (item.comingSoon) {
        Alert.alert(
          'Segera Hadir',
          `Fitur ${item.title} akan segera tersedia di update mendatang.`,
          [{ text: 'OK' }]
        );
      }
      return;
    }
    
    navigation.navigate(item.route);
  }, [navigation]);
  
  const handleQuickAdd = useCallback((item) => {
    if (!item.available) return;
    
    navigation.navigate(item.formRoute, { mode: 'create' });
  }, [navigation]);
  
  const handleStatsPress = useCallback((item) => {
    if (!item.available) return;
    
    navigation.navigate(item.statsRoute);
  }, [navigation]);
  
  const handleClearCache = useCallback(async () => {
    Alert.alert(
      'Bersihkan Cache',
      'Ini akan menghapus semua cache dan memuat ulang data. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Bersihkan',
          style: 'destructive',
          onPress: async () => {
            try {
              await cacheActions.clearAll();
              await loadAllData();
              uiActions.setSuccess('Cache berhasil dibersihkan', 'cache');
            } catch (err) {
              uiActions.setError('SYSTEM', 'Gagal membersihkan cache');
            }
          }
        }
      ]
    );
  }, [cacheActions, loadAllData, uiActions]);
  
  // ==================== RENDER HELPERS ====================
  
  const renderSystemHealth = useCallback(() => {
    const getHealthColor = (score) => {
      if (score >= 80) return '#10B981';
      if (score >= 60) return '#F59E0B';
      return '#EF4444';
    };
    
    const getHealthIcon = (score) => {
      if (score >= 80) return 'checkmark-circle';
      if (score >= 60) return 'warning';
      return 'alert-circle';
    };
    
    return (
      <TouchableOpacity 
        style={styles.healthCard}
        onPress={() => setShowSystemInfo(!showSystemInfo)}
      >
        <View style={styles.healthHeader}>
          <Ionicons 
            name={getHealthIcon(systemHealth)} 
            size={24} 
            color={getHealthColor(systemHealth)} 
          />
          <Text style={styles.healthTitle}>System Health</Text>
          <Text style={[styles.healthScore, { color: getHealthColor(systemHealth) }]}>
            {systemHealth}%
          </Text>
        </View>
        
        {showSystemInfo && (
          <View style={styles.systemInfo}>
            <View style={styles.systemInfoRow}>
              <Text style={styles.systemInfoLabel}>Cache Hit Ratio:</Text>
              <Text style={styles.systemInfoValue}>{Math.round(cacheHitRatio * 100)}%</Text>
            </View>
            <View style={styles.systemInfoRow}>
              <Text style={styles.systemInfoLabel}>Total Entities:</Text>
              <Text style={styles.systemInfoValue}>
                {statistics.jenjang.total + statistics.mataPelajaran.total + 
                 statistics.kelas.total + statistics.materi.total}
              </Text>
            </View>
            <View style={styles.systemInfoRow}>
              <Text style={styles.systemInfoLabel}>Active Entities:</Text>
              <Text style={styles.systemInfoValue}>
                {statistics.jenjang.aktif + statistics.mataPelajaran.aktif + 
                 statistics.kelas.aktif + statistics.materi.aktif}
              </Text>
            </View>
            <TouchableOpacity style={styles.clearCacheButton} onPress={handleClearCache}>
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
              <Text style={styles.clearCacheText}>Clear Cache</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [systemHealth, showSystemInfo, cacheHitRatio, statistics, handleClearCache]);
  
  const renderMenuItem = useCallback((item) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.menuItem,
        !item.available && styles.menuItemDisabled,
        item.error && styles.menuItemError
      ]}
      onPress={() => handleMenuPress(item)}
      activeOpacity={item.available ? 0.7 : 1}
    >
      <View style={styles.menuItemContent}>
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
          <Ionicons 
            name={item.loading ? 'sync' : item.icon} 
            size={28} 
            color={item.available ? item.color : '#9CA3AF'}
          />
          {item.loading && <View style={styles.loadingOverlay} />}
        </View>
        
        <View style={styles.menuItemInfo}>
          <View style={styles.menuItemHeader}>
            <Text style={[
              styles.menuItemTitle,
              !item.available && styles.menuItemTitleDisabled
            ]}>
              {item.title}
            </Text>
            
            {item.comingSoon && (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Soon</Text>
              </View>
            )}
            
            {item.error && (
              <Ionicons name="warning" size={16} color="#EF4444" />
            )}
          </View>
          
          <Text style={[
            styles.menuItemDescription,
            !item.available && styles.menuItemDescriptionDisabled
          ]}>
            {item.description}
          </Text>
          
          {item.available && (
            <View style={styles.statsRow}>
              <Text style={styles.statsText}>
                Total: {item.stats.total} | Aktif: {item.stats.aktif}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {item.available && (
        <View style={styles.menuItemActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleQuickAdd(item)}
          >
            <Ionicons name="add" size={20} color={item.color} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleStatsPress(item)}
          >
            <Ionicons name="stats-chart-outline" size={20} color={item.color} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  ), [handleMenuPress, handleQuickAdd, handleStatsPress]);
  
  const renderQuickStats = useCallback(() => (
    <View style={styles.quickStatsContainer}>
      <Text style={styles.sectionTitle}>Ringkasan Data</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickStatsScroll}
      >
        {menuItems.filter(item => item.available).map(item => (
          <TouchableOpacity
            key={`stats-${item.id}`}
            style={[styles.quickStatCard, { borderColor: item.color }]}
            onPress={() => handleStatsPress(item)}
          >
            <Ionicons name={item.icon} size={20} color={item.color} />
            <Text style={styles.quickStatNumber}>{item.stats.total}</Text>
            <Text style={styles.quickStatLabel}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  ), [menuItems, handleStatsPress]);
  
  // ==================== RENDER ====================
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Master Data</Text>
          <Text style={styles.headerSubtitle}>
            Kelola semua data master sistem pembelajaran
          </Text>
        </View>
        
        {/* System Health */}
        {renderSystemHealth()}
        
        {/* Quick Stats */}
        {renderQuickStats()}
        
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Menu Utama</Text>
          {menuItems.map(renderMenuItem)}
        </View>
        
        {/* Hierarchy Guide */}
        <View style={styles.guideSection}>
          <View style={styles.guideCard}>
            <Ionicons name="information-circle-outline" size={24} color="#3B82F6" />
            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>Urutan Penggunaan</Text>
              <Text style={styles.guideText}>
                1. <Text style={styles.guideHighlight}>Jenjang</Text> - Buat jenjang pendidikan terlebih dahulu{'\n'}
                2. <Text style={styles.guideHighlight}>Mata Pelajaran</Text> - Tambahkan mata pelajaran per jenjang{'\n'}
                3. <Text style={styles.guideHighlight}>Kelas</Text> - Buat kelas untuk setiap jenjang{'\n'}
                4. <Text style={styles.guideHighlight}>Materi</Text> - Tambahkan materi per mata pelajaran dan kelas{'\n'}
                5. <Text style={styles.guideHighlight}>Kurikulum</Text> - Susun kurikulum dari materi yang ada
              </Text>
            </View>
          </View>
        </View>
        
        {/* Performance Info */}
        {__DEV__ && (
          <View style={styles.devSection}>
            <Text style={styles.devTitle}>Development Info</Text>
            <Text style={styles.devText}>
              Cache Hit Ratio: {Math.round(cacheHitRatio * 100)}%{'\n'}
              Loading States: J:{jenjangLoading ? '✓' : '✗'} MP:{mataPelajaranLoading ? '✓' : '✗'} K:{kelasLoading ? '✓' : '✗'} M:{materiLoading ? '✓' : '✗'}{'\n'}
              Errors: {hasErrors ? 'YES' : 'NO'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  content: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 24
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280'
  },
  healthCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginLeft: 8
  },
  healthScore: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  systemInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  systemInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  systemInfoLabel: {
    fontSize: 14,
    color: '#6B7280'
  },
  systemInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827'
  },
  clearCacheButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4
  },
  clearCacheText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 4
  },
  quickStatsContainer: {
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    paddingHorizontal: 20
  },
  quickStatsScroll: {
    paddingHorizontal: 20,
    gap: 12
  },
  quickStatCard: {
    width: 100,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 6
  },
  quickStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827'
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center'
  },
  menuContainer: {
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 8
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  menuItemDisabled: {
    opacity: 0.6
  },
  menuItemError: {
    backgroundColor: '#FEF2F2'
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12
  },
  menuItemInfo: {
    flex: 1
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1
  },
  menuItemTitleDisabled: {
    color: '#9CA3AF'
  },
  comingSoonBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8
  },
  comingSoonText: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '600'
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8
  },
  menuItemDescriptionDisabled: {
    color: '#D1D5DB'
  },
  statsRow: {
    flexDirection: 'row'
  },
  statsText: {
    fontSize: 12,
    color: '#9CA3AF'
  },
  menuItemActions: {
    flexDirection: 'row',
    gap: 8
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  guideSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 8
  },
  guideCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6'
  },
  guideContent: {
    flex: 1,
    marginLeft: 12
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8
  },
  guideText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20
  },
  guideHighlight: {
    fontWeight: '600'
  },
  devSection: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#1F2937',
    borderRadius: 8
  },
  devTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 8
  },
  devText: {
    fontSize: 12,
    color: '#D1D5DB',
    fontFamily: 'monospace'
  }
});

export default MasterDataMainScreen;