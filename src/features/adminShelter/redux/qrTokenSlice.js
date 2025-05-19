import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { qrTokenApi } from '../api/qrTokenApi';

// Async thunks
export const generateToken = createAsyncThunk(
  'qrToken/generate',
  async ({ id_anak, validDays = 30 }, { rejectWithValue }) => {
    try {
      const response = await qrTokenApi.generateToken(id_anak, validDays);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const generateBatchTokens = createAsyncThunk(
  'qrToken/generateBatch',
  async ({ studentIds, validDays = 30 }, { rejectWithValue }) => {
    try {
      const response = await qrTokenApi.generateBatchTokens(studentIds, validDays);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const validateToken = createAsyncThunk(
  'qrToken/validate',
  async (token, { rejectWithValue }) => {
    try {
      const response = await qrTokenApi.validateToken(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getActiveToken = createAsyncThunk(
  'qrToken/getActive',
  async (id_anak, { rejectWithValue }) => {
    try {
      const response = await qrTokenApi.getActiveToken(id_anak);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const invalidateToken = createAsyncThunk(
  'qrToken/invalidate',
  async (token, { rejectWithValue }) => {
    try {
      const response = await qrTokenApi.invalidateToken(token);
      return { ...response.data, token };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Initial state
const initialState = {
  tokens: {},
  studentTokens: {},
  currentToken: null,
  validationResult: null,
  loading: false,
  error: null,
  lastUpdated: null
};

// Slice
const qrTokenSlice = createSlice({
  name: 'qrToken',
  initialState,
  reducers: {
    resetQrTokenError: (state) => {
      state.error = null;
    },
    resetValidationResult: (state) => {
      state.validationResult = null;
    },
    setCurrentToken: (state, action) => {
      state.currentToken = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Generate token
      .addCase(generateToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const token = action.payload.data;
          state.tokens[token.token] = token;
          
          // Store by student ID
          const id_anak = token.id_anak;
          state.studentTokens[id_anak] = token;
          
          // Set as current token
          state.currentToken = token;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(generateToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to generate token';
      })
      
      // Generate batch tokens
      .addCase(generateBatchTokens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateBatchTokens.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data && Array.isArray(action.payload.data)) {
          action.payload.data.forEach(token => {
            state.tokens[token.token] = token;
            state.studentTokens[token.id_anak] = token;
          });
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(generateBatchTokens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to generate batch tokens';
      })
      
      // Validate token
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationResult = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.loading = false;
        state.validationResult = {
          valid: true,
          token: action.payload.data.token,
          anak: action.payload.data.anak
        };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.loading = false;
        state.validationResult = {
          valid: false,
          message: action.payload?.message || 'Invalid token'
        };
        state.error = action.payload?.message || 'Failed to validate token';
      })
      
      // Get active token
      .addCase(getActiveToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const token = action.payload.data;
          state.tokens[token.token] = token;
          state.studentTokens[token.id_anak] = token;
          state.currentToken = token;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getActiveToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get active token';
      })
      
      // Invalidate token
      .addCase(invalidateToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(invalidateToken.fulfilled, (state, action) => {
        state.loading = false;
        const { token } = action.payload;
        
        if (state.tokens[token]) {
          state.tokens[token].is_active = false;
          
          // If this was the current token for a student, clear it
          const id_anak = state.tokens[token].id_anak;
          if (state.studentTokens[id_anak] && state.studentTokens[id_anak].token === token) {
            state.studentTokens[id_anak] = null;
          }
          
          // If this was the current token, clear it
          if (state.currentToken && state.currentToken.token === token) {
            state.currentToken = null;
          }
        }
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(invalidateToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to invalidate token';
      });
  }
});

// Actions
export const { resetQrTokenError, resetValidationResult, setCurrentToken } = qrTokenSlice.actions;

// Selectors
export const selectQrTokenLoading = (state) => state.qrToken.loading;
export const selectQrTokenError = (state) => state.qrToken.error;
export const selectAllTokens = (state) => state.qrToken.tokens;
export const selectStudentToken = (state, id_anak) => state.qrToken.studentTokens[id_anak];
export const selectCurrentToken = (state) => state.qrToken.currentToken;
export const selectValidationResult = (state) => state.qrToken.validationResult;

export default qrTokenSlice.reducer;