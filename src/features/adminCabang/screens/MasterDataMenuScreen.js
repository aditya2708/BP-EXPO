import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  selectJenjangLoading,
  selectJenjangError,
  selectJenjangStatistics // 1. Import the statistics selector
} from '../redux/masterData/jenjangSlice'; // 2. Correct the import path
import {
  fetchJenjangStatistics
} from '../redux/masterData/jenjangThunks';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const MasterDataMenuScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectJenjangLoading);
  const error = useSelector(selectJenjangError);
  const statistics = useSelector(selectJenjangStatistics); // 3. Use the selector to get statistics data

  useFocusEffect(
    React.useCallback(() => {
      loadStatistics();
    }, [])
  );

  const loadStatistics = async () => {
    try {
      await dispatch(fetchJenjangStatistics()).unwrap();
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  const handleJenjangPress = () => {
    navigation.navigate('JenjangList');
  };

  const handleMataPelajaranPress = () => {
    // TODO: Navigate to MataPelajaranList when implemented
    console.log('Navigate to Mata Pelajaran');
  };

  const handleKelasPress = () => {
    // TODO: Navigate to KelasList when implemented
    console.log('Navigate to Kelas');
  };

  const handleMateriPress = () => {
    // TODO: Navigate to MateriList when implemented
    console.log('Navigate to Materi');
  };

  const handleAddJenjang = () => {
    navigation.navigate('JenjangForm');
  };

  const renderMasterDataCard = (title, icon, count, onPress, onAdd, iconColor = '#007bff') => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Ionicons name="add" size={16} color="#007bff" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.cardTitle}>{title}</Text>
      
      <View style={styles.statsContainer}>
        {/* 4. Display the count from statistics, provide a fallback */}
        <Text style={styles.countText}>{count || '0'}</Text>
        <Text style={styles.countLabel}>Total Data</Text>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.viewAllText}>Lihat Semua</Text>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Master Data</Text>
          <Text style={styles.subtitle}>Kelola data master sistem</Text>
        </View>

        <View style={styles.cardsContainer}>
          {renderMasterDataCard(
            'Jenjang',
            'school-outline',
            statistics?.jenjang?.total, // 5. Use the fetched jenjang statistics
            handleJenjangPress,
            handleAddJenjang,
            '#007bff'
          )}
          
          {renderMasterDataCard(
            'Mata Pelajaran',
            'book-outline',
            statistics?.mata_pelajaran?.total, // Use mata pelajaran statistics
            handleMataPelajaranPress,
            () => console.log('Add Mata Pelajaran'),
            '#28a745'
          )}
          
          {renderMasterDataCard(
            'Kelas',
            'library-outline',
            statistics?.kelas?.total, // Use kelas statistics
            handleKelasPress,
            () => console.log('Add Kelas'),
            '#ffc107'
          )}
          
          {renderMasterDataCard(
            'Materi',
            'document-text-outline',
            statistics?.materi?.total, // Use materi statistics
            handleMateriPress,
            () => console.log('Add Materi'),
            '#dc3545'
          )}
        </View>

        {/* You can also populate the summary card with the statistics */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan Master Data</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Jenjang Aktif:</Text>
            <Text style={styles.summaryValue}>{statistics?.jenjang?.active || 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Mata Pelajaran:</Text>
            <Text style={styles.summaryValue}>{statistics?.mata_pelajaran?.total || 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Kelas:</Text>
            <Text style={styles.summaryValue}>{statistics?.kelas?.total || 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Materi:</Text>
            <Text style={styles.summaryValue}>{statistics?.materi?.total || 0}</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Aksi Cepat</Text>
          
          <TouchableOpacity style={styles.quickActionButton} onPress={handleAddJenjang}>
            <Ionicons name="add-circle-outline" size={20} color="#007bff" />
            <Text style={styles.quickActionText}>Tambah Jenjang Baru</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionButton, styles.disabledButton]} 
            disabled={true}
          >
            <Ionicons name="add-circle-outline" size={20} color="#ccc" />
            <Text style={[styles.quickActionText, styles.disabledText]}>Tambah Mata Pelajaran</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionButton, styles.disabledButton]} 
            disabled={true}
          >
            <Ionicons name="add-circle-outline" size={20} color="#ccc" />
            <Text style={[styles.quickActionText, styles.disabledText]}>Tambah Kelas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
// ... rest of the styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16
  },
  card: {
    width: cardWidth,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  statsContainer: {
    marginBottom: 12
  },
  countText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007bff'
  },
  countLabel: {
    fontSize: 12,
    color: '#666'
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  viewAllText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500'
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666'
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  quickActions: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 8
  },
  disabledButton: {
    backgroundColor: '#f5f5f5'
  },
  quickActionText: {
    fontSize: 14,
    color: '#007bff',
    marginLeft: 12,
    fontWeight: '500'
  },
  disabledText: {
    color: '#ccc'
  }
});

export default MasterDataMenuScreen;