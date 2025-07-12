// src/features/adminCabang/screens/akademik/kurikulum/KurikulumDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../../../../common/components/SafeAreaWrapper';
import DetailHeader from '../../../../../common/components/DetailHeader';
import DetailCard from '../../../../../common/components/DetailCard';
import StatCard from '../../../../../common/components/StatCard';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import MateriAssignmentModal from '../../../components/akademik/MateriAssignmentModal';
import { fetchKurikulumById, deleteKurikulum, removeMateri, reorderMateri } from '../../../redux/akademik/kurikulumSlice';

const KurikulumDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { currentKurikulum, loading, error } = useSelector(state => state.kurikulum);
  const { id } = route.params;
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    dispatch(fetchKurikulumById(id));
  }, [dispatch, id]);

  const handleDelete = () => {
    Alert.alert(
      'Hapus Kurikulum',
      `Yakin hapus "${currentKurikulum?.nama}"? Semester yang menggunakan kurikulum ini akan terpengaruh.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteKurikulum(id)).unwrap();
              Alert.alert('Sukses', 'Kurikulum berhasil dihapus');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', err.message || 'Gagal menghapus kurikulum');
            }
          }
        }
      ]
    );
  };

  const handleRemoveMateri = (materiId, materiNama) => {
    Alert.alert(
      'Hapus Materi',
      `Hapus "${materiNama}" dari kurikulum ini?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => dispatch(removeMateri({ kurikulumId: id, materiId }))
        }
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Memuat detail kurikulum..." />;
  }

  if (!currentKurikulum) {
    return (
      <SafeAreaWrapper>
        <Text style={styles.errorText}>Kurikulum tidak ditemukan</Text>
      </SafeAreaWrapper>
    );
  }

  const stats = [
    { label: 'Total Materi', value: currentKurikulum.materi_count || 0, icon: 'document-text', color: '#f39c12' },
    { label: 'Semester', value: currentKurikulum.semester_count || 0, icon: 'calendar', color: '#2ecc71' },
    { label: 'Completion', value: `${currentKurikulum.completion_rate || 0}%`, icon: 'checkmark-circle', color: '#3498db' }
  ];

  return (
    <SafeAreaWrapper>
      <DetailHeader
        title={currentKurikulum.nama}
        subtitle="Detail Kurikulum"
        onBack={() => navigation.goBack()}
        onEdit={() => navigation.navigate('KurikulumForm', { id })}
        error={error}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>

        <DetailCard title="Informasi Kurikulum">
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nama:</Text>
            <Text style={styles.value}>{currentKurikulum.nama}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Jenjang:</Text>
            <Text style={styles.value}>{currentKurikulum.jenjang?.nama || 'Tidak ada'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tahun Ajaran:</Text>
            <Text style={styles.value}>{currentKurikulum.tahun_ajaran}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Semester:</Text>
            <Text style={styles.value}>{currentKurikulum.semester}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Status:</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: currentKurikulum.is_active ? '#2ecc71' : '#95a5a6' }]}>
                <Text style={styles.statusText}>{currentKurikulum.is_active ? 'Aktif' : 'Nonaktif'}</Text>
              </View>
            </View>
          </View>
          
          {currentKurikulum.deskripsi && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Deskripsi:</Text>
              <Text style={styles.value}>{currentKurikulum.deskripsi}</Text>
            </View>
          )}
        </DetailCard>

        <DetailCard 
          title="Materi Assigned"
          action={{
            text: 'Assign Materi',
            onPress: () => setShowAssignModal(true),
            icon: 'add'
          }}
        >
          {currentKurikulum.materi?.length > 0 ? (
            currentKurikulum.materi.map((materi, index) => (
              <View key={materi.id} style={styles.materiItem}>
                <View style={styles.materiInfo}>
                  <Text style={styles.materiNama}>{materi.nama}</Text>
                  <Text style={styles.materiDetail}>
                    {materi.mata_pelajaran?.nama} • {materi.kelas?.nama}
                  </Text>
                </View>
                <View style={styles.materiActions}>
                  <View style={styles.urutanBadge}>
                    <Text style={styles.urutanText}>#{materi.pivot?.urutan || index + 1}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveMateri(materi.id, materi.nama)}
                  >
                    <Ionicons name="close" size={16} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Belum ada materi. Assign materi dari master data.</Text>
          )}
        </DetailCard>

        {currentKurikulum.semester?.length > 0 && (
          <DetailCard title="Digunakan di Semester">
            {currentKurikulum.semester.map((semester) => (
              <TouchableOpacity 
                key={semester.id}
                style={styles.semesterItem}
                onPress={() => navigation.navigate('SemesterDetail', { id: semester.id })}
              >
                <View style={styles.semesterInfo}>
                  <Text style={styles.semesterName}>{semester.nama}</Text>
                  <Text style={styles.semesterDetail}>
                    {semester.shelter?.nama} • {semester.tahun_ajaran}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </DetailCard>
        )}
      </ScrollView>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('KurikulumForm', { id })}>
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.assignButton} onPress={() => setShowAssignModal(true)}>
          <Ionicons name="link" size={20} color="#fff" />
          <Text style={styles.assignButtonText}>Assign</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Hapus</Text>
        </TouchableOpacity>
      </View>

      <MateriAssignmentModal
        visible={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        kurikulumId={id}
        currentMateri={currentKurikulum.materi || []}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  infoRow: { marginBottom: 12 },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  value: { fontSize: 16, color: '#333', fontWeight: '500' },
  statusContainer: { flexDirection: 'row' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  materiItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  materiInfo: { flex: 1 },
  materiNama: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  materiDetail: { fontSize: 14, color: '#666' },
  materiActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  urutanBadge: { backgroundColor: '#3498db', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, minWidth: 30, alignItems: 'center' },
  urutanText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  removeButton: { padding: 4 },
  emptyText: { fontSize: 14, color: '#999', textAlign: 'center', fontStyle: 'italic', paddingVertical: 20 },
  semesterItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  semesterInfo: { flex: 1 },
  semesterName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  semesterDetail: { fontSize: 14, color: '#666' },
  actionContainer: { flexDirection: 'row', padding: 16, gap: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3498db', paddingVertical: 14, borderRadius: 8, gap: 8 },
  assignButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2ecc71', paddingVertical: 14, borderRadius: 8, gap: 8 },
  deleteButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e74c3c', paddingVertical: 14, borderRadius: 8, gap: 8 },
  editButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  assignButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  deleteButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  errorText: { fontSize: 16, color: '#e74c3c', textAlign: 'center', marginTop: 50 },
});

export default KurikulumDetailScreen;