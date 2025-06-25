import { createAsyncThunk } from '@reduxjs/toolkit';
import { raportLaporanApi } from '../api/raportLaporanApi';

// Fetch main laporan raport with filters
export const fetchLaporanRaport = createAsyncThunk(
  'raportLaporan/fetchLaporanRaport',
  async ({ semester_id, tahun_ajaran, mata_pelajaran, status } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (semester_id) params.semester_id = semester_id;
      if (tahun_ajaran) params.tahun_ajaran = tahun_ajaran;
      if (mata_pelajaran) params.mata_pelajaran = mata_pelajaran;
      if (status) params.status = status;
      
      const response = await raportLaporanApi.getLaporanRaport(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch laporan raport';
      return rejectWithValue(message);
    }
  }
);

// Fetch child detail raport report
export const fetchChildDetailRaport = createAsyncThunk(
  'raportLaporan/fetchChildDetailRaport',
  async ({ childId, semester_id, tahun_ajaran, mata_pelajaran }, { rejectWithValue }) => {
    try {
      const params = {};
      if (semester_id) params.semester_id = semester_id;
      if (tahun_ajaran) params.tahun_ajaran = tahun_ajaran;
      if (mata_pelajaran) params.mata_pelajaran = mata_pelajaran;
      
      const response = await raportLaporanApi.getChildDetailReport(childId, params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch child raport detail';
      return rejectWithValue(message);
    }
  }
);

// Fetch semester options for filter
export const fetchSemesterOptions = createAsyncThunk(
  'raportLaporan/fetchSemesterOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await raportLaporanApi.getSemesterOptions();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch semester options';
      return rejectWithValue(message);
    }
  }
);

// Fetch mata pelajaran options for filter
export const fetchMataPelajaranOptions = createAsyncThunk(
  'raportLaporan/fetchMataPelajaranOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await raportLaporanApi.getMataPelajaranOptions();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch mata pelajaran options';
      return rejectWithValue(message);
    }
  }
);

// Fetch available years for filter
export const fetchAvailableYears = createAsyncThunk(
  'raportLaporan/fetchAvailableYears',
  async (_, { rejectWithValue }) => {
    try {
      const response = await raportLaporanApi.getAvailableYears();
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
  'raportLaporan/refreshLaporanWithFilters',
  async (_, { getState, dispatch }) => {
    const { raportLaporan } = getState();
    const { semester_id, tahun_ajaran, mata_pelajaran, status } = raportLaporan.filters;
    
    return dispatch(fetchLaporanRaport({ 
      semester_id, 
      tahun_ajaran, 
      mata_pelajaran, 
      status 
    }));
  }
);

// Initialize raport laporan page data (fetch filters and initial data)
export const initializeRaportLaporanPage = createAsyncThunk(
  'raportLaporan/initializeRaportLaporanPage',
  async ({ semester_id, tahun_ajaran, mata_pelajaran, status } = {}, { dispatch, rejectWithValue }) => {
    try {
      // Fetch filter options first
      const semesterResult = await dispatch(fetchSemesterOptions()).unwrap();
      const mataPelajaranResult = await dispatch(fetchMataPelajaranOptions()).unwrap();
      const yearsResult = await dispatch(fetchAvailableYears()).unwrap();
      
      // Fetch main data with current or provided filters
      await dispatch(fetchLaporanRaport({ 
        semester_id, 
        tahun_ajaran, 
        mata_pelajaran, 
        status 
      })).unwrap();
      
      return { 
        success: true,
        semesters: semesterResult,
        mataPelajaran: mataPelajaranResult,
        years: yearsResult
      };
    } catch (error) {
      const message = error.message || 'Failed to initialize raport laporan page';
      return rejectWithValue(message);
    }
  }
);

// Update filters and refresh data
export const updateFiltersAndRefresh = createAsyncThunk(
  'raportLaporan/updateFiltersAndRefresh',
  async (newFilters, { dispatch, getState }) => {
    const { raportLaporan } = getState();
    const updatedFilters = { ...raportLaporan.filters, ...newFilters };
    
    // Update filters in state first
    dispatch({ type: 'raportLaporan/setFilters', payload: newFilters });
    
    // Then fetch with new filters
    return dispatch(fetchLaporanRaport(updatedFilters)).unwrap();
  }
);