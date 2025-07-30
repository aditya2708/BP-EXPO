// src/features/adminCabang/stores/masterDataStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { jenjangApi } from '../api/masterData/jenjangApi';
import { mataPelajaranApi } from '../api/masterData/mataPelajaranApi';
import { kelasApi } from '../api/masterData/kelasApi';
import { materiApi } from '../api/masterData/materiApi';
import { kurikulumApi } from '../api/masterData/kurikulumApi';

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
  [ENTITIES.MATERI]: materiApi,
  [ENTITIES.KURIKULUM]: kurikulumApi
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
      
      // Pagination data per entity
      pagination: {
        [ENTITIES.JENJANG]: null,
        [ENTITIES.MATA_PELAJARAN]: null,
        [ENTITIES.KELAS]: null,
        [ENTITIES.MATERI]: null,
        [ENTITIES.KURIKULUM]: null
      },
      
      // Statistics per entity
      statistics: {
        [ENTITIES.JENJANG]: null,
        [ENTITIES.MATA_PELAJARAN]: null,
        [ENTITIES.KELAS]: null,
        [ENTITIES.MATERI]: null,
        [ENTITIES.KURIKULUM]: null
      },
      
      // ==================== COMPUTED GETTERS ====================
      
      // Get entity ID from item
      getEntityId: (entityType, item) => {
        const idMap = {
          [ENTITIES.JENJANG]: 'id_jenjang',
          [ENTITIES.MATA_PELAJARAN]: 'id_mata_pelajaran',
          [ENTITIES.KELAS]: 'id_kelas',
          [ENTITIES.MATERI]: 'id_materi',
          [ENTITIES.KURIKULUM]: 'id_kurikulum'
        };
        return item[idMap[entityType]] || item.id;
      },
      
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
          
          // Add jenjang & mata_pelajaran relations for kurikulum
          if (entityType === ENTITIES.KURIKULUM) {
            if (entity.id_jenjang) {
              withRelations.jenjang = state.getEntityById(ENTITIES.JENJANG, entity.id_jenjang);
            }
            if (entity.id_mata_pelajaran) {
              withRelations.mataPelajaran = state.getEntityById(ENTITIES.MATA_PELAJARAN, entity.id_mata_pelajaran);
            }
          }
          
          return withRelations;
        });
      },
      
      // ==================== ACTIONS ====================
      
      actions: {
        // Load entities with caching and pagination
        load: async (entityType, params = {}) => {
          const api = apiMap[entityType];
          if (!api) throw new Error(`API not found for entity: ${entityType}`);
          
          try {
            const response = await api.getAll(params);
            
            if (response.success) {
              // Handle both paginated and non-paginated responses
              const data = response.data?.data || response.data || [];
              const paginationData = response.data?.current_page ? {
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                per_page: response.data.per_page,
                total: response.data.total,
                from: response.data.from,
                to: response.data.to
              } : null;
              
              // Normalize data by ID
              const normalized = {};
              data.forEach(item => {
                const id = get().getEntityId(entityType, item);
                if (id) normalized[id] = item;
              });
              
              set(state => ({
                entities: {
                  ...state.entities,
                  [entityType]: normalized
                },
                pagination: {
                  ...state.pagination,
                  [entityType]: paginationData
                },
                lastFetch: {
                  ...state.lastFetch,
                  [entityType]: Date.now()
                },
                totalCounts: {
                  ...state.totalCounts,
                  [entityType]: paginationData?.total || data.length
                }
              }), false, `masterData/load/${entityType}`);
              
              return { success: true, data, pagination: paginationData };
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
                const id = get().getEntityId(entityType, item);
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
        
        // Load statistics
        loadStatistics: async (entityType) => {
          const api = apiMap[entityType];
          if (!api?.getStatistics) throw new Error(`Statistics API not found for: ${entityType}`);
          
          try {
            const response = await api.getStatistics();
            
            if (response.success) {
              set(state => ({
                statistics: {
                  ...state.statistics,
                  [entityType]: response.data
                }
              }), false, `masterData/loadStatistics/${entityType}`);
              
              return { success: true, data: response.data };
            }
            
            throw new Error(response.message || 'Failed to load statistics');
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
              const id = get().getEntityId(entityType, newItem);
              
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
        
        // Load more data for pagination
        loadMore: async (entityType, params = {}) => {
          const currentPagination = get().pagination[entityType];
          if (!currentPagination || currentPagination.current_page >= currentPagination.last_page) {
            return { success: false, message: 'No more data to load' };
          }
          
          const nextPageParams = {
            ...params,
            page: currentPagination.current_page + 1
          };
          
          try {
            const response = await get().actions.load(entityType, nextPageParams);
            
            if (response.success) {
              // Merge with existing data instead of replacing
              set(state => {
                const existingEntities = state.entities[entityType];
                const newData = response.data || [];
                const merged = { ...existingEntities };
                
                newData.forEach(item => {
                  const id = get().getEntityId(entityType, item);
                  if (id) merged[id] = item;
                });
                
                return {
                  entities: {
                    ...state.entities,
                    [entityType]: merged
                  }
                };
              }, false, `masterData/loadMore/${entityType}`);
            }
            
            return response;
          } catch (error) {
            throw error;
          }
        },
        
        // Clear entity data
        clear: (entityType) => {
          set(state => ({
            entities: {
              ...state.entities,
              [entityType]: {}
            },
            pagination: {
              ...state.pagination,
              [entityType]: null
            },
            statistics: {
              ...state.statistics,
              [entityType]: null
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
            pagination: {
              [ENTITIES.JENJANG]: null,
              [ENTITIES.MATA_PELAJARAN]: null,
              [ENTITIES.KELAS]: null,
              [ENTITIES.MATERI]: null,
              [ENTITIES.KURIKULUM]: null
            },
            statistics: {
              [ENTITIES.JENJANG]: null,
              [ENTITIES.MATA_PELAJARAN]: null,
              [ENTITIES.KELAS]: null,
              [ENTITIES.MATERI]: null,
              [ENTITIES.KURIKULUM]: null
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