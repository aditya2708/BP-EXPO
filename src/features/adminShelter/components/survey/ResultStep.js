// file: src/features/adminShelter/components/survey/ResultStep.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextInput from '../../../../common/components/TextInput';

const ResultStep = ({ formData, handleChange }) => {
  return (
    <View style={styles.stepContainer}>
      {/* Beneficiary Condition */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Beneficiary Condition</Text>
        <TextInput
          value={formData.kondisi_penerima_manfaat}
          onChangeText={(value) => handleChange('kondisi_penerima_manfaat', value)}
          placeholder="Enter additional notes about the beneficiary's condition"
          multiline
          inputProps={{ numberOfLines: 4 }}
          style={styles.textArea}
        />
      </View>
      
      {/* Survey Officer */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Survey Officer</Text>
        <TextInput
          value={formData.petugas_survey}
          onChangeText={(value) => handleChange('petugas_survey', value)}
          placeholder="Enter survey officer's name"
        />
      </View>
      
      {/* Survey Result */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Survey Result</Text>
        <View style={styles.radioButtonGroup}>
          <TouchableOpacity
            style={[
              styles.resultButton,
              formData.hasil_survey === 'Layak' && styles.resultButtonLayak
            ]}
            onPress={() => handleChange('hasil_survey', 'Layak')}
          >
            <Ionicons 
              name={formData.hasil_survey === 'Layak' ? 'checkmark-circle' : 'checkmark-circle-outline'} 
              size={20} 
              color={formData.hasil_survey === 'Layak' ? '#fff' : '#2ecc71'} 
              style={styles.resultIcon}
            />
            <Text style={[
              styles.resultButtonText,
              formData.hasil_survey === 'Layak' && styles.resultButtonTextActive
            ]}>Eligible</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.resultButton,
              formData.hasil_survey === 'Tidak Layak' && styles.resultButtonTidakLayak
            ]}
            onPress={() => handleChange('hasil_survey', 'Tidak Layak')}
          >
            <Ionicons 
              name={formData.hasil_survey === 'Tidak Layak' ? 'close-circle' : 'close-circle-outline'} 
              size={20} 
              color={formData.hasil_survey === 'Tidak Layak' ? '#fff' : '#e74c3c'} 
              style={styles.resultIcon}
            />
            <Text style={[
              styles.resultButtonText,
              formData.hasil_survey === 'Tidak Layak' && styles.resultButtonTextActive
            ]}>Not Eligible</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Result Notes */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Notes on Survey Result</Text>
        <TextInput
          value={formData.keterangan_hasil}
          onChangeText={(value) => handleChange('keterangan_hasil', value)}
          placeholder="Enter notes about the result"
          multiline
          inputProps={{ numberOfLines: 3 }}
          style={styles.textArea}
        />
      </View>
      
      <View style={styles.noteContainer}>
        <Ionicons name="information-circle" size={20} color="#3498db" style={styles.noteIcon} />
        <Text style={styles.noteText}>
          Note: Eligible status will automatically update the child's status to CPB (Calon Penerima Beasiswa).
        </Text>
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
  textArea: {
    minHeight: 100,
  },
  radioButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 4,
    borderColor: '#dddddd',
    backgroundColor: '#ffffff',
  },
  resultButtonLayak: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  resultButtonTidakLayak: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  resultButtonText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  resultButtonTextActive: {
    color: '#ffffff',
  },
  resultIcon: {
    marginRight: 8,
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  noteIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  noteText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    lineHeight: 18,
  },
});

export default ResultStep;