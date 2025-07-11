// src/features/adminCabang/screens/masterData/mataPelajaran/MataPelajaranDetailScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../../../components/common/SafeAreaWrapper';
import DetailHeader from '../../../../components/common/DetailHeader';
import DetailCard from '../../../../components/common/DetailCard';
import StatCard from '../../../../components/common/StatCard';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import { fetchMataPelajaranById, deleteMataPelajaran } from '../../../redux/masterData/mataPelajaranSlice';

const MataPelajaranDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { currentMataPelajaran, loading, error } = useSelector(state => state.mataPelajaran);
  const { id } = route.params;

  useEffect(() => {
    dispatch(fetchMataPelajaranById(id));
  }, [dispatch, id]);

  const handleDelete = () => {
    Alert.alert(
      'Hapus Mata Pelajaran',
      `Yakin hapus "${currentMataPelajaran?.nama}"? Data materi terkait akan terpengaruh.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteMataPelajaran(id)).unwrap();
              Alert.alert('Sukses', 'Mata pelajaran berhasil dihapus');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', err.message || 'Gagal menghapus mata pelajaran');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Memuat detail mata pelajaran..." />;
  }

  if (!currentMataPelajaran) {
    return (
      <SafeAreaWrapper>
        <Text style={styles.errorText}>Mata pelajaran tidak ditemukan</Text>
      </SafeAreaWrapper>
    );
  }

  const stats = [
    { label: 'Total Materi', value: currentMataPelajaran.materi_count || 0, icon: 'document-text', color: '#e74c3c' },
    { label: 'Kurikulum', value: currentMataPelajaran.kurikulum_count || 0, icon: 'library', color: '#8e44ad' },
    { label: 'Kelas Terkait', value: currentMataPelajaran.kelas_count || 0, icon: 'school', color: '#3498db' }
  ];

  return (
    <SafeAreaWrapper>
      <DetailHeader
        title={currentMataPelajaran.nama}
        subtitle="Detail Mata Pelajaran"
        onBack={() => navigation.goBack()}
        onEdit={() => navigation.navigate('MataPelajaranForm', { id })}
        error={error}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>

        <DetailCard title="Informasi Mata Pelajaran">
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nama:</Text>
            <Text style={styles.value}>{currentMataPelajaran.nama}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Jenjang:</Text>
            <Text style={styles.value}>{currentMataPelajaran.jenjang?.nama || 'Tidak ada'}</Text>
          </View>
          
          {currentMataPelajaran.deskripsi && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Deskripsi:</Text>
              <Text style={styles.value}>{currentMataPelajaran.deskripsi}</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Dibuat:</Text>
            <Text style={styles.value}>
              {new Date(currentMataPelajaran.created_at).toLocaleDateString('id-ID')}
            </Text>
          </View>
        </DetailCard>

        {currentMataPelajaran.materi?.length > 0 && (
          <DetailCard title="Materi Terkait">
            {currentMataPelajaran.materi.map((materi) => (
              <TouchableOpacity 
                key={materi.id}
                style={styles.relatedItem}
                onPress={() => navigation.navigate('MateriDetail', { id: materi.id })}
              >
                <View style={styles.relatedInfo}>
                  <Text style={styles.relatedName}>{materi.nama}</Text>
                  <Text style={styles.relatedDetail}>{materi.kelas?.nama || 'Tanpa kelas'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </DetailCard>
        )}
      </ScrollView>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('MataPelajaranForm', { id })}>
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
  container: { flex: 1 },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  infoRow: { marginBottom: 12 },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  value: { fontSize: 16, color: '#333', fontWeight: '500' },
  relatedItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  relatedInfo: { flex: 1 },
  relatedName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  relatedDetail: { fontSize: 14, color: '#666' },
  actionContainer: { flexDirection: 'row', padding: 16, gap: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3498db', paddingVertical: 14, borderRadius: 8, gap: 8 },
  deleteButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e74c3c', paddingVertical: 14, borderRadius: 8, gap: 8 },
  editButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  deleteButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  errorText: { fontSize: 16, color: '#e74c3c', textAlign: 'center', marginTop: 50 },
});

export default MataPelajaranDetailScreen;