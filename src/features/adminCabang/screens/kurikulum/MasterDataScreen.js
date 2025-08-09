import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { BreadcrumbNavigation } from '../../components/kurikulum';
import { 
  useGetKelasCustomQuery, 
  useCreateKelasCustomMutation,
  useUpdateKelasCustomMutation,
  useDeleteKelasCustomMutation,
  useGetMataPelajaranCustomQuery,
  useCreateMataPelajaranCustomMutation,
  useUpdateMataPelajaranCustomMutation,
  useDeleteMataPelajaranCustomMutation,
  useGetJenjangQuery
} from '../../api/kurikulumApi';

const MasterDataScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState('kelas'); // kelas, mataPelajaran
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, edit
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    nama: '',
    tingkat: '',
    jenis: 'custom',
    deskripsi: '',
    is_global: false,
    target_jenjang: [],
    kelas_gabungan: [],
    kategori: 'wajib', // for mata pelajaran
    kode: '', // for mata pelajaran
  });

  // API hooks
  const { data: kelasData, isLoading: kelasLoading, refetch: refetchKelas } = useGetKelasCustomQuery();
  const { data: mataPelajaranData, isLoading: mataPelajaranLoading, refetch: refetchMataPelajaran } = useGetMataPelajaranCustomQuery();
  const { data: jenjangData } = useGetJenjangQuery();
  
  const [createKelas, { isLoading: isCreatingKelas }] = useCreateKelasCustomMutation();
  const [updateKelas, { isLoading: isUpdatingKelas }] = useUpdateKelasCustomMutation();
  const [deleteKelas, { isLoading: isDeletingKelas }] = useDeleteKelasCustomMutation();
  
  const [createMataPelajaran, { isLoading: isCreatingMataPelajaran }] = useCreateMataPelajaranCustomMutation();
  const [updateMataPelajaran, { isLoading: isUpdatingMataPelajaran }] = useUpdateMataPelajaranCustomMutation();
  const [deleteMataPelajaran, { isLoading: isDeletingMataPelajaran }] = useDeleteMataPelajaranCustomMutation();

  const breadcrumbPath = [
    { name: 'Kurikulum', screen: 'KurikulumHome' },
    { name: 'Master Data', screen: 'MasterData' }
  ];

  const handleNavigate = (index) => {
    if (index === 0) {
      navigation.navigate('KurikulumHome');
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      tingkat: '',
      jenis: 'custom',
      deskripsi: '',
      is_global: false,
      target_jenjang: [],
      kelas_gabungan: [],
      kategori: 'wajib',
      kode: '',
    });
  };

  const handleCreate = () => {
    resetForm();
    setModalMode('create');
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    if (selectedTab === 'kelas') {
      setFormData({
        nama: item.nama_kelas || '',
        tingkat: item.tingkat?.toString() || '',
        jenis: item.jenis_kelas || 'custom',
        deskripsi: item.deskripsi || '',
        is_global: item.is_global || false,
        target_jenjang: item.target_jenjang || [],
        kelas_gabungan: item.kelas_gabungan || [],
      });
    } else {
      setFormData({
        nama: item.nama_mata_pelajaran || '',
        kode: item.kode_mata_pelajaran || '',
        kategori: item.kategori || 'wajib',
        deskripsi: item.deskripsi || '',
        is_global: item.is_global || false,
        target_jenjang: item.target_jenjang || [],
        target_kelas: item.target_kelas || [],
      });
    }
    setModalMode('edit');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = (item) => {
    const itemName = selectedTab === 'kelas' ? item.nama_kelas : item.nama_mata_pelajaran;
    
    Alert.alert(
      `Hapus ${selectedTab === 'kelas' ? 'Kelas' : 'Mata Pelajaran'}`,
      `Apakah Anda yakin ingin menghapus "${itemName}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              if (selectedTab === 'kelas') {
                await deleteKelas(item.id_kelas).unwrap();
                refetchKelas();
              } else {
                await deleteMataPelajaran(item.id_mata_pelajaran).unwrap();
                refetchMataPelajaran();
              }
              Alert.alert('Sukses', `${selectedTab === 'kelas' ? 'Kelas' : 'Mata Pelajaran'} berhasil dihapus`);
            } catch (error) {
              Alert.alert('Error', `Gagal menghapus ${selectedTab === 'kelas' ? 'kelas' : 'mata pelajaran'}`);
            }
          }
        }
      ]
    );
  };

  const handleSubmit = async () => {
    if (!formData.nama.trim()) {
      Alert.alert('Error', 'Nama harus diisi');
      return;
    }

    try {
      if (selectedTab === 'kelas') {
        const kelasData = {
          nama_kelas: formData.nama,
          tingkat: parseInt(formData.tingkat) || null,
          jenis_kelas: formData.jenis,
          deskripsi: formData.deskripsi,
          is_global: formData.is_global,
          target_jenjang: formData.target_jenjang,
          kelas_gabungan: formData.kelas_gabungan,
        };

        if (modalMode === 'create') {
          await createKelas(kelasData).unwrap();
        } else {
          await updateKelas({ id: selectedItem.id_kelas, ...kelasData }).unwrap();
        }
        refetchKelas();
      } else {
        const mataPelajaranData = {
          nama_mata_pelajaran: formData.nama,
          kode_mata_pelajaran: formData.kode,
          kategori: formData.kategori,
          deskripsi: formData.deskripsi,
          is_global: formData.is_global,
          target_jenjang: formData.target_jenjang,
          target_kelas: formData.target_kelas,
        };

        if (modalMode === 'create') {
          await createMataPelajaran(mataPelajaranData).unwrap();
        } else {
          await updateMataPelajaran({ id: selectedItem.id_mata_pelajaran, ...mataPelajaranData }).unwrap();
        }
        refetchMataPelajaran();
      }

      Alert.alert(
        'Sukses',
        `${selectedTab === 'kelas' ? 'Kelas' : 'Mata Pelajaran'} berhasil ${modalMode === 'create' ? 'dibuat' : 'diperbarui'}`
      );
      setShowModal(false);
    } catch (error) {
      Alert.alert('Error', `Gagal ${modalMode === 'create' ? 'membuat' : 'memperbarui'} ${selectedTab === 'kelas' ? 'kelas' : 'mata pelajaran'}`);
    }
  };

  const renderKelasCard = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.cardHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.nama_kelas}</Text>
          <Text style={styles.itemSubtitle}>
            Tingkat: {item.tingkat || 'N/A'} • {item.jenis_kelas}
          </Text>
          <View style={styles.badgeContainer}>
            {item.is_global && (
              <View style={[styles.badge, styles.globalBadge]}>
                <Text style={styles.badgeText}>Global</Text>
              </View>
            )}
            <View style={[styles.badge, styles.customBadge]}>
              <Text style={styles.badgeText}>Custom</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="create" size={18} color="#1976d2" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash" size={18} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      </View>

      {item.deskripsi && (
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.deskripsi}
        </Text>
      )}

      {item.target_jenjang && item.target_jenjang.length > 0 && (
        <View style={styles.targetContainer}>
          <Text style={styles.targetLabel}>Target Jenjang:</Text>
          <Text style={styles.targetText}>{item.target_jenjang.join(', ')}</Text>
        </View>
      )}
    </View>
  );

  const renderMataPelajaranCard = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.cardHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.nama_mata_pelajaran}</Text>
          <Text style={styles.itemSubtitle}>
            Kode: {item.kode_mata_pelajaran || 'N/A'} • {item.kategori}
          </Text>
          <View style={styles.badgeContainer}>
            {item.is_global && (
              <View style={[styles.badge, styles.globalBadge]}>
                <Text style={styles.badgeText}>Global</Text>
              </View>
            )}
            <View style={[styles.badge, styles.customBadge]}>
              <Text style={styles.badgeText}>Custom</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="create" size={18} color="#1976d2" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash" size={18} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      </View>

      {item.deskripsi && (
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.deskripsi}
        </Text>
      )}

      {item.target_jenjang && item.target_jenjang.length > 0 && (
        <View style={styles.targetContainer}>
          <Text style={styles.targetLabel}>Target Jenjang:</Text>
          <Text style={styles.targetText}>{item.target_jenjang.join(', ')}</Text>
        </View>
      )}
    </View>
  );

  const renderModal = () => (
    <Modal
      visible={showModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {modalMode === 'create' ? 'Tambah' : 'Edit'} {selectedTab === 'kelas' ? 'Kelas' : 'Mata Pelajaran'}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowModal(false)}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>
              Nama {selectedTab === 'kelas' ? 'Kelas' : 'Mata Pelajaran'} *
            </Text>
            <TextInput
              style={styles.formInput}
              value={formData.nama}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nama: text }))}
              placeholder={`Masukkan nama ${selectedTab === 'kelas' ? 'kelas' : 'mata pelajaran'}`}
            />
          </View>

          {selectedTab === 'kelas' && (
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Tingkat</Text>
              <TextInput
                style={styles.formInput}
                value={formData.tingkat}
                onChangeText={(text) => setFormData(prev => ({ ...prev, tingkat: text }))}
                placeholder="Masukkan tingkat (1-12)"
                keyboardType="numeric"
              />
            </View>
          )}

          {selectedTab === 'mataPelajaran' && (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Kode Mata Pelajaran</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.kode}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, kode: text }))}
                  placeholder="Masukkan kode mata pelajaran"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Kategori</Text>
                <View style={styles.categoryContainer}>
                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      formData.kategori === 'wajib' && styles.categoryButtonActive
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, kategori: 'wajib' }))}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      formData.kategori === 'wajib' && styles.categoryButtonTextActive
                    ]}>
                      Wajib
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      formData.kategori === 'pilihan' && styles.categoryButtonActive
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, kategori: 'pilihan' }))}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      formData.kategori === 'pilihan' && styles.categoryButtonTextActive
                    ]}>
                      Pilihan
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Deskripsi</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={formData.deskripsi}
              onChangeText={(text) => setFormData(prev => ({ ...prev, deskripsi: text }))}
              placeholder="Masukkan deskripsi (opsional)"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.formLabel}>Global (Berlaku untuk semua cabang)</Text>
              <Switch
                value={formData.is_global}
                onValueChange={(value) => setFormData(prev => ({ ...prev, is_global: value }))}
                trackColor={{ false: '#ddd', true: '#1976d2' }}
                thumbColor={formData.is_global ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              onPress={handleSubmit}
              disabled={
                (selectedTab === 'kelas' && (isCreatingKelas || isUpdatingKelas)) ||
                (selectedTab === 'mataPelajaran' && (isCreatingMataPelajaran || isUpdatingMataPelajaran))
              }
            >
              {((selectedTab === 'kelas' && (isCreatingKelas || isUpdatingKelas)) ||
                (selectedTab === 'mataPelajaran' && (isCreatingMataPelajaran || isUpdatingMataPelajaran))) ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {modalMode === 'create' ? 'Tambah' : 'Perbarui'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const currentData = selectedTab === 'kelas' ? kelasData?.data || [] : mataPelajaranData?.data || [];
  const isLoading = selectedTab === 'kelas' ? kelasLoading : mataPelajaranLoading;

  return (
    <View style={styles.container}>
      <BreadcrumbNavigation path={breadcrumbPath} onNavigate={handleNavigate} />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'kelas' && styles.activeTab]}
          onPress={() => setSelectedTab('kelas')}
        >
          <Text style={[styles.tabText, selectedTab === 'kelas' && styles.activeTabText]}>
            Kelas Custom
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'mataPelajaran' && styles.activeTab]}
          onPress={() => setSelectedTab('mataPelajaran')}
        >
          <Text style={[styles.tabText, selectedTab === 'mataPelajaran' && styles.activeTabText]}>
            Mata Pelajaran
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {selectedTab === 'kelas' ? 'Kelas Custom' : 'Mata Pelajaran Custom'}
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          renderItem={selectedTab === 'kelas' ? renderKelasCard : renderMataPelajaranCard}
          keyExtractor={(item) => 
            selectedTab === 'kelas' ? item.id_kelas.toString() : item.id_mata_pelajaran.toString()
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={() => {
            if (selectedTab === 'kelas') {
              refetchKelas();
            } else {
              refetchMataPelajaran();
            }
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons 
                name={selectedTab === 'kelas' ? 'school-outline' : 'book-outline'} 
                size={64} 
                color="#ccc" 
              />
              <Text style={styles.emptyText}>
                Belum ada {selectedTab === 'kelas' ? 'kelas' : 'mata pelajaran'} custom
              </Text>
              <TouchableOpacity style={styles.emptyAddButton} onPress={handleCreate}>
                <Text style={styles.emptyAddButtonText}>Tambah Sekarang</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1976d2',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  globalBadge: {
    backgroundColor: '#4caf50',
  },
  customBadge: {
    backgroundColor: '#2196f3',
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  targetContainer: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  targetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  targetText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 16,
  },
  emptyAddButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  emptyAddButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  categoryButtonActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  submitButton: {
    backgroundColor: '#1976d2',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  submitButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});

export default MasterDataScreen;