import { useState, useEffect, useCallback } from 'react';
import { jenjangApi } from '../api/masterData/jenjangApi';
import { mataPelajaranApi } from '../api/masterData/mataPelajaranApi';
import { kelasApi } from '../api/masterData/kelasApi';
import { materiApi } from '../api/masterData/materiApi';

export const useMasterData = () => {
  const [data, setData] = useState({
    jenjang: [],
    mataPelajaran: [],
    kelas: [],
    materi: []
  });
  
  const [loading, setLoading] = useState({
    jenjang: false,
    mataPelajaran: false,
    kelas: false,
    materi: false
  });
  
  const [error, setError] = useState(null);

  // Load all dropdown data
  const loadAllData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, jenjang: true, mataPelajaran: true, kelas: true, materi: true }));
      
      const [jenjangRes, mataPelajaranRes, kelasRes, materiRes] = await Promise.allSettled([
        jenjangApi.getDropdown(),
        mataPelajaranApi.getDropdown(),
        kelasApi.getDropdown(),
        materiApi.getDropdown()
      ]);

      setData({
        jenjang: jenjangRes.status === 'fulfilled' ? jenjangRes.value.data || [] : [],
        mataPelajaran: mataPelajaranRes.status === 'fulfilled' ? mataPelajaranRes.value.data || [] : [],
        kelas: kelasRes.status === 'fulfilled' ? kelasRes.value.data || [] : [],
        materi: materiRes.status === 'fulfilled' ? materiRes.value.data || [] : []
      });

    } catch (err) {
      setError('Gagal memuat data master');
    } finally {
      setLoading({ jenjang: false, mataPelajaran: false, kelas: false, materi: false });
    }
  }, []);

  // Load specific data type
  const loadData = useCallback(async (type, params = {}) => {
    const apiMap = {
      jenjang: jenjangApi,
      mataPelajaran: mataPelajaranApi,
      kelas: kelasApi,
      materi: materiApi
    };

    const api = apiMap[type];
    if (!api) return;

    try {
      setLoading(prev => ({ ...prev, [type]: true }));
      setError(null);
      
      const response = await api.getDropdown(params);
      
      if (response.success) {
        setData(prev => ({ ...prev, [type]: response.data || [] }));
      }
    } catch (err) {
      setError(`Gagal memuat data ${type}`);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  }, []);

  // Get filtered data by relationships
  const getMataPelajaranByJenjang = useCallback((jenjangId) => {
    return data.mataPelajaran.filter(mp => 
      !jenjangId || !mp.id_jenjang || mp.id_jenjang == jenjangId
    );
  }, [data.mataPelajaran]);

  const getKelasByJenjang = useCallback((jenjangId) => {
    return data.kelas.filter(k => 
      !jenjangId || k.id_jenjang == jenjangId
    );
  }, [data.kelas]);

  const getMateriByFilters = useCallback((filters = {}) => {
    return data.materi.filter(m => {
      if (filters.id_mata_pelajaran && m.id_mata_pelajaran != filters.id_mata_pelajaran) return false;
      if (filters.id_kelas && m.id_kelas != filters.id_kelas) return false;
      return true;
    });
  }, [data.materi]);

  // Refresh specific data
  const refreshData = useCallback((type) => {
    loadData(type);
  }, [loadData]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, []);

  return {
    // Data
    data,
    
    // States
    loading,
    error,
    
    // Actions
    loadAllData,
    loadData,
    refreshData,
    clearError,
    
    // Filtered getters
    getMataPelajaranByJenjang,
    getKelasByJenjang,
    getMateriByFilters
  };
};