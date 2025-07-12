import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../common/api/api';

// Async Thunks
export const fetchSemesters = createAsyncThunk(
  'adminShelter/semester/fetchSemesters',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin-shelter/semester', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSemesterDetail = createAsyncThunk(
  'adminShelter/semester/fetchSemesterDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin-shelter/semester/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchActiveSemester = createAsyncThunk(
  'adminShelter/semester/fetchActiveSemester',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin-shelter/semester/active');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createSemester = createAsyncThunk(
  'adminShelter/semester/createSemester',
  async (semesterData, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin-shelter/semester', semesterData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSemester = createAsyncThunk(
  'adminShelter/semester/updateSemester',
  async ({ id, semesterData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin-shelter/semester/${id}`, semesterData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteSemester = createAsyncThunk(
  'adminShelter/semester/deleteSemester',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin-shelter/semester/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const setActiveSemester = createAsyncThunk(
  'adminShelter/semester/setActiveSemester',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin-shelter/semester/${id}/set-active`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTahunAjaran = createAsyncThunk(
  'adminShelter/semester/fetchTahunAjaran',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin-shelter/semester/tahun-ajaran');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSemesterStatistics = createAsyncThunk(
  'adminShelter/semester/fetchSemesterStatistics',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin-shelter/semester/${id}/statistics`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Kurikulum related thunks
export const fetchKurikulumDropdown = createAsyncThunk(
  'adminShelter/semester/fetchKurikulumDropdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin-shelter/kurikulum-dropdown');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchKurikulumDetail = createAsyncThunk(
  'adminShelter/semester/fetchKurikulumDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin-shelter/kurikulum/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  list: [],
  detail: null,
  activeSemester: null,
  kurikulumList: [],
  selectedKurikulum: null,
  tahunAjaranList: [],
  statistics: null,
  loading: false,
  error: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  },
  filters: {
    search: '',
    tahun_ajaran: '',
    periode: '',
    page: 1
  }
};

const semesterSlice = createSlice({
  name: 'adminShelter/semester',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedKurikulum: (state, action) => {
      state.selectedKurikulum = action.payload;
    },
    clearSelectedKurikulum: (state) => {
      state.selectedKurikulum = null;
    },
    clearDetail: (state) => {
      state.detail = null;
    },
    clearStatistics: (state) => {
      state.statistics = null;
    },
    updateSemesterInList: (state, action) => {
      const index = state.list.findIndex(s => s.id_semester === action.payload.id_semester);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch semesters
      .addCase(fetchSemesters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSemesters.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data.data;
        state.pagination = {
          current_page: action.payload.data.current_page,
          last_page: action.payload.data.last_page,
          per_page: action.payload.data.per_page,
          total: action.payload.data.total
        };
      })
      .addCase(fetchSemesters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Fetch semester detail
      .addCase(fetchSemesterDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSemesterDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload.data;
      })
      .addCase(fetchSemesterDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Fetch active semester
      .addCase(fetchActiveSemester.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveSemester.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSemester = action.payload.data;
      })
      .addCase(fetchActiveSemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Create semester
      .addCase(createSemester.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSemester.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.list)) {
          state.list.unshift(action.payload.data);
        } else {
          state.list = [action.payload.data];
        }
        // Update active semester if new one is active
        if (action.payload.data.is_active) {
          state.activeSemester = action.payload.data;
          // Deactivate others in list
          state.list = state.list.map(s => ({
            ...s,
            is_active: s.id_semester === action.payload.data.id_semester
          }));
        }
        // Clear selected kurikulum after creation
        state.selectedKurikulum = null;
      })
      .addCase(createSemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Update semester
      .addCase(updateSemester.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSemester.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(s => s.id_semester === action.payload.data.id_semester);
        if (index !== -1) {
          state.list[index] = action.payload.data;
        }
        if (state.detail?.id_semester === action.payload.data.id_semester) {
          state.detail = action.payload.data;
        }
        // Update active semester if changed
        if (action.payload.data.is_active) {
          state.activeSemester = action.payload.data;
          // Deactivate others in list
          state.list = state.list.map(s => ({
            ...s,
            is_active: s.id_semester === action.payload.data.id_semester
          }));
        }
      })
      .addCase(updateSemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Delete semester
      .addCase(deleteSemester.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSemester.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(s => s.id_semester !== action.payload.id);
        if (state.detail?.id_semester === action.payload.id) {
          state.detail = null;
        }
        if (state.activeSemester?.id_semester === action.payload.id) {
          state.activeSemester = null;
        }
      })
      .addCase(deleteSemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Set active semester
      .addCase(setActiveSemester.fulfilled, (state, action) => {
        state.activeSemester = action.payload.data;
        // Update list to reflect active status
        state.list = state.list.map(s => ({
          ...s,
          is_active: s.id_semester === action.payload.data.id_semester
        }));
        if (state.detail?.id_semester === action.payload.data.id_semester) {
          state.detail = { ...state.detail, is_active: true };
        }
      })
      
      // Fetch tahun ajaran
      .addCase(fetchTahunAjaran.fulfilled, (state, action) => {
        state.tahunAjaranList = action.payload.data;
      })
      
      // Fetch semester statistics
      .addCase(fetchSemesterStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSemesterStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(fetchSemesterStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      
      // Fetch kurikulum dropdown
      .addCase(fetchKurikulumDropdown.fulfilled, (state, action) => {
        state.kurikulumList = action.payload.data || [];
      })
      
      // Fetch kurikulum detail
      .addCase(fetchKurikulumDetail.fulfilled, (state, action) => {
        state.selectedKurikulum = action.payload.data;
      });
  }
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setSelectedKurikulum,
  clearSelectedKurikulum,
  clearDetail,
  clearStatistics,
  updateSemesterInList
} = semesterSlice.actions;

// Selectors
export const selectSemesterList = (state) => state.adminShelter.semester.list;
export const selectSemesterDetail = (state) => state.adminShelter.semester.detail;
export const selectActiveSemester = (state) => state.adminShelter.semester.activeSemester;
export const selectSemesterLoading = (state) => state.adminShelter.semester.loading;
export const selectSemesterError = (state) => state.adminShelter.semester.error;
export const selectSemesterPagination = (state) => state.adminShelter.semester.pagination;
export const selectSemesterFilters = (state) => state.adminShelter.semester.filters;
export const selectKurikulumList = (state) => state.adminShelter.semester.kurikulumList;
export const selectSelectedKurikulum = (state) => state.adminShelter.semester.selectedKurikulum;
export const selectTahunAjaranList = (state) => state.adminShelter.semester.tahunAjaranList;
export const selectSemesterStatistics = (state) => state.adminShelter.semester.statistics;

// Derived selectors
export const selectActiveSemesterExists = (state) => 
  !!state.adminShelter.semester.activeSemester;

export const selectSemesterById = (id) => (state) =>
  state.adminShelter.semester.list.find(s => s.id_semester === parseInt(id));

export const selectSemestersByTahunAjaran = (tahun) => (state) =>
  state.adminShelter.semester.list.filter(s => s.tahun_ajaran === tahun);

export const selectSemestersByPeriode = (periode) => (state) =>
  state.adminShelter.semester.list.filter(s => s.periode === periode);

export const selectKurikulumOptions = (state) => 
  state.adminShelter.semester.kurikulumList.map(k => ({
    label: `${k.nama_kurikulum} (${k.tahun_berlaku})`,
    value: k.id_kurikulum,
    disabled: !k.is_active
  }));

export default semesterSlice.reducer;