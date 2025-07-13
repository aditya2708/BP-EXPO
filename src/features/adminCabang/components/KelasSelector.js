import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { selectKelasByJenjang, selectKelasLoading } from '../redux/kelasSlice';

const KelasSelector = ({
  selectedValue,
  onValueChange,
  jenjangId,
  disabled = false,
  placeholder = 'Pilih Kelas',
  style,
  showLabel = true,
  required = false
}) => {
  const kelasByJenjang = useSelector(selectKelasByJenjang);
  const loading = useSelector(selectKelasLoading);
  
  const kelasData = jenjangId ? (kelasByJenjang[jenjangId] || []) : [];

  const getRomanNumeral = (tingkat) => {
    const numerals = {
      1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
      7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
    };
    return numerals[tingkat] || tingkat;
  };

  const getKelasDisplayName = (kelas) => {
    if (kelas.jenis_kelas === 'standard' && kelas.tingkat) {
      return `Kelas ${getRomanNumeral(kelas.tingkat)}`;
    }
    return kelas.nama_kelas;
  };

  const getKelasFullName = (kelas) => {
    const displayName = getKelasDisplayName(kelas);
    const typeIndicator = kelas.jenis_kelas === 'custom' ? ' (Custom)' : '';
    return `${displayName}${typeIndicator}`;
  };

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={styles.label}>
          Kelas {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      
      <View style={[styles.pickerContainer, disabled && styles.disabled]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.loadingText}>Memuat kelas...</Text>
          </View>
        ) : (
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            enabled={!disabled}
            style={styles.picker}
          >
            <Picker.Item label={placeholder} value="" />
            {kelasData.map((kelas) => (
              <Picker.Item
                key={kelas.id_kelas}
                label={getKelasFullName(kelas)}
                value={kelas.id_kelas.toString()}
              />
            ))}
          </Picker>
        )}
      </View>
      
      {!jenjangId && !disabled && (
        <Text style={styles.helpText}>Pilih jenjang dan mata pelajaran terlebih dahulu</Text>
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

export default KelasSelector;