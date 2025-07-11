import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { selectJenjangDropdownData, selectJenjangLoading } from '../redux/jenjangSlice';

const JenjangSelector = ({
  selectedValue,
  onValueChange,
  disabled = false,
  placeholder = 'Pilih Jenjang',
  style,
  showLabel = true,
  required = false
}) => {
  const jenjangData = useSelector(selectJenjangDropdownData);
  const loading = useSelector(selectJenjangLoading);

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={styles.label}>
          Jenjang {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      
      <View style={[styles.pickerContainer, disabled && styles.disabled]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.loadingText}>Memuat jenjang...</Text>
          </View>
        ) : (
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            enabled={!disabled}
            style={styles.picker}
          >
            <Picker.Item label={placeholder} value="" />
            {jenjangData.map((jenjang) => (
              <Picker.Item
                key={jenjang.id_jenjang}
                label={`${jenjang.kode_jenjang} - ${jenjang.nama_jenjang}`}
                value={jenjang.id_jenjang.toString()}
              />
            ))}
          </Picker>
        )}
      </View>
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
  }
});

export default JenjangSelector;