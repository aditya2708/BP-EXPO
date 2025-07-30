import { useState, useEffect, useCallback } from 'react';
import { materiApi } from '../api/masterData/materiApi';

export const useMateri = () => {
  const [materiData, setMateriData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch materi list with cascade filtering
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

  // Create materi with triple dependency validation
  const createMateri = useCallback(async (data) => {
    try {
      setSubmitting(true);
      setError(null);
      
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
  }, [fetchMateri]);

  // Update materi
  const updateMateri = useCallback(async (id, data) => {
    try {
      setSubmitting(true);
      setError(null);
      
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
  }, [fetchMateri]);

  // Delete materi with usage validation
  const deleteMateri = useCallback(async (id) => {
    try {
      setSubmitting(true);
      setError(null);
      
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

  // Get materi by ID with relationships
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

  // Fetch statistics with usage analytics
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

  // Get cascade data for dependencies
  const getCascadeData = useCallback(async () => {
    try {
      const response = await materiApi.getCascadeData();
      return response.success ? response.data : null;
    } catch (err) {
      console.error('Error getting cascade data:', err);
      return null;
    }
  }, []);

  // Filter by mata pelajaran
  const filterByMataPelajaran = useCallback(async (mataPelajaranId) => {
    await fetchMateri({ id_mata_pelajaran: mataPelajaranId });
  }, [fetchMateri]);

  // Filter by kelas
  const filterByKelas = useCallback(async (kelasId) => {
    await fetchMateri({ id_kelas: kelasId });
  }, [fetchMateri]);

  // Triple cascade filter
  const filterByCascade = useCallback(async (jenjangId, mataPelajaranId, kelasId) => {
    const params = {};
    if (jenjangId) params.id_jenjang = jenjangId;
    if (mataPelajaranId) params.id_mata_pelajaran = mataPelajaranId;
    if (kelasId) params.id_kelas = kelasId;
    
    await fetchMateri(params);
  }, [fetchMateri]);

  // Search materi
  const searchMateri = useCallback(async (searchText) => {
    await fetchMateri({ search: searchText });
  }, [fetchMateri]);

  // Get usage analytics
  const getUsageAnalytics = useCallback(async (materiId) => {
    try {
      const response = await materiApi.getUsageAnalytics(materiId);
      return response.success ? response.data : null;
    } catch (err) {
      console.error('Error getting usage analytics:', err);
      return null;
    }
  }, []);

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

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    fetchMateri();
  }, []);

  return {
    // Data
    materiData,
    statistics,
    pagination,
    
    // States
    loading,
    refreshing,
    error,
    submitting,
    
    // Actions
    fetchMateri,
    createMateri,
    updateMateri,
    deleteMateri,
    getMateriById,
    fetchStatistics,
    getCascadeData,
    filterByMataPelajaran,
    filterByKelas,
    filterByCascade,
    searchMateri,
    getUsageAnalytics,
    handleRefresh,
    loadMore,
    clearError
  };
};