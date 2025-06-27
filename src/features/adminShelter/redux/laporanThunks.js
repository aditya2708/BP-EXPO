import { createAsyncThunk } from '@reduxjs/toolkit';
import { laporanAnakApi } from '../api/laporanAnakApi';

// Fetch main laporan anak binaan
export const fetchLaporanAnakBinaan = createAsyncThunk(
  'laporan/fetchLaporanAnakBinaan',
  async ({ year, jenisKegiatan, search, page, per_page } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (jenisKegiatan) params.jenisKegiatan = jenisKegiatan;
      if (search) params.search = search;
      if (page) params.page = page;
      if (per_page) params.per_page = per_page;
      
      const response = await laporanAnakApi.getLaporanAnakBinaan(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch laporan anak binaan';
      return rejectWithValue(message);
    }
  }
);

// Fetch filter options (jenis kegiatan)
export const fetchFilterOptions = createAsyncThunk(
  'laporan/fetchFilterOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await laporanAnakApi.getJenisKegiatanOptions();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch filter options';
      return rejectWithValue(message);
    }
  }
);

// Fetch available years
export const fetchAvailableYears = createAsyncThunk(
  'laporan/fetchAvailableYears',
  async (_, { rejectWithValue }) => {
    try {
      const response = await laporanAnakApi.getAvailableYears();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch available years';
      return rejectWithValue(message);
    }
  }
);

// Initialize laporan page
export const initializeLaporanPage = createAsyncThunk(
  'laporan/initializeLaporanPage',
  async ({ year, jenisKegiatan } = {}, { dispatch, rejectWithValue }) => {
    try {
      // Fetch filter options first
      const filterOptionsResult = await dispatch(fetchFilterOptions()).unwrap();
      const yearsResult = await dispatch(fetchAvailableYears()).unwrap();
      
      // Fetch main data
      await dispatch(fetchLaporanAnakBinaan({ 
        year: year || new Date().getFullYear(),
        jenisKegiatan 
      })).unwrap();
      
      return { 
        success: true,
        filterOptions: filterOptionsResult,
        years: yearsResult
      };
    } catch (error) {
      const message = error.message || 'Failed to initialize laporan page';
      return rejectWithValue(message);
    }
  }
);

// Combined update filters and refresh all data
export const updateFiltersAndRefreshAll = createAsyncThunk(
  'laporan/updateFiltersAndRefreshAll',
  async ({ newFilters, page = 1, per_page }, { dispatch, getState, rejectWithValue }) => {
    try {
      const { laporan } = getState();
      const updatedFilters = { ...laporan.filters, ...newFilters };
      
      // Update filters in state first
      dispatch({ type: 'laporan/setFilters', payload: newFilters });
      
      // Fetch data with new filters
      const result = await dispatch(fetchLaporanAnakBinaan({
        year: updatedFilters.year,
        jenisKegiatan: updatedFilters.jenisKegiatan,
        search: updatedFilters.search,
        page,
        per_page
      })).unwrap();
      
      return {
        filters: updatedFilters,
        data: result
      };
    } catch (error) {
      const message = error.message || 'Failed to update filters and refresh data';
      return rejectWithValue(message);
    }
  }
);

// DEPRECATED - kept for backward compatibility
export const updateFiltersAndRefresh = createAsyncThunk(
  'laporan/updateFiltersAndRefresh',
  async (newFilters, { dispatch, getState }) => {
    const { laporan } = getState();
    const updatedFilters = { ...laporan.filters, ...newFilters };
    
    dispatch({ type: 'laporan/setFilters', payload: newFilters });
    return dispatch(fetchLaporanAnakBinaan(updatedFilters)).unwrap();
  }
);