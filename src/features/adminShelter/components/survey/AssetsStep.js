// file: src/features/adminShelter/components/survey/AssetsStep.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AssetsStep = ({ formData, handleChange }) => {
  return (
    <View style={styles.stepContainer}>
      {/* Land Ownership */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Does the family own land? *</Text>
        <View style={styles.radioButtonGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.kepemilikan_tanah === 'Ya' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('kepemilikan_tanah', 'Ya')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.kepemilikan_tanah === 'Ya' && styles.radioButtonTextActive
            ]}>Yes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.kepemilikan_tanah === 'Tidak' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('kepemilikan_tanah', 'Tidak')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.kepemilikan_tanah === 'Tidak' && styles.radioButtonTextActive
            ]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* House Ownership */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>House Ownership Status *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.kepemilikan_rumah}
            onValueChange={(value) => handleChange('kepemilikan_rumah', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Status --" value="" />
            <Picker.Item label="Hak Milik" value="Hak Milik" />
            <Picker.Item label="Sewa" value="Sewa" />
            <Picker.Item label="Orang Tua" value="Orang Tua" />
            <Picker.Item label="Saudara" value="Saudara" />
            <Picker.Item label="Kerabat" value="Kerabat" />
          </Picker>
        </View>
      </View>
      
      {/* Wall Material */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>House Wall Material *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.kondisi_rumah_dinding}
            onValueChange={(value) => handleChange('kondisi_rumah_dinding', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Material --" value="" />
            <Picker.Item label="Tembok" value="Tembok" />
            <Picker.Item label="Kayu" value="Kayu" />
            <Picker.Item label="Papan" value="Papan" />
            <Picker.Item label="Geribik" value="Geribik" />
            <Picker.Item label="Lainnya" value="Lainnya" />
          </Picker>
        </View>
      </View>
      
      {/* Floor Material */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>House Floor Material *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.kondisi_rumah_lantai}
            onValueChange={(value) => handleChange('kondisi_rumah_lantai', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Material --" value="" />
            <Picker.Item label="Keramik" value="Keramik" />
            <Picker.Item label="Ubin" value="Ubin" />
            <Picker.Item label="Marmer" value="Marmer" />
            <Picker.Item label="Kayu" value="Kayu" />
            <Picker.Item label="Tanah" value="Tanah" />
            <Picker.Item label="Lainnya" value="Lainnya" />
          </Picker>
        </View>
      </View>
      
      {/* Vehicle */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Vehicle Ownership *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.kepemilikan_kendaraan}
            onValueChange={(value) => handleChange('kepemilikan_kendaraan', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Vehicle --" value="" />
            <Picker.Item label="Sepeda" value="Sepeda" />
            <Picker.Item label="Motor" value="Motor" />
            <Picker.Item label="Mobil" value="Mobil" />
          </Picker>
        </View>
      </View>
      
      {/* Electronics */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Electronics Ownership *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.kepemilikan_elektronik}
            onValueChange={(value) => handleChange('kepemilikan_elektronik', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Electronics --" value="" />
            <Picker.Item label="Radio" value="Radio" />
            <Picker.Item label="Televisi" value="Televisi" />
            <Picker.Item label="Handphone" value="Handphone" />
            <Picker.Item label="Kulkas" value="Kulkas" />
          </Picker>
        </View>
      </View>
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

export default AssetsStep;