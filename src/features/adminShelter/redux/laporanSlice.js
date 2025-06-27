import { createSlice } from '@reduxjs/toolkit';
import {
  fetchLaporanAnakBinaan,
  fetchFilterOptions,
  fetchAvailableYears,
  initializeLaporanPage,
  updateFiltersAndRefreshAll
} from './laporanThunks';

const initialState = {
  // Main report data
  summary: {
    total_children: 0,
    average_attendance: 0,
    total_activities: 0
  },
  children: [],
  pagination: null,
  
  // Filter options
  filterOptions: {
    availableYears: [],
    availableActivityTypes: []
  },
  
  // Loading states
  loading: false,
  filterOptionsLoading: false,
  initializingPage: false,
  refreshingAll: false,
  
  // Error states
  error: null,
  filterOptionsError: null,
  initializeError: null,
  refreshAllError: null,
  
  // UI state
  filters: {
    year: new Date().getFullYear(),
    jenisKegiatan: null,
    search: ''
  },
  expandedCards: []
};

const laporanSlice = createSlice({
  name: 'laporan',
  initialState,
  reducers: {
    // Filter actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setYear: (state, action) => {
      state.filters.year = action.payload;
    },
    setJenisKegiatan: (state, action) => {
      state.filters.jenisKegiatan = action.payload;
    },
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        year: new Date().getFullYear(),
        jenisKegiatan: null,
        search: ''
      };
    },
    
    // Card expand/collapse (kept for backward compatibility)
    toggleCardExpanded: (state, action) => {
      const childId = action.payload;
      const index = state.expandedCards.indexOf(childId);
      if (index > -1) {
        state.expandedCards.splice(index, 1);
      } else {
        state.expandedCards.push(childId);
      }
    },
    
    // Clear data actions
    clearError: (state) => {
      state.error = null;
    },
    clearFilterOptionsError: (state) => {
      state.filterOptionsError = null;
    },
    clearInitializeError: (state) => {
      state.initializeError = null;
    },
    clearRefreshAllError: (state) => {
      state.refreshAllError = null;
    },
    clearAllErrors: (state) => {
      state.error = null;
      state.filterOptionsError = null;
      state.initializeError = null;
      state.refreshAllError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Initialize Laporan Page
      .addCase(initializeLaporanPage.pending, (state) => {
        state.initializingPage = true;
        state.initializeError = null;
      })
      .addCase(initializeLaporanPage.fulfilled, (state) => {
        state.initializingPage = false;
        state.initializeError = null;
      })
      .addCase(initializeLaporanPage.rejected, (state, action) => {
        state.initializingPage = false;
        state.initializeError = action.payload;
      })
      
      // Combined Update Filters and Refresh All
      .addCase(updateFiltersAndRefreshAll.pending, (state) => {
        state.refreshingAll = true;
        state.refreshAllError = null;
        state.error = null;
      })
      .addCase(updateFiltersAndRefreshAll.fulfilled, (state, action) => {
        state.refreshingAll = false;
        state.refreshAllError = null;
        state.error = null;
        
        if (action.payload.data) {
          state.summary = action.payload.data.summary;
          state.children = action.payload.data.children;
          if (action.payload.data.pagination) {
            state.pagination = action.payload.data.pagination;
          }
        }
      })
      .addCase(updateFiltersAndRefreshAll.rejected, (state, action) => {
        state.refreshingAll = false;
        state.refreshAllError = action.payload;
      })
      
      // Fetch Laporan Anak Binaan
      .addCase(fetchLaporanAnakBinaan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaporanAnakBinaan.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
        state.children = action.payload.children;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        // Extract filter options from main response
        if (action.payload.filter_options) {
          state.filterOptions.availableYears = action.payload.filter_options.available_years;
          state.filterOptions.availableActivityTypes = action.payload.filter_options.available_activity_types;
        }
        state.error = null;
      })
      .addCase(fetchLaporanAnakBinaan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Filter Options
      .addCase(fetchFilterOptions.pending, (state) => {
        state.filterOptionsLoading = true;
        state.filterOptionsError = null;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptions = { ...state.filterOptions, ...action.payload };
        state.filterOptionsError = null;
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
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
  setJenisKegiatan,
  setSearch,
  resetFilters,
  toggleCardExpanded,
  clearError,
  clearFilterOptionsError,
  clearInitializeError,
  clearRefreshAllError,
  clearAllErrors
} = laporanSlice.actions;

// Selectors
export const selectChildren = (state) => state.laporan.children;
export const selectSummary = (state) => state.laporan.summary;
export const selectPagination = (state) => state.laporan.pagination;
export const selectFilterOptions = (state) => state.laporan.filterOptions;
export const selectFilters = (state) => state.laporan.filters;
export const selectExpandedCards = (state) => state.laporan.expandedCards;
export const selectLoading = (state) => state.laporan.loading;
export const selectFilterOptionsLoading = (state) => state.laporan.filterOptionsLoading;
export const selectInitializingPage = (state) => state.laporan.initializingPage;
export const selectRefreshingAll = (state) => state.laporan.refreshingAll;
export const selectError = (state) => state.laporan.error;
export const selectFilterOptionsError = (state) => state.laporan.filterOptionsError;
export const selectInitializeError = (state) => state.laporan.initializeError;
export const selectRefreshAllError = (state) => state.laporan.refreshAllError;

// Derived selectors
export const selectHasActiveFilters = (state) => {
  const { jenisKegiatan, search } = state.laporan.filters;
  return !!(jenisKegiatan || search);
};

export const selectCurrentFilters = (state) => ({
  year: state.laporan.filters.year,
  jenisKegiatan: state.laporan.filters.jenisKegiatan,
  search: state.laporan.filters.search
});

export default laporanSlice.reducer;