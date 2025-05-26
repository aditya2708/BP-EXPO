import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { attendanceApi } from '../api/attendanceApi';

// Async thunks
export const recordAttendanceByQr = createAsyncThunk(
  'attendance/recordByQr',
  async ({ id_anak, id_aktivitas, status, token, arrival_time }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.recordAttendanceByQr(id_anak, id_aktivitas, status, token, arrival_time);
      return response.data;
    } catch (error) {
      // Special handling for duplicate records (409 Conflict)
      if (error.response?.status === 409) {
        return rejectWithValue({
          message: error.response.data.message || 'Attendance already recorded for this student in this activity',
          isDuplicate: true,
          existingRecord: error.response.data.data
        });
      }
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const recordAttendanceManually = createAsyncThunk(
  'attendance/recordManually',
  async ({ id_anak, id_aktivitas, status, notes, arrival_time }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.recordAttendanceManually(id_anak, id_aktivitas, status, notes, arrival_time);
      return response.data;
    } catch (error) {
      // Special handling for duplicate records (409 Conflict)
      if (error.response?.status === 409) {
        return rejectWithValue({
          message: error.response.data.message || 'Attendance already recorded for this student in this activity',
          isDuplicate: true,
          existingRecord: error.response.data.data
        });
      }
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getAttendanceByActivity = createAsyncThunk(
  'attendance/getByActivity',
  async ({ id_aktivitas, filters }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getAttendanceByActivity(id_aktivitas, filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getAttendanceByStudent = createAsyncThunk(
  'attendance/getByStudent',
  async ({ id_anak, filters }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getAttendanceByStudent(id_anak, filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const manualVerify = createAsyncThunk(
  'attendance/manualVerify',
  async ({ id_absen, notes }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.manualVerify(id_absen, notes);
      return { ...response.data, id_absen };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const rejectVerification = createAsyncThunk(
  'attendance/rejectVerification',
  async ({ id_absen, reason }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.rejectVerification(id_absen, reason);
      return { ...response.data, id_absen };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getVerificationHistory = createAsyncThunk(
  'attendance/getVerificationHistory',
  async (id_absen, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getVerificationHistory(id_absen);
      return { data: response.data.data, id_absen };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const generateStats = createAsyncThunk(
  'attendance/generateStats',
  async ({ startDate, endDate, id_shelter }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.generateStats(startDate, endDate, id_shelter);
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
  studentRecords: {},
  verificationHistory: {},
  stats: null,
  loading: false,
  error: null,
  duplicateError: null,
  lastUpdated: null,
  // Offline support
  offlineQueue: [],
  isSyncing: false
};

// Slice
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    resetAttendanceError: (state) => {
      state.error = null;
      state.duplicateError = null;
    },
    // For offline support
    queueOfflineAttendance: (state, action) => {
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
      // Record attendance by QR
      .addCase(recordAttendanceByQr.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.duplicateError = null;
      })
      .addCase(recordAttendanceByQr.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const attendance = action.payload.data;
          state.attendanceRecords[attendance.id_absen] = attendance;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(recordAttendanceByQr.rejected, (state, action) => {
        state.loading = false;
        
        // Special handling for duplicate records
        if (action.payload?.isDuplicate) {
          state.duplicateError = action.payload.message;
          if (action.payload.existingRecord) {
            const record = action.payload.existingRecord;
            state.attendanceRecords[record.id_absen] = record;
          }
        } else {
          state.error = action.payload?.message || 'Failed to record attendance';
        }
      })
      
      // Record attendance manually
      .addCase(recordAttendanceManually.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.duplicateError = null;
      })
      .addCase(recordAttendanceManually.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const attendance = action.payload.data;
          state.attendanceRecords[attendance.id_absen] = attendance;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(recordAttendanceManually.rejected, (state, action) => {
        state.loading = false;
        
        // Special handling for duplicate records
        if (action.payload?.isDuplicate) {
          state.duplicateError = action.payload.message;
          if (action.payload.existingRecord) {
            const record = action.payload.existingRecord;
            state.attendanceRecords[record.id_absen] = record;
          }
        } else {
          state.error = action.payload?.message || 'Failed to record attendance manually';
        }
      })
      
      // Get attendance by activity
      .addCase(getAttendanceByActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceByActivity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data && Array.isArray(action.payload.data)) {
          const id_aktivitas = action.meta.arg.id_aktivitas;
          state.activityRecords[id_aktivitas] = action.payload.data;
          
          // Also update individual attendance records
          action.payload.data.forEach(record => {
            state.attendanceRecords[record.id_absen] = record;
          });
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getAttendanceByActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get attendance records';
      })
      
      // Get attendance by student
      .addCase(getAttendanceByStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceByStudent.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data && Array.isArray(action.payload.data)) {
          const id_anak = action.meta.arg.id_anak;
          state.studentRecords[id_anak] = action.payload.data;
          
          // Also update individual attendance records
          action.payload.data.forEach(record => {
            state.attendanceRecords[record.id_absen] = record;
          });
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getAttendanceByStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get student attendance records';
      })
      
      // Manual verify
      .addCase(manualVerify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(manualVerify.fulfilled, (state, action) => {
        state.loading = false;
        const { id_absen } = action.payload;
        
        if (state.attendanceRecords[id_absen]) {
          state.attendanceRecords[id_absen].is_verified = true;
          state.attendanceRecords[id_absen].verification_status = 'manual';
        }
        
        // Update in activity records if present
        Object.keys(state.activityRecords).forEach(activityId => {
          state.activityRecords[activityId] = state.activityRecords[activityId].map(record => {
            if (record.id_absen === id_absen) {
              return {
                ...record,
                is_verified: true,
                verification_status: 'manual'
              };
            }
            return record;
          });
        });
        
        // Update in student records if present
        Object.keys(state.studentRecords).forEach(studentId => {
          state.studentRecords[studentId] = state.studentRecords[studentId].map(record => {
            if (record.id_absen === id_absen) {
              return {
                ...record,
                is_verified: true,
                verification_status: 'manual'
              };
            }
            return record;
          });
        });
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(manualVerify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to verify attendance';
      })
      
      // Reject verification
      .addCase(rejectVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectVerification.fulfilled, (state, action) => {
        state.loading = false;
        const { id_absen } = action.payload;
        
        if (state.attendanceRecords[id_absen]) {
          state.attendanceRecords[id_absen].is_verified = false;
          state.attendanceRecords[id_absen].verification_status = 'rejected';
        }
        
        // Update in activity records if present
        Object.keys(state.activityRecords).forEach(activityId => {
          state.activityRecords[activityId] = state.activityRecords[activityId].map(record => {
            if (record.id_absen === id_absen) {
              return {
                ...record,
                is_verified: false,
                verification_status: 'rejected'
              };
            }
            return record;
          });
        });
        
        // Update in student records if present
        Object.keys(state.studentRecords).forEach(studentId => {
          state.studentRecords[studentId] = state.studentRecords[studentId].map(record => {
            if (record.id_absen === id_absen) {
              return {
                ...record,
                is_verified: false,
                verification_status: 'rejected'
              };
            }
            return record;
          });
        });
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(rejectVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to reject verification';
      })
      
      // Get verification history
      .addCase(getVerificationHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVerificationHistory.fulfilled, (state, action) => {
        state.loading = false;
        const { data, id_absen } = action.payload;
        state.verificationHistory[id_absen] = data;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getVerificationHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get verification history';
      })
      
      // Generate stats
      .addCase(generateStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(generateStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to generate statistics';
      });
  }
});

// Actions
export const { 
  resetAttendanceError, 
  queueOfflineAttendance, 
  removeFromOfflineQueue, 
  setSyncing 
} = attendanceSlice.actions;

// Memoized selectors
const emptyArray = [];
const selectAttendanceState = state => state.attendance;
const selectActivityRecords = state => state.attendance.activityRecords;
const selectStudentRecords = state => state.attendance.studentRecords;
const selectVerificationHistoryRecords = state => state.attendance.verificationHistory;

// Selectors
export const selectAttendanceLoading = state => state.attendance.loading;
export const selectAttendanceError = state => state.attendance.error;
export const selectDuplicateError = state => state.attendance.duplicateError;
export const selectAttendanceRecords = state => state.attendance.attendanceRecords;

// Memoized selector for activity attendance to prevent unnecessary re-renders
export const selectActivityAttendance = createSelector(
  [selectActivityRecords, (_, id_aktivitas) => id_aktivitas],
  (activityRecords, id_aktivitas) => activityRecords[id_aktivitas] || emptyArray
);

// Memoized selector for student attendance
export const selectStudentAttendance = createSelector(
  [selectStudentRecords, (_, id_anak) => id_anak],
  (studentRecords, id_anak) => studentRecords[id_anak] || emptyArray
);

// Memoized selector for verification history
export const selectVerificationHistory = createSelector(
  [selectVerificationHistoryRecords, (_, id_absen) => id_absen],
  (verificationHistory, id_absen) => verificationHistory[id_absen] || emptyArray
);

// Selectors for filtering by status
export const selectPresentAttendance = createSelector(
  [selectAttendanceRecords],
  (records) => Object.values(records).filter(record => record.absen === 'Ya')
);

export const selectLateAttendance = createSelector(
  [selectAttendanceRecords],
  (records) => Object.values(records).filter(record => record.absen === 'Terlambat')
);

export const selectAbsentAttendance = createSelector(
  [selectAttendanceRecords],
  (records) => Object.values(records).filter(record => record.absen === 'Tidak')
);

export const selectAttendanceStats = state => state.attendance.stats;
export const selectOfflineQueue = state => state.attendance.offlineQueue;
export const selectIsSyncing = state => state.attendance.isSyncing;

export default attendanceSlice.reducer;