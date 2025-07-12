// src/features/adminCabang/redux/masterData/masterDataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminCabangApi } from '../../api/adminCabangApi';

// Async thunks
export const fetchMasterDataStats = createAsyncThunk(
  'masterData/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.get('/master-data/statistics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchJenjangForDropdown = createAsyncThunk(
  'masterData/fetchJenjangDropdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.get('/master-data/jenjang/dropdown');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMataPelajaranByJenjang = createAsyncThunk(
  'masterData/fetchMataPelajaranByJenjang',
  async (jenjangId, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.get(`/master-data/mata-pelajaran/by-jenjang/${jenjangId}`);
      return { jenjangId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchKelasByJenjang = createAsyncThunk(
  'masterData/fetchKelasByJenjang',
  async (jenjangId, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.get(`/master-data/kelas/by-jenjang/${jenjangId}`);
      return { jenjangId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMateriByKelas = createAsyncThunk(
  'masterData/fetchMateriByKelas',
  async (kelasId, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.get(`/master-data/materi/by-kelas/${kelasId}`);
      return { kelasId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  stats: {
    jenjang: 0,
    mata_pelajaran: 0,
    kelas: 0,
    materi: 0,
  },
  dropdownData: {
    jenjang: [],
    mataPelajaranByJenjang: {},
    kelasByJenjang: {},
    materiByKelas: {},
  },
  loading: false,
  error: null,
};

const masterDataSlice = createSlice({
  name: 'masterData',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetDropdownData: (state) => {
      state.dropdownData = initialState.dropdownData;
    },
    clearMataPelajaranByJenjang: (state, action) => {
      if (action.payload) {
        delete state.dropdownData.mataPelajaranByJenjang[action.payload];
      } else {
        state.dropdownData.mataPelajaranByJenjang = {};
      }
    },
    clearKelasByJenjang: (state, action) => {
      if (action.payload) {
        delete state.dropdownData.kelasByJenjang[action.payload];
      } else {
        state.dropdownData.kelasByJenjang = {};
      }
    },
    clearMateriByKelas: (state, action) => {
      if (action.payload) {
        delete state.dropdownData.materiByKelas[action.payload];
      } else {
        state.dropdownData.materiByKelas = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Master Data Stats
      .addCase(fetchMasterDataStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasterDataStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data || initialState.stats;
      })
      .addCase(fetchMasterDataStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Jenjang Dropdown
      .addCase(fetchJenjangForDropdown.fulfilled, (state, action) => {
        state.dropdownData.jenjang = action.payload.data || [];
      })
      
      // Mata Pelajaran by Jenjang
      .addCase(fetchMataPelajaranByJenjang.fulfilled, (state, action) => {
        const { jenjangId, data } = action.payload;
        state.dropdownData.mataPelajaranByJenjang[jenjangId] = data.data || [];
      })
      
      // Kelas by Jenjang
      .addCase(fetchKelasByJenjang.fulfilled, (state, action) => {
        const { jenjangId, data } = action.payload;
        state.dropdownData.kelasByJenjang[jenjangId] = data.data || [];
      })
      
      // Materi by Kelas
      .addCase(fetchMateriByKelas.fulfilled, (state, action) => {
        const { kelasId, data } = action.payload;
        state.dropdownData.materiByKelas[kelasId] = data.data || [];
      });
  },
});

export const {
  clearError,
  resetDropdownData,
  clearMataPelajaranByJenjang,
  clearKelasByJenjang,
  clearMateriByKelas,
} = masterDataSlice.actions;

export default masterDataSlice.reducer;

// Selectors
export const selectMasterDataStats = (state) => state.masterData.stats;
export const selectMasterDataLoading = (state) => state.masterData.loading;
export const selectMasterDataError = (state) => state.masterData.error;
export const selectJenjangDropdown = (state) => state.masterData.dropdownData.jenjang;
export const selectMataPelajaranByJenjang = (jenjangId) => (state) => 
  state.masterData.dropdownData.mataPelajaranByJenjang[jenjangId] || [];
export const selectKelasByJenjang = (jenjangId) => (state) => 
  state.masterData.dropdownData.kelasByJenjang[jenjangId] || [];
export const selectMateriByKelas = (kelasId) => (state) => 
  state.masterData.dropdownData.materiByKelas[kelasId] || [];