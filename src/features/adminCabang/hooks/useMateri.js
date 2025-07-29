import { useState, useEffect, useCallback } from 'react';
import { materiApi } from '../api/masterData/materiApi';
import { useCascadeData } from './useCascadeData';

export const useMateri = (options = {}) => {
  const { autoLoad = true, includeStatistics = false } = options;
  
  // State management
  const [materiData, setMateriData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [validating, setValidating] = useState(false);

  // Cascade data hook for dependencies
  const cascadeData = useCascadeData({ 
    autoLoad: false, 
    includeMateri: false 
  });

  // Fetch materi list with filters
  const fetchMateri = useCallback(async (params = {}) => {
    try {
      setError(null);
      if (!refreshing) setLoading(true);
      
      const response = await materiApi.getAll(params);
      
      if (response.success) {
        setMateriData(response.data.data || []);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        });
      } else {
        throw new Error(response.message || 'Gagal mengambil data materi');
      }
    } catch (err) {
      console.error('Error fetching materi:', err);
      setError(err.message || 'Gagal mengambil data materi');
      setMateriData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  // Create materi with validation
  const createMateri = useCallback(async (data) => {
    try {
      setSubmitting(true);
      setError(null);

      // Validate jenjang consistency
      const mataPelajaran = cascadeData.data.mata_pelajaran.find(
        mp => mp.id_mata_pelajaran === data.id_mata_pelajaran
      );
      const kelas = cascadeData.data.kelas.find(
        k => k.id_kelas === data.id_kelas
      );

      const consistencyCheck = cascadeData.validateJenjangConsistency(mataPelajaran, kelas);
      if (!consistencyCheck.valid) {
        throw new Error(consistencyCheck.error);
      }

      // Validate unique combination
      const uniqueCheck = await materiApi.validateUnique({
        id_mata_pelajaran: data.id_mata_pelajaran,
        id_kelas: data.id_kelas,
        nama_materi: data.nama_materi
      });

      if (!uniqueCheck.success || !uniqueCheck.data.available) {
        throw new Error('Materi dengan nama tersebut sudah ada untuk kombinasi mata pelajaran dan kelas ini');
      }

      const response = await materiApi.create(data);
      
      if (response.success) {
        await fetchMateri(); // Refresh list
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Gagal menambah materi');
      }
    } catch (err) {
      console.error('Error creating materi:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menambah materi';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [fetchMateri, cascadeData]);

  // Update materi with validation
  const updateMateri = useCallback(async (id, data) => {
    try {
      setSubmitting(true);
      setError(null);

      // Validate jenjang consistency
      const mataPelajaran = cascadeData.data.mata_pelajaran.find(
        mp => mp.id_mata_pelajaran === data.id_mata_pelajaran
      );
      const kelas = cascadeData.data.kelas.find(
        k => k.id_kelas === data.id_kelas
      );

      const consistencyCheck = cascadeData.validateJenjangConsistency(mataPelajaran, kelas);
      if (!consistencyCheck.valid) {
        throw new Error(consistencyCheck.error);
      }

      // Validate unique combination (excluding current item)
      const uniqueCheck = await materiApi.validateUnique({
        id_mata_pelajaran: data.id_mata_pelajaran,
        id_kelas: data.id_kelas,
        nama_materi: data.nama_materi,
        exclude_id: id
      });

      if (!uniqueCheck.success || !uniqueCheck.data.available) {
        throw new Error('Materi dengan nama tersebut sudah ada untuk kombinasi mata pelajaran dan kelas ini');
      }

      const response = await materiApi.update(id, data);
      
      if (response.success) {
        await fetchMateri(); // Refresh list
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Gagal memperbarui materi');
      }
    } catch (err) {
      console.error('Error updating materi:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memperbarui materi';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [fetchMateri, cascadeData]);

  // Delete materi with dependency check
  const deleteMateri = useCallback(async (id) => {
    try {
      setSubmitting(true);
      setError(null);

      // Check dependencies first
      const dependencyCheck = await materiApi.checkDependencies(id);
      if (!dependencyCheck.success) {
        throw new Error(dependencyCheck.message || 'Gagal memeriksa ketergantungan');
      }

      if (dependencyCheck.data.has_dependencies) {
        throw new Error('Materi tidak dapat dihapus karena masih digunakan dalam kurikulum');
      }

      const response = await materiApi.delete(id);
      
      if (response.success) {
        await fetchMateri(); // Refresh list
        return { success: true };
      } else {
        throw new Error(response.message || 'Gagal menghapus materi');
      }
    } catch (err) {
      console.error('Error deleting materi:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menghapus materi';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [fetchMateri]);

  // Get materi by ID
  const getMateriById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await materiApi.getById(id);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Gagal mengambil detail materi');
      }
    } catch (err) {
      console.error('Error fetching materi detail:', err);
      const errorMessage = err.message || 'Gagal mengambil detail materi';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await materiApi.getStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  // Get available mata pelajaran for selected kelas
  const getAvailableMataPelajaran = useCallback(async (kelasId) => {
    try {
      const response = await materiApi.getAvailableMataPelajaran(kelasId);
      return response.success ? response.data : [];
    } catch (err) {
      console.error('Error fetching available mata pelajaran:', err);
      return [];
    }
  }, []);

  // Get available kelas for selected mata pelajaran
  const getAvailableKelas = useCallback(async (mataPelajaranId) => {
    try {
      const response = await materiApi.getAvailableKelas(mataPelajaranId);
      return response.success ? response.data : [];
    } catch (err) {
      console.error('Error fetching available kelas:', err);
      return [];
    }
  }, []);

  // Validate combination in real-time
  const validateCombination = useCallback(async (mataPelajaranId, kelasId, namaMateri, excludeId = null) => {
    if (!mataPelajaranId || !kelasId || !namaMateri) {
      return { valid: true };
    }

    try {
      setValidating(true);
      
      // Check jenjang consistency
      const mataPelajaran = cascadeData.data.mata_pelajaran.find(
        mp => mp.id_mata_pelajaran === mataPelajaranId
      );
      const kelas = cascadeData.data.kelas.find(
        k => k.id_kelas === kelasId
      );

      const consistencyCheck = cascadeData.validateJenjangConsistency(mataPelajaran, kelas);
      if (!consistencyCheck.valid) {
        return { valid: false, error: consistencyCheck.error };
      }

      // Check uniqueness
      const uniqueCheck = await materiApi.validateUnique({
        id_mata_pelajaran: mataPelajaranId,
        id_kelas: kelasId,
        nama_materi: namaMateri,
        exclude_id: excludeId
      });

      return {
        valid: uniqueCheck.success && uniqueCheck.data.available,
        error: uniqueCheck.success && !uniqueCheck.data.available 
          ? 'Materi dengan nama tersebut sudah ada'
          : null
      };
    } catch (err) {
      return { valid: false, error: 'Gagal memvalidasi kombinasi' };
    } finally {
      setValidating(false);
    }
  }, [cascadeData]);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMateri();
  }, [fetchMateri]);

  // Load more for pagination
  const loadMore = useCallback(async () => {
    if (pagination.current_page < pagination.last_page) {
      await fetchMateri({ page: pagination.current_page + 1 });
    }
  }, [pagination, fetchMateri]);

  // Search materi
  const searchMateri = useCallback(async (searchText, filters = {}) => {
    await fetchMateri({ search: searchText, ...filters });
  }, [fetchMateri]);

  // Filter by mata pelajaran
  const filterByMataPelajaran = useCallback(async (mataPelajaranId, additionalFilters = {}) => {
    await fetchMateri({ id_mata_pelajaran: mataPelajaranId, ...additionalFilters });
  }, [fetchMateri]);

  // Filter by kelas
  const filterByKelas = useCallback(async (kelasId, additionalFilters = {}) => {
    await fetchMateri({ id_kelas: kelasId, ...additionalFilters });
  }, [fetchMateri]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    if (autoLoad) {
      fetchMateri();
    }
    if (includeStatistics) {
      fetchStatistics();
    }
  }, [autoLoad, includeStatistics]);

  return {
    // Data
    materiData,
    statistics,
    pagination,
    cascadeData,
    
    // States
    loading,
    refreshing,
    error,
    submitting,
    validating,
    
    // Actions
    fetchMateri,
    createMateri,
    updateMateri,
    deleteMateri,
    getMateriById,
    fetchStatistics,
    getAvailableMataPelajaran,
    getAvailableKelas,
    validateCombination,
    handleRefresh,
    loadMore,
    searchMateri,
    filterByMataPelajaran,
    filterByKelas,
    clearError
  };
};