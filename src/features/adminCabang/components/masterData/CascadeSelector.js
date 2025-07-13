// src/features/adminCabang/components/masterData/CascadeSelector.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { 
  fetchJenjangForDropdown,
  fetchMataPelajaranByJenjang,
  fetchKelasByJenjang,
  fetchMateriByKelas 
} from '../../redux/masterData/masterDataSlice';

const CascadeSelector = ({
  value = {},
  onChange,
  disabled = false,
  showMateri = true,
  placeholder = {},
  style,
  required = {},
  errors = {}
}) => {
  const dispatch = useDispatch();
  const { dropdownData, loading } = useSelector(state => state.masterData);
  
  const [cascadeState, setCascadeState] = useState({
    jenjang: value.jenjang || '',
    mataPelajaran: value.mataPelajaran || '',
    kelas: value.kelas || '',
    materi: value.materi || ''
  });

  useEffect(() => {
    dispatch(fetchJenjangForDropdown());
  }, [dispatch]);

  useEffect(() => {
    setCascadeState({
      jenjang: value.jenjang || '',
      mataPelajaran: value.mataPelajaran || '',
      kelas: value.kelas || '',
      materi: value.materi || ''
    });
  }, [value]);

  const handleJenjangChange = (jenjangId) => {
    const newState = {
      jenjang: jenjangId,
      mataPelajaran: '',
      kelas: '',
      materi: ''
    };
    setCascadeState(newState);
    onChange && onChange(newState);

    if (jenjangId) {
      dispatch(fetchMataPelajaranByJenjang(jenjangId));
      dispatch(fetchKelasByJenjang(jenjangId));
    }
  };

  const handleMataPelajaranChange = (mataPelajaranId) => {
    const newState = {
      ...cascadeState,
      mataPelajaran: mataPelajaranId,
      materi: ''
    };
    setCascadeState(newState);
    onChange && onChange(newState);
  };

  const handleKelasChange = (kelasId) => {
    const newState = {
      ...cascadeState,
      kelas: kelasId,
      materi: ''
    };
    setCascadeState(newState);
    onChange && onChange(newState);

    if (kelasId && showMateri) {
      dispatch(fetchMateriByKelas(kelasId));
    }
  };

  const handleMateriChange = (materiId) => {
    const newState = {
      ...cascadeState,
      materi: materiId
    };
    setCascadeState(newState);
    onChange && onChange(newState);
  };

  const getPickerStyle = (hasError) => [
    styles.picker,
    hasError && styles.pickerError,
    disabled && styles.pickerDisabled
  ];

  return (
    <View style={[styles.container, style]}>
      {/* Jenjang Selector */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Jenjang {required.jenjang && <Text style={styles.required}>*</Text>}
        </Text>
        <View style={getPickerStyle(errors.jenjang)}>
          <Picker
            selectedValue={cascadeState.jenjang}
            onValueChange={handleJenjangChange}
            enabled={!disabled && !loading.jenjang}
          >
            <Picker.Item 
              label={placeholder.jenjang || "Pilih Jenjang"} 
              value="" 
              color="#adb5bd" 
            />
            {(dropdownData.jenjang || []).map(item => (
              <Picker.Item 
                key={item.id_jenjang} 
                label={item.nama} 
                value={item.id_jenjang} 
              />
            ))}
          </Picker>
        </View>
        {errors.jenjang && <Text style={styles.errorText}>{errors.jenjang}</Text>}
      </View>

      {/* Mata Pelajaran Selector */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Mata Pelajaran {required.mataPelajaran && <Text style={styles.required}>*</Text>}
        </Text>
        <View style={getPickerStyle(errors.mataPelajaran)}>
          <Picker
            selectedValue={cascadeState.mataPelajaran}
            onValueChange={handleMataPelajaranChange}
            enabled={!disabled && !loading.mataPelajaran && cascadeState.jenjang}
          >
            <Picker.Item 
              label={placeholder.mataPelajaran || "Pilih Mata Pelajaran"} 
              value="" 
              color="#adb5bd" 
            />
            {(dropdownData.mataPelajaran || []).map(item => (
              <Picker.Item 
                key={item.id_mata_pelajaran} 
                label={item.nama} 
                value={item.id_mata_pelajaran} 
              />
            ))}
          </Picker>
        </View>
        {errors.mataPelajaran && <Text style={styles.errorText}>{errors.mataPelajaran}</Text>}
        {!cascadeState.jenjang && (
          <Text style={styles.helpText}>Pilih jenjang terlebih dahulu</Text>
        )}
      </View>

      {/* Kelas Selector */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Kelas {required.kelas && <Text style={styles.required}>*</Text>}
        </Text>
        <View style={getPickerStyle(errors.kelas)}>
          <Picker
            selectedValue={cascadeState.kelas}
            onValueChange={handleKelasChange}
            enabled={!disabled && !loading.kelas && cascadeState.jenjang}
          >
            <Picker.Item 
              label={placeholder.kelas || "Pilih Kelas"} 
              value="" 
              color="#adb5bd" 
            />
            {(dropdownData.kelas || []).map(item => (
              <Picker.Item 
                key={item.id_kelas} 
                label={`${item.nama} - ${item.tingkat}`} 
                value={item.id_kelas} 
              />
            ))}
          </Picker>
        </View>
        {errors.kelas && <Text style={styles.errorText}>{errors.kelas}</Text>}
        {!cascadeState.jenjang && (
          <Text style={styles.helpText}>Pilih jenjang terlebih dahulu</Text>
        )}
      </View>

      {/* Materi Selector */}
      {showMateri && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Materi {required.materi && <Text style={styles.required}>*</Text>}
          </Text>
          <View style={getPickerStyle(errors.materi)}>
            <Picker
              selectedValue={cascadeState.materi}
              onValueChange={handleMateriChange}
              enabled={!disabled && !loading.materi && cascadeState.kelas}
            >
              <Picker.Item 
                label={placeholder.materi || "Pilih Materi"} 
                value="" 
                color="#adb5bd" 
              />
              {(dropdownData.materi || []).map(item => (
                <Picker.Item 
                  key={item.id_materi} 
                  label={item.nama} 
                  value={item.id_materi} 
                />
              ))}
            </Picker>
          </View>
          {errors.materi && <Text style={styles.errorText}>{errors.materi}</Text>}
          {!cascadeState.kelas && (
            <Text style={styles.helpText}>Pilih kelas terlebih dahulu</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8,
  },
  required: {
    color: '#dc3545',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: 50,
  },
  pickerError: {
    borderColor: '#dc3545',
  },
  pickerDisabled: {
    backgroundColor: '#f8f9fa',
    opacity: 0.6,
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#adb5bd',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default CascadeSelector;