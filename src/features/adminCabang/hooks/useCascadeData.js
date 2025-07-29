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

  // Validate jenjang consistency between mata pelajaran and kelas
  const validateJenjangConsistency = useCallback((mataPelajaran, kelas) => {
    if (!mataPelajaran || !kelas) return { valid: true };
    
    // If mata pelajaran is for all jenjang (id_jenjang = null), it's valid
    if (!mataPelajaran.id_jenjang) {
      return { valid: true };
    }
    
    // Check if mata pelajaran and kelas belong to same jenjang
    const isValid = mataPelajaran.id_jenjang === kelas.id_jenjang;
    
    return {
      valid: isValid,
      error: isValid ? null : 'Mata pelajaran dan kelas harus dalam jenjang yang sama'
    };
  }, []);

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
    clearCache();
  }, [clearCache]);

  // Auto load on mount
  useEffect(() => {
    if (autoLoad) {
      loadCascadeData();
    }
  }, [autoLoad]);

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
    
    // Actions
    loadJenjang,
    loadMataPelajaran,
    loadKelas,
    loadMateri,
    loadCascadeData,
    resetData,
    clearCache,
    
    // Utilities
    validateJenjangConsistency,
    getFilteredOptions
  };
};