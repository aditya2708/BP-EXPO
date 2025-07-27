// logic/entityRedux.js
// Unified Redux state management for all entities

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEntityConfig, ENTITY_TYPES } from '../configs/entityConfigs';
import api from '../../../api/axiosConfig';

// =============================================================================
// ASYNC THUNKS FACTORY
// =============================================================================

const createEntityThunks = (entityType) => {
  const config = getEntityConfig(entityType);
  
  const fetchAll = createAsyncThunk(
    `${entityType}/fetchAll`,
    async (params = {}, { rejectWithValue }) => {
      try {
        const response = await api.get(config.api.endpoints.list, { params });
        return {
          items: response.data.data || response.data,
          meta: response.data.meta || {}
        };
      } catch (error) {
        return rejectWithValue({
          message: error.response?.data?.message || `Gagal memuat ${config.ui.title}`,
          status: error.response?.status
        });
      }
    }
  );
  
  const fetchById = createAsyncThunk(
    `${entityType}/fetchById`,
    async ({ id }, { rejectWithValue }) => {
      try {
        const response = await api.get(config.api.endpoints.detail(id));
        return response.data.data || response.data;
      } catch (error) {
        return rejectWithValue({
          message: error.response?.data?.message || `Gagal memuat detail ${config.ui.title}`,
          status: error.response?.status
        });
      }
    }
  );
  
  const create = createAsyncThunk(
    `${entityType}/create`,
    async (data, { rejectWithValue }) => {
      try {
        const response = await api.post(config.api.endpoints.create, data);
        return response.data.data || response.data;
      } catch (error) {
        return rejectWithValue({
          message: error.response?.data?.message || `Gagal menambahkan ${config.ui.title}`,
          status: error.response?.status,
          errors: error.response?.data?.errors
        });
      }
    }
  );
  
  const update = createAsyncThunk(
    `${entityType}/update`,
    async ({ id, data }, { rejectWithValue }) => {
      try {
        const response = await api.put(config.api.endpoints.update(id), data);
        return response.data.data || response.data;
      } catch (error) {
        return rejectWithValue({
          message: error.response?.data?.message || `Gagal mengupdate ${config.ui.title}`,
          status: error.response?.status,
          errors: error.response?.data?.errors
        });
      }
    }
  );
  
  const remove = createAsyncThunk(
    `${entityType}/delete`,
    async ({ id }, { rejectWithValue }) => {
      try {
        await api.delete(config.api.endpoints.delete(id));
        return { id };
      } catch (error) {
        return rejectWithValue({
          message: error.response?.data?.message || `Gagal menghapus ${config.ui.title}`,
          status: error.response?.status
        });
      }
    }
  );
  
  return { fetchAll, fetchById, create, update, remove };
};

// =============================================================================
// SLICE FACTORY
// =============================================================================

