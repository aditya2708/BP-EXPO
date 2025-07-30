// src/features/adminCabang/stores/masterDataStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { jenjangApi } from '../api/masterData/jenjangApi';
import { mataPelajaranApi } from '../api/masterData/mataPelajaranApi';
import { kelasApi } from '../api/masterData/kelasApi';
import { materiApi } from '../api/masterData/materiApi';

// Entity types definition
const ENTITIES = {
  JENJANG: 'jenjang',
  MATA_PELAJARAN: 'mataPelajaran',
  KELAS: 'kelas',
  MATERI: 'materi',
  KURIKULUM: 'kurikulum'
};

// API mapping
const apiMap = {
  [ENTITIES.JENJANG]: jenjangApi,
  [ENTITIES.MATA_PELAJARAN]: mataPelajaranApi,
  [ENTITIES.KELAS]: kelasApi,
  [ENTITIES.MATERI]: materiApi
};

const useMasterDataStore = create(
  devtools(
    (set, get) => ({
      // ==================== STATE ====================
      
      // Normalized data storage
      entities: {
        [ENTITIES.JENJANG]: {},
        [ENTITIES.MATA_PELAJARAN]: {},
        [ENTITIES.KELAS]: {},
        [ENTITIES.MATERI]: {},
        [ENTITIES.KURIKULUM]: {}
      },
      
      // Metadata
      lastFetch: {},
      relationships: {},
      totalCounts: {},
      
      // ==================== COMPUTED GETTERS ====================
      
      // Get all entities as array
      getEntitiesArray: (entityType) => {
        const entities = get().entities[entityType];
        return Object.values(entities || {});
      },
      
      // Get entity by ID
      getEntityById: (entityType, id) => {
        return get().entities[entityType]?.[id] || null;
      },
      
      // Get entities with relationships
      getEntitiesWithRelations: (entityType) => {
        const entities = get().getEntitiesArray(entityType);
        const state = get();
        
        return entities.map(entity => {
          const withRelations = { ...entity };
          
          // Add jenjang relation for mata_pelajaran
          if (entityType === ENTITIES.MATA_PELAJARAN && entity.id_jenjang) {
            withRelations.jenjang = state.getEntityById(ENTITIES.JENJANG, entity.id_jenjang);
          }
          
          // Add jenjang relation for kelas
          if (entityType === ENTITIES.KELAS && entity.id_jenjang) {
            withRelations.jenjang = state.getEntityById(ENTITIES.JENJANG, entity.id_jenjang);
          }
          
          // Add mata_pelajaran & kelas relations for materi
          if (entityType === ENTITIES.MATERI) {
            if (entity.id_mata_pelajaran) {
              withRelations.mataPelajaran = state.getEntityById(ENTITIES.MATA_PELAJARAN, entity.id_mata_pelajaran);
            }
            if (entity.id_kelas) {
              withRelations.kelas = state.getEntityById(ENTITIES.KELAS, entity.id_kelas);
            }
          }
          
          return withRelations;
        });
      },
      
      // ==================== ACTIONS ====================
      
      actions: {
        // Load entities with caching
        load: async (entityType, params = {}) => {
          const api = apiMap[entityType];
          if (!api) throw new Error(`API not found for entity: ${entityType}`);
          
          try {
            const response = await api.getAll(params);
            
            if (response.success) {
              // Normalize data by ID
              const normalized = {};
              const data = response.data || [];
              
              data.forEach(item => {
                const id = item.id_jenjang || item.id_mata_pelajaran || 
                          item.id_kelas || item.id_materi || item.id;
                if (id) normalized[id] = item;
              });
              
              set(state => ({
                entities: {
                  ...state.entities,
                  [entityType]: normalized
                },
                lastFetch: {
                  ...state.lastFetch,
                  [entityType]: Date.now()
                },
                totalCounts: {
                  ...state.totalCounts,
                  [entityType]: data.length
                }
              }), false, `masterData/load/${entityType}`);
              
              return { success: true, data };
            }
            
            throw new Error(response.message || 'Failed to load data');
          } catch (error) {
            throw error;
          }
        },
        
        // Load dropdown data (optimized)
        loadDropdown: async (entityType, params = {}) => {
          const api = apiMap[entityType];
          if (!api?.getDropdown) throw new Error(`Dropdown API not found for: ${entityType}`);
          
          try {
            const response = await api.getDropdown(params);
            
            if (response.success) {
              const normalized = {};
              const data = response.data || [];
              
              data.forEach(item => {
                const id = item.id_jenjang || item.id_mata_pelajaran || 
                          item.id_kelas || item.id_materi || item.id;
                if (id) normalized[id] = item;
              });
              
              set(state => ({
                entities: {
                  ...state.entities,
                  [entityType]: { ...state.entities[entityType], ...normalized }
                },
                lastFetch: {
                  ...state.lastFetch,
                  [`${entityType}_dropdown`]: Date.now()
                }
              }), false, `masterData/loadDropdown/${entityType}`);
              
              return { success: true, data };
            }
            
            throw new Error(response.message || 'Failed to load dropdown');
          } catch (error) {
            throw error;
          }
        },
        
        // Create entity
        create: async (entityType, data) => {
          const api = apiMap[entityType];
          if (!api) throw new Error(`API not found for entity: ${entityType}`);
          
          try {
            const response = await api.create(data);
            
            if (response.success) {
              const newItem = response.data;
              const id = newItem.id_jenjang || newItem.id_mata_pelajaran || 
                        newItem.id_kelas || newItem.id_materi || newItem.id;
              
              set(state => ({
                entities: {
                  ...state.entities,
                  [entityType]: {
                    ...state.entities[entityType],
                    [id]: newItem
                  }
                },
                totalCounts: {
                  ...state.totalCounts,
                  [entityType]: (state.totalCounts[entityType] || 0) + 1
                }
              }), false, `masterData/create/${entityType}`);
              
              return { success: true, data: newItem };
            }
            
            throw new Error(response.message || 'Failed to create');
          } catch (error) {
            throw error;
          }
        },
        
        // Update entity
        update: async (entityType, id, data) => {
          const api = apiMap[entityType];
          if (!api) throw new Error(`API not found for entity: ${entityType}`);
          
          try {
            const response = await api.update(id, data);
            
            if (response.success) {
              const updatedItem = response.data;
              
              set(state => ({
                entities: {
                  ...state.entities,
                  [entityType]: {
                    ...state.entities[entityType],
                    [id]: updatedItem
                  }
                }
              }), false, `masterData/update/${entityType}/${id}`);
              
              return { success: true, data: updatedItem };
            }
            
            throw new Error(response.message || 'Failed to update');
          } catch (error) {
            throw error;
          }
        },
        
        // Delete entity
        delete: async (entityType, id) => {
          const api = apiMap[entityType];
          if (!api) throw new Error(`API not found for entity: ${entityType}`);
          
          try {
            const response = await api.delete(id);
            
            if (response.success) {
              set(state => {
                const newEntities = { ...state.entities[entityType] };
                delete newEntities[id];
                
                return {
                  entities: {
                    ...state.entities,
                    [entityType]: newEntities
                  },
                  totalCounts: {
                    ...state.totalCounts,
                    [entityType]: Math.max(0, (state.totalCounts[entityType] || 0) - 1)
                  }
                };
              }, false, `masterData/delete/${entityType}/${id}`);
              
              return { success: true };
            }
            
            throw new Error(response.message || 'Failed to delete');
          } catch (error) {
            throw error;
          }
        },
        
        // Refresh entity data
        refresh: async (entityType, params = {}) => {
          return get().actions.load(entityType, params);
        },
        
        // Clear entity data
        clear: (entityType) => {
          set(state => ({
            entities: {
              ...state.entities,
              [entityType]: {}
            },
            lastFetch: {
              ...state.lastFetch,
              [entityType]: null
            },
            totalCounts: {
              ...state.totalCounts,
              [entityType]: 0
            }
          }), false, `masterData/clear/${entityType}`);
        },
        
        // Clear all data
        clearAll: () => {
          set({
            entities: {
              [ENTITIES.JENJANG]: {},
              [ENTITIES.MATA_PELAJARAN]: {},
              [ENTITIES.KELAS]: {},
              [ENTITIES.MATERI]: {},
              [ENTITIES.KURIKULUM]: {}
            },
            lastFetch: {},
            relationships: {},
            totalCounts: {}
          }, false, 'masterData/clearAll');
        }
      }
    }),
    {
      name: 'masterData-store',
      serialize: true
    }
  )
);

// Export entity types for use in other files
export { ENTITIES };
export default useMasterDataStore;