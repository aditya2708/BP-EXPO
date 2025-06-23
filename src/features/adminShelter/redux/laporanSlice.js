import { createSlice } from '@reduxjs/toolkit';
import {
  fetchLaporanAnakBinaan,
  fetchChildDetailReport,
  fetchJenisKegiatanOptions,
  fetchAvailableYears,
  initializeLaporanPage,
  updateFiltersAndRefresh
} from './laporanThunks';

const initialState = {
  // Main report data
  children: [],
  summary: null,
  filterOptions: {
    availableYears: [],
    availableActivityTypes: [],
    currentYear: new Date().getFullYear(),
    currentActivityType: null
  },
  months: {},
  
  // Child detail data
  childDetail: {
    child: null,
    attendanceRecords: [],
    filter: null
  },
  
  // Loading states
  loading: false,
  childDetailLoading: false,
  filterOptionsLoading: false,
  initializingPage: false,
  
  // Error states
  error: null,
  childDetailError: null,
  filterOptionsError: null,
  initializeError: null,
  
  // UI state
  filters: {
    year: new Date().getFullYear(),
    jenisKegiatan: null
  },
  expandedCards: [], // Track which cards are expanded
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
    resetFilters: (state) => {
      state.filters = {
        year: new Date().getFullYear(),
        jenisKegiatan: null
      };
    },
    
    // UI state actions
    toggleCardExpanded: (state, action) => {
      const childId = action.payload;
      const index = state.expandedCards.indexOf(childId);
      if (index > -1) {
        state.expandedCards.splice(index, 1);
      } else {
        state.expandedCards.push(childId);
      }
    },
    setCardExpanded: (state, action) => {
      const { childId, expanded } = action.payload;
      const index = state.expandedCards.indexOf(childId);
      if (expanded && index === -1) {
        state.expandedCards.push(childId);
      } else if (!expanded && index > -1) {
        state.expandedCards.splice(index, 1);
      }
    },
    expandAllCards: (state) => {
      state.expandedCards = state.children.map(child => child.id_anak);
    },
    collapseAllCards: (state) => {
      state.expandedCards = [];
    },
    
    // Clear data actions
    clearChildDetail: (state) => {
      state.childDetail = {
        child: null,
        attendanceRecords: [],
        filter: null
      };
      state.childDetailError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearChildDetailError: (state) => {
      state.childDetailError = null;
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
      
      // Fetch Laporan Anak Binaan
      .addCase(fetchLaporanAnakBinaan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaporanAnakBinaan.fulfilled, (state, action) => {
        state.loading = false;
        state.children = action.payload.children;
        state.summary = action.payload.summary;
        state.filterOptions = { ...state.filterOptions, ...action.payload.filter_options };
        state.months = action.payload.months;
        state.error = null;
      })
      .addCase(fetchLaporanAnakBinaan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Child Detail Report
      .addCase(fetchChildDetailReport.pending, (state) => {
        state.childDetailLoading = true;
        state.childDetailError = null;
      })
      .addCase(fetchChildDetailReport.fulfilled, (state, action) => {
        state.childDetailLoading = false;
        state.childDetail = action.payload;
        state.childDetailError = null;
      })
      .addCase(fetchChildDetailReport.rejected, (state, action) => {
        state.childDetailLoading = false;
        state.childDetailError = action.payload;
      })
      
      // Fetch Jenis Kegiatan Options
      .addCase(fetchJenisKegiatanOptions.pending, (state) => {
        state.filterOptionsLoading = true;
        state.filterOptionsError = null;
      })
      .addCase(fetchJenisKegiatanOptions.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptions.availableActivityTypes = action.payload;
        state.filterOptionsError = null;
      })
      .addCase(fetchJenisKegiatanOptions.rejected, (state, action) => {
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
  resetFilters,
  toggleCardExpanded,
  setCardExpanded,
  expandAllCards,
  collapseAllCards,
  clearChildDetail,
  clearError,
  clearChildDetailError,
  clearFilterOptionsError,
  clearInitializeError
} = laporanSlice.actions;

// Selectors
export const selectLaporanState = (state) => state.laporan;
export const selectChildren = (state) => state.laporan.children;
export const selectSummary = (state) => state.laporan.summary;
export const selectFilterOptions = (state) => state.laporan.filterOptions;
export const selectMonths = (state) => state.laporan.months;
export const selectFilters = (state) => state.laporan.filters;
export const selectExpandedCards = (state) => state.laporan.expandedCards;
export const selectChildDetail = (state) => state.laporan.childDetail;
export const selectLoading = (state) => state.laporan.loading;
export const selectChildDetailLoading = (state) => state.laporan.childDetailLoading;
export const selectFilterOptionsLoading = (state) => state.laporan.filterOptionsLoading;
export const selectInitializingPage = (state) => state.laporan.initializingPage;
export const selectError = (state) => state.laporan.error;
export const selectChildDetailError = (state) => state.laporan.childDetailError;
export const selectFilterOptionsError = (state) => state.laporan.filterOptionsError;
export const selectInitializeError = (state) => state.laporan.initializeError;

// Derived selectors
export const selectIsCardExpanded = (state, childId) => 
  state.laporan.expandedCards.includes(childId);

export const selectFilteredChildren = (state) => {
  // Return children as-is since filtering is done on backend
  return state.laporan.children;
};

export const selectCurrentFilters = (state) => ({
  year: state.laporan.filters.year,
  jenisKegiatan: state.laporan.filters.jenisKegiatan
});

export default laporanSlice.reducer;