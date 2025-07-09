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
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';

import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import MateriKurikulumCard from '../components/MateriKurikulumCard';

import {
  fetchKurikulumDetail,
  addMateri,
  removeMateri,
  selectKurikulumDetail,
  selectKurikulumLoading,
  selectKurikulumError
} from '../redux/kurikulumSlice';

import {
  fetchForDropdown,
  selectDropdownData
} from '../redux/mataPelajaranSlice';

const MateriKurikulumScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { kurikulumId, kurikulum } = route.params;
  
  const kurikulumDetail = useSelector(selectKurikulumDetail);
  const loading = useSelector(selectKurikulumLoading);
  const error = useSelector(selectKurikulumError);
  const mataPelajaranDropdown = useSelector(selectDropdownData);
  
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id_mata_pelajaran: '',
    id_materi: '',
    jam_pelajaran: '60'
  });
  const [availableMateri, setAvailableMateri] = useState([]);

  useEffect(() => {
    loadData();
  }, [kurikulumId]);

  const loadData = async () => {
    dispatch(fetchKurikulumDetail(kurikulumId));
    dispatch(fetchForDropdown());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddMateri = () => {
    setFormData({
      id_mata_pelajaran: '',
      id_materi: '',
      jam_pelajaran: '60'
    });
    setAvailableMateri([]);
    setShowAddModal(true);
  };

  const handleMataPelajaranChange = (mataPelajaranId) => {
    setFormData(prev => ({ ...prev, id_mata_pelajaran: mataPelajaranId, id_materi: '' }));
    
    // Mock available materi - in real app, fetch from API based on mata pelajaran
    const mockMateri = [
      { id_materi: 1, nama_materi: 'Pengenalan Dasar' },
      { id_materi: 2, nama_materi: 'Konsep Menengah' },
      { id_materi: 3, nama_materi: 'Praktik Lanjutan' }
    ];
    setAvailableMateri(mockMateri);
  };

  const handleSubmitMateri = async () => {
    if (!formData.id_mata_pelajaran || !formData.id_materi || !formData.jam_pelajaran) {
      Alert.alert('Error', 'Semua field wajib diisi');
      return;
    }

    const jamPelajaran = parseInt(formData.jam_pelajaran);
    if (isNaN(jamPelajaran) || jamPelajaran < 1) {
      Alert.alert('Error', 'Jam pelajaran harus berupa angka positif');
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(addMateri({
        id: kurikulumId,
        materiData: {
          id_mata_pelajaran: formData.id_mata_pelajaran,
          id_materi: formData.id_materi,
          jam_pelajaran: jamPelajaran
        }
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
              await dispatch(removeMateri({
                id: kurikulumId,
                materiId: materiItem.id
              })).unwrap();
              Alert.alert('Sukses', 'Materi berhasil dihapus dari kurikulum');
            } catch (err) {
              Alert.alert('Error', 'Gagal menghapus materi');
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
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mata Pelajaran *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.id_mata_pelajaran}
                  onValueChange={handleMataPelajaranChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Pilih Mata Pelajaran" value="" />
                  {Object.keys(mataPelajaranDropdown).map((kategori) => 
                    mataPelajaranDropdown[kategori].map((mp) => (
                      <Picker.Item
                        key={mp.id_mata_pelajaran}
                        label={`${mp.nama_mata_pelajaran} (${kategori})`}
                        value={mp.id_mata_pelajaran.toString()}
                      />
                    ))
                  )}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Materi *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.id_materi}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, id_materi: value }))}
                  style={styles.picker}
                  enabled={availableMateri.length > 0}
                >
                  <Picker.Item label="Pilih Materi" value="" />
                  {availableMateri.map((materi) => (
                    <Picker.Item
                      key={materi.id_materi}
                      label={materi.nama_materi}
                      value={materi.id_materi.toString()}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Jam Pelajaran *</Text>
              <TextInput
                style={styles.input}
                value={formData.jam_pelajaran}
                onChangeText={(value) => setFormData(prev => ({ ...prev, jam_pelajaran: value }))}
                placeholder="Contoh: 60"
                keyboardType="numeric"
              />
              <Text style={styles.helpText}>Dalam satuan menit</Text>
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowAddModal(false)}
              disabled={submitting}
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyText}>Belum ada materi</Text>
            <Text style={styles.emptySubText}>Tap "Tambah Materi" untuk menambah materi ke kurikulum</Text>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
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