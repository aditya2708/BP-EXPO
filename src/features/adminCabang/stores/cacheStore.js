// src/features/adminCabang/stores/cacheStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ENTITIES } from './masterDataStore';

// Cache configuration
const CACHE_CONFIG = {
  // TTL in milliseconds
  TTL: {
    [ENTITIES.JENJANG]: 15 * 60 * 1000, // 15 minutes (stable data)
    [ENTITIES.MATA_PELAJARAN]: 10 * 60 * 1000, // 10 minutes
    [ENTITIES.KELAS]: 10 * 60 * 1000, // 10 minutes
    [ENTITIES.MATERI]: 5 * 60 * 1000, // 5 minutes (dynamic data)
    [ENTITIES.KURIKULUM]: 5 * 60 * 1000, // 5 minutes
    
    // Special cache types
    dropdown: 20 * 60 * 1000, // 20 minutes (dropdown data changes less)
    statistics: 2 * 60 * 1000, // 2 minutes (statistics update frequently)
    cascadeData: 15 * 60 * 1000, // 15 minutes
    validation: 1 * 60 * 1000 // 1 minute (validation rules)
  },
  
  // Maximum cache size per entity
  MAX_SIZE: {
    [ENTITIES.JENJANG]: 100,
    [ENTITIES.MATA_PELAJARAN]: 500,
    [ENTITIES.KELAS]: 300,
    [ENTITIES.MATERI]: 1000,
    [ENTITIES.KURIKULUM]: 200,
    dropdown: 50,
    statistics: 10,
    cascadeData: 20
  },
  
  // Cache invalidation rules
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
      
      // Cache storage with metadata
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
        cascadeData: new Map(),
        validation: new Map(),
        
        // API response cache
        api: new Map()
      },
      
      // Cache metadata
      metadata: {
        hitCount: 0,
        missCount: 0,
        lastCleanup: Date.now(),
        totalMemoryUsage: 0
      },
      
      // Background refresh tracking
      backgroundRefresh: {
        active: new Set(),
        queue: new Set(),
        lastRefresh: {}
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
        total += cache.cascadeData.size;
        total += cache.validation.size;
        total += cache.api.size;
        
        return total;
      },
      
      // ==================== ACTIONS ====================
      
      actions: {
        // Generate cache key
        generateKey: (type, params = {}) => {
          const paramString = Object.keys(params)
            .sort()
            .map(key => `${key}:${params[key]}`)
            .join('|');
          return `${type}${paramString ? `::${paramString}` : ''}`;
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
          const isValid = get().actions.isValid(entry);
          
          if (isValid) {
            // Update hit count
            set(state => ({
              metadata: {
                ...state.metadata,
                hitCount: state.metadata.hitCount + 1
              }
            }), false, 'cache/hit');
            
            // Update access time for LRU
            entry.lastAccess = Date.now();
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
          
          const ttl = customTTL || CACHE_CONFIG.TTL[type] || 5 * 60 * 1000;
          const maxSize = CACHE_CONFIG.MAX_SIZE[type] || 100;
          
          // Check cache size and evict if necessary
          if (cacheMap.size >= maxSize) {
            get().actions.evictLRU(type);
          }
          
          // Create cache entry
          const entry = {
            data,
            timestamp: Date.now(),
            ttl,
            lastAccess: Date.now(),
            size: get().actions.calculateSize(data)
          };
          
          cacheMap.set(key, entry);
          
          set(state => ({
            metadata: {
              ...state.metadata,
              totalMemoryUsage: state.metadata.totalMemoryUsage + entry.size
            }
          }), false, `cache/set/${type}/${key}`);
        },
        
        // Evict least recently used entries
        evictLRU: (type) => {
          const cacheMap = get().cache[type] || get().cache.entities[type];
          if (!cacheMap || cacheMap.size === 0) return;
          
          // Find least recently used entry
          let lruKey = null;
          let lruTime = Date.now();
          
          for (const [key, entry] of cacheMap.entries()) {
            if (entry.lastAccess < lruTime) {
              lruTime = entry.lastAccess;
              lruKey = key;
            }
          }
          
          if (lruKey) {
            const entry = cacheMap.get(lruKey);
            cacheMap.delete(lruKey);
            
            set(state => ({
              metadata: {
                ...state.metadata,
                totalMemoryUsage: Math.max(0, state.metadata.totalMemoryUsage - entry.size)
              }
            }), false, `cache/evict/${type}/${lruKey}`);
          }
        },
        
        // Calculate approximate size of data
        calculateSize: (data) => {
          try {
            return JSON.stringify(data).length * 2; // Rough estimation (UTF-16)
          } catch {
            return 1000; // Default size if serialization fails
          }
        },
        
        // Invalidate cache entries
        invalidate: (type, key = null) => {
          if (key) {
            // Invalidate specific key
            const cacheMap = get().cache[type] || get().cache.entities[type];
            if (cacheMap && cacheMap.has(key)) {
              const entry = cacheMap.get(key);
              cacheMap.delete(key);
              
              set(state => ({
                metadata: {
                  ...state.metadata,
                  totalMemoryUsage: Math.max(0, state.metadata.totalMemoryUsage - entry.size)
                }
              }), false, `cache/invalidate/${type}/${key}`);
            }
          } else {
            // Invalidate entire type
            const cacheMap = get().cache[type] || get().cache.entities[type];
            if (cacheMap) {
              let totalSize = 0;
              cacheMap.forEach(entry => totalSize += entry.size);
              cacheMap.clear();
              
              set(state => ({
                metadata: {
                  ...state.metadata,
                  totalMemoryUsage: Math.max(0, state.metadata.totalMemoryUsage - totalSize)
                }
              }), false, `cache/invalidate/${type}/all`);
            }
          }
          
          // Cascade invalidation based on rules
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
          let totalSizeCleared = 0;
          
          // Clean entity caches
          Object.entries(get().cache.entities).forEach(([entityType, cacheMap]) => {
            const keysToDelete = [];
            
            cacheMap.forEach((entry, key) => {
              if (!get().actions.isValid(entry)) {
                keysToDelete.push(key);
                totalSizeCleared += entry.size;
              }
            });
            
            keysToDelete.forEach(key => cacheMap.delete(key));
            totalCleared += keysToDelete.length;
          });
          
          // Clean special caches
          ['dropdown', 'statistics', 'cascadeData', 'validation', 'api'].forEach(type => {
            const cacheMap = get().cache[type];
            const keysToDelete = [];
            
            cacheMap.forEach((entry, key) => {
              if (!get().actions.isValid(entry)) {
                keysToDelete.push(key);
                totalSizeCleared += entry.size;
              }
            });
            
            keysToDelete.forEach(key => cacheMap.delete(key));
            totalCleared += keysToDelete.length;
          });
          
          set(state => ({
            metadata: {
              ...state.metadata,
              lastCleanup: Date.now(),
              totalMemoryUsage: Math.max(0, state.metadata.totalMemoryUsage - totalSizeCleared)
            }
          }), false, `cache/cleanup/${totalCleared}`);
          
          return { clearedEntries: totalCleared, sizeCleared: totalSizeCleared };
        },
        
        // Schedule background refresh
        scheduleRefresh: (type, key, refreshFunction) => {
          const { backgroundRefresh } = get();
          const refreshKey = `${type}::${key}`;
          
          if (backgroundRefresh.active.has(refreshKey)) return;
          
          backgroundRefresh.queue.add(refreshKey);
          
          // Process queue
          setTimeout(async () => {
            const state = get();
            if (state.backgroundRefresh.queue.has(refreshKey)) {
              state.backgroundRefresh.queue.delete(refreshKey);
              state.backgroundRefresh.active.add(refreshKey);
              
              try {
                const data = await refreshFunction();
                get().actions.set(type, key, data);
                
                set(state => ({
                  backgroundRefresh: {
                    ...state.backgroundRefresh,
                    lastRefresh: {
                      ...state.backgroundRefresh.lastRefresh,
                      [refreshKey]: Date.now()
                    }
                  }
                }), false, `cache/backgroundRefresh/${refreshKey}`);
              } catch (error) {
                console.warn('Background refresh failed:', error);
              } finally {
                get().backgroundRefresh.active.delete(refreshKey);
              }
            }
          }, 100);
        },
        
        // Preload cache entries
        preload: async (preloadConfig) => {
          const promises = [];
          
          Object.entries(preloadConfig).forEach(([type, config]) => {
            if (config.keys) {
              config.keys.forEach(key => {
                if (config.loader) {
                  promises.push(
                    config.loader(key).then(data => {
                      get().actions.set(type, key, data, config.ttl);
                    })
                  );
                }
              });
            }
          });
          
          try {
            await Promise.allSettled(promises);
          } catch (error) {
            console.warn('Cache preloading failed:', error);
          }
        },
        
        // Get cache statistics
        getStats: () => {
          const state = get();
          return {
            hitRatio: state.getHitRatio(),
            totalSize: state.getTotalCacheSize(),
            memoryUsage: state.metadata.totalMemoryUsage,
            lastCleanup: state.metadata.lastCleanup,
            entitySizes: Object.keys(ENTITIES).reduce((acc, entity) => {
              acc[entity] = state.getCacheSize(entity);
              return acc;
            }, {}),
            backgroundRefreshActive: state.backgroundRefresh.active.size,
            backgroundRefreshQueue: state.backgroundRefresh.queue.size
          };
        },
        
        // Clear all cache
        clear: () => {
          set(state => {
            // Clear all cache maps
            Object.values(state.cache.entities).forEach(map => map.clear());
            state.cache.dropdown.clear();
            state.cache.statistics.clear();
            state.cache.cascadeData.clear();
            state.cache.validation.clear();
            state.cache.api.clear();
            
            return {
              metadata: {
                hitCount: 0,
                missCount: 0,
                lastCleanup: Date.now(),
                totalMemoryUsage: 0
              },
              backgroundRefresh: {
                active: new Set(),
                queue: new Set(),
                lastRefresh: {}
              }
            };
          }, false, 'cache/clear');
        }
      }
    }),
    {
      name: 'cache-store',
      serialize: false // Don't serialize Maps and Sets
    }
  )
);

// Auto-cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    const store = useCacheStore.getState();
    store.actions.cleanup();
  }, 5 * 60 * 1000);
}

export default useCacheStore;