import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AkademikMenuScreen = ({ navigation }) => {
  const kurikulumStats = {
    totalKurikulum: 8,
    activeKurikulum: 6,
    draftKurikulum: 2,
    totalMateri: 124,
  };

  const recentKurikulum = [
    {
      id: '1',
      nama: 'Kurikulum SD Semester 1',
      jenjang: 'SD',
      status: 'active',
      materiCount: 15,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      nama: 'Kurikulum SMP IPA',
      jenjang: 'SMP',
      status: 'draft',
      materiCount: 8,
      createdAt: '2024-01-12',
    },
    {
      id: '3',
      nama: 'Kurikulum SMA Bahasa',
      jenjang: 'SMA',
      status: 'active',
      materiCount: 22,
      createdAt: '2024-01-10',
    },
  ];

  const handleCreateKurikulum = () => {
    // TODO: Navigate to kurikulum form
    console.log('Navigate to create kurikulum');
  };

  const handleViewAllKurikulum = () => {
    // TODO: Navigate to kurikulum list
    console.log('Navigate to kurikulum list');
  };

  const handleKurikulumPress = (kurikulum) => {
    // TODO: Navigate to kurikulum detail
    console.log(`Navigate to kurikulum ${kurikulum.nama}`);
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity
        style={styles.primaryActionButton}
        onPress={handleCreateKurikulum}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.primaryActionText}>Buat Kurikulum Baru</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryActionButton}
        onPress={handleViewAllKurikulum}
        activeOpacity={0.8}
      >
        <Ionicons name="list" size={20} color="#3498db" />
        <Text style={styles.secondaryActionText}>Lihat Semua Kurikulum</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>Statistik Kurikulum</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#3498db' }]}>
            <Ionicons name="library" size={20} color="white" />
          </View>
          <Text style={styles.statNumber}>{kurikulumStats.totalKurikulum}</Text>
          <Text style={styles.statLabel}>Total Kurikulum</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#27ae60' }]}>
            <Ionicons name="checkmark-circle" size={20} color="white" />
          </View>
          <Text style={[styles.statNumber, { color: '#27ae60' }]}>
            {kurikulumStats.activeKurikulum}
          </Text>
          <Text style={styles.statLabel}>Aktif</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#f39c12' }]}>
            <Ionicons name="create" size={20} color="white" />
          </View>
          <Text style={[styles.statNumber, { color: '#f39c12' }]}>
            {kurikulumStats.draftKurikulum}
          </Text>
          <Text style={styles.statLabel}>Draft</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#e74c3c' }]}>
            <Ionicons name="document-text" size={20} color="white" />
          </View>
          <Text style={[styles.statNumber, { color: '#e74c3c' }]}>
            {kurikulumStats.totalMateri}
          </Text>
          <Text style={styles.statLabel}>Total Materi</Text>
        </View>
      </View>
    </View>
  );

  const renderKurikulumItem = ({ item }) => (
    <TouchableOpacity
      style={styles.kurikulumItem}
      onPress={() => handleKurikulumPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.kurikulumHeader}>
        <View style={styles.kurikulumInfo}>
          <Text style={styles.kurikulumName}>{item.nama}</Text>
          <Text style={styles.kurikulumJenjang}>{item.jenjang}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'active' ? '#27ae60' : '#f39c12' }
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'active' ? 'Aktif' : 'Draft'}
          </Text>
        </View>
      </View>
      
      <View style={styles.kurikulumFooter}>
        <View style={styles.kurikulumMeta}>
          <Ionicons name="document-text" size={14} color="#7f8c8d" />
          <Text style={styles.metaText}>{item.materiCount} Materi</Text>
        </View>
        <View style={styles.kurikulumMeta}>
          <Ionicons name="calendar" size={14} color="#7f8c8d" />
          <Text style={styles.metaText}>{item.createdAt}</Text>
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
      
      <FlatList
        data={recentKurikulum}
        renderItem={renderKurikulumItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
    padding: 16,
  },
  header: {
    marginBottom: 24,
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
  quickActionsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  primaryActionButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryActionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  secondaryActionText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsTitle: {
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
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
});

export default AkademikMenuScreen;