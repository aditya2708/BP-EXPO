import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import Button from '../../../common/components/Button';
import TextInput from '../../../common/components/TextInput';
import PickerInput from '../../../common/components/PickerInput';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';
import { adminShelterKeuanganApi } from '../api/adminShelterKeuanganApi';
import { adminShelterApi } from '../api/adminShelterApi';

const KeuanganFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { keuangan, isEdit } = route.params || {};

  const [formData, setFormData] = useState({
    id_anak: '',
    tingkat_sekolah: '',
    semester: '',
    bimbel: '',
    eskul_dan_keagamaan: '',
    laporan: '',
    uang_tunai: '',
    donasi: '',
    subsidi_infak: '',
  });

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Options for dropdowns
  const tingkatSekolahOptions = [
    { label: 'SD', value: 'SD' },
    { label: 'SMP', value: 'SMP' },
    { label: 'SMA', value: 'SMA' },
    { label: 'SMK', value: 'SMK' },
  ];

  const semesterOptions = [
    { label: 'Semester 1', value: 'Semester 1' },
    { label: 'Semester 2', value: 'Semester 2' },
    { label: 'Semester Genap', value: 'Semester Genap' },
    { label: 'Semester Ganjil', value: 'Semester Ganjil' },
  ];

  useEffect(() => {
    fetchChildren();
    if (isEdit && keuangan) {
      setFormData({
        id_anak: keuangan.id_anak?.toString() || '',
        tingkat_sekolah: keuangan.tingkat_sekolah || '',
        semester: keuangan.semester || '',
        bimbel: keuangan.bimbel?.toString() || '',
        eskul_dan_keagamaan: keuangan.eskul_dan_keagamaan?.toString() || '',
        laporan: keuangan.laporan?.toString() || '',
        uang_tunai: keuangan.uang_tunai?.toString() || '',
        donasi: keuangan.donasi?.toString() || '',
        subsidi_infak: keuangan.subsidi_infak?.toString() || '',
      });
    }
  }, [isEdit, keuangan]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await adminShelterApi.getChildren();
      const childrenData = response.data.data.data || [];
      
      const childrenOptions = childrenData.map(child => ({
        label: `${child.full_name} (${child.nick_name || 'No nickname'})`,
        value: child.id_anak.toString(),
      }));
      
      setChildren(childrenOptions);
    } catch (err) {
      console.error('Error fetching children:', err);
      setError('Gagal memuat data anak');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.id_anak) errors.push('Pilih anak');
    if (!formData.tingkat_sekolah) errors.push('Pilih tingkat sekolah');
    if (!formData.semester) errors.push('Pilih semester');

    // Validate numeric fields
    const numericFields = ['bimbel', 'eskul_dan_keagamaan', 'laporan', 'uang_tunai', 'donasi', 'subsidi_infak'];
    numericFields.forEach(field => {
      if (formData[field] && isNaN(Number(formData[field]))) {
        errors.push(`${field.replace('_', ' ')} harus berupa angka`);
      }
    });

    if (errors.length > 0) {
      Alert.alert('Validasi Error', errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);

      // Convert numeric fields
      const submitData = {
        ...formData,
        id_anak: parseInt(formData.id_anak),
        bimbel: formData.bimbel ? parseFloat(formData.bimbel) : 0,
        eskul_dan_keagamaan: formData.eskul_dan_keagamaan ? parseFloat(formData.eskul_dan_keagamaan) : 0,
        laporan: formData.laporan ? parseFloat(formData.laporan) : 0,
        uang_tunai: formData.uang_tunai ? parseFloat(formData.uang_tunai) : 0,
        donasi: formData.donasi ? parseFloat(formData.donasi) : 0,
        subsidi_infak: formData.subsidi_infak ? parseFloat(formData.subsidi_infak) : 0,
      };

      if (isEdit) {
        await adminShelterKeuanganApi.updateKeuangan(keuangan.id_keuangan, submitData);
        Alert.alert('Berhasil', 'Data keuangan berhasil diperbarui');
      } else {
        await adminShelterKeuanganApi.createKeuangan(submitData);
        Alert.alert('Berhasil', 'Data keuangan berhasil ditambahkan');
      }

      navigation.goBack();
    } catch (err) {
      console.error('Error submitting keuangan:', err);
      
      let errorMessage = 'Gagal menyimpan data keuangan';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        errorMessage = errors.join('\n');
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value) => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const renderCurrencyInput = (label, field, placeholder) => (
    <TextInput
      label={label}
      value={formData[field]}
      onChangeText={(value) => handleInputChange(field, value.replace(/\./g, ''))}
      placeholder={placeholder}
      keyboardType="numeric"
      inputProps={{
        value: formatCurrency(formData[field]),
      }}
    />
  );

  if (loading) {
    return <LoadingSpinner fullScreen message="Memuat data..." />;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => setError(null)}
          />
        )}

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Informasi Dasar</Text>
          
          <PickerInput
            label="Anak *"
            value={formData.id_anak}
            onValueChange={(value) => handleInputChange('id_anak', value)}
            items={children}
            placeholder="Pilih Anak"
            disabled={isEdit}
          />

          <PickerInput
            label="Tingkat Sekolah *"
            value={formData.tingkat_sekolah}
            onValueChange={(value) => handleInputChange('tingkat_sekolah', value)}
            items={tingkatSekolahOptions}
            placeholder="Pilih Tingkat Sekolah"
          />

          <PickerInput
            label="Semester *"
            value={formData.semester}
            onValueChange={(value) => handleInputChange('semester', value)}
            items={semesterOptions}
            placeholder="Pilih Semester"
          />

          <Text style={styles.sectionTitle}>Kebutuhan Biaya</Text>
          
          {renderCurrencyInput('Bimbel', 'bimbel', 'Masukkan biaya bimbel')}
          {renderCurrencyInput('Eskul & Keagamaan', 'eskul_dan_keagamaan', 'Masukkan biaya eskul & keagamaan')}
          {renderCurrencyInput('Laporan', 'laporan', 'Masukkan biaya laporan')}
          {renderCurrencyInput('Uang Tunai', 'uang_tunai', 'Masukkan uang tunai')}

          <Text style={styles.sectionTitle}>Bantuan</Text>
          
          {renderCurrencyInput('Donasi', 'donasi', 'Masukkan jumlah donasi')}
          {renderCurrencyInput('Subsidi Infak', 'subsidi_infak', 'Masukkan subsidi infak')}

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Ringkasan</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Kebutuhan:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(
                  (parseFloat(formData.bimbel) || 0) +
                  (parseFloat(formData.eskul_dan_keagamaan) || 0) +
                  (parseFloat(formData.laporan) || 0) +
                  (parseFloat(formData.uang_tunai) || 0)
                )}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Bantuan:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(
                  (parseFloat(formData.donasi) || 0) +
                  (parseFloat(formData.subsidi_infak) || 0)
                )}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sisa Tagihan:</Text>
              <Text style={[styles.summaryValue, { color: '#e74c3c' }]}>
                {formatCurrency(
                  Math.max(0, 
                    ((parseFloat(formData.bimbel) || 0) +
                    (parseFloat(formData.eskul_dan_keagamaan) || 0) +
                    (parseFloat(formData.laporan) || 0) +
                    (parseFloat(formData.uang_tunai) || 0)) -
                    ((parseFloat(formData.donasi) || 0) +
                    (parseFloat(formData.subsidi_infak) || 0))
                  )
                )}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Batal"
              onPress={() => navigation.goBack()}
              type="outline"
              style={styles.cancelButton}
            />
            <Button
              title={isEdit ? 'Perbarui' : 'Simpan'}
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 20,
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default KeuanganFormScreen;