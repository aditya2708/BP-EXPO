import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { kurikulumApi } from '../../api/akademik/kurikulumApi'; 

// Async Thunks - Aligned with AkademikKurikulumController
export const fetchKurikulumList = createAsyncThunk(
  'kurikulum/fetchList',
  async ({ search = '', is_active = null, tahun_berlaku = null, page = 1, per_page = 15 } = {}) => 
    kurikulumApi.getAll({ search, is_active, tahun_berlaku, page, per_page })
);

export const fetchKurikulumDetail = createAsyncThunk(
  'kurikulum/fetchDetail',
  async (id) => kurikulumApi.getDetail(id)
);

export const createKurikulum = createAsyncThunk(
  'kurikulum/create',
  async (data) => kurikulumApi.create(data)
);

export const updateKurikulum = createAsyncThunk(
  'kurikulum/update',
  async ({ id, data }) => kurikulumApi.update(id, data)
);

export const deleteKurikulum = createAsyncThunk(
  'kurikulum/delete',
  async (id) => {
    await kurikulumApi.delete(id);
    return id;
  }
);

export const assignMateriToKurikulum = createAsyncThunk(
  'kurikulum/assignMateri',
  async ({ id, materi_ids }) => kurikulumApi.assignMateri(id, { materi_ids })
);

export const removeMateriFromKurikulum = createAsyncThunk(
  'kurikulum/removeMateri',
  async ({ id, materi_id }) => {
    await kurikulumApi.removeMateri(id, materi_id);
    return { id, materi_id };
  }
);

export const setActiveKurikulum = createAsyncThunk(
  'kurikulum/setActive',
  async (id) => kurikulumApi.setActive(id)
);

export const fetchKurikulumStats = createAsyncThunk(
  'kurikulum/fetchStats',
  async (id) => kurikulumApi.getStatistics(id)
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
        state.error = action.error.message;
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
        state.error = action.error.message;
      })
      
      // Create
      .addCase(createKurikulum.fulfilled, (state, action) => {
        if (!Array.isArray(state.list)) state.list = [];
        state.list.unshift(action.payload.data);
        state.pagination.total += 1;
      })
      
      // Update
      .addCase(updateKurikulum.fulfilled, (state, action) => {
        const index = state.list.findIndex(k => k.id_kurikulum === action.payload.data.id_kurikulum);
        if (index !== -1) {
          state.list[index] = action.payload.data;
        }
        if (state.detail?.id_kurikulum === action.payload.data.id_kurikulum) {
          state.detail = action.payload.data;
        }
      })
      
      // Delete
      .addCase(deleteKurikulum.fulfilled, (state, action) => {
        state.list = state.list.filter(k => k.id_kurikulum !== action.payload);
        if (state.detail?.id_kurikulum === action.payload) {
          state.detail = null;
        }
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      
      // Assign Materi
      .addCase(assignMateriToKurikulum.fulfilled, (state, action) => {
        if (state.detail) {
          state.detail.kurikulum_materi = action.payload.data.kurikulum_materi || [];
          state.detail.kurikulum_materi_count = action.payload.data.kurikulum_materi_count || 0;
        }
      })
      
      // Remove Materi
      .addCase(removeMateriFromKurikulum.fulfilled, (state, action) => {
        if (state.detail && state.detail.kurikulum_materi) {
          state.detail.kurikulum_materi = state.detail.kurikulum_materi.filter(
            km => km.id_materi !== action.payload.materi_id
          );
          state.detail.kurikulum_materi_count = Math.max(0, (state.detail.kurikulum_materi_count || 0) - 1);
        }
      })
      
      // Set Active
      .addCase(setActiveKurikulum.fulfilled, (state, action) => {
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
      
      // Statistics
      .addCase(fetchKurikulumStats.fulfilled, (state, action) => {
        state.statistics = action.payload.data;
      });
  }
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