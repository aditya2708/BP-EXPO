import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

// Import components
import Button from '../../../common/components/Button';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../common/components/ErrorMessage';

// Import API
import { penilaianApi } from '../api/penilaianApi';
import { aktivitasApi } from '../api/aktivitasApi';
import { materiApi } from '../api/materiApi';

const PenilaianFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { anakId, anakData, penilaian, semesterId } = route.params || {};
  
  const isEdit = !!penilaian;

  const [formData, setFormData] = useState({
    id_anak: anakId,
    id_aktivitas: penilaian?.id_aktivitas || '',
    id_materi: penilaian?.id_materi || '',
    id_jenis_penilaian: penilaian?.id_jenis_penilaian || '',
    id_semester: semesterId || penilaian?.id_semester || '',
    nilai: penilaian?.nilai?.toString() || '',
    deskripsi_tugas: penilaian?.deskripsi_tugas || '',
    tanggal_penilaian: penilaian ? new Date(penilaian.tanggal_penilaian) : new Date(),
    catatan: penilaian?.catatan || ''
  });

  const [aktivitasList, setAktivitasList] = useState([]);
  const [materiList, setMateriList] = useState([]);
  const [jenisPenilaianList, setJenisPenilaianList] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: isEdit ? 'Edit Penilaian' : 'Tambah Penilaian'
    });
    fetchInitialData();
  }, []);

  // Auto-populate materi when aktivitas is selected
  useEffect(() => {
    if (formData.id_aktivitas && aktivitasList.length > 0) {
      const selectedAktivitas = aktivitasList.find(
        aktivitas => aktivitas.id_aktivitas.toString() === formData.id_aktivitas.toString()
      );
      
      if (selectedAktivitas && selectedAktivitas.id_materi) {
        updateFormData('id_materi', selectedAktivitas.id_materi);
      } else {
        // Clear materi if aktivitas doesn't have associated materi
        updateFormData('id_materi', '');
      }
    }
  }, [formData.id_aktivitas, aktivitasList]);

  const fetchInitialData = async () => {
  try {
    setLoadingData(true);
    setError(null);

    // Fetch aktivitas with kelompok filter
    const aktivitasParams = { 
      jenis_kegiatan: 'Bimbel',
      limit: 100 
    };
    
    // Add nama_kelompok filter if anak has kelompok
    if (anakData?.kelompok?.nama_kelompok) {
      aktivitasParams.nama_kelompok = anakData.kelompok.nama_kelompok;
    }
    
    const aktivitasResponse = await aktivitasApi.getAllAktivitas(aktivitasParams);
    
    if (aktivitasResponse.data.success) {
      setAktivitasList(aktivitasResponse.data.data || []);
    }

    // Fetch jenis penilaian
    const jenisPenilaianResponse = await penilaianApi.getJenisPenilaian();
    if (jenisPenilaianResponse.data.success) {
      setJenisPenilaianList(jenisPenilaianResponse.data.data || []);
    }

    // If anak has level, fetch materi
    if (anakData?.id_level_anak_binaan) {
      const materiResponse = await materiApi.getMateriByLevel(anakData.id_level_anak_binaan);
      if (materiResponse.data.success) {
        setMateriList(materiResponse.data.data || []);
      }
    }

  } catch (err) {
    console.error('Error fetching initial data:', err);
    setError('Gagal memuat data. Silakan coba lagi.');
  } finally {
    setLoadingData(false);
  }
};

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        nilai: parseFloat(formData.nilai),
        tanggal_penilaian: formData.tanggal_penilaian.toISOString().split('T')[0]
      };

      let response;
      if (isEdit) {
        response = await penilaianApi.updatePenilaian(penilaian.id_penilaian, submitData);
      } else {
        response = await penilaianApi.createPenilaian(submitData);
      }

      if (response.data.success) {
        Alert.alert(
          'Sukses',
          isEdit ? 'Penilaian berhasil diperbarui' : 'Penilaian berhasil ditambahkan',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        setError(response.data.message || 'Gagal menyimpan penilaian');
      }
    } catch (err) {
      console.error('Error submitting penilaian:', err);
      setError('Gagal menyimpan penilaian. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.id_aktivitas) {
      Alert.alert('Error', 'Silakan pilih aktivitas');
      return false;
    }
    if (!formData.id_jenis_penilaian) {
      Alert.alert('Error', 'Silakan pilih jenis penilaian');
      return false;
    }
    if (!formData.nilai || isNaN(formData.nilai)) {
      Alert.alert('Error', 'Silakan masukkan nilai yang valid');
      return false;
    }
    const nilai = parseFloat(formData.nilai);
    if (nilai < 0 || nilai > 100) {
      Alert.alert('Error', 'Nilai harus antara 0-100');
      return false;
    }
    return true;
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      updateFormData('tanggal_penilaian', selectedDate);
    }
  };

  if (loadingData) {
    return <LoadingSpinner fullScreen message="Memuat data..." />;
  }

  return (
    <ScrollView style={styles.container}>
      {error && <ErrorMessage message={error} />}

      <View style={styles.formContainer}>
        {/* Anak Info */}
        <View style={styles.infoCard}>
          <Text style={styles.label}>Nama Anak</Text>
          <Text style={styles.infoText}>{anakData?.full_name || 'Unknown'}</Text>
        </View>

        {/* Aktivitas Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Aktivitas *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.id_aktivitas}
              onValueChange={(value) => updateFormData('id_aktivitas', value)}
              style={styles.picker}
            >
              <Picker.Item label="Pilih Aktivitas" value="" />
              {aktivitasList.map(aktivitas => (
                <Picker.Item
                  key={aktivitas.id_aktivitas}
                  label={`${aktivitas.nama_kelompok} - ${aktivitas.materi} (${new Date(aktivitas.tanggal).toLocaleDateString('id-ID')})`}
                  value={aktivitas.id_aktivitas}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Materi Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Materi</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.id_materi}
              onValueChange={(value) => updateFormData('id_materi', value)}
              style={styles.picker}
            >
              <Picker.Item label="Pilih Materi (Opsional)" value="" />
              {materiList.map(materi => (
                <Picker.Item
                  key={materi.id_materi}
                  label={`${materi.mata_pelajaran} - ${materi.nama_materi}`}
                  value={materi.id_materi}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Jenis Penilaian Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Jenis Penilaian *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.id_jenis_penilaian}
              onValueChange={(value) => updateFormData('id_jenis_penilaian', value)}
              style={styles.picker}
            >
              <Picker.Item label="Pilih Jenis Penilaian" value="" />
              {jenisPenilaianList.map(jenis => (
                <Picker.Item
                  key={jenis.id_jenis_penilaian}
                  label={`${jenis.nama_jenis} (${jenis.bobot_persen}%)`}
                  value={jenis.id_jenis_penilaian}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Nilai Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nilai *</Text>
          <TextInput
            style={styles.input}
            value={formData.nilai}
            onChangeText={(value) => updateFormData('nilai', value)}
            keyboardType="numeric"
            placeholder="0-100"
            maxLength={5}
          />
        </View>

        {/* Tanggal Penilaian */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tanggal Penilaian *</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#7f8c8d" />
            <Text style={styles.dateText}>
              {formData.tanggal_penilaian.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={formData.tanggal_penilaian}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Deskripsi Tugas */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deskripsi Tugas</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.deskripsi_tugas}
            onChangeText={(value) => updateFormData('deskripsi_tugas', value)}
            placeholder="Deskripsi tugas (opsional)"
            multiline
            numberOfLines={3}
            maxLength={500}
          />
        </View>

        {/* Catatan */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Catatan</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.catatan}
            onChangeText={(value) => updateFormData('catatan', value)}
            placeholder="Catatan tambahan (opsional)"
            multiline
            numberOfLines={3}
            maxLength={1000}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={isEdit ? 'Perbarui' : 'Simpan'}
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
          />
          
          <Button
            title="Batal"
            onPress={() => navigation.goBack()}
            type="outline"
            style={styles.cancelButton}
            disabled={loading}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  dateInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  cancelButton: {
    marginTop: 12,
  },
});

export default PenilaianFormScreen;