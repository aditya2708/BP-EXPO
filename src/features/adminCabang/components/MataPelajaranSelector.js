import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { selectMataPelajaranByJenjang, selectMataPelajaranLoading } from '../redux/mataPelajaranSlice';

const MataPelajaranSelector = ({
  selectedValue,
  onValueChange,
  jenjangId,
  disabled = false,
  placeholder = 'Pilih Mata Pelajaran',
  style,
  showLabel = true,
  required = false
}) => {
  const mataPelajaranByJenjang = useSelector(selectMataPelajaranByJenjang);
  const loading = useSelector(selectMataPelajaranLoading);
  
  const mataPelajaranData = jenjangId ? (mataPelajaranByJenjang[jenjangId] || []) : [];

  const getKategoriColor = (kategori) => {
    switch (kategori) {
      case 'wajib': return '#e74c3c';
      case 'pilihan': return '#3498db';
      case 'muatan_lokal': return '#f39c12';
      case 'ekstrakurikuler': return '#9b59b6';
      default: return '#666';
    }
  };

  const getKategoriText = (kategori) => {
    switch (kategori) {
      case 'wajib': return 'Wajib';
      case 'pilihan': return 'Pilihan';
      case 'muatan_lokal': return 'Muatan Lokal';
      case 'ekstrakurikuler': return 'Ekstrakurikuler';
      default: return kategori;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={styles.label}>
          Mata Pelajaran {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      
      <View style={[styles.pickerContainer, disabled && styles.disabled]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.loadingText}>Memuat mata pelajaran...</Text>
          </View>
        ) : (
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            enabled={!disabled}
            style={styles.picker}
          >
            <Picker.Item label={placeholder} value="" />
            {mataPelajaranData.map((mp) => (
              <Picker.Item
                key={mp.id_mata_pelajaran}
                label={`${mp.nama_mata_pelajaran} (${getKategoriText(mp.kategori)})`}
                value={mp.id_mata_pelajaran.toString()}
              />
            ))}
          </Picker>
        )}
      </View>
      
      {!jenjangId && !disabled && (
        <Text style={styles.helpText}>Pilih jenjang terlebih dahulu</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#e74c3c',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  disabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  picker: {
    height: 50,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  }
});

export default MataPelajaranSelector;