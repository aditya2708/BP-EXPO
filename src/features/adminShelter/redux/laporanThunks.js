import { createAsyncThunk } from '@reduxjs/toolkit';
import { laporanAnakApi } from '../api/laporanAnakApi';

// Fetch main laporan anak binaan
export const fetchLaporanAnakBinaan = createAsyncThunk(
  'laporan/fetchLaporanAnakBinaan',
  async ({ start_date, end_date, jenisKegiatan, search, page, per_page } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;
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
  async ({ start_date, end_date, jenisKegiatan } = {}, { dispatch, rejectWithValue }) => {
    try {
      // Fetch filter options first
      const filterOptionsResult = await dispatch(fetchFilterOptions()).unwrap();
      const yearsResult = await dispatch(fetchAvailableYears()).unwrap();
      
      // Set default date range to current year if not provided
      const defaultStartDate = start_date || `${new Date().getFullYear()}-01-01`;
      const defaultEndDate = end_date || `${new Date().getFullYear()}-12-31`;
      
      // Fetch main data
      await dispatch(fetchLaporanAnakBinaan({ 
        start_date: defaultStartDate,
        end_date: defaultEndDate,
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
        start_date: updatedFilters.start_date,
        end_date: updatedFilters.end_date,
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