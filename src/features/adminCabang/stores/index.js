// src/features/adminCabang/stores/index.js

// ==================== STORE IMPORTS ====================
import useMasterDataStore, { ENTITIES } from './masterDataStore';
import useCascadeStore from './cascadeStore';
import useUIStore from './uiStore';
import useCacheStore from './cacheStore';
import useKurikulumStore, { KURIKULUM_TYPES, KURIKULUM_STATUS } from './kurikulumStore';

// ==================== STORE COMPOSITION ====================

/**
 * Combined store hook for accessing all AdminCabang stores
 * Usage: const { masterData, cascade, ui, cache, kurikulum } = useAdminCabangStores();
 */
export const useAdminCabangStores = () => ({
  masterData: useMasterDataStore(),
  cascade: useCascadeStore(),
  ui: useUIStore(),
  cache: useCacheStore(),
  kurikulum: useKurikulumStore()
});

/**
 * Store selectors for optimized re-renders
 * Only subscribe to specific store slices
 */
export const useStoreSelectors = {
  // Master Data selectors
  masterData: {
    entities: (entityType) => 
      useMasterDataStore(state => state.entities[entityType]),
    entitiesArray: (entityType) => 
      useMasterDataStore(state => state.getEntitiesArray(entityType)),
    entityById: (entityType, id) => 
      useMasterDataStore(state => state.getEntityById(entityType, id)),
    entitiesWithRelations: (entityType) => 
      useMasterDataStore(state => state.getEntitiesWithRelations(entityType)),
    totalCount: (entityType) => 
      useMasterDataStore(state => state.totalCounts[entityType] || 0),
    lastFetch: (entityType) => 
      useMasterDataStore(state => state.lastFetch[entityType]),
    actions: () => 
      useMasterDataStore(state => state.actions)
  },
  
  // Cascade selectors
  cascade: {
    selected: () => 
      useCascadeStore(state => state.selected),
    filters: () => 
      useCascadeStore(state => state.filters),
    validation: () => 
      useCascadeStore(state => state.validation),
    jenjangOptions: () => 
      useCascadeStore(state => state.getJenjangOptions()),
    mataPelajaranOptions: (jenjangId) => 
      useCascadeStore(state => state.getMataPelajaranOptions(jenjangId)),
    kelasOptions: (jenjangId) => 
      useCascadeStore(state => state.getKelasOptions(jenjangId)),
    materiOptions: (mataPelajaranId, kelasId) => 
      useCascadeStore(state => state.getMateriOptions(mataPelajaranId, kelasId)),
    filteredResults: (entityType) => 
      useCascadeStore(state => state.getFilteredResults(entityType)),
    actions: () => 
      useCascadeStore(state => state.actions)
  },
  
  // UI selectors
  ui: {
    loading: (entityType, operation) => 
      useUIStore(state => state.isLoading(entityType, operation)),
    error: (entityType) => 
      useUIStore(state => state.getError(entityType)),
    success: () => 
      useUIStore(state => state.success),
    pagination: (entityType) => 
      useUIStore(state => state.pagination[entityType]),
    formState: (entityType) => 
      useUIStore(state => state.getFormState(entityType)),
    modalState: (entityType, modalType) => 
      useUIStore(state => state.getModalState(entityType, modalType)),
    preferences: () => 
      useUIStore(state => state.preferences),
    isAnyLoading: () => 
      useUIStore(state => state.isAnyLoading()),
    actions: () => 
      useUIStore(state => state.actions)
  },
  
  // Cache selectors
  cache: {
    stats: () => 
      useCacheStore(state => state.actions.getStats()),
    hitRatio: () => 
      useCacheStore(state => state.getHitRatio()),
    totalSize: () => 
      useCacheStore(state => state.getTotalCacheSize()),
    cacheSize: (entityType) => 
      useCacheStore(state => state.getCacheSize(entityType)),
    actions: () => 
      useCacheStore(state => state.actions)
  },
  
  // Kurikulum selectors
  kurikulum: {
    all: () => 
      useKurikulumStore(state => Object.values(state.kurikulum)),
    byId: (id) => 
      useKurikulumStore(state => state.getKurikulumById(id)),
    byStatus: (status) => 
      useKurikulumStore(state => state.getKurikulumByStatus(status)),
    active: () => 
      useKurikulumStore(state => state.getActiveKurikulum()),
    templates: () => 
      useKurikulumStore(state => state.getTemplates()),
    materiAssignments: (kurikulumId) => 
      useKurikulumStore(state => state.getMateriAssignments(kurikulumId)),
    coverageAnalysis: (kurikulumId) => 
      useKurikulumStore(state => state.getCoverageAnalysis(kurikulumId)),
    actions: () => 
      useKurikulumStore(state => state.actions)
  }
};

// ==================== DEVTOOLS SETUP ====================

/**
 * DevTools configuration for debugging
 * Only active in development mode
 */
