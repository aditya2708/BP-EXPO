// file: src/features/adminShelter/components/survey/HealthStep.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const HealthStep = ({ formData, handleChange }) => {
  return (
    <View style={styles.stepContainer}>
      {/* Water Source */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Clean Water Source *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.sumber_air_bersih}
            onValueChange={(value) => handleChange('sumber_air_bersih', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Source --" value="" />
            <Picker.Item label="Sumur" value="Sumur" />
            <Picker.Item label="Sungai" value="Sungai" />
            <Picker.Item label="PDAM" value="PDAM" />
            <Picker.Item label="Lainnya" value="Lainnya" />
          </Picker>
        </View>
      </View>
      
      {/* Toilet/Waste System */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Toilet/Waste System *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.jamban_limbah}
            onValueChange={(value) => handleChange('jamban_limbah', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select System --" value="" />
            <Picker.Item label="Sungai" value="Sungai" />
            <Picker.Item label="Sepitank" value="Sepitank" />
            <Picker.Item label="Lainnya" value="Lainnya" />
          </Picker>
        </View>
      </View>
      
      {/* Garbage Disposal */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Garbage Disposal *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.tempat_sampah}
            onValueChange={(value) => handleChange('tempat_sampah', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Method --" value="" />
            <Picker.Item label="TPS" value="TPS" />
            <Picker.Item label="Sungai" value="Sungai" />
            <Picker.Item label="Pekarangan" value="Pekarangan" />
          </Picker>
        </View>
      </View>
      
      {/* Smoker */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Is anyone in the family a smoker? *</Text>
        <View style={styles.radioButtonGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.perokok === 'Ya' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('perokok', 'Ya')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.perokok === 'Ya' && styles.radioButtonTextActive
            ]}>Yes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.perokok === 'Tidak' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('perokok', 'Tidak')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.perokok === 'Tidak' && styles.radioButtonTextActive
            ]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Alcohol Consumer */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Is anyone in the family an alcohol consumer? *</Text>
        <View style={styles.radioButtonGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.konsumen_miras === 'Ya' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('konsumen_miras', 'Ya')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.konsumen_miras === 'Ya' && styles.radioButtonTextActive
            ]}>Yes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.konsumen_miras === 'Tidak' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('konsumen_miras', 'Tidak')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.konsumen_miras === 'Tidak' && styles.radioButtonTextActive
            ]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* First Aid Kit */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Does the family have a first aid kit? *</Text>
        <View style={styles.radioButtonGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.persediaan_p3k === 'Ya' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('persediaan_p3k', 'Ya')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.persediaan_p3k === 'Ya' && styles.radioButtonTextActive
            ]}>Yes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.persediaan_p3k === 'Tidak' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('persediaan_p3k', 'Tidak')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.persediaan_p3k === 'Tidak' && styles.radioButtonTextActive
            ]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Fruits & Vegetables */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Does the family regularly eat fruits and vegetables? *</Text>
        <View style={styles.radioButtonGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.makan_buah_sayur === 'Ya' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('makan_buah_sayur', 'Ya')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.makan_buah_sayur === 'Ya' && styles.radioButtonTextActive
            ]}>Yes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.makan_buah_sayur === 'Tidak' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('makan_buah_sayur', 'Tidak')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.makan_buah_sayur === 'Tidak' && styles.radioButtonTextActive
            ]}>No</Text>
          </TouchableOpacity>
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

export default HealthStep;