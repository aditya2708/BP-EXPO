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
    materi: ''
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
      materi: ''
    });
    setShowAddModal(true);
  };

  const handleSubmitMateri = async () => {
    if (!formData.mataPelajaran || !formData.materi) {
      safeAlert('Error', 'Mata pelajaran dan materi wajib diisi');
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(addMateri({
        id: kurikulumId,
        materiData: {
          id_mata_pelajaran: formData.mataPelajaran,
          id_materi: formData.materi
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

  const handleDeleteMateri = (materiId) => {
    safeAlert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menghapus materi ini dari kurikulum?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(removeMateri({ kurikulumId, materiId })).unwrap();
              safeAlert('Sukses', 'Materi berhasil dihapus dari kurikulum');
            } catch (err) {
              safeAlert('Error', err.message || 'Gagal menghapus materi');
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
      kurikulumMateri={item}
      onDelete={() => handleDeleteMateri(item.id)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Materi Kurikulum</Text>
        <Text style={styles.headerSubtitle}>{kurikulum?.nama_kurikulum}</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddMateri}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  if (loading && !kurikulumDetail) {
    return <LoadingSpinner />;
  }

  if (error && !kurikulumDetail) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadData}
      />
    );
  }

  const materiList = kurikulumDetail?.kurikulum_materi || [];

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={materiList}
        renderItem={renderMateriItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2ecc71']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={80} color="#bdc3c7" />
            <Text style={styles.emptyText}>Belum ada materi dalam kurikulum</Text>
            <Text style={styles.emptySubtext}>Tap tombol + untuk menambah materi</Text>
          </View>
        }
      />

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
                disabled={submitting}
              />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 8,
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