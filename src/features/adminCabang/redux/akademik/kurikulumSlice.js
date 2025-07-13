// src/features/adminCabang/redux/akademik/kurikulumSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminCabangApi } from '../../api/adminCabangApi';

// Async Thunks
export const fetchKurikulumList = createAsyncThunk(
  'kurikulum/fetchList',
  async (params = {}) => {
    const response = await adminCabangApi.akademik.kurikulum.getAll(params);
    return response.data;
  }
);

export const fetchKurikulumById = createAsyncThunk(
  'kurikulum/fetchById',
  async (id) => {
    const response = await adminCabangApi.akademik.kurikulum.getDetail(id);
    return response.data;
  }
);

export const fetchKurikulumDropdown = createAsyncThunk(
  'kurikulum/fetchDropdown',
  async (params = {}) => {
    const response = await adminCabangApi.akademik.kurikulum.getAll(params);
    return response.data;
  }
);

export const createKurikulum = createAsyncThunk(
  'kurikulum/create',
  async (data) => {
    const response = await adminCabangApi.akademik.kurikulum.create(data);
    return response.data;
  }
);

export const updateKurikulum = createAsyncThunk(
  'kurikulum/update',
  async ({ id, data }) => {
    const response = await adminCabangApi.akademik.kurikulum.update(id, data);
    return response.data;
  }
);

export const deleteKurikulum = createAsyncThunk(
  'kurikulum/delete',
  async (id) => {
    await adminCabangApi.akademik.kurikulum.delete(id);
    return id;
  }
);

export const setActiveKurikulum = createAsyncThunk(
  'kurikulum/setActive',
  async (id) => {
    const response = await adminCabangApi.akademik.kurikulum.setActive(id);
    return response.data;
  }
);

export const assignMateri = createAsyncThunk(
  'kurikulum/assignMateri',
  async ({ kurikulumId, materiIds, orders = {} }) => {
    const response = await adminCabangApi.akademik.kurikulum.assignMateri(kurikulumId, materiIds, orders);
    return response.data;
  }
);

export const removeMateri = createAsyncThunk(
  'kurikulum/removeMateri',
  async ({ kurikulumId, materiId }) => {
    const response = await adminCabangApi.akademik.kurikulum.removeMateri(kurikulumId, materiId);
    return { kurikulumId, materiId, ...response.data };
  }
);

export const reorderMateri = createAsyncThunk(
  'kurikulum/reorderMateri',
  async ({ kurikulumId, materiOrders }) => {
    const response = await adminCabangApi.akademik.kurikulum.reorderMateri(kurikulumId, materiOrders);
    return response.data;
  }
);

export const fetchKurikulumStats = createAsyncThunk(
  'kurikulum/fetchStats',
  async () => {
    const response = await adminCabangApi.akademik.kurikulum.getStats();
    return response.data;
  }
);

// Initial State
const initialState = {
  list: [],
  currentKurikulum: null,
  dropdownData: [],
  statistics: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  },
  loading: false,
  error: null,
};

const kurikulumSlice = createSlice({
  name: 'kurikulum',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentKurikulum: (state) => {
      state.currentKurikulum = null;
    },
    clearStatistics: (state) => {
      state.statistics = null;
    },
    updateKurikulumLocally: (state, action) => {
      const index = state.list.findIndex(k => k.id_kurikulum === action.payload.id_kurikulum);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // List
      .addCase(fetchKurikulumList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKurikulumList.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload || {};
        state.list = responseData.data || [];
        state.pagination = {
          current_page: responseData.current_page || 1,
          last_page: responseData.last_page || 1,
          per_page: responseData.per_page || 15,
          total: responseData.total || 0
        };
      })
      .addCase(fetchKurikulumList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.list = [];
      })
      
      // Detail/ById
      .addCase(fetchKurikulumById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKurikulumById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentKurikulum = action.payload;
      })
      .addCase(fetchKurikulumById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.currentKurikulum = null;
      })
      
      // Dropdown
      .addCase(fetchKurikulumDropdown.fulfilled, (state, action) => {
        state.dropdownData = action.payload?.data || [];
      })
      
      // Create
      .addCase(createKurikulum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createKurikulum.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.list.unshift(action.payload);
          state.pagination.total += 1;
        }
      })
      .addCase(createKurikulum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Update
      .addCase(updateKurikulum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateKurikulum.fulfilled, (state, action) => {
        state.loading = false;
        const updatedData = action.payload;
        if (updatedData) {
          const index = state.list.findIndex(k => k.id_kurikulum === updatedData.id_kurikulum);
          if (index !== -1) {
            state.list[index] = updatedData;
          }
          if (state.currentKurikulum?.id_kurikulum === updatedData.id_kurikulum) {
            state.currentKurikulum = updatedData;
          }
        }
      })
      .addCase(updateKurikulum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Delete
      .addCase(deleteKurikulum.fulfilled, (state, action) => {
        state.list = state.list.filter(k => k.id_kurikulum !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.currentKurikulum?.id_kurikulum === action.payload) {
          state.currentKurikulum = null;
        }
      })
      
      // Assign Materi
      .addCase(assignMateri.fulfilled, (state, action) => {
        if (state.currentKurikulum && action.payload?.data) {
          state.currentKurikulum = { ...state.currentKurikulum, ...action.payload.data };
        }
      })
      
      // Remove Materi
      .addCase(removeMateri.fulfilled, (state, action) => {
        if (state.currentKurikulum?.materi) {
          state.currentKurikulum.materi = state.currentKurikulum.materi.filter(
            m => m.id !== action.payload.materiId
          );
          state.currentKurikulum.materi_count = Math.max(0, (state.currentKurikulum.materi_count || 0) - 1);
        }
      })
      
      // Set Active
      .addCase(setActiveKurikulum.fulfilled, (state, action) => {
        state.list.forEach(k => k.is_active = false);
        const activeData = action.payload?.data;
        if (activeData) {
          const index = state.list.findIndex(k => k.id_kurikulum === activeData.id_kurikulum);
          if (index !== -1) {
            state.list[index] = { ...state.list[index], is_active: true };
          }
          if (state.currentKurikulum?.id_kurikulum === activeData.id_kurikulum) {
            state.currentKurikulum = { ...state.currentKurikulum, is_active: true };
          }
        }
      })
      
      // Statistics
      .addCase(fetchKurikulumStats.fulfilled, (state, action) => {
        state.statistics = action.payload?.data;
      });
  }
});

export const { 
  clearError, 
  clearCurrentKurikulum, 
  clearStatistics,
  updateKurikulumLocally 
} = kurikulumSlice.actions;

export default kurikulumSlice.reducer;

// Selectors
export const selectKurikulumList = (state) => state.kurikulum?.list || [];
export const selectCurrentKurikulum = (state) => state.kurikulum?.currentKurikulum || null;
export const selectKurikulumStatistics = (state) => state.kurikulum?.statistics || null;
export const selectKurikulumDropdownData = (state) => state.kurikulum?.dropdownData || [];
export const selectKurikulumLoading = (state) => state.kurikulum?.loading || false;
export const selectKurikulumError = (state) => state.kurikulum?.error || null;
export const selectKurikulumPagination = (state) => state.kurikulum?.pagination || {};