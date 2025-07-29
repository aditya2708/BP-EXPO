import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../../common/components/ErrorMessage';
import ActionButton from '../../../components/shared/ActionButton';
import StatsCard from '../../../components/shared/StatsCard';
import { useMataPelajaran } from '../../../hooks/useMataPelajaran';

const MataPelajaranDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, item } = route.params || {};
  
  const { getMataPelajaranById, deleteMataPelajaran } = useMataPelajaran();
  const [mataPelajaranData, setMataPelajaranData] = useState(item || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id && !mataPelajaranData) {
      fetchDetail();
    }
  }, [id, mataPelajaranData]);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMataPelajaranById(id);
      if (result.success) {
        setMataPelajaranData(result.data);
        navigation.setOptions({ 
          headerTitle: result.data.nama_mata_pelajaran || 'Detail Mata Pelajaran' 
        });
      } else {
        setError(result.error || 'Gagal mengambil detail mata pelajaran');
      }
    } catch (err) {
      setError('Gagal mengambil detail mata pelajaran');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('MataPelajaranForm', { 
      mode: 'edit', 
      id: mataPelajaranData.id_mata_pelajaran, 
      item: mataPelajaranData 
    });
  };

  const handleDelete = () => {
    const hasMateri = (mataPelajaranData.materi?.length || mataPelajaranData.materi_count || 0) > 0;
    const hasKurikulum = (mataPelajaranData.kurikulum_materi?.length || mataPelajaranData.kurikulum_count || 0) > 0;
    
    let message = `Yakin ingin menghapus mata pelajaran "${mataPelajaranData.nama_mata_pelajaran}"?`;
    
    if (hasMateri || hasKurikulum) {
      message += '\n\nPerhatian: Mata pelajaran yang memiliki materi atau digunakan dalam kurikulum tidak dapat dihapus.';
    }

    Alert.alert('Hapus Mata Pelajaran', message, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: confirmDelete }
    ]);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    
    try {
      const result = await deleteMataPelajaran(mataPelajaranData.id_mata_pelajaran);
      
      if (result.success) {
        Alert.alert('Berhasil', 'Mata pelajaran berhasil dihapus', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Gagal menghapus mata pelajaran');
      }
    } catch (err) {
      Alert.alert('Error', 'Gagal menghapus mata pelajaran');
    } finally {
      setDeleting(false);
    }
  };

  const getKategoriColor = (kategori) => {
    const colors = {
      'wajib': '#007bff',
      'muatan_lokal': '#28a745',
      'pengembangan_diri': '#17a2b8',
      'pilihan': '#ffc107',
      'ekstrakurikuler': '#6f42c1'
    };
    return colors[kategori] || '#6c757d';
  };

  const getKategoriLabel = (kategori) => {
    const labels = {
      'wajib': 'Mata Pelajaran Wajib',
      'muatan_lokal': 'Muatan Lokal', 
      'pengembangan_diri': 'Pengembangan Diri',
      'pilihan': 'Mata Pelajaran Pilihan',
      'ekstrakurikuler': 'Ekstrakurikuler'
    };
    return labels[kategori] || kategori;
  };

  if (loading && !mataPelajaranData) {
    return <LoadingSpinner fullScreen message="Memuat detail mata pelajaran..." />;
  }

  if (error && !mataPelajaranData) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={fetchDetail} />
      </View>
    );
  }

  if (!mataPelajaranData) {
    return (
      <View style={styles.container}>
        <ErrorMessage message="Data mata pelajaran tidak ditemukan" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.kodeMataPelajaran}>{mataPelajaranData.kode_mata_pelajaran}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: mataPelajaranData.status === 'aktif' ? '#d4edda' : '#f8d7da' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: mataPelajaranData.status === 'aktif' ? '#155724' : '#721c24' }
                ]}>
                  {mataPelajaranData.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                </Text>
              </View>
            </View>
            
            <View style={[
              styles.kategoriBadge,
              { backgroundColor: getKategoriColor(mataPelajaranData.kategori) + '20' }
            ]}>
              <Text style={[
                styles.kategoriText,
                { color: getKategoriColor(mataPelajaranData.kategori) }
              ]}>
                {getKategoriLabel(mataPelajaranData.kategori)}
              </Text>
            </View>
          </View>

          <Text style={styles.namaMataPelajaran}>{mataPelajaranData.nama_mata_pelajaran}</Text>
          
          {mataPelajaranData.jenjang && (
            <View style={styles.jenjangInfo}>
              <Ionicons name="library-outline" size={16} color="#666" />
              <Text style={styles.jenjangText}>
                {mataPelajaranData.jenjang.nama_jenjang} ({mataPelajaranData.jenjang.kode_jenjang})
              </Text>
            </View>
          )}
          
          {mataPelajaranData.deskripsi && (
            <Text style={styles.deskripsi}>{mataPelajaranData.deskripsi}</Text>
          )}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistik Penggunaan</Text>
          
          <StatsCard
            title="Total Materi"
            value={mataPelajaranData.materi?.length || mataPelajaranData.materi_count || 0}
            icon="document-text-outline"
            iconColor="#007bff"
          />
          
          <StatsCard
            title="Digunakan di Kurikulum"
            value={mataPelajaranData.kurikulum_materi?.length || mataPelajaranData.kurikulum_count || 0}
            icon="school-outline"
            iconColor="#28a745"
          />
          
          {mataPelajaranData.created_at && (
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.metaText}>
                  Dibuat: {new Date(mataPelajaranData.created_at).toLocaleDateString('id-ID')}
                </Text>
              </View>
              
              {mataPelajaranData.updated_at && mataPelajaranData.updated_at !== mataPelajaranData.created_at && (
                <View style={styles.metaItem}>
                  <Ionicons name="create-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>
                    Diperbarui: {new Date(mataPelajaranData.updated_at).toLocaleDateString('id-ID')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <ActionButton
          title="Edit"
          icon="create-outline"
          onPress={handleEdit}
          style={styles.editButton}
        />
        
        <ActionButton
          title="Hapus"
          icon="trash-outline"
          variant="danger"
          onPress={handleDelete}
          loading={deleting}
          style={styles.deleteButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  content: {
    flex: 1,
    padding: 16
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  kodeMataPelajaran: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
    marginRight: 12
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600'
  },
  kategoriBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8
  },
  kategoriText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  namaMataPelajaran: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  jenjangInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  jenjangText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontStyle: 'italic'
  },
  deskripsi: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24
  },
  statsSection: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  metaInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 8
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12
  },
  editButton: {
    flex: 1
  },
  deleteButton: {
    flex: 1
  }
});

export default MataPelajaranDetailScreen;