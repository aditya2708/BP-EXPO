import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axiosConfig';
import { getEntityConfig, getEntityApiEndpoints } from '../configs/entityConfigs';

// Initial state template
const createInitialState = () => ({
  // List data
  items: [],
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
  
  // Current item (for detail/edit)
  currentItem: null,
  
  // Dropdown options
  dropdownOptions: [],
  
  // Statistics
  statistics: null,
  
  // Available items (for assign/relationship)
  availableItems: [],
  
  // Loading states
  loading: false,
  listLoading: false,
  itemLoading: false,
  dropdownLoading: false,
  statisticsLoading: false,
  
  // Error states
  error: null,
  listError: null,
  itemError: null,
  dropdownError: null,
  statisticsError: null,
  
  // Cache timestamps
  lastFetch: null,
  lastStatsFetch: null,
  
  // UI state
  filters: {},
  searchQuery: '',
});

// Generic async thunk factory
const createEntityThunks = (entityType) => {
  const config = getEntityConfig(entityType);
  const endpoints = getEntityApiEndpoints(entityType);
  
  if (!config || !endpoints) {
    throw new Error(`Entity config not found for: ${entityType}`);
  }

  const thunks = {};

  // Fetch all items
  thunks.fetchAll = createAsyncThunk(
    `${entityType}/fetchAll`,
    async (params = {}, { rejectWithValue }) => {
      try {
        const response = await api.get(endpoints.list, { params });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  // Fetch by ID
  thunks.fetchById = createAsyncThunk(
    `${entityType}/fetchById`,
    async (id, { rejectWithValue }) => {
      try {
        const response = await api.get(endpoints.detail(id));
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  // Create item
  thunks.create = createAsyncThunk(
    `${entityType}/create`,
    async (data, { rejectWithValue }) => {
      try {
        const response = await api.post(endpoints.create, data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  // Update item
  thunks.update = createAsyncThunk(
    `${entityType}/update`,
    async ({ id, data }, { rejectWithValue }) => {
      try {
        const response = await api.put(endpoints.update(id), data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  // Delete item
  thunks.delete = createAsyncThunk(
    `${entityType}/delete`,
    async (id, { rejectWithValue }) => {
      try {
        const response = await api.delete(endpoints.delete(id));
        return { id, ...response.data };
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  // Fetch dropdown options
  if (endpoints.dropdown) {
    thunks.fetchDropdown = createAsyncThunk(
      `${entityType}/fetchDropdown`,
      async (params = {}, { rejectWithValue }) => {
        try {
          const response = await api.get(endpoints.dropdown, { params });
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
      }
    );
  }

  // Fetch statistics
  if (endpoints.statistics) {
    thunks.fetchStatistics = createAsyncThunk(
      `${entityType}/fetchStatistics`,
      async (params = {}, { rejectWithValue }) => {
        try {
          const response = await api.get(endpoints.statistics, { params });
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
      }
    );
  }

  // Kurikulum specific thunks
  if (entityType === 'kurikulum') {
    thunks.getAvailableMateri = createAsyncThunk(
      `${entityType}/getAvailableMateri`,
      async ({ kurikulumId, params = {} }, { rejectWithValue }) => {
        try {
          const response = await api.get(endpoints.availableMateri(kurikulumId), { params });
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
      }
    );

    thunks.assignMateri = createAsyncThunk(
      `${entityType}/assignMateri`,
      async ({ kurikulumId, materiIds }, { rejectWithValue }) => {
        try {
          const response = await api.post(endpoints.assignMateri(kurikulumId), { 
            materi_ids: materiIds 
          });
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
      }
    );

    thunks.removeMateri = createAsyncThunk(
      `${entityType}/removeMateri`,
      async ({ kurikulumId, materiId }, { rejectWithValue }) => {
        try {
          const response = await api.delete(endpoints.removeMateri(kurikulumId, materiId));
          return { kurikulumId, materiId, ...response.data };
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
      }
    );

    thunks.reorderMateri = createAsyncThunk(
      `${entityType}/reorderMateri`,
      async ({ kurikulumId, materiOrder }, { rejectWithValue }) => {
        try {
          const response = await api.post(endpoints.reorderMateri(kurikulumId), { 
            materi_orders: materiOrder 
          });
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
      }
    );
  }

  return thunks;
};

// Generic slice factory
export const createEntitySlice = (entityType) => {
  const config = getEntityConfig(entityType);
  const thunks = createEntityThunks(entityType);
  
  const slice = createSlice({
    name: entityType,
    initialState: createInitialState(),
    reducers: {
      // Clear current item
      clearCurrentItem: (state) => {
        state.currentItem = null;
        state.itemError = null;
      },
      
      // Set filters
      setFilters: (state, action) => {
        state.filters = action.payload;
      },
      
      // Set search query
      setSearchQuery: (state, action) => {
        state.searchQuery = action.payload;
      },
      
      // Clear errors
      clearErrors: (state) => {
        state.error = null;
        state.listError = null;
        state.itemError = null;
        state.dropdownError = null;
        state.statisticsError = null;
      },
      
      // Reset state
      resetState: () => createInitialState(),
    },
    extraReducers: (builder) => {
      // Fetch all items
      builder
        .addCase(thunks.fetchAll.pending, (state) => {
          state.listLoading = true;
          state.listError = null;
        })
        .addCase(thunks.fetchAll.fulfilled, (state, action) => {
          state.listLoading = false;
          state.items = action.payload.data || [];
          state.totalItems = action.payload.total || 0;
          state.currentPage = action.payload.current_page || 1;
          state.totalPages = action.payload.last_page || 1;
          state.lastFetch = Date.now();
        })
        .addCase(thunks.fetchAll.rejected, (state, action) => {
          state.listLoading = false;
          state.listError = action.payload;
        });

      // Fetch by ID
      builder
        .addCase(thunks.fetchById.pending, (state) => {
          state.itemLoading = true;
          state.itemError = null;
        })
        .addCase(thunks.fetchById.fulfilled, (state, action) => {
          state.itemLoading = false;
          state.currentItem = action.payload.data || action.payload;
        })
        .addCase(thunks.fetchById.rejected, (state, action) => {
          state.itemLoading = false;
          state.itemError = action.payload;
        });

      // Create item
      builder
        .addCase(thunks.create.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunks.create.fulfilled, (state, action) => {
          state.loading = false;
          const newItem = action.payload.data || action.payload;
          state.items.unshift(newItem);
          state.totalItems += 1;
        })
        .addCase(thunks.create.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });

      // Update item
      builder
        .addCase(thunks.update.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunks.update.fulfilled, (state, action) => {
          state.loading = false;
          const updatedItem = action.payload.data || action.payload;
          const index = state.items.findIndex(item => 
            item.id === updatedItem.id || 
            item[`id_${entityType}`] === updatedItem[`id_${entityType}`]
          );
          if (index !== -1) {
            state.items[index] = updatedItem;
          }
          if (state.currentItem) {
            state.currentItem = updatedItem;
          }
        })
        .addCase(thunks.update.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });

      // Delete item
      builder
        .addCase(thunks.delete.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunks.delete.fulfilled, (state, action) => {
          state.loading = false;
          const deletedId = action.payload.id;
          state.items = state.items.filter(item => 
            item.id !== deletedId && 
            item[`id_${entityType}`] !== deletedId
          );
          state.totalItems -= 1;
          if (state.currentItem && (
            state.currentItem.id === deletedId || 
            state.currentItem[`id_${entityType}`] === deletedId
          )) {
            state.currentItem = null;
          }
        })
        .addCase(thunks.delete.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });

      // Fetch dropdown
      if (thunks.fetchDropdown) {
        builder
          .addCase(thunks.fetchDropdown.pending, (state) => {
            state.dropdownLoading = true;
            state.dropdownError = null;
          })
          .addCase(thunks.fetchDropdown.fulfilled, (state, action) => {
            state.dropdownLoading = false;
            state.dropdownOptions = action.payload.data || action.payload;
          })
          .addCase(thunks.fetchDropdown.rejected, (state, action) => {
            state.dropdownLoading = false;
            state.dropdownError = action.payload;
          });
      }

      // Fetch statistics
      if (thunks.fetchStatistics) {
        builder
          .addCase(thunks.fetchStatistics.pending, (state) => {
            state.statisticsLoading = true;
            state.statisticsError = null;
          })
          .addCase(thunks.fetchStatistics.fulfilled, (state, action) => {
            state.statisticsLoading = false;
            state.statistics = action.payload;
            state.lastStatsFetch = Date.now();
          })
          .addCase(thunks.fetchStatistics.rejected, (state, action) => {
            state.statisticsLoading = false;
            state.statisticsError = action.payload;
          });
      }

      // Kurikulum specific reducers
      if (entityType === 'kurikulum') {
        builder
          .addCase(thunks.getAvailableMateri.fulfilled, (state, action) => {
            state.availableItems = action.payload.data || action.payload;
          })
          .addCase(thunks.assignMateri.fulfilled, (state, action) => {
            // Refresh current item if needed
            if (state.currentItem) {
              // Could fetch updated kurikulum here or update locally
            }
          })
          .addCase(thunks.removeMateri.fulfilled, (state, action) => {
            // Handle materi removal
            if (state.currentItem && state.currentItem.materi) {
              state.currentItem.materi = state.currentItem.materi.filter(
                m => m.id_materi !== action.payload.materiId
              );
            }
          });
      }
    },
  });

  return { slice, thunks };
};

// Create all entity slices
const entities = ['jenjang', 'mataPelajaran', 'kelas', 'materi', 'kurikulum'];
const entitySlices = {};
const entityThunks = {};

entities.forEach(entityType => {
  const { slice, thunks } = createEntitySlice(entityType);
  entitySlices[entityType] = slice;
  entityThunks[entityType] = thunks;
});

// Export individual slices and thunks
export const jenjangSlice = entitySlices.jenjang;
export const mataPelajaranSlice = entitySlices.mataPelajaran;
export const kelasSlice = entitySlices.kelas;
export const materiSlice = entitySlices.materi;
export const kurikulumSlice = entitySlices.kurikulum;

export const jenjangThunks = entityThunks.jenjang;
export const mataPelajaranThunks = entityThunks.mataPelajaran;
export const kelasThunks = entityThunks.kelas;
export const materiThunks = entityThunks.materi;
export const kurikulumThunks = entityThunks.kurikulum;

// Export reducers
export const jenjangReducer = jenjangSlice.reducer;
export const mataPelajaranReducer = mataPelajaranSlice.reducer;
export const kelasReducer = kelasSlice.reducer;
export const materiReducer = materiSlice.reducer;
export const kurikulumReducer = kurikulumSlice.reducer;

// Universal selectors factory
export const createEntitySelectors = (entityType) => ({
  // List selectors
  selectItems: (state) => state[entityType].items,
  selectTotalItems: (state) => state[entityType].totalItems,
  selectCurrentPage: (state) => state[entityType].currentPage,
  selectTotalPages: (state) => state[entityType].totalPages,
  
  // Current item selectors
  selectCurrentItem: (state) => state[entityType].currentItem,
  
  // Dropdown selectors
  selectDropdownOptions: (state) => state[entityType].dropdownOptions,
  
  // Statistics selectors
  selectStatistics: (state) => state[entityType].statistics,
  
  // Available items (for relationships)
  selectAvailableItems: (state) => state[entityType].availableItems,
  
  // Loading selectors
  selectLoading: (state) => state[entityType].loading,
  selectListLoading: (state) => state[entityType].listLoading,
  selectItemLoading: (state) => state[entityType].itemLoading,
  selectDropdownLoading: (state) => state[entityType].dropdownLoading,
  selectStatisticsLoading: (state) => state[entityType].statisticsLoading,
  
  // Error selectors
  selectError: (state) => state[entityType].error,
  selectListError: (state) => state[entityType].listError,
  selectItemError: (state) => state[entityType].itemError,
  selectDropdownError: (state) => state[entityType].dropdownError,
  selectStatisticsError: (state) => state[entityType].statisticsError,
  
  // UI selectors
  selectFilters: (state) => state[entityType].filters,
  selectSearchQuery: (state) => state[entityType].searchQuery,
  
  // Cache selectors
  selectLastFetch: (state) => state[entityType].lastFetch,
  selectLastStatsFetch: (state) => state[entityType].lastStatsFetch,
});

// Export individual selectors
export const jenjangSelectors = createEntitySelectors('jenjang');
export const mataPelajaranSelectors = createEntitySelectors('mataPelajaran');
export const kelasSelectors = createEntitySelectors('kelas');
export const materiSelectors = createEntitySelectors('materi');
export const kurikulumSelectors = createEntitySelectors('kurikulum');

// Export slice actions
export const jenjangActions = jenjangSlice.actions;
export const mataPelajaranActions = mataPelajaranSlice.actions;
export const kelasActions = kelasSlice.actions;
export const materiActions = materiSlice.actions;
export const kurikulumActions = kurikulumSlice.actions;

// Generic action helpers
export const getEntityActions = (entityType) => {
  return entitySlices[entityType]?.actions;
};

export const getEntityThunks = (entityType) => {
  return entityThunks[entityType];
};

export const getEntitySelectors = (entityType) => {
  return createEntitySelectors(entityType);
};