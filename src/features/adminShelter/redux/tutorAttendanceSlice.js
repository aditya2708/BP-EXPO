import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { tutorAttendanceApi } from '../api/tutorAttendanceApi';

// Async thunks
export const recordTutorAttendanceByQr = createAsyncThunk(
  'tutorAttendance/recordByQr',
  async ({ id_tutor, id_aktivitas, status, token, arrival_time }, { rejectWithValue }) => {
    try {
      const response = await tutorAttendanceApi.recordTutorAttendanceByQr(id_tutor, id_aktivitas, status, token, arrival_time);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        return rejectWithValue({
          message: error.response.data.message || 'Tutor attendance already recorded for this activity',
          isDuplicate: true,
          existingRecord: error.response.data.data
        });
      }
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const recordTutorAttendanceManually = createAsyncThunk(
  'tutorAttendance/recordManually',
  async ({ id_tutor, id_aktivitas, status, notes, arrival_time }, { rejectWithValue }) => {
    try {
      const response = await tutorAttendanceApi.recordTutorAttendanceManually(id_tutor, id_aktivitas, status, notes, arrival_time);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        return rejectWithValue({
          message: error.response.data.message || 'Tutor attendance already recorded for this activity',
          isDuplicate: true,
          existingRecord: error.response.data.data
        });
      }
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getTutorAttendanceByActivity = createAsyncThunk(
  'tutorAttendance/getByActivity',
  async (id_aktivitas, { rejectWithValue }) => {
    try {
      const response = await tutorAttendanceApi.getTutorAttendanceByActivity(id_aktivitas);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getTutorAttendanceHistory = createAsyncThunk(
  'tutorAttendance/getHistory',
  async ({ id_tutor, filters }, { rejectWithValue }) => {
    try {
      const response = await tutorAttendanceApi.getTutorAttendanceHistory(id_tutor, filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const generateTutorToken = createAsyncThunk(
  'tutorAttendance/generateToken',
  async ({ id_tutor, validDays = 30 }, { rejectWithValue }) => {
    try {
      const response = await tutorAttendanceApi.generateTutorToken(id_tutor, validDays);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Initial state
const initialState = {
  attendanceRecords: {},
  activityRecords: {},
  tutorRecords: {},
  tokens: {},
  currentToken: null,
  loading: false,
  error: null,
  duplicateError: null,
  lastUpdated: null,
  offlineQueue: [],
  isSyncing: false
};

// Slice
const tutorAttendanceSlice = createSlice({
  name: 'tutorAttendance',
  initialState,
  reducers: {
    resetTutorAttendanceError: (state) => {
      state.error = null;
      state.duplicateError = null;
    },
    queueOfflineTutorAttendance: (state, action) => {
      state.offlineQueue.push(action.payload);
    },
    removeFromOfflineQueue: (state, action) => {
      state.offlineQueue = state.offlineQueue.filter(item => item.id !== action.payload);
    },
    setSyncing: (state, action) => {
      state.isSyncing = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Record tutor attendance by QR
      .addCase(recordTutorAttendanceByQr.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.duplicateError = null;
      })
      .addCase(recordTutorAttendanceByQr.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const attendance = action.payload.data;
          state.attendanceRecords[attendance.id_absen] = attendance;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(recordTutorAttendanceByQr.rejected, (state, action) => {
        state.loading = false;
        
        if (action.payload?.isDuplicate) {
          state.duplicateError = action.payload.message;
          if (action.payload.existingRecord) {
            const record = action.payload.existingRecord;
            state.attendanceRecords[record.id_absen] = record;
          }
        } else {
          state.error = action.payload?.message || 'Failed to record tutor attendance';
        }
      })
      
      // Record tutor attendance manually
      .addCase(recordTutorAttendanceManually.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.duplicateError = null;
      })
      .addCase(recordTutorAttendanceManually.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const attendance = action.payload.data;
          state.attendanceRecords[attendance.id_absen] = attendance;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(recordTutorAttendanceManually.rejected, (state, action) => {
        state.loading = false;
        
        if (action.payload?.isDuplicate) {
          state.duplicateError = action.payload.message;
          if (action.payload.existingRecord) {
            const record = action.payload.existingRecord;
            state.attendanceRecords[record.id_absen] = record;
          }
        } else {
          state.error = action.payload?.message || 'Failed to record tutor attendance manually';
        }
      })
      
      // Get tutor attendance by activity
      .addCase(getTutorAttendanceByActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTutorAttendanceByActivity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const id_aktivitas = action.meta.arg;
          state.activityRecords[id_aktivitas] = action.payload.data;
          
          if (action.payload.data.id_absen) {
            state.attendanceRecords[action.payload.data.id_absen] = action.payload.data;
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getTutorAttendanceByActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get tutor attendance';
      })
      
      // Get tutor attendance history
      .addCase(getTutorAttendanceHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTutorAttendanceHistory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data && Array.isArray(action.payload.data)) {
          const id_tutor = action.meta.arg.id_tutor;
          state.tutorRecords[id_tutor] = action.payload.data;
          
          action.payload.data.forEach(record => {
            state.attendanceRecords[record.id_absen] = record;
          });
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getTutorAttendanceHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get tutor attendance history';
      })
      
      // Generate tutor token
      .addCase(generateTutorToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateTutorToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const token = action.payload.data;
          state.tokens[token.token] = token;
          state.currentToken = token;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(generateTutorToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to generate tutor token';
      });
  }
});

// Actions
export const { 
  resetTutorAttendanceError, 
  queueOfflineTutorAttendance, 
  removeFromOfflineQueue, 
  setSyncing 
} = tutorAttendanceSlice.actions;

// Selectors
export const selectTutorAttendanceLoading = (state) => state.tutorAttendance.loading;
export const selectTutorAttendanceError = (state) => state.tutorAttendance.error;
export const selectTutorDuplicateError = (state) => state.tutorAttendance.duplicateError;
export const selectTutorAttendanceRecords = (state) => state.tutorAttendance.attendanceRecords;
export const selectTutorTokens = (state) => state.tutorAttendance.tokens;
export const selectCurrentTutorToken = (state) => state.tutorAttendance.currentToken;

// Memoized selectors
export const selectTutorAttendanceByActivity = createSelector(
  [(state) => state.tutorAttendance.activityRecords, (_, id_aktivitas) => id_aktivitas],
  (activityRecords, id_aktivitas) => activityRecords[id_aktivitas] || null
);

export const selectTutorAttendanceHistory = createSelector(
  [(state) => state.tutorAttendance.tutorRecords, (_, id_tutor) => id_tutor],
  (tutorRecords, id_tutor) => tutorRecords[id_tutor] || []
);

export const selectOfflineQueue = (state) => state.tutorAttendance.offlineQueue;
export const selectIsSyncing = (state) => state.tutorAttendance.isSyncing;

export default tutorAttendanceSlice.reducer;