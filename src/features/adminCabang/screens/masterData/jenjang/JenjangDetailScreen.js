import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../../common/components/ErrorMessage';
import ActionButton from '../../../components/shared/ActionButton';
import StatsCard from '../../../components/shared/StatsCard';
import { useJenjang } from '../../../hooks/useJenjang';

const JenjangDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, item } = route.params || {};
  
  const { getJenjangById, deleteJenjang } = useJenjang();
  const [jenjangData, setJenjangData] = useState(item || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id && !jenjangData) {
      fetchJenjangDetail();
    }
  }, [id, jenjangData]);

  const fetchJenjangDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getJenjangById(id);
      if (result.success) {
        setJenjangData(result.data);
        navigation.setOptions({ 
          headerTitle: result.data.nama_jenjang || 'Detail Jenjang' 
        });
      } else {
        setError(result.error || 'Gagal mengambil detail jenjang');
      }
    } catch (err) {
      setError('Gagal mengambil detail jenjang');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('JenjangForm', { 
      mode: 'edit', 
      id: jenjangData.id_jenjang, 
      item: jenjangData 
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Hapus Jenjang',
      `Yakin ingin menghapus jenjang "${jenjangData.nama_jenjang}"?\n\nJenjang yang memiliki kelas atau mata pelajaran tidak dapat dihapus.`,
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
      const result = await deleteJenjang(jenjangData.id_jenjang);
      
      if (result.success) {
        Alert.alert(
          'Berhasil',
          'Jenjang berhasil dihapus',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Gagal menghapus jenjang');
      }
    } catch (err) {
      Alert.alert('Error', 'Gagal menghapus jenjang');
    } finally {
      setDeleting(false);
    }
  };

  const handleStats = () => {
    navigation.navigate('JenjangStats', { 
      id: jenjangData.id_jenjang, 
      item: jenjangData 
    });
  };

  if (loading && !jenjangData) {
    return <LoadingSpinner fullScreen message="Memuat detail jenjang..." />;
  }

  if (error && !jenjangData) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={fetchJenjangDetail} />
      </View>
    );
  }

  if (!jenjangData) {
    return (
      <View style={styles.container}>
        <ErrorMessage message="Data jenjang tidak ditemukan" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header Info */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.kodeJenjang}>{jenjangData.kode_jenjang}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: jenjangData.is_active ? '#d4edda' : '#f8d7da' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: jenjangData.is_active ? '#155724' : '#721c24' }
                ]}>
                  {jenjangData.is_active ? 'Aktif' : 'Nonaktif'}
                </Text>
              </View>
            </View>
            
            <View style={styles.urutanBadge}>
              <Text style={styles.urutanText}>#{jenjangData.urutan}</Text>
            </View>
          </View>

          <Text style={styles.namaJenjang}>{jenjangData.nama_jenjang}</Text>
          
          {jenjangData.deskripsi && (
            <Text style={styles.deskripsi}>{jenjangData.deskripsi}</Text>
          )}
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistik Penggunaan</Text>
          
          <StatsCard
            title="Total Kelas"
            value={jenjangData.kelas?.length || jenjangData.kelas_count || 0}
            icon="library-outline"
            iconColor="#007bff"
            onPress={() => console.log('Navigate to kelas list')}
          />
          
          <StatsCard
            title="Mata Pelajaran"
            value={jenjangData.mata_pelajaran?.length || jenjangData.mata_pelajaran_count || 0}
            icon="book-outline"
            iconColor="#28a745"
            onPress={() => console.log('Navigate to mapel list')}
          />
          
          {jenjangData.created_at && (
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.metaText}>
                  Dibuat: {new Date(jenjangData.created_at).toLocaleDateString('id-ID')}
                </Text>
              </View>
              
              {jenjangData.updated_at && jenjangData.updated_at !== jenjangData.created_at && (
                <View style={styles.metaItem}>
                  <Ionicons name="create-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>
                    Diperbarui: {new Date(jenjangData.updated_at).toLocaleDateString('id-ID')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
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
  kodeJenjang: {
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
  namaJenjang: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
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

export default JenjangDetailScreen;