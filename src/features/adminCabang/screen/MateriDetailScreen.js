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
  fetchMateriDetail,
  deleteMateri,
  selectMateriDetail,
  selectMateriLoading,
  selectMateriError
} from '../redux/materiSlice';

const MateriDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { materiId, materi } = route.params;
  
  const detail = useSelector(selectMateriDetail);
  const loading = useSelector(selectMateriLoading);
  const error = useSelector(selectMateriError);
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (materiId) {
      dispatch(fetchMateriDetail(materiId));
    }
  }, [materiId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (materiId) {
      await dispatch(fetchMateriDetail(materiId));
    }
    setRefreshing(false);
  };

  const handleEdit = () => {
    navigation.navigate('MateriForm', { 
      materi: detail || materi 
    });
  };

  const handleDelete = () => {
    const itemToDelete = detail || materi;
    
    Alert.alert(
      'Hapus Materi',
      `Hapus ${itemToDelete.nama_materi}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteMateri(itemToDelete.id_materi)).unwrap();
              Alert.alert('Sukses', 'Materi berhasil dihapus', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (err) {
              Alert.alert('Error', err.message || 'Gagal menghapus materi');
            }
          }
        }
      ]
    );
  };

  const getRomanNumeral = (tingkat) => {
    const numerals = {
      1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
      7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
    };
    return numerals[tingkat] || tingkat;
  };

  const getKelasDisplayName = (kelas) => {
    if (!kelas) return 'N/A';
    
    if (kelas.jenis_kelas === 'standard' && kelas.tingkat) {
      return `Kelas ${getRomanNumeral(kelas.tingkat)}`;
    }
    return kelas.nama_kelas;
  };

  const getHierarchyPath = (materiData) => {
    const jenjang = materiData?.kelas?.jenjang?.nama_jenjang || 'N/A';
    const kelas = getKelasDisplayName(materiData?.kelas);
    const mataPelajaran = materiData?.mata_pelajaran || 'N/A';
    return `${jenjang} > ${kelas} > ${mataPelajaran}`;
  };

  const getMataPelajaranColor = (mataPelajaran) => {
    const colors = ['#3498db', '#e74c3c', '#f39c12', '#9b59b6', '#2ecc71', '#34495e'];
    const hash = mataPelajaran?.split('').reduce((a, b) => a + b.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  };

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat detail materi..." />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={handleRefresh} />
      </View>
    );
  }

  const currentData = detail || materi;
  
  if (!currentData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Data materi tidak ditemukan</Text>
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
              <Text style={styles.title}>{currentData.nama_materi}</Text>
              <View style={[styles.mataPelajaranBadge, { backgroundColor: getMataPelajaranColor(currentData.mata_pelajaran) }]}>
                <Text style={styles.badgeText}>
                  {currentData.mata_pelajaran || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.hierarchyCard}>
          <Text style={styles.cardTitle}>Hierarki</Text>
          <View style={styles.hierarchyContainer}>
            <View style={styles.hierarchyRow}>
              <Ionicons name="git-branch-outline" size={16} color="#666" />
              <Text style={styles.hierarchyText}>
                {getHierarchyPath(currentData)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Informasi Detail</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="book-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nama Materi</Text>
              <Text style={styles.infoValue}>{currentData.nama_materi}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="library-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Mata Pelajaran</Text>
              <Text style={styles.infoValue}>{currentData.mata_pelajaran || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Jenjang</Text>
              <Text style={styles.infoValue}>
                {currentData.kelas?.jenjang?.nama_jenjang || 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="apps-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Kelas</Text>
              <Text style={styles.infoValue}>
                {getKelasDisplayName(currentData.kelas)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="documents-outline" size={20} color="#666" />
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
                {currentData.created_at ? new Date(currentData.created_at).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }) : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="refresh-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Diperbarui</Text>
              <Text style={styles.infoValue}>
                {currentData.updated_at ? new Date(currentData.updated_at).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }) : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {currentData.kurikulum_materi && currentData.kurikulum_materi.length > 0 && (
          <View style={styles.kurikulumCard}>
            <Text style={styles.cardTitle}>Digunakan dalam Kurikulum</Text>
            {currentData.kurikulum_materi.map((km, index) => (
              <View key={index} style={styles.kurikulumItem}>
                <View style={styles.kurikulumInfo}>
                  <Text style={styles.kurikulumName}>
                    {km.kurikulum?.nama_kurikulum || 'N/A'}
                  </Text>
                  <Text style={styles.kurikulumDetail}>
                    Tahun: {km.kurikulum?.tahun_berlaku || 'N/A'} | Status: {km.kurikulum?.status || 'N/A'}
                  </Text>
                </View>
                <View style={styles.kurikulumUrutan}>
                  <Text style={styles.urutanText}>#{km.urutan || '-'}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
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
  mataPelajaranBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  hierarchyCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  hierarchyContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  hierarchyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hierarchyText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
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
  kurikulumCard: {
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
  kurikulumItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  kurikulumInfo: {
    flex: 1,
  },
  kurikulumName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  kurikulumDetail: {
    fontSize: 14,
    color: '#666',
  },
  kurikulumUrutan: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 30,
    alignItems: 'center',
  },
  urutanText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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

export default MateriDetailScreen;