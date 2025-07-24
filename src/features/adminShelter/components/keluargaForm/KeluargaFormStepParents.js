import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Import components
import TextInput from '../../../../common/components/TextInput';
import { formatDateForApi } from '../../../../common/utils/dateFormatter';

const KeluargaFormStepParents = ({
  formData,
  onChange,
  setStepValid,
  validateStep
}) => {
  // Always show both parent forms, but determine which fields to show based on status
  const shouldShowFatherForm = true; // Always show father form
  const shouldShowMotherForm = true; // Always show mother form
  
  // For deceased parents, only show limited fields (name, death date, cause of death)
  const isFatherDeceased = formData.status_ortu === 'yatim' || formData.status_ortu === 'yatim piatu';
  const isMotherDeceased = formData.status_ortu === 'piatu' || formData.status_ortu === 'yatim piatu';
  // State for date pickers
  const [showDatePicker, setShowDatePicker] = useState({
    fatherBirth: false,
    fatherDeath: false,
    motherBirth: false,
    motherDeath: false,
  });

  // Enhanced validation state
  const [validationErrors, setValidationErrors] = useState({});
  const scrollViewRef = useRef(null);
  
  // Store current formData in ref to avoid stale closure
  const formDataRef = useRef(formData);

  // Handle field change with immediate error clearing
  const handleFieldChange = (fieldName, value) => {
    onChange(fieldName, value);
    
    // Clear error when user starts typing (immediate feedback)
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  // Create refs for key form fields
  const namaAyahRef = useRef(null);
  const nikAyahRef = useRef(null);
  const namaIbuRef = useRef(null);
  const nikIbuRef = useRef(null);
  
  // Update formData ref whenever formData changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Enhanced validation function with current data from ref
  const validateAllFields = () => {
    // Get current form values from ref to avoid stale closure
    const currentFormData = formDataRef.current;
    
    const errors = {};

    // Father validation (if not deceased)
    if (!isFatherDeceased) {
      if (!currentFormData.nama_ayah?.trim()) errors.nama_ayah = 'Nama ayah wajib diisi';
      if (!currentFormData.nik_ayah?.trim()) {
        errors.nik_ayah = 'NIK ayah wajib diisi';
      } else if (currentFormData.nik_ayah.length !== 16) {
        errors.nik_ayah = 'NIK ayah harus 16 digit';
      }
    } else {
      // Father deceased validation
      if (!currentFormData.nama_ayah?.trim()) errors.nama_ayah = 'Nama ayah wajib diisi';
      if (!currentFormData.tanggal_kematian_ayah) errors.tanggal_kematian_ayah = 'Tanggal kematian ayah wajib diisi';
      if (!currentFormData.penyebab_kematian_ayah?.trim()) errors.penyebab_kematian_ayah = 'Penyebab kematian ayah wajib diisi';
    }

    // Mother validation (if not deceased)
    if (!isMotherDeceased) {
      if (!currentFormData.nama_ibu?.trim()) errors.nama_ibu = 'Nama ibu wajib diisi';
      if (!currentFormData.nik_ibu?.trim()) {
        errors.nik_ibu = 'NIK ibu wajib diisi';
      } else if (currentFormData.nik_ibu.length !== 16) {
        errors.nik_ibu = 'NIK ibu harus 16 digit';
      }
    } else {
      // Mother deceased validation
      if (!currentFormData.nama_ibu?.trim()) errors.nama_ibu = 'Nama ibu wajib diisi';
      if (!currentFormData.tanggal_kematian_ibu) errors.tanggal_kematian_ibu = 'Tanggal kematian ibu wajib diisi';
      if (!currentFormData.penyebab_kematian_ibu?.trim()) errors.penyebab_kematian_ibu = 'Penyebab kematian ibu wajib diisi';
    }

    // Single state update with scroll to first error
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      scrollToFirstError(errors);
      return false;
    } else {
      setValidationErrors({});
      return true;
    }
  };

  // Auto-scroll to first error field
  const scrollToFirstError = (errors) => {
    const errorFields = Object.keys(errors);
    if (errorFields.length === 0) return;
    
    const firstErrorField = errorFields[0];
    const fieldMap = {
      nama_ayah: namaAyahRef,
      nik_ayah: nikAyahRef,
      tanggal_kematian_ayah: null, // Custom date field handling
      penyebab_kematian_ayah: null,
      nama_ibu: namaIbuRef,
      nik_ibu: nikIbuRef,
      tanggal_kematian_ibu: null, // Custom date field handling
      penyebab_kematian_ibu: null,
    };
    
    const fieldRef = fieldMap[firstErrorField];
    
    if (fieldRef && fieldRef.current) {
      setTimeout(() => {
        fieldRef.current.measureLayout(
          scrollViewRef.current,
          (x, y) => {
            scrollViewRef.current?.scrollTo({
              y: Math.max(0, y - 100),
              animated: true,
            });
          },
          () => {}
        );
        fieldRef.current.focus();
      }, 100);
    }
  };
  
  // Auto-clear death data when status changes to alive
  useEffect(() => {
    if (formData.status_ortu) {
      // If father becomes alive, clear death data
      if (!isFatherDeceased && (formData.tanggal_kematian_ayah || formData.penyebab_kematian_ayah)) {
        onChange('tanggal_kematian_ayah', '');
        onChange('penyebab_kematian_ayah', '');
      }
      
      // If mother becomes alive, clear death data  
      if (!isMotherDeceased && (formData.tanggal_kematian_ibu || formData.penyebab_kematian_ibu)) {
        onChange('tanggal_kematian_ibu', '');
        onChange('penyebab_kematian_ibu', '');
      }
    }
  }, [formData.status_ortu, isFatherDeceased, isMotherDeceased]);

  // Set default location values for living parents (required by parent validation)
  useEffect(() => {
    // Set default province/kabupaten/kecamatan/kelurahan IDs for living father
    if (!isFatherDeceased && formData.nama_ayah) {
      if (!formData.id_prov_ayah) onChange('id_prov_ayah', '1'); // Default province
      if (!formData.id_kab_ayah) onChange('id_kab_ayah', '1'); // Default kabupaten
      if (!formData.id_kec_ayah) onChange('id_kec_ayah', '1'); // Default kecamatan
      if (!formData.id_kel_ayah) onChange('id_kel_ayah', '1'); // Default kelurahan
    }
    
    // Set default province/kabupaten/kecamatan/kelurahan IDs for living mother
    if (!isMotherDeceased && formData.nama_ibu) {
      if (!formData.id_prov_ibu) onChange('id_prov_ibu', '1'); // Default province
      if (!formData.id_kab_ibu) onChange('id_kab_ibu', '1'); // Default kabupaten
      if (!formData.id_kec_ibu) onChange('id_kec_ibu', '1'); // Default kecamatan
      if (!formData.id_kel_ibu) onChange('id_kel_ibu', '1'); // Default kelurahan
    }
  }, [isFatherDeceased, isMotherDeceased, formData.nama_ayah, formData.nama_ibu]);

  // Trigger validation from parent component (when user clicks "Selanjutnya")
  const triggerValidation = () => {
    console.log('triggerValidation called - using current formData from ref');
    // Return immediate validation with current formData from ref
    return validateAllFields();
  };

  // Expose validation function to parent via onChange - run only once
  useEffect(() => {
    onChange('_stepValidation', triggerValidation);
  }, []); // Empty dependency array - function uses ref so no stale closure

  // Update parent component validity when form data changes silently
  useEffect(() => {
    const isValid = validateStep();
    setStepValid(isValid);
  }, [
    formData.status_ortu,
    formData.nik_ayah,
    formData.nama_ayah,
    formData.tanggal_kematian_ayah,
    formData.penyebab_kematian_ayah,
    formData.nik_ibu,
    formData.nama_ibu,
    formData.tanggal_kematian_ibu,
    formData.penyebab_kematian_ibu,
    formData.id_prov_ayah,
    formData.id_kab_ayah,
    formData.id_kec_ayah,
    formData.id_kel_ayah,
    formData.id_prov_ibu,
    formData.id_kab_ibu,
    formData.id_kec_ibu,
    formData.id_kel_ibu
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
  
  // Toggle date picker
  const toggleDatePicker = (field) => {
    setShowDatePicker(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Handle date change
  const handleDateChange = (event, selectedDate, field) => {
    toggleDatePicker(field);
    
    // Only update if user didn't cancel (selectedDate exists and event type is not dismissed)
    if (selectedDate && event.type !== 'dismissed') {
      // Format date as DD-MM-YYYY
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      
      switch (field) {
        case 'fatherBirth':
          onChange('tanggal_lahir_ayah', formattedDate);
          break;
        case 'fatherDeath':
          onChange('tanggal_kematian_ayah', formattedDate);
          break;
        case 'motherBirth':
          onChange('tanggal_lahir_ibu', formattedDate);
          break;
        case 'motherDeath':
          onChange('tanggal_kematian_ibu', formattedDate);
          break;
      }
    }
    // If user canceled (event.type === 'dismissed' or no selectedDate), do nothing
  };
  
  // Clear death date function
  const clearDeathDate = (parent) => {
    if (parent === 'father') {
      onChange('tanggal_kematian_ayah', '');
      onChange('penyebab_kematian_ayah', '');
    } else if (parent === 'mother') {
      onChange('tanggal_kematian_ibu', '');
      onChange('penyebab_kematian_ibu', '');
    }
  };

  return (
    <ScrollView ref={scrollViewRef} style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Father Information */}
      {shouldShowFatherForm && (
        <>
          <Text style={styles.sectionTitle}>Data Ayah</Text>
      
      {/* Father's Name - Always shown */}
   <TextInput
  ref={namaAyahRef}
  label="Nama Lengkap Ayah*"
  value={formData.nama_ayah}
  onChangeText={(value) => handleFieldChange('nama_ayah', value)}
  placeholder="Masukkan nama lengkap ayah"
  leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
  error={validationErrors.nama_ayah}
/>

      
      {/* For deceased father, only show death-related fields */}
      {isFatherDeceased ? (
        <>
          {/* Date of Death */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tanggal Kematian Ayah*</Text>
            <View style={styles.dateInputContainer}>
              <TouchableOpacity
                style={[styles.dateInput, validationErrors.tanggal_kematian_ayah && styles.dateInputError]}
                onPress={() => toggleDatePicker('fatherDeath')}
              >
                <Ionicons name="calendar-outline" size={20} color="#777" style={styles.dateIcon} />
                <Text style={styles.dateText}>
                  {formData.tanggal_kematian_ayah || 'Pilih Tanggal Kematian'}
                </Text>
              </TouchableOpacity>
              {formData.tanggal_kematian_ayah && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => clearDeathDate('father')}
                >
                  <Ionicons name="close-circle" size={24} color="#e74c3c" />
                </TouchableOpacity>
              )}
            </View>
            {validationErrors.tanggal_kematian_ayah && (
              <Text style={styles.errorText}>{validationErrors.tanggal_kematian_ayah}</Text>
            )}
            
            {showDatePicker.fatherDeath && (
              <DateTimePicker
                value={formData.tanggal_kematian_ayah ? new Date(formData.tanggal_kematian_ayah.split('-').reverse().join('-')) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'fatherDeath')}
                maximumDate={new Date()}
              />
            )}
          </View>
          
          {/* Cause of Death */}
          <TextInput
            label="Penyebab Kematian Ayah*"
            value={formData.penyebab_kematian_ayah}
            onChangeText={(value) => handleFieldChange('penyebab_kematian_ayah', value)}
            placeholder=""
            leftIcon={<Ionicons name="information-circle-outline" size={20} color="#777" />}
            error={validationErrors.penyebab_kematian_ayah}
          />
        </>
      ) : (
        <>
          {/* For living father, show all fields */}
          
          {/* Father's NIK */}
          <TextInput
            ref={nikAyahRef}
            label="NIK Ayah*"
            value={formData.nik_ayah}
            onChangeText={(value) => {
              // Only allow numeric characters
              const numericValue = value.replace(/[^0-9]/g, '');
              handleFieldChange('nik_ayah', numericValue);
            }}
            placeholder="Masukkan 16 digit NIK ayah"
            leftIcon={<Ionicons name="card-outline" size={20} color="#777" />}
            inputProps={{ maxLength: 16, keyboardType: 'numeric' }}
            error={validationErrors.nik_ayah}
          />
      
      {/* Religion */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Agama Ayah</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.agama_ayah}
            onValueChange={(value) => onChange('agama_ayah', value)}
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
      
      {/* Place of Birth */}
      <TextInput
        label="Tempat lahir"
        value={formData.tempat_lahir_ayah}
        onChangeText={(value) => onChange('tempat_lahir_ayah', value)}
        placeholder="Masukkan tempat lahir ayah"
        leftIcon={<Ionicons name="location-outline" size={20} color="#777" />}
      />
      
     
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tanggal Lahir Ayah</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => toggleDatePicker('fatherBirth')}
        >
          <Ionicons name="calendar-outline" size={20} color="#777" style={styles.dateIcon} />
          <Text style={styles.dateText}>
            {formData.tanggal_lahir_ayah || 'Pilih Tanggal Lahir'}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker.fatherBirth && (
          <DateTimePicker
            value={formData.tanggal_lahir_ayah ? new Date(formData.tanggal_lahir_ayah.split('-').reverse().join('-')) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'fatherBirth')}
            maximumDate={new Date()}
          />
        )}
      </View>
      
      {/* Address */}
      <TextInput
        label="Alamat Ayah"
        value={formData.alamat_ayah}
        onChangeText={(value) => onChange('alamat_ayah', value)}
        placeholder="Masukkan alamat lengkap ayah"
        multiline
        inputProps={{ numberOfLines: 3 }}
      />
      
      {/* Income */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Penghasilan Bulanan Ayah</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.penghasilan_ayah}
            onValueChange={(value) => onChange('penghasilan_ayah', value)}
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
      </View>
      
          {/* Date of Death - Optional for living parents */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Isi jika sudah meninggal</Text>
            <View style={styles.dateInputContainer}>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => toggleDatePicker('fatherDeath')}
              >
                <Ionicons name="calendar-outline" size={20} color="#777" style={styles.dateIcon} />
                <Text style={styles.dateText}>
                  {formData.tanggal_kematian_ayah || 'Tanggal Kematian'}
                </Text>
              </TouchableOpacity>
              {formData.tanggal_kematian_ayah && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => clearDeathDate('father')}
                >
                  <Ionicons name="close-circle" size={24} color="#e74c3c" />
                </TouchableOpacity>
              )}
            </View>
            
            {showDatePicker.fatherDeath && (
              <DateTimePicker
                value={formData.tanggal_kematian_ayah ? new Date(formData.tanggal_kematian_ayah.split('-').reverse().join('-')) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'fatherDeath')}
                maximumDate={new Date()}
              />
            )}
          </View>
          
          {/* Cause of Death */}
          {formData.tanggal_kematian_ayah && (
            <TextInput
              label="Penyebab Kematian"
              value={formData.penyebab_kematian_ayah}
              onChangeText={(value) => onChange('penyebab_kematian_ayah', value)}
              placeholder=""
              leftIcon={<Ionicons name="information-circle-outline" size={20} color="#777" />}
            />
          )}
        </>
      )}
        </>
      )}
      
      {shouldShowFatherForm && shouldShowMotherForm && (
        <View style={styles.separator} />
      )}
      
      {/* Mother Information */}
      {shouldShowMotherForm && (
        <>
          <Text style={styles.sectionTitle}>Data Ibu</Text>
      
      {/* Mother's Name - Always shown */}
 <TextInput
  ref={namaIbuRef}
  label="Nama Lengkap Ibu*"
  value={formData.nama_ibu}
  onChangeText={(value) => handleFieldChange('nama_ibu', value)}
  placeholder="Masukkan nama lengkap ibu"
  leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
  error={validationErrors.nama_ibu}
/>

      
      {/* For deceased mother, only show death-related fields */}
      {isMotherDeceased ? (
        <>
          {/* Date of Death */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tanggal Kematian Ibu*</Text>
            <View style={styles.dateInputContainer}>
              <TouchableOpacity
                style={[styles.dateInput, validationErrors.tanggal_kematian_ibu && styles.dateInputError]}
                onPress={() => toggleDatePicker('motherDeath')}
              >
                <Ionicons name="calendar-outline" size={20} color="#777" style={styles.dateIcon} />
                <Text style={styles.dateText}>
                  {formData.tanggal_kematian_ibu || 'Pilih Tanggal Kematian'}
                </Text>
              </TouchableOpacity>
              {formData.tanggal_kematian_ibu && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => clearDeathDate('mother')}
                >
                  <Ionicons name="close-circle" size={24} color="#e74c3c" />
                </TouchableOpacity>
              )}
            </View>
            {validationErrors.tanggal_kematian_ibu && (
              <Text style={styles.errorText}>{validationErrors.tanggal_kematian_ibu}</Text>
            )}
            
            {showDatePicker.motherDeath && (
              <DateTimePicker
                value={formData.tanggal_kematian_ibu ? new Date(formData.tanggal_kematian_ibu.split('-').reverse().join('-')) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'motherDeath')}
                maximumDate={new Date()}
              />
            )}
          </View>
          
          {/* Cause of Death */}
          <TextInput
            label="Penyebab Kematian Ibu*"
            value={formData.penyebab_kematian_ibu}
            onChangeText={(value) => handleFieldChange('penyebab_kematian_ibu', value)}
            placeholder=""
            leftIcon={<Ionicons name="information-circle-outline" size={20} color="#777" />}
            error={validationErrors.penyebab_kematian_ibu}
          />
        </>
      ) : (
        <>
          {/* For living mother, show all fields */}
          
          {/* Mother's NIK */}
          <TextInput
            ref={nikIbuRef}
            label="NIK Ibu*"
            value={formData.nik_ibu}
            onChangeText={(value) => {
              // Only allow numeric characters
              const numericValue = value.replace(/[^0-9]/g, '');
              handleFieldChange('nik_ibu', numericValue);
            }}
            placeholder="Masukkan 16 digit NIK ibu"
            leftIcon={<Ionicons name="card-outline" size={20} color="#777" />}
            inputProps={{ maxLength: 16, keyboardType: 'numeric' }}
            error={validationErrors.nik_ibu}
          />
      
      {/* Religion */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Agama Ibu</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.agama_ibu}
            onValueChange={(value) => onChange('agama_ibu', value)}
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
      
      {/* Place of Birth */}
      <TextInput
        label="Tempat Lahir"
        value={formData.tempat_lahir_ibu}
        onChangeText={(value) => onChange('tempat_lahir_ibu', value)}
        placeholder=""
        leftIcon={<Ionicons name="location-outline" size={20} color="#777" />}
      />
      
     
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tanggal Lahir</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => toggleDatePicker('motherBirth')}
        >
          <Ionicons name="calendar-outline" size={20} color="#777" style={styles.dateIcon} />
          <Text style={styles.dateText}>
            {formData.tanggal_lahir_ibu || 'Pilih Tanggal Lahir'}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker.motherBirth && (
          <DateTimePicker
            value={formData.tanggal_lahir_ibu ? new Date(formData.tanggal_lahir_ibu.split('-').reverse().join('-')) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'motherBirth')}
            maximumDate={new Date()}
          />
        )}
      </View>
      
      {/* Address */}
      <TextInput
        label="Alamat Ibu"
        value={formData.alamat_ibu}
        onChangeText={(value) => onChange('alamat_ibu', value)}
        placeholder=""
        multiline
        inputProps={{ numberOfLines: 3 }}
      />
      
      {/* Income */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Penghasilan Bulanan Ibu</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.penghasilan_ibu}
            onValueChange={(value) => onChange('penghasilan_ibu', value)}
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
      </View>
      
          {/* Date of Death - Optional for living parents */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Isi Jika Sudah meninggal</Text>
            <View style={styles.dateInputContainer}>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => toggleDatePicker('motherDeath')}
              >
                <Ionicons name="calendar-outline" size={20} color="#777" style={styles.dateIcon} />
                <Text style={styles.dateText}>
                  {formData.tanggal_kematian_ibu || 'Pilih Tanggal Kematian'}
                </Text>
              </TouchableOpacity>
              {formData.tanggal_kematian_ibu && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => clearDeathDate('mother')}
                >
                  <Ionicons name="close-circle" size={24} color="#e74c3c" />
                </TouchableOpacity>
              )}
            </View>
            
            {showDatePicker.motherDeath && (
              <DateTimePicker
                value={formData.tanggal_kematian_ibu ? new Date(formData.tanggal_kematian_ibu.split('-').reverse().join('-')) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'motherDeath')}
                maximumDate={new Date()}
              />
            )}
          </View>
          
          {/* Cause of Death */}
          {formData.tanggal_kematian_ibu && (
            <TextInput
              label="Penyebab Kematian Ibu"
              value={formData.penyebab_kematian_ibu}
              onChangeText={(value) => onChange('penyebab_kematian_ibu', value)}
              placeholder=""
              leftIcon={<Ionicons name="information-circle-outline" size={20} color="#777" />}
            />
          )}
        </>
      )}
        </>
      )}
      
      
      <View style={styles.helperTextContainer}>
        <Text style={styles.helperText}>
          * Field yang ditampilkan disesuaikan dengan status orang tua.
        </Text>
      </View>
      
    </ScrollView>
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
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  noDataContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  dateInputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },

});

export default KeluargaFormStepParents;