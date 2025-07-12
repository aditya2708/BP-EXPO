import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import kelasApi from '../../api/masterData/kelasApi';

// Async thunks
export const fetchKelasList = createAsyncThunk(
  'kelas/fetchList',
  async (params = {}) => kelasApi.getList(params)
);

export const fetchKelasDetail = createAsyncThunk(
  'kelas/fetchDetail',
  async (id) => kelasApi.getDetail(id)
);

export const createKelas = createAsyncThunk(
  'kelas/create',
  async (data) => kelasApi.create(data)
);

export const updateKelas = createAsyncThunk(
  'kelas/update',
  async ({ id, data }) => kelasApi.update(id, data)
);

export const deleteKelas = createAsyncThunk(
  'kelas/delete',
  async (id) => {
    await kelasApi.delete(id);
    return id;
  }
);

export const fetchKelasByJenjang = createAsyncThunk(
  'kelas/fetchByJenjang',
  async (jenjangId) => kelasApi.getByJenjang(jenjangId)
);

export const fetchKelasForDropdown = createAsyncThunk(
  'kelas/fetchForDropdown',
  async (jenjangId) => kelasApi.getForDropdown(jenjangId)
);

export const fetchKelasStatistics = createAsyncThunk(
  'kelas/fetchStatistics',
  async () => kelasApi.getStatistics()
);

const initialState = {
  list: [],
  detail: null,
  byJenjang: {},
  dropdownData: {},
  statistics: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  },
  loading: false,
  error: null,
};

const kelasSlice = createSlice({
  name: 'kelas',
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
      // List
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
      // Detail
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
      .addCase(createKelas.fulfilled, (state, action) => {
        if (!state.list) state.list = [];
        state.list.unshift(action.payload.data);
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
      // By Jenjang
      .addCase(fetchKelasByJenjang.fulfilled, (state, action) => {
        const jenjangData = action.payload.data;
        if (jenjangData?.jenjang) {
          state.byJenjang[jenjangData.jenjang.id_jenjang] = jenjangData.kelas_standard || [];
        }
      })
      // Dropdown
      .addCase(fetchKelasForDropdown.fulfilled, (state, action) => {
        state.dropdownData = action.payload.data || {};
      })
      // Statistics
      .addCase(fetchKelasStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKelasStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(fetchKelasStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { 
  clearError, 
  clearDetail, 
  clearStatistics,
  clearByJenjang,
  updateKelasLocally
} = kelasSlice.actions;

export default kelasSlice.reducer;

// Selectors
export const selectKelasList = (state) => state.kelas.list;
export const selectKelasDetail = (state) => state.kelas.detail;
export const selectKelasByJenjang = (state) => state.kelas.byJenjang;
export const selectKelasDropdownData = (state) => state.kelas.dropdownData;
export const selectKelasStatistics = (state) => state.kelas.statistics;
export const selectKelasLoading = (state) => state.kelas.loading;
export const selectKelasError = (state) => state.kelas.error;
export const selectKelasPagination = (state) => state.kelas.pagination;