// file: src/features/adminShelter/components/survey/ReligiousStep.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import TextInput from '../../../../common/components/TextInput';

const ReligiousStep = ({ formData, handleChange }) => {
  return (
    <View style={styles.stepContainer}>
      {/* Daily Prayers */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Daily Prayer Consistency *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.solat_lima_waktu}
            onValueChange={(value) => handleChange('solat_lima_waktu', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Option --" value="" />
            <Picker.Item label="Lengkap" value="Lengkap" />
            <Picker.Item label="Kadang-kadang" value="Kadang-kadang" />
            <Picker.Item label="Tidak Pernah" value="Tidak Pernah" />
          </Picker>
        </View>
      </View>
      
      {/* Quran Reading */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Quran Reading Ability *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.membaca_alquran}
            onValueChange={(value) => handleChange('membaca_alquran', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Ability --" value="" />
            <Picker.Item label="Lancar" value="Lancar" />
            <Picker.Item label="Terbata-bata" value="Terbata-bata" />
            <Picker.Item label="Tidak Bisa" value="Tidak Bisa" />
          </Picker>
        </View>
      </View>
      
      {/* Religious Study */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Attendance at Religious Study *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.majelis_taklim}
            onValueChange={(value) => handleChange('majelis_taklim', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Frequency --" value="" />
            <Picker.Item label="Rutin" value="Rutin" />
            <Picker.Item label="Jarang" value="Jarang" />
            <Picker.Item label="Tidak Pernah" value="Tidak Pernah" />
          </Picker>
        </View>
      </View>
      
      {/* News Reading */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Newspaper/News Reading Habit *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.membaca_koran}
            onValueChange={(value) => handleChange('membaca_koran', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Frequency --" value="" />
            <Picker.Item label="Selalu" value="Selalu" />
            <Picker.Item label="Jarang" value="Jarang" />
            <Picker.Item label="Tidak Pernah" value="Tidak Pernah" />
          </Picker>
        </View>
      </View>
      
      {/* Organization Membership */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Is a member of any organization? *</Text>
        <View style={styles.radioButtonGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.pengurus_organisasi === 'Ya' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('pengurus_organisasi', 'Ya')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.pengurus_organisasi === 'Ya' && styles.radioButtonTextActive
            ]}>Yes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.pengurus_organisasi === 'Tidak' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('pengurus_organisasi', 'Tidak')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.pengurus_organisasi === 'Tidak' && styles.radioButtonTextActive
            ]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Organization Position (conditional) */}
      {formData.pengurus_organisasi === 'Ya' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Position in Organization *</Text>
          <TextInput
            value={formData.pengurus_organisasi_sebagai}
            onChangeText={(value) => handleChange('pengurus_organisasi_sebagai', value)}
            placeholder="Enter position"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555555',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  radioButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 4,
  },
  radioButtonActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  radioButtonText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  radioButtonTextActive: {
    color: '#ffffff',
  },
});

export default ReligiousStep;