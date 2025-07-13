// src/features/adminCabang/screens/masterData/materi/MateriDetailScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../../../../common/components/SafeAreaWrapper';
import DetailHeader from '../../../../../common/components/DetailHeader';
import DetailCard from '../../../../../common/components/DetailCard';
import StatCard from '../../../../../common/components/StatCard';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import { fetchMateriById, deleteMateri } from '../../../redux/masterData/materiSlice';

const MateriDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { currentMateri, loading, error } = useSelector(state => state.materi);
  const { id } = route.params;

  useEffect(() => {
    dispatch(fetchMateriById(id));
  }, [dispatch, id]);

  const handleDelete = () => {
    Alert.alert(
      'Hapus Materi',
      `Yakin hapus "${currentMateri?.nama}"? Materi akan dihapus dari semua kurikulum.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteMateri(id)).unwrap();
              Alert.alert('Sukses', 'Materi berhasil dihapus');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', err.message || 'Gagal menghapus materi');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Memuat detail materi..." />;
  }

  if (!currentMateri) {
    return (
      <SafeAreaWrapper>
        <Text style={styles.errorText}>Materi tidak ditemukan</Text>
      </SafeAreaWrapper>
    );
  }

  const stats = [
    { label: 'Kurikulum', value: currentMateri.kurikulum_count || 0, icon: 'library', color: '#8e44ad' },
    { label: 'Semester', value: currentMateri.semester_count || 0, icon: 'calendar', color: '#2ecc71' },
    { label: 'Views', value: currentMateri.view_count || 0, icon: 'eye', color: '#3498db' }
  ];

  return (
    <SafeAreaWrapper>
      <DetailHeader
        title={currentMateri.nama}
        subtitle="Detail Materi"
        onBack={() => navigation.goBack()}
        onEdit={() => navigation.navigate('MateriForm', { id })}
        error={error}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>

        <DetailCard title="Informasi Materi">
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nama:</Text>
            <Text style={styles.value}>{currentMateri.nama}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mata Pelajaran:</Text>
            <Text style={styles.value}>{currentMateri.mata_pelajaran?.nama || 'Tidak ada'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Kelas:</Text>
            <Text style={styles.value}>
              {currentMateri.kelas ? `${currentMateri.kelas.nama} - Tingkat ${currentMateri.kelas.tingkat}` : 'Tidak ada'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Jenjang:</Text>
            <Text style={styles.value}>{currentMateri.kelas?.jenjang?.nama || 'Tidak ada'}</Text>
          </View>
          
          {currentMateri.deskripsi && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Deskripsi:</Text>
              <Text style={styles.value}>{currentMateri.deskripsi}</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Dibuat:</Text>
            <Text style={styles.value}>
              {new Date(currentMateri.created_at).toLocaleDateString('id-ID')}
            </Text>
          </View>
        </DetailCard>

        {currentMateri.konten && (
          <DetailCard title="Konten Materi">
            <Text style={styles.konten}>{currentMateri.konten}</Text>
          </DetailCard>
        )}

        {currentMateri.kurikulum?.length > 0 && (
          <DetailCard title="Digunakan di Kurikulum">
            {currentMateri.kurikulum.map((kurikulum) => (
              <TouchableOpacity 
                key={kurikulum.id}
                style={styles.kurikulumItem}
                onPress={() => navigation.navigate('KurikulumDetail', { id: kurikulum.id })}
              >
                <View style={styles.kurikulumInfo}>
                  <Text style={styles.kurikulumName}>{kurikulum.nama}</Text>
                  <Text style={styles.kurikulumDetail}>
                    {kurikulum.jenjang?.nama || 'Tanpa jenjang'} • {kurikulum.materi_count || 0} materi
                  </Text>
                </View>
                <View style={styles.kurikulumUrutan}>
                  <Text style={styles.urutanText}>#{kurikulum.pivot?.urutan || '-'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </DetailCard>
        )}
      </ScrollView>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('MateriForm', { id })}>
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
  konten: { fontSize: 16, color: '#333', lineHeight: 24 },
  kurikulumItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  kurikulumInfo: { flex: 1 },
  kurikulumName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  kurikulumDetail: { fontSize: 14, color: '#666' },
  kurikulumUrutan: { backgroundColor: '#2ecc71', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, minWidth: 30, alignItems: 'center', marginRight: 8 },
  urutanText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  actionContainer: { flexDirection: 'row', padding: 16, gap: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3498db', paddingVertical: 14, borderRadius: 8, gap: 8 },
  deleteButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e74c3c', paddingVertical: 14, borderRadius: 8, gap: 8 },
  editButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  deleteButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  errorText: { fontSize: 16, color: '#e74c3c', textAlign: 'center', marginTop: 50 },
});

export default MateriDetailScreen;