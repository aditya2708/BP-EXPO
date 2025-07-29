import { useState, useEffect, useCallback } from 'react';
import { materiApi } from '../api/masterData/materiApi';

export const useUsageAnalytics = (options = {}) => {
  const { autoLoad = true, materiId = null } = options;
  
  const [analytics, setAnalytics] = useState({
    overview: null,
    trends: [],
    unused: [],
    recommendations: [],
    usage_history: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch overall usage analytics
  const fetchAnalytics = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = materiId 
        ? `/admin-cabang/master-data/materi/${materiId}/analytics`
        : '/admin-cabang/master-data/materi-analytics';
        
      const response = await materiApi.getAnalytics(filters);
      
      if (response.success) {
        setAnalytics(response.data);
      } else {
        throw new Error(response.message || 'Gagal mengambil analytics');
      }
    } catch (err) {
      setError(err.message || 'Gagal mengambil usage analytics');
    } finally {
      setLoading(false);
    }
  }, [materiId]);

  // Get usage trends over time
  const fetchUsageTrends = useCallback(async (period = '6months') => {
    try {
      const response = await materiApi.getUsageTrends({ 
        period,
        materi_id: materiId 
      });
      
      if (response.success) {
        setAnalytics(prev => ({ ...prev, trends: response.data }));
      }
    } catch (err) {
      console.error('Error fetching trends:', err);
    }
  }, [materiId]);

  // Get unused materi suggestions
  const fetchUnusedMateri = useCallback(async (filters = {}) => {
    try {
      const response = await materiApi.getUnusedMateri(filters);
      
      if (response.success) {
        setAnalytics(prev => ({ ...prev, unused: response.data }));
      }
    } catch (err) {
      console.error('Error fetching unused materi:', err);
    }
  }, []);

  // Get optimization recommendations
  const fetchRecommendations = useCallback(async () => {
    try {
      const response = await materiApi.getOptimizationRecommendations({
        materi_id: materiId
      });
      
      if (response.success) {
        setAnalytics(prev => ({ ...prev, recommendations: response.data }));
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  }, [materiId]);

  // Get usage history for specific materi
  const fetchUsageHistory = useCallback(async (materiId, period = '1year') => {
    try {
      const response = await materiApi.getUsageHistory(materiId, { period });
      
      if (response.success) {
        setAnalytics(prev => ({ ...prev, usage_history: response.data }));
      }
    } catch (err) {
      console.error('Error fetching usage history:', err);
    }
  }, []);

  // Calculate usage efficiency
  const calculateEfficiency = useCallback((usageData) => {
    if (!usageData || usageData.length === 0) return 0;
    
    const totalMateri = usageData.reduce((sum, item) => sum + item.total_materi, 0);
    const usedMateri = usageData.reduce((sum, item) => sum + item.used_materi, 0);
    
    return totalMateri > 0 ? Math.round((usedMateri / totalMateri) * 100) : 0;
  }, []);

  // Get usage distribution by category
  const getUsageByCategory = useCallback(() => {
    if (!analytics.overview) return [];
    
    return analytics.overview.by_category || [];
  }, [analytics.overview]);

  // Get top used materi
  const getTopUsedMateri = useCallback((limit = 10) => {
    if (!analytics.overview?.top_used) return [];
    
    return analytics.overview.top_used.slice(0, limit);
  }, [analytics.overview]);

  // Get underutilized materi
  const getUnderutilizedMateri = useCallback((threshold = 1) => {
    if (!analytics.unused) return [];
    
    return analytics.unused.filter(item => 
      item.usage_count < threshold
    );
  }, [analytics.unused]);

  // Generate usage report
  const generateUsageReport = useCallback(async (format = 'json') => {
    try {
      const response = await materiApi.generateUsageReport({
        format,
        materi_id: materiId,
        include_trends: true,
        include_unused: true,
        include_recommendations: true
      });
      
      return response.success ? response.data : null;
    } catch (err) {
      console.error('Error generating report:', err);
      return null;
    }
  }, [materiId]);

  // Initial load
  useEffect(() => {
    if (autoLoad) {
      fetchAnalytics();
      if (!materiId) {
        fetchUnusedMateri();
        fetchRecommendations();
      }
    }
  }, [autoLoad, materiId]);

  return {
    // Data
    analytics,
    loading,
    error,
    
    // Actions
    fetchAnalytics,
    fetchUsageTrends,
    fetchUnusedMateri,
    fetchRecommendations,
    fetchUsageHistory,
    generateUsageReport,
    
    // Utilities
    calculateEfficiency,
    getUsageByCategory,
    getTopUsedMateri,
    getUnderutilizedMateri
  };
};