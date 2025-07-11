import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import kurikulumApi from '../../api/akademik/kurikulumApi';

// Async thunks - Assignment focused operations
export const fetchKurikulumList = createAsyncThunk(
  'kurikulum/fetchList',
  async (params = {}) => kurikulumApi.getList(params)
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
  async ({ kurikulumId, materiIds }) => kurikulumApi.assignMateri(kurikulumId, materiIds)
);

export const removeMateriFromKurikulum = createAsyncThunk(
  'kurikulum/removeMateri',
  async ({ kurikulumId, materiId }) => {
    await kurikulumApi.removeMateri(kurikulumId, materiId);
    return { kurikulumId, materiId };
  }
);

export const fetchKurikulumStatistics = createAsyncThunk(
  'kurikulum/fetchStatistics',
  async () => kurikulumApi.getStatistics()
);

export const fetchTahunBerlaku = createAsyncThunk(
  'kurikulum/fetchTahunBerlaku',
  async () => kurikulumApi.getTahunBerlaku()
);

export const fetchKurikulumForDropdown = createAsyncThunk(
  'kurikulum/fetchForDropdown',
  async (params = {}) => kurikulumApi.getForDropdown(params)
);

export const duplicateKurikulum = createAsyncThunk(
  'kurikulum/duplicate',
  async ({ id, data }) => kurikulumApi.duplicate(id, data)
);

export const toggleKurikulumStatus = createAsyncThunk(
  'kurikulum/toggleStatus',
  async (id) => kurikulumApi.toggleStatus(id)
);

const initialState = {
  list: [],
  detail: null,
  statistics: null,
  tahunBerlaku: [],
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
          per_page: responseData.per_page || 20,
          total: responseData.total || 0
        };
      })
      .addCase(fetchKurikulumList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
        if (!state.list) state.list = [];
        state.list.unshift(action.payload.data);
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
      })
      // Assign Materi
      .addCase(assignMateriToKurikulum.fulfilled, (state, action) => {
        if (state.detail) {
          state.detail.kurikulum_materi = action.payload.data.kurikulum_materi || [];
        }
      })
      // Remove Materi
      .addCase(removeMateriFromKurikulum.fulfilled, (state, action) => {
        if (state.detail && state.detail.kurikulum_materi) {
          state.detail.kurikulum_materi = state.detail.kurikulum_materi.filter(
            km => km.id_materi !== action.payload.materiId
          );
        }
      })
      // Statistics
      .addCase(fetchKurikulumStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKurikulumStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(fetchKurikulumStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Tahun Berlaku
      .addCase(fetchTahunBerlaku.fulfilled, (state, action) => {
        state.tahunBerlaku = action.payload.data || [];
      })
      // Dropdown
      .addCase(fetchKurikulumForDropdown.fulfilled, (state, action) => {
        state.dropdownData = action.payload.data || [];
      })
      // Duplicate
      .addCase(duplicateKurikulum.fulfilled, (state, action) => {
        if (!state.list) state.list = [];
        state.list.unshift(action.payload.data);
      })
      // Toggle Status
      .addCase(toggleKurikulumStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(k => k.id_kurikulum === action.payload.data.id_kurikulum);
        if (index !== -1) {
          state.list[index] = action.payload.data;
        }
        if (state.detail?.id_kurikulum === action.payload.data.id_kurikulum) {
          state.detail = action.payload.data;
        }
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
export const selectKurikulumList = (state) => state.kurikulum.list;
export const selectKurikulumDetail = (state) => state.kurikulum.detail;
export const selectKurikulumStatistics = (state) => state.kurikulum.statistics;
export const selectTahunBerlaku = (state) => state.kurikulum.tahunBerlaku;
export const selectKurikulumDropdownData = (state) => state.kurikulum.dropdownData;
export const selectKurikulumLoading = (state) => state.kurikulum.loading;
export const selectKurikulumError = (state) => state.kurikulum.error;
export const selectKurikulumPagination = (state) => state.kurikulum.pagination;