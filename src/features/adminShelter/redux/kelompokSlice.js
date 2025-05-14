import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminShelterKelompokApi } from '../api/adminShelterKelompokApi';

// Initial state
const initialState = {
  kelompokList: [],
  selectedKelompok: null,
  availableChildren: [],
  groupChildren: [],
  levels: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentPage: 1,
  totalPages: 1,
  total: 0,
  perPage: 10,
  filters: {
    search: '',
    levelId: ''
  },
  actionStatus: {
    create: 'idle',
    update: 'idle',
    delete: 'idle',
    addChild: 'idle',
    removeChild: 'idle'
  },
  actionError: {
    create: null,
    update: null,
    delete: null,
    addChild: null,
    removeChild: null
  }
};

// Async thunks for API calls
export const fetchKelompok = createAsyncThunk(
  'kelompok/fetchKelompok',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { kelompok } = getState();
      const queryParams = {
        page: params.page || kelompok.currentPage,
        per_page: params.perPage || kelompok.perPage,
        search: params.search !== undefined ? params.search : kelompok.filters.search,
        id_level_anak_binaan: params.levelId !== undefined ? params.levelId : kelompok.filters.levelId
      };

      const response = await adminShelterKelompokApi.getAllKelompok(queryParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch groups');
    }
  }
);

export const fetchKelompokDetail = createAsyncThunk(
  'kelompok/fetchKelompokDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminShelterKelompokApi.getKelompokDetail(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch group details');
    }
  }
);

export const createKelompok = createAsyncThunk(
  'kelompok/createKelompok',
  async (kelompokData, { rejectWithValue }) => {
    try {
      const response = await adminShelterKelompokApi.createKelompok(kelompokData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create group');
    }
  }
);

export const updateKelompok = createAsyncThunk(
  'kelompok/updateKelompok',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await adminShelterKelompokApi.updateKelompok(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update group');
    }
  }
);

export const deleteKelompok = createAsyncThunk(
  'kelompok/deleteKelompok',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminShelterKelompokApi.deleteKelompok(id);
      return { id, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete group');
    }
  }
);

export const fetchLevels = createAsyncThunk(
  'kelompok/fetchLevels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminShelterKelompokApi.getLevels();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch levels');
    }
  }
);

