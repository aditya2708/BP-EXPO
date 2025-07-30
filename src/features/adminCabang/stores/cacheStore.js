// src/features/adminCabang/stores/cacheStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ENTITIES } from './masterDataStore';

// Simple cache configuration
const CACHE_CONFIG = {
  // TTL in milliseconds - Simple approach
  TTL: {
    [ENTITIES.JENJANG]: 15 * 60 * 1000, // 15 minutes (stable data)
    [ENTITIES.MATA_PELAJARAN]: 10 * 60 * 1000, // 10 minutes
    [ENTITIES.KELAS]: 10 * 60 * 1000, // 10 minutes
    [ENTITIES.MATERI]: 5 * 60 * 1000, // 5 minutes (dynamic data)
    [ENTITIES.KURIKULUM]: 5 * 60 * 1000, // 5 minutes
    dropdown: 20 * 60 * 1000, // 20 minutes
    statistics: 2 * 60 * 1000, // 2 minutes
    default: 5 * 60 * 1000 // Default 5 minutes
  },
  
  // Simple invalidation rules
  INVALIDATION_RULES: {
    [ENTITIES.JENJANG]: [ENTITIES.MATA_PELAJARAN, ENTITIES.KELAS, ENTITIES.MATERI],
    [ENTITIES.MATA_PELAJARAN]: [ENTITIES.MATERI],
    [ENTITIES.KELAS]: [ENTITIES.MATERI],
    [ENTITIES.MATERI]: [ENTITIES.KURIKULUM]
  }
};

