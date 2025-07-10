import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jenjangApi } from '../api/jenjangApi';

// Async thunks
export const fetchJenjangList = createAsyncThunk(
  'jenjang/fetchList',
  async (params) => {
    const response = await jenjangApi.getAllJenjang(params);
    return response.data;
  }
);

export const fetchJenjangDetail = createAsyncThunk(
  'jenjang/fetchDetail',
  async (id) => {
    const response = await jenjangApi.getJenjangDetail(id);
    return response.data;
  }
);

export const fetchJenjangKelas = createAsyncThunk(
  'jenjang/fetchKelas',
  async (id) => {
    const response = await jenjangApi.getKelas(id);
    return response.data;
  }
);

export const fetchJenjangMataPelajaran = createAsyncThunk(
  'jenjang/fetchMataPelajaran',
  async (id) => {
    const response = await jenjangApi.getMataPelajaran(id);
    return response.data;
  }
);

export const fetchJenjangForDropdown = createAsyncThunk(
  'jenjang/fetchForDropdown',
  async () => {
    const response = await jenjangApi.getForDropdown();
    return response.data;
  }
);

export const fetchJenjangStatistics = createAsyncThunk(
  'jenjang/fetchStatistics',
  async () => {
    const response = await jenjangApi.getStatistics();
    return response.data;
  }
);

// Slice
const jenjangSlice = createSlice({
  name: 'jenjang',
  initialState: {
    list: [],
    detail: null,
    kelas: [],
    mataPelajaran: [],
    dropdownData: [],
    statistics: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDetail: (state) => {
      state.detail = null;
    },
    clearKelas: (state) => {
      state.kelas = [];
    },
    clearMataPelajaran: (state) => {
      state.mataPelajaran = [];
    },
    clearStatistics: (state) => {
      state.statistics = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchJenjangList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJenjangList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
      })
      .addCase(fetchJenjangList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch detail
      .addCase(fetchJenjangDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJenjangDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload.data;
      })
      .addCase(fetchJenjangDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch kelas
      .addCase(fetchJenjangKelas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJenjangKelas.fulfilled, (state, action) => {
        state.loading = false;
        state.kelas = action.payload.data.kelas_standard || [];
      })
      .addCase(fetchJenjangKelas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch mata pelajaran
      .addCase(fetchJenjangMataPelajaran.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJenjangMataPelajaran.fulfilled, (state, action) => {
        state.loading = false;
        state.mataPelajaran = action.payload.data.mata_pelajaran || [];
      })
      .addCase(fetchJenjangMataPelajaran.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch for dropdown
      .addCase(fetchJenjangForDropdown.fulfilled, (state, action) => {
        state.dropdownData = action.payload.data || [];
      })
      // Fetch statistics
      .addCase(fetchJenjangStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJenjangStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(fetchJenjangStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { 
  clearError, 
  clearDetail, 
  clearKelas,
  clearMataPelajaran,
  clearStatistics
} = jenjangSlice.actions;
export default jenjangSlice.reducer;

// Selectors
export const selectJenjangList = (state) => state.jenjang.list;
export const selectJenjangDetail = (state) => state.jenjang.detail;
export const selectJenjangKelas = (state) => state.jenjang.kelas;
export const selectJenjangMataPelajaran = (state) => state.jenjang.mataPelajaran;
export const selectJenjangDropdownData = (state) => state.jenjang.dropdownData;
export const selectJenjangStatistics = (state) => state.jenjang.statistics;
export const selectJenjangLoading = (state) => state.jenjang.loading;
export const selectJenjangError = (state) => state.jenjang.error;