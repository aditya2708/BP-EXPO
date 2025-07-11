import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { selectMateriByKelas, selectMateriLoading } from '../redux/materiSlice';

const MateriSelector = ({
  selectedValue,
  onValueChange,
  kelasId,
  disabled = false,
  placeholder = 'Pilih Materi',
  style,
  showLabel = true,
  required = false
}) => {
  const materiByKelas = useSelector(selectMateriByKelas);
  const loading = useSelector(selectMateriLoading);
  
  const materiData = kelasId ? (materiByKelas[kelasId] || []) : [];

  // Group materi by mata_pelajaran for better organization
  const groupedMateri = materiData.reduce((acc, materi) => {
    const mataPelajaran = materi.mata_pelajaran || 'Lainnya';
    if (!acc[mataPelajaran]) {
      acc[mataPelajaran] = [];
    }
    acc[mataPelajaran].push(materi);
    return acc;
  }, {});

  const renderGroupedItems = () => {
    const items = [];
    
    Object.keys(groupedMateri).forEach(mataPelajaran => {
      // Add separator for mata pelajaran
      items.push(
        <Picker.Item
          key={`separator-${mataPelajaran}`}
          label={`--- ${mataPelajaran} ---`}
          value=""
          enabled={false}
        />
      );
      
      // Add materi items
      groupedMateri[mataPelajaran].forEach(materi => {
        items.push(
          <Picker.Item
            key={materi.id_materi}
            label={`  ${materi.nama_materi}`}
            value={materi.id_materi.toString()}
          />
        );
      });
    });
    
    return items;
  };

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={styles.label}>
          Materi {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      
      <View style={[styles.pickerContainer, disabled && styles.disabled]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.loadingText}>Memuat materi...</Text>
          </View>
        ) : (
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            enabled={!disabled}
            style={styles.picker}
          >
            <Picker.Item label={placeholder} value="" />
            {Object.keys(groupedMateri).length > 0 ? (
              renderGroupedItems()
            ) : (
              <Picker.Item label="Tidak ada materi tersedia" value="" enabled={false} />
            )}
          </Picker>
        )}
      </View>
      
      {!kelasId && !disabled && (
        <Text style={styles.helpText}>Pilih kelas terlebih dahulu</Text>
      )}
      
      {kelasId && materiData.length === 0 && !loading && (
        <Text style={styles.helpText}>Belum ada materi untuk kelas ini</Text>
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

export default MateriSelector;