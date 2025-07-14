import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jenjangApi } from '../../api/masterData/jenjangApi';

const initialState = {
  items: [],
  currentItem: null,
  dropdownOptions: [],
  statistics: {},
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0
  },
  filters: {
    search: '',
    status: ''
  }
};

export const getAllJenjang = createAsyncThunk(
  'jenjang/getAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await jenjangApi.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getJenjangById = createAsyncThunk(
  'jenjang/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await jenjangApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createJenjang = createAsyncThunk(
  'jenjang/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await jenjangApi.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateJenjang = createAsyncThunk(
  'jenjang/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await jenjangApi.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteJenjang = createAsyncThunk(
  'jenjang/delete',
  async (id, { rejectWithValue }) => {
    try {
      await jenjangApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getJenjangForDropdown = createAsyncThunk(
  'jenjang/getForDropdown',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await jenjangApi.getForDropdown(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getJenjangStatistics = createAsyncThunk(
  'jenjang/getStatistics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await jenjangApi.getStatistics(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const jenjangSlice = createSlice({
  name: 'jenjang',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllJenjang.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllJenjang.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = {
          currentPage: action.payload.current_page,
          lastPage: action.payload.last_page,
          perPage: action.payload.per_page,
          total: action.payload.total
        };
      })
      .addCase(getAllJenjang.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Gagal mengambil data jenjang';
      })

      .addCase(getJenjangById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJenjangById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload.data;
      })
      .addCase(getJenjangById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Gagal mengambil detail jenjang';
      })

      .addCase(createJenjang.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJenjang.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload.data);
      })
      .addCase(createJenjang.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Gagal membuat jenjang';
      })

      .addCase(updateJenjang.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJenjang.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id_jenjang === action.payload.data.id_jenjang);
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        state.currentItem = action.payload.data;
      })
      .addCase(updateJenjang.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Gagal mengupdate jenjang';
      })

      .addCase(deleteJenjang.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJenjang.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id_jenjang !== action.payload);
      })
      .addCase(deleteJenjang.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Gagal menghapus jenjang';
      })

      .addCase(getJenjangForDropdown.fulfilled, (state, action) => {
        state.dropdownOptions = action.payload.data || action.payload;
      })

      .addCase(getJenjangStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      });
  }
});

export const { setFilters, resetFilters, clearCurrentItem, clearError } = jenjangSlice.actions;

export const selectJenjangItems = (state) => state.jenjang.items;
export const selectCurrentJenjang = (state) => state.jenjang.currentItem;
export const selectJenjangLoading = (state) => state.jenjang.loading;
export const selectJenjangError = (state) => state.jenjang.error;
export const selectJenjangPagination = (state) => state.jenjang.pagination;
export const selectJenjangFilters = (state) => state.jenjang.filters;
export const selectJenjangDropdownOptions = (state) => state.jenjang.dropdownOptions;
export const selectJenjangStatistics = (state) => state.jenjang.statistics;

export const selectJenjangById = (id) => (state) => {
  return state.jenjang.items.find(item => item.id_jenjang === id);
};

export const selectActiveJenjang = (state) => {
  return state.jenjang.items.filter(item => item.status === 'aktif');
};

export default jenjangSlice.reducer;