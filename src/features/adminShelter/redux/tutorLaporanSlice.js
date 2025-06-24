import { createSlice } from '@reduxjs/toolkit';
import {
  fetchLaporanTutor,
  fetchTutorDetailReport,
  fetchMapelOptions,
  fetchTutorJenisKegiatanOptions,
  fetchTutorAvailableYears,
  initializeTutorLaporanPage,
  updateTutorFiltersAndRefresh
} from './tutorLaporanThunks';

const initialState = {
  tutors: [],
  summary: null,
  filterOptions: {
    availableYears: [],
    availableActivityTypes: [],
    availableMapel: [],
    currentYear: new Date().getFullYear(),
    currentActivityType: null,
    currentMapel: null
  },
  months: {},
  
  tutorDetail: {
    tutor: null,
    attendanceRecords: [],
    filter: null
  },
  
  loading: false,
  tutorDetailLoading: false,
  filterOptionsLoading: false,
  initializingPage: false,
  
  error: null,
  tutorDetailError: null,
  filterOptionsError: null,
  initializeError: null,
  
  filters: {
    year: new Date().getFullYear(),
    jenisKegiatan: null,
    maple: null
  },
  expandedCards: [],
};

const tutorLaporanSlice = createSlice({
  name: 'tutorLaporan',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setYear: (state, action) => {
      state.filters.year = action.payload;
    },
    setJenisKegiatan: (state, action) => {
      state.filters.jenisKegiatan = action.payload;
    },
    setMapel: (state, action) => {
      state.filters.maple = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        year: new Date().getFullYear(),
        jenisKegiatan: null,
        maple: null
      };
    },
    
    toggleCardExpanded: (state, action) => {
      const tutorId = action.payload;
      const index = state.expandedCards.indexOf(tutorId);
      if (index > -1) {
        state.expandedCards.splice(index, 1);
      } else {
        state.expandedCards.push(tutorId);
      }
    },
    setCardExpanded: (state, action) => {
      const { tutorId, expanded } = action.payload;
      const index = state.expandedCards.indexOf(tutorId);
      if (expanded && index === -1) {
        state.expandedCards.push(tutorId);
      } else if (!expanded && index > -1) {
        state.expandedCards.splice(index, 1);
      }
    },
    expandAllCards: (state) => {
      state.expandedCards = state.tutors.map(tutor => tutor.id_tutor);
    },
    collapseAllCards: (state) => {
      state.expandedCards = [];
    },
    
    clearTutorDetail: (state) => {
      state.tutorDetail = {
        tutor: null,
        attendanceRecords: [],
        filter: null
      };
      state.tutorDetailError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearTutorDetailError: (state) => {
      state.tutorDetailError = null;
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
      .addCase(initializeTutorLaporanPage.pending, (state) => {
        state.initializingPage = true;
        state.initializeError = null;
      })
      .addCase(initializeTutorLaporanPage.fulfilled, (state) => {
        state.initializingPage = false;
        state.initializeError = null;
      })
      .addCase(initializeTutorLaporanPage.rejected, (state, action) => {
        state.initializingPage = false;
        state.initializeError = action.payload;
      })
      
      .addCase(updateTutorFiltersAndRefresh.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTutorFiltersAndRefresh.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateTutorFiltersAndRefresh.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchLaporanTutor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaporanTutor.fulfilled, (state, action) => {
        state.loading = false;
        state.tutors = action.payload.tutors;
        state.summary = action.payload.summary;
        state.filterOptions = { ...state.filterOptions, ...action.payload.filter_options };
        state.months = action.payload.months;
        state.error = null;
      })
      .addCase(fetchLaporanTutor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchTutorDetailReport.pending, (state) => {
        state.tutorDetailLoading = true;
        state.tutorDetailError = null;
      })
      .addCase(fetchTutorDetailReport.fulfilled, (state, action) => {
        state.tutorDetailLoading = false;
        state.tutorDetail = action.payload;
        state.tutorDetailError = null;
      })
      .addCase(fetchTutorDetailReport.rejected, (state, action) => {
        state.tutorDetailLoading = false;
        state.tutorDetailError = action.payload;
      })
      
      .addCase(fetchMapelOptions.pending, (state) => {
        state.filterOptionsLoading = true;
        state.filterOptionsError = null;
      })
      .addCase(fetchMapelOptions.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptions.availableMapel = action.payload;
        state.filterOptionsError = null;
      })
      .addCase(fetchMapelOptions.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptionsError = action.payload;
      })
      
      .addCase(fetchTutorJenisKegiatanOptions.pending, (state) => {
        state.filterOptionsLoading = true;
        state.filterOptionsError = null;
      })
      .addCase(fetchTutorJenisKegiatanOptions.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptions.availableActivityTypes = action.payload;
        state.filterOptionsError = null;
      })
      .addCase(fetchTutorJenisKegiatanOptions.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptionsError = action.payload;
      })
      
      .addCase(fetchTutorAvailableYears.pending, (state) => {
        state.filterOptionsLoading = true;
        state.filterOptionsError = null;
      })
      .addCase(fetchTutorAvailableYears.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptions.availableYears = action.payload;
        state.filterOptionsError = null;
      })
      .addCase(fetchTutorAvailableYears.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptionsError = action.payload;
      });
  }
});

export const {
  setFilters,
  setYear,
  setJenisKegiatan,
  setMapel,
  resetFilters,
  toggleCardExpanded,
  setCardExpanded,
  expandAllCards,
  collapseAllCards,
  clearTutorDetail,
  clearError,
  clearTutorDetailError,
  clearFilterOptionsError,
  clearInitializeError
} = tutorLaporanSlice.actions;

// Selectors
export const selectTutorLaporanState = (state) => state.tutorLaporan;
export const selectTutors = (state) => state.tutorLaporan.tutors;
export const selectTutorSummary = (state) => state.tutorLaporan.summary;
export const selectTutorFilterOptions = (state) => state.tutorLaporan.filterOptions;
export const selectTutorMonths = (state) => state.tutorLaporan.months;
export const selectTutorFilters = (state) => state.tutorLaporan.filters;
export const selectTutorExpandedCards = (state) => state.tutorLaporan.expandedCards;
export const selectTutorDetail = (state) => state.tutorLaporan.tutorDetail;
export const selectTutorLoading = (state) => state.tutorLaporan.loading;
export const selectTutorDetailLoading = (state) => state.tutorLaporan.tutorDetailLoading;
export const selectTutorFilterOptionsLoading = (state) => state.tutorLaporan.filterOptionsLoading;
export const selectTutorInitializingPage = (state) => state.tutorLaporan.initializingPage;
export const selectTutorError = (state) => state.tutorLaporan.error;
export const selectTutorDetailError = (state) => state.tutorLaporan.tutorDetailError;
export const selectTutorFilterOptionsError = (state) => state.tutorLaporan.filterOptionsError;
export const selectTutorInitializeError = (state) => state.tutorLaporan.initializeError;

export const selectIsTutorCardExpanded = (state, tutorId) => 
  state.tutorLaporan.expandedCards.includes(tutorId);

export const selectTutorCurrentFilters = (state) => ({
  year: state.tutorLaporan.filters.year,
  jenisKegiatan: state.tutorLaporan.filters.jenisKegiatan,
  maple: state.tutorLaporan.filters.maple
});

export default tutorLaporanSlice.reducer;