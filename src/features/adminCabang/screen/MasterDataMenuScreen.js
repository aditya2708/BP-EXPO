import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MasterDataMenuScreen = ({ navigation }) => {
  const masterDataModules = [
    {
      id: 'jenjang',
      title: 'Jenjang',
      icon: 'school',
      totalCount: 3,
      activeCount: 3,
      color: '#3498db',
      navigationTarget: 'JenjangList', // TODO: Update when screens moved
    },
    {
      id: 'mataPelajaran',
      title: 'Mata Pelajaran',
      icon: 'book',
      totalCount: 12,
      activeCount: 10,
      color: '#e74c3c',
      navigationTarget: 'MataPelajaranList', // TODO: Update when screens moved
    },
    {
      id: 'kelas',
      title: 'Kelas',
      icon: 'people',
      totalCount: 18,
      activeCount: 15,
      color: '#f39c12',
      navigationTarget: 'KelasList', // TODO: Update when screens moved
    },
    {
      id: 'materi',
      title: 'Materi',
      icon: 'document-text',
      totalCount: 45,
      activeCount: 42,
      color: '#27ae60',
      navigationTarget: 'MateriList', // TODO: Update when screens moved
    },
  ];

  const handleCardPress = (module) => {
    // TODO: Navigate to respective screens when they are moved to new structure
    console.log(`Navigate to ${module.title}`);
    // navigation.navigate(module.navigationTarget);
  };

  const handleQuickAdd = (module) => {
    // TODO: Navigate to respective form screens
    console.log(`Quick add ${module.title}`);
  };

  const renderCard = (module) => (
    <TouchableOpacity
      key={module.id}
      style={[styles.card, { borderLeftColor: module.color }]}
      onPress={() => handleCardPress(module)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: module.color }]}>
          <Ionicons name={module.icon} size={24} color="white" />
        </View>
        <TouchableOpacity
          style={styles.quickAddButton}
          onPress={() => handleQuickAdd(module)}
        >
          <Ionicons name="add-circle" size={20} color={module.color} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.cardTitle}>{module.title}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{module.totalCount}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: module.color }]}>
            {module.activeCount}
          </Text>
          <Text style={styles.statLabel}>Aktif</Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.viewAllText}>Lihat Semua</Text>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Master Data</Text>
          <Text style={styles.headerSubtitle}>
            Kelola data dasar sistem akademik
          </Text>
        </View>

        <View style={styles.cardsGrid}>
          {masterDataModules.map(renderCard)}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan Data</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>78</Text>
              <Text style={styles.summaryLabel}>Total Record</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: '#27ae60' }]}>70</Text>
              <Text style={styles.summaryLabel}>Data Aktif</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: '#e74c3c' }]}>8</Text>
              <Text style={styles.summaryLabel}>Tidak Aktif</Text>
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
  cardsGrid: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAddButton: {
    padding: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#ecf0f1',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  viewAllText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
});

export default MasterDataMenuScreen;