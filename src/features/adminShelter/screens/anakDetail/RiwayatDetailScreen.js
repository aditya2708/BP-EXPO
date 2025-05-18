import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Button from '../../../../common/components/Button';
import LoadingSpinner from '../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../common/components/ErrorMessage';

// Import utils
import { formatDateToIndonesian } from '../../../../common/utils/dateFormatter';

// Import API
import { adminShelterRiwayatApi } from '../../api/adminShelterRiwayatApi';

const { width } = Dimensions.get('window');

const RiwayatDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { anakData, anakId, riwayatId, riwayatData } = route.params || {};
  
  const [loading, setLoading] = useState(!riwayatData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [riwayat, setRiwayat] = useState(riwayatData || null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Set screen title
  useEffect(() => {
    navigation.setOptions({
      title: 'Detail Riwayat',
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={handleEdit}
          >
            <Ionicons name="create-outline" size={24} color="#e74c3c" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={confirmDelete}
          >
            <Ionicons name="trash-outline" size={24} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation, riwayat]);

  // Fetch riwayat data if not provided
  useEffect(() => {
    if (!riwayatData && anakId && riwayatId) {
      fetchRiwayatData();
    }
  }, [riwayatData, anakId, riwayatId]);

  // Fetch riwayat data
  const fetchRiwayatData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminShelterRiwayatApi.getRiwayatDetail(anakId, riwayatId);
      
      if (response.data.success) {
        setRiwayat(response.data.data);
      } else {
        setError(response.data.message || 'Gagal memuat data riwayat');
      }
    } catch (err) {
      console.error('Error fetching riwayat data:', err);
      setError('Gagal memuat data riwayat. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = () => {
    navigation.navigate('RiwayatForm', {
      anakData,
      anakId,
      riwayatId,
      riwayatData: riwayat,
      isEdit: true
    });
  };

  // Confirm delete
  const confirmDelete = () => {
    Alert.alert(
      'Hapus Riwayat',
      'Anda yakin ingin menghapus riwayat ini? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: handleDelete
        }
      ]
    );
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      setSubmitting(true);
      
      const response = await adminShelterRiwayatApi.deleteRiwayat(anakId, riwayatId);
      
      if (response.data.success) {
        Alert.alert(
          'Sukses',
          'Riwayat berhasil dihapus',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        setError(response.data.message || 'Gagal menghapus riwayat');
      }
    } catch (err) {
      console.error('Error deleting riwayat:', err);
      setError('Gagal menghapus riwayat. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle image modal
  const toggleImageModal = () => {
    setShowImageModal(!showImageModal);
  };

  // Get icon based on riwayat type
  const getRiwayatIcon = (jenisRiwayat) => {
    switch (jenisRiwayat?.toLowerCase()) {
      case 'kesehatan':
        return 'medkit-outline';
      case 'prestasi':
        return 'trophy-outline';
      case 'pendidikan':
        return 'school-outline';
      case 'keluarga':
        return 'people-outline';
      default:
        return 'document-text-outline';
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner message="Memuat data riwayat..." />
      </View>
    );
  }

  // No data state
  if (!riwayat && !loading) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          message={error || 'Data riwayat tidak ditemukan'}
          onRetry={fetchRiwayatData}
          retryText="Coba Lagi"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Submit loading overlay */}
      {submitting && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner message="Menghapus riwayat..." />
        </View>
      )}
      
      {/* Error message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => setError(null)}
          style={styles.errorMessage}
        />
      )}
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header section with child info */}
        <View style={styles.childInfoContainer}>
          <View style={styles.childImageContainer}>
            {anakData?.foto_url ? (
              <Image
                source={{ uri: anakData.foto_url }}
                style={styles.childImage}
              />
            ) : (
              <View style={styles.childImagePlaceholder}>
                <Ionicons name="person" size={30} color="#ffffff" />
              </View>
            )}
          </View>
          <View style={styles.childInfo}>
            <Text style={styles.childName}>{anakData?.full_name || 'Nama Anak'}</Text>
            {anakData?.nick_name && (
              <Text style={styles.childNickname}>{anakData.nick_name}</Text>
            )}
          </View>
        </View>
        
        {/* Riwayat Info Card */}
        <View style={styles.riwayatCard}>
          <View style={styles.riwayatHeader}>
            <View style={styles.riwayatIcon}>
              <Ionicons name={getRiwayatIcon(riwayat.jenis_histori)} size={24} color="#ffffff" />
            </View>
            <View style={styles.riwayatHeaderInfo}>
              <Text style={styles.riwayatTitle}>{riwayat.nama_histori}</Text>
              <Text style={styles.riwayatType}>{riwayat.jenis_histori}</Text>
            </View>
          </View>
          
          <View style={styles.riwayatDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tanggal:</Text>
              <Text style={styles.detailValue}>
                {formatDateToIndonesian(riwayat.tanggal)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dirawat Inap:</Text>
              <Text style={styles.detailValue}>
                {riwayat.di_opname === 'YA' ? 'Ya' : 'Tidak'}
              </Text>
            </View>
            
            {riwayat.dirawat_id && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ID yang Dirawat:</Text>
                <Text style={styles.detailValue}>{riwayat.dirawat_id}</Text>
              </View>
            )}
          </View>
          
          {/* Riwayat Photo */}
          {riwayat.foto_url && (
            <TouchableOpacity onPress={toggleImageModal}>
              <View style={styles.photoContainer}>
                <Image
                  source={{ uri: riwayat.foto_url }}
                  style={styles.riwayatPhoto}
                  resizeMode="cover"
                />
                <View style={styles.photoOverlay}>
                  <Ionicons name="expand-outline" size={24} color="#ffffff" />
                  <Text style={styles.photoOverlayText}>Tap untuk memperbesar</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Edit Riwayat"
            onPress={handleEdit}
            leftIcon={<Ionicons name="create-outline" size={20} color="#ffffff" />}
            style={styles.editButton}
          />
          <Button
            title="Hapus Riwayat"
            onPress={confirmDelete}
            leftIcon={<Ionicons name="trash-outline" size={20} color="#ffffff" />}
            type="danger"
            style={styles.deleteButton}
          />
        </View>
      </ScrollView>
      
      {/* Image modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleImageModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleImageModal}
          >
            <Ionicons name="close-circle" size={36} color="#ffffff" />
          </TouchableOpacity>
          
          <Image
            source={{ uri: riwayat?.foto_url }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorMessage: {
    margin: 16,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  childInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  childImageContainer: {
    marginRight: 16,
  },
  childImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  childImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  childNickname: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  riwayatCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  riwayatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  riwayatIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  riwayatHeaderInfo: {
    flex: 1,
  },
  riwayatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  riwayatType: {
    fontSize: 14,
    color: '#666666',
  },
  riwayatDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 120,
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  photoContainer: {
    position: 'relative',
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  riwayatPhoto: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoOverlayText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
});

export default RiwayatDetailScreen;