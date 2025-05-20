import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aktivitasApi } from '../api/aktivitasApi';
import { adminShelterKelompokApi } from '../api/adminShelterKelompokApi';

// Initial state
const initialState = {
  aktivitasList: [],
  aktivitasDetail: null,
  loading: false,
  error: null,
  kelompokDetail: null, // Added to store associated kelompok details
  kelompokLoading: false,
  kelompokError: null,
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
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await aktivitasApi.getAktivitasDetail(id);
      
      // If this is a Bimbel activity and has a nama_kelompok, fetch the kelompok details
      const aktivitasData = response.data.data;
      if (aktivitasData.jenis_kegiatan === 'Bimbel' && aktivitasData.nama_kelompok) {
        // Try to find kelompok by name
        dispatch(fetchKelompokByName(aktivitasData.nama_kelompok));
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activity details');
    }
  }
);

// New thunk for fetching kelompok by name
export const fetchKelompokByName = createAsyncThunk(
  'aktivitas/fetchKelompokByName',
  async (kelompokName, { rejectWithValue }) => {
    try {
      // First get all kelompok
      const response = await adminShelterKelompokApi.getAllKelompok();
      const kelompokList = response.data.data || [];
      
      // Find the matching kelompok by name
      const matchingKelompok = kelompokList.find(
        kelompok => kelompok.nama_kelompok === kelompokName
      );
      
      if (matchingKelompok) {
        // If found, get details for this kelompok
        const detailResponse = await adminShelterKelompokApi.getKelompokDetail(matchingKelompok.id_kelompok);
        return detailResponse.data;
      } else {
        return rejectWithValue('Kelompok not found with name: ' + kelompokName);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch kelompok details');
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
      state.kelompokDetail = null;
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
        
        // Ensure we have a selectedKelompokId field if this is a Bimbel activity
        if (
          state.aktivitasDetail && 
          state.aktivitasDetail.jenis_kegiatan === 'Bimbel' && 
          state.kelompokDetail &&
          state.kelompokDetail.data
        ) {
          state.aktivitasDetail.selectedKelompokId = state.kelompokDetail.data.id_kelompok;
        }
      })
      .addCase(fetchAktivitasDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch activity details';
      })
      
      // fetchKelompokByName
      .addCase(fetchKelompokByName.pending, (state) => {
        state.kelompokLoading = true;
        state.kelompokError = null;
      })
      .addCase(fetchKelompokByName.fulfilled, (state, action) => {
        state.kelompokLoading = false;
        state.kelompokDetail = action.payload;
        
        // If we have both kelompok and aktivitas details, update the aktivitasDetail
        if (state.aktivitasDetail && action.payload.data) {
          state.aktivitasDetail.selectedKelompokId = action.payload.data.id_kelompok;
        }
      })
      .addCase(fetchKelompokByName.rejected, (state, action) => {
        state.kelompokLoading = false;
        state.kelompokError = action.payload || 'Failed to fetch kelompok details';
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
          state.kelompokDetail = null;
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
export const selectKelompokDetail = (state) => state.aktivitas.kelompokDetail?.data;
export const selectKelompokLoading = (state) => state.aktivitas.kelompokLoading;

export default aktivitasSlice.reducer;