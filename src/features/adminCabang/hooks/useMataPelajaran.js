import { useState, useEffect, useCallback } from 'react';
import { mataPelajaranApi } from '../api/masterData/mataPelajaranApi';

export const useMataPelajaran = () => {
  const [mataPelajaranData, setMataPelajaranData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [cascadeData, setCascadeData] = useState(null);

  // Fetch mata pelajaran list with filters
  const fetchMataPelajaran = useCallback(async (params = {}) => {
    try {
      setError(null);
      if (!refreshing) setLoading(true);
      
      const response = await mataPelajaranApi.getAll(params);
      
      if (response.success) {
        setMataPelajaranData(response.data.data || []);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        });
      } else {
        throw new Error(response.message || 'Gagal mengambil data mata pelajaran');
      }
    } catch (err) {
      console.error('Error fetching mata pelajaran:', err);
      setError(err.message || 'Gagal mengambil data mata pelajaran');
      setMataPelajaranData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  // Create mata pelajaran
  const createMataPelajaran = useCallback(async (data) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await mataPelajaranApi.create(data);
      
      if (response.success) {
        await fetchMataPelajaran(); // Refresh list
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Gagal menambah mata pelajaran');
      }
    } catch (err) {
      console.error('Error creating mata pelajaran:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menambah mata pelajaran';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [fetchMataPelajaran]);

  // Update mata pelajaran
  const updateMataPelajaran = useCallback(async (id, data) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await mataPelajaranApi.update(id, data);
      
      if (response.success) {
        await fetchMataPelajaran(); // Refresh list
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Gagal memperbarui mata pelajaran');
      }
    } catch (err) {
      console.error('Error updating mata pelajaran:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memperbarui mata pelajaran';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [fetchMataPelajaran]);

  // Delete mata pelajaran
  const deleteMataPelajaran = useCallback(async (id) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await mataPelajaranApi.delete(id);
      
      if (response.success) {
        await fetchMataPelajaran(); // Refresh list
        return { success: true };
      } else {
        throw new Error(response.message || 'Gagal menghapus mata pelajaran');
      }
    } catch (err) {
      console.error('Error deleting mata pelajaran:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menghapus mata pelajaran';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [fetchMataPelajaran]);

  // Get mata pelajaran by ID
  const getMataPelajaranById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mataPelajaranApi.getById(id);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Gagal mengambil detail mata pelajaran');
      }
    } catch (err) {
      console.error('Error fetching mata pelajaran detail:', err);
      const errorMessage = err.message || 'Gagal mengambil detail mata pelajaran';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get mata pelajaran by jenjang (dependency)
  const getByJenjang = useCallback(async (jenjangId) => {
    try {
      const response = await mataPelajaranApi.getByJenjang(jenjangId);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Gagal mengambil mata pelajaran by jenjang');
      }
    } catch (err) {
      console.error('Error fetching mata pelajaran by jenjang:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await mataPelajaranApi.getStatistics();
      if (response.success) {
        setStatistics(response.data);
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Fetch cascade data (jenjang + mata pelajaran)
  const fetchCascadeData = useCallback(async () => {
    try {
      const response = await mataPelajaranApi.getCascadeData();
      if (response.success) {
        setCascadeData(response.data);
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error('Error fetching cascade data:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Filter by jenjang
  const filterByJenjang = useCallback(async (jenjangId) => {
    const params = jenjangId ? { id_jenjang: jenjangId } : {};
    await fetchMataPelajaran(params);
  }, [fetchMataPelajaran]);

  // Filter by kategori
  const filterByKategori = useCallback(async (kategori) => {
    const params = kategori ? { kategori } : {};
    await fetchMataPelajaran(params);
  }, [fetchMataPelajaran]);

  // Search mata pelajaran
  const searchMataPelajaran = useCallback(async (searchText, filters = {}) => {
    const params = { search: searchText, ...filters };
    await fetchMataPelajaran(params);
  }, [fetchMataPelajaran]);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMataPelajaran();
  }, [fetchMataPelajaran]);

  // Load more for pagination
  const loadMore = useCallback(async () => {
    if (pagination.current_page < pagination.last_page) {
      await fetchMataPelajaran({ page: pagination.current_page + 1 });
    }
  }, [pagination, fetchMataPelajaran]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    fetchMataPelajaran();
    fetchCascadeData();
  }, []);

  return {
    // Data
    mataPelajaranData,
    statistics,
    cascadeData,
    pagination,
    
    // States
    loading,
    refreshing,
    error,
    submitting,
    
    // Actions
    fetchMataPelajaran,
    createMataPelajaran,
    updateMataPelajaran,
    deleteMataPelajaran,
    getMataPelajaranById,
    getByJenjang,
    fetchStatistics,
    fetchCascadeData,
    filterByJenjang,
    filterByKategori,
    searchMataPelajaran,
    handleRefresh,
    loadMore,
    clearError
  };
};