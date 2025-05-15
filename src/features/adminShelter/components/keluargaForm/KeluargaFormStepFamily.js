import React, { useState, useEffect } from 'react';
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
  // Validate on mount and when form data changes
  useEffect(() => {
    const isValid = validateStep();
    setStepValid(isValid);
  }, [
    formData.no_kk,
    formData.kepala_keluarga,
    formData.status_ortu,
    formData.id_kacab,
    formData.id_wilbin
    
  ]);

  // Toggle bank account section
  const toggleBankAccount = (value) => {
    onChange('bank_choice', value);
    if (value === 'no') {
      onChange('id_bank', '');
      onChange('no_rek', '');
      onChange('an_rek', '');
    }
  };

  // Toggle phone section
  const togglePhone = (value) => {
    onChange('telp_choice', value);
    if (value === 'no') {
      onChange('no_tlp', '');
      onChange('an_tlp', '');
    }
  };

  // Status options for ortu
  const statusOptions = [
    { label: '-- Select Status --', value: '' },
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
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      
      {/* KK Number */}
      <TextInput
        label="Family Card Number (KK)*"
        value={formData.no_kk}
        onChangeText={(value) => onChange('no_kk', value)}
        placeholder="Enter family card number"
        leftIcon={<Ionicons name="card-outline" size={20} color="#777" />}
      />
      
      {/* Family Head Name */}
      <TextInput
        label="Family Head Name*"
        value={formData.kepala_keluarga}
        onChangeText={(value) => onChange('kepala_keluarga', value)}
        placeholder="Enter family head name"
        leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
      />
      
      {/* Family Status */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Family Status*</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.status_ortu}
            onValueChange={(value) => onChange('status_ortu', value)}
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
      </View>
      
      {/* Kacab Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cabang (Kacab)*</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.id_kacab}
            onValueChange={(value) => onChange('id_kacab', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Cabang --" value="" />
            {dropdownData.kacab.map((kacab) => (
              <Picker.Item 
                key={kacab.id_kacab}
                label={kacab.nama_kacab} 
                value={kacab.id_kacab.toString()} 
              />
            ))}
          </Picker>
        </View>
      </View>
      
      {/* Wilbin Selection - Only show if kacab is selected */}
      {formData.id_kacab && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Wilayah Binaan (Wilbin)*</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.id_wilbin}
              onValueChange={(value) => onChange('id_wilbin', value)}
              style={styles.picker}
            >
              <Picker.Item label="-- Select Wilbin --" value="" />
              {dropdownData.wilbin.map((wilbin) => (
                <Picker.Item 
                  key={wilbin.id_wilbin}
                  label={wilbin.nama_wilbin} 
                  value={wilbin.id_wilbin.toString()} 
                />
              ))}
            </Picker>
          </View>
        </View>
      )}
      
      {/* Bank Account */}
      <Text style={styles.sectionTitle}>Bank Account Information</Text>
      
      <View style={styles.optionContainer}>
        <Text style={styles.optionLabel}>Does this family have a bank account?</Text>
        <View style={styles.optionButtons}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.bank_choice === 'yes' && styles.optionButtonSelected
            ]}
            onPress={() => toggleBankAccount('yes')}
          >
            <Text style={[
              styles.optionButtonText,
              formData.bank_choice === 'yes' && styles.optionButtonTextSelected
            ]}>Yes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.bank_choice === 'no' && styles.optionButtonSelected
            ]}
            onPress={() => toggleBankAccount('no')}
          >
            <Text style={[
              styles.optionButtonText,
              formData.bank_choice === 'no' && styles.optionButtonTextSelected
            ]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {formData.bank_choice === 'yes' && (
        <>
          {/* Bank Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bank</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.id_bank}
                onValueChange={(value) => onChange('id_bank', value)}
                style={styles.picker}
              >
                <Picker.Item label="-- Select Bank --" value="" />
                {dropdownData.bank.map((bank) => (
                  <Picker.Item 
                    key={bank.id_bank}
                    label={bank.nama_bank} 
                    value={bank.id_bank.toString()} 
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          {/* Account Number */}
          <TextInput
            label="Account Number"
            value={formData.no_rek}
            onChangeText={(value) => onChange('no_rek', value)}
            placeholder="Enter account number"
            leftIcon={<Ionicons name="card-outline" size={20} color="#777" />}
            inputProps={{ keyboardType: 'numeric' }}
          />
          
          {/* Account Holder */}
          <TextInput
            label="Account Holder Name"
            value={formData.an_rek}
            onChangeText={(value) => onChange('an_rek', value)}
            placeholder="Enter account holder name"
            leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
          />
        </>
      )}
      
      {/* Phone Information */}
      <Text style={styles.sectionTitle}>Phone Information</Text>
      
      <View style={styles.optionContainer}>
        <Text style={styles.optionLabel}>Does this family have a phone?</Text>
        <View style={styles.optionButtons}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.telp_choice === 'yes' && styles.optionButtonSelected
            ]}
            onPress={() => togglePhone('yes')}
          >
            <Text style={[
              styles.optionButtonText,
              formData.telp_choice === 'yes' && styles.optionButtonTextSelected
            ]}>Yes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.telp_choice === 'no' && styles.optionButtonSelected
            ]}
            onPress={() => togglePhone('no')}
          >
            <Text style={[
              styles.optionButtonText,
              formData.telp_choice === 'no' && styles.optionButtonTextSelected
            ]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {formData.telp_choice === 'yes' && (
        <>
          {/* Phone Number */}
          <TextInput
            label="Phone Number"
            value={formData.no_tlp}
            onChangeText={(value) => onChange('no_tlp', value)}
            placeholder="Enter phone number"
            leftIcon={<Ionicons name="call-outline" size={20} color="#777" />}
            inputProps={{ keyboardType: 'phone-pad' }}
          />
          
          {/* Phone Owner */}
          <TextInput
            label="Phone Owner Name"
            value={formData.an_tlp}
            onChangeText={(value) => onChange('an_tlp', value)}
            placeholder="Enter phone owner name"
            leftIcon={<Ionicons name="person-outline" size={20} color="#777" />}
          />
        </>
      )}
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
});

export default KeluargaFormStepFamily;