import { createAsyncThunk } from '@reduxjs/toolkit';
import { laporanApi } from '../api/laporanApi';

// Fetch main laporan anak binaan with filters
export const fetchLaporanAnakBinaan = createAsyncThunk(
  'laporan/fetchLaporanAnakBinaan',
  async ({ year, jenisKegiatan } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (jenisKegiatan) params.jenis_kegiatan = jenisKegiatan;
      
      const response = await laporanApi.getLaporanAnakBinaan(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch laporan anak binaan';
      return rejectWithValue(message);
    }
  }
);

// Fetch child detail report
export const fetchChildDetailReport = createAsyncThunk(
  'laporan/fetchChildDetailReport',
  async ({ childId, year, jenisKegiatan }, { rejectWithValue }) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (jenisKegiatan) params.jenis_kegiatan = jenisKegiatan;
      
      const response = await laporanApi.getChildDetailReport(childId, params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch child detail report';
      return rejectWithValue(message);
    }
  }
);

// Fetch jenis kegiatan options for filter
export const fetchJenisKegiatanOptions = createAsyncThunk(
  'laporan/fetchJenisKegiatanOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await laporanApi.getJenisKegiatanOptions();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch jenis kegiatan options';
      return rejectWithValue(message);
    }
  }
);

// Fetch available years for filter
export const fetchAvailableYears = createAsyncThunk(
  'laporan/fetchAvailableYears',
  async (_, { rejectWithValue }) => {
    try {
      const response = await laporanApi.getAvailableYears();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch available years';
      return rejectWithValue(message);
    }
  }
);

// Combined thunk to refresh laporan with current filters
export const refreshLaporanWithFilters = createAsyncThunk(
  'laporan/refreshLaporanWithFilters',
  async (_, { getState, dispatch }) => {
    const { laporan } = getState();
    const { year, jenisKegiatan } = laporan.filters;
    
    return dispatch(fetchLaporanAnakBinaan({ 
      year, 
      jenisKegiatan 
    }));
  }
);

// Initialize laporan page data (fetch filters and initial data)
export const initializeLaporanPage = createAsyncThunk(
  'laporan/initializeLaporanPage',
  async ({ year, jenisKegiatan } = {}, { dispatch }) => {
    try {
      // Fetch filter options first
      const [yearsResponse, activitiesResponse] = await Promise.all([
        dispatch(fetchAvailableYears()),
        dispatch(fetchJenisKegiatanOptions())
      ]);
      
      // If successful, fetch main data
      if (yearsResponse.meta.requestStatus === 'fulfilled' && 
          activitiesResponse.meta.requestStatus === 'fulfilled') {
        
        const currentYear = year || new Date().getFullYear();
        await dispatch(fetchLaporanAnakBinaan({ 
          year: currentYear, 
          jenisKegiatan 
        }));
      }
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
);

// Update filters and refresh data
export const updateFiltersAndRefresh = createAsyncThunk(
  'laporan/updateFiltersAndRefresh',
  async (newFilters, { dispatch, getState }) => {
    const { laporan } = getState();
    const updatedFilters = { ...laporan.filters, ...newFilters };
    
    // Update filters in state first
    dispatch({ type: 'laporan/setFilters', payload: newFilters });
    
    // Then fetch with new filters
    return dispatch(fetchLaporanAnakBinaan(updatedFilters));
  }
);