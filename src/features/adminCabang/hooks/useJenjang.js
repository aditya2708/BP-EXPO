import { useState, useEffect, useCallback } from 'react';
import { jenjangApi } from '../api/masterData/jenjangApi';

export const useJenjang = () => {
  const [jenjangData, setJenjangData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch jenjang list
  const fetchJenjang = useCallback(async (params = {}) => {
    try {
      setError(null);
      if (!refreshing) setLoading(true);
      
      const response = await jenjangApi.getAll(params);
      
      if (response.success) {
        setJenjangData(response.data.data || []);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        });
      } else {
        throw new Error(response.message || 'Gagal mengambil data jenjang');
      }
    } catch (err) {
      console.error('Error fetching jenjang:', err);
      setError(err.message || 'Gagal mengambil data jenjang');
      setJenjangData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  // Create jenjang
  const createJenjang = useCallback(async (data) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await jenjangApi.create(data);
      
      if (response.success) {
        await fetchJenjang(); // Refresh list
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Gagal menambah jenjang');
      }
    } catch (err) {
      console.error('Error creating jenjang:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menambah jenjang';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [fetchJenjang]);

  // Update jenjang
  const updateJenjang = useCallback(async (id, data) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await jenjangApi.update(id, data);
      
      if (response.success) {
        await fetchJenjang(); // Refresh list
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Gagal memperbarui jenjang');
      }
    } catch (err) {
      console.error('Error updating jenjang:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memperbarui jenjang';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [fetchJenjang]);

  // Delete jenjang
  const deleteJenjang = useCallback(async (id) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await jenjangApi.delete(id);
      
      if (response.success) {
        await fetchJenjang(); // Refresh list
        return { success: true };
      } else {
        throw new Error(response.message || 'Gagal menghapus jenjang');
      }
    } catch (err) {
      console.error('Error deleting jenjang:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menghapus jenjang';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [fetchJenjang]);

  // Get jenjang by ID
  const getJenjangById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await jenjangApi.getById(id);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Gagal mengambil detail jenjang');
      }
    } catch (err) {
      console.error('Error fetching jenjang detail:', err);
      const errorMessage = err.message || 'Gagal mengambil detail jenjang';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await jenjangApi.getStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  // Check urutan availability
  const checkUrutanAvailability = useCallback(async (urutan, excludeId = null) => {
    try {
      const response = await jenjangApi.checkUrutan(urutan, excludeId);
      return response.success ? response.data : { available: false };
    } catch (err) {
      console.error('Error checking urutan:', err);
      return { available: false };
    }
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchJenjang();
  }, [fetchJenjang]);

  // Load more for pagination
  const loadMore = useCallback(async () => {
    if (pagination.current_page < pagination.last_page) {
      await fetchJenjang({ page: pagination.current_page + 1 });
    }
  }, [pagination, fetchJenjang]);

  // Search jenjang
  const searchJenjang = useCallback(async (searchText) => {
    await fetchJenjang({ search: searchText });
  }, [fetchJenjang]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    fetchJenjang();
  }, []);

  return {
    // Data
    jenjangData,
    statistics,
    pagination,
    
    // States
    loading,
    refreshing,
    error,
    submitting,
    
    // Actions
    fetchJenjang,
    createJenjang,
    updateJenjang,
    deleteJenjang,
    getJenjangById,
    fetchStatistics,
    checkUrutanAvailability,
    handleRefresh,
    loadMore,
    searchJenjang,
    clearError
  };
};