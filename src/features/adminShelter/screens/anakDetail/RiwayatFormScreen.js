import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// Import components
import Button from '../../../../common/components/Button';
import TextInput from '../../../../common/components/TextInput';
import LoadingSpinner from '../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../common/components/ErrorMessage';

// Import API
import { adminShelterRiwayatApi } from '../../api/adminShelterRiwayatApi';

// Import utils
import { formatDateToIndonesian } from '../../../../common/utils/dateFormatter';

const RiwayatFormScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { anakData, anakId, riwayatId, riwayatData, isEdit = false } = route.params || {};
  
  // Form state
  const [formData, setFormData] = useState({
    jenis_histori: '',
    nama_histori: '',
    di_opname: 'TIDAK',
    dirawat_id: '',
    tanggal: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
    ...riwayatData
  });
  
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(isEdit && !riwayatData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Jenis Histori options
  const jenisHistoriOptions = [
    'Kesehatan',
    'Pendidikan',
    'Keluarga',
    'Lainnya'
  ];

  // Set screen title
  useEffect(() => {
    navigation.setOptions({
      title: isEdit ? 'Edit Riwayat' : 'Tambah Riwayat Baru'
    });
  }, [navigation, isEdit]);

  // Fetch riwayat data if editing and data not provided
  useEffect(() => {
    if (isEdit && !riwayatData && anakId && riwayatId) {
      fetchRiwayatData();
    }
  }, [isEdit, riwayatData, anakId, riwayatId]);

  // Initialize photo from riwayatData
  useEffect(() => {
    if (isEdit && riwayatData && riwayatData.foto_url) {
      setPhoto(riwayatData.foto_url);
    }
  }, [isEdit, riwayatData]);

  // Fetch riwayat data
  const fetchRiwayatData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminShelterRiwayatApi.getRiwayatDetail(anakId, riwayatId);
      
      if (response.data.success) {
        const data = response.data.data;
        setFormData({
          jenis_histori: data.jenis_histori || '',
          nama_histori: data.nama_histori || '',
          di_opname: data.di_opname || 'TIDAK',
          dirawat_id: data.dirawat_id || '',
          tanggal: data.tanggal || new Date().toISOString().split('T')[0],
        });
        
        if (data.foto_url) {
          setPhoto(data.foto_url);
        }
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

  // Handle text input changes
  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Handle photo selection
  const handleSelectPhoto = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access camera roll is required');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo');
    }
  };

  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      setFormData(prev => ({ ...prev, tanggal: formattedDate }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!formData.nama_histori) {
      Alert.alert('Error', 'Nama riwayat harus diisi');
      return;
    }
    
    if (!formData.jenis_histori) {
      Alert.alert('Error', 'Jenis riwayat harus diisi');
      return;
    }
    
    if (!formData.di_opname) {
      Alert.alert('Error', 'Dirawat inap harus dipilih (Ya/Tidak)');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Create FormData object
      const submitData = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          submitData.append(key, String(value));
        }
      });
      
      // Always add is_read field with value "0"
      submitData.append('is_read', "0");
      
      // Add photo if selected and it's not a URL (new photo)
      if (photo && !photo.startsWith('http')) {
        const photoName = photo.split('/').pop();
        const match = /\.(\w+)$/.exec(photoName);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        submitData.append('foto', {
          uri: photo,
          name: photoName,
          type
        });
      }
      
      // Submit form
      let response;
      if (isEdit) {
        response = await adminShelterRiwayatApi.updateRiwayat(anakId, riwayatId, submitData);
      } else {
        response = await adminShelterRiwayatApi.createRiwayat(anakId, submitData);
      }
      
      if (response.data.success) {
        Alert.alert(
          'Sukses',
          isEdit ? 'Riwayat berhasil diperbarui' : 'Riwayat berhasil ditambahkan',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        setError(response.data.message || 'Gagal menyimpan riwayat');
      }
    } catch (err) {
      console.error('Error submitting riwayat:', err);
      setError('Gagal menyimpan riwayat. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigation.goBack();
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner message="Memuat data riwayat..." />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.scrollView}>
        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => setError(null)}
            style={styles.errorMessage}
          />
        )}
        
        {/* Child Info */}
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
        
        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Nama Riwayat */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nama Riwayat *</Text>
            <TextInput
              value={formData.nama_histori}
              onChangeText={(value) => handleChange('nama_histori', value)}
              placeholder="Masukkan nama riwayat"
            />
          </View>
          
          {/* Jenis Riwayat */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Jenis Riwayat *</Text>
            <View style={styles.optionsContainer}>
              {jenisHistoriOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    formData.jenis_histori === option && styles.optionButtonActive
                  ]}
                  onPress={() => handleChange('jenis_histori', option)}
                >
                  <Text style={[
                    styles.optionButtonText,
                    formData.jenis_histori === option && styles.optionButtonTextActive
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Dirawat Inap */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Dirawat Inap *</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  formData.di_opname === 'YA' && styles.optionButtonActive
                ]}
                onPress={() => handleChange('di_opname', 'YA')}
              >
                <Text style={[
                  styles.optionButtonText,
                  formData.di_opname === 'YA' && styles.optionButtonTextActive
                ]}>
                  Ya
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  formData.di_opname === 'TIDAK' && styles.optionButtonActive
                ]}
                onPress={() => handleChange('di_opname', 'TIDAK')}
              >
                <Text style={[
                  styles.optionButtonText,
                  formData.di_opname === 'TIDAK' && styles.optionButtonTextActive
                ]}>
                  Tidak
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* ID yang Dirawat (jika di_opname = "YA") */}
          {formData.di_opname === 'YA' && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>ID yang Dirawat</Text>
              <TextInput
                value={formData.dirawat_id}
                onChangeText={(value) => handleChange('dirawat_id', value)}
                placeholder="Masukkan ID yang dirawat"
                keyboardType="numeric"
              />
            </View>
          )}
          
          {/* Tanggal */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tanggal</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formData.tanggal ? formatDateToIndonesian(formData.tanggal) : 'Pilih Tanggal'}
              </Text>
              <Ionicons name="calendar-outline" size={24} color="#666" />
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={new Date(formData.tanggal)}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          
          {/* Photo Upload */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Foto Riwayat</Text>
            <View style={styles.photoContainer}>
              {photo ? (
                <View style={styles.photoPreview}>
                  <Image
                    source={{ uri: photo }}
                    style={styles.photoImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => setPhoto(null)}
                  >
                    <Ionicons name="close-circle" size={24} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.photoPlaceholder}
                  onPress={handleSelectPhoto}
                >
                  <Ionicons name="image-outline" size={40} color="#999" />
                  <Text style={styles.photoPlaceholderText}>Tambah Foto</Text>
                </TouchableOpacity>
              )}
              
              {photo && (
                <Button
                  title="Ganti Foto"
                  onPress={handleSelectPhoto}
                  type="outline"
                  size="small"
                  style={styles.changePhotoButton}
                />
              )}
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Batal"
              onPress={handleCancel}
              type="outline"
              style={styles.cancelButton}
              disabled={submitting}
            />
            <Button
              title={isEdit ? "Simpan Perubahan" : "Simpan Riwayat"}
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Loading Overlay */}
      {submitting && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner message={isEdit ? "Menyimpan perubahan..." : "Menyimpan riwayat..."} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  errorMessage: {
    marginBottom: 16,
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
  formCard: {
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e74c3c',
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: '#e74c3c',
  },
  optionButtonText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  optionButtonTextActive: {
    color: '#ffffff',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  photoPlaceholderText: {
    marginTop: 8,
    fontSize: 16,
    color: '#999',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  changePhotoButton: {
    width: 150,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 2,
    marginLeft: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default RiwayatFormScreen;