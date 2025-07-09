import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

import {
  fetchMataPelajaranDetail,
  deleteMataPelajaran,
  selectMataPelajaranDetail,
  selectMataPelajaranLoading,
  selectMataPelajaranError
} from '../redux/mataPelajaranSlice';

const MataPelajaranDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { mataPelajaranId, mataPelajaran } = route.params;
  
  const detail = useSelector(selectMataPelajaranDetail);
  const loading = useSelector(selectMataPelajaranLoading);
  const error = useSelector(selectMataPelajaranError);
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (mataPelajaranId) {
      dispatch(fetchMataPelajaranDetail(mataPelajaranId));
    }
  }, [mataPelajaranId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (mataPelajaranId) {
      await dispatch(fetchMataPelajaranDetail(mataPelajaranId));
    }
    setRefreshing(false);
  };

  const handleEdit = () => {
    navigation.navigate('MataPelajaranForm', { 
      mataPelajaran: detail || mataPelajaran 
    });
  };

  const handleDelete = () => {
    const itemToDelete = detail || mataPelajaran;
    
    Alert.alert(
      'Hapus Mata Pelajaran',
      `Hapus ${itemToDelete.nama_mata_pelajaran}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteMataPelajaran(itemToDelete.id_mata_pelajaran)).unwrap();
              Alert.alert('Sukses', 'Mata pelajaran berhasil dihapus', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (err) {
              Alert.alert('Error', err.message || 'Gagal menghapus mata pelajaran');
            }
          }
        }
      ]
    );
  };

  const getKategoriColor = (kategori) => {
    switch (kategori) {
      case 'wajib': return '#e74c3c';
      case 'pilihan': return '#3498db';
      case 'muatan_lokal': return '#f39c12';
      case 'ekstrakurikuler': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  const getKategoriText = (kategori) => {
    switch (kategori) {
      case 'wajib': return 'Wajib';
      case 'pilihan': return 'Pilihan';
      case 'muatan_lokal': return 'Muatan Lokal';
      case 'ekstrakurikuler': return 'Ekstrakurikuler';
      default: return kategori;
    }
  };

  const getKategoriIcon = (kategori) => {
    switch (kategori) {
      case 'wajib': return 'bookmark';
      case 'pilihan': return 'options-outline';
      case 'muatan_lokal': return 'location-outline';
      case 'ekstrakurikuler': return 'basketball-outline';
      default: return 'library-outline';
    }
  };

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat detail mata pelajaran..." />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={handleRefresh} />
      </View>
    );
  }

  const currentData = detail || mataPelajaran;
  
  if (!currentData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Data mata pelajaran tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{currentData.nama_mata_pelajaran}</Text>
              <View style={[
                styles.kategoriBadge, 
                { backgroundColor: getKategoriColor(currentData.kategori) }
              ]}>
                <Ionicons 
                  name={getKategoriIcon(currentData.kategori)} 
                  size={16} 
                  color="#fff" 
                  style={styles.kategoriIcon}
                />
                <Text style={styles.kategoriText}>
                  {getKategoriText(currentData.kategori)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Informasi Detail</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="trophy-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Bobot SKS</Text>
              <Text style={styles.infoValue}>{currentData.bobot_sks} SKS</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Cabang</Text>
              <Text style={styles.infoValue}>
                {currentData.kacab?.nama_kacab || 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="book-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Digunakan di Kurikulum</Text>
              <Text style={styles.infoValue}>
                {currentData.kurikulum_materi_count || 0} kurikulum
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Dibuat</Text>
              <Text style={styles.infoValue}>
                {new Date(currentData.created_at).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="refresh-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Diperbarui</Text>
              <Text style={styles.infoValue}>
                {new Date(currentData.updated_at).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerContent: {
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  kategoriBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  kategoriIcon: {
    marginRight: 4,
  },
  kategoriText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default MataPelajaranDetailScreen;