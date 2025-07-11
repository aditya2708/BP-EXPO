import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import MateriKurikulumCard from '../components/MateriKurikulumCard';
import CascadeSelector from '../components/CascadeSelector';

import {
  fetchKurikulumDetail,
  addMateri,
  removeMateri,
  selectKurikulumDetail,
  selectKurikulumLoading,
  selectKurikulumError
} from '../redux/kurikulumSlice';

const MateriKurikulumScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const isMounted = useRef(true);
  
  const { kurikulumId, kurikulum } = route.params;
  
  const kurikulumDetail = useSelector(selectKurikulumDetail);
  const loading = useSelector(selectKurikulumLoading);
  const error = useSelector(selectKurikulumError);
  
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    jenjang: '',
    mataPelajaran: '',
    kelas: '',
    materi: '',
    jamPelajaran: '60'
  });

  useEffect(() => {
    isMounted.current = true;
    loadData();
    
    return () => {
      isMounted.current = false;
    };
  }, [kurikulumId]);

  const safeAlert = (title, message, buttons) => {
    if (isMounted.current) {
      setTimeout(() => {
        if (isMounted.current) {
          Alert.alert(title, message, buttons);
        }
      }, 100);
    }
  };

  const loadData = async () => {
    if (kurikulumId) {
      dispatch(fetchKurikulumDetail(kurikulumId));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddMateri = () => {
    setFormData({
      jenjang: '',
      mataPelajaran: '',
      kelas: '',
      materi: '',
      jamPelajaran: '60'
    });
    setShowAddModal(true);
  };

  const handleSubmitMateri = async () => {
    if (!formData.mataPelajaran || !formData.materi || !formData.jamPelajaran) {
      safeAlert('Error', 'Semua field wajib diisi');
      return;
    }

    const jamPelajaran = parseInt(formData.jamPelajaran);
    if (isNaN(jamPelajaran) || jamPelajaran < 1) {
      safeAlert('Error', 'Jam pelajaran harus berupa angka positif');
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(addMateri({
        id: kurikulumId,
        materiData: {
          id_mata_pelajaran: formData.mataPelajaran,
          id_materi: formData.materi,
          jam_pelajaran: jamPelajaran
        }
      })).unwrap();
      
      setShowAddModal(false);
      safeAlert('Sukses', 'Materi berhasil ditambahkan ke kurikulum');
    } catch (err) {
      safeAlert('Error', err.message || 'Gagal menambahkan materi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMateri = (materiItem) => {
    safeAlert(
      'Hapus Materi',
      `Hapus ${materiItem.materi?.nama_materi} dari kurikulum?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(removeMateri({
                id: kurikulumId,
                materiId: materiItem.id
              })).unwrap();
              safeAlert('Sukses', 'Materi berhasil dihapus dari kurikulum');
            } catch (err) {
              safeAlert('Error', 'Gagal menghapus materi');
            }
          }
        }
      ]
    );
  };

  const updateFormField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderMateriItem = ({ item }) => (
    <MateriKurikulumCard
      materiItem={item}
      onDelete={() => handleDeleteMateri(item)}
    />
  );

  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tambah Materi</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <CascadeSelector
              selectedJenjang={formData.jenjang}
              selectedMataPelajaran={formData.mataPelajaran}
              selectedKelas={formData.kelas}
              selectedMateri={formData.materi}
              onJenjangChange={(value) => updateFormField('jenjang', value)}
              onMataPelajaranChange={(value) => updateFormField('mataPelajaran', value)}
              onKelasChange={(value) => updateFormField('kelas', value)}
              onMateriChange={(value) => updateFormField('materi', value)}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Jam Pelajaran</Text>
              <TextInput
                style={styles.input}
                value={formData.jamPelajaran}
                onChangeText={(value) => updateFormField('jamPelajaran', value)}
                placeholder="Masukkan jam pelajaran"
                keyboardType="numeric"
              />
              <Text style={styles.helpText}>Durasi dalam menit (contoh: 60 untuk 1 jam)</Text>
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmitMateri}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Tambah</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen message="Memuat materi kurikulum..." />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={loadData} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{kurikulum?.nama_kurikulum}</Text>
        <Text style={styles.headerSubtitle}>
          {kurikulumDetail?.kurikulum_materi?.length || 0} Materi
        </Text>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMateri}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Tambah Materi</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={kurikulumDetail?.kurikulum_materi || []}
        renderItem={renderMateriItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyText}>Belum ada materi</Text>
            <Text style={styles.emptySubText}>
              Tap "Tambah Materi" untuk menambah materi ke kurikulum
            </Text>
          </View>
        }
      />

      {renderAddModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionContainer: {
    padding: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 4,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MateriKurikulumScreen;