export const fetchAvailableChildren = createAsyncThunk(
  'kelompok/fetchAvailableChildren',
  async (shelterId, { rejectWithValue }) => {
    try {
      const response = await adminShelterKelompokApi.getAvailableChildren(shelterId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch available children');
    }
  }
);

export const fetchGroupChildren = createAsyncThunk(
  'kelompok/fetchGroupChildren',
  async (kelompokId, { rejectWithValue }) => {
    try {
      const response = await adminShelterKelompokApi.getGroupChildren(kelompokId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch group children');
    }
  }
);

export const addChildToGroup = createAsyncThunk(
  'kelompok/addChildToGroup',
  async ({ kelompokId, childId }, { rejectWithValue }) => {
    try {
      const response = await adminShelterKelompokApi.addChildToGroup(kelompokId, childId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add child to group');
    }
  }
);

export const removeChildFromGroup = createAsyncThunk(
  'kelompok/removeChildFromGroup',
  async ({ kelompokId, childId }, { rejectWithValue }) => {
    try {
      const response = await adminShelterKelompokApi.removeChildFromGroup(kelompokId, childId);
      return { childId, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove child from group');
    }
  }
);

export const moveChildToShelter = createAsyncThunk(
  'kelompok/moveChildToShelter',
  async ({ childId, shelterId }, { rejectWithValue }) => {
    try {
      const response = await adminShelterKelompokApi.moveChildToShelter(childId, shelterId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to move child to shelter');
    }
  }
);

// Slice
const kelompokSlice = createSlice({
  name: 'kelompok',
  initialState,
  reducers: {
    resetKelompokDetail: (state) => {
      state.selectedKelompok = null;
    },
    resetAvailableChildren: (state) => {
      state.availableChildren = [];
    },
    resetGroupChildren: (state) => {
      state.groupChildren = [];
    },
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    setLevelFilter: (state, action) => {
      state.filters.levelId = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        levelId: ''
      };
    },
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    resetActionStatus: (state, action) => {
      const actionType = action.payload;
      if (actionType && state.actionStatus[actionType]) {
        state.actionStatus[actionType] = 'idle';
        state.actionError[actionType] = null;
      } else {
        // Reset all action statuses
        Object.keys(state.actionStatus).forEach(key => {
          state.actionStatus[key] = 'idle';
          state.actionError[key] = null;
        });
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch Kelompok List
    builder
      .addCase(fetchKelompok.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchKelompok.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.kelompokList = action.payload.data || [];
        
        // Update pagination data if available
        if (action.payload.pagination) {
          state.currentPage = action.payload.pagination.current_page || 1;
          state.totalPages = action.payload.pagination.last_page || 1;
          state.total = action.payload.pagination.total || 0;
          state.perPage = action.payload.pagination.per_page || 10;
        }
        
        // Update summary data if available
        if (action.payload.summary) {
          state.total = action.payload.summary.total_kelompok || 0;
        }
      })
      .addCase(fetchKelompok.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch groups';
      })
      
    // Fetch Kelompok Detail
      .addCase(fetchKelompokDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchKelompokDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedKelompok = action.payload.data;
      })
      .addCase(fetchKelompokDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch group details';
      })
      
    // Create Kelompok
      .addCase(createKelompok.pending, (state) => {
        state.actionStatus.create = 'loading';
      })
      .addCase(createKelompok.fulfilled, (state, action) => {
        state.actionStatus.create = 'succeeded';
        // Add the new kelompok to the list if it's not already there
        const exists = state.kelompokList.some(k => k.id_kelompok === action.payload.data.id_kelompok);
        if (!exists) {
          state.kelompokList.unshift(action.payload.data);
        }
      })
      .addCase(createKelompok.rejected, (state, action) => {
        state.actionStatus.create = 'failed';
        state.actionError.create = action.payload || 'Failed to create group';
      })
      
    // Update Kelompok
      .addCase(updateKelompok.pending, (state) => {
        state.actionStatus.update = 'loading';
      })
      .addCase(updateKelompok.fulfilled, (state, action) => {
        state.actionStatus.update = 'succeeded';
        // Update in the kelompokList
        const index = state.kelompokList.findIndex(k => k.id_kelompok === action.payload.data.id_kelompok);
        if (index !== -1) {
          state.kelompokList[index] = action.payload.data;
        }
        // Update selectedKelompok if it's the same one
        if (state.selectedKelompok && state.selectedKelompok.id_kelompok === action.payload.data.id_kelompok) {
          state.selectedKelompok = action.payload.data;
        }
      })
      .addCase(updateKelompok.rejected, (state, action) => {
        state.actionStatus.update = 'failed';
        state.actionError.update = action.payload || 'Failed to update group';
      })
      
    // Delete Kelompok
      .addCase(deleteKelompok.pending, (state) => {
        state.actionStatus.delete = 'loading';
      })
      .addCase(deleteKelompok.fulfilled, (state, action) => {
        state.actionStatus.delete = 'succeeded';
        // Remove from kelompokList
        state.kelompokList = state.kelompokList.filter(k => k.id_kelompok !== action.payload.id);
        // Clear selectedKelompok if it's the same one
        if (state.selectedKelompok && state.selectedKelompok.id_kelompok === action.payload.id) {
          state.selectedKelompok = null;
        }
      })
      .addCase(deleteKelompok.rejected, (state, action) => {
        state.actionStatus.delete = 'failed';
        state.actionError.delete = action.payload || 'Failed to delete group';
      })
      
    // Fetch Levels
      .addCase(fetchLevels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLevels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.levels = action.payload.data || [];
      })
      .addCase(fetchLevels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch levels';
      })
      
    // Fetch Available Children
      .addCase(fetchAvailableChildren.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAvailableChildren.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.availableChildren = action.payload.data || [];
      })
      .addCase(fetchAvailableChildren.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch available children';
      })
      
    // Fetch Group Children
      .addCase(fetchGroupChildren.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGroupChildren.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.groupChildren = action.payload.data || [];
      })
      .addCase(fetchGroupChildren.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch group children';
      })
      
    // Add Child To Group
      .addCase(addChildToGroup.pending, (state) => {
        state.actionStatus.addChild = 'loading';
      })
      .addCase(addChildToGroup.fulfilled, (state, action) => {
        state.actionStatus.addChild = 'succeeded';
        // Add child to groupChildren
        state.groupChildren.push(action.payload.data);
        // Remove child from availableChildren
        state.availableChildren = state.availableChildren.filter(
          child => child.id_anak !== action.payload.data.id_anak
        );
        
        // Update count in selectedKelompok if it exists
        if (state.selectedKelompok) {
          state.selectedKelompok = {
            ...state.selectedKelompok,
            anak_count: (state.selectedKelompok.anak_count || 0) + 1
          };
        }
      })
      .addCase(addChildToGroup.rejected, (state, action) => {
        state.actionStatus.addChild = 'failed';
        state.actionError.addChild = action.payload || 'Failed to add child to group';
      })
      
    // Remove Child From Group
      .addCase(removeChildFromGroup.pending, (state) => {
        state.actionStatus.removeChild = 'loading';
      })
      .addCase(removeChildFromGroup.fulfilled, (state, action) => {
        state.actionStatus.removeChild = 'succeeded';
        // Remove child from groupChildren
        state.groupChildren = state.groupChildren.filter(
          child => child.id_anak !== action.payload.childId
        );
        
        // Update count in selectedKelompok if it exists
        if (state.selectedKelompok && state.selectedKelompok.anak_count > 0) {
          state.selectedKelompok = {
            ...state.selectedKelompok,
            anak_count: state.selectedKelompok.anak_count - 1
          };
        }
      })
      .addCase(removeChildFromGroup.rejected, (state, action) => {
        state.actionStatus.removeChild = 'failed';
        state.actionError.removeChild = action.payload || 'Failed to remove child from group';
      })
      
    // Move Child To Shelter
      .addCase(moveChildToShelter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(moveChildToShelter.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Remove child from groupChildren
        state.groupChildren = state.groupChildren.filter(
          child => child.id_anak !== action.payload.data.id_anak
        );
        
        // Update count in selectedKelompok if it exists
        if (state.selectedKelompok && state.selectedKelompok.anak_count > 0) {
          state.selectedKelompok = {
            ...state.selectedKelompok,
            anak_count: state.selectedKelompok.anak_count - 1
          };
        }
      })
      .addCase(moveChildToShelter.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to move child to shelter';
      });
  }
});

