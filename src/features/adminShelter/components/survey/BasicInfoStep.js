// file: src/features/adminShelter/components/survey/BasicInfoStep.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import TextInput from '../../../../common/components/TextInput';

const BasicInfoStep = ({ formData, handleChange, keluarga }) => {
  return (
    <View style={styles.stepContainer}>
      {/* Family Info Summary */}
      <View style={styles.familyInfoCard}>
        <Text style={styles.familyName}>{keluarga?.kepala_keluarga || 'Family'}</Text>
        <Text style={styles.familyDetail}>KK: {keluarga?.no_kk || '-'}</Text>
        <Text style={styles.familyDetail}>Status: {keluarga?.status_ortu || '-'}</Text>
        <Text style={styles.familyDetail}>ID: {keluarga?.id_keluarga || '-'}</Text>
      </View>
      
      {/* Head's Education */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Head of Family Education Level *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.pendidikan_kepala_keluarga}
            onValueChange={(value) => handleChange('pendidikan_kepala_keluarga', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Education Level --" value="" />
            <Picker.Item label="Tidak Sekolah" value="Tidak Sekolah" />
            <Picker.Item label="Sekolah Dasar" value="Sekolah Dasar" />
            <Picker.Item label="SMP/MTS/SEDERAJAT" value="SMP/MTS/SEDERAJAT" />
            <Picker.Item label="SMK/SMA/MA/SEDERAJAT" value="SMK/SMA/MA/SEDERAJAT" />
            <Picker.Item label="DIPLOMA I" value="DIPLOMA I" />
            <Picker.Item label="DIPLOMA II" value="DIPLOMA II" />
            <Picker.Item label="DIPLOMA III" value="DIPLOMA III" />
            <Picker.Item label="STRATA-1" value="STRATA-1" />
            <Picker.Item label="STRATA-2" value="STRATA-2" />
            <Picker.Item label="STRATA-3" value="STRATA-3" />
            <Picker.Item label="LAINNYA" value="LAINNYA" />
          </Picker>
        </View>
      </View>
      
      {/* Number of Dependents */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Number of Dependents *</Text>
        <TextInput
          value={formData.jumlah_tanggungan?.toString()}
          onChangeText={(value) => handleChange('jumlah_tanggungan', value)}
          placeholder="Number of dependents"
          keyboardType="numeric"
        />
      </View>
      
      {/* Occupation */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Head of Family Occupation *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.pekerjaan_kepala_keluarga}
            onValueChange={(value) => handleChange('pekerjaan_kepala_keluarga', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Occupation --" value="" />
            <Picker.Item label="Petani" value="Petani" />
            <Picker.Item label="Nelayan" value="Nelayan" />
            <Picker.Item label="Peternak" value="Peternak" />
            <Picker.Item label="PNS NON Dosen/Guru" value="PNS NON Dosen/Guru" />
            <Picker.Item label="Guru PNS" value="Guru PNS" />
            <Picker.Item label="Guru Non PNS" value="Guru Non PNS" />
            <Picker.Item label="Karyawan Swasta" value="Karyawan Swasta" />
            <Picker.Item label="Buruh" value="Buruh" />
            <Picker.Item label="Wiraswasta" value="Wiraswasta" />
            <Picker.Item label="Wirausaha" value="Wirausaha" />
            <Picker.Item label="Pedagang Kecil" value="Pedagang Kecil" />
            <Picker.Item label="Pedagang Besar" value="Pedagang Besar" />
            <Picker.Item label="Pensiunan" value="Pensiunan" />
            <Picker.Item label="Tidak Bekerja" value="Tidak Bekerja" />
            <Picker.Item label="Sudah Meninggal" value="Sudah Meninggal" />
            <Picker.Item label="Lainnya" value="Lainnya" />
          </Picker>
        </View>
      </View>
      
      {/* Income */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Monthly Income *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.penghasilan}
            onValueChange={(value) => handleChange('penghasilan', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Income Range --" value="" />
            <Picker.Item label="Below Rp 500,000" value="dibawah_500k" />
            <Picker.Item label="Rp 500,000 - Rp 1,500,000" value="500k_1500k" />
            <Picker.Item label="Rp 1,500,000 - Rp 2,500,000" value="1500k_2500k" />
            <Picker.Item label="Rp 2,500,000 - Rp 3,500,000" value="2500k_3500k" />
            <Picker.Item label="Rp 3,500,000 - Rp 5,000,000" value="3500k_5000k" />
            <Picker.Item label="Rp 5,000,000 - Rp 7,000,000" value="5000k_7000k" />
            <Picker.Item label="Rp 7,000,000 - Rp 10,000,000" value="7000k_10000k" />
            <Picker.Item label="Above Rp 10,000,000" value="diatas_10000k" />
          </Picker>
        </View>
      </View>
      
      {/* Child Status */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Child Status *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.status_anak}
            onValueChange={(value) => handleChange('status_anak', value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Status --" value="" />
            <Picker.Item label="Yatim" value="Yatim" />
            <Picker.Item label="Dhuafa" value="Dhuafa" />
            <Picker.Item label="Non Dhuafa" value="Non Dhuafa" />
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
  familyInfoCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  familyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  familyDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
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
});

export default BasicInfoStep;