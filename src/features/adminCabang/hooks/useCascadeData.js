import { useState, useEffect, useCallback } from 'react';
import { jenjangApi } from '../api/masterData/jenjangApi';
import { mataPelajaranApi } from '../api/masterData/mataPelajaranApi';

export const useCascadeData = () => {
  const [jenjangList, setJenjangList] = useState([]);
  const [mataPelajaranList, setMataPelajaranList] = useState([]);
  const [selectedJenjang, setSelectedJenjang] = useState(null);
  const [loading, setLoading] = useState({
    jenjang: false,
    mataPelajaran: false
  });
  const [error, setError] = useState(null);

  // Fetch jenjang dropdown data
  const fetchJenjangList = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, jenjang: true }));
      setError(null);
      
      const response = await jenjangApi.getDropdown({ with_counts: true });
      
      if (response.success) {
        const jenjangData = response.data || [];
        // Add "Semua Jenjang" option for optional filter
        const jenjangWithAll = [
          { id_jenjang: null, nama_jenjang: 'Semua Jenjang', kode_jenjang: 'ALL' },
          ...jenjangData
        ];
        setJenjangList(jenjangWithAll);
      } else {
        throw new Error(response.message || 'Gagal mengambil data jenjang');
      }
    } catch (err) {
      console.error('Error fetching jenjang list:', err);
      setError(err.message || 'Gagal mengambil data jenjang');
      setJenjangList([]);
    } finally {
      setLoading(prev => ({ ...prev, jenjang: false }));
    }
  }, []);

  // Fetch mata pelajaran by jenjang
  const fetchMataPelajaranByJenjang = useCallback(async (jenjangId) => {
    if (!jenjangId) {
      setMataPelajaranList([]);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, mataPelajaran: true }));
      setError(null);
      
      const response = await mataPelajaranApi.getByJenjang(jenjangId);
      
      if (response.success) {
        setMataPelajaranList(response.data || []);
      } else {
        throw new Error(response.message || 'Gagal mengambil mata pelajaran');
      }
    } catch (err) {
      console.error('Error fetching mata pelajaran by jenjang:', err);
      setError(err.message || 'Gagal mengambil mata pelajaran');
      setMataPelajaranList([]);
    } finally {
      setLoading(prev => ({ ...prev, mataPelajaran: false }));
    }
  }, []);

  // Handle jenjang selection change
  const handleJenjangChange = useCallback((jenjangId) => {
    setSelectedJenjang(jenjangId);
    fetchMataPelajaranByJenjang(jenjangId);
  }, [fetchMataPelajaranByJenjang]);

  // Get jenjang options for dropdown
  const getJenjangOptions = useCallback(() => {
    return jenjangList.map(jenjang => ({
      label: jenjang.nama_jenjang,
      value: jenjang.id_jenjang,
      subtitle: jenjang.kode_jenjang !== 'ALL' ? jenjang.kode_jenjang : null
    }));
  }, [jenjangList]);

  // Get mata pelajaran options for dropdown
  const getMataPelajaranOptions = useCallback(() => {
    return mataPelajaranList.map(mapel => ({
      label: mapel.nama_mata_pelajaran,
      value: mapel.id_mata_pelajaran,
      subtitle: mapel.kode_mata_pelajaran,
      kategori: mapel.kategori
    }));
  }, [mataPelajaranList]);

  // Get filtered mata pelajaran by kategori
  const getMataPelajaranByKategori = useCallback((kategori) => {
    if (!kategori) return mataPelajaranList;
    return mataPelajaranList.filter(mapel => mapel.kategori === kategori);
  }, [mataPelajaranList]);

  // Get kategori options from current mata pelajaran
  const getKategoriOptions = useCallback(() => {
    const kategoris = [...new Set(mataPelajaranList.map(mapel => mapel.kategori))];
    return kategoris.map(kategori => ({
      label: formatKategoriLabel(kategori),
      value: kategori
    }));
  }, [mataPelajaranList]);

  // Format kategori label for display
  const formatKategoriLabel = (kategori) => {
    const labels = {
      'wajib': 'Mata Pelajaran Wajib',
      'muatan_lokal': 'Muatan Lokal',
      'pengembangan_diri': 'Pengembangan Diri',
      'pilihan': 'Mata Pelajaran Pilihan',
      'ekstrakurikuler': 'Ekstrakurikuler'
    };
    return labels[kategori] || kategori;
  };

  // Reset selections
  const resetSelections = useCallback(() => {
    setSelectedJenjang(null);
    setMataPelajaranList([]);
    setError(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    fetchJenjangList();
  }, []);

  // Helper function to find jenjang by ID
  const findJenjangById = useCallback((id) => {
    return jenjangList.find(jenjang => jenjang.id_jenjang === id);
  }, [jenjangList]);

  // Helper function to find mata pelajaran by ID
  const findMataPelajaranById = useCallback((id) => {
    return mataPelajaranList.find(mapel => mapel.id_mata_pelajaran === id);
  }, [mataPelajaranList]);

  return {
    // Data
    jenjangList,
    mataPelajaranList,
    selectedJenjang,
    
    // States
    loading,
    error,
    
    // Actions
    fetchJenjangList,
    fetchMataPelajaranByJenjang,
    handleJenjangChange,
    resetSelections,
    clearError,
    
    // Helpers
    getJenjangOptions,
    getMataPelajaranOptions,
    getMataPelajaranByKategori,
    getKategoriOptions,
    findJenjangById,
    findMataPelajaranById,
    formatKategoriLabel
  };
};