import { createAsyncThunk } from '@reduxjs/toolkit';
import { tutorLaporanApi } from '../api/tutorLaporanApi';

export const fetchLaporanTutor = createAsyncThunk(
  'tutorLaporan/fetchLaporanTutor',
  async ({ year, jenisKegiatan, maple } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (jenisKegiatan) params.jenis_kegiatan = jenisKegiatan;
      if (maple) params.maple = maple;
      
      const response = await tutorLaporanApi.getLaporanTutor(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch laporan tutor';
      return rejectWithValue(message);
    }
  }
);

export const fetchTutorDetailReport = createAsyncThunk(
  'tutorLaporan/fetchTutorDetailReport',
  async ({ tutorId, year, jenisKegiatan }, { rejectWithValue }) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (jenisKegiatan) params.jenis_kegiatan = jenisKegiatan;
      
      const response = await tutorLaporanApi.getTutorDetailReport(tutorId, params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch tutor detail report';
      return rejectWithValue(message);
    }
  }
);

export const fetchMapelOptions = createAsyncThunk(
  'tutorLaporan/fetchMapelOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tutorLaporanApi.getMapelOptions();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch mapel options';
      return rejectWithValue(message);
    }
  }
);

export const fetchTutorJenisKegiatanOptions = createAsyncThunk(
  'tutorLaporan/fetchTutorJenisKegiatanOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tutorLaporanApi.getJenisKegiatanOptions();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch jenis kegiatan options';
      return rejectWithValue(message);
    }
  }
);

export const fetchTutorAvailableYears = createAsyncThunk(
  'tutorLaporan/fetchTutorAvailableYears',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tutorLaporanApi.getAvailableYears();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 
        error.message || 
        'Failed to fetch available years';
      return rejectWithValue(message);
    }
  }
);

export const refreshTutorLaporanWithFilters = createAsyncThunk(
  'tutorLaporan/refreshTutorLaporanWithFilters',
  async (_, { getState, dispatch }) => {
    const { tutorLaporan } = getState();
    const { year, jenisKegiatan, maple } = tutorLaporan.filters;
    
    return dispatch(fetchLaporanTutor({ 
      year, 
      jenisKegiatan,
      maple 
    }));
  }
);

export const initializeTutorLaporanPage = createAsyncThunk(
  'tutorLaporan/initializeTutorLaporanPage',
  async ({ year, jenisKegiatan, maple } = {}, { dispatch, rejectWithValue }) => {
    try {
      const yearsResult = await dispatch(fetchTutorAvailableYears()).unwrap();
      const activitiesResult = await dispatch(fetchTutorJenisKegiatanOptions()).unwrap();
      const mapelResult = await dispatch(fetchMapelOptions()).unwrap();
      
      const currentYear = year || new Date().getFullYear();
      await dispatch(fetchLaporanTutor({ 
        year: currentYear, 
        jenisKegiatan,
        maple 
      })).unwrap();
      
      return { 
        success: true,
        years: yearsResult,
        activities: activitiesResult,
        mapel: mapelResult
      };
    } catch (error) {
      const message = error.message || 'Failed to initialize tutor laporan page';
      return rejectWithValue(message);
    }
  }
);

export const updateTutorFiltersAndRefresh = createAsyncThunk(
  'tutorLaporan/updateTutorFiltersAndRefresh',
  async (newFilters, { dispatch, getState }) => {
    const { tutorLaporan } = getState();
    const updatedFilters = { ...tutorLaporan.filters, ...newFilters };
    
    dispatch({ type: 'tutorLaporan/setFilters', payload: newFilters });
    
    return dispatch(fetchLaporanTutor(updatedFilters)).unwrap();
  }
);