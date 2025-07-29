import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../../common/components/ErrorMessage';
import ActionButton from '../../../components/shared/ActionButton';
import StatsCard from '../../../components/shared/StatsCard';
import { useKelas } from '../../../hooks/useKelas';

const KelasDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, item } = route.params || {};
  
  const { getKelasById, deleteKelas } = useKelas();
  const [kelasData, setKelasData] = useState(item || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id && !kelasData) {
      fetchKelasDetail();
    }
  }, [id, kelasData]);

  const fetchKelasDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getKelasById(id);
      if (result.success) {
        setKelasData(result.data);
        const displayName = getDisplayName(result.data);
        navigation.setOptions({ headerTitle: displayName || 'Detail Kelas' });
      } else {
        setError(result.error || 'Gagal mengambil detail kelas');
      }
    } catch (err) {
      setError('Gagal mengambil detail kelas');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (data) => {
    if (data.jenis_kelas === 'standard' && data.tingkat) {
      const romans = {1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',11:'XI',12:'XII'};
      return `Kelas ${data.tingkat} (${romans[data.tingkat]})`;
    }
    return data.nama_kelas;
  };

  const handleEdit = () => {
    navigation.navigate('KelasForm', { 
      mode: 'edit', 
      id: kelasData.id_kelas, 
      item: kelasData 
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Hapus Kelas',
      `Yakin ingin menghapus kelas "${getDisplayName(kelasData)}"?\n\nKelas yang memiliki materi tidak dapat dihapus.`,
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
      const result = await deleteKelas(kelasData.id_kelas);
      
      if (result.success) {
        Alert.alert(
          'Berhasil',
          'Kelas berhasil dihapus',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Gagal menghapus kelas');
      }
    } catch (err) {
      Alert.alert('Error', 'Gagal menghapus kelas');
    } finally {
      setDeleting(false);
    }
  };

  const handleStats = () => {
    navigation.navigate('KelasStats', { 
      id: kelasData.id_kelas, 
      item: kelasData 
    });
  };

  if (loading && !kelasData) {
    return <LoadingSpinner fullScreen message="Memuat detail kelas..." />;
  }

  if (error && !kelasData) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={fetchKelasDetail} />
      </View>
    );
  }

  if (!kelasData) {
    return (
      <View style={styles.container}>
        <ErrorMessage message="Data kelas tidak ditemukan" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <View style={[
                styles.typeIcon,
                { backgroundColor: kelasData.jenis_kelas === 'standard' ? '#007bff20' : '#28a74520' }
              ]}>
                <Ionicons 
                  name={kelasData.jenis_kelas === 'standard' ? 'library-outline' : 'create-outline'} 
                  size={20} 
                  color={kelasData.jenis_kelas === 'standard' ? '#007bff' : '#28a745'} 
                />
              </View>
              <Text style={[
                styles.typeText,
                { color: kelasData.jenis_kelas === 'standard' ? '#007bff' : '#28a745' }
              ]}>
                {kelasData.jenis_kelas === 'standard' ? 'Standard' : 'Custom'}
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: kelasData.is_active ? '#d4edda' : '#f8d7da' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: kelasData.is_active ? '#155724' : '#721c24' }
                ]}>
                  {kelasData.is_active ? 'Aktif' : 'Nonaktif'}
                </Text>
              </View>
            </View>
            
            <View style={styles.urutanBadge}>
              <Text style={styles.urutanText}>#{kelasData.urutan}</Text>
            </View>
          </View>

          <Text style={styles.namaKelas}>{getDisplayName(kelasData)}</Text>
          
          {kelasData.jenjang && (
            <View style={styles.jenjangInfo}>
              <Ionicons name="library-outline" size={16} color="#666" />
              <Text style={styles.jenjangText}>{kelasData.jenjang.nama_jenjang}</Text>
            </View>
          )}

          {kelasData.jenis_kelas === 'standard' && kelasData.tingkat && (
            <View style={styles.tingkatInfo}>
              <Ionicons name="school-outline" size={16} color="#666" />
              <Text style={styles.tingkatText}>Tingkat {kelasData.tingkat}</Text>
            </View>
          )}
          
          {kelasData.deskripsi && (
            <Text style={styles.deskripsi}>{kelasData.deskripsi}</Text>
          )}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistik Penggunaan</Text>
          
          <StatsCard
            title="Total Materi"
            value={kelasData.materi?.length || kelasData.materi_count || 0}
            icon="document-text-outline"
            iconColor="#007bff"
          />
          
          {kelasData.created_at && (
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.metaText}>
                  Dibuat: {new Date(kelasData.created_at).toLocaleDateString('id-ID')}
                </Text>
              </View>
              
              {kelasData.updated_at && kelasData.updated_at !== kelasData.created_at && (
                <View style={styles.metaItem}>
                  <Ionicons name="create-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>
                    Diperbarui: {new Date(kelasData.updated_at).toLocaleDateString('id-ID')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

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
    alignItems: 'center',
    marginBottom: 12
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
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
  urutanBadge: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  urutanText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  namaKelas: {
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
    fontSize: 16,
    color: '#666',
    marginLeft: 8
  },
  tingkatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  tingkatText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8
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

export default KelasDetailScreen;