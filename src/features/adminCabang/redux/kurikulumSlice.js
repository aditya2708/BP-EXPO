// 11. src/features/adminCabang/redux/kurikulumSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { kurikulumApi } from '../api/kurikulumApi';

// Async thunks
export const fetchKurikulumList = createAsyncThunk(
  'kurikulum/fetchList',
  async (params) => {
    const response = await kurikulumApi.getAllKurikulum(params);
    return response.data;
  }
);

export const fetchKurikulumDetail = createAsyncThunk(
  'kurikulum/fetchDetail',
  async (id) => {
    const response = await kurikulumApi.getKurikulumDetail(id);
    return response.data;
  }
);

export const fetchActiveKurikulum = createAsyncThunk(
  'kurikulum/fetchActive',
  async () => {
    const response = await kurikulumApi.getActive();
    return response.data;
  }
);

export const createKurikulum = createAsyncThunk(
  'kurikulum/create',
  async (kurikulumData) => {
    const response = await kurikulumApi.createKurikulum(kurikulumData);
    return response.data;
  }
);

export const updateKurikulum = createAsyncThunk(
  'kurikulum/update',
  async ({ id, kurikulumData }) => {
    const response = await kurikulumApi.updateKurikulum(id, kurikulumData);
    return response.data;
  }
);

export const deleteKurikulum = createAsyncThunk(
  'kurikulum/delete',
  async (id) => {
    await kurikulumApi.deleteKurikulum(id);
    return id;
  }
);

export const setActiveKurikulum = createAsyncThunk(
  'kurikulum/setActive',
  async (id) => {
    const response = await kurikulumApi.setActive(id);
    return response.data;
  }
);

export const fetchKurikulumStatistics = createAsyncThunk(
  'kurikulum/fetchStatistics',
  async (id) => {
    const response = await kurikulumApi.getStatistics(id);
    return response.data;
  }
);

export const fetchTahunBerlaku = createAsyncThunk(
  'kurikulum/fetchTahunBerlaku',
  async () => {
    const response = await kurikulumApi.getTahunBerlaku();
    return response.data;
  }
);

export const addMateri = createAsyncThunk(
  'kurikulum/addMateri',
  async ({ id, materiData }) => {
    const response = await kurikulumApi.addMateri(id, materiData);
    return response.data;
  }
);

export const removeMateri = createAsyncThunk(
  'kurikulum/removeMateri',
  async ({ id, materiId }) => {
    await kurikulumApi.removeMateri(id, materiId);
    return { id, materiId };
  }
);

// Slice
const kurikulumSlice = createSlice({
  name: 'kurikulum',
  initialState: {
    list: [],
    detail: null,
    activeKurikulum: null,
    statistics: null,
    tahunBerlaku: [],
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
    updateKurikulumLocally: (state, action) => {
      const index = state.list.findIndex(k => k.id_kurikulum === action.payload.id_kurikulum);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
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
      // Fetch detail
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
      // Fetch active
      .addCase(fetchActiveKurikulum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveKurikulum.fulfilled, (state, action) => {
        state.loading = false;
        state.activeKurikulum = action.payload.data;
      })
      .addCase(fetchActiveKurikulum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create
      .addCase(createKurikulum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createKurikulum.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.list) {
          state.list = [];
        }
        state.list.unshift(action.payload.data);
        // Update active kurikulum if the new one is set as active
        if (action.payload.data.status === 'aktif') {
          state.activeKurikulum = action.payload.data;
          // Deactivate others
          state.list = state.list.map(k => ({
            ...k,
            status: k.id_kurikulum === action.payload.data.id_kurikulum ? 'aktif' : (k.status === 'aktif' ? 'nonaktif' : k.status)
          }));
        }
      })
      .addCase(createKurikulum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
        // Update active kurikulum if changed
        if (action.payload.data.status === 'aktif') {
          state.activeKurikulum = action.payload.data;
          // Deactivate others
          state.list = state.list.map(k => ({
            ...k,
            status: k.id_kurikulum === action.payload.data.id_kurikulum ? 'aktif' : (k.status === 'aktif' ? 'nonaktif' : k.status)
          }));
        }
      })
      // Delete
      .addCase(deleteKurikulum.fulfilled, (state, action) => {
        state.list = state.list.filter(k => k.id_kurikulum !== action.payload);
        if (state.activeKurikulum?.id_kurikulum === action.payload) {
          state.activeKurikulum = null;
        }
      })
      // Set active
      .addCase(setActiveKurikulum.fulfilled, (state, action) => {
        state.activeKurikulum = action.payload.data;
        // Update list to reflect active status
        state.list = state.list.map(k => ({
          ...k,
          status: k.id_kurikulum === action.payload.data.id_kurikulum ? 'aktif' : (k.status === 'aktif' ? 'nonaktif' : k.status)
        }));
      })
      // Fetch statistics
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
      // Fetch tahun berlaku
      .addCase(fetchTahunBerlaku.fulfilled, (state, action) => {
        state.tahunBerlaku = action.payload.data || [];
      })
      // Add materi
      .addCase(addMateri.fulfilled, (state, action) => {
        if (state.detail) {
          state.detail.kurikulum_materi = state.detail.kurikulum_materi || [];
          state.detail.kurikulum_materi.push(action.payload.data);
        }
      })
      // Remove materi
      .addCase(removeMateri.fulfilled, (state, action) => {
        if (state.detail) {
          state.detail.kurikulum_materi = state.detail.kurikulum_materi?.filter(
            km => km.id !== action.payload.materiId
          ) || [];
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
export const selectActiveKurikulum = (state) => state.kurikulum.activeKurikulum;
export const selectKurikulumStatistics = (state) => state.kurikulum.statistics;
export const selectTahunBerlaku = (state) => state.kurikulum.tahunBerlaku;
export const selectKurikulumLoading = (state) => state.kurikulum.loading;
export const selectKurikulumError = (state) => state.kurikulum.error;
export const selectKurikulumPagination = (state) => state.kurikulum.pagination;