// src/features/adminCabang/redux/akademik/kurikulumSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminCabangApi } from '../../api/adminCabangApi';

// Async Thunks - Aligned with AkademikKurikulumController
export const fetchKurikulumList = createAsyncThunk(
  'kurikulum/fetchList',
  async ({ search = '', is_active = null, tahun_berlaku = null, page = 1, per_page = 15 } = {}, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.akademik.kurikulum.getAll({ 
        search, 
        is_active, 
        tahun_berlaku, 
        page, 
        per_page 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchKurikulumDetail = createAsyncThunk(
  'kurikulum/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.akademik.kurikulum.getDetail(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createKurikulum = createAsyncThunk(
  'kurikulum/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.akademik.kurikulum.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateKurikulum = createAsyncThunk(
  'kurikulum/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.akademik.kurikulum.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteKurikulum = createAsyncThunk(
  'kurikulum/delete',
  async (id, { rejectWithValue }) => {
    try {
      await adminCabangApi.akademik.kurikulum.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const assignMateriToKurikulum = createAsyncThunk(
  'kurikulum/assignMateri',
  async ({ id, materi_ids }, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.akademik.kurikulum.assignMateri(id, { materi_ids });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeMateriFromKurikulum = createAsyncThunk(
  'kurikulum/removeMateri',
  async ({ id, materi_id }, { rejectWithValue }) => {
    try {
      await adminCabangApi.akademik.kurikulum.removeMateri(id, materi_id);
      return { id, materi_id };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const setActiveKurikulum = createAsyncThunk(
  'kurikulum/setActive',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.akademik.kurikulum.setActive(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchKurikulumStats = createAsyncThunk(
  'kurikulum/fetchStats',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminCabangApi.akademik.kurikulum.getStatistics(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
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
    clearDetail: (state) => {
      state.detail = null;
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
        const responseData = action.payload.data || {};
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
        state.error = action.payload?.message || action.error.message;
        state.list = [];
      })
      
      // Detail
      .addCase(fetchKurikulumDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKurikulumDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload.data;
      })
      .addCase(fetchKurikulumDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Create
      .addCase(createKurikulum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createKurikulum.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.list)) state.list = [];
        state.list.unshift(action.payload.data);
        state.pagination.total += 1;
      })
      .addCase(createKurikulum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Update
      .addCase(updateKurikulum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateKurikulum.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(k => k.id_kurikulum === action.payload.data.id_kurikulum);
        if (index !== -1) {
          state.list[index] = action.payload.data;
        }
        if (state.detail?.id_kurikulum === action.payload.data.id_kurikulum) {
          state.detail = action.payload.data;
        }
      })
      .addCase(updateKurikulum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Delete
      .addCase(deleteKurikulum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteKurikulum.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(k => k.id_kurikulum !== action.payload);
        if (state.detail?.id_kurikulum === action.payload) {
          state.detail = null;
        }
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteKurikulum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Assign Materi
      .addCase(assignMateriToKurikulum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignMateriToKurikulum.fulfilled, (state, action) => {
        state.loading = false;
        if (state.detail) {
          state.detail.kurikulum_materi = action.payload.data.kurikulum_materi || [];
          state.detail.kurikulum_materi_count = action.payload.data.kurikulum_materi_count || 0;
        }
      })
      .addCase(assignMateriToKurikulum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Remove Materi
      .addCase(removeMateriFromKurikulum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMateriFromKurikulum.fulfilled, (state, action) => {
        state.loading = false;
        if (state.detail && state.detail.kurikulum_materi) {
          state.detail.kurikulum_materi = state.detail.kurikulum_materi.filter(
            km => km.id_materi !== action.payload.materi_id
          );
          state.detail.kurikulum_materi_count = Math.max(0, (state.detail.kurikulum_materi_count || 0) - 1);
        }
      })
      .addCase(removeMateriFromKurikulum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Set Active
      .addCase(setActiveKurikulum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setActiveKurikulum.fulfilled, (state, action) => {
        state.loading = false;
        // Set all other kurikulum to inactive
        state.list.forEach(k => k.is_active = false);
        // Set selected kurikulum to active
        const index = state.list.findIndex(k => k.id_kurikulum === action.payload.data.id_kurikulum);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], is_active: true };
        }
        if (state.detail?.id_kurikulum === action.payload.data.id_kurikulum) {
          state.detail = { ...state.detail, is_active: true };
        }
      })
      .addCase(setActiveKurikulum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Statistics
      .addCase(fetchKurikulumStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKurikulumStats.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(fetchKurikulumStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { 
  clearError, 
  clearDetail, 
  clearStatistics,
  updateKurikulumLocally 
} = kurikulumSlice.actions;

export default kurikulumSlice.reducer;

// Selectors
export const selectKurikulumList = (state) => state.kurikulum?.list || [];
export const selectKurikulumDetail = (state) => state.kurikulum?.detail || null;
export const selectKurikulumStatistics = (state) => state.kurikulum?.statistics || null;
export const selectKurikulumDropdownData = (state) => state.kurikulum?.dropdownData || [];
export const selectKurikulumLoading = (state) => state.kurikulum?.loading || false;
export const selectKurikulumError = (state) => state.kurikulum?.error || null;
export const selectKurikulumPagination = (state) => state.kurikulum?.pagination || {};