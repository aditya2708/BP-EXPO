import { createSlice } from '@reduxjs/toolkit';
import {
  fetchLaporanRaport,
  fetchChildDetailRaport,
  fetchSemesterOptions,
  fetchMataPelajaranOptions,
  fetchAvailableYears,
  initializeRaportLaporanPage,
  updateFiltersAndRefresh
} from './raportLaporanThunks';

const initialState = {
  // Main report data
  children: [],
  summary: null,
  filterOptions: {
    semesters: [],
    tahunAjaran: [],
    mataPelajaran: [],
    statusOptions: ['published', 'draft', 'archived'],
    currentSemester: null,
    currentTahunAjaran: new Date().getFullYear(),
    currentMataPelajaran: null,
    currentStatus: null
  },
  
  // Child detail data
  childDetail: {
    child: null,
    raportRecords: [],
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
    semester_id: null,
    tahun_ajaran: null,
    mata_pelajaran: null,
    status: null
  },
  expandedCards: [], // Track which cards are expanded
};

const raportLaporanSlice = createSlice({
  name: 'raportLaporan',
  initialState,
  reducers: {
    // Filter actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSemester: (state, action) => {
      state.filters.semester_id = action.payload;
    },
    setTahunAjaran: (state, action) => {
      state.filters.tahun_ajaran = action.payload;
    },
    setMataPelajaran: (state, action) => {
      state.filters.mata_pelajaran = action.payload;
    },
    setStatus: (state, action) => {
      state.filters.status = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        semester_id: null,
        tahun_ajaran: null,
        mata_pelajaran: null,
        status: null
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
        raportRecords: [],
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
      // Initialize Raport Laporan Page
      .addCase(initializeRaportLaporanPage.pending, (state) => {
        state.initializingPage = true;
        state.initializeError = null;
      })
      .addCase(initializeRaportLaporanPage.fulfilled, (state) => {
        state.initializingPage = false;
        state.initializeError = null;
      })
      .addCase(initializeRaportLaporanPage.rejected, (state, action) => {
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
      
      // Fetch Laporan Raport
      .addCase(fetchLaporanRaport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaporanRaport.fulfilled, (state, action) => {
        state.loading = false;
        state.children = action.payload.children;
        state.summary = action.payload.summary;
        state.filterOptions = { ...state.filterOptions, ...action.payload.filter_options };
        state.error = null;
      })
      .addCase(fetchLaporanRaport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Child Detail Raport
      .addCase(fetchChildDetailRaport.pending, (state) => {
        state.childDetailLoading = true;
        state.childDetailError = null;
      })
      .addCase(fetchChildDetailRaport.fulfilled, (state, action) => {
        state.childDetailLoading = false;
        state.childDetail = action.payload;
        state.childDetailError = null;
      })
      .addCase(fetchChildDetailRaport.rejected, (state, action) => {
        state.childDetailLoading = false;
        state.childDetailError = action.payload;
      })
      
      // Fetch Semester Options
      .addCase(fetchSemesterOptions.pending, (state) => {
        state.filterOptionsLoading = true;
        state.filterOptionsError = null;
      })
      .addCase(fetchSemesterOptions.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptions.semesters = action.payload;
        state.filterOptionsError = null;
      })
      .addCase(fetchSemesterOptions.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptionsError = action.payload;
      })
      
      // Fetch Mata Pelajaran Options
      .addCase(fetchMataPelajaranOptions.pending, (state) => {
        state.filterOptionsLoading = true;
        state.filterOptionsError = null;
      })
      .addCase(fetchMataPelajaranOptions.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptions.mataPelajaran = action.payload;
        state.filterOptionsError = null;
      })
      .addCase(fetchMataPelajaranOptions.rejected, (state, action) => {
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
        state.filterOptions.tahunAjaran = action.payload;
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
  setSemester,
  setTahunAjaran,
  setMataPelajaran,
  setStatus,
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
} = raportLaporanSlice.actions;

// Selectors
export const selectRaportLaporanState = (state) => state.raportLaporan;
export const selectChildren = (state) => state.raportLaporan.children;
export const selectSummary = (state) => state.raportLaporan.summary;
export const selectFilterOptions = (state) => state.raportLaporan.filterOptions;
export const selectFilters = (state) => state.raportLaporan.filters;
export const selectExpandedCards = (state) => state.raportLaporan.expandedCards;
export const selectChildDetail = (state) => state.raportLaporan.childDetail;
export const selectLoading = (state) => state.raportLaporan.loading;
export const selectChildDetailLoading = (state) => state.raportLaporan.childDetailLoading;
export const selectFilterOptionsLoading = (state) => state.raportLaporan.filterOptionsLoading;
export const selectInitializingPage = (state) => state.raportLaporan.initializingPage;
export const selectError = (state) => state.raportLaporan.error;
export const selectChildDetailError = (state) => state.raportLaporan.childDetailError;
export const selectFilterOptionsError = (state) => state.raportLaporan.filterOptionsError;
export const selectInitializeError = (state) => state.raportLaporan.initializeError;

// Derived selectors
export const selectIsCardExpanded = (state, childId) => 
  state.raportLaporan.expandedCards.includes(childId);

export const selectFilteredChildren = (state) => {
  // Return children as-is since filtering is done on backend
  return state.raportLaporan.children;
};

export const selectCurrentFilters = (state) => ({
  semester_id: state.raportLaporan.filters.semester_id,
  tahun_ajaran: state.raportLaporan.filters.tahun_ajaran,
  mata_pelajaran: state.raportLaporan.filters.mata_pelajaran,
  status: state.raportLaporan.filters.status
});

export default raportLaporanSlice.reducer;