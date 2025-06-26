import { createSlice } from '@reduxjs/toolkit';
import {
  fetchLaporanHistori,
  fetchHistoriDetail,
  fetchJenisHistoriOptions,
  fetchAvailableYears,
  initializeHistoriLaporanPage,
  updateFiltersAndRefresh
} from './historiLaporanThunks';

const initialState = {
  // Main report data
  historiList: [],
  summary: null,
  filterOptions: {
    availableYears: [],
    availableJenisHistori: [],
    currentYear: new Date().getFullYear(),
    currentJenisHistori: null
  },
  
  // Detail data
  selectedHistori: null,
  
  // Loading states
  loading: false,
  detailLoading: false,
  filterOptionsLoading: false,
  initializingPage: false,
  
  // Error states
  error: null,
  detailError: null,
  filterOptionsError: null,
  initializeError: null,
  
  // UI state
  filters: {
    year: new Date().getFullYear(),
    jenisHistori: null,
    search: ''
  }
};

const historiLaporanSlice = createSlice({
  name: 'historiLaporan',
  initialState,
  reducers: {
    // Filter actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setYear: (state, action) => {
      state.filters.year = action.payload;
    },
    setJenisHistori: (state, action) => {
      state.filters.jenisHistori = action.payload;
    },
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        year: new Date().getFullYear(),
        jenisHistori: null,
        search: ''
      };
    },
    
    // Clear data actions
    clearSelectedHistori: (state) => {
      state.selectedHistori = null;
      state.detailError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearDetailError: (state) => {
      state.detailError = null;
    },
    clearFilterOptionsError: (state) => {
      state.filterOptionsError = null;
    },
    clearInitializeError: (state) => {
      state.initializeError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Initialize Histori Laporan Page
      .addCase(initializeHistoriLaporanPage.pending, (state) => {
        state.initializingPage = true;
        state.initializeError = null;
      })
      .addCase(initializeHistoriLaporanPage.fulfilled, (state) => {
        state.initializingPage = false;
        state.initializeError = null;
      })
      .addCase(initializeHistoriLaporanPage.rejected, (state, action) => {
        state.initializingPage = false;
        state.initializeError = action.payload;
      })
      
      // Update Filters and Refresh
      .addCase(updateFiltersAndRefresh.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFiltersAndRefresh.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateFiltersAndRefresh.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Laporan Histori
      .addCase(fetchLaporanHistori.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaporanHistori.fulfilled, (state, action) => {
        state.loading = false;
        state.historiList = action.payload.histori_list;
        state.summary = action.payload.summary;
        state.filterOptions = { ...state.filterOptions, ...action.payload.filter_options };
        state.error = null;
      })
      .addCase(fetchLaporanHistori.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Histori Detail
      .addCase(fetchHistoriDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchHistoriDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedHistori = action.payload;
        state.detailError = null;
      })
      .addCase(fetchHistoriDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })
      
      // Fetch Jenis Histori Options
      .addCase(fetchJenisHistoriOptions.pending, (state) => {
        state.filterOptionsLoading = true;
        state.filterOptionsError = null;
      })
      .addCase(fetchJenisHistoriOptions.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptions.availableJenisHistori = action.payload;
        state.filterOptionsError = null;
      })
      .addCase(fetchJenisHistoriOptions.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptionsError = action.payload;
      })
      
      // Fetch Available Years
      .addCase(fetchAvailableYears.pending, (state) => {
        state.filterOptionsLoading = true;
        state.filterOptionsError = null;
      })
      .addCase(fetchAvailableYears.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptions.availableYears = action.payload;
        state.filterOptionsError = null;
      })
      .addCase(fetchAvailableYears.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptionsError = action.payload;
      });
  }
});

// Action creators
export const {
  setFilters,
  setYear,
  setJenisHistori,
  setSearch,
  resetFilters,
  clearSelectedHistori,
  clearError,
  clearDetailError,
  clearFilterOptionsError,
  clearInitializeError
} = historiLaporanSlice.actions;

// Selectors
export const selectHistoriLaporanState = (state) => state.historiLaporan;
export const selectHistoriList = (state) => state.historiLaporan.historiList;
export const selectSummary = (state) => state.historiLaporan.summary;
export const selectFilterOptions = (state) => state.historiLaporan.filterOptions;
export const selectFilters = (state) => state.historiLaporan.filters;
export const selectSelectedHistori = (state) => state.historiLaporan.selectedHistori;
export const selectLoading = (state) => state.historiLaporan.loading;
export const selectDetailLoading = (state) => state.historiLaporan.detailLoading;
export const selectFilterOptionsLoading = (state) => state.historiLaporan.filterOptionsLoading;
export const selectInitializingPage = (state) => state.historiLaporan.initializingPage;
export const selectError = (state) => state.historiLaporan.error;
export const selectDetailError = (state) => state.historiLaporan.detailError;
export const selectFilterOptionsError = (state) => state.historiLaporan.filterOptionsError;
export const selectInitializeError = (state) => state.historiLaporan.initializeError;

// Derived selectors
export const selectFilteredHistoriList = (state) => {
  return state.historiLaporan.historiList;
};

export const selectCurrentFilters = (state) => ({
  year: state.historiLaporan.filters.year,
  jenisHistori: state.historiLaporan.filters.jenisHistori,
  search: state.historiLaporan.filters.search
});

export default historiLaporanSlice.reducer;