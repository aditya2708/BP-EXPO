import { useState, useEffect, useCallback, useMemo } from 'react';
import { jenjangApi } from '../api/masterData/jenjangApi';
import { mataPelajaranApi } from '../api/masterData/mataPelajaranApi';
import { kelasApi } from '../api/masterData/kelasApi';
import { materiApi } from '../api/masterData/materiApi';

export const useCascadeData = (options = {}) => {
  const {
    autoLoad = true,
    includeMateri = false,
    cacheTimeout = 5 * 60 * 1000 // 5 minutes
  } = options;

  // State management
  const [data, setData] = useState({
    jenjang: [],
    mata_pelajaran: [],
    kelas: [],
    materi: []
  });

  const [loading, setLoading] = useState({
    jenjang: false,
    mata_pelajaran: false,
    kelas: false,
    materi: false
  });

  const [error, setError] = useState(null);
  const [cache, setCache] = useState(new Map());
  
  // Selected values state
  const [selectedJenjang, setSelectedJenjang] = useState(null);
  const [selectedMataPelajaran, setSelectedMataPelajaran] = useState(null);
  const [selectedKelas, setSelectedKelas] = useState(null);

  // Cache key generator
  const getCacheKey = useCallback((type, params = {}) => {
    return `${type}_${JSON.stringify(params)}`;
  }, []);

  // Check cache validity
  const isCacheValid = useCallback((key) => {
    const cached = cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < cacheTimeout;
  }, [cache, cacheTimeout]);

  // Load jenjang data
  const loadJenjang = useCallback(async (params = {}) => {
    const cacheKey = getCacheKey('jenjang', params);
    
    if (isCacheValid(cacheKey)) {
      setData(prev => ({ ...prev, jenjang: cache.get(cacheKey).data }));
      return cache.get(cacheKey).data;
    }

    setLoading(prev => ({ ...prev, jenjang: true }));
    setError(null);

    try {
      const response = await jenjangApi.getDropdown(params);
      const jenjangData = response.success ? response.data : [];
      
      setData(prev => ({ ...prev, jenjang: jenjangData }));
      setCache(prev => new Map(prev).set(cacheKey, {
        data: jenjangData,
        timestamp: Date.now()
      }));
      
      return jenjangData;
    } catch (err) {
      setError(err.message || 'Gagal memuat data jenjang');
      return [];
    } finally {
      setLoading(prev => ({ ...prev, jenjang: false }));
    }
  }, [getCacheKey, isCacheValid, cache]);

  // Load mata pelajaran by jenjang
  const loadMataPelajaran = useCallback(async (jenjangId = null, params = {}) => {
    const cacheKey = getCacheKey('mata_pelajaran', { jenjangId, ...params });
    
    if (isCacheValid(cacheKey)) {
      setData(prev => ({ ...prev, mata_pelajaran: cache.get(cacheKey).data }));
      return cache.get(cacheKey).data;
    }

    setLoading(prev => ({ ...prev, mata_pelajaran: true }));
    setError(null);

    try {
      let response;
      if (jenjangId) {
        response = await mataPelajaranApi.getByJenjang(jenjangId, params);
      } else {
        response = await mataPelajaranApi.getDropdown(params);
      }
      
      const mataPelajaranData = response.success ? response.data : [];
      
      setData(prev => ({ ...prev, mata_pelajaran: mataPelajaranData }));
      setCache(prev => new Map(prev).set(cacheKey, {
        data: mataPelajaranData,
        timestamp: Date.now()
      }));
      
      return mataPelajaranData;
    } catch (err) {
      setError(err.message || 'Gagal memuat data mata pelajaran');
      return [];
    } finally {
      setLoading(prev => ({ ...prev, mata_pelajaran: false }));
    }
  }, [getCacheKey, isCacheValid, cache]);

  // Load kelas by jenjang
  const loadKelas = useCallback(async (jenjangId = null, params = {}) => {
    const cacheKey = getCacheKey('kelas', { jenjangId, ...params });
    
    if (isCacheValid(cacheKey)) {
      setData(prev => ({ ...prev, kelas: cache.get(cacheKey).data }));
      return cache.get(cacheKey).data;
    }

    setLoading(prev => ({ ...prev, kelas: true }));
    setError(null);

    try {
      let response;
      if (jenjangId) {
        response = await kelasApi.getByJenjang(jenjangId, params);
      } else {
        response = await kelasApi.getDropdown(params);
      }
      
      const kelasData = response.success ? response.data : [];
      
      setData(prev => ({ ...prev, kelas: kelasData }));
      setCache(prev => new Map(prev).set(cacheKey, {
        data: kelasData,
        timestamp: Date.now()
      }));
      
      return kelasData;
    } catch (err) {
      setError(err.message || 'Gagal memuat data kelas');
      return [];
    } finally {
      setLoading(prev => ({ ...prev, kelas: false }));
    }
  }, [getCacheKey, isCacheValid, cache]);

  // Load materi by mata pelajaran and/or kelas
  const loadMateri = useCallback(async (filters = {}, params = {}) => {
    const { id_mata_pelajaran, id_kelas, id_jenjang } = filters;
    const cacheKey = getCacheKey('materi', { ...filters, ...params });
    
    if (isCacheValid(cacheKey)) {
      setData(prev => ({ ...prev, materi: cache.get(cacheKey).data }));
      return cache.get(cacheKey).data;
    }

    setLoading(prev => ({ ...prev, materi: true }));
    setError(null);

    try {
      let response;
      
      if (id_kelas) {
        response = await materiApi.getByKelas(id_kelas, { ...params, id_mata_pelajaran });
      } else if (id_mata_pelajaran) {
        response = await materiApi.getByMataPelajaran({ 
          id_mata_pelajaran, 
          id_kelas,
          ...params 
        });
      } else {
        response = await materiApi.getDropdown({ 
          id_jenjang,
          id_mata_pelajaran,
          id_kelas,
          ...params 
        });
      }
      
      const materiData = response.success ? response.data : [];
      
      setData(prev => ({ ...prev, materi: materiData }));
      setCache(prev => new Map(prev).set(cacheKey, {
        data: materiData,
        timestamp: Date.now()
      }));
      
      return materiData;
    } catch (err) {
      setError(err.message || 'Gagal memuat data materi');
      return [];
    } finally {
      setLoading(prev => ({ ...prev, materi: false }));
    }
  }, [getCacheKey, isCacheValid, cache]);

  // Validation functions
  const validateJenjangConsistency = useCallback((mataPelajaranId, kelasId) => {
    const mataPelajaran = data.mata_pelajaran.find(mp => mp.id_mata_pelajaran === mataPelajaranId);
    const kelas = data.kelas.find(k => k.id_kelas === kelasId);
    
    if (!mataPelajaran || !kelas) return { valid: true };
    
    if (mataPelajaran.id_jenjang && kelas.id_jenjang) {
      return {
        valid: mataPelajaran.id_jenjang === kelas.id_jenjang,
        message: mataPelajaran.id_jenjang === kelas.id_jenjang ? 
          null : 'Mata pelajaran dan kelas harus dalam jenjang yang sama'
      };
    }
    
    return { valid: true };
  }, [data]);

  // Get filtered options based on selections
  const getFilteredOptions = useCallback((type, currentSelections = {}) => {
    const { jenjangId, mataPelajaranId, kelasId } = currentSelections;
    
    switch (type) {
      case 'mata_pelajaran':
        if (!jenjangId) return data.mata_pelajaran;
        return data.mata_pelajaran.filter(item => 
          !item.id_jenjang || item.id_jenjang === jenjangId
        );
        
      case 'kelas':
        if (!jenjangId) return data.kelas;
        return data.kelas.filter(item => item.id_jenjang === jenjangId);
        
      case 'materi':
        return data.materi.filter(item => {
          let matches = true;
          if (mataPelajaranId) matches = matches && item.id_mata_pelajaran === mataPelajaranId;
          if (kelasId) matches = matches && item.id_kelas === kelasId;
          return matches;
        });
        
      default:
        return data[type] || [];
    }
  }, [data]);

  // Options getters
  const getJenjangOptions = useCallback(() => {
    return data.jenjang.map(item => ({
      label: item.nama_jenjang,
      value: item.id_jenjang?.toString() || item.id_jenjang,
      subtitle: item.kode_jenjang,
      description: item.deskripsi
    }));
  }, [data.jenjang]);

  const getMataPelajaranOptions = useCallback((jenjangId = null) => {
    let filteredData = data.mata_pelajaran;
    
    if (jenjangId) {
      filteredData = data.mata_pelajaran.filter(item => 
        !item.id_jenjang || item.id_jenjang === parseInt(jenjangId)
      );
    }
    
    return filteredData.map(item => ({
      label: item.nama_mata_pelajaran,
      value: item.id_mata_pelajaran?.toString() || item.id_mata_pelajaran,
      subtitle: `${item.kode_mata_pelajaran} - ${item.kategori}`,
      badge: item.jenjang ? item.jenjang.kode_jenjang : 'Umum'
    }));
  }, [data.mata_pelajaran]);

  const getKelasOptions = useCallback((jenjangId = null) => {
    let filteredData = data.kelas;
    
    if (jenjangId) {
      filteredData = data.kelas.filter(item => 
        item.id_jenjang === parseInt(jenjangId)
      );
    }
    
    return filteredData.map(item => ({
      label: item.nama_kelas,
      value: item.id_kelas?.toString() || item.id_kelas,
      subtitle: `${item.jenis_kelas} - Urutan ${item.urutan}`,
      badge: item.jenjang?.kode_jenjang
    }));
  }, [data.kelas]);

  const getKategoriOptions = useCallback(() => [
    { label: 'Mata Pelajaran Wajib', value: 'wajib' },
    { label: 'Muatan Lokal', value: 'muatan_lokal' },
    { label: 'Pengembangan Diri', value: 'pengembangan_diri' },
    { label: 'Mata Pelajaran Pilihan', value: 'pilihan' },
    { label: 'Ekstrakurikuler', value: 'ekstrakurikuler' }
  ], []);

  const getMateriOptions = useCallback((filters = {}) => {
    const { id_mata_pelajaran, id_kelas } = filters;
    let filteredData = data.materi;
    
    if (id_mata_pelajaran) {
      filteredData = filteredData.filter(item => 
        item.id_mata_pelajaran === parseInt(id_mata_pelajaran)
      );
    }
    
    if (id_kelas) {
      filteredData = filteredData.filter(item => 
        item.id_kelas === parseInt(id_kelas)
      );
    }
    
    return filteredData.map(item => ({
      label: item.nama_materi,
      value: item.id_materi?.toString() || item.id_materi,
      subtitle: `${item.kode_materi} - ${item.jenis_materi}`,
      badge: item.mata_pelajaran?.kode_mata_pelajaran
    }));
  }, [data.materi]);

  // Handlers
  const handleJenjangChange = useCallback(async (jenjangId) => {
    setSelectedJenjang(jenjangId);
    setSelectedMataPelajaran(null);
    setSelectedKelas(null);
    
    if (jenjangId) {
      await Promise.all([
        loadMataPelajaran(jenjangId),
        loadKelas(jenjangId)
      ]);
    }
  }, [loadMataPelajaran, loadKelas]);

  const handleMataPelajaranChange = useCallback((mataPelajaranId) => {
    setSelectedMataPelajaran(mataPelajaranId);
  }, []);

  const handleKelasChange = useCallback((kelasId) => {
    setSelectedKelas(kelasId);
  }, []);

  // Load full cascade data
  const loadCascadeData = useCallback(async (params = {}) => {
    setError(null);
    
    try {
      // Load in sequence for better UX
      await loadJenjang(params);
      await loadMataPelajaran(null, params);
      await loadKelas(null, params);
      
      if (includeMateri) {
        await loadMateri({}, params);
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat data cascade');
    }
  }, [loadJenjang, loadMataPelajaran, loadKelas, loadMateri, includeMateri]);

  // Legacy getCascadeData for backward compatibility
  const getCascadeData = useCallback(async (type = 'materi') => {
    await loadCascadeData();
    return data;
  }, [loadCascadeData, data]);

  // Clear cache
  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  // Reset data
  const resetData = useCallback(() => {
    setData({
      jenjang: [],
      mata_pelajaran: [],
      kelas: [],
      materi: []
    });
    setSelectedJenjang(null);
    setSelectedMataPelajaran(null);
    setSelectedKelas(null);
    clearCache();
  }, [clearCache]);

  // Auto load on mount
  useEffect(() => {
    if (autoLoad) {
      loadCascadeData();
    }
  }, [autoLoad, loadCascadeData]);

  // Computed values
  const isLoading = useMemo(() => 
    Object.values(loading).some(Boolean), [loading]
  );

  const hasData = useMemo(() => 
    Object.values(data).some(arr => arr.length > 0), [data]
  );

  return {
    // Data
    data,
    loading,
    error,
    isLoading,
    hasData,
    
    // Selected values
    selectedJenjang,
    selectedMataPelajaran,
    selectedKelas,
    
    // Actions
    loadJenjang,
    loadMataPelajaran,
    loadKelas,
    loadMateri,
    loadCascadeData,
    getCascadeData, // Legacy support
    resetData,
    clearCache,
    
    // Handlers
    handleJenjangChange,
    handleMataPelajaranChange,
    handleKelasChange,
    
    // Options getters
    getJenjangOptions,
    getMataPelajaranOptions,
    getKelasOptions,
    getKategoriOptions,
    getMateriOptions,
    
    // Utilities
    validateJenjangConsistency,
    getFilteredOptions
  };
};