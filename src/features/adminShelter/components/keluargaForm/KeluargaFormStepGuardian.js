import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Import components
import TextInput from '../../../../common/components/TextInput';
import { formatDateForApi } from '../../../../common/utils/dateFormatter';

const KeluargaFormStepGuardian = ({
  formData,
  onChange,
  setStepValid,
  validateStep
}) => {
  // State for date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Store current formData in ref to avoid stale closure
  const formDataRef = useRef(formData);
  
  // Update formData ref whenever formData changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Enhanced form validation hook
  
  // Create refs for key form fields
  const nikWaliRef = useRef('nik_wali');
  const namaWaliRef = useRef('nama_wali');

  // Enhanced validation function
  const validateStepFields = () => {
    // Get current form values from ref to avoid stale closure
    const currentFormData = formDataRef.current;
    const errors = {};

    // Guardian validation - all fields required
    if (!currentFormData.nama_wali) errors.nama_wali = 'Nama wali wajib diisi';
    if (!currentFormData.nik_wali) {
      errors.nik_wali = 'NIK wali wajib diisi';
    } else if (currentFormData.nik_wali.length !== 16) {
      errors.nik_wali = 'NIK wali harus 16 digit';
    }
    if (!currentFormData.agama_wali) errors.agama_wali = 'Agama wali wajib dipilih';
    if (!currentFormData.tempat_lahir_wali) errors.tempat_lahir_wali = 'Tempat lahir wali wajib diisi';
    if (!currentFormData.tanggal_lahir_wali) errors.tanggal_lahir_wali = 'Tanggal lahir wali wajib dipilih';
    if (!currentFormData.alamat_wali) errors.alamat_wali = 'Alamat wali wajib diisi';
    if (!currentFormData.penghasilan_wali) errors.penghasilan_wali = 'Penghasilan wali wajib dipilih';
    if (!currentFormData.hub_kerabat_wali) errors.hub_kerabat_wali = 'Hubungan kerabat wali wajib dipilih';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate on mount and when form data changes
  useEffect(() => {
    // Run both validation functions
    const isValid = validateStep() && validateStepFields();
    setStepValid(isValid);
  }, [
    formData.nik_wali,
    formData.nama_wali,
    formData.agama_wali,
    formData.tempat_lahir_wali,
    formData.tanggal_lahir_wali,
    formData.alamat_wali,
    formData.penghasilan_wali,
    formData.hub_kerabat_wali
  ]);
  
  // Religion options
  const religionOptions = [
    { label: '-- Pilih Agama --', value: '' },
    { label: 'Islam', value: 'Islam' },
    { label: 'Kristen', value: 'Kristen' },
    { label: 'Katolik', value: 'Katolik' },
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Buddha', value: 'Buddha' },
    { label: 'Konghucu', value: 'Konghucu' },
  ];
  
  // Income options
  const incomeOptions = [
    { label: '-- Pilih Penghasilan --', value: '' },
    { label: 'Kurang dari Rp 1.000.000', value: 'Kurang dari Rp 1.000.000' },
    { label: 'Rp 1.000.000 - Rp 3.000.000', value: 'Rp 1.000.000 - Rp 3.000.000' },
    { label: 'Rp 3.000.001 - Rp 5.000.000', value: 'Rp 3.000.001 - Rp 5.000.000' },
    { label: 'Rp 5.000.001 - Rp 10.000.000', value: 'Rp 5.000.001 - Rp 10.000.000' },
    { label: 'Lebih dari Rp 10.000.000', value: 'Lebih dari Rp 10.000.000' },
  ];
  
  // Relation options
  const relationOptions = [
    { label: '-- Pilih Hubungan --', value: '' },
    { label: 'Kakek/Nenek', value: 'Kakek/Nenek' },
    { label: 'Paman/Bibi', value: 'Paman/Bibi' },
    { label: 'Saudara Kandung', value: 'Saudara Kandung' },
    { label: 'Sepupu', value: 'Sepupu' },
    { label: 'Tetangga', value: 'Tetangga' },
    { label: 'Lainnya', value: 'Lainnya' },
  ];
  
  // Toggle date picker
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };
  
  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    toggleDatePicker();
    
    // Only update if user didn't cancel (selectedDate exists and event type is not dismissed)
    if (selectedDate && event.type !== 'dismissed') {
      // Format date as DD-MM-YYYY
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      
      onChange('tanggal_lahir_wali', formattedDate);
    }
    // If user canceled (event.type === 'dismissed' or no selectedDate), do nothing
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Data Wali</Text>
      
      {/* Guardian's NIK */}
      <TextInput
        ref={nikWaliRef}
        label="NIK Wali*"
        value={formData.nik_wali}
        onChangeText={(value) => {
          // Only allow numeric characters
          const numericValue = value.replace(/[^0-9]/g, '');
          onChange('nik_wali', numericValue);
        }}
        placeholder="Masukkan 16 digit NIK wali"
        leftIcon={<Ionicons name="card-outline" size={20} color="#777" />}
        inputProps={{ maxLength: 16, keyboardType: 'numeric' }}
        error={validationErrors.nik_wali}
      />
      
      {/* Guardian's Name */}
      <TextInput
        ref={namaWaliRef}
        label="Nama Lengkap*"
        value={formData.nama_wali}
        onChangeText={(value) => onChange('nama_wali', value)}
        placeholder="Masukkan nama lengkap wali"
        leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
        error={validationErrors.nama_wali}
      />
      
      {/* Relation to Child */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hubungan Kerabat*</Text>
        <View style={[
          styles.pickerContainer,
          validationErrors.hub_kerabat_wali && styles.pickerContainerError
        ]}>
          <Picker
            selectedValue={formData.hub_kerabat_wali}
            onValueChange={(value) => onChange('hub_kerabat_wali', value)}
            style={styles.picker}
          >
            {relationOptions.map((option, index) => (
              <Picker.Item 
                key={index}
                label={option.label} 
                value={option.value} 
              />
            ))}
          </Picker>
        </View>
        {validationErrors.hub_kerabat_wali && (
          <Text style={styles.errorText}>{validationErrors.hub_kerabat_wali}</Text>
        )}
      </View>
      
      {/* Religion */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Agama Wali*</Text>
        <View style={[
          styles.pickerContainer,
          validationErrors.agama_wali && styles.pickerContainerError
        ]}>
          <Picker
            selectedValue={formData.agama_wali}
            onValueChange={(value) => onChange('agama_wali', value)}
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
        {validationErrors.agama_wali && (
          <Text style={styles.errorText}>{validationErrors.agama_wali}</Text>
        )}
      </View>
      
      {/* Place of Birth */}
      <TextInput
        label="Tempat Lahir Wali*"
        value={formData.tempat_lahir_wali}
        onChangeText={(value) => onChange('tempat_lahir_wali', value)}
        placeholder="Masukkan tempat lahir wali"
        leftIcon={<Ionicons name="location-outline" size={20} color="#777" />}
        error={validationErrors.tempat_lahir_wali}
      />
      
 
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tanggal Lahir Wali*</Text>
        <TouchableOpacity
          style={[
            styles.dateInput,
            validationErrors.tanggal_lahir_wali && styles.dateInputError
          ]}
          onPress={toggleDatePicker}
        >
          <Ionicons name="calendar-outline" size={20} color="#777" style={styles.dateIcon} />
          <Text style={styles.dateText}>
            {formData.tanggal_lahir_wali || 'Pilih Tanggal'}
          </Text>
        </TouchableOpacity>
        {validationErrors.tanggal_lahir_wali && (
          <Text style={styles.errorText}>{validationErrors.tanggal_lahir_wali}</Text>
        )}
        
        {showDatePicker && (
          <DateTimePicker
            value={formData.tanggal_lahir_wali ? new Date(formData.tanggal_lahir_wali.split('-').reverse().join('-')) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>
      
      {/* Address */}
      <TextInput
        label="Alamat Wali*"
        value={formData.alamat_wali}
        onChangeText={(value) => onChange('alamat_wali', value)}
        placeholder="Masukkan alamat lengkap wali"
        multiline
        inputProps={{ numberOfLines: 3 }}
        error={validationErrors.alamat_wali}
      />
      
      {/* Income */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Penghasilan Bulanan*</Text>
        <View style={[
          styles.pickerContainer,
          validationErrors.penghasilan_wali && styles.pickerContainerError
        ]}>
          <Picker
            selectedValue={formData.penghasilan_wali}
            onValueChange={(value) => onChange('penghasilan_wali', value)}
            style={styles.picker}
          >
            {incomeOptions.map((option, index) => (
              <Picker.Item 
                key={index}
                label={option.label} 
                value={option.value} 
              />
            ))}
          </Picker>
        </View>
        {validationErrors.penghasilan_wali && (
          <Text style={styles.errorText}>{validationErrors.penghasilan_wali}</Text>
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
  helperTextContainer: {
    marginVertical: 16,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  helperText: {
    fontSize: 14,
    color: '#666',
  },
});

export default KeluargaFormStepGuardian;