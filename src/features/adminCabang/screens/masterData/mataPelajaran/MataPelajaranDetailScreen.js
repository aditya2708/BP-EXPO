import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../../components/shared/ActionButton';
import StatsCard from '../../../components/shared/StatsCard';
import LoadingScreen from '../../../../../common/components/LoadingScreen';
import { useMataPelajaran } from '../../../hooks/useMataPelajaran';

const MataPelajaranDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, item } = route.params;
  
  const {
    getMataPelajaranById,
    deleteMataPelajaran,
    loading,
    error
  } = useMataPelajaran();

  const [mataPelajaranData, setMataPelajaranData] = useState(item || null);
  const [deleting, setDeleting] = useState(false);

  // Load mata pelajaran detail
  useEffect(() => {
    if (id && !item) {
      loadMataPelajaranDetail();
    }
  }, [id]);

  const loadMataPelajaranDetail = async () => {
    try {
      const result = await getMataPelajaranById(id);
      if (result.success) {
        setMataPelajaranData(result.data);
      } else {
        Alert.alert('Error', result.message || 'Gagal memuat detail mata pelajaran');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Terjadi kesalahan');
    }
  };

  // Navigation handlers
  const handleEdit = () => {
    navigation.navigate('MataPelajaranForm', {
      mode: 'edit',
      id: mataPelajaranData.id_mata_pelajaran,
      item: mataPelajaranData
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Yakin ingin menghapus mata pelajaran "${mataPelajaranData.nama_mata_pelajaran}"?`,
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
      const result = await deleteMataPelajaran(mataPelajaranData.id_mata_pelajaran);
      if (result.success) {
        Alert.alert('Sukses', 'Mata pelajaran berhasil dihapus', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', result.message || 'Gagal menghapus mata pelajaran');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Terjadi kesalahan');
    } finally {
      setDeleting(false);
    }
  };

  const handleViewStats = () => {
    navigation.navigate('MataPelajaranStats');
  };

  // Helper functions
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

  const getKategoriColor = (kategori) => {
    const colors = {
      'wajib': '#3B82F6',
      'muatan_lokal': '#10B981',
      'pengembangan_diri': '#06B6D4',
      'pilihan': '#F59E0B',
      'ekstrakurikuler': '#8B5CF6'
    };
    return colors[kategori] || '#6B7280';
  };

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  if (loading && !mataPelajaranData) {
    return <LoadingScreen message="Memuat detail mata pelajaran..." />;
  }

  if (!mataPelajaranData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Data mata pelajaran tidak ditemukan</Text>
        <ActionButton
          title="Kembali"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View style={styles.codeContainer}>
            <Text style={styles.kodeText}>{mataPelajaranData.kode_mata_pelajaran}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { 
                backgroundColor: mataPelajaranData.status === 'aktif' ? '#d4edda' : '#f8d7da' 
              }
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

      {/* Statistics Section */}
      <View style={styles.statsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Statistik Penggunaan</Text>
          <TouchableOpacity style={styles.viewStatsButton} onPress={handleViewStats}>
            <Text style={styles.viewStatsText}>Lihat Detail</Text>
            <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsGrid}>
          <StatsCard
            title="Total Materi"
            value={mataPelajaranData.materi?.length || mataPelajaranData.materi_count || 0}
            icon="document-text-outline"
            iconColor="#3B82F6"
            style={styles.statCard}
          />
          
          <StatsCard
            title="Digunakan di Kurikulum"
            value={mataPelajaranData.kurikulum_materi?.length || mataPelajaranData.kurikulum_count || 0}
            icon="school-outline"
            iconColor="#10B981"
            style={styles.statCard}
          />
          
          <StatsCard
            title="Kelas Terkait"
            value={mataPelajaranData.kelas?.length || mataPelajaranData.kelas_count || 0}
            icon="people-outline"
            iconColor="#F59E0B"
            style={styles.statCard}
          />
          
          <StatsCard
            title="Rating Penggunaan"
            value={mataPelajaranData.usage_rating || '0.0'}
            icon="star-outline"
            iconColor="#8B5CF6"
            style={styles.statCard}
          />
        </View>
      </View>

      {/* Informasi Tambahan */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informasi Lengkap</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>ID Mata Pelajaran</Text>
          <Text style={styles.infoValue}>{mataPelajaranData.id_mata_pelajaran}</Text>
        </View>
        
        {mataPelajaranData.created_at && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Dibuat Pada</Text>
            <Text style={styles.infoValue}>
              {new Date(mataPelajaranData.created_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        )}
        
        {mataPelajaranData.updated_at && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Terakhir Diupdate</Text>
            <Text style={styles.infoValue}>
              {new Date(mataPelajaranData.updated_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <ActionButton
          title="Edit"
          onPress={handleEdit}
          icon="pencil-outline"
          variant="outline"
          style={styles.editButton}
        />
        
        <ActionButton
          title="Hapus"
          onPress={handleDelete}
          icon="trash-outline"
          variant="danger"
          style={styles.deleteButton}
          loading={deleting}
          disabled={deleting}
        />
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  headerTop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  codeContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  kodeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151'
  },
  statusContainer: {
    alignSelf: 'flex-start'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600'
  },
  kategoriBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  kategoriText: {
    fontSize: 12,
    fontWeight: '600'
  },
  namaMataPelajaran: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8
  },
  jenjangInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8
  },
  jenjangText: {
    fontSize: 14,
    color: '#6B7280'
  },
  deskripsi: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827'
  },
  viewStatsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  viewStatsText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  statCard: {
    width: '48%'
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right'
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12
  },
  editButton: {
    flex: 1
  },
  deleteButton: {
    flex: 1
  },
  bottomSpacing: {
    height: 24
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16
  },
  backButton: {
    minWidth: 120
  }
});

export default MataPelajaranDetailScreen;