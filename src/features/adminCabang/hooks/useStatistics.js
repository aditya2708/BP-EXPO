import { useState, useEffect, useCallback } from 'react';
import { jenjangApi } from '../api/masterData/jenjangApi';
import { mataPelajaranApi } from '../api/masterData/mataPelajaranApi';
import { kelasApi } from '../api/masterData/kelasApi';
import { materiApi } from '../api/masterData/materiApi';

const apiMap = {
  jenjang: jenjangApi,
  mataPelajaran: mataPelajaranApi,
  kelas: kelasApi,
  materi: materiApi
};

export const useStatistics = (type) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const api = apiMap[type];

  const fetchStatistics = useCallback(async () => {
    if (!api?.getStatistics) return;

    try {
      setError(null);
      if (!refreshing) setLoading(true);
      
      const response = await api.getStatistics();
      
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message || `Gagal mengambil statistik ${type}`);
      }
    } catch (err) {
      console.error(`Error fetching ${type} statistics:`, err);
      setError(err.message || `Gagal mengambil statistik ${type}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [api, type, refreshing]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStatistics();
  }, [fetchStatistics]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Return with dynamic property names
  const result = {
    loading,
    refreshing,
    error,
    handleRefresh,
    clearError,
    fetchStatistics
  };

  // Add type-specific data property
  result[`${type}Stats`] = data;

  return result;
};