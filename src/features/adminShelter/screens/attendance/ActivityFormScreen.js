import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';

// Components
import Button from '../../../../common/components/Button';
import LoadingSpinner from '../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../common/components/ErrorMessage';

// Redux
import {
  createAktivitas,
  updateAktivitas,
  selectAktivitasLoading,
  selectAktivitasError
} from '../../redux/aktivitasSlice';

// API
import { adminShelterKelompokApi } from '../../api/adminShelterKelompokApi';

const ActivityFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  
  // Get activity from route params if editing
  const { activity } = route.params || {};
  const isEditing = !!activity;
  
  // Redux state
  const loading = useSelector(selectAktivitasLoading);
  const error = useSelector(selectAktivitasError);
  
  // Form state
  const [formData, setFormData] = useState({
    jenis_kegiatan: '',
    level: '',
    nama_kelompok: '',
    materi: '',
    tanggal: new Date(),
    foto_1: null,
    foto_2: null,
    foto_3: null,
    selectedKelompokId: null // Store selected kelompok ID for reference
  });
  
  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photos, setPhotos] = useState({
    foto_1: null,
    foto_2: null,
    foto_3: null
  });
  
  // Kelompok data state
  const [kelompokList, setKelompokList] = useState([]);
  const [kelompokLoading, setKelompokLoading] = useState(false);
  const [kelompokError, setKelompokError] = useState(null);
  
  // Load activity data if editing
  useEffect(() => {
    if (isEditing && activity) {
      setFormData({
        jenis_kegiatan: activity.jenis_kegiatan || '',
        level: activity.level || '',
        nama_kelompok: activity.nama_kelompok || '',
        materi: activity.materi || '',
        tanggal: activity.tanggal ? new Date(activity.tanggal) : new Date(),
        selectedKelompokId: null // Will be set if we can match it in the kelompok list
      });
      
      // Set photo previews if available
      setPhotos({
        foto_1: activity.foto_1_url || null,
        foto_2: activity.foto_2_url || null,
        foto_3: activity.foto_3_url || null
      });
      
      // If activity type is Bimbel, fetch kelompok data
      if (activity.jenis_kegiatan === 'Bimbel') {
        fetchKelompokData();
      }
    }
  }, [isEditing, activity]);
  
  // Fetch kelompok data when Bimbel is selected
  useEffect(() => {
    if (formData.jenis_kegiatan === 'Bimbel') {
      fetchKelompokData();
    }
  }, [formData.jenis_kegiatan]);
  
  // Fetch kelompok data from API
  const fetchKelompokData = async () => {
    setKelompokLoading(true);
    setKelompokError(null);
    
    try {
      const response = await adminShelterKelompokApi.getAllKelompok();
      
      if (response.data && response.data.data) {
        setKelompokList(response.data.data);
        
        // If editing and we have nama_kelompok, try to find matching kelompok
        if (isEditing && formData.nama_kelompok) {
          const matchingKelompok = response.data.data.find(
            k => k.nama_kelompok === formData.nama_kelompok
          );
          
          if (matchingKelompok) {
            setFormData(prev => ({
              ...prev,
              selectedKelompokId: matchingKelompok.id_kelompok,
              level: matchingKelompok.level_anak_binaan?.nama_level_binaan || prev.level
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching kelompok data:', error);
      setKelompokError('Failed to load group data. Please try again.');
    } finally {
      setKelompokLoading(false);
    }
  };
  
  // Handle form input changes
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('tanggal', selectedDate);
    }
  };
  
  // Handle kelompok selection
  const handleKelompokChange = (kelompokId) => {
    const selectedKelompok = kelompokList.find(k => k.id_kelompok === kelompokId);
    
    if (selectedKelompok) {
      setFormData({
        ...formData,
        selectedKelompokId: kelompokId,
        nama_kelompok: selectedKelompok.nama_kelompok,
        level: selectedKelompok.level_anak_binaan?.nama_level_binaan || ''
      });
    } else {
      setFormData({
        ...formData,
        selectedKelompokId: null,
        nama_kelompok: '',
        level: ''
      });
    }
  };
  
  // Handle photo selection
  const handleSelectPhoto = async (photoKey) => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to select photos.');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        // Update form data
        setFormData({
          ...formData,
          [photoKey]: {
            uri: selectedImage.uri,
            name: selectedImage.uri.split('/').pop(),
            type: 'image/jpeg'
          }
        });
        
        // Update preview
        setPhotos({
          ...photos,
          [photoKey]: selectedImage.uri
        });
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo');
    }
  };
  
  // Remove selected photo
  const handleRemovePhoto = (photoKey) => {
    setFormData({
      ...formData,
      [photoKey]: null
    });
    
    setPhotos({
      ...photos,
      [photoKey]: null
    });
  };
  
  // Prepare form data for submission
  const prepareFormData = () => {
    const data = new FormData();
    
    // Add text fields
    data.append('jenis_kegiatan', formData.jenis_kegiatan);
    
    // Only include level and nama_kelompok if jenis_kegiatan is Bimbel
    if (formData.jenis_kegiatan === 'Bimbel') {
      data.append('level', formData.level || '');
      data.append('nama_kelompok', formData.nama_kelompok || '');
    }
    
    // Use empty string instead of null for materi
    data.append('materi', formData.materi || '');
    data.append('tanggal', format(formData.tanggal, 'yyyy-MM-dd'));
    
    // Add photos if selected
    if (formData.foto_1) {
      data.append('foto_1', formData.foto_1);
    }
    
    if (formData.foto_2) {
      data.append('foto_2', formData.foto_2);
    }
    
    if (formData.foto_3) {
      data.append('foto_3', formData.foto_3);
    }
    
    return data;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.jenis_kegiatan || !formData.tanggal) {
      Alert.alert('Validation Error', 'Activity type and date are required');
      return;
    }
    
    // If Bimbel is selected, validate kelompok selection
    if (formData.jenis_kegiatan === 'Bimbel' && !formData.selectedKelompokId) {
      Alert.alert('Validation Error', 'Please select a group for Bimbel activity');
      return;
    }
    
    // Validate materi field
    if (!formData.materi) {
      Alert.alert('Validation Error', 'Materi cannot be empty');
      return;
    }
    
    // Prepare form data
    const data = prepareFormData();
    
    try {
      if (isEditing) {
        // Update existing activity
        await dispatch(updateAktivitas({ id: activity.id_aktivitas, aktivitasData: data })).unwrap();
        Alert.alert('Success', 'Activity updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        // Create new activity
        await dispatch(createAktivitas(data)).unwrap();
        Alert.alert('Success', 'Activity created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (err) {
      console.error('Error saving activity:', err);
      Alert.alert('Error', err || 'Failed to save activity');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Error message */}
      {error && <ErrorMessage message={error} />}
      
      {/* Activity Type - Button Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tipe Aktivitas<Text style={styles.required}>*</Text></Text>
        <View style={styles.activityTypeButtons}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              formData.jenis_kegiatan === 'Bimbel' && styles.typeButtonActive
            ]}
            onPress={() => handleChange('jenis_kegiatan', 'Bimbel')}
          >
            <Text style={[
              styles.typeButtonText,
              formData.jenis_kegiatan === 'Bimbel' && styles.typeButtonTextActive
            ]}>
              Bimbel
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              formData.jenis_kegiatan === 'Kegiatan' && styles.typeButtonActive
            ]}
            onPress={() => handleChange('jenis_kegiatan', 'Kegiatan')}
          >
            <Text style={[
              styles.typeButtonText,
              formData.jenis_kegiatan === 'Kegiatan' && styles.typeButtonTextActive
            ]}>
              Kegiatan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Kelompok Picker - Only shown for Bimbel */}
      {formData.jenis_kegiatan === 'Bimbel' && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kelompok<Text style={styles.required}>*</Text></Text>
          
          {kelompokLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3498db" />
              <Text style={styles.loadingText}>Loading groups...</Text>
            </View>
          ) : kelompokError ? (
            <ErrorMessage 
              message={kelompokError} 
              onRetry={fetchKelompokData}
              style={styles.errorContainer} 
            />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.selectedKelompokId || ''}
                onValueChange={handleKelompokChange}
                style={styles.picker}
                enabled={!loading}
              >
                <Picker.Item label="Select a group" value="" />
                {kelompokList.map(kelompok => (
                  <Picker.Item 
                    key={kelompok.id_kelompok} 
                    label={kelompok.nama_kelompok}
                    value={kelompok.id_kelompok} 
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>
      )}
      
      {/* Level - Only shown for Bimbel (read-only) */}
      {formData.jenis_kegiatan === 'Bimbel' && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tingkat</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={formData.level}
            editable={false}
            placeholder="Level will be filled automatically"
          />
        </View>
      )}
      
      {/* Materials */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Materi<Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.materi}
          onChangeText={(value) => handleChange('materi', value)}
          placeholder="Deskripsi Materi"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      
      {/* Date */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tanggal<Text style={styles.required}>*</Text></Text>
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {format(formData.tanggal, 'dd MMMM yyyy')}
          </Text>
          <Ionicons name="calendar" size={24} color="#3498db" />
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={formData.tanggal}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
      
      {/* Photos */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Foto</Text>
        
        <View style={styles.photosContainer}>
          {/* Photo 1 */}
          <View style={styles.photoBox}>
            {photos.foto_1 ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: photos.foto_1 }} style={styles.photoPreview} />
                <TouchableOpacity 
                  style={styles.removePhotoButton}
                  onPress={() => handleRemovePhoto('foto_1')}
                >
                  <Ionicons name="close-circle" size={24} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addPhotoButton}
                onPress={() => handleSelectPhoto('foto_1')}
              >
                <Ionicons name="camera" size={32} color="#bdc3c7" />
                <Text style={styles.addPhotoText}>Foto 1</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Photo 2 */}
          <View style={styles.photoBox}>
            {photos.foto_2 ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: photos.foto_2 }} style={styles.photoPreview} />
                <TouchableOpacity 
                  style={styles.removePhotoButton}
                  onPress={() => handleRemovePhoto('foto_2')}
                >
                  <Ionicons name="close-circle" size={24} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addPhotoButton}
                onPress={() => handleSelectPhoto('foto_2')}
              >
                <Ionicons name="camera" size={32} color="#bdc3c7" />
                <Text style={styles.addPhotoText}>Foto 2</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Photo 3 */}
          <View style={styles.photoBox}>
            {photos.foto_3 ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: photos.foto_3 }} style={styles.photoPreview} />
                <TouchableOpacity 
                  style={styles.removePhotoButton}
                  onPress={() => handleRemovePhoto('foto_3')}
                >
                  <Ionicons name="close-circle" size={24} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addPhotoButton}
                onPress={() => handleSelectPhoto('foto_3')}
              >
                <Ionicons name="camera" size={32} color="#bdc3c7" />
                <Text style={styles.addPhotoText}>Foto 3</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      
      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={isEditing ? 'Update Activitas' : 'Buat Activity'}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          fullWidth
        />
        
        <Button
          title="Batal"
          onPress={() => navigation.goBack()}
          type="outline"
          disabled={loading}
          fullWidth
          style={styles.cancelButton}
        />
      </View>
      
      {/* Loading Overlay */}
      {loading && (
        <LoadingSpinner 
          fullScreen 
          message={isEditing ? 'Updating activity...' : 'Creating activity...'}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: '#e74c3c',
  },
  activityTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#34495e',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#7f8c8d',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#34495e',
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  photoBox: {
    width: '32%',
    aspectRatio: 1,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  addPhotoButton: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#7f8c8d',
    marginTop: 4,
    fontSize: 12,
  },
  photoPreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
  },
  buttonContainer: {
    marginTop: 20,
  },
  cancelButton: {
    marginTop: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loadingText: {
    marginLeft: 8,
    color: '#7f8c8d',
  },
  errorContainer: {
    marginVertical: 0,
  },
});

export default ActivityFormScreen;