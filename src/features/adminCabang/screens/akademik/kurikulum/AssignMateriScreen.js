import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// ✨ REFACTORED: Use unified hooks instead of individual slices
import { useEntityCRUD } from '../../../logic/entityHooks';
import { useErrorHandler } from '../../../logic/entityHooks';
import MateriAssignmentModal from '../../../components/akademik/MateriAssignmentModal';

const AssignMateriScreen = ({ route, navigation }) => {
  const { kurikulumId, kurikulumName } = route.params || {};
  
  // ✨ REFACTORED: Use unified entity hooks
  const {
    currentItem: kurikulum,
    loading: kurikulumLoading,
    error: kurikulumError,
    fetchById: fetchKurikulum,
    assignMateri,
    removeMateri,
    reorderMateri,
  } = useEntityCRUD('kurikulum');

  const { handleError, showSuccess } = useErrorHandler();

  // Local state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [materiList, setMateriList] = useState([]);
  const [isReordering, setIsReordering] = useState(false);
  const [selectedMateriForRemoval, setSelectedMateriForRemoval] = useState(null);

  // Load kurikulum data
  useFocusEffect(
    React.useCallback(() => {
      if (kurikulumId) {
        loadKurikulumData();
      }
    }, [kurikulumId])
  );

  const loadKurikulumData = async () => {
    try {
      const result = await fetchKurikulum(kurikulumId);
      if (result?.materi) {
        setMateriList(result.materi);
      }
    } catch (err) {
      handleError(err, 'Gagal memuat data kurikulum');
    }
  };

  const handleAssignSuccess = () => {
    setShowAssignModal(false);
    loadKurikulumData();
    showSuccess('Materi berhasil di-assign ke kurikulum');
  };

  const handleRemoveMateri = (materi) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Yakin ingin menghapus "${materi.nama_materi}" dari kurikulum?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => confirmRemoveMateri(materi),
        },
      ]
    );
  };

  const confirmRemoveMateri = async (materi) => {
    try {
      await removeMateri(kurikulumId, materi.id_materi);
      loadKurikulumData();
      showSuccess('Materi berhasil dihapus dari kurikulum');
    } catch (err) {
      handleError(err, 'Gagal menghapus materi');
    }
  };

  const handleReorderMateri = async (materiOrder) => {
    setIsReordering(true);
    try {
      await reorderMateri(kurikulumId, materiOrder);
      loadKurikulumData();
      showSuccess('Urutan materi berhasil diperbarui');
    } catch (err) {
      handleError(err, 'Gagal mengubah urutan materi');
    } finally {
      setIsReordering(false);
    }
  };

  const moveMateriUp = (index) => {
    if (index > 0) {
      const newOrder = [...materiList];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      
      const materiOrder = newOrder.map((materi, idx) => ({
        id_materi: materi.id_materi,
        urutan: idx + 1,
      }));
      
      handleReorderMateri(materiOrder);
    }
  };

  const moveMateriDown = (index) => {
    if (index < materiList.length - 1) {
      const newOrder = [...materiList];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      
      const materiOrder = newOrder.map((materi, idx) => ({
        id_materi: materi.id_materi,
        urutan: idx + 1,
      }));
      
      handleReorderMateri(materiOrder);
    }
  };

  const renderHeaderActions = () => (
    <View style={styles.headerActions}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAssignModal(true)}
        testID="add-materi-button"
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Tambah Materi</Text>
      </TouchableOpacity>
    </View>
  );

  const renderKurikulumInfo = () => (
    <View style={styles.infoCard}>
      <View style={styles.infoHeader}>
        <Ionicons name="library" size={24} color="#3498db" />
        <View style={styles.infoContent}>
          <Text style={styles.kurikulumTitle}>{kurikulumName || kurikulum?.nama_kurikulum}</Text>
          <Text style={styles.kurikulumSubtitle}>
            {kurikulum?.jenjang?.nama_jenjang || 'Semua Jenjang'}
          </Text>
        </View>
        <View style={styles.materiCount}>
          <Text style={styles.countNumber}>{materiList.length}</Text>
          <Text style={styles.countLabel}>Materi</Text>
        </View>
      </View>
      
      {kurikulum?.deskripsi && (
        <Text style={styles.kurikulumDescription}>{kurikulum.deskripsi}</Text>
      )}
    </View>
  );

  const renderMateriItem = (materi, index) => (
    <View key={materi.id_materi} style={styles.materiItem}>
      <View style={styles.materiHeader}>
        <View style={styles.urutanBadge}>
          <Text style={styles.urutanText}>{materi.urutan || index + 1}</Text>
        </View>
        <View style={styles.materiInfo}>
          <Text style={styles.materiName}>{materi.nama_materi}</Text>
          <Text style={styles.materiCode}>Kode: {materi.kode_materi}</Text>
        </View>
        <View style={styles.materiActions}>
          <TouchableOpacity
            style={[styles.actionButton, { opacity: index === 0 ? 0.3 : 1 }]}
            onPress={() => moveMateriUp(index)}
            disabled={index === 0 || isReordering}
          >
            <Ionicons name="chevron-up" size={16} color="#7f8c8d" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { opacity: index === materiList.length - 1 ? 0.3 : 1 }]}
            onPress={() => moveMateriDown(index)}
            disabled={index === materiList.length - 1 || isReordering}
          >
            <Ionicons name="chevron-down" size={16} color="#7f8c8d" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => handleRemoveMateri(materi)}
            disabled={isReordering}
          >
            <Ionicons name="trash" size={16} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.materiMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="book-outline" size={14} color="#7f8c8d" />
          <Text style={styles.metaText}>
            {materi.mata_pelajaran?.nama_mata_pelajaran || 'N/A'}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={14} color="#7f8c8d" />
          <Text style={styles.metaText}>
            {materi.kelas?.nama_kelas || 'N/A'}
          </Text>
        </View>
      </View>

      {materi.deskripsi && (
        <Text style={styles.materiDescription} numberOfLines={2}>
          {materi.deskripsi}
        </Text>
      )}
    </View>
  );

  const renderMateriList = () => {
    if (kurikulumLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Memuat materi kurikulum...</Text>
        </View>
      );
    }

    if (materiList.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="library-outline" size={64} color="#bdc3c7" />
          <Text style={styles.emptyTitle}>Belum ada materi</Text>
          <Text style={styles.emptySubtitle}>
            Tambahkan materi untuk melengkapi kurikulum ini
          </Text>
          <TouchableOpacity
            style={styles.emptyActionButton}
            onPress={() => setShowAssignModal(true)}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.emptyActionText}>Tambah Materi</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.materiContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Daftar Materi ({materiList.length})</Text>
          {isReordering && (
            <View style={styles.reorderingIndicator}>
              <ActivityIndicator size="small" color="#3498db" />
              <Text style={styles.reorderingText}>Mengubah urutan...</Text>
            </View>
          )}
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {materiList.map((materi, index) => renderMateriItem(materi, index))}
        </ScrollView>
      </View>
    );
  };

  if (kurikulumError && !kurikulum) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#e74c3c" />
          <Text style={styles.errorTitle}>Gagal memuat kurikulum</Text>
          <Text style={styles.errorMessage}>
            {typeof kurikulumError === 'string' ? kurikulumError : kurikulumError?.message || 'Terjadi kesalahan'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadKurikulumData}>
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderHeaderActions()}
        {renderKurikulumInfo()}
        {renderMateriList()}
      </ScrollView>

      <MateriAssignmentModal
        visible={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        kurikulumId={kurikulumId}
        kurikulumName={kurikulumName || kurikulum?.nama_kurikulum}
        onAssignSuccess={handleAssignSuccess}
        testID="materi-assignment-modal"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  headerActions: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  kurikulumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  kurikulumSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  materiCount: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  countNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
  },
  countLabel: {
    fontSize: 12,
    color: '#3498db',
  },
  kurikulumDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  materiContainer: {
    flex: 1,
    margin: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  reorderingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reorderingText: {
    fontSize: 14,
    color: '#3498db',
  },
  materiItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  materiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  urutanBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  urutanText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  materiInfo: {
    flex: 1,
  },
  materiName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  materiCode: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  materiActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  removeButton: {
    backgroundColor: '#ffeaea',
  },
  materiMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  materiDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyActionButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  emptyActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AssignMateriScreen;