const createEntitySlice = (entityType) => {
  const thunks = createEntityThunks(entityType);
  
  const initialState = {
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    },
    cache: {},
    lastFetch: null
  };
  
  const slice = createSlice({
    name: entityType,
    initialState,
    reducers: {
      clearCurrent: (state) => {
        state.currentItem = null;
        state.error = null;
      },
      clearError: (state) => {
        state.error = null;
      },
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
      updateItem: (state, action) => {
        const { id, data } = action.payload;
        const index = state.items.findIndex(item => item.id === id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...data };
        }
        if (state.currentItem?.id === id) {
          state.currentItem = { ...state.currentItem, ...data };
        }
      },
      removeFromList: (state, action) => {
        const id = action.payload;
        state.items = state.items.filter(item => item.id !== id);
        if (state.currentItem?.id === id) {
          state.currentItem = null;
        }
      },
      addToList: (state, action) => {
        state.items.unshift(action.payload);
      },
      setCacheData: (state, action) => {
        const { key, data } = action.payload;
        state.cache[key] = {
          data,
          timestamp: Date.now()
        };
      },
      clearCache: (state, action) => {
        if (action.payload) {
          delete state.cache[action.payload];
        } else {
          state.cache = {};
        }
      }
    },
    extraReducers: (builder) => {
      // Fetch All
      builder
        .addCase(thunks.fetchAll.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunks.fetchAll.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload.items;
          state.meta = action.payload.meta;
          state.lastFetch = Date.now();
        })
        .addCase(thunks.fetchAll.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
      
      // Fetch By ID
      builder
        .addCase(thunks.fetchById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunks.fetchById.fulfilled, (state, action) => {
          state.loading = false;
          state.currentItem = action.payload;
        })
        .addCase(thunks.fetchById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
      
      // Create
      builder
        .addCase(thunks.create.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunks.create.fulfilled, (state, action) => {
          state.loading = false;
          state.items.unshift(action.payload);
          state.currentItem = action.payload;
        })
        .addCase(thunks.create.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
      
      // Update
      builder
        .addCase(thunks.update.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunks.update.fulfilled, (state, action) => {
          state.loading = false;
          const updatedItem = action.payload;
          const index = state.items.findIndex(item => item.id === updatedItem.id);
          if (index !== -1) {
            state.items[index] = updatedItem;
          }
          state.currentItem = updatedItem;
        })
        .addCase(thunks.update.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
      
      // Delete
      builder
        .addCase(thunks.remove.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunks.remove.fulfilled, (state, action) => {
          state.loading = false;
          const { id } = action.payload;
          state.items = state.items.filter(item => item.id !== id);
          if (state.currentItem?.id === id) {
            state.currentItem = null;
          }
        })
        .addCase(thunks.remove.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  return {
    slice,
    thunks,
    actions: slice.actions,
    reducer: slice.reducer
  };
};

// =============================================================================
// CREATE ALL ENTITY SLICES
// =============================================================================

const entitySlices = {};
const entityThunks = {};
const entityActions = {};

Object.values(ENTITY_TYPES).forEach(entityType => {
  const entitySlice = createEntitySlice(entityType);
  entitySlices[entityType] = entitySlice;
  entityThunks[entityType] = entitySlice.thunks;
  entityActions[entityType] = entitySlice.actions;
});

// =============================================================================
// COMBINED REDUCER
// =============================================================================

export const entitiesReducer = {
  [ENTITY_TYPES.JENJANG]: entitySlices[ENTITY_TYPES.JENJANG].reducer,
  [ENTITY_TYPES.MATA_PELAJARAN]: entitySlices[ENTITY_TYPES.MATA_PELAJARAN].reducer,
  [ENTITY_TYPES.KELAS]: entitySlices[ENTITY_TYPES.KELAS].reducer,
  [ENTITY_TYPES.MATERI]: entitySlices[ENTITY_TYPES.MATERI].reducer,
  [ENTITY_TYPES.KURIKULUM]: entitySlices[ENTITY_TYPES.KURIKULUM].reducer
};

// =============================================================================
// SELECTORS
// =============================================================================

export const createEntitySelectors = (entityType) => ({
  selectItems: (state) => state.entities[entityType]?.items || [],
  selectCurrentItem: (state) => state.entities[entityType]?.currentItem || null,
  selectLoading: (state) => state.entities[entityType]?.loading || false,
  selectError: (state) => state.entities[entityType]?.error || null,
  selectMeta: (state) => state.entities[entityType]?.meta || {},
  selectItemById: (id) => (state) => 
    state.entities[entityType]?.items?.find(item => item.id === id) || null,
  selectFilteredItems: (searchQuery, filters = {}) => (state) => {
    const items = state.entities[entityType]?.items || [];
    let filtered = [...items];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const config = getEntityConfig(entityType);
      filtered = filtered.filter(item =>
        config.search.fields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(query);
        })
      );
    }
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        filtered = filtered.filter(item => item[key] === value);
      }
    });
    
    return filtered;
  }
});

// =============================================================================
// SPECIAL THUNKS FOR SPECIFIC ENTITIES
// =============================================================================

// Kurikulum specific thunks
export const kurikulumThunks = {
  ...entityThunks[ENTITY_TYPES.KURIKULUM],
  
  setActive: createAsyncThunk(
    'kurikulum/setActive',
    async ({ id }, { rejectWithValue }) => {
      try {
        const config = getEntityConfig(ENTITY_TYPES.KURIKULUM);
        const response = await api.post(config.api.endpoints.setActive(id));
        return response.data.data || response.data;
      } catch (error) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Gagal mengaktifkan kurikulum',
          status: error.response?.status
        });
      }
    }
  ),
  
  addMateri: createAsyncThunk(
    'kurikulum/addMateri',
    async ({ id, materiIds }, { rejectWithValue }) => {
      try {
        const config = getEntityConfig(ENTITY_TYPES.KURIKULUM);
        const response = await api.post(config.api.endpoints.addMateri(id), {
          materi_ids: materiIds
        });
        return response.data.data || response.data;
      } catch (error) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Gagal menambahkan materi',
          status: error.response?.status
        });
      }
    }
  ),
  
  removeMateri: createAsyncThunk(
    'kurikulum/removeMateri',
    async ({ id, materiId }, { rejectWithValue }) => {
      try {
        const config = getEntityConfig(ENTITY_TYPES.KURIKULUM);
        await api.delete(config.api.endpoints.removeMateri(id, materiId));
        return { kurikulumId: id, materiId };
      } catch (error) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Gagal menghapus materi',
          status: error.response?.status
        });
      }
    }
  )
};

