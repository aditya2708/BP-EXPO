// file: src/features/adminShelter/components/survey/FinancialStep.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TextInput from '../../../../common/components/TextInput';

const FinancialStep = ({ formData, handleChange }) => {
  return (
    <View style={styles.stepContainer}>
      {/* Savings */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Does the family have savings? *</Text>
        <View style={styles.radioButtonGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.kepemilikan_tabungan === 'Ya' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('kepemilikan_tabungan', 'Ya')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.kepemilikan_tabungan === 'Ya' && styles.radioButtonTextActive
            ]}>Yes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.kepemilikan_tabungan === 'Tidak' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('kepemilikan_tabungan', 'Tidak')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.kepemilikan_tabungan === 'Tidak' && styles.radioButtonTextActive
            ]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Three Meals a Day */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Does the family eat three meals a day? *</Text>
        <View style={styles.radioButtonGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.jumlah_makan === 'Ya' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('jumlah_makan', 'Ya')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.jumlah_makan === 'Ya' && styles.radioButtonTextActive
            ]}>Yes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.jumlah_makan === 'Tidak' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('jumlah_makan', 'Tidak')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.jumlah_makan === 'Tidak' && styles.radioButtonTextActive
            ]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Education Cost */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Monthly Education Cost *</Text>
        <TextInput
          value={formData.biaya_pendidikan_perbulan}
          onChangeText={(value) => handleChange('biaya_pendidikan_perbulan', value)}
          placeholder="Enter monthly education cost"
        />
      </View>
      
      {/* Other Support */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Does the family receive support from other institutions? *</Text>
        <View style={styles.radioButtonGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.bantuan_lembaga_formal_lain === 'Ya' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('bantuan_lembaga_formal_lain', 'Ya')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.bantuan_lembaga_formal_lain === 'Ya' && styles.radioButtonTextActive
            ]}>Yes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.bantuan_lembaga_formal_lain === 'Tidak' && styles.radioButtonActive
            ]}
            onPress={() => handleChange('bantuan_lembaga_formal_lain', 'Tidak')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.bantuan_lembaga_formal_lain === 'Tidak' && styles.radioButtonTextActive
            ]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Support Amount (conditional) */}
      {formData.bantuan_lembaga_formal_lain === 'Ya' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount of Support *</Text>
          <TextInput
            value={formData.bantuan_lembaga_formal_lain_sebesar}
            onChangeText={(value) => handleChange('bantuan_lembaga_formal_lain_sebesar', value)}
            placeholder="Enter amount of support"
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

export default FinancialStep;