const useCacheStore = create(
  devtools(
    (set, get) => ({
      // ==================== STATE ====================
      
      // Simple cache storage
      cache: {
        // Entity data cache
        entities: {
          [ENTITIES.JENJANG]: new Map(),
          [ENTITIES.MATA_PELAJARAN]: new Map(),
          [ENTITIES.KELAS]: new Map(),
          [ENTITIES.MATERI]: new Map(),
          [ENTITIES.KURIKULUM]: new Map()
        },
        
        // Special cache types
        dropdown: new Map(),
        statistics: new Map(),
        api: new Map()
      },
      
      // Simple metadata
      metadata: {
        hitCount: 0,
        missCount: 0,
        lastCleanup: Date.now()
      },
      
      // ==================== COMPUTED GETTERS ====================
      
      // Get cache hit ratio
      getHitRatio: () => {
        const { hitCount, missCount } = get().metadata;
        const total = hitCount + missCount;
        return total > 0 ? (hitCount / total * 100).toFixed(2) : 0;
      },
      
      // Get cache size for entity
      getCacheSize: (entityType) => {
        const cache = get().cache.entities[entityType];
        return cache ? cache.size : 0;
      },
      
      // Get total cache size
      getTotalCacheSize: () => {
        const { cache } = get();
        let total = 0;
        
        // Count entity caches
        Object.values(cache.entities).forEach(entityCache => {
          total += entityCache.size;
        });
        
        // Count special caches
        total += cache.dropdown.size;
        total += cache.statistics.size;
        total += cache.api.size;
        
        return total;
      },
      
      // ==================== ACTIONS ====================
      
      actions: {
        // Generate simple cache key
        generateKey: (type, params = {}) => {
          if (!params || Object.keys(params).length === 0) {
            return type;
          }
          
          const paramString = Object.keys(params)
            .sort()
            .map(key => `${key}:${params[key]}`)
            .join('|');
          return `${type}::${paramString}`;
        },
        
        // Check if cache entry is valid
        isValid: (cacheEntry) => {
          if (!cacheEntry) return false;
          const now = Date.now();
          return now - cacheEntry.timestamp < cacheEntry.ttl;
        },
        
        // Get from cache
        get: (type, key) => {
          const cacheMap = get().cache[type] || get().cache.entities[type];
          if (!cacheMap) return null;
          
          const entry = cacheMap.get(key);
          
          if (entry && get().actions.isValid(entry)) {
            // Update hit count
            set(state => ({
              metadata: {
                ...state.metadata,
                hitCount: state.metadata.hitCount + 1
              }
            }), false, 'cache/hit');
            
            return entry.data;
          } else {
            // Remove expired entry
            if (entry) {
              cacheMap.delete(key);
            }
            
            // Update miss count
            set(state => ({
              metadata: {
                ...state.metadata,
                missCount: state.metadata.missCount + 1
              }
            }), false, 'cache/miss');
            
            return null;
          }
        },
        
        // Set cache entry
        set: (type, key, data, customTTL = null) => {
          const cacheMap = get().cache[type] || get().cache.entities[type];
          if (!cacheMap) return;
          
          const ttl = customTTL || CACHE_CONFIG.TTL[type] || CACHE_CONFIG.TTL.default;
          
          // Simple cache entry
          const entry = {
            data,
            timestamp: Date.now(),
            ttl
          };
          
          cacheMap.set(key, entry);
        },
        
        // Invalidate cache entries
        invalidate: (type, key = null) => {
          if (key) {
            // Invalidate specific key
            const cacheMap = get().cache[type] || get().cache.entities[type];
            if (cacheMap && cacheMap.has(key)) {
              cacheMap.delete(key);
            }
          } else {
            // Invalidate entire type
            const cacheMap = get().cache[type] || get().cache.entities[type];
            if (cacheMap) {
              cacheMap.clear();
            }
          }
          
          // Simple cascade invalidation
          const rules = CACHE_CONFIG.INVALIDATION_RULES[type];
          if (rules) {
            rules.forEach(dependentType => {
              get().actions.invalidate(dependentType);
            });
          }
        },
        
        // Clean expired entries
        cleanup: () => {
          let totalCleared = 0;
          
          // Clean entity caches
          Object.entries(get().cache.entities).forEach(([entityType, cacheMap]) => {
            const keysToDelete = [];
            
            cacheMap.forEach((entry, key) => {
              if (!get().actions.isValid(entry)) {
                keysToDelete.push(key);
              }
            });
            
            keysToDelete.forEach(key => cacheMap.delete(key));
            totalCleared += keysToDelete.length;
          });
          
          // Clean special caches
          ['dropdown', 'statistics', 'api'].forEach(type => {
            const cacheMap = get().cache[type];
            const keysToDelete = [];
            
            cacheMap.forEach((entry, key) => {
              if (!get().actions.isValid(entry)) {
                keysToDelete.push(key);
              }
            });
            
            keysToDelete.forEach(key => cacheMap.delete(key));
            totalCleared += keysToDelete.length;
          });
          
          set(state => ({
            metadata: {
              ...state.metadata,
              lastCleanup: Date.now()
            }
          }), false, `cache/cleanup/${totalCleared}`);
          
          return { clearedEntries: totalCleared };
        },
        
        // Preload essential data
        preload: async (preloadConfig) => {
          const promises = [];
          
          Object.entries(preloadConfig).forEach(([type, config]) => {
            if (config.keys && config.loader) {
              config.keys.forEach(key => {
                promises.push(
                  config.loader(key)
                    .then(data => {
                      get().actions.set(type, key, data, config.ttl);
                    })
                    .catch(error => {
                      console.warn(`Failed to preload ${type}:${key}:`, error);
                    })
                );
              });
            }
          });
          
          try {
            await Promise.allSettled(promises);
          } catch (error) {
            console.warn('Cache preloading failed:', error);
          }
        },
        
        // Get simple cache statistics
        getStats: () => {
          const state = get();
          return {
            hitRatio: state.getHitRatio(),
            totalSize: state.getTotalCacheSize(),
            lastCleanup: state.metadata.lastCleanup,
            hitCount: state.metadata.hitCount,
            missCount: state.metadata.missCount,
            entitySizes: Object.keys(ENTITIES).reduce((acc, entity) => {
              acc[entity] = state.getCacheSize(entity);
              return acc;
            }, {})
          };
        },
        
        // Cache with automatic key generation
        cacheApiCall: async (type, params, apiCall, ttl = null) => {
          const key = get().actions.generateKey(type, params);
          
          // Try cache first
          const cached = get().actions.get('api', key);
          if (cached) {
            return cached;
          }
          
          // Make API call and cache result
          try {
            const result = await apiCall();
            get().actions.set('api', key, result, ttl);
            return result;
          } catch (error) {
            throw error;
          }
        },
        
        // Clear all cache
        clear: () => {
          set(state => {
            // Clear all cache maps
            Object.values(state.cache.entities).forEach(map => map.clear());
            state.cache.dropdown.clear();
            state.cache.statistics.clear();
            state.cache.api.clear();
            
            return {
              metadata: {
                hitCount: 0,
                missCount: 0,
                lastCleanup: Date.now()
              }
            };
          }, false, 'cache/clear');
        },
        
        // Warm up cache with essential data
        warmup: async () => {
          const essentialData = {
            dropdown: {
              keys: Object.values(ENTITIES),
              loader: async (entityType) => {
                // This would be called by components to warm up dropdowns
                return `warmup-${entityType}`;
              },
              ttl: CACHE_CONFIG.TTL.dropdown
            }
          };
          
          await get().actions.preload(essentialData);
        }
      }
    }),
    {
      name: 'cache-store',
      serialize: false // Don't serialize Maps
    }
  )
);

// Simple auto-cleanup every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    const store = useCacheStore.getState();
    store.actions.cleanup();
  }, 10 * 60 * 1000);
}

export default useCacheStore;