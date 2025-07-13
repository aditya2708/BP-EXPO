// src/features/adminCabang/screens/masterData/jenjang/JenjangDetailScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../../../../common/components/SafeAreaWrapper';
import DetailHeader from '../../../../../common/components/DetailHeader';
import DetailCard from '../../../../../common/components/DetailCard';
import StatCard from '../../../../../common/components/StatCard';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import { fetchJenjangById, deleteJenjang } from '../../../redux/masterData/jenjangSlice';

const JenjangDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { currentJenjang, loading, error } = useSelector(state => state.jenjang);
  const { id } = route.params;

  useEffect(() => {
    dispatch(fetchJenjangById(id));
  }, [dispatch, id]);

  const handleDelete = () => {
    Alert.alert(
      'Hapus Jenjang',
      `Yakin hapus "${currentJenjang?.nama}"? Data kelas dan mata pelajaran terkait akan terpengaruh.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteJenjang(id)).unwrap();
              Alert.alert('Sukses', 'Jenjang berhasil dihapus');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', err.message || 'Gagal menghapus jenjang');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Memuat detail jenjang..." />;
  }

  if (!currentJenjang) {
    return (
      <SafeAreaWrapper>
        <Text style={styles.errorText}>Jenjang tidak ditemukan</Text>
      </SafeAreaWrapper>
    );
  }

  const stats = [
    { label: 'Total Kelas', value: currentJenjang.kelas_count || 0, icon: 'library', color: '#3498db' },
    { label: 'Mata Pelajaran', value: currentJenjang.mata_pelajaran_count || 0, icon: 'book', color: '#2ecc71' },
    { label: 'Total Materi', value: currentJenjang.materi_count || 0, icon: 'document-text', color: '#e74c3c' }
  ];

  return (
    <SafeAreaWrapper>
      <DetailHeader
        title={currentJenjang.nama}
        subtitle="Detail Jenjang"
        onBack={() => navigation.goBack()}
        onEdit={() => navigation.navigate('JenjangForm', { id })}
        error={error}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>

        <DetailCard title="Informasi Jenjang">
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nama:</Text>
            <Text style={styles.value}>{currentJenjang.nama}</Text>
          </View>
          
          {currentJenjang.deskripsi && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Deskripsi:</Text>
              <Text style={styles.value}>{currentJenjang.deskripsi}</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Dibuat:</Text>
            <Text style={styles.value}>
              {new Date(currentJenjang.created_at).toLocaleDateString('id-ID')}
            </Text>
          </View>
        </DetailCard>

        {currentJenjang.kelas?.length > 0 && (
          <DetailCard title="Kelas Terkait">
            {currentJenjang.kelas.map((kelas) => (
              <TouchableOpacity 
                key={kelas.id}
                style={styles.relatedItem}
                onPress={() => navigation.navigate('KelasDetail', { id: kelas.id })}
              >
                <View style={styles.relatedInfo}>
                  <Text style={styles.relatedName}>{kelas.nama}</Text>
                  <Text style={styles.relatedDetail}>Tingkat {kelas.tingkat}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </DetailCard>
        )}
      </ScrollView>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('JenjangForm', { id })}>
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  relatedInfo: {
    flex: 1,
  },
  relatedName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  relatedDetail: {
    fontSize: 14,
    color: '#666',
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

export default JenjangDetailScreen;