// =============================================================================
// OPTIONS LOADER THUNKS
// =============================================================================

export const optionsThunks = {
  loadJenjangOptions: createAsyncThunk(
    'options/loadJenjang',
    async (_, { rejectWithValue }) => {
      try {
        const config = getEntityConfig(ENTITY_TYPES.JENJANG);
        const response = await api.get(config.api.endpoints.list);
        return response.data.data || response.data;
      } catch (error) {
        return rejectWithValue({
          message: 'Gagal memuat opsi jenjang'
        });
      }
    }
  ),
  
  loadMataPelajaranOptions: createAsyncThunk(
    'options/loadMataPelajaran',
    async (_, { rejectWithValue }) => {
      try {
        const config = getEntityConfig(ENTITY_TYPES.MATA_PELAJARAN);
        const response = await api.get(config.api.endpoints.list);
        return response.data.data || response.data;
      } catch (error) {
        return rejectWithValue({
          message: 'Gagal memuat opsi mata pelajaran'
        });
      }
    }
  ),
  
  loadKategoriOptions: createAsyncThunk(
    'options/loadKategori',
    async (_, { rejectWithValue }) => {
      try {
        const config = getEntityConfig(ENTITY_TYPES.MATA_PELAJARAN);
        const response = await api.get(config.api.endpoints.categories);
        return response.data.data || response.data;
      } catch (error) {
        return rejectWithValue({
          message: 'Gagal memuat opsi kategori'
        });
      }
    }
  )
};

// Options slice
const optionsSlice = createSlice({
  name: 'options',
  initialState: {
    jenjang: [],
    mataPelajaran: [],
    kategori: [],
    loading: {
      jenjang: false,
      mataPelajaran: false,
      kategori: false
    },
    error: null
  },
  reducers: {
    clearOptionsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Jenjang options
    builder
      .addCase(optionsThunks.loadJenjangOptions.pending, (state) => {
        state.loading.jenjang = true;
      })
      .addCase(optionsThunks.loadJenjangOptions.fulfilled, (state, action) => {
        state.loading.jenjang = false;
        state.jenjang = action.payload;
      })
      .addCase(optionsThunks.loadJenjangOptions.rejected, (state, action) => {
        state.loading.jenjang = false;
        state.error = action.payload;
      });
    
    // Mata Pelajaran options
    builder
      .addCase(optionsThunks.loadMataPelajaranOptions.pending, (state) => {
        state.loading.mataPelajaran = true;
      })
      .addCase(optionsThunks.loadMataPelajaranOptions.fulfilled, (state, action) => {
        state.loading.mataPelajaran = false;
        state.mataPelajaran = action.payload;
      })
      .addCase(optionsThunks.loadMataPelajaranOptions.rejected, (state, action) => {
        state.loading.mataPelajaran = false;
        state.error = action.payload;
      });
    
    // Kategori options
    builder
      .addCase(optionsThunks.loadKategoriOptions.pending, (state) => {
        state.loading.kategori = true;
      })
      .addCase(optionsThunks.loadKategoriOptions.fulfilled, (state, action) => {
        state.loading.kategori = false;
        state.kategori = action.payload;
      })
      .addCase(optionsThunks.loadKategoriOptions.rejected, (state, action) => {
        state.loading.kategori = false;
        state.error = action.payload;
      });
  }
});

// =============================================================================
// EXPORTS
// =============================================================================

export { entityThunks, entityActions };
export const optionsActions = optionsSlice.actions;
export const optionsReducer = optionsSlice.reducer;

// Export individual entity selectors
export const jenjangSelectors = createEntitySelectors(ENTITY_TYPES.JENJANG);
export const mataPelajaranSelectors = createEntitySelectors(ENTITY_TYPES.MATA_PELAJARAN);
export const kelasSelectors = createEntitySelectors(ENTITY_TYPES.KELAS);
export const materiSelectors = createEntitySelectors(ENTITY_TYPES.MATERI);
export const kurikulumSelectors = createEntitySelectors(ENTITY_TYPES.KURIKULUM);

// Export options selectors
export const optionsSelectors = {
  selectJenjangOptions: (state) => state.options?.jenjang || [],
  selectMataPelajaranOptions: (state) => state.options?.mataPelajaran || [],
  selectKategoriOptions: (state) => state.options?.kategori || [],
  selectOptionsLoading: (state) => state.options?.loading || {},
  selectOptionsError: (state) => state.options?.error
};

export default entitiesReducer;