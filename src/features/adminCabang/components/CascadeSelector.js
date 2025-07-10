import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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

    if (kelasId) {
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

      <MateriSelector
        selectedValue={cascadeState.materi}
        onValueChange={handleMateriChange}
        kelasId={cascadeState.kelas}
        disabled={disabled || !cascadeState.kelas}
        style={styles.selector}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  selector: {
    marginBottom: 4,
  }
});

export default CascadeSelector;