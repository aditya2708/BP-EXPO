import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

// Import components
import TextInput from '../../../../common/components/TextInput';
import Button from '../../../../common/components/Button';
import { formatDateForApi } from '../../../../common/utils/dateFormatter';

const KeluargaFormStepChild = ({
  formData,
  onChange,
  setStepValid,
  validateStep
}) => {
  // State for date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Validate on mount and when form data changes
  useEffect(() => {
    const isValid = validateStep();
    setStepValid(isValid);
  }, [
    formData.nik_anak,
    formData.nick_name,
    formData.full_name,
    formData.tanggal_lahir,
    formData.jenis_kelamin,
    formData.agama,
    formData.jenis_anak_binaan
  ]);
  
  // Religion options
  const religionOptions = [
    { label: '-- Select Religion --', value: '' },
    { label: 'Islam', value: 'Islam' },
    { label: 'Kristen', value: 'Kristen' },
    { label: 'Katolik', value: 'Katolik' },
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Buddha', value: 'Buddha' },
    { label: 'Konghucu', value: 'Konghucu' },
  ];
  
  // Gender options
  const genderOptions = [
    { label: '-- Select Gender --', value: '' },
     { label: 'Laki-laki', value: 'Laki-laki' },
  { label: 'Perempuan', value: 'Perempuan' },
  ];
  
  // Living with options
  const livingWithOptions = [
    { label: '-- Select who the child lives with --', value: '' },
    { label: 'Father', value: 'Ayah' },
    { label: 'Mother', value: 'Ibu' },
    { label: 'Guardian', value: 'Wali' },
  ];
  
  // Child type options
  const childTypeOptions = [
    { label: '-- Select type --', value: '' },
    { label: 'BPCB (Binaan Penuh Calon Beasiswa)', value: 'BPCB' },
    { label: 'NPB (Non Penerima Beasiswa)', value: 'NPB' },
  ];
  
  // Hafalan options
  const hafalanOptions = [
    { label: '-- Select hafalan type --', value: '' },
    { label: 'Tahfidz', value: 'Tahfidz' },
    { label: 'Non-Tahfidz', value: 'Non-Tahfidz' },
  ];
  
  // Transportation options
  const transportationOptions = [
    { label: '-- Select transportation --', value: '' },
    { label: 'Jalan Kaki', value: 'Jalan Kaki' },
    { label: 'Sepeda', value: 'Sepeda' },
    { label: 'Sepeda Motor', value: 'Sepeda Motor' },
    { label: 'Angkutan Umum', value: 'Angkutan Umum' },
    { label: 'Mobil', value: 'Mobil' },
    { label: 'Lainnya', value: 'Lainnya' },
  ];
  
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
    
    onChange('tanggal_lahir', formattedDate);
  }
};
  
  // Handle select image
  const handleSelectImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Permission to access camera roll is required!');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        onChange('foto', result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to select image');
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Child Basic Information</Text>
      
      {/* Photo */}
      <View style={styles.photoContainer}>
        <Text style={styles.label}>Child Photo</Text>
        <View style={styles.photoContent}>
          {formData.foto ? (
            <Image 
              source={{ uri: formData.foto.uri }} 
              style={styles.photoPreview} 
            />
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
        onChangeText={(value) => onChange('nik_anak', value)}
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
            onChangeText={(value) => onChange('anak_ke', value)}
            placeholder="e.g. 2"
            inputProps={{ keyboardType: 'numeric' }}
          />
        </View>
        
        <View style={[styles.inputContainer, styles.inputHalf]}>
          <Text style={styles.label}>Out of Siblings*</Text>
          <TextInput
            value={formData.dari_bersaudara}
            onChangeText={(value) => onChange('dari_bersaudara', value)}
            placeholder="e.g. 3"
            inputProps={{ keyboardType: 'numeric' }}
          />
        </View>
      </View>
      
      {/* Names */}
      <TextInput
        label="Nick Name*"
        value={formData.nick_name}
        onChangeText={(value) => onChange('nick_name', value)}
        placeholder="Enter child's nick name"
        leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
      />
      
      <TextInput
        label="Full Name*"
        value={formData.full_name}
        onChangeText={(value) => onChange('full_name', value)}
        placeholder="Enter child's full name"
        leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
      />
      
      {/* Gender */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender*</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.jenis_kelamin}
            onValueChange={(value) => onChange('jenis_kelamin', value)}
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
            onValueChange={(value) => onChange('agama', value)}
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
        onChangeText={(value) => onChange('tempat_lahir', value)}
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
            onValueChange={(value) => onChange('tinggal_bersama', value)}
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
      
      <Text style={styles.sectionTitle}>Program Information</Text>
      
      {/* Child Type */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Child Program Type*</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.jenis_anak_binaan}
            onValueChange={(value) => onChange('jenis_anak_binaan', value)}
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
            onValueChange={(value) => onChange('hafalan', value)}
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
      
      <Text style={styles.sectionTitle}>Additional Information</Text>
      
      {/* Favorite Subject */}
      <TextInput
        label="Favorite Subject"
        value={formData.pelajaran_favorit}
        onChangeText={(value) => onChange('pelajaran_favorit', value)}
        placeholder="Enter favorite subject"
        leftIcon={<Ionicons name="book-outline" size={20} color="#777" />}
      />
      
      {/* Hobby */}
      <TextInput
        label="Hobby"
        value={formData.hobi}
        onChangeText={(value) => onChange('hobi', value)}
        placeholder="Enter hobby"
        leftIcon={<Ionicons name="happy-outline" size={20} color="#777" />}
      />
      
      {/* Achievements */}
      <TextInput
        label="Achievements"
        value={formData.prestasi}
        onChangeText={(value) => onChange('prestasi', value)}
        placeholder="Enter achievements"
        leftIcon={<Ionicons name="trophy-outline" size={20} color="#777" />}
        multiline
        inputProps={{ numberOfLines: 3 }}
      />
      
      {/* Distance from Home */}
      <TextInput
        label="Distance from Home (km)"
        value={formData.jarak_rumah}
        onChangeText={(value) => onChange('jarak_rumah', value)}
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
            onValueChange={(value) => onChange('transportasi', value)}
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
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
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
  photoContainer: {
    marginBottom: 16,
  },
  photoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
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
});

export default KeluargaFormStepChild;