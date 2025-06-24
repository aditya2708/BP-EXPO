import { createAsyncThunk } from '@reduxjs/toolkit';
import { cpbLaporanApi } from '../api/cpbLaporanApi';

// Fetch main CPB report with summary counts
export const fetchCpbReport = createAsyncThunk(
  'cpbLaporan/fetchCpbReport',
  async ({ jenisKelamin, kelas, statusOrangTua } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (jenisKelamin) params.jenis_kelamin = jenisKelamin;
      if (kelas) params.kelas = kelas;
      if (statusOrangTua) params.status_orang_tua = statusOrangTua;
      
      const response = await cpbLaporanApi.getCpbReport(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch CPB report';
      return rejectWithValue(message);
    }
  }
);

// Fetch children by specific CPB status
export const fetchCpbByStatus = createAsyncThunk(
  'cpbLaporan/fetchCpbByStatus',
  async ({ status, jenisKelamin, kelas, statusOrangTua, search }, { rejectWithValue }) => {
    try {
      const params = {};
      if (jenisKelamin) params.jenis_kelamin = jenisKelamin;
      if (kelas) params.kelas = kelas;
      if (statusOrangTua) params.status_orang_tua = statusOrangTua;
      if (search) params.search = search;
      
      const response = await cpbLaporanApi.getCpbByStatus(status, params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch children by CPB status';
      return rejectWithValue(message);
    }
  }
);

// Fetch CPB filter options
export const fetchCpbFilterOptions = createAsyncThunk(
  'cpbLaporan/fetchCpbFilterOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cpbLaporanApi.getFilterOptions();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch filter options';
      return rejectWithValue(message);
    }
  }
);

// Export CPB data
export const exportCpbData = createAsyncThunk(
  'cpbLaporan/exportCpbData',
  async ({ status, jenisKelamin, kelas, statusOrangTua } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (status) params.status = status;
      if (jenisKelamin) params.jenis_kelamin = jenisKelamin;
      if (kelas) params.kelas = kelas;
      if (statusOrangTua) params.status_orang_tua = statusOrangTua;
      
      const response = await cpbLaporanApi.exportCpbData(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to export CPB data';
      return rejectWithValue(message);
    }
  }
);

// Combined thunk to refresh CPB report with current filters
export const refreshCpbWithFilters = createAsyncThunk(
  'cpbLaporan/refreshCpbWithFilters',
  async (_, { getState, dispatch }) => {
    const { cpbLaporan } = getState();
    const { jenisKelamin, kelas, statusOrangTua } = cpbLaporan.filters;
    
    return dispatch(fetchCpbReport({ 
      jenisKelamin, 
      kelas, 
      statusOrangTua 
    }));
  }
);

// Initialize CPB laporan page data (fetch filters and initial data)
export const initializeCpbLaporanPage = createAsyncThunk(
  'cpbLaporan/initializeCpbLaporanPage',
  async ({ jenisKelamin, kelas, statusOrangTua } = {}, { dispatch, rejectWithValue }) => {
    try {
      // Fetch filter options first
      const filterOptionsResult = await dispatch(fetchCpbFilterOptions()).unwrap();
      
      // Fetch main summary data
      await dispatch(fetchCpbReport({ 
        jenisKelamin, 
        kelas, 
        statusOrangTua 
      })).unwrap();
      
      // Fetch initial BCPB children data
      await dispatch(fetchCpbByStatus({ 
        status: 'BCPB',
        jenisKelamin, 
        kelas, 
        statusOrangTua 
      })).unwrap();
      
      return { 
        success: true,
        filterOptions: filterOptionsResult
      };
    } catch (error) {
      const message = error.message || 'Failed to initialize CPB laporan page';
      return rejectWithValue(message);
    }
  }
);

// Update filters and refresh data
export const updateCpbFiltersAndRefresh = createAsyncThunk(
  'cpbLaporan/updateCpbFiltersAndRefresh',
  async (newFilters, { dispatch, getState }) => {
    const { cpbLaporan } = getState();
    const updatedFilters = { ...cpbLaporan.filters, ...newFilters };
    
    // Update filters in state first
    dispatch({ type: 'cpbLaporan/setFilters', payload: newFilters });
    
    // Refresh summary with new filters
    await dispatch(fetchCpbReport({
      jenisKelamin: updatedFilters.jenisKelamin,
      kelas: updatedFilters.kelas,
      statusOrangTua: updatedFilters.statusOrangTua
    })).unwrap();
    
    // Refresh current tab children data if there's an active tab
    if (cpbLaporan.currentStatus) {
      return dispatch(fetchCpbByStatus({
        status: cpbLaporan.currentStatus,
        jenisKelamin: updatedFilters.jenisKelamin,
        kelas: updatedFilters.kelas,
        statusOrangTua: updatedFilters.statusOrangTua,
        search: updatedFilters.search
      })).unwrap();
    }
    
    return true;
  }
);

// Fetch children for specific tab with current filters
export const fetchCpbTabData = createAsyncThunk(
  'cpbLaporan/fetchCpbTabData',
  async (status, { getState, dispatch }) => {
    const { cpbLaporan } = getState();
    const { jenisKelamin, kelas, statusOrangTua, search } = cpbLaporan.filters;
    
    return dispatch(fetchCpbByStatus({
      status,
      jenisKelamin,
      kelas,
      statusOrangTua,
      search
    })).unwrap();
  }
);