// Export actions
export const {
  resetKelompokDetail,
  resetAvailableChildren,
  resetGroupChildren,
  setSearchFilter,
  setLevelFilter,
  resetFilters,
  resetStatus,
  resetActionStatus
} = kelompokSlice.actions;

// Export selectors
export const selectAllKelompok = state => state.kelompok.kelompokList;
export const selectKelompokById = (state, kelompokId) => 
  state.kelompok.kelompokList.find(kelompok => kelompok.id_kelompok === kelompokId);
export const selectSelectedKelompok = state => state.kelompok.selectedKelompok;
export const selectAvailableChildren = state => state.kelompok.availableChildren;
export const selectGroupChildren = state => state.kelompok.groupChildren;
export const selectLevels = state => state.kelompok.levels;
export const selectKelompokStatus = state => state.kelompok.status;
export const selectKelompokError = state => state.kelompok.error;
export const selectKelompokPagination = state => ({
  currentPage: state.kelompok.currentPage,
  totalPages: state.kelompok.totalPages,
  total: state.kelompok.total,
  perPage: state.kelompok.perPage
});
export const selectKelompokFilters = state => state.kelompok.filters;
export const selectKelompokActionStatus = (state, action) => state.kelompok.actionStatus[action];
export const selectKelompokActionError = (state, action) => state.kelompok.actionError[action];

// Export reducer
export default kelompokSlice.reducer;