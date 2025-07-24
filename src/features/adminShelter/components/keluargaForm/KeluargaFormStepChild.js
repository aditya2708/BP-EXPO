import React, { useState, useEffect, useRef } from 'react';
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

import TextInput from '../../../../common/components/TextInput';
import Button from '../../../../common/components/Button';
import { formatDateForApi } from '../../../../common/utils/dateFormatter';

const KeluargaFormStepChild = ({
  formData,
  onChange,
  setStepValid,
  validateStep
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Store current formData in ref to avoid stale closure
  const formDataRef = useRef(formData);
  
  // Update formData ref whenever formData changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Simple refs - no useFormValidation
  const nikAnakRef = useRef(null);
  const anakKeRef = useRef(null);
  const dariBersaudaraRef = useRef(null);
  const nickNameRef = useRef(null);
  const fullNameRef = useRef(null);

  // Enhanced validation function
  const validateStepFields = () => {
    // Get current form values from ref to avoid stale closure
    const currentFormData = formDataRef.current;
    const errors = {};

    // All child fields are required validation
    if (!currentFormData.nik_anak) {
      errors.nik_anak = 'NIK anak wajib diisi';
    } else if (currentFormData.nik_anak.length !== 16) {
      errors.nik_anak = 'NIK harus 16 digit';
    }
    if (!currentFormData.anak_ke) errors.anak_ke = 'Anak ke wajib diisi';
    if (!currentFormData.dari_bersaudara) errors.dari_bersaudara = 'Jumlah bersaudara wajib diisi';
    if (!currentFormData.nick_name) errors.nick_name = 'Nama panggilan wajib diisi';
    if (!currentFormData.full_name) errors.full_name = 'Nama lengkap wajib diisi';
    if (!currentFormData.agama) errors.agama = 'Agama wajib dipilih';
    if (!currentFormData.tempat_lahir) errors.tempat_lahir = 'Tempat lahir wajib diisi';
    if (!currentFormData.tanggal_lahir) errors.tanggal_lahir = 'Tanggal lahir wajib dipilih';
    if (!currentFormData.jenis_kelamin) errors.jenis_kelamin = 'Jenis kelamin wajib dipilih';
    if (!currentFormData.tinggal_bersama) errors.tinggal_bersama = 'Tinggal bersama wajib dipilih';
    if (!currentFormData.hafalan) errors.hafalan = 'Jenis pembinaan wajib dipilih';
    if (!currentFormData.pelajaran_favorit) errors.pelajaran_favorit = 'Pelajaran favorit wajib diisi';
    if (!currentFormData.hobi) errors.hobi = 'Hobi wajib diisi';
    if (!currentFormData.prestasi) errors.prestasi = 'Prestasi wajib diisi';
    if (!currentFormData.jarak_rumah) errors.jarak_rumah = 'Jarak rumah wajib diisi';
    if (!currentFormData.transportasi) errors.transportasi = 'Transportasi wajib dipilih';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  useEffect(() => {
    // Run both validation functions
    const isValid = validateStep() && validateStepFields();
    setStepValid(isValid);
  }, [
    formData.nik_anak,
    formData.anak_ke,
    formData.dari_bersaudara,
    formData.nick_name,
    formData.full_name,
    formData.agama,
    formData.tempat_lahir,
    formData.tanggal_lahir,
    formData.jenis_kelamin,
    formData.tinggal_bersama,
    formData.hafalan,
    formData.pelajaran_favorit,
    formData.hobi,
    formData.prestasi,
    formData.jarak_rumah,
    formData.transportasi
  ]);
  
  const religionOptions = [
    { label: '-- Pilih Agama --', value: '' },
    { label: 'Islam', value: 'Islam' },
    { label: 'Kristen', value: 'Kristen' },
    { label: 'Katolik', value: 'Katolik' },
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Buddha', value: 'Buddha' },
    { label: 'Konghucu', value: 'Konghucu' },
  ];
  
  const genderOptions = [
    { label: '-- Pilih Jenis Kelamin --', value: '' },
     { label: 'Laki-laki', value: 'Laki-laki' },
  { label: 'Perempuan', value: 'Perempuan' },
  ];
  
  const livingWithOptions = [
    { label: '-- Pilih Tinggal Bersama --', value: '' },
    { label: 'Ayah', value: 'Ayah' },
    { label: 'Ibu', value: 'Ibu' },
    { label: 'Ayah dan Ibu', value: 'Ayah dan Ibu' },
    { label: 'Wali', value: 'Wali' },
  ];
  
  const hafalanOptions = [
    { label: '-- Pilih Jenis Pembinaan --', value: '' },
    { label: 'Tahfidz', value: 'Tahfidz' },
    { label: 'Non-Tahfidz', value: 'Non-Tahfidz' },
  ];
  
  const transportationOptions = [
    { label: '-- Pilih transportasi --', value: '' },
    { label: 'Jalan Kaki', value: 'Jalan Kaki' },
    { label: 'Sepeda', value: 'Sepeda' },
    { label: 'Sepeda Motor', value: 'Sepeda Motor' },
    { label: 'Angkutan Umum', value: 'Angkutan Umum' },
    { label: 'Mobil', value: 'Mobil' },
    { label: 'Lainnya', value: 'Lainnya' },
  ];
  
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };
  
  const handleDateChange = (event, selectedDate) => {
    toggleDatePicker();
    
    // Only update if user didn't cancel (selectedDate exists and event type is not dismissed)
    if (selectedDate && event.type !== 'dismissed') {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      
      onChange('tanggal_lahir', formattedDate);
    }
    // If user canceled (event.type === 'dismissed' or no selectedDate), do nothing
  };
  
  const handleSelectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Permission to access camera roll is required!');
        return;
      }
      
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
      <Text style={styles.sectionTitle}>Data Anak</Text>
      
      <View style={styles.photoContainer}>
        <Text style={styles.label}>Foto Anak</Text>
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
            title={formData.foto ? "Ganti Foto" : "Pilih Foto"}
            onPress={handleSelectImage}
            type="outline"
            size="small"
            style={styles.photoButton}
            leftIcon={<Ionicons name="camera-outline" size={18} color="#3498db" />}
          />
        </View>
      </View>
      
      <TextInput
        ref={nikAnakRef}
        label="NIK Anak*"
        value={formData.nik_anak}
        onChangeText={(value) => {
          // Only allow numeric characters
          const numericValue = value.replace(/[^0-9]/g, '');
          onChange('nik_anak', numericValue);
        }}
        placeholder="Masukkan 16 digit NIK anak"
        leftIcon={<Ionicons name="card-outline" size={20} color="#777" />}
        inputProps={{ maxLength: 16, keyboardType: 'numeric' }}
        error={fieldErrors.nik_anak}
      />
      
      <TextInput
        ref={anakKeRef}
        label="Anak ke*"
        value={formData.anak_ke}
        onChangeText={(value) => onChange('anak_ke', value)}
        placeholder="contoh: 2"
        leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
        inputProps={{ keyboardType: 'numeric' }}
        error={fieldErrors.anak_ke}
      />
      
      <TextInput
        ref={dariBersaudaraRef}
        label="Dari Berapa Bersaudara*"
        value={formData.dari_bersaudara}
        onChangeText={(value) => onChange('dari_bersaudara', value)}
        placeholder="Contoh: 2"
        leftIcon={<Ionicons name="people-outline" size={20} color="#777" />}
        inputProps={{ keyboardType: 'numeric' }}
        error={fieldErrors.dari_bersaudara}
      />
      
      <TextInput
        ref={nickNameRef}
        label="Nama Panggilan Anak*"
        value={formData.nick_name}
        onChangeText={(value) => onChange('nick_name', value)}
        placeholder="Masukkan nama panggilan"
        leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
        error={fieldErrors.nick_name}
      />
      
      <TextInput
        ref={fullNameRef}
        label="Nama Lengkap Anak*"
        value={formData.full_name}
        onChangeText={(value) => onChange('full_name', value)}
        placeholder="Masukkan nama lengkap anak"
        leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
        error={fieldErrors.full_name}
      />
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Jenis Kelamin*</Text>
        <View style={[
          styles.pickerContainer,
          fieldErrors.jenis_kelamin && styles.pickerContainerError
        ]}>
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
        {fieldErrors.jenis_kelamin && (
          <Text style={styles.errorText}>{fieldErrors.jenis_kelamin}</Text>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Agama Anak*</Text>
        <View style={[
          styles.pickerContainer,
          fieldErrors.agama && styles.pickerContainerError
        ]}>
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
        {fieldErrors.agama && (
          <Text style={styles.errorText}>{fieldErrors.agama}</Text>
        )}
      </View>
      
      <TextInput
        label="Tempat Lahir*"
        value={formData.tempat_lahir}
        onChangeText={(value) => onChange('tempat_lahir', value)}
        placeholder="Masukkan tempat lahir anak"
        leftIcon={<Ionicons name="location-outline" size={20} color="#777" />}
        error={fieldErrors.tempat_lahir}
      />
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tanggal Lahir*</Text>
        <TouchableOpacity
          style={[
            styles.dateInput,
            fieldErrors.tanggal_lahir && styles.dateInputError
          ]}
          onPress={toggleDatePicker}
        >
          <Ionicons name="calendar-outline" size={20} color="#777" style={styles.dateIcon} />
          <Text style={styles.dateText}>
            {formData.tanggal_lahir || 'Pilih Tanggal'}
          </Text>
        </TouchableOpacity>
        {fieldErrors.tanggal_lahir && (
          <Text style={styles.errorText}>{fieldErrors.tanggal_lahir}</Text>
        )}
        
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
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tinggal Bersama*</Text>
        <View style={[
          styles.pickerContainer,
          fieldErrors.tinggal_bersama && styles.pickerContainerError
        ]}>
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
        {fieldErrors.tinggal_bersama && (
          <Text style={styles.errorText}>{fieldErrors.tinggal_bersama}</Text>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Jenis Pembinaan*</Text>
        <View style={[
          styles.pickerContainer,
          fieldErrors.hafalan && styles.pickerContainerError
        ]}>
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
        {fieldErrors.hafalan && (
          <Text style={styles.errorText}>{fieldErrors.hafalan}</Text>
        )}
      </View>
      
      <TextInput
        label="Pelajaran Favorit*"
        value={formData.pelajaran_favorit}
        onChangeText={(value) => onChange('pelajaran_favorit', value)}
        placeholder="Masukkan pelajaran favorit"
        leftIcon={<Ionicons name="book-outline" size={20} color="#777" />}
        error={fieldErrors.pelajaran_favorit}
      />
      
      <TextInput
        label="Hobi*"
        value={formData.hobi}
        onChangeText={(value) => onChange('hobi', value)}
        placeholder="Masukkan hobi anak"
        leftIcon={<Ionicons name="happy-outline" size={20} color="#777" />}
        error={fieldErrors.hobi}
      />
      
      <TextInput
        label="Prestasi*"
        value={formData.prestasi}
        onChangeText={(value) => onChange('prestasi', value)}
        placeholder="Masukkan prestasi anak"
        multiline
        inputProps={{ numberOfLines: 3 }}
        error={fieldErrors.prestasi}
      />
      
      <TextInput
        label="Jarak dari rumah ke shelter (dalam KM)*"
        value={formData.jarak_rumah}
        onChangeText={(value) => onChange('jarak_rumah', value)}
        placeholder="Masukkan jarak dalam kilometer"
        leftIcon={<Ionicons name="navigate-outline" size={20} color="#777" />}
        inputProps={{ keyboardType: 'numeric' }}
        error={fieldErrors.jarak_rumah}
      />
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Transportasi*</Text>
        <View style={[
          styles.pickerContainer,
          fieldErrors.transportasi && styles.pickerContainerError
        ]}>
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
        {fieldErrors.transportasi && (
          <Text style={styles.errorText}>{fieldErrors.transportasi}</Text>
        )}
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
  dateInputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  pickerContainerError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
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