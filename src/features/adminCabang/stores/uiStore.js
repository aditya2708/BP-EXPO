// src/features/adminCabang/stores/uiStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ENTITIES } from './masterDataStore';

const useUIStore = create(
  devtools(
    (set, get) => ({
      // ==================== STATE ====================
      
      // Loading states per entity and operation
      loading: {
        [ENTITIES.JENJANG]: false,
        [ENTITIES.MATA_PELAJARAN]: false,
        [ENTITIES.KELAS]: false,
        [ENTITIES.MATERI]: false,
        [ENTITIES.KURIKULUM]: false,
        
        // Specific operations
        creating: {
          [ENTITIES.JENJANG]: false,
          [ENTITIES.MATA_PELAJARAN]: false,
          [ENTITIES.KELAS]: false,
          [ENTITIES.MATERI]: false,
          [ENTITIES.KURIKULUM]: false
        },
        
        updating: {},
        deleting: {},
        
        // Dropdown loading
        dropdown: {
          [ENTITIES.JENJANG]: false,
          [ENTITIES.MATA_PELAJARAN]: false,
          [ENTITIES.KELAS]: false,
          [ENTITIES.MATERI]: false
        },
        
        // Special operations
        statistics: false,
        cascadeData: false,
        validation: false
      },
      
      // Error states per entity
      errors: {
        [ENTITIES.JENJANG]: null,
        [ENTITIES.MATA_PELAJARAN]: null,
        [ENTITIES.KELAS]: null,
        [ENTITIES.MATERI]: null,
        [ENTITIES.KURIKULUM]: null,
        
        // Form validation errors
        validation: {},
        
        // Network errors
        network: null,
        
        // Permission errors
        permission: null
      },
      
      // Success messages
      success: {
        message: null,
        timestamp: null,
        type: null // 'create', 'update', 'delete'
      },
      
      // Pagination states per entity
      pagination: {
        [ENTITIES.JENJANG]: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        [ENTITIES.MATA_PELAJARAN]: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        [ENTITIES.KELAS]: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        [ENTITIES.MATERI]: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        [ENTITIES.KURIKULUM]: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      },
      
      // Form states
      forms: {
        // Active form entity type
        activeForm: null,
        
        // Form submission states
        submitting: {
          [ENTITIES.JENJANG]: false,
          [ENTITIES.MATA_PELAJARAN]: false,
          [ENTITIES.KELAS]: false,
          [ENTITIES.MATERI]: false,
          [ENTITIES.KURIKULUM]: false
        },
        
        // Form validation states
        validating: {
          [ENTITIES.JENJANG]: false,
          [ENTITIES.MATA_PELAJARAN]: false,
          [ENTITIES.KELAS]: false,
          [ENTITIES.MATERI]: false,
          [ENTITIES.KURIKULUM]: false
        },
        
        // Form dirty states (unsaved changes)
        dirty: {
          [ENTITIES.JENJANG]: false,
          [ENTITIES.MATA_PELAJARAN]: false,
          [ENTITIES.KELAS]: false,
          [ENTITIES.MATERI]: false,
          [ENTITIES.KURIKULUM]: false
        }
      },
      
      // Modal states
      modals: {
        // Entity-specific modals
        create: {
          [ENTITIES.JENJANG]: false,
          [ENTITIES.MATA_PELAJARAN]: false,
          [ENTITIES.KELAS]: false,
          [ENTITIES.MATERI]: false,
          [ENTITIES.KURIKULUM]: false
        },
        
        edit: {
          [ENTITIES.JENJANG]: false,
          [ENTITIES.MATA_PELAJARAN]: false,
          [ENTITIES.KELAS]: false,
          [ENTITIES.MATERI]: false,
          [ENTITIES.KURIKULUM]: false
        },
        
        delete: {
          [ENTITIES.JENJANG]: false,
          [ENTITIES.MATA_PELAJARAN]: false,
          [ENTITIES.KELAS]: false,
          [ENTITIES.MATERI]: false,
          [ENTITIES.KURIKULUM]: false
        },
        
        // General modals
        filter: false,
        import: false,
        export: false,
        statistics: false,
        
        // Current modal data
        currentData: null,
        currentEntityType: null
      },
      
      // UI preferences
      preferences: {
        // View modes
        viewMode: 'list', // 'list', 'grid', 'card'
        
        // Sorting
        sortBy: 'created_at',
        sortOrder: 'desc', // 'asc', 'desc'
        
        // Display options
        showInactive: false,
        compactView: false,
        
        // Per-entity preferences
        entityPreferences: {
          [ENTITIES.JENJANG]: { sortBy: 'urutan', sortOrder: 'asc' },
          [ENTITIES.MATA_PELAJARAN]: { sortBy: 'nama_mata_pelajaran', sortOrder: 'asc' },
          [ENTITIES.KELAS]: { sortBy: 'urutan', sortOrder: 'asc' },
          [ENTITIES.MATERI]: { sortBy: 'nama_materi', sortOrder: 'asc' }
        }
      },
      
      // ==================== COMPUTED GETTERS ====================
      
      // Get loading state for specific entity and operation
      isLoading: (entityType, operation = 'default') => {
        const { loading } = get();
        if (operation === 'default') return loading[entityType];
        if (operation === 'dropdown') return loading.dropdown[entityType];
        if (operation === 'creating') return loading.creating[entityType];
        if (typeof operation === 'string') return loading[operation] || false;
        return false;
      },
      
      // Get error for specific entity
      getError: (entityType) => {
        return get().errors[entityType];
      },
      
      // Check if any loading is active
      isAnyLoading: () => {
        const { loading } = get();
        return Object.values(loading).some(state => {
          if (typeof state === 'boolean') return state;
          if (typeof state === 'object') return Object.values(state).some(Boolean);
          return false;
        });
      },
      
      // Get form state for entity
      getFormState: (entityType) => {
        const { forms } = get();
        return {
          submitting: forms.submitting[entityType],
          validating: forms.validating[entityType],
          dirty: forms.dirty[entityType],
          isActive: forms.activeForm === entityType
        };
      },
      
      // Get modal state for entity and type
      getModalState: (entityType, modalType) => {
        const { modals } = get();
        return modals[modalType]?.[entityType] || false;
      },
      
      // ==================== ACTIONS ====================
      
      actions: {
        // Set loading state
        setLoading: (entityType, operation = 'default', isLoading = true) => {
          set(state => {
            const newLoading = { ...state.loading };
            
            if (operation === 'default') {
              newLoading[entityType] = isLoading;
            } else if (operation === 'dropdown') {
              newLoading.dropdown[entityType] = isLoading;
            } else if (operation === 'creating') {
              newLoading.creating[entityType] = isLoading;
            } else if (operation === 'updating') {
              if (!newLoading.updating) newLoading.updating = {};
              newLoading.updating[entityType] = isLoading;
            } else if (operation === 'deleting') {
              if (!newLoading.deleting) newLoading.deleting = {};
              newLoading.deleting[entityType] = isLoading;
            } else {
              newLoading[operation] = isLoading;
            }
            
            return { loading: newLoading };
          }, false, `ui/setLoading/${entityType}/${operation}`);
        },
        
        // Set error state
        setError: (entityType, error, errorType = 'default') => {
          set(state => {
            const newErrors = { ...state.errors };
            
            if (errorType === 'validation') {
              newErrors.validation[entityType] = error;
            } else if (errorType === 'network') {
              newErrors.network = error;
            } else if (errorType === 'permission') {
              newErrors.permission = error;
            } else {
              newErrors[entityType] = error;
            }
            
            return { errors: newErrors };
          }, false, `ui/setError/${entityType}/${errorType}`);
        },
        
        // Clear error
        clearError: (entityType, errorType = 'default') => {
          set(state => {
            const newErrors = { ...state.errors };
            
            if (errorType === 'validation') {
              if (newErrors.validation[entityType]) {
                delete newErrors.validation[entityType];
              }
            } else if (errorType === 'network') {
              newErrors.network = null;
            } else if (errorType === 'permission') {
              newErrors.permission = null;
            } else {
              newErrors[entityType] = null;
            }
            
            return { errors: newErrors };
          }, false, `ui/clearError/${entityType}/${errorType}`);
        },
        
        // Set success message
        setSuccess: (message, type = 'default') => {
          set({
            success: {
              message,
              type,
              timestamp: Date.now()
            }
          }, false, `ui/setSuccess/${type}`);
          
          // Auto-clear success message after 3 seconds
          setTimeout(() => {
            get().actions.clearSuccess();
          }, 3000);
        },
        
        // Clear success message
        clearSuccess: () => {
          set({
            success: {
              message: null,
              timestamp: null,
              type: null
            }
          }, false, 'ui/clearSuccess');
        },
        
        // Update pagination
        setPagination: (entityType, paginationData) => {
          set(state => ({
            pagination: {
              ...state.pagination,
              [entityType]: {
                ...state.pagination[entityType],
                ...paginationData
              }
            }
          }), false, `ui/setPagination/${entityType}`);
        },
        
        // Set form state
        setFormState: (entityType, formState) => {
          set(state => ({
            forms: {
              ...state.forms,
              submitting: {
                ...state.forms.submitting,
                [entityType]: formState.submitting ?? state.forms.submitting[entityType]
              },
              validating: {
                ...state.forms.validating,
                [entityType]: formState.validating ?? state.forms.validating[entityType]
              },
              dirty: {
                ...state.forms.dirty,
                [entityType]: formState.dirty ?? state.forms.dirty[entityType]
              },
              activeForm: formState.activeForm ?? state.forms.activeForm
            }
          }), false, `ui/setFormState/${entityType}`);
        },
        
        // Set modal state
        setModal: (entityType, modalType, isOpen, data = null) => {
          set(state => ({
            modals: {
              ...state.modals,
              [modalType]: {
                ...state.modals[modalType],
                [entityType]: isOpen
              },
              currentData: isOpen ? data : null,
              currentEntityType: isOpen ? entityType : null
            }
          }), false, `ui/setModal/${entityType}/${modalType}`);
        },
        
        // Close all modals
        closeAllModals: () => {
          set(state => {
            const newModals = { ...state.modals };
            
            // Close all entity modals
            Object.keys(newModals.create).forEach(entity => {
              newModals.create[entity] = false;
              newModals.edit[entity] = false;
              newModals.delete[entity] = false;
            });
            
            // Close general modals
            newModals.filter = false;
            newModals.import = false;
            newModals.export = false;
            newModals.statistics = false;
            newModals.currentData = null;
            newModals.currentEntityType = null;
            
            return { modals: newModals };
          }, false, 'ui/closeAllModals');
        },
        
        // Set preference
        setPreference: (key, value) => {
          set(state => ({
            preferences: {
              ...state.preferences,
              [key]: value
            }
          }), false, `ui/setPreference/${key}`);
        },
        
        // Set entity-specific preference
        setEntityPreference: (entityType, key, value) => {
          set(state => ({
            preferences: {
              ...state.preferences,
              entityPreferences: {
                ...state.preferences.entityPreferences,
                [entityType]: {
                  ...state.preferences.entityPreferences[entityType],
                  [key]: value
                }
              }
            }
          }), false, `ui/setEntityPreference/${entityType}/${key}`);
        },
        
        // Reset all UI state
        reset: () => {
          set({
            loading: {
              [ENTITIES.JENJANG]: false,
              [ENTITIES.MATA_PELAJARAN]: false,
              [ENTITIES.KELAS]: false,
              [ENTITIES.MATERI]: false,
              [ENTITIES.KURIKULUM]: false,
              creating: {
                [ENTITIES.JENJANG]: false,
                [ENTITIES.MATA_PELAJARAN]: false,
                [ENTITIES.KELAS]: false,
                [ENTITIES.MATERI]: false,
                [ENTITIES.KURIKULUM]: false
              },
              updating: {},
              deleting: {},
              dropdown: {
                [ENTITIES.JENJANG]: false,
                [ENTITIES.MATA_PELAJARAN]: false,
                [ENTITIES.KELAS]: false,
                [ENTITIES.MATERI]: false
              },
              statistics: false,
              cascadeData: false,
              validation: false
            },
            errors: {
              [ENTITIES.JENJANG]: null,
              [ENTITIES.MATA_PELAJARAN]: null,
              [ENTITIES.KELAS]: null,
              [ENTITIES.MATERI]: null,
              [ENTITIES.KURIKULUM]: null,
              validation: {},
              network: null,
              permission: null
            },
            success: {
              message: null,
              timestamp: null,
              type: null
            }
          }, false, 'ui/reset');
        }
      }
    }),
    {
      name: 'ui-store',
      serialize: true
    }
  )
);

export default useUIStore;