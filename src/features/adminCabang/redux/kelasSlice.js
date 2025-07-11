import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { kelasApi } from '../api/kelasApi';

// Async thunks
export const fetchKelasList = createAsyncThunk(
  'kelas/fetchList',
  async (params) => {
    const response = await kelasApi.getAllKelas(params);
    return response.data;
  }
);

export const fetchKelasDetail = createAsyncThunk(
  'kelas/fetchDetail',
  async (id) => {
    const response = await kelasApi.getKelasDetail(id);
    return response.data;
  }
);

export const createKelas = createAsyncThunk(
  'kelas/create',
  async (kelasData) => {
    const response = await kelasApi.createKelas(kelasData);
    return response.data;
  }
);

export const updateKelas = createAsyncThunk(
  'kelas/update',
  async ({ id, kelasData }) => {
    const response = await kelasApi.updateKelas(id, kelasData);
    return response.data;
  }
);

export const deleteKelas = createAsyncThunk(
  'kelas/delete',
  async (id) => {
    await kelasApi.deleteKelas(id);
    return id;
  }
);

export const fetchKelasByJenjang = createAsyncThunk(
  'kelas/fetchByJenjang',
  async (jenjangId) => {
    const response = await kelasApi.getByJenjang(jenjangId);
    return response.data;
  }
);

export const fetchKelasForDropdown = createAsyncThunk(
  'kelas/fetchForDropdown',
  async (params) => {
    const response = await kelasApi.getForDropdown(params);
    return response.data;
  }
);

// Slice
const kelasSlice = createSlice({
  name: 'kelas',
  initialState: {
    list: [],
    detail: null,
    byJenjang: {},
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
    clearByJenjang: (state) => {
      state.byJenjang = {};
    },
    updateKelasLocally: (state, action) => {
      const index = state.list.findIndex(k => k.id_kelas === action.payload.id_kelas);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchKelasList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKelasList.fulfilled, (state, action) => {
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
      .addCase(fetchKelasList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch detail
      .addCase(fetchKelasDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKelasDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload.data;
      })
      .addCase(fetchKelasDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create
      .addCase(createKelas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createKelas.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.list) {
          state.list = [];
        }
        state.list.unshift(action.payload.data);
      })
      .addCase(createKelas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update
      .addCase(updateKelas.fulfilled, (state, action) => {
        const index = state.list.findIndex(k => k.id_kelas === action.payload.data.id_kelas);
        if (index !== -1) {
          state.list[index] = action.payload.data;
        }
        if (state.detail?.id_kelas === action.payload.data.id_kelas) {
          state.detail = action.payload.data;
        }
      })
      // Delete
      .addCase(deleteKelas.fulfilled, (state, action) => {
        state.list = state.list.filter(k => k.id_kelas !== action.payload);
        if (state.detail?.id_kelas === action.payload) {
          state.detail = null;
        }
      })
      // Fetch by jenjang
      .addCase(fetchKelasByJenjang.fulfilled, (state, action) => {
        const jenjangData = action.payload.data;
        if (jenjangData.jenjang) {
          state.byJenjang[jenjangData.jenjang.id_jenjang] = jenjangData.kelas || [];
        }
      })
      // Fetch for dropdown
      .addCase(fetchKelasForDropdown.fulfilled, (state, action) => {
        state.dropdownData = action.payload.data || [];
      });
  }
});

export const { 
  clearError, 
  clearDetail, 
  clearByJenjang,
  updateKelasLocally
} = kelasSlice.actions;
export default kelasSlice.reducer;

// Selectors
export const selectKelasList = (state) => state.kelas.list;
export const selectKelasDetail = (state) => state.kelas.detail;
export const selectKelasByJenjang = (state) => state.kelas.byJenjang;
export const selectKelasDropdownData = (state) => state.kelas.dropdownData;
export const selectKelasLoading = (state) => state.kelas.loading;
export const selectKelasError = (state) => state.kelas.error;
export const selectKelasPagination = (state) => state.kelas.pagination;