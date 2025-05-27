import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  ScrollView
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Button from '../../../../common/components/Button';
import LoadingSpinner from '../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../common/components/ErrorMessage';
import RiwayatListItem from '../../../../common/components/Anak/RiwayatListItem';

// Import API
import { adminShelterRiwayatApi } from '../../api/adminShelterRiwayatApi';

const RiwayatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { anakData, anakId } = route.params || {};
  
  const [riwayatList, setRiwayatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState(''); // Filter by jenis_histori

  // Jenis Histori options for filtering
  const jenisHistoriOptions = [
    { id: '', label: 'Semua' },
    { id: 'Kesehatan', label: 'Kesehatan' },
    { id: 'Pendidikan', label: 'Pendidikan' },
    { id: 'Keluarga', label: 'Keluarga' },
    { id: 'Lainnya', label: 'Lainnya' }
  ];

  // Fetch riwayat data
  const fetchRiwayatData = async () => {
    if (!anakId) return;
    
    try {
      setError(null);
      
      // Prepare params for filtering
      const params = {};
      if (filterType) {
        params.jenis_histori = filterType;
      }
      
      const response = await adminShelterRiwayatApi.getRiwayat(anakId, params);
      
      if (response.data.success) {
        setRiwayatList(response.data.data || []);
      } else {
        setError(response.data.message || 'Gagal memuat data riwayat');
      }
    } catch (err) {
      console.error('Error fetching riwayat data:', err);
      setError('Gagal memuat data riwayat. Silakan coba lagi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRiwayatData();
  }, [anakId, filterType]);
  
  // Refresh data when navigating back to screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRiwayatData();
    });
    
    return unsubscribe;
  }, [navigation]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchRiwayatData();
  };

  // Handle filter change
  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  // Handle view riwayat detail
  const handleViewRiwayat = (riwayat) => {
    navigation.navigate('RiwayatDetail', {
      anakData,
      anakId,
      riwayatId: riwayat.id_histori,
      riwayatData: riwayat
    });
  };

  // Handle add new riwayat
  const handleAddRiwayat = () => {
    navigation.navigate('RiwayatForm', {
      anakData,
      anakId,
      isEdit: false
    });
  };

  // Handle edit riwayat
  const handleEditRiwayat = (riwayat) => {
    navigation.navigate('RiwayatForm', {
      anakData,
      anakId,
      riwayatId: riwayat.id_histori,
      riwayatData: riwayat,
      isEdit: true
    });
  };

  // Handle delete riwayat
  const handleDeleteRiwayat = (riwayat) => {
    Alert.alert(
      'Hapus Riwayat',
      `Anda yakin ingin menghapus riwayat "${riwayat.nama_histori}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await adminShelterRiwayatApi.deleteRiwayat(anakId, riwayat.id_histori);
              
              if (response.data.success) {
                // Remove the deleted riwayat from the list
                setRiwayatList(prev => prev.filter(item => item.id_histori !== riwayat.id_histori));
                Alert.alert('Sukses', 'Riwayat berhasil dihapus');
              } else {
                setError(response.data.message || 'Gagal menghapus riwayat');
              }
            } catch (err) {
              console.error('Error deleting riwayat:', err);
              setError('Gagal menghapus riwayat. Silakan coba lagi.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerImageContainer}>
            {anakData?.foto_url ? (
              <Image
                source={{ uri: anakData.foto_url }}
                style={styles.headerImage}
              />
            ) : (
              <View style={styles.headerImagePlaceholder}>
                <Ionicons name="person" size={40} color="#ffffff" />
              </View>
            )}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{anakData?.full_name || 'Nama Anak'}</Text>
            {anakData?.nick_name && (
              <Text style={styles.headerNickname}>{anakData.nick_name}</Text>
            )}
          </View>
        </View>
        <LoadingSpinner message="Memuat data riwayat..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerImageContainer}>
          {anakData?.foto_url ? (
            <Image
              source={{ uri: anakData.foto_url }}
              style={styles.headerImage}
            />
          ) : (
            <View style={styles.headerImagePlaceholder}>
              <Ionicons name="person" size={40} color="#ffffff" />
            </View>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{anakData?.full_name || 'Nama Anak'}</Text>
          {anakData?.nick_name && (
            <Text style={styles.headerNickname}>{anakData.nick_name}</Text>
          )}
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={fetchRiwayatData}
          />
        )}
        
        {/* Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Riwayat Anak</Text>
          <Button
            title="Tambah Riwayat"
            onPress={handleAddRiwayat}
            leftIcon={<Ionicons name="add" size={16} color="#fff" />}
            size="small"
          />
        </View>
        
        {/* Filter Buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
          <View style={styles.filterContainer}>
            {jenisHistoriOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.filterButton,
                  filterType === option.id && styles.filterButtonActive
                ]}
                onPress={() => handleFilterChange(option.id)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterType === option.id && styles.filterButtonTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        
        {/* Riwayat List */}
        {riwayatList.length > 0 ? (
          <FlatList
            data={riwayatList}
            renderItem={({ item }) => (
              <RiwayatListItem
                riwayat={item}
                onPress={() => handleViewRiwayat(item)}
                onEdit={() => handleEditRiwayat(item)}
                onDelete={() => handleDeleteRiwayat(item)}
              />
            )}
            keyExtractor={(item) => item.id_histori.toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={80} color="#cccccc" />
            <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
            <Text style={styles.emptyText}>
              {filterType 
                ? `Tidak ada riwayat dengan jenis "${filterType}"`
                : 'Belum ada data riwayat untuk anak ini. Tambahkan riwayat baru untuk memulai.'}
            </Text>
            {!filterType && (
              <Button
                title="Tambah Riwayat Pertama"
                onPress={handleAddRiwayat}
                style={styles.emptyButton}
                leftIcon={<Ionicons name="add" size={16} color="#fff" />}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  headerImageContainer: {
    marginRight: 16,
  },
  headerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  headerImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerNickname: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  filterScrollView: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e74c3c',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#e74c3c',
  },
  filterButtonText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 200,
  },
});

export default RiwayatScreen;