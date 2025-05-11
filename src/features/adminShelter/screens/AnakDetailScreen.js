import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Button from '../../../common/components/Button';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
//import AnakForm from '../components/AnakForm';

// Import API
import { adminShelterAnakApi } from '../api/adminShelterAnakApi';

// Import utils
import { formatDateToIndonesian } from '../../../common/utils/dateFormatter';

const AnakDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, isNew } = route.params || {};
  
  const [anakData, setAnakData] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(isNew || false);

  // Fetch anak data if not a new record
  useEffect(() => {
    if (!isNew && id) {
      fetchAnakDetail();
    }
  }, [id, isNew]);

  // Set screen title based on mode
  useEffect(() => {
    let title = isNew 
      ? 'Tambah Anak Baru' 
      : (anakData 
         ? (anakData.full_name || anakData.nick_name) 
         : 'Detail Anak');
    
    navigation.setOptions({ 
      title,
      headerRight: () => (
        !isNew && !isEditing && (
          <TouchableOpacity 
            style={{ marginRight: 16 }} 
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={24} color="#e74c3c" />
          </TouchableOpacity>
        )
      )
    });
  }, [isNew, anakData, isEditing, navigation]);

  // Fetch anak detail
  const fetchAnakDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminShelterAnakApi.getAnakDetail(id);
      
      if (response.data.success) {
        setAnakData(response.data.data);
      } else {
        setError(response.data.message || 'Gagal memuat detail anak');
      }
    } catch (err) {
      console.error('Error fetching anak detail:', err);
      setError('Gagal memuat detail anak. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      // Create FormData object for file upload
      const data = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'foto' && formData[key] !== undefined && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });
      
      // Add photo if available and it's a file object
      if (formData.foto && typeof formData.foto === 'object') {
        const photoName = formData.foto.uri.split('/').pop();
        const photoType = 'image/' + photoName.split('.').pop();
        
        data.append('foto', {
          uri: formData.foto.uri,
          name: photoName,
          type: photoType
        });
      }
      
      let response;
      
      if (isNew) {
        // Create new record
        response = await adminShelterAnakApi.createAnak(data);
      } else {
        // Update existing record
        response = await adminShelterAnakApi.updateAnak(id, data);
      }
      
      if (response.data.success) {
        Alert.alert(
          'Sukses',
          isNew ? 'Anak berhasil ditambahkan' : 'Data anak berhasil diperbarui',
          [
            {
              text: 'OK',
              onPress: () => {
                if (isNew) {
                  // Navigate to the detail screen of the newly created anak
                  navigation.replace('AnakDetail', { id: response.data.data.id_anak });
                } else {
                  // Exit edit mode and refresh data
                  setIsEditing(false);
                  fetchAnakDetail();
                }
              }
            }
          ]
        );
      } else {
        setError(response.data.message || 'Operasi gagal');
      }
    } catch (err) {
      console.error('Error submitting anak form:', err);
      let errorMessage = 'Terjadi kesalahan saat menyimpan data.';
      
      // Extract error message from response if available
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).flat().join('\n');
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    if (isNew) {
      navigation.goBack();
    } else {
      setIsEditing(false);
    }
  };

  // Handle delete
  const handleDelete = () => {
    Alert.alert(
      'Hapus Anak',
      'Anda yakin ingin menghapus anak ini? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: async () => {
            try {
              setSubmitting(true);
              
              const response = await adminShelterAnakApi.deleteAnak(id);
              
              if (response.data.success) {
                Alert.alert(
                  'Sukses',
                  'Anak berhasil dihapus',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.goBack()
                    }
                  ]
                );
              } else {
                setError(response.data.message || 'Gagal menghapus anak');
              }
            } catch (err) {
              console.error('Error deleting anak:', err);
              setError('Gagal menghapus anak. Silakan coba lagi.');
            } finally {
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner fullScreen message="Memuat data anak..." />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={isNew ? null : fetchAnakDetail}
          retryText="Coba Lagi"
        />
      )}

      {isEditing ? (
        // Edit Mode - Show Form
        <View style={styles.formContainer}>
          {/* <AnakForm
            initialData={anakData}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
            onCancel={handleCancel}
          /> */}
        </View>
      ) : (
        // View Mode - Show Details
        <View style={styles.detailsContainer}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              {anakData?.foto_url ? (
                <Image
                  source={{ uri: anakData.foto_url }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person" size={50} color="#ffffff" />
                </View>
              )}
            </View>
            
            <Text style={styles.profileName}>{anakData?.full_name || 'Tanpa Nama'}</Text>
            {anakData?.nick_name && <Text style={styles.profileNickname}>{anakData.nick_name}</Text>}
            
            <View style={[
              styles.statusBadge,
              { backgroundColor: anakData?.status_validasi === 'aktif' ? '#2ecc71' : '#e74c3c' }
            ]}>
              <Text style={styles.statusText}>
                {anakData?.status_validasi === 'aktif' ? 'Aktif' : 'Non-Aktif'}
              </Text>
            </View>
          </View>
          
          {/* Personal Information */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="person-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Nama Lengkap</Text>
              </View>
              <Text style={styles.infoValue}>{anakData?.full_name || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="happy-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Nama Panggilan</Text>
              </View>
              <Text style={styles.infoValue}>{anakData?.nick_name || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="card-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>NIK</Text>
              </View>
              <Text style={styles.infoValue}>{anakData?.nik_anak || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons 
                  name={anakData?.jenis_kelamin === 'L' ? 'male-outline' : 'female-outline'} 
                  size={20} 
                  color="#666" 
                />
                <Text style={styles.infoLabelText}>Jenis Kelamin</Text>
              </View>
              <Text style={styles.infoValue}>
                {anakData?.jenis_kelamin === 'L' ? 'Laki-laki' : 
                 anakData?.jenis_kelamin === 'P' ? 'Perempuan' : '-'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Tanggal Lahir</Text>
              </View>
              <Text style={styles.infoValue}>
                {anakData?.tanggal_lahir ? formatDateToIndonesian(anakData.tanggal_lahir) : '-'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="location-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Tempat Lahir</Text>
              </View>
              <Text style={styles.infoValue}>{anakData?.tempat_lahir || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="people-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Anak Ke</Text>
              </View>
              <Text style={styles.infoValue}>
                {anakData?.anak_ke ? 
                  `${anakData.anak_ke} dari ${anakData.dari_bersaudara || '-'}` : 
                  '-'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="home-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Tinggal Bersama</Text>
              </View>
              <Text style={styles.infoValue}>{anakData?.tinggal_bersama || '-'}</Text>
            </View>
          </View>
          
          {/* Additional Information */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Informasi Tambahan</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="business-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Jenis Anak</Text>
              </View>
              <Text style={styles.infoValue}>{anakData?.jenis_anak_binaan || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="book-outline" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Hafalan</Text>
              </View>
              <Text style={styles.infoValue}>{anakData?.hafalan || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="person" size={20} color="#666" />
                <Text style={styles.infoLabelText}>Agama</Text>
              </View>
              <Text style={styles.infoValue}>{anakData?.agama || '-'}</Text>
            </View>
            
            {anakData?.kelompok && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="grid-outline" size={20} color="#666" />
                  <Text style={styles.infoLabelText}>Kelompok</Text>
                </View>
                <Text style={styles.infoValue}>{anakData.kelompok.nama_kelompok || '-'}</Text>
              </View>
            )}
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Edit"
              onPress={() => setIsEditing(true)}
              leftIcon={<Ionicons name="create-outline" size={20} color="white" />}
              style={styles.editButton}
            />
            
            <Button
              title="Hapus"
              onPress={handleDelete}
              leftIcon={<Ionicons name="trash-outline" size={20} color="white" />}
              type="danger"
              style={styles.deleteButton}
            />
          </View>
        </View>
      )}
      
      {/* Loading Overlay */}
      {submitting && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner message="Menyimpan data..." />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#e74c3c',
    padding: 20,
    alignItems: 'center',
    paddingBottom: 30,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#c0392b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  profileNickname: {
    fontSize: 16,
    color: '#f8f8f8',
    marginTop: 4,
    textAlign: 'center',
  },
  statusBadge: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabelText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    paddingLeft: 28,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 30,
  },
  editButton: {
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

export default AnakDetailScreen;