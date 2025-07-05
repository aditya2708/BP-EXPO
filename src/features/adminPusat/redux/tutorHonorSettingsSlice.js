import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tutorHonorSettingsApi } from '../api/tutorHonorSettingsApi';

const initialState = {
  settings: [],
  activeSetting: null,
  selectedSetting: null,
  statistics: null,
  preview: null,
  loading: false,
  error: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  },
  actionStatus: {
    create: 'idle',
    update: 'idle',
    delete: 'idle',
    setActive: 'idle'
  },
  actionError: {
    create: null,
    update: null,
    delete: null,
    setActive: null
  },
  paymentSystems: [
    { value: 'flat_monthly', label: 'Honor Bulanan Tetap' },
    { value: 'per_session', label: 'Per Sesi/Pertemuan' },
    { value: 'per_student_category', label: 'Per Kategori Siswa' },
    { value: 'per_hour', label: 'Per Jam' },
    { value: 'base_per_session', label: 'Dasar + Per Sesi' },
    { value: 'base_per_student', label: 'Dasar + Per Siswa' },
    { value: 'base_per_hour', label: 'Dasar + Per Jam' },
    { value: 'session_per_student', label: 'Per Sesi + Per Siswa' }
  ]
};

export const fetchSettings = createAsyncThunk(
  'tutorHonorSettings/fetchSettings',
  async (params, { rejectWithValue }) => {
    try {
      const response = await tutorHonorSettingsApi.getSettings(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    }
  }
);

export const fetchActiveSetting = createAsyncThunk(
  'tutorHonorSettings/fetchActiveSetting',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tutorHonorSettingsApi.getActiveSetting();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active setting');
    }
  }
);

export const fetchSetting = createAsyncThunk(
  'tutorHonorSettings/fetchSetting',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tutorHonorSettingsApi.getSetting(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch setting');
    }
  }
);

export const createSetting = createAsyncThunk(
  'tutorHonorSettings/createSetting',
  async (data, { rejectWithValue }) => {
    try {
      const response = await tutorHonorSettingsApi.createSetting(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create setting');
    }
  }
);

export const updateSetting = createAsyncThunk(
  'tutorHonorSettings/updateSetting',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await tutorHonorSettingsApi.updateSetting(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update setting');
    }
  }
);

export const setActiveSetting = createAsyncThunk(
  'tutorHonorSettings/setActiveSetting',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tutorHonorSettingsApi.setActive(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set active setting');
    }
  }
);

export const deleteSetting = createAsyncThunk(
  'tutorHonorSettings/deleteSetting',
  async (id, { rejectWithValue }) => {
    try {
      await tutorHonorSettingsApi.deleteSetting(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete setting');
    }
  }
);

export const calculatePreview = createAsyncThunk(
  'tutorHonorSettings/calculatePreview',
  async (data, { rejectWithValue }) => {
    try {
      const response = await tutorHonorSettingsApi.calculatePreview(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to calculate preview');
    }
  }
);

export const fetchStatistics = createAsyncThunk(
  'tutorHonorSettings/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tutorHonorSettingsApi.getStatistics();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }
);

const tutorHonorSettingsSlice = createSlice({
  name: 'tutorHonorSettings',
  initialState,
  reducers: {
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
    clearSelectedSetting: (state) => {
      state.selectedSetting = null;
    },
    clearPreview: (state) => {
      state.preview = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchActiveSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSetting = action.payload.data;
      })
      .addCase(fetchActiveSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSetting = action.payload.data;
      })
      .addCase(fetchSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(createSetting.pending, (state) => {
        state.actionStatus.create = 'loading';
        state.actionError.create = null;
      })
      .addCase(createSetting.fulfilled, (state, action) => {
        state.actionStatus.create = 'succeeded';
        state.settings.unshift(action.payload.data);
        if (action.payload.data.is_active) {
          state.activeSetting = action.payload.data;
        }
      })
      .addCase(createSetting.rejected, (state, action) => {
        state.actionStatus.create = 'failed';
        state.actionError.create = action.payload;
      })
      
      .addCase(updateSetting.pending, (state) => {
        state.actionStatus.update = 'loading';
        state.actionError.update = null;
      })
      .addCase(updateSetting.fulfilled, (state, action) => {
        state.actionStatus.update = 'succeeded';
        const index = state.settings.findIndex(s => s.id_setting === action.payload.data.id_setting);
        if (index !== -1) {
          state.settings[index] = action.payload.data;
        }
        if (action.payload.data.is_active) {
          state.activeSetting = action.payload.data;
        }
        if (state.selectedSetting && state.selectedSetting.id_setting === action.payload.data.id_setting) {
          state.selectedSetting = action.payload.data;
        }
      })
      .addCase(updateSetting.rejected, (state, action) => {
        state.actionStatus.update = 'failed';
        state.actionError.update = action.payload;
      })
      
      .addCase(setActiveSetting.pending, (state) => {
        state.actionStatus.setActive = 'loading';
        state.actionError.setActive = null;
      })
      .addCase(setActiveSetting.fulfilled, (state, action) => {
        state.actionStatus.setActive = 'succeeded';
        // Update active status in settings list
        state.settings.forEach(setting => {
          setting.is_active = setting.id_setting === action.payload.data.id_setting;
        });
        state.activeSetting = action.payload.data;
      })
      .addCase(setActiveSetting.rejected, (state, action) => {
        state.actionStatus.setActive = 'failed';
        state.actionError.setActive = action.payload;
      })
      
      .addCase(deleteSetting.pending, (state) => {
        state.actionStatus.delete = 'loading';
        state.actionError.delete = null;
      })
      .addCase(deleteSetting.fulfilled, (state, action) => {
        state.actionStatus.delete = 'succeeded';
        state.settings = state.settings.filter(s => s.id_setting !== action.payload);
        if (state.selectedSetting && state.selectedSetting.id_setting === action.payload) {
          state.selectedSetting = null;
        }
      })
      .addCase(deleteSetting.rejected, (state, action) => {
        state.actionStatus.delete = 'failed';
        state.actionError.delete = action.payload;
      })
      
      .addCase(calculatePreview.fulfilled, (state, action) => {
        state.preview = action.payload.data;
      })
      
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload.data;
      });
  }
});

export const {
  resetError,
  resetActionStatus,
  clearSelectedSetting,
  clearPreview
} = tutorHonorSettingsSlice.actions;

// Selectors
export const selectSettings = state => state.tutorHonorSettings.settings;
export const selectActiveSetting = state => state.tutorHonorSettings.activeSetting;
export const selectSelectedSetting = state => state.tutorHonorSettings.selectedSetting;
export const selectStatistics = state => state.tutorHonorSettings.statistics;
export const selectPreview = state => state.tutorHonorSettings.preview;
export const selectLoading = state => state.tutorHonorSettings.loading;
export const selectError = state => state.tutorHonorSettings.error;
export const selectPagination = state => state.tutorHonorSettings.pagination;
export const selectActionStatus = (state, action) => state.tutorHonorSettings.actionStatus[action];
export const selectActionError = (state, action) => state.tutorHonorSettings.actionError[action];
export const selectPaymentSystems = state => state.tutorHonorSettings.paymentSystems;

export default tutorHonorSettingsSlice.reducer;