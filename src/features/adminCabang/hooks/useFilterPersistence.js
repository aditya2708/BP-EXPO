import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FILTER_STORAGE_PREFIX = 'filter_';

export const useFilterPersistence = (filterKey, defaultFilters = {}) => {
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);

  const storageKey = `${FILTER_STORAGE_PREFIX}${filterKey}`;

  // Load filters from storage on mount
  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        const parsedFilters = JSON.parse(stored);
        setFilters({ ...defaultFilters, ...parsedFilters });
      }
    } catch (error) {
      console.error('Error loading filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFilters = async (newFilters) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newFilters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  };

  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    saveFilters(updatedFilters);
  }, [filters]);

  const updateFilter = useCallback((key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    saveFilters(updatedFilters);
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    saveFilters(defaultFilters);
  }, [defaultFilters]);

  const clearFilters = useCallback(() => {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setFilters(clearedFilters);
    saveFilters(clearedFilters);
  }, [filters]);

  const getActiveFiltersCount = useCallback(() => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== null && value !== undefined
    ).length;
  }, [filters]);

  const hasActiveFilters = useCallback(() => {
    return getActiveFiltersCount() > 0;
  }, [getActiveFiltersCount]);

  const getFilterSummary = useCallback(() => {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }, [filters]);

  return {
    filters,
    loading,
    updateFilters,
    updateFilter,
    resetFilters,
    clearFilters,
    getActiveFiltersCount,
    hasActiveFilters,
    getFilterSummary
  };
};