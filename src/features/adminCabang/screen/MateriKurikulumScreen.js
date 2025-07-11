import React, { useState, useEffect } from 'react';
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
  Switch
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import CascadeSelector from '../components/CascadeSelector';
import MateriKurikulumCard from '../components/MateriKurikulumCard';

import {
  fetchKurikulumDetail,
  addMateri,
  deleteMateri,
  selectKurikulumDetail,
  selectKurikulumLoading,
  selectKurikulumError
} from '../redux/kurikulumSlice';

const MateriKurikulumScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { kurikulumId } = route.params;
  
  const kurikulum = useSelector(selectKurikulumDetail);
  const loading = useSelector(selectKurikulumLoading);
  const error = useSelector(selectKurikulumError);
  
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createNewMateri, setCreateNewMateri] = useState(false);
  
  const [formData, setFormData] = useState({
    jenjang: '',
    mataPelajaran: '',
    kelas: '',
    materi: '',
    newMateriName: ''
  });

  useEffect(() => {
    loadData();
  }, [kurikulumId]);

  const loadData = async () => {
    dispatch(fetchKurikulumDetail(kurikulumId));
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
      newMateriName: ''
    });
    setCreateNewMateri(false);
    setShowAddModal(true);
  };

  const updateFormField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitMateri = async () => {
    // Validation
    if (!formData.mataPelajaran || !formData.kelas) {
      Alert.alert('Error', 'Mata pelajaran dan kelas wajib dipilih');
      return;
    }

    if (createNewMateri) {
      if (!formData.newMateriName.trim()) {
        Alert.alert('Error', 'Nama materi baru wajib diisi');
        return;
      }
    } else {
      if (!formData.materi) {
        Alert.alert('Error', 'Materi wajib dipilih');
        return;
      }
    }

    setSubmitting(true);
    try {
      const materiData = {
        id_mata_pelajaran: formData.mataPelajaran,
        id_kelas: formData.kelas
      };

      if (createNewMateri) {
        materiData.new_materi_name = formData.newMateriName.trim();
      } else {
        materiData.id_materi = formData.materi;
      }

      await dispatch(addMateri({
        id: kurikulumId,
        materiData
      })).unwrap();
      
      setShowAddModal(false);
      Alert.alert('Sukses', 'Materi berhasil ditambahkan ke kurikulum');
    } catch (err) {
      Alert.alert('Error', err.message || 'Gagal menambahkan materi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMateri = (materiItem) => {
    Alert.alert(
      'Hapus Materi',
      `Hapus ${materiItem.materi?.nama_materi} dari kurikulum?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteMateri({
                kurikulumId,
                materiId: materiItem.id
              })).unwrap();
              Alert.alert('Sukses', 'Materi berhasil dihapus dari kurikulum');
            } catch (err) {
              Alert.alert('Error', err.message || 'Gagal menghapus materi');
            }
          }
        }
      ]
    );
  };

  const renderMateriItem = ({ item }) => (
    <MateriKurikulumCard
      materiItem={item}
      onDelete={() => handleDeleteMateri(item)}
    />
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Materi Kurikulum</Text>
          <Text style={styles.subtitle}>{kurikulum?.nama_kurikulum}</Text>
        </View>
      </View>

      <View style={styles.actionHeader}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddMateri}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Tambah Materi</Text>
        </TouchableOpacity>
      </View>

      {kurikulum?.kurikulum_materi?.length > 0 ? (
        <FlatList
          data={kurikulum.kurikulum_materi}
          renderItem={renderMateriItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.materiList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={64} color="#bdc3c7" />
          <Text style={styles.emptyText}>Belum ada materi</Text>
          <Text style={styles.emptySubText}>Tap "Tambah Materi" untuk menambah materi ke kurikulum</Text>
        </View>
      )}

      {/* Add Materi Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowAddModal(false)}
              disabled={submitting}
            >
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Tambah Materi</Text>
            <TouchableOpacity
              onPress={handleSubmitMateri}
              disabled={submitting}
            >
              <Text style={[styles.saveText, submitting && styles.disabledText]}>
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <CascadeSelector
              selectedJenjang={formData.jenjang}
              selectedMataPelajaran={formData.mataPelajaran}
              selectedKelas={formData.kelas}
              selectedMateri={formData.materi}
              onJenjangChange={(value) => updateFormField('jenjang', value)}
              onMataPelajaranChange={(value) => updateFormField('mataPelajaran', value)}
              onKelasChange={(value) => updateFormField('kelas', value)}
              onMateriChange={(value) => updateFormField('materi', value)}
              onNewMateriNameChange={(value) => updateFormField('newMateriName', value)}
              createMode={createNewMateri}
              onCreateModeChange={setCreateNewMateri}
              newMateriName={formData.newMateriName}
              disabled={submitting}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  backButton: {
    padding: 8,
    marginRight: 8
  },
  headerTitle: {
    flex: 1
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50'
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2
  },
  actionHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8
  },
  materiList: {
    padding: 16
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6c757d',
    marginTop: 16,
    textAlign: 'center'
  },
  emptySubText: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 8,
    textAlign: 'center'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50'
  },
  cancelText: {
    fontSize: 16,
    color: '#6c757d'
  },
  saveText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007bff'
  },
  disabledText: {
    color: '#adb5bd'
  },
  modalContent: {
    flex: 1,
    padding: 16
  }
});

export default MateriKurikulumScreen;