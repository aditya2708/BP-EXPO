import { createAsyncThunk } from '@reduxjs/toolkit';
import { historiLaporanApi } from '../api/historiLaporanApi';

// Fetch main laporan histori with filters
export const fetchLaporanHistori = createAsyncThunk(
  'historiLaporan/fetchLaporanHistori',
  async ({ year, jenisHistori, search } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (jenisHistori) params.jenis_histori = jenisHistori;
      if (search) params.search = search;
      
      const response = await historiLaporanApi.getLaporanHistori(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch laporan histori';
      return rejectWithValue(message);
    }
  }
);

// Fetch histori detail
export const fetchHistoriDetail = createAsyncThunk(
  'historiLaporan/fetchHistoriDetail',
  async (historiId, { rejectWithValue }) => {
    try {
      const response = await historiLaporanApi.getHistoriDetail(historiId);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch histori detail';
      return rejectWithValue(message);
    }
  }
);

// Fetch jenis histori options for filter
export const fetchJenisHistoriOptions = createAsyncThunk(
  'historiLaporan/fetchJenisHistoriOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await historiLaporanApi.getJenisHistoriOptions();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch jenis histori options';
      return rejectWithValue(message);
    }
  }
);

// Fetch available years for filter
export const fetchAvailableYears = createAsyncThunk(
  'historiLaporan/fetchAvailableYears',
  async (_, { rejectWithValue }) => {
    try {
      const response = await historiLaporanApi.getAvailableYears();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch available years';
      return rejectWithValue(message);
    }
  }
);

// Initialize histori laporan page data
export const initializeHistoriLaporanPage = createAsyncThunk(
  'historiLaporan/initializeHistoriLaporanPage',
  async ({ year, jenisHistori, search } = {}, { dispatch, rejectWithValue }) => {
    try {
      // Fetch filter options first
      const yearsResult = await dispatch(fetchAvailableYears()).unwrap();
      const jenisHistoriResult = await dispatch(fetchJenisHistoriOptions()).unwrap();
      
      // Fetch main data with current or provided filters
      const currentYear = year || new Date().getFullYear();
      await dispatch(fetchLaporanHistori({ 
        year: currentYear, 
        jenisHistori,
        search 
      })).unwrap();
      
      return { 
        success: true,
        years: yearsResult,
        jenisHistori: jenisHistoriResult
      };
    } catch (error) {
      const message = error.message || 'Failed to initialize histori laporan page';
      return rejectWithValue(message);
    }
  }
);

// Update filters and refresh data
export const updateFiltersAndRefresh = createAsyncThunk(
  'historiLaporan/updateFiltersAndRefresh',
  async (newFilters, { dispatch, getState }) => {
    const { historiLaporan } = getState();
    const updatedFilters = { ...historiLaporan.filters, ...newFilters };
    
    // Update filters in state first
    dispatch({ type: 'historiLaporan/setFilters', payload: newFilters });
    
    // Then fetch with new filters
    return dispatch(fetchLaporanHistori(updatedFilters)).unwrap();
  }
);