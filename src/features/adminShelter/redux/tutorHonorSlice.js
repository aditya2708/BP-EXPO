import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tutorHonorApi } from '../api/tutorHonorApi';

const initialState = {
  honorList: [],
  selectedHonor: null,
  monthlyDetail: null,
  stats: null,
  currentSettings: null,
  preview: null,
  loading: false,
  error: null,
  summary: {
    totalThisMonth: 0,
    totalActivities: 0,
    averageStudents: 0,
    yearlyTotal: 0
  },
  actionStatus: {
    calculate: 'idle',
    approve: 'idle',
    markPaid: 'idle',
    fetchSettings: 'idle',
    preview: 'idle'
  },
  actionError: {
    calculate: null,
    approve: null,
    markPaid: null,
    fetchSettings: null,
    preview: null
  },
  honorHistory: [],
  honorStatistics: null,
  historyFilters: {
    start_date: null,
    end_date: null,
    status: '',
    year: null
  },
  historyPagination: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  },
  historyLoading: false,
  statisticsLoading: false,
  historyError: null,
  statisticsError: null,
  previewInputs: {
    cpb_count: 0,
    pb_count: 0,
    npb_count: 0,
    session_count: 1
  }
};

export const fetchTutorHonor = createAsyncThunk(
  'tutorHonor/fetchTutorHonor',
  async ({ tutorId, params }, { rejectWithValue }) => {
    try {
      const response = await tutorHonorApi.getTutorHonor(tutorId, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tutor honor');
    }
  }
);

export const fetchMonthlyDetail = createAsyncThunk(
  'tutorHonor/fetchMonthlyDetail',
  async ({ tutorId, month, year }, { rejectWithValue }) => {
    try {
      const response = await tutorHonorApi.getMonthlyDetail(tutorId, month, year);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch monthly detail');
    }
  }
);

export const calculateHonor = createAsyncThunk(
  'tutorHonor/calculateHonor',
  async ({ tutorId, data }, { rejectWithValue }) => {
    try {
      const response = await tutorHonorApi.calculateHonor(tutorId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to calculate honor');
    }
  }
);

export const approveHonor = createAsyncThunk(
  'tutorHonor/approveHonor',
  async (honorId, { rejectWithValue }) => {
    try {
      const response = await tutorHonorApi.approveHonor(honorId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve honor');
    }
  }
);

export const markAsPaid = createAsyncThunk(
  'tutorHonor/markAsPaid',
  async (honorId, { rejectWithValue }) => {
    try {
      const response = await tutorHonorApi.markAsPaid(honorId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as paid');
    }
  }
);

export const fetchHonorStats = createAsyncThunk(
  'tutorHonor/fetchHonorStats',
  async (params, { rejectWithValue }) => {
    try {
      const response = await tutorHonorApi.getHonorStats(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch honor stats');
    }
  }
);

export const fetchCurrentSettings = createAsyncThunk(
  'tutorHonor/fetchCurrentSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tutorHonorApi.getCurrentSettings();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current settings');
    }
  }
);

export const calculatePreview = createAsyncThunk(
  'tutorHonor/calculatePreview',
  async (data, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const paymentSystem = state.tutorHonor.currentSettings?.payment_system;
      
      if (paymentSystem) {
        const response = await tutorHonorApi.calculateDynamicPreview(paymentSystem, data);
        return response.data;
      } else {
        const response = await tutorHonorApi.calculatePreview(data);
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to calculate preview');
    }
  }
);

export const fetchHonorHistory = createAsyncThunk(
  'tutorHonor/fetchHonorHistory',
  async ({ tutorId, filters }, { rejectWithValue }) => {
    try {
      const response = await tutorHonorApi.getHonorHistory(tutorId, filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch honor history');
    }
  }
);

export const fetchHonorStatistics = createAsyncThunk(
  'tutorHonor/fetchHonorStatistics',
  async ({ tutorId, filters }, { rejectWithValue }) => {
    try {
      const response = await tutorHonorApi.getHonorStatistics(tutorId, filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch honor statistics');
    }
  }
);

const tutorHonorSlice = createSlice({
  name: 'tutorHonor',
  initialState,
  reducers: {
    resetHonorDetail: (state) => {
      state.selectedHonor = null;
      state.monthlyDetail = null;
    },
    resetError: (state) => {
      state.error = null;
    },
    resetActionStatus: (state, action) => {
      const actionType = action.payload;
      if (actionType && state.actionStatus[actionType]) {
        state.actionStatus[actionType] = 'idle';
        state.actionError[actionType] = null;
      } else {
        Object.keys(state.actionStatus).forEach(key => {
          state.actionStatus[key] = 'idle';
          state.actionError[key] = null;
        });
      }
    },
    updateSummary: (state, action) => {
      state.summary = { ...state.summary, ...action.payload };
    },
    setHistoryFilters: (state, action) => {
      state.historyFilters = { ...state.historyFilters, ...action.payload };
    },
    resetHistoryFilters: (state) => {
      state.historyFilters = {
        start_date: null,
        end_date: null,
        status: '',
        year: null
      };
    },
    resetHistoryError: (state) => {
      state.historyError = null;
    },
    resetStatisticsError: (state) => {
      state.statisticsError = null;
    },
    clearHonorHistory: (state) => {
      state.honorHistory = [];
      state.historyPagination = {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      };
    },
    resetPreview: (state) => {
      state.preview = null;
    },
    clearCurrentSettings: (state) => {
      state.currentSettings = null;
    },
    setPreviewInputs: (state, action) => {
      state.previewInputs = { ...state.previewInputs, ...action.payload };
    },
    resetPreviewInputs: (state) => {
      const paymentSystem = state.currentSettings?.payment_system;
      
      switch (paymentSystem) {
        case 'per_student_category':
        case 'session_per_student_category':
          state.previewInputs = {
            cpb_count: 5,
            pb_count: 3,
            npb_count: 2,
            session_count: 1
          };
          break;
        case 'per_session':
          state.previewInputs = {
            cpb_count: 0,
            pb_count: 0,
            npb_count: 0,
            session_count: 1
          };
          break;
        case 'flat_monthly':
          state.previewInputs = {
            cpb_count: 0,
            pb_count: 0,
            npb_count: 0,
            session_count: 0
          };
          break;
        default:
          state.previewInputs = {
            cpb_count: 5,
            pb_count: 3,
            npb_count: 2,
            session_count: 1
          };
      }
    },
    updatePaymentSystemContext: (state, action) => {
      const paymentSystem = action.payload;
      state.currentSettings = state.currentSettings ? 
        { ...state.currentSettings, payment_system: paymentSystem } : 
        { payment_system: paymentSystem };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTutorHonor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTutorHonor.fulfilled, (state, action) => {
        state.loading = false;
        state.honorList = action.payload.data?.honors_per_bulan || [];
        state.summary = {
          totalThisMonth: 0,
          totalActivities: action.payload.data?.total_aktivitas_tahun || 0,
          averageStudents: action.payload.data?.rata_rata_bulanan || 0,
          yearlyTotal: action.payload.data?.total_honor_tahun || 0
        };
        if (action.payload.current_settings) {
          state.currentSettings = action.payload.current_settings;
        }
      })
      .addCase(fetchTutorHonor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchMonthlyDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyDetail = action.payload.data;
        state.stats = action.payload.stats;
        if (action.payload.current_settings) {
          state.currentSettings = action.payload.current_settings;
        }
      })
      .addCase(fetchMonthlyDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(calculateHonor.pending, (state) => {
        state.actionStatus.calculate = 'loading';
        state.actionError.calculate = null;
      })
      .addCase(calculateHonor.fulfilled, (state, action) => {
        state.actionStatus.calculate = 'succeeded';
        const calculatedHonor = action.payload.data;
        
        const existingIndex = state.honorList.findIndex(
          h => h.bulan === calculatedHonor.bulan && h.tahun === calculatedHonor.tahun
        );
        
        if (existingIndex !== -1) {
          state.honorList[existingIndex] = calculatedHonor;
        } else {
          state.honorList.unshift(calculatedHonor);
          state.honorList.sort((a, b) => {
            if (a.tahun !== b.tahun) return b.tahun - a.tahun;
            return b.bulan - a.bulan;
          });
        }
        
        if (state.monthlyDetail && 
            state.monthlyDetail.bulan === calculatedHonor.bulan && 
            state.monthlyDetail.tahun === calculatedHonor.tahun) {
          state.monthlyDetail = calculatedHonor;
        }
        
        state.summary.yearlyTotal = state.honorList
          .filter(h => h.tahun === calculatedHonor.tahun)
          .reduce((sum, h) => sum + parseFloat(h.total_honor || 0), 0);

        if (action.payload.settings_used) {
          state.currentSettings = action.payload.settings_used;
        }
      })
      .addCase(calculateHonor.rejected, (state, action) => {
        state.actionStatus.calculate = 'failed';
        state.actionError.calculate = action.payload;
      })
      
      .addCase(approveHonor.pending, (state) => {
        state.actionStatus.approve = 'loading';
        state.actionError.approve = null;
      })
      .addCase(approveHonor.fulfilled, (state, action) => {
        state.actionStatus.approve = 'succeeded';
        const approvedHonor = action.payload.data;
        
        const index = state.honorList.findIndex(h => h.id_honor === approvedHonor.id_honor);
        if (index !== -1) {
          state.honorList[index] = approvedHonor;
        }
        
        if (state.monthlyDetail && state.monthlyDetail.id_honor === approvedHonor.id_honor) {
          state.monthlyDetail = approvedHonor;
        }
      })
      .addCase(approveHonor.rejected, (state, action) => {
        state.actionStatus.approve = 'failed';
        state.actionError.approve = action.payload;
      })
      
      .addCase(markAsPaid.pending, (state) => {
        state.actionStatus.markPaid = 'loading';
        state.actionError.markPaid = null;
      })
      .addCase(markAsPaid.fulfilled, (state, action) => {
        state.actionStatus.markPaid = 'succeeded';
        const paidHonor = action.payload.data;
        
        const index = state.honorList.findIndex(h => h.id_honor === paidHonor.id_honor);
        if (index !== -1) {
          state.honorList[index] = paidHonor;
        }
        
        if (state.monthlyDetail && state.monthlyDetail.id_honor === paidHonor.id_honor) {
          state.monthlyDetail = paidHonor;
        }
      })
      .addCase(markAsPaid.rejected, (state, action) => {
        state.actionStatus.markPaid = 'failed';
        state.actionError.markPaid = action.payload;
      })
      
      .addCase(fetchHonorStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      })

      .addCase(fetchCurrentSettings.pending, (state) => {
        state.actionStatus.fetchSettings = 'loading';
        state.actionError.fetchSettings = null;
      })
      .addCase(fetchCurrentSettings.fulfilled, (state, action) => {
        state.actionStatus.fetchSettings = 'succeeded';
        state.currentSettings = action.payload.data;
      })
      .addCase(fetchCurrentSettings.rejected, (state, action) => {
        state.actionStatus.fetchSettings = 'failed';
        state.actionError.fetchSettings = action.payload;
        state.currentSettings = null;
      })

      .addCase(calculatePreview.pending, (state) => {
        state.actionStatus.preview = 'loading';
        state.actionError.preview = null;
      })
      .addCase(calculatePreview.fulfilled, (state, action) => {
        state.actionStatus.preview = 'succeeded';
        state.preview = action.payload.data;
      })
      .addCase(calculatePreview.rejected, (state, action) => {
        state.actionStatus.preview = 'failed';
        state.actionError.preview = action.payload;
      })
      
      .addCase(fetchHonorHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchHonorHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.honorHistory = action.payload.data || [];
        
        if (action.payload.pagination) {
          state.historyPagination = {
            current_page: action.payload.pagination.current_page || 1,
            last_page: action.payload.pagination.last_page || 1,
            per_page: action.payload.pagination.per_page || 10,
            total: action.payload.pagination.total || 0
          };
        }
      })
      .addCase(fetchHonorHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload || 'Failed to fetch honor history';
      })
      
      .addCase(fetchHonorStatistics.pending, (state) => {
        state.statisticsLoading = true;
        state.statisticsError = null;
      })
      .addCase(fetchHonorStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.honorStatistics = action.payload.data;
      })
      .addCase(fetchHonorStatistics.rejected, (state, action) => {
        state.statisticsLoading = false;
        state.statisticsError = action.payload || 'Failed to fetch honor statistics';
      });
  }
});

