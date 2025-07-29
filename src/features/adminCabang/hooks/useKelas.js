import { useState, useEffect, useCallback } from 'react';
import { kelasApi } from '../api/masterData/kelasApi';

export const useKelas = () => {
  const [kelasData, setKelasData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [cascadeData, setCascadeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch kelas list
  const fetchKelas = useCallback(async (params = {}) => {
    try {
      setError(null);
      if (!refreshing) setLoading(true);
      
      const response = await kelasApi.getAll(params);
      
      if (response.success) {
        setKelasData(response.data.data || []);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        });
      } else {
        throw new Error(response.message || 'Gagal mengambil data kelas');
      }
    } catch (err) {
      console.error('Error fetching kelas:', err);
      setError(err.message || 'Gagal mengambil data kelas');
      setKelasData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  // Create kelas
  const createKelas = useCallback(async (data) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await kelasApi.create(data);
      
      if (response.success) {
        await fetchKelas(); // Refresh list
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Gagal menambah kelas');
      }
    } catch (err) {
      console.error('Error creating kelas:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menambah kelas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [fetchKelas]);

  // Update kelas
  const updateKelas = useCallback(async (id, data) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await kelasApi.update(id, data);
      
      if (response.success) {
        await fetchKelas(); // Refresh list
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Gagal memperbarui kelas');
      }
    } catch (err) {
      console.error('Error updating kelas:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memperbarui kelas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [fetchKelas]);

  // Delete kelas
  const deleteKelas = useCallback(async (id) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await kelasApi.delete(id);
      
      if (response.success) {
        await fetchKelas(); // Refresh list
        return { success: true };
      } else {
        throw new Error(response.message || 'Gagal menghapus kelas');
      }
    } catch (err) {
      console.error('Error deleting kelas:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menghapus kelas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [fetchKelas]);

  // Get kelas by ID
  const getKelasById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await kelasApi.getById(id);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Gagal mengambil detail kelas');
      }
    } catch (err) {
      console.error('Error fetching kelas detail:', err);
      const errorMessage = err.message || 'Gagal mengambil detail kelas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await kelasApi.getStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  // Fetch cascade data (jenjang + kelas)
  const fetchCascadeData = useCallback(async () => {
    try {
      const response = await kelasApi.getCascadeData();
      if (response.success) {
        setCascadeData(response.data);
      }
    } catch (err) {
      console.error('Error fetching cascade data:', err);
    }
  }, []);

  // Get kelas by jenjang
  const getKelasByJenjang = useCallback(async (jenjangId, params = {}) => {
    try {
      const response = await kelasApi.getByJenjang(jenjangId, params);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Gagal mengambil data kelas');
      }
    } catch (err) {
      console.error('Error fetching kelas by jenjang:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchKelas();
  }, [fetchKelas]);

  // Load more for pagination
  const loadMore = useCallback(async () => {
    if (pagination.current_page < pagination.last_page) {
      await fetchKelas({ page: pagination.current_page + 1 });
    }
  }, [pagination, fetchKelas]);

  // Search kelas
  const searchKelas = useCallback(async (searchText) => {
    await fetchKelas({ search: searchText });
  }, [fetchKelas]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    fetchKelas();
    fetchCascadeData();
  }, []);

  return {
    // Data
    kelasData,
    statistics,
    cascadeData,
    pagination,
    
    // States
    loading,
    refreshing,
    error,
    submitting,
    
    // Actions
    fetchKelas,
    createKelas,
    updateKelas,
    deleteKelas,
    getKelasById,
    fetchStatistics,
    fetchCascadeData,
    getKelasByJenjang,
    handleRefresh,
    loadMore,
    searchKelas,
    clearError
  };
};