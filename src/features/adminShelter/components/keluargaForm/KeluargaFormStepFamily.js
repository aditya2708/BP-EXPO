import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

// Import components
import TextInput from '../../../../common/components/TextInput';
import LoadingSpinner from '../../../../common/components/LoadingSpinner';

const KeluargaFormStepFamily = ({
  formData,
  onChange,
  dropdownData,
  setStepValid,
  validateStep,
  isLoadingDropdowns
}) => {
  // Ultra-simple validation state - only show errors when needed
  const [fieldErrors, setFieldErrors] = useState({});
  const scrollViewRef = useRef(null);
  
  // Store current formData in ref to avoid stale closure
  const formDataRef = useRef(formData);

  // Simple refs
  const noKkRef = useRef(null);
  const kepalaKeluargaRef = useRef(null);
  const statusOrtuRef = useRef(null);
  const bankRef = useRef(null);
  const noRekRef = useRef(null);
  const anRekRef = useRef(null);
  const noTlpRef = useRef(null);
  const anTlpRef = useRef(null);
  
  // Update formData ref whenever formData changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Ultra-simple validation - pure functions, no state side effects
  const getFieldError = (fieldName, value) => {
    switch (fieldName) {
      case 'no_kk':
        if (!value) return 'Nomor KK wajib diisi';
        if (value.length !== 16) return 'Nomor KK harus 16 digit';
        break;
        
      case 'kepala_keluarga':
        if (!value) return 'Nama kepala keluarga wajib diisi';
        break;
        
      case 'status_ortu':
        if (!value) return 'Status orang tua wajib dipilih';
        break;
        
      case 'id_bank':
        if (!value) return 'Bank wajib dipilih';
        break;
        
      case 'no_rek':
        if (!value) return 'Nomor rekening wajib diisi';
        break;
        
      case 'an_rek':
        if (!value) return 'Nama pemilik rekening wajib diisi';
        break;
        
      case 'no_tlp':
        if (!value) return 'Nomor telepon wajib diisi';
        break;
        
      case 'an_tlp':
        if (!value) return 'Nama pemilik telepon wajib diisi';
        break;
    }
    return null;
  };

  // Validate all fields - single state update
  const validateAllFields = () => {
    // Get current form values from ref to avoid stale closure
    const currentFormData = formDataRef.current;
    
    const fields = {
      no_kk: currentFormData.no_kk?.trim() || '',
      kepala_keluarga: currentFormData.kepala_keluarga?.trim() || '',
      status_ortu: currentFormData.status_ortu || '',
      id_bank: currentFormData.id_bank || '',
      no_rek: currentFormData.no_rek?.trim() || '',
      an_rek: currentFormData.an_rek?.trim() || '',
      no_tlp: currentFormData.no_tlp?.trim() || '',
      an_tlp: currentFormData.an_tlp?.trim() || ''
    };

    // DEBUG: Log actual field values
    console.log('=== VALIDATION DEBUG ===');
    console.log('Form data values:', fields);
    console.log('Raw formData:', {
      no_kk: currentFormData.no_kk,
      kepala_keluarga: currentFormData.kepala_keluarga,
      status_ortu: currentFormData.status_ortu,
      id_bank: currentFormData.id_bank,
      no_rek: currentFormData.no_rek,
      an_rek: currentFormData.an_rek,
      no_tlp: currentFormData.no_tlp,
      an_tlp: currentFormData.an_tlp
    });

    const errors = {};
    let hasErrors = false;

    // Validate each field
    Object.entries(fields).forEach(([fieldName, value]) => {
      const error = getFieldError(fieldName, value);
      console.log(`Field ${fieldName}:`, { value, error });
      if (error) {
        errors[fieldName] = error;
        hasErrors = true;
      }
    });

    console.log('Final errors:', errors);
    console.log('=== END DEBUG ===');

    // Single state update - no multiple re-renders
    if (hasErrors) {
      setFieldErrors(errors);
      scrollToFirstError(errors);
      return false;
    } else {
      setFieldErrors({});
      return true;
    }
  };

  // Auto-scroll to first error field
  const scrollToFirstError = (errors) => {
    const errorFields = Object.keys(errors);
    if (errorFields.length === 0) return;
    
    const firstErrorField = errorFields[0];
    const fieldMap = {
      no_kk: noKkRef,
      kepala_keluarga: kepalaKeluargaRef,
      status_ortu: statusOrtuRef,
      id_bank: bankRef,
      no_rek: noRekRef,
      an_rek: anRekRef,
      no_tlp: noTlpRef,
      an_tlp: anTlpRef,
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

  // Update parent component validity when form data changes  
  useEffect(() => {
    const isValid = validateStep();
    setStepValid(isValid);
  }, [
    formData.no_kk,
    formData.kepala_keluarga,
    formData.status_ortu,
    formData.id_bank,
    formData.no_rek,
    formData.an_rek,
    formData.no_tlp,
    formData.an_tlp
  ]);

  // Handle field changes - ultra simple
  const handleFieldChange = (fieldName, value) => {
    console.log(`Field change: ${fieldName} = "${value}"`);
    
    // Update form data
    onChange(fieldName, value);
    
    // Clear error when user starts typing (immediate feedback)
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

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

  // Status options for ortu
  const statusOptions = [
    { label: '-- Pilih Status --', value: '' },
    { label: 'Yatim', value: 'yatim' },
    { label: 'Piatu', value: 'piatu' },
    { label: 'Yatim Piatu', value: 'yatim piatu' },
    { label: 'Dhuafa', value: 'dhuafa' },
    { label: 'Non Dhuafa', value: 'non dhuafa' },
  ];

  if (isLoadingDropdowns) {
    return <LoadingSpinner message="Loading form data..." />;
  }

  return (
    <ScrollView ref={scrollViewRef} style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Data Keluarga</Text>
      
      {/* KK Number */}
      <TextInput
        ref={noKkRef}
        label="Nomor Kartu Keluarga*"
        value={formData.no_kk}
        onChangeText={(value) => {
          // Only allow numeric characters
          const numericValue = value.replace(/[^0-9]/g, '');
          handleFieldChange('no_kk', numericValue);
        }}
        placeholder="Masukkan 16 digit nomor KK"
        leftIcon={<Ionicons name="card-outline" size={20} color="#777" />}
        inputProps={{ keyboardType: 'numeric', maxLength: 16 }}
        error={fieldErrors.no_kk}
      />
      
      {/* Family Head Name */}
      <TextInput
        ref={kepalaKeluargaRef}
        label="Nama Kepala Keluarga*"
        value={formData.kepala_keluarga}
        onChangeText={(value) => handleFieldChange('kepala_keluarga', value)}
        placeholder="Masukkan nama lengkap kepala keluarga"
        leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
        error={fieldErrors.kepala_keluarga}
      />
      
      {/* Family Status */}
      <View style={styles.inputContainer} ref={statusOrtuRef}>
        <Text style={styles.label}>Status Orang Tua*</Text>
        <View style={[
          styles.pickerContainer,
          fieldErrors.status_ortu && styles.pickerContainerError
        ]}>
          <Picker
            selectedValue={formData.status_ortu}
            onValueChange={(value) => handleFieldChange('status_ortu', value)}
            style={styles.picker}
          >
            {statusOptions.map((option, index) => (
              <Picker.Item 
                key={index}
                label={option.label} 
                value={option.value} 
              />
            ))}
          </Picker>
        </View>
        {fieldErrors.status_ortu && (
          <Text style={styles.errorText}>{fieldErrors.status_ortu}</Text>
        )}
      </View>
      
      {/* Bank Account */}
      <Text style={styles.sectionTitle}>Data Akun Bank</Text>
      
      {/* Bank Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bank*</Text>
        <View style={[
          styles.pickerContainer,
          fieldErrors.id_bank && styles.pickerContainerError
        ]}>
          <Picker
            selectedValue={formData.id_bank}
            onValueChange={(value) => handleFieldChange('id_bank', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Pilih Bank --" value="" />
            {dropdownData.bank.map((bank) => (
              <Picker.Item 
                key={bank.id_bank}
                label={bank.nama_bank} 
                value={bank.id_bank.toString()} 
              />
            ))}
          </Picker>
        </View>
        {fieldErrors.id_bank && (
          <Text style={styles.errorText}>{fieldErrors.id_bank}</Text>
        )}
      </View>
      
      {/* Account Number */}
      <TextInput
        ref={noRekRef}
        label="Nomor Rekening Bank*"
        value={formData.no_rek}
        onChangeText={(value) => handleFieldChange('no_rek', value)}
        placeholder="Masukkan nomor rekening"
        leftIcon={<Ionicons name="card-outline" size={20} color="#777" />}
        inputProps={{ keyboardType: 'numeric' }}
        error={fieldErrors.no_rek}
      />
      
      {/* Account Holder */}
      <TextInput
        ref={anRekRef}
        label="Atas Nama Rekening*"
        value={formData.an_rek}
        onChangeText={(value) => handleFieldChange('an_rek', value)}
        placeholder="Masukkan nama pemilik rekening"
        leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
        error={fieldErrors.an_rek}
      />
      
      {/* Phone Information */}
      <Text style={styles.sectionTitle}>Data Kontak</Text>
      
      {/* Phone Number */}
      <TextInput
        ref={noTlpRef}
        label="No Telepon*"
        value={formData.no_tlp}
        onChangeText={(value) => handleFieldChange('no_tlp', value)}
        placeholder="Masukkan nomor telepon"
        leftIcon={<Ionicons name="call-outline" size={20} color="#777" />}
        inputProps={{ keyboardType: 'phone-pad' }}
        error={fieldErrors.no_tlp}
      />
      
      {/* Phone Owner */}
      <TextInput
        ref={anTlpRef}
        label="Nama Pemilik No Telepon*"
        value={formData.an_tlp}
        onChangeText={(value) => handleFieldChange('an_tlp', value)}
        placeholder="Masukkan nama pemilik telepon"
        leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
        error={fieldErrors.an_tlp}
      />
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
  optionContainer: {
    marginBottom: 16,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  optionButtons: {
    flexDirection: 'row',
  },
  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  optionButtonSelected: {
    borderColor: '#e74c3c',
    backgroundColor: '#e74c3c',
  },
  optionButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  optionButtonTextSelected: {
    color: '#fff',
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
});

export default KeluargaFormStepFamily;