export const {
  resetHonorDetail,
  resetError,
  resetActionStatus,
  updateSummary,
  setHistoryFilters,
  resetHistoryFilters,
  resetHistoryError,
  resetStatisticsError,
  clearHonorHistory,
  resetPreview,
  clearCurrentSettings,
  setPreviewInputs,
  resetPreviewInputs,
  updatePaymentSystemContext
} = tutorHonorSlice.actions;

// Selectors
export const selectHonorList = state => state.tutorHonor.honorList;
export const selectSelectedHonor = state => state.tutorHonor.selectedHonor;
export const selectMonthlyDetail = state => state.tutorHonor.monthlyDetail;
export const selectHonorStats = state => state.tutorHonor.stats;
export const selectHonorLoading = state => state.tutorHonor.loading;
export const selectHonorError = state => state.tutorHonor.error;
export const selectHonorSummary = state => state.tutorHonor.summary;
export const selectHonorActionStatus = (state, action) => state.tutorHonor.actionStatus[action];
export const selectHonorActionError = (state, action) => state.tutorHonor.actionError[action];
export const selectCurrentSettings = state => state.tutorHonor.currentSettings;
export const selectPreview = state => state.tutorHonor.preview;
export const selectHonorHistory = state => state.tutorHonor.honorHistory;
export const selectHonorStatistics = state => state.tutorHonor.honorStatistics;
export const selectHistoryFilters = state => state.tutorHonor.historyFilters;
export const selectHistoryPagination = state => state.tutorHonor.historyPagination;
export const selectHistoryLoading = state => state.tutorHonor.historyLoading;
export const selectStatisticsLoading = state => state.tutorHonor.statisticsLoading;
export const selectHistoryError = state => state.tutorHonor.historyError;
export const selectStatisticsError = state => state.tutorHonor.statisticsError;
export const selectPreviewInputs = state => state.tutorHonor.previewInputs;

