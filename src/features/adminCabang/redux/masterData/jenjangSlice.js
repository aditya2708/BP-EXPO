import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jenjangApi from '../../api/masterData/jenjangApi';

// Async thunks
export const fetchJenjangList = createAsyncThunk(
  'jenjang/fetchList',
  async (params = {}) => jenjangApi.getList(params)
);

export const fetchJenjangDetail = createAsyncThunk(
  'jenjang/fetchDetail',
  async (id) => jenjangApi.getDetail(id)
);

export const createJenjang = createAsyncThunk(
  'jenjang/create',
  async (data) => jenjangApi.create(data)
);

export const updateJenjang = createAsyncThunk(
  'jenjang/update',
  async ({ id, data }) => jenjangApi.update(id, data)
);

export const deleteJenjang = createAsyncThunk(
  'jenjang/delete',
  async (id) => {
    await jenjangApi.delete(id);
    return id;
  }
);

export const fetchJenjangKelas = createAsyncThunk(
  'jenjang/fetchKelas',
  async (jenjangId) => jenjangApi.getKelas(jenjangId)
);

export const fetchJenjangMataPelajaran = createAsyncThunk(
  'jenjang/fetchMataPelajaran',
  async (jenjangId) => jenjangApi.getMataPelajaran(jenjangId)
);

export const fetchJenjangForDropdown = createAsyncThunk(
  'jenjang/fetchForDropdown',
  async () => jenjangApi.getForDropdown()
);

export const fetchJenjangStatistics = createAsyncThunk(
  'jenjang/fetchStatistics',
  async () => jenjangApi.getStatistics()
);

const initialState = {
  list: [],
  detail: null,
  kelas: [],
  mataPelajaran: [],
  dropdownData: [],
  statistics: null,
  loading: false,
  error: null,
};

const jenjangSlice = createSlice({
  name: 'jenjang',
  initialState,
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
      // List
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
      // Detail
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
      // Create
      .addCase(createJenjang.fulfilled, (state, action) => {
        state.list.unshift(action.payload.data);
      })
      // Update
      .addCase(updateJenjang.fulfilled, (state, action) => {
        const index = state.list.findIndex(j => j.id_jenjang === action.payload.data.id_jenjang);
        if (index !== -1) {
          state.list[index] = action.payload.data;
        }
        if (state.detail?.id_jenjang === action.payload.data.id_jenjang) {
          state.detail = action.payload.data;
        }
      })
      // Delete
      .addCase(deleteJenjang.fulfilled, (state, action) => {
        state.list = state.list.filter(j => j.id_jenjang !== action.payload);
        if (state.detail?.id_jenjang === action.payload) {
          state.detail = null;
        }
      })
      // Kelas
      .addCase(fetchJenjangKelas.fulfilled, (state, action) => {
        state.kelas = action.payload.data.kelas_standard || [];
      })
      // Mata Pelajaran
      .addCase(fetchJenjangMataPelajaran.fulfilled, (state, action) => {
        state.mataPelajaran = action.payload.data.mata_pelajaran || [];
      })
      // Dropdown
      .addCase(fetchJenjangForDropdown.fulfilled, (state, action) => {
        state.dropdownData = action.payload.data || [];
      })
      // Statistics
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