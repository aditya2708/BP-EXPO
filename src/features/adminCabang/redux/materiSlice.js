import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { materiApi } from '../api/materiApi';

// Async thunks
export const fetchMateriList = createAsyncThunk(
  'materi/fetchList',
  async (params) => {
    const response = await materiApi.getAllMateri(params);
    return response.data;
  }
);

export const fetchMateriDetail = createAsyncThunk(
  'materi/fetchDetail',
  async (id) => {
    const response = await materiApi.getMateriDetail(id);
    return response.data;
  }
);

export const createMateri = createAsyncThunk(
  'materi/create',
  async (materiData) => {
    const response = await materiApi.createMateri(materiData);
    return response.data;
  }
);

export const updateMateri = createAsyncThunk(
  'materi/update',
  async ({ id, materiData }) => {
    const response = await materiApi.updateMateri(id, materiData);
    return response.data;
  }
);

export const deleteMateri = createAsyncThunk(
  'materi/delete',
  async (id) => {
    await materiApi.deleteMateri(id);
    return id;
  }
);

export const fetchMateriByKelas = createAsyncThunk(
  'materi/fetchByKelas',
  async (kelasId) => {
    const response = await materiApi.getByKelas(kelasId);
    return response.data;
  }
);

export const fetchMateriByMataPelajaran = createAsyncThunk(
  'materi/fetchByMataPelajaran',
  async (params) => {
    const response = await materiApi.getByMataPelajaran(params);
    return response.data;
  }
);

export const fetchMateriCascadeData = createAsyncThunk(
  'materi/fetchCascadeData',
  async (params) => {
    const response = await materiApi.getCascadeData(params);
    return response.data;
  }
);

export const fetchMateriForDropdown = createAsyncThunk(
  'materi/fetchForDropdown',
  async (params) => {
    const response = await materiApi.getForDropdown(params);
    return response.data;
  }
);

// Slice
const materiSlice = createSlice({
  name: 'materi',
  initialState: {
    list: [],
    detail: null,
    byKelas: {},
    byMataPelajaran: {},
    cascadeData: {},
    dropdownData: [],
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDetail: (state) => {
      state.detail = null;
    },
    clearByKelas: (state) => {
      state.byKelas = {};
    },
    clearByMataPelajaran: (state) => {
      state.byMataPelajaran = {};
    },
    clearCascadeData: (state) => {
      state.cascadeData = {};
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
      // Fetch list
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
      // Fetch detail
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
      .addCase(createMateri.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMateri.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.list) {
          state.list = [];
        }
        state.list.unshift(action.payload.data);
      })
      .addCase(createMateri.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
      // Fetch by kelas
      .addCase(fetchMateriByKelas.fulfilled, (state, action) => {
        const kelasData = action.payload.data;
        if (kelasData.kelas) {
          state.byKelas[kelasData.kelas.id_kelas] = kelasData.materi || [];
        }
      })
      // Fetch by mata pelajaran
      .addCase(fetchMateriByMataPelajaran.fulfilled, (state, action) => {
        const mpData = action.payload.data;
        if (mpData.mata_pelajaran) {
          state.byMataPelajaran[mpData.mata_pelajaran.id_mata_pelajaran] = mpData.materi || [];
        }
      })
      // Fetch cascade data
      .addCase(fetchMateriCascadeData.fulfilled, (state, action) => {
        state.cascadeData = { ...state.cascadeData, ...action.payload.data };
      })
      // Fetch for dropdown
      .addCase(fetchMateriForDropdown.fulfilled, (state, action) => {
        state.dropdownData = action.payload.data || [];
      });
  }
});

export const { 
  clearError, 
  clearDetail, 
  clearByKelas,
  clearByMataPelajaran,
  clearCascadeData,
  updateMateriLocally
} = materiSlice.actions;
export default materiSlice.reducer;

// Selectors
export const selectMateriList = (state) => state.materi.list;
export const selectMateriDetail = (state) => state.materi.detail;
export const selectMateriByKelas = (state) => state.materi.byKelas;
export const selectMateriByMataPelajaran = (state) => state.materi.byMataPelajaran;
export const selectMateriCascadeData = (state) => state.materi.cascadeData;
export const selectMateriDropdownData = (state) => state.materi.dropdownData;
export const selectMateriLoading = (state) => state.materi.loading;
export const selectMateriError = (state) => state.materi.error;
export const selectMateriPagination = (state) => state.materi.pagination;