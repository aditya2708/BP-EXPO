import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mataPelajaranApi } from '../api/mataPelajaranApi';

// Async thunks
export const fetchMataPelajaranList = createAsyncThunk(
  'mataPelajaran/fetchList',
  async (params) => {
    const response = await mataPelajaranApi.getAllMataPelajaran(params);
    return response.data;
  }
);

export const fetchMataPelajaranDetail = createAsyncThunk(
  'mataPelajaran/fetchDetail',
  async (id) => {
    const response = await mataPelajaranApi.getMataPelajaranDetail(id);
    return response.data;
  }
);

export const createMataPelajaran = createAsyncThunk(
  'mataPelajaran/create',
  async (mataPelajaranData) => {
    const response = await mataPelajaranApi.createMataPelajaran(mataPelajaranData);
    return response.data;
  }
);

export const updateMataPelajaran = createAsyncThunk(
  'mataPelajaran/update',
  async ({ id, mataPelajaranData }) => {
    const response = await mataPelajaranApi.updateMataPelajaran(id, mataPelajaranData);
    return response.data;
  }
);

export const deleteMataPelajaran = createAsyncThunk(
  'mataPelajaran/delete',
  async (id) => {
    await mataPelajaranApi.deleteMataPelajaran(id);
    return id;
  }
);

export const fetchMataPelajaranByJenjang = createAsyncThunk(
  'mataPelajaran/fetchByJenjang',
  async (jenjangId) => {
    const response = await mataPelajaranApi.getByJenjang(jenjangId);
    return response.data;
  }
);

export const fetchKategoriOptions = createAsyncThunk(
  'mataPelajaran/fetchKategoriOptions',
  async () => {
    const response = await mataPelajaranApi.getKategoriOptions();
    return response.data;
  }
);

export const fetchMataPelajaranStatistics = createAsyncThunk(
  'mataPelajaran/fetchStatistics',
  async () => {
    const response = await mataPelajaranApi.getStatistics();
    return response.data;
  }
);

export const fetchForDropdown = createAsyncThunk(
  'mataPelajaran/fetchForDropdown',
  async (params) => {
    const response = await mataPelajaranApi.getForDropdown(params);
    return response.data;
  }
);

// Slice
const mataPelajaranSlice = createSlice({
  name: 'mataPelajaran',
  initialState: {
    list: [],
    detail: null,
    byJenjang: {},
    kategoriOptions: [],
    dropdownData: {},
    statistics: null,
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
    clearStatistics: (state) => {
      state.statistics = null;
    },
    updateMataPelajaranLocally: (state, action) => {
      const index = state.list.findIndex(mp => mp.id_mata_pelajaran === action.payload.id_mata_pelajaran);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    clearByJenjang: (state) => {
      state.byJenjang = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchMataPelajaranList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMataPelajaranList.fulfilled, (state, action) => {
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
      .addCase(fetchMataPelajaranList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch detail
      .addCase(fetchMataPelajaranDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMataPelajaranDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload.data;
      })
      .addCase(fetchMataPelajaranDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create
      .addCase(createMataPelajaran.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMataPelajaran.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.list) {
          state.list = [];
        }
        state.list.unshift(action.payload.data);
      })
      .addCase(createMataPelajaran.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update
      .addCase(updateMataPelajaran.fulfilled, (state, action) => {
        const index = state.list.findIndex(mp => mp.id_mata_pelajaran === action.payload.data.id_mata_pelajaran);
        if (index !== -1) {
          state.list[index] = action.payload.data;
        }
        if (state.detail?.id_mata_pelajaran === action.payload.data.id_mata_pelajaran) {
          state.detail = action.payload.data;
        }
      })
      // Delete
      .addCase(deleteMataPelajaran.fulfilled, (state, action) => {
        state.list = state.list.filter(mp => mp.id_mata_pelajaran !== action.payload);
        if (state.detail?.id_mata_pelajaran === action.payload) {
          state.detail = null;
        }
      })
      // Fetch by jenjang
      .addCase(fetchMataPelajaranByJenjang.fulfilled, (state, action) => {
        const jenjangData = action.payload.data;
        if (jenjangData.jenjang) {
          state.byJenjang[jenjangData.jenjang.id_jenjang] = jenjangData.mata_pelajaran || [];
        }
      })
      // Fetch kategori options
      .addCase(fetchKategoriOptions.fulfilled, (state, action) => {
        state.kategoriOptions = action.payload.data || [];
      })
      // Fetch statistics
      .addCase(fetchMataPelajaranStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMataPelajaranStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(fetchMataPelajaranStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch for dropdown
      .addCase(fetchForDropdown.fulfilled, (state, action) => {
        state.dropdownData = action.payload.data || {};
      });
  }
});

export const { 
  clearError, 
  clearDetail, 
  clearStatistics,
  updateMataPelajaranLocally,
  clearByJenjang
} = mataPelajaranSlice.actions;
export default mataPelajaranSlice.reducer;

// Selectors
export const selectMataPelajaranList = (state) => state.mataPelajaran.list;
export const selectMataPelajaranDetail = (state) => state.mataPelajaran.detail;
export const selectMataPelajaranByJenjang = (state) => state.mataPelajaran.byJenjang;
export const selectKategoriOptions = (state) => state.mataPelajaran.kategoriOptions;
export const selectDropdownData = (state) => state.mataPelajaran.dropdownData;
export const selectMataPelajaranStatistics = (state) => state.mataPelajaran.statistics;
export const selectMataPelajaranLoading = (state) => state.mataPelajaran.loading;
export const selectMataPelajaranError = (state) => state.mataPelajaran.error;
export const selectMataPelajaranPagination = (state) => state.mataPelajaran.pagination;