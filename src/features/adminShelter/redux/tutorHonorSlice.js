import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tutorHonorApi } from '../api/tutorHonorApi';

const initialState = {
  honorList: [],
  selectedHonor: null,
  monthlyDetail: null,
  stats: null,
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
    markPaid: 'idle'
  },
  actionError: {
    calculate: null,
    approve: null,
    markPaid: null
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
          state.honorList.push(calculatedHonor);
        }
        
        if (state.monthlyDetail && 
            state.monthlyDetail.bulan === calculatedHonor.bulan && 
            state.monthlyDetail.tahun === calculatedHonor.tahun) {
          state.monthlyDetail = calculatedHonor;
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
      });
  }
});

export const {
  resetHonorDetail,
  resetError,
  resetActionStatus,
  updateSummary
} = tutorHonorSlice.actions;

export const selectHonorList = state => state.tutorHonor.honorList;
export const selectSelectedHonor = state => state.tutorHonor.selectedHonor;
export const selectMonthlyDetail = state => state.tutorHonor.monthlyDetail;
export const selectHonorStats = state => state.tutorHonor.stats;
export const selectHonorLoading = state => state.tutorHonor.loading;
export const selectHonorError = state => state.tutorHonor.error;
export const selectHonorSummary = state => state.tutorHonor.summary;
export const selectHonorActionStatus = (state, action) => state.tutorHonor.actionStatus[action];
export const selectHonorActionError = (state, action) => state.tutorHonor.actionError[action];

export default tutorHonorSlice.reducer;