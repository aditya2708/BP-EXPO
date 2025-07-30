import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../../common/components/ErrorMessage';
import ActionButton from '../../../components/shared/ActionButton';
import MateriUsageIndicator from '../../../components/specific/materi/MateriUsageIndicator';
import { useMateri } from '../../../hooks/useMateri';

const MateriDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, item } = route.params || {};
  
  const { getMateriById, deleteMateri, getUsageAnalytics } = useMateri();
  const [materiData, setMateriData] = useState(item || null);
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id && !materiData) {
      fetchMateriDetail();
    } else if (materiData) {
      navigation.setOptions({ headerTitle: materiData.nama_materi });
      loadUsageData();
    }
  }, [id, materiData]);

  const fetchMateriDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMateriById(id);
      if (result.success) {
        setMateriData(result.data);
        navigation.setOptions({ headerTitle: result.data.nama_materi });
      } else {
        setError(result.error || 'Gagal mengambil detail materi');
      }
    } catch (err) {
      setError('Gagal mengambil detail materi');
    } finally {
      setLoading(false);
    }
  };

  const loadUsageData = async () => {
    try {
      const usage = await getUsageAnalytics(materiData.id_materi);
      if (usage) setUsageData(usage);
    } catch (err) {
      console.error('Error loading usage data:', err);
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
    const usage = usageData?.kurikulum_count || 0;
    
    if (usage > 0) {
      Alert.alert(
        'Tidak Dapat Menghapus',
        `Materi ini digunakan dalam ${usage} kurikulum dan tidak dapat dihapus.`
      );
      return;
    }

    Alert.alert(
      'Hapus Materi',
      `Yakin ingin menghapus materi "${materiData.nama_materi}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: confirmDelete }
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
          [{ text: 'OK', onPress: () => navigation.goBack() }]
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

  const handleViewUsage = () => {
    // Navigate to usage details
    console.log('View usage details');
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

  const canDelete = !usageData || usageData.kurikulum_count === 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header Info */}
        <View style={styles.headerCard}>
          <Text style={styles.namaMateri}>{materiData.nama_materi}</Text>
          
          {/* Hierarchy Path */}
          <View style={styles.hierarchyPath}>
            <Text style={styles.pathText}>
              {materiData.kelas?.jenjang?.nama_jenjang || materiData.mataPelajaran?.jenjang?.nama_jenjang}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#666" />
            <Text style={styles.pathText}>
              {materiData.mataPelajaran?.nama_mata_pelajaran}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#666" />
            <Text style={styles.pathText}>
              {materiData.kelas?.nama_kelas}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Detail Informasi</Text>
          
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Jenjang:</Text>
              <Text style={styles.detailValue}>
                {materiData.kelas?.jenjang?.nama_jenjang || materiData.mataPelajaran?.jenjang?.nama_jenjang || '-'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mata Pelajaran:</Text>
              <Text style={styles.detailValue}>
                {materiData.mataPelajaran?.nama_mata_pelajaran} ({materiData.mataPelajaran?.kode_mata_pelajaran})
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Kategori:</Text>
              <Text style={styles.detailValue}>
                {materiData.mataPelajaran?.kategori || '-'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Kelas:</Text>
              <Text style={styles.detailValue}>
                {materiData.kelas?.nama_kelas} ({materiData.kelas?.jenis_kelas})
              </Text>
            </View>
            
            {materiData.kelas?.tingkat && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tingkat:</Text>
                <Text style={styles.detailValue}>
                  Tingkat {materiData.kelas.tingkat}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Usage Information */}
        <View style={styles.usageSection}>
          <Text style={styles.sectionTitle}>Penggunaan</Text>
          
          <MateriUsageIndicator
            usage={usageData || {}}
            onViewUsage={handleViewUsage}
          />
        </View>

        {/* Meta Information */}
        {materiData.created_at && (
          <View style={styles.metaSection}>
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
          disabled={!canDelete}
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
  namaMateri: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  hierarchyPath: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  pathText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 4
  },
  detailsSection: {
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 2,
    textAlign: 'right'
  },
  usageSection: {
    marginBottom: 16
  },
  metaSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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

export default MateriDetailScreen;