// Dynamic selectors based on payment system
export const selectPaymentSystem = state => state.tutorHonor.currentSettings?.payment_system;
export const selectPaymentSystemName = state => {
  const systems = {
    'flat_monthly': 'Honor Bulanan Tetap',
    'per_session': 'Per Sesi/Pertemuan',
    'per_student_category': 'Per Kategori Siswa',
    'session_per_student_category': 'Per Sesi + Per Kategori Siswa'
  };
  const paymentSystem = state.tutorHonor.currentSettings?.payment_system;
  return systems[paymentSystem] || paymentSystem || 'Unknown';
};

export const selectRequiredInputFields = state => {
  const paymentSystem = state.tutorHonor.currentSettings?.payment_system;
  
  switch (paymentSystem) {
    case 'flat_monthly':
      return [];
    case 'per_session':
      return ['session_count'];
    case 'per_student_category':
      return ['cpb_count', 'pb_count', 'npb_count'];
    case 'session_per_student_category':
      return ['session_count', 'cpb_count', 'pb_count', 'npb_count'];
    default:
      return ['cpb_count', 'pb_count', 'npb_count'];
  }
};

export const selectHasStudentBreakdown = state => {
  const paymentSystem = state.tutorHonor.currentSettings?.payment_system;
  return ['per_student_category', 'session_per_student_category'].includes(paymentSystem);
};

export const selectHasSessionBreakdown = state => {
  const paymentSystem = state.tutorHonor.currentSettings?.payment_system;
  return ['per_session', 'session_per_student_category'].includes(paymentSystem);
};

export const selectIsFlatMonthly = state => {
  const paymentSystem = state.tutorHonor.currentSettings?.payment_system;
  return paymentSystem === 'flat_monthly';
};

export default tutorHonorSlice.reducer;