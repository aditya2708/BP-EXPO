import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import JenjangSelector from './JenjangSelector';
import MataPelajaranSelector from './MataPelajaranSelector';
import KelasSelector from './KelasSelector';
import MateriSelector from './MateriSelector';

import { fetchJenjangForDropdown } from '../redux/jenjangSlice';
import { fetchMataPelajaranByJenjang } from '../redux/mataPelajaranSlice';
import { fetchKelasByJenjang } from '../redux/kelasSlice';
import { fetchMateriByKelas } from '../redux/materiSlice';

const CascadeSelector = ({
  selectedJenjang,
  selectedMataPelajaran,
  selectedKelas,
  selectedMateri,
  onJenjangChange,
  onMataPelajaranChange,
  onKelasChange,
  onMateriChange,
  onNewMateriNameChange,
  createMode = false,
  onCreateModeChange,
  newMateriName = '',
  disabled = false,
  style
}) => {
  const dispatch = useDispatch();
  
  const [cascadeState, setCascadeState] = useState({
    jenjang: selectedJenjang || '',
    mataPelajaran: selectedMataPelajaran || '',
    kelas: selectedKelas || '',
    materi: selectedMateri || ''
  });

  useEffect(() => {
    dispatch(fetchJenjangForDropdown());
  }, []);

  useEffect(() => {
    setCascadeState({
      jenjang: selectedJenjang || '',
      mataPelajaran: selectedMataPelajaran || '',
      kelas: selectedKelas || '',
      materi: selectedMateri || ''
    });
  }, [selectedJenjang, selectedMataPelajaran, selectedKelas, selectedMateri]);

  const handleJenjangChange = (jenjangId) => {
    const newState = {
      jenjang: jenjangId,
      mataPelajaran: '',
      kelas: '',
      materi: ''
    };
    
    setCascadeState(newState);
    onJenjangChange && onJenjangChange(jenjangId);
    onMataPelajaranChange && onMataPelajaranChange('');
    onKelasChange && onKelasChange('');
    onMateriChange && onMateriChange('');

    if (jenjangId) {
      dispatch(fetchMataPelajaranByJenjang(jenjangId));
    }
  };

  const handleMataPelajaranChange = (mataPelajaranId) => {
    const newState = {
      ...cascadeState,
      mataPelajaran: mataPelajaranId,
      kelas: '',
      materi: ''
    };
    
    setCascadeState(newState);
    onMataPelajaranChange && onMataPelajaranChange(mataPelajaranId);
    onKelasChange && onKelasChange('');
    onMateriChange && onMateriChange('');

    if (mataPelajaranId && cascadeState.jenjang) {
      dispatch(fetchKelasByJenjang(cascadeState.jenjang));
    }
  };

  const handleKelasChange = (kelasId) => {
    const newState = {
      ...cascadeState,
      kelas: kelasId,
      materi: ''
    };
    
    setCascadeState(newState);
    onKelasChange && onKelasChange(kelasId);
    onMateriChange && onMateriChange('');

    if (kelasId && !createMode) {
      dispatch(fetchMateriByKelas(kelasId));
    }
  };

  const handleMateriChange = (materiId) => {
    const newState = {
      ...cascadeState,
      materi: materiId
    };
    
    setCascadeState(newState);
    onMateriChange && onMateriChange(materiId);
  };

  const handleCreateModeToggle = (value) => {
    onCreateModeChange && onCreateModeChange(value);
    if (value) {
      // Clear selected materi when switching to create mode
      onMateriChange && onMateriChange('');
    } else {
      // Clear new materi name when switching to select mode
      onNewMateriNameChange && onNewMateriNameChange('');
      // Load materi dropdown if kelas is selected
      if (cascadeState.kelas) {
        dispatch(fetchMateriByKelas(cascadeState.kelas));
      }
    }
  };

  return (
    <View style={[styles.container, style]}>
      <JenjangSelector
        selectedValue={cascadeState.jenjang}
        onValueChange={handleJenjangChange}
        disabled={disabled}
        style={styles.selector}
      />

      <MataPelajaranSelector
        selectedValue={cascadeState.mataPelajaran}
        onValueChange={handleMataPelajaranChange}
        jenjangId={cascadeState.jenjang}
        disabled={disabled || !cascadeState.jenjang}
        style={styles.selector}
      />

      <KelasSelector
        selectedValue={cascadeState.kelas}
        onValueChange={handleKelasChange}
        jenjangId={cascadeState.jenjang}
        disabled={disabled || !cascadeState.mataPelajaran}
        style={styles.selector}
      />

      {/* Materi Section with Create Toggle */}
      {onCreateModeChange && (
        <View style={styles.materiToggleContainer}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Buat materi baru</Text>
            <Switch
              value={createMode}
              onValueChange={handleCreateModeToggle}
              disabled={disabled || !cascadeState.kelas}
              trackColor={{ false: '#e9ecef', true: '#007bff' }}
              thumbColor={createMode ? '#fff' : '#adb5bd'}
            />
          </View>
        </View>
      )}

      {createMode ? (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Materi Baru *</Text>
          <TextInput
            style={[
              styles.input,
              disabled && styles.inputDisabled
            ]}
            value={newMateriName}
            onChangeText={onNewMateriNameChange}
            placeholder="Masukkan nama materi baru"
            placeholderTextColor="#adb5bd"
            editable={!disabled && cascadeState.kelas}
          />
          {!cascadeState.kelas && (
            <Text style={styles.helpText}>Pilih kelas terlebih dahulu</Text>
          )}
        </View>
      ) : (
        <MateriSelector
          selectedValue={cascadeState.materi}
          onValueChange={handleMateriChange}
          kelasId={cascadeState.kelas}
          disabled={disabled || !cascadeState.kelas}
          style={styles.selector}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  selector: {
    marginBottom: 4,
  },
  materiToggleContainer: {
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
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
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#495057',
  },
  inputDisabled: {
    backgroundColor: '#f8f9fa',
    color: '#adb5bd',
  },
  helpText: {
    fontSize: 12,
    color: '#adb5bd',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default CascadeSelector;