import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jenjangApi from '../../api/masterData/jenjangApi';

// Async Thunks
export const fetchJenjangList = createAsyncThunk(
  'jenjang/fetchList',
  async ({ search = '', page = 1, per_page = 20 } = {}) => 
    jenjangApi.getAll({ search, page, per_page })
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

export const fetchJenjangStats = createAsyncThunk(
  'jenjang/fetchStats',
  async () => jenjangApi.getStatistics()
);

export const fetchJenjangForDropdown = createAsyncThunk(
  'jenjang/fetchDropdown',
  async () => jenjangApi.getForDropdown()
);

// Initial State
const initialState = {
  list: [],
  detail: null,
  statistics: null,
  dropdownData: [],
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  },
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
    clearStatistics: (state) => {
      state.statistics = null;
    },
    updateJenjangLocally: (state, action) => {
      const index = state.list.findIndex(j => j.id_jenjang === action.payload.id_jenjang);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
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
        const responseData = action.payload.data || {};
        state.list = responseData.data || [];
        state.pagination = {
          current_page: responseData.current_page || 1,
          last_page: responseData.last_page || 1,
          per_page: responseData.per_page || 20,
          total: responseData.total || 0
        };
      })
      .addCase(fetchJenjangList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.list = [];
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
        if (!Array.isArray(state.list)) state.list = [];
        state.list.unshift(action.payload.data);
        state.pagination.total += 1;
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
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      
      // Statistics
      .addCase(fetchJenjangStats.fulfilled, (state, action) => {
        state.statistics = action.payload.data;
      })
      
      // Dropdown
      .addCase(fetchJenjangForDropdown.fulfilled, (state, action) => {
        state.dropdownData = action.payload.data || [];
      });
  }
});

export const { 
  clearError, 
  clearDetail, 
  clearStatistics,
  updateJenjangLocally 
} = jenjangSlice.actions;

export default jenjangSlice.reducer;

// Selectors
export const selectJenjangList = (state) => state.jenjang?.list || [];
export const selectJenjangDetail = (state) => state.jenjang?.detail || null;
export const selectJenjangStatistics = (state) => state.jenjang?.statistics || null;
export const selectJenjangDropdownData = (state) => state.jenjang?.dropdownData || [];
export const selectJenjangLoading = (state) => state.jenjang?.loading || false;
export const selectJenjangError = (state) => state.jenjang?.error || null;
export const selectJenjangPagination = (state) => state.jenjang?.pagination || {};