import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  fetchCpbReport,
  fetchCpbByStatus,
  fetchCpbFilterOptions,
  initializeCpbLaporanPage,
  updateCpbFiltersAndRefresh,
  exportCpbData
} from './cpbLaporanThunks';

const initialState = {
  // Main report data
  summary: {
    BCPB: 0,
    CPB: 0,
    NPB: 0,
    PB: 0,
    total: 0
  },
  children: [],
  currentStatus: null,
  
  // Filter options
  filterOptions: {
    jenisKelamin: [],
    kelas: [],
    statusOrangTua: []
  },
  
  // Export data
  exportData: null,
  
  // Loading states
  loading: false,
  childrenLoading: false,
  filterOptionsLoading: false,
  initializingPage: false,
  exportLoading: false,
  
  // Error states
  error: null,
  childrenError: null,
  filterOptionsError: null,
  initializeError: null,
  exportError: null,
  errorDetails: null, // Additional error details from backend
  
  // UI state
  filters: {
    jenisKelamin: null,
    kelas: null,
    statusOrangTua: null,
    search: ''
  },
  activeTab: 'BCPB', // Current active tab
};

const cpbLaporanSlice = createSlice({
  name: 'cpbLaporan',
  initialState,
  reducers: {
    // Filter actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setJenisKelamin: (state, action) => {
      state.filters.jenisKelamin = action.payload;
    },
    setKelas: (state, action) => {
      state.filters.kelas = action.payload;
    },
    setStatusOrangTua: (state, action) => {
      state.filters.statusOrangTua = action.payload;
    },
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        jenisKelamin: null,
        kelas: null,
        statusOrangTua: null,
        search: ''
      };
    },
    
    // Tab actions
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      state.currentStatus = action.payload;
    },
    
    // Clear data actions
    clearChildren: (state) => {
      state.children = [];
      state.currentStatus = null;
      state.childrenError = null;
    },
    clearExportData: (state) => {
      state.exportData = null;
      state.exportError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.errorDetails = null;
    },
    clearChildrenError: (state) => {
      state.childrenError = null;
    },
    clearFilterOptionsError: (state) => {
      state.filterOptionsError = null;
    },
    clearInitializeError: (state) => {
      state.initializeError = null;
    },
    clearExportError: (state) => {
      state.exportError = null;
    },
    clearAllErrors: (state) => {
      state.error = null;
      state.childrenError = null;
      state.filterOptionsError = null;
      state.initializeError = null;
      state.exportError = null;
      state.errorDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Initialize CPB Laporan Page
      .addCase(initializeCpbLaporanPage.pending, (state) => {
        state.initializingPage = true;
        state.initializeError = null;
      })
      .addCase(initializeCpbLaporanPage.fulfilled, (state) => {
        state.initializingPage = false;
        state.initializeError = null;
      })
      .addCase(initializeCpbLaporanPage.rejected, (state, action) => {
        state.initializingPage = false;
        state.initializeError = action.payload;
      })
      
      // Update Filters and Refresh
      .addCase(updateCpbFiltersAndRefresh.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCpbFiltersAndRefresh.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCpbFiltersAndRefresh.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch CPB Report
      .addCase(fetchCpbReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCpbReport.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
        state.filterOptions = { ...state.filterOptions, ...action.payload.filter_options };
        state.error = null;
      })
      .addCase(fetchCpbReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch CPB By Status
      .addCase(fetchCpbByStatus.pending, (state) => {
        state.childrenLoading = true;
        state.childrenError = null;
      })
      .addCase(fetchCpbByStatus.fulfilled, (state, action) => {
        state.childrenLoading = false;
        state.children = action.payload.children;
        state.currentStatus = action.payload.status;
        state.childrenError = null;
      })
      .addCase(fetchCpbByStatus.rejected, (state, action) => {
        state.childrenLoading = false;
        state.childrenError = action.payload;
      })
      
      // Fetch CPB Filter Options
      .addCase(fetchCpbFilterOptions.pending, (state) => {
        state.filterOptionsLoading = true;
        state.filterOptionsError = null;
      })
      .addCase(fetchCpbFilterOptions.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptions = action.payload;
        state.filterOptionsError = null;
      })
      .addCase(fetchCpbFilterOptions.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptionsError = action.payload;
      })
      
      // Export CPB Data
      .addCase(exportCpbData.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportCpbData.fulfilled, (state, action) => {
        state.exportLoading = false;
        state.exportData = action.payload;
        state.exportError = null;
      })
      .addCase(exportCpbData.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload;
      });
  }
});

// Action creators
export const {
  setFilters,
  setJenisKelamin,
  setKelas,
  setStatusOrangTua,
  setSearch,
  resetFilters,
  setActiveTab,
  clearChildren,
  clearExportData,
  clearError,
  clearChildrenError,
  clearFilterOptionsError,
  clearInitializeError,
  clearExportError,
  clearAllErrors
} = cpbLaporanSlice.actions;

// Selectors
export const selectCpbLaporanState = (state) => state.cpbLaporan;
export const selectCpbSummary = (state) => state.cpbLaporan.summary;
export const selectCpbChildren = (state) => state.cpbLaporan.children;
export const selectCpbCurrentStatus = (state) => state.cpbLaporan.currentStatus;
export const selectCpbFilterOptions = (state) => state.cpbLaporan.filterOptions;
export const selectCpbFilters = (state) => state.cpbLaporan.filters;
export const selectCpbActiveTab = (state) => state.cpbLaporan.activeTab;
export const selectCpbExportData = (state) => state.cpbLaporan.exportData;
export const selectCpbLoading = (state) => state.cpbLaporan.loading;
export const selectCpbChildrenLoading = (state) => state.cpbLaporan.childrenLoading;
export const selectCpbFilterOptionsLoading = (state) => state.cpbLaporan.filterOptionsLoading;
export const selectCpbInitializingPage = (state) => state.cpbLaporan.initializingPage;
export const selectCpbExportLoading = (state) => state.cpbLaporan.exportLoading;
export const selectCpbError = (state) => state.cpbLaporan.error;
export const selectCpbChildrenError = (state) => state.cpbLaporan.childrenError;
export const selectCpbFilterOptionsError = (state) => state.cpbLaporan.filterOptionsError;
export const selectCpbInitializeError = (state) => state.cpbLaporan.initializeError;
export const selectCpbExportError = (state) => state.cpbLaporan.exportError;
export const selectCpbErrorDetails = (state) => state.cpbLaporan.errorDetails;

// Derived selectors
export const selectCpbHasActiveFilters = (state) => {
  const { jenisKelamin, kelas, statusOrangTua, search } = state.cpbLaporan.filters;
  return !!(jenisKelamin || kelas || statusOrangTua || search);
};

export const selectCpbCurrentFilters = (state) => ({
  jenisKelamin: state.cpbLaporan.filters.jenisKelamin,
  kelas: state.cpbLaporan.filters.kelas,
  statusOrangTua: state.cpbLaporan.filters.statusOrangTua,
  search: state.cpbLaporan.filters.search
});

export const selectCpbTabCounts = createSelector(
  [(state) => state.cpbLaporan.summary],
  (summary) => ({
    BCPB: summary.BCPB || 0,
    CPB: summary.CPB || 0,
    NPB: summary.NPB || 0,
    PB: summary.PB || 0
  })
);

export default cpbLaporanSlice.reducer;