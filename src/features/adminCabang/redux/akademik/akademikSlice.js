// src/features/adminCabang/redux/akademik/akademikSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminCabangApi } from '../../api/adminCabangApi';

// Async thunks
export const fetchAkademikStats = createAsyncThunk(
  'akademik/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.akademik.getStatistics();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRecentKurikulum = createAsyncThunk(
  'akademik/fetchRecentKurikulum',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.akademik.getRecentKurikulum(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSemesterData = createAsyncThunk(
  'akademik/fetchSemesterData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.akademik.getSemesterData();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  stats: {
    kurikulum: 0,
    assigned_materi: 0,
    active_semester: 0,
    total_pembelajaran: 0,
  },
  recent_kurikulum: [],
  semester_data: {
    current: null,
    available: [],
  },
  loading: false,
  error: null,
};

const akademikSlice = createSlice({
  name: 'akademik',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetStats: (state) => {
      state.stats = initialState.stats;
    },
    clearRecentKurikulum: (state) => {
      state.recent_kurikulum = [];
    },
    updateStatsLocally: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Akademik Stats
      .addCase(fetchAkademikStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAkademikStats.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data || {};
        state.stats = {
          kurikulum: data.kurikulum || 0,
          assigned_materi: data.assigned_materi || 0,
          active_semester: data.active_semester || 0,
          total_pembelajaran: data.total_pembelajaran || 0,
        };
        state.recent_kurikulum = data.recent_kurikulum || [];
      })
      .addCase(fetchAkademikStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Recent Kurikulum
      .addCase(fetchRecentKurikulum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentKurikulum.fulfilled, (state, action) => {
        state.loading = false;
        state.recent_kurikulum = action.payload.data || [];
      })
      .addCase(fetchRecentKurikulum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Semester Data
      .addCase(fetchSemesterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSemesterData.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data || {};
        state.semester_data = {
          current: data.current || null,
          available: data.available || [],
        };
      })
      .addCase(fetchSemesterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const {
  clearError,
  resetStats,
  clearRecentKurikulum,
  updateStatsLocally,
} = akademikSlice.actions;

export default akademikSlice.reducer;

// Selectors
export const selectAkademikStats = (state) => state.akademik.stats;
export const selectAkademikLoading = (state) => state.akademik.loading;
export const selectAkademikError = (state) => state.akademik.error;
export const selectRecentKurikulum = (state) => state.akademik.recent_kurikulum;
export const selectSemesterData = (state) => state.akademik.semester_data;