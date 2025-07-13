// src/features/adminCabang/screens/akademik/kurikulum/KurikulumDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../../../../common/components/SafeAreaWrapper';
import DetailHeader from '../../../../../common/components/DetailHeader';
import DetailCard from '../../../../../common/components/DetailCard';
import StatCard from '../../../../../common/components/StatCard';
import LoadingSpinner from '../../../../../common/components/LoadingSpinner';
import MateriAssignmentModal from '../../../components/akademik/MateriAssignmentModal';
import { 
  fetchKurikulumById, 
  deleteKurikulum, 
  removeMateri, 
  reorderMateri,
  selectCurrentKurikulum,
  selectKurikulumLoading,
  selectKurikulumError
} from '../../../redux/akademik/kurikulumSlice';

const KurikulumDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const currentKurikulum = useSelector(selectCurrentKurikulum);
  const loading = useSelector(selectKurikulumLoading);
  const error = useSelector(selectKurikulumError);
  const { id } = route.params;
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    dispatch(fetchKurikulumById(id));
  }, [dispatch, id]);

  const handleDelete = () => {
    Alert.alert(
      'Hapus Kurikulum',
      `Yakin hapus "${currentKurikulum?.nama_kurikulum}"? Semester yang menggunakan kurikulum ini akan terpengaruh.`,
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
    { 
      label: 'Total Materi', 
      value: currentKurikulum.kurikulum_materi_count || currentKurikulum.kurikulum_materi?.length || 0, 
      icon: 'document-text', 
      color: '#f39c12' 
    },
    { 
      label: 'Semester', 
      value: currentKurikulum.semester_count || currentKurikulum.semester?.length || 0, 
      icon: 'calendar', 
      color: '#2ecc71' 
    },
    { 
      label: 'Mata Pelajaran', 
      value: currentKurikulum.total_mata_pelajaran || 0, 
      icon: 'checkmark-circle', 
      color: '#3498db' 
    }
  ];

  return (
    <SafeAreaWrapper>
      <DetailHeader
        title={currentKurikulum.nama_kurikulum}
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
            <Text style={styles.value}>{currentKurikulum.nama_kurikulum}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Cabang:</Text>
            <Text style={styles.value}>{currentKurikulum.kacab?.nama_kacab || 'Tidak ada'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tahun Berlaku:</Text>
            <Text style={styles.value}>{currentKurikulum.tahun_berlaku}</Text>
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
          {currentKurikulum.kurikulum_materi?.length > 0 ? (
            currentKurikulum.kurikulum_materi.map((kurikulumMateri, index) => (
              <View key={kurikulumMateri.id} style={styles.materiItem}>
                <View style={styles.materiInfo}>
                  <Text style={styles.materiNama}>{kurikulumMateri.materi?.nama_materi}</Text>
                  <Text style={styles.materiDetail}>
                    {kurikulumMateri.materi?.mata_pelajaran?.nama_mata_pelajaran} • {kurikulumMateri.materi?.kelas?.nama_kelas}
                  </Text>
                </View>
                <View style={styles.materiActions}>
                  <View style={styles.urutanBadge}>
                    <Text style={styles.urutanText}>#{kurikulumMateri.urutan || index + 1}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveMateri(kurikulumMateri.id_materi, kurikulumMateri.materi?.nama_materi)}
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
                key={semester.id_semester}
                style={styles.semesterItem}
                onPress={() => navigation.navigate('SemesterDetail', { id: semester.id_semester })}
              >
                <View style={styles.semesterInfo}>
                  <Text style={styles.semesterName}>{semester.nama_semester}</Text>
                  <Text style={styles.semesterDetail}>
                    {semester.tahun_ajaran} • {semester.periode}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </DetailCard>
        )}
      </ScrollView>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => navigation.navigate('KurikulumForm', { id })}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.assignButton} 
          onPress={() => setShowAssignModal(true)}
        >
          <Ionicons name="link" size={20} color="#fff" />
          <Text style={styles.assignButtonText}>Assign</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Hapus</Text>
        </TouchableOpacity>
      </View>

      <MateriAssignmentModal
        visible={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        kurikulumId={id}
        currentMateri={currentKurikulum.kurikulum_materi || []}
        onAssign={() => {
          setShowAssignModal(false);
          dispatch(fetchKurikulumById(id));
        }}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#e74c3c',
    fontSize: 16,
    marginTop: 50,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  statusContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  materiItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  materiInfo: {
    flex: 1,
  },
  materiNama: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  materiDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  materiActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urutanBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  urutanText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#ffeaea',
    borderRadius: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  semesterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  semesterInfo: {
    flex: 1,
  },
  semesterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  semesterDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  assignButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default KurikulumDetailScreen;