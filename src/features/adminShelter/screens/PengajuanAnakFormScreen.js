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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

// Import components
import TextInput from '../../../common/components/TextInput';
import Button from '../../../common/components/Button';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Import API and utils
import { adminShelterPengajuanAnakApi } from '../api/adminShelterPengajuanAnakApi';
import { formatDateForApi } from '../../../common/utils/dateFormatter';

const PengajuanAnakFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get keluarga data from route params
  const { keluarga, mode = 'existing' } = route.params || {};
  
  // Form State
  const [formData, setFormData] = useState({
    // Family info (pre-filled)
    no_kk: keluarga?.no_kk || '',
    
    // Education info
    jenjang: '',
    kelas: '',
    nama_sekolah: '',
    alamat_sekolah: '',
    jurusan: '',
    semester: '',
    nama_pt: '',
    alamat_pt: '',
    
    // Child info
    nik_anak: '',
    anak_ke: '',
    dari_bersaudara: '',
    nick_name: '',
    full_name: '',
    agama: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    tinggal_bersama: '',
    jenis_anak_binaan: '',
    hafalan: '',
    pelajaran_favorit: '',
    hobi: '',
    prestasi: '',
    jarak_rumah: '',
    transportasi: '',
    foto: null,
  });
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Update screen title
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add Child to Existing Family'
    });
  }, [navigation]);
  
  // Form input options
  const religionOptions = [
    { label: '-- Select Religion --', value: '' },
    { label: 'Islam', value: 'Islam' },
    { label: 'Kristen', value: 'Kristen' },
    { label: 'Katolik', value: 'Katolik' },
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Buddha', value: 'Buddha' },
    { label: 'Konghucu', value: 'Konghucu' },
  ];
  
  const genderOptions = [
    { label: '-- Select Gender --', value: '' },
    { label: 'Laki-laki', value: 'Laki-laki' },
    { label: 'Perempuan', value: 'Perempuan' },
  ];
  
  const livingWithOptions = [
    { label: '-- Select who the child lives with --', value: '' },
    { label: 'Father', value: 'Ayah' },
    { label: 'Mother', value: 'Ibu' },
    { label: 'Guardian', value: 'Wali' },
  ];
  
  const childTypeOptions = [
    { label: '-- Select type --', value: '' },
    { label: 'BPCB (Binaan Penuh Calon Beasiswa)', value: 'BPCB' },
    { label: 'NPB (Non Penerima Beasiswa)', value: 'NPB' },
  ];
  
  const hafalanOptions = [
    { label: '-- Select hafalan type --', value: '' },
    { label: 'Tahfidz', value: 'Tahfidz' },
    { label: 'Non-Tahfidz', value: 'Non-Tahfidz' },
  ];
  
  const educationLevelOptions = [
    { label: '-- Select Education Level --', value: '' },
    { label: 'Belum Sekolah', value: 'belum_sd' },
    { label: 'SD / Sederajat', value: 'sd' },
    { label: 'SMP / Sederajat', value: 'smp' },
    { label: 'SMA / Sederajat', value: 'sma' },
    { label: 'Perguruan Tinggi', value: 'perguruan_tinggi' },
  ];
  
  const transportationOptions = [
    { label: '-- Select transportation --', value: '' },
    { label: 'Jalan Kaki', value: 'Jalan Kaki' },
    { label: 'Sepeda', value: 'Sepeda' },
    { label: 'Sepeda Motor', value: 'Sepeda Motor' },
    { label: 'Angkutan Umum', value: 'Angkutan Umum' },
    { label: 'Mobil', value: 'Mobil' },
    { label: 'Lainnya', value: 'Lainnya' },
  ];
  
  // Get grade options based on education level
  const getGradeOptions = () => {
    switch (formData.jenjang) {
      case 'sd':
        return [
          { label: '-- Select Grade --', value: '' },
          { label: 'Kelas 1', value: 'Kelas 1' },
          { label: 'Kelas 2', value: 'Kelas 2' },
          { label: 'Kelas 3', value: 'Kelas 3' },
          { label: 'Kelas 4', value: 'Kelas 4' },
          { label: 'Kelas 5', value: 'Kelas 5' },
          { label: 'Kelas 6', value: 'Kelas 6' },
        ];
      case 'smp':
        return [
          { label: '-- Select Grade --', value: '' },
          { label: 'Kelas 7', value: 'Kelas 7' },
          { label: 'Kelas 8', value: 'Kelas 8' },
          { label: 'Kelas 9', value: 'Kelas 9' },
        ];
      case 'sma':
        return [
          { label: '-- Select Grade --', value: '' },
          { label: 'Kelas 10', value: 'Kelas 10' },
          { label: 'Kelas 11', value: 'Kelas 11' },
          { label: 'Kelas 12', value: 'Kelas 12' },
        ];
      default:
        return [];
    }
  };
  
  // Get major options for SMA
  const smaMajorOptions = [
    { label: '-- Select Major --', value: '' },
    { label: 'IPA', value: 'IPA' },
    { label: 'IPS', value: 'IPS' },
    { label: 'Bahasa', value: 'Bahasa' },
    { label: 'Agama', value: 'Agama' },
    { label: 'Kejuruan', value: 'Kejuruan' },
  ];
  
  // Get semester options for college
  const semesterOptions = [
    { label: '-- Select Semester --', value: '' },
    { label: 'Semester 1', value: '1' },
    { label: 'Semester 2', value: '2' },
    { label: 'Semester 3', value: '3' },
    { label: 'Semester 4', value: '4' },
    { label: 'Semester 5', value: '5' },
    { label: 'Semester 6', value: '6' },
    { label: 'Semester 7', value: '7' },
    { label: 'Semester 8', value: '8' },
    { label: '> Semester 8', value: '9' },
  ];
  
  // Handle form data change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Toggle date picker
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };
  
  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    toggleDatePicker();
    
    if (selectedDate) {
      // Format date as DD-MM-YYYY
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      
      handleChange('tanggal_lahir', formattedDate);
    }
  };
  
  // Handle select image
  const handleSelectImage = async () => {
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
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        handleChange('foto', result.assets[0]);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };
  
  // Validate form
  const validateForm = () => {
    // Check required education fields
    if (!formData.jenjang) {
      Alert.alert('Missing Information', 'Please select an education level');
      return false;
    }
    
    // Check required fields
    const requiredFields = [
      'nik_anak', 'anak_ke', 'dari_bersaudara', 'nick_name', 'full_name',
      'agama', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin',
      'tinggal_bersama', 'jenis_anak_binaan', 'hafalan', 'transportasi'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please complete all required fields');
      return false;
    }
    
    return true;
  };
  
  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Create FormData object
      const formDataObj = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        // Skip empty values and the foto if it's not selected
        if (value === '' || (key === 'foto' && !value)) {
          return;
        }
        
        // Handle file upload for child photo
        if (key === 'foto' && value) {
          const filename = value.uri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';
          
          formDataObj.append('foto', {
            uri: value.uri,
            type,
            name: filename,
          });
        } else {
          formDataObj.append(key, value.toString());
        }
      });
      
      // Submit the form
      const response = await adminShelterPengajuanAnakApi.submitAnak(formDataObj);
      
      if (response.data.success) {
        Alert.alert(
          'Success',
          'Child has been successfully added to the family',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to the Anak Management screen
                navigation.navigate('AnakManagement');
              }
            }
          ]
        );
      } else {
        setError(response.data.message || 'Failed to add child');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      
      // Extract validation errors
      if (err.response?.status === 422) {
        const validationErrors = err.response.data?.errors || {};
        const errorMessages = Object.values(validationErrors)
          .flat()
          .join('\n');
          
        setError(`Validation Error:\n${errorMessages || err.response.data?.message}`);
      } else {
        setError(err.response?.data?.message || 'Failed to add child');
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  // Cancel and go back
  const handleCancel = () => {
    navigation.goBack();
  };
  
  if (loading) {
    return <LoadingSpinner fullScreen message="Loading form..." />;
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Error Message */}
        {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}
        
        {/* Family Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Information</Text>
          
          <View style={styles.familyInfoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>KK Number:</Text>
              <Text style={styles.infoValue}>{keluarga?.no_kk || 'N/A'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Family Head:</Text>
              <Text style={styles.infoValue}>{keluarga?.kepala_keluarga || 'N/A'}</Text>
            </View>
            
            {keluarga?.shelter && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Shelter:</Text>
                <Text style={styles.infoValue}>{keluarga.shelter.nama_shelter || 'N/A'}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Education Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education Information</Text>
          
          {/* Education Level */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Education Level*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.jenjang}
                onValueChange={(value) => handleChange('jenjang', value)}
                style={styles.picker}
              >
                {educationLevelOptions.map((option, index) => (
                  <Picker.Item 
                    key={index}
                    label={option.label} 
                    value={option.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          {/* School Level Fields - only show if level is selected and not "belum_sd" */}
          {formData.jenjang && formData.jenjang !== 'belum_sd' && formData.jenjang !== 'perguruan_tinggi' && (
            <>
              {/* Grade */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Grade</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.kelas}
                    onValueChange={(value) => handleChange('kelas', value)}
                    style={styles.picker}
                  >
                    {getGradeOptions().map((option, index) => (
                      <Picker.Item 
                        key={index}
                        label={option.label} 
                        value={option.value} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              
              {/* Major (only for SMA) */}
              {formData.jenjang === 'sma' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Major</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.jurusan}
                      onValueChange={(value) => handleChange('jurusan', value)}
                      style={styles.picker}
                    >
                      {smaMajorOptions.map((option, index) => (
                        <Picker.Item 
                          key={index}
                          label={option.label} 
                          value={option.value} 
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}
              
              {/* School Name */}
              <TextInput
                label="School Name"
                value={formData.nama_sekolah}
                onChangeText={(value) => handleChange('nama_sekolah', value)}
                placeholder="Enter school name"
                leftIcon={<Ionicons name="school-outline" size={20} color="#777" />}
              />
              
              {/* School Address */}
              <TextInput
                label="School Address"
                value={formData.alamat_sekolah}
                onChangeText={(value) => handleChange('alamat_sekolah', value)}
                placeholder="Enter school address"
                leftIcon={<Ionicons name="location-outline" size={20} color="#777" />}
                multiline
                inputProps={{ numberOfLines: 3 }}
              />
            </>
          )}
          
          {/* College Fields - only show if level is "perguruan_tinggi" */}
          {formData.jenjang === 'perguruan_tinggi' && (
            <>
              {/* Semester */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Semester</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.semester}
                    onValueChange={(value) => handleChange('semester', value)}
                    style={styles.picker}
                  >
                    {semesterOptions.map((option, index) => (
                      <Picker.Item 
                        key={index}
                        label={option.label} 
                        value={option.value} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              
              {/* Major */}
              <TextInput
                label="Major"
                value={formData.jurusan}
                onChangeText={(value) => handleChange('jurusan', value)}
                placeholder="Enter college major"
                leftIcon={<Ionicons name="book-outline" size={20} color="#777" />}
              />
              
              {/* College Name */}
              <TextInput
                label="College Name"
                value={formData.nama_pt}
                onChangeText={(value) => handleChange('nama_pt', value)}
                placeholder="Enter college name"
                leftIcon={<Ionicons name="school-outline" size={20} color="#777" />}
              />
              
              {/* College Address */}
              <TextInput
                label="College Address"
                value={formData.alamat_pt}
                onChangeText={(value) => handleChange('alamat_pt', value)}
                placeholder="Enter college address"
                leftIcon={<Ionicons name="location-outline" size={20} color="#777" />}
                multiline
                inputProps={{ numberOfLines: 3 }}
              />
            </>
          )}
        </View>
        
        {/* Child Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Child Basic Information</Text>
          
          {/* Photo */}
          <View style={styles.photoContainer}>
            <Text style={styles.label}>Child Photo</Text>
            <View style={styles.photoContent}>
              {formData.foto ? (
                <View style={styles.photoPreviewContainer}>
                  <Image 
                    source={{ uri: formData.foto.uri }} 
                    style={styles.photoPreview} 
                  />
                </View>
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="person" size={40} color="#ddd" />
                </View>
              )}
              
              <Button
                title={formData.foto ? "Change Photo" : "Select Photo"}
                onPress={handleSelectImage}
                type="outline"
                size="small"
                style={styles.photoButton}
                leftIcon={<Ionicons name="camera-outline" size={18} color="#3498db" />}
              />
            </View>
          </View>
          
          {/* NIK */}
          <TextInput
            label="NIK*"
            value={formData.nik_anak}
            onChangeText={(value) => handleChange('nik_anak', value)}
            placeholder="Enter child's NIK"
            leftIcon={<Ionicons name="card-outline" size={20} color="#777" />}
            inputProps={{ maxLength: 16, keyboardType: 'numeric' }}
          />
          
          {/* Birth Info */}
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={styles.label}>Child Number*</Text>
              <TextInput
                value={formData.anak_ke}
                onChangeText={(value) => handleChange('anak_ke', value)}
                placeholder="e.g. 2"
                inputProps={{ keyboardType: 'numeric' }}
              />
            </View>
            
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={styles.label}>Out of Siblings*</Text>
              <TextInput
                value={formData.dari_bersaudara}
                onChangeText={(value) => handleChange('dari_bersaudara', value)}
                placeholder="e.g. 3"
                inputProps={{ keyboardType: 'numeric' }}
              />
            </View>
          </View>
          
          {/* Names */}
          <TextInput
            label="Nick Name*"
            value={formData.nick_name}
            onChangeText={(value) => handleChange('nick_name', value)}
            placeholder="Enter child's nick name"
            leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
          />
          
          <TextInput
            label="Full Name*"
            value={formData.full_name}
            onChangeText={(value) => handleChange('full_name', value)}
            placeholder="Enter child's full name"
            leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
          />
          
          {/* Gender */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.jenis_kelamin}
                onValueChange={(value) => handleChange('jenis_kelamin', value)}
                style={styles.picker}
              >
                {genderOptions.map((option, index) => (
                  <Picker.Item 
                    key={index}
                    label={option.label} 
                    value={option.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          {/* Religion */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Religion*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.agama}
                onValueChange={(value) => handleChange('agama', value)}
                style={styles.picker}
              >
                {religionOptions.map((option, index) => (
                  <Picker.Item 
                    key={index}
                    label={option.label} 
                    value={option.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          {/* Birth place and date */}
          <TextInput
            label="Place of Birth*"
            value={formData.tempat_lahir}
            onChangeText={(value) => handleChange('tempat_lahir', value)}
            placeholder="Enter place of birth"
            leftIcon={<Ionicons name="location-outline" size={20} color="#777" />}
          />
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth*</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={toggleDatePicker}
            >
              <Ionicons name="calendar-outline" size={20} color="#777" style={styles.dateIcon} />
              <Text style={styles.dateText}>
                {formData.tanggal_lahir || 'Select date of birth'}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={formData.tanggal_lahir ? new Date(formData.tanggal_lahir.split('-').reverse().join('-')) : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>
          
          {/* Living With */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Living With*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.tinggal_bersama}
                onValueChange={(value) => handleChange('tinggal_bersama', value)}
                style={styles.picker}
              >
                {livingWithOptions.map((option, index) => (
                  <Picker.Item 
                    key={index}
                    label={option.label} 
                    value={option.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        
        {/* Program Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Program Information</Text>
          
          {/* Child Type */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Child Program Type*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.jenis_anak_binaan}
                onValueChange={(value) => handleChange('jenis_anak_binaan', value)}
                style={styles.picker}
              >
                {childTypeOptions.map((option, index) => (
                  <Picker.Item 
                    key={index}
                    label={option.label} 
                    value={option.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          {/* Hafalan */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Hafalan Type*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.hafalan}
                onValueChange={(value) => handleChange('hafalan', value)}
                style={styles.picker}
              >
                {hafalanOptions.map((option, index) => (
                  <Picker.Item 
                    key={index}
                    label={option.label} 
                    value={option.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        
        {/* Additional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          {/* Favorite Subject */}
          <TextInput
            label="Favorite Subject"
            value={formData.pelajaran_favorit}
            onChangeText={(value) => handleChange('pelajaran_favorit', value)}
            placeholder="Enter favorite subject"
            leftIcon={<Ionicons name="book-outline" size={20} color="#777" />}
          />
          
          {/* Hobby */}
          <TextInput
            label="Hobby"
            value={formData.hobi}
            onChangeText={(value) => handleChange('hobi', value)}
            placeholder="Enter hobby"
            leftIcon={<Ionicons name="happy-outline" size={20} color="#777" />}
          />
          
          {/* Achievements */}
          <TextInput
            label="Achievements"
            value={formData.prestasi}
            onChangeText={(value) => handleChange('prestasi', value)}
            placeholder="Enter achievements"
            leftIcon={<Ionicons name="trophy-outline" size={20} color="#777" />}
            multiline
            inputProps={{ numberOfLines: 3 }}
          />
          
          {/* Distance from Home */}
          <TextInput
            label="Distance from Home (km)"
            value={formData.jarak_rumah}
            onChangeText={(value) => handleChange('jarak_rumah', value)}
            placeholder="Enter distance in kilometers"
            leftIcon={<Ionicons name="navigate-outline" size={20} color="#777" />}
            inputProps={{ keyboardType: 'numeric' }}
          />
          
          {/* Transportation */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Transportation to School*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.transportasi}
                onValueChange={(value) => handleChange('transportasi', value)}
                style={styles.picker}
              >
                {transportationOptions.map((option, index) => (
                  <Picker.Item 
                    key={index}
                    label={option.label} 
                    value={option.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        
        {/* Form Actions */}
        <View style={styles.formActions}>
          <Button
            title="Cancel"
            onPress={handleCancel}
            type="outline"
            style={styles.actionButton}
          />
          <Button
            title="Submit"
            onPress={handleSubmit}
            type="primary"
            loading={submitting}
            disabled={submitting}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  familyInfoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 90,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  photoContainer: {
    marginBottom: 16,
  },
  photoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoPreviewContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginRight: 16,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 16,
  },
  photoButton: {
    flex: 1,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default PengajuanAnakFormScreen;