export const setupDevTools = () => {
  if (__DEV__ && window.__REDUX_DEVTOOLS_EXTENSION__) {
    console.log('🛠️  AdminCabang Zustand DevTools initialized');
    
    // Log store connections
    console.group('📊 AdminCabang Stores');
    console.log('✅ Master Data Store - Connected');
    console.log('✅ Cascade Store - Connected');
    console.log('✅ UI Store - Connected');
    console.log('✅ Cache Store - Connected');
    console.log('✅ Kurikulum Store - Connected');
    console.groupEnd();
    
    // Expose stores to window for debugging
    window.adminCabangStores = {
      masterData: useMasterDataStore,
      cascade: useCascadeStore,
      ui: useUIStore,
      cache: useCacheStore,
      kurikulum: useKurikulumStore
    };
  }
};

// ==================== STORE INITIALIZATION ====================

/**
 * Initialize all stores and setup
 * Call this once when app starts
 */
export const initializeStores = async () => {
  try {
    console.log('🚀 Initializing AdminCabang stores...');
    
    // Setup DevTools
    setupDevTools();
    
    // Initialize cache cleanup
    const cacheStore = useCacheStore.getState();
    cacheStore.actions.cleanup();
    
    // Load initial dropdown data
    const masterDataStore = useMasterDataStore.getState();
    const promises = [
      masterDataStore.actions.loadDropdown(ENTITIES.JENJANG),
      masterDataStore.actions.loadDropdown(ENTITIES.MATA_PELAJARAN),
      masterDataStore.actions.loadDropdown(ENTITIES.KELAS),
      masterDataStore.actions.loadDropdown(ENTITIES.MATERI)
    ];
    
    await Promise.allSettled(promises);
    
    // Load kurikulum templates
    const kurikulumStore = useKurikulumStore.getState();
    await kurikulumStore.actions.loadTemplates();
    
    console.log('✅ AdminCabang stores initialized successfully');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to initialize AdminCabang stores:', error);
    return { success: false, error };
  }
};

// ==================== STORE RESET ====================

/**
 * Reset all stores to initial state
 * Useful for logout or testing
 */
export const resetAllStores = () => {
  try {
    console.log('🔄 Resetting AdminCabang stores...');
    
    // Reset each store
    useMasterDataStore.getState().actions.clearAll();
    useCascadeStore.getState().actions.clearSelected();
    useCascadeStore.getState().actions.clearFilters();
    useUIStore.getState().actions.reset();
    useCacheStore.getState().actions.clear();
    useKurikulumStore.getState().actions.clear();
    
    console.log('✅ AdminCabang stores reset successfully');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to reset AdminCabang stores:', error);
    return { success: false, error };
  }
};

// ==================== STORE HEALTH CHECK ====================

/**
 * Check health status of all stores
 * Returns diagnostics information
 */
export const getStoreHealth = () => {
  try {
    const masterDataStore = useMasterDataStore.getState();
    const cascadeStore = useCascadeStore.getState();
    const uiStore = useUIStore.getState();
    const cacheStore = useCacheStore.getState();
    const kurikulumStore = useKurikulumStore.getState();
    
    const health = {
      timestamp: new Date().toISOString(),
      stores: {
        masterData: {
          status: 'healthy',
          entities: Object.keys(masterDataStore.entities).reduce((acc, key) => {
            acc[key] = Object.keys(masterDataStore.entities[key]).length;
            return acc;
          }, {}),
          lastFetch: masterDataStore.lastFetch
        },
        cascade: {
          status: 'healthy',
          selected: cascadeStore.selected,
          filtersActive: Object.values(cascadeStore.filters).filter(Boolean).length,
          validationErrors: Object.keys(cascadeStore.validation.errors).length
        },
        ui: {
          status: 'healthy',
          isAnyLoading: uiStore.isAnyLoading(),
          activeErrors: Object.values(uiStore.errors).filter(Boolean).length,
          activeModals: Object.values(uiStore.modals.create).filter(Boolean).length +
                        Object.values(uiStore.modals.edit).filter(Boolean).length +
                        Object.values(uiStore.modals.delete).filter(Boolean).length
        },
        cache: {
          status: 'healthy',
          stats: cacheStore.actions.getStats(),
          lastCleanup: cacheStore.metadata.lastCleanup
        },
        kurikulum: {
          status: 'healthy',
          totalKurikulum: Object.keys(kurikulumStore.kurikulum).length,
          totalAssignments: Object.keys(kurikulumStore.kurikulumMateri).length,
          templatesLoaded: Object.keys(kurikulumStore.templates).length
        }
      },
      overall: 'healthy'
    };
    
    return health;
  } catch (error) {
    return {
      timestamp: new Date().toISOString(),
      overall: 'error',
      error: error.message
    };
  }
};

// ==================== EXPORTS ====================

// Store hooks
export {
  useMasterDataStore,
  useCascadeStore,
  useUIStore,
  useCacheStore,
  useKurikulumStore
};

// Constants
export {
  ENTITIES,
  KURIKULUM_TYPES,
  KURIKULUM_STATUS
};

// Default export for convenience
export default {
  // Store hooks
  useMasterDataStore,
  useCascadeStore,
  useUIStore,
  useCacheStore,
  useKurikulumStore,
  
  // Composed hooks
  useAdminCabangStores,
  useStoreSelectors,
  
  // Utilities
  initializeStores,
  resetAllStores,
  getStoreHealth,
  setupDevTools,
  
  // Constants
  ENTITIES,
  KURIKULUM_TYPES,
  KURIKULUM_STATUS
};