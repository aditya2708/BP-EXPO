import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aktivitasApi } from '../api/aktivitasApi';

// Initial state
const initialState = {
  aktivitasList: [],
  aktivitasDetail: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    currentPage: 1,
    lastPage: 1
  }
};

// Async thunks
export const fetchAllAktivitas = createAsyncThunk(
  'aktivitas/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await aktivitasApi.getAllAktivitas(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activities');
    }
  }
);

export const fetchAktivitasDetail = createAsyncThunk(
  'aktivitas/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await aktivitasApi.getAktivitasDetail(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activity details');
    }
  }
);

export const createAktivitas = createAsyncThunk(
  'aktivitas/create',
  async (aktivitasData, { rejectWithValue }) => {
    try {
      const response = await aktivitasApi.createAktivitas(aktivitasData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create activity');
    }
  }
);

export const updateAktivitas = createAsyncThunk(
  'aktivitas/update',
  async ({ id, aktivitasData }, { rejectWithValue }) => {
    try {
      const response = await aktivitasApi.updateAktivitas(id, aktivitasData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update activity');
    }
  }
);

export const deleteAktivitas = createAsyncThunk(
  'aktivitas/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await aktivitasApi.deleteAktivitas(id);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete activity');
    }
  }
);

// Slice
const aktivitasSlice = createSlice({
  name: 'aktivitas',
  initialState,
  reducers: {
    resetAktivitasDetail: (state) => {
      state.aktivitasDetail = null;
    },
    resetAktivitasError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchAllAktivitas
      .addCase(fetchAllAktivitas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAktivitas.fulfilled, (state, action) => {
        state.loading = false;
        state.aktivitasList = action.payload.data;
        if (action.payload.meta) {
          state.pagination = {
            total: action.payload.meta.total || 0,
            currentPage: action.payload.meta.current_page || 1,
            lastPage: action.payload.meta.last_page || 1
          };
        }
      })
      .addCase(fetchAllAktivitas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch activities';
      })
      
      // fetchAktivitasDetail
      .addCase(fetchAktivitasDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAktivitasDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.aktivitasDetail = action.payload.data;
      })
      .addCase(fetchAktivitasDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch activity details';
      })
      
      // createAktivitas
      .addCase(createAktivitas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAktivitas.fulfilled, (state, action) => {
        state.loading = false;
        state.aktivitasList = [action.payload.data, ...state.aktivitasList];
        state.pagination.total += 1;
      })
      .addCase(createAktivitas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create activity';
      })
      
      // updateAktivitas
      .addCase(updateAktivitas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAktivitas.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAktivitas = action.payload.data;
        
        // Update in list if present
        state.aktivitasList = state.aktivitasList.map(item => 
          item.id_aktivitas === updatedAktivitas.id_aktivitas ? updatedAktivitas : item
        );
        
        // Update detail view if it's the same activity
        if (state.aktivitasDetail && state.aktivitasDetail.id_aktivitas === updatedAktivitas.id_aktivitas) {
          state.aktivitasDetail = updatedAktivitas;
        }
      })
      .addCase(updateAktivitas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update activity';
      })
      
      // deleteAktivitas
      .addCase(deleteAktivitas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAktivitas.fulfilled, (state, action) => {
        state.loading = false;
        state.aktivitasList = state.aktivitasList.filter(
          item => item.id_aktivitas !== action.payload.id
        );
        state.pagination.total -= 1;
        
        // Clear detail if it's the deleted activity
        if (state.aktivitasDetail && state.aktivitasDetail.id_aktivitas === action.payload.id) {
          state.aktivitasDetail = null;
        }
      })
      .addCase(deleteAktivitas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete activity';
      });
  }
});

// Actions
export const { resetAktivitasDetail, resetAktivitasError } = aktivitasSlice.actions;

// Selectors
export const selectAktivitasList = (state) => state.aktivitas.aktivitasList;
export const selectAktivitasDetail = (state) => state.aktivitas.aktivitasDetail;
export const selectAktivitasLoading = (state) => state.aktivitas.loading;
export const selectAktivitasError = (state) => state.aktivitas.error;
export const selectAktivitasPagination = (state) => state.aktivitas.pagination;

export default aktivitasSlice.reducer;