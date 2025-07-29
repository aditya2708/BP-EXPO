import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../../common/components/ErrorMessage';
import ActionButton from '../../../components/shared/ActionButton';
import StatsCard from '../../../components/shared/StatsCard';
import MateriUsageIndicator from '../../../components/specific/materi/MateriUsageIndicator';
import { useMateri } from '../../../hooks/useMateri';

const MateriDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, item } = route.params || {};
  
  const { getMateriById, deleteMateri } = useMateri({ autoLoad: false });
  const [materiData, setMateriData] = useState(item || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id && !materiData) {
      fetchMateriDetail();
    }
  }, [id, materiData]);

  const fetchMateriDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMateriById(id);
      if (result.success) {
        setMateriData(result.data);
        navigation.setOptions({ 
          headerTitle: result.data.nama_materi || 'Detail Materi' 
        });
      } else {
        setError(result.error || 'Gagal mengambil detail materi');
      }
    } catch (err) {
      setError('Gagal mengambil detail materi');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('MateriForm', { 
      mode: 'edit', 
      id: materiData.id_materi, 
      item: materiData 
    });
  };

  const handleDelete = () => {
    if (materiData.kurikulum_materi_count > 0) {
      Alert.alert(
        'Tidak Dapat Dihapus',
        `Materi "${materiData.nama_materi}" sedang digunakan dalam ${materiData.kurikulum_materi_count} kurikulum dan tidak dapat dihapus.\n\nHapus materi dari kurikulum terlebih dahulu.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Hapus Materi',
      `Yakin ingin menghapus materi "${materiData.nama_materi}"?\n\nMateri: ${materiData.mata_pelajaran?.nama_mata_pelajaran} - ${materiData.kelas?.nama_kelas}`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: confirmDelete
        }
      ]
    );
  };

  const confirmDelete = async () => {
    setDeleting(true);
    
    try {
      const result = await deleteMateri(materiData.id_materi);
      
      if (result.success) {
        Alert.alert(
          'Berhasil',
          'Materi berhasil dihapus',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Gagal menghapus materi');
      }
    } catch (err) {
      Alert.alert('Error', 'Gagal menghapus materi');
    } finally {
      setDeleting(false);
    }
  };

  const handleKurikulumPress = (kurikulum) => {
    console.log('Navigate to kurikulum detail:', kurikulum);
    // TODO: Navigate to kurikulum detail when implemented
  };

  const handleStats = () => {
    navigation.navigate('MateriStats', { 
      id: materiData.id_materi, 
      item: materiData 
    });
  };

  if (loading && !materiData) {
    return <LoadingSpinner fullScreen message="Memuat detail materi..." />;
  }

  if (error && !materiData) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={fetchMateriDetail} />
      </View>
    );
  }

  if (!materiData) {
    return (
      <View style={styles.container}>
        <ErrorMessage message="Data materi tidak ditemukan" />
      </View>
    );
  }

  const jenjangInfo = materiData.kelas?.jenjang || materiData.mata_pelajaran?.jenjang;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.dependencyPath}>
            {jenjangInfo && (
              <>
                <View style={styles.pathStep}>
                  <Ionicons name="library-outline" size={16} color="#007bff" />
                  <Text style={styles.pathText}>{jenjangInfo.nama_jenjang}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </>
            )}
            
            <View style={styles.pathStep}>
              <Ionicons name="book-outline" size={16} color="#28a745" />
              <Text style={styles.pathText}>
                {materiData.mata_pelajaran?.nama_mata_pelajaran}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#666" />
            
            <View style={styles.pathStep}>
              <Ionicons name="people-outline" size={16} color="#ffc107" />
              <Text style={styles.pathText}>
                {materiData.kelas?.nama_kelas}
              </Text>
            </View>
          </View>

          <Text style={styles.namaMateri}>{materiData.nama_materi}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detail Informasi</Text>
          
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mata Pelajaran:</Text>
              <Text style={styles.detailValue}>
                {materiData.mata_pelajaran?.nama_mata_pelajaran}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Kode Mata Pelajaran:</Text>
              <Text style={styles.detailValue}>
                {materiData.mata_pelajaran?.kode_mata_pelajaran}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Kategori:</Text>
              <View style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(materiData.mata_pelajaran?.kategori) }
              ]}>
                <Text style={styles.categoryText}>
                  {getCategoryLabel(materiData.mata_pelajaran?.kategori)}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Kelas:</Text>
              <Text style={styles.detailValue}>
                {materiData.kelas?.nama_kelas} ({materiData.kelas?.jenis_kelas})
              </Text>
            </View>
            
            {jenjangInfo && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Jenjang:</Text>
                <Text style={styles.detailValue}>
                  {jenjangInfo.nama_jenjang} ({jenjangInfo.kode_jenjang})
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Usage Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Penggunaan</Text>
          
          <MateriUsageIndicator
            usage={materiData.kurikulum_usage || []}
            totalUsage={materiData.kurikulum_materi_count || 0}
            onKurikulumPress={handleKurikulumPress}
          />
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistik</Text>
          
          <StatsCard
            title="Digunakan dalam Kurikulum"
            value={materiData.kurikulum_materi_count || 0}
            icon="link-outline"
            iconColor={materiData.kurikulum_materi_count > 0 ? "#dc3545" : "#28a745"}
          />
        </View>

        {/* Meta Information */}
        {materiData.created_at && (
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.metaText}>
                Dibuat: {new Date(materiData.created_at).toLocaleDateString('id-ID')}
              </Text>
            </View>
            
            {materiData.updated_at && materiData.updated_at !== materiData.created_at && (
              <View style={styles.metaItem}>
                <Ionicons name="create-outline" size={16} color="#666" />
                <Text style={styles.metaText}>
                  Diperbarui: {new Date(materiData.updated_at).toLocaleDateString('id-ID')}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <ActionButton
          title="Statistik"
          icon="bar-chart-outline"
          variant="outline"
          onPress={handleStats}
          style={styles.statsButton}
        />
        
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
          disabled={materiData.kurikulum_materi_count > 0}
          style={styles.deleteButton}
        />
      </View>
    </SafeAreaView>
  );
};

const getCategoryColor = (kategori) => {
  const colors = {
    wajib: '#d1ecf1',
    muatan_lokal: '#d4edda',
    pengembangan_diri: '#fff3cd',
    pilihan: '#f8d7da',
    ekstrakurikuler: '#e2e3e5'
  };
  return colors?.[kategori] || '#f8f9fa';
};

const getCategoryLabel = (kategori) => {
  const labels = {
    wajib: 'Mata Pelajaran Wajib',
    muatan_lokal: 'Muatan Lokal',
    pengembangan_diri: 'Pengembangan Diri',
    pilihan: 'Mata Pelajaran Pilihan',
    ekstrakurikuler: 'Ekstrakurikuler'
  };
  return labels?.[kategori] || kategori;
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
  dependencyPath: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap'
  },
  pathStep: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 4
  },
  pathText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500'
  },
  namaMateri: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 32
  },
  section: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right'
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333'
  },
  metaInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 8
  },
  statsButton: {
    flex: 1
  },
  editButton: {
    flex: 1
  },
  deleteButton: {
    flex: 1
  }
});

export default MateriDetailScreen;