import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import materiApi from '../../api/masterData/materiApi';

// Async thunks
export const fetchMateriList = createAsyncThunk(
  'materi/fetchList',
  async (params = {}) => materiApi.getList(params)
);

export const fetchMateriDetail = createAsyncThunk(
  'materi/fetchDetail',
  async (id) => materiApi.getDetail(id)
);

export const createMateri = createAsyncThunk(
  'materi/create',
  async (data) => materiApi.create(data)
);

export const updateMateri = createAsyncThunk(
  'materi/update',
  async ({ id, data }) => materiApi.update(id, data)
);

export const deleteMateri = createAsyncThunk(
  'materi/delete',
  async (id) => {
    await materiApi.delete(id);
    return id;
  }
);

export const fetchMateriByKelas = createAsyncThunk(
  'materi/fetchByKelas',
  async (kelasId) => materiApi.getByKelas(kelasId)
);

export const fetchMateriByMataPelajaran = createAsyncThunk(
  'materi/fetchByMataPelajaran',
  async (mataPelajaranId) => materiApi.getByMataPelajaran(mataPelajaranId)
);

export const fetchMateriForDropdown = createAsyncThunk(
  'materi/fetchForDropdown',
  async ({ kelasId, mataPelajaranId }) => materiApi.getForDropdown({ kelasId, mataPelajaranId })
);

export const fetchMateriStatistics = createAsyncThunk(
  'materi/fetchStatistics',
  async () => materiApi.getStatistics()
);

export const validateMateriData = createAsyncThunk(
  'materi/validateData',
  async ({ kelasId, mataPelajaranId }) => materiApi.validateMateriData({ kelasId, mataPelajaranId })
);

const initialState = {
  list: [],
  detail: null,
  byKelas: {},
  byMataPelajaran: {},
  dropdownData: {},
  statistics: null,
  validationResult: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  },
  loading: false,
  error: null,
};

const materiSlice = createSlice({
  name: 'materi',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDetail: (state) => {
      state.detail = null;
    },
    clearStatistics: (state) => {
      state.statistics = null;
    },
    clearByKelas: (state) => {
      state.byKelas = {};
    },
    clearByMataPelajaran: (state) => {
      state.byMataPelajaran = {};
    },
    clearValidationResult: (state) => {
      state.validationResult = null;
    },
    updateMateriLocally: (state, action) => {
      const index = state.list.findIndex(m => m.id_materi === action.payload.id_materi);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // List
      .addCase(fetchMateriList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMateriList.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload.data || {};
        state.list = responseData.data || [];
        state.pagination = {
          current_page: responseData.current_page || 1,
          last_page: responseData.last_page || 1,
          per_page: responseData.per_page || 20,
          total: responseData.total || 0
        };
      })
      .addCase(fetchMateriList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Detail
      .addCase(fetchMateriDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMateriDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload.data;
      })
      .addCase(fetchMateriDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create
      .addCase(createMateri.fulfilled, (state, action) => {
        if (!state.list) state.list = [];
        state.list.unshift(action.payload.data);
      })
      // Update
      .addCase(updateMateri.fulfilled, (state, action) => {
        const index = state.list.findIndex(m => m.id_materi === action.payload.data.id_materi);
        if (index !== -1) {
          state.list[index] = action.payload.data;
        }
        if (state.detail?.id_materi === action.payload.data.id_materi) {
          state.detail = action.payload.data;
        }
      })
      // Delete
      .addCase(deleteMateri.fulfilled, (state, action) => {
        state.list = state.list.filter(m => m.id_materi !== action.payload);
        if (state.detail?.id_materi === action.payload) {
          state.detail = null;
        }
      })
      // By Kelas
      .addCase(fetchMateriByKelas.fulfilled, (state, action) => {
        const kelasData = action.payload.data;
        if (kelasData?.kelas) {
          state.byKelas[kelasData.kelas.id_kelas] = kelasData.materi || [];
        }
      })
      // By Mata Pelajaran
      .addCase(fetchMateriByMataPelajaran.fulfilled, (state, action) => {
        const mataPelajaranData = action.payload.data;
        if (mataPelajaranData?.mata_pelajaran) {
          state.byMataPelajaran[mataPelajaranData.mata_pelajaran.id_mata_pelajaran] = mataPelajaranData.materi || [];
        }
      })
      // Dropdown
      .addCase(fetchMateriForDropdown.fulfilled, (state, action) => {
        state.dropdownData = action.payload.data || {};
      })
      // Statistics
      .addCase(fetchMateriStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMateriStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(fetchMateriStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Validation
      .addCase(validateMateriData.fulfilled, (state, action) => {
        state.validationResult = action.payload.data;
      });
  }
});

export const { 
  clearError, 
  clearDetail, 
  clearStatistics,
  clearByKelas,
  clearByMataPelajaran,
  clearValidationResult,
  updateMateriLocally
} = materiSlice.actions;

export default materiSlice.reducer;

// Selectors
export const selectMateriList = (state) => state.materi.list;
export const selectMateriDetail = (state) => state.materi.detail;
export const selectMateriByKelas = (state) => state.materi.byKelas;
export const selectMateriByMataPelajaran = (state) => state.materi.byMataPelajaran;
export const selectMateriDropdownData = (state) => state.materi.dropdownData;
export const selectMateriStatistics = (state) => state.materi.statistics;
export const selectMateriValidationResult = (state) => state.materi.validationResult;
export const selectMateriLoading = (state) => state.materi.loading;
export const selectMateriError = (state) => state.materi.error;
export const selectMateriPagination = (state) => state.materi.pagination;