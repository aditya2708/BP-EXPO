import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { 
  getEntityThunks, 
  getEntitySelectors, 
  getEntityActions 
} from './entityRedux';
import { 
  getEntityConfig, 
  getEntityValidation, 
  VALIDATION_RULES 
} from '../configs/entityConfigs';

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Main entity CRUD hook
 * Provides unified interface for all entity operations
 */
export const useEntityCRUD = (entityType) => {
  const dispatch = useDispatch();
  const thunks = getEntityThunks(entityType);
  const selectors = getEntitySelectors(entityType);
  const actions = getEntityActions(entityType);
  
  if (!thunks || !selectors || !actions) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }

  // State selectors
  const items = useSelector(selectors.selectItems);
  const totalItems = useSelector(selectors.selectTotalItems);
  const currentPage = useSelector(selectors.selectCurrentPage);
  const totalPages = useSelector(selectors.selectTotalPages);
  const currentItem = useSelector(selectors.selectCurrentItem);
  const dropdownOptions = useSelector(selectors.selectDropdownOptions);
  const statistics = useSelector(selectors.selectStatistics);
  const availableItems = useSelector(selectors.selectAvailableItems);
  
  // Loading states
  const loading = useSelector(selectors.selectLoading);
  const listLoading = useSelector(selectors.selectListLoading);
  const itemLoading = useSelector(selectors.selectItemLoading);
  const dropdownLoading = useSelector(selectors.selectDropdownLoading);
  const statisticsLoading = useSelector(selectors.selectStatisticsLoading);
  
  // Error states
  const error = useSelector(selectors.selectError);
  const listError = useSelector(selectors.selectListError);
  const itemError = useSelector(selectors.selectItemError);
  const dropdownError = useSelector(selectors.selectDropdownError);
  const statisticsError = useSelector(selectors.selectStatisticsError);
  
  // Cache timestamps
  const lastFetch = useSelector(selectors.selectLastFetch);
  const lastStatsFetch = useSelector(selectors.selectLastStatsFetch);
  
  // UI state
  const filters = useSelector(selectors.selectFilters);
  const searchQuery = useSelector(selectors.selectSearchQuery);

  // Check if cache is valid
  const isCacheValid = useCallback((timestamp) => {
    return timestamp && (Date.now() - timestamp < CACHE_DURATION);
  }, []);

  // Fetch all items with caching
  const fetchAll = useCallback(async (params = {}, forceRefresh = false) => {
    if (!forceRefresh && isCacheValid(lastFetch) && items.length > 0) {
      return { success: true, data: items, cached: true };
    }
    
    try {
      const result = await dispatch(thunks.fetchAll(params)).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }, [dispatch, thunks.fetchAll, items, lastFetch, isCacheValid]);

  // Fetch single item
  const fetchById = useCallback(async (id) => {
    try {
      const result = await dispatch(thunks.fetchById(id)).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  }, [dispatch, thunks.fetchById]);

  // Create item
  const create = useCallback(async (data) => {
    try {
      const result = await dispatch(thunks.create(data)).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  }, [dispatch, thunks.create]);

  // Update item
  const update = useCallback(async (id, data) => {
    try {
      const result = await dispatch(thunks.update({ id, data })).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  }, [dispatch, thunks.update]);

  // Delete item
  const deleteItem = useCallback(async (id) => {
    try {
      const result = await dispatch(thunks.delete(id)).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  }, [dispatch, thunks.delete]);

  // Get dropdown options with caching
  const getDropdownOptions = useCallback(async (params = {}, forceRefresh = false) => {
    if (!thunks.fetchDropdown) return { success: true, data: [] };
    
    if (!forceRefresh && dropdownOptions.length > 0) {
      return { success: true, data: dropdownOptions, cached: true };
    }
    
    try {
      const result = await dispatch(thunks.fetchDropdown(params)).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }, [dispatch, thunks.fetchDropdown, dropdownOptions]);

  // Load statistics with caching
  const loadStatistics = useCallback(async (params = {}, forceRefresh = false) => {
    if (!thunks.fetchStatistics) return { success: true, data: null };
    
    if (!forceRefresh && isCacheValid(lastStatsFetch) && statistics) {
      return { success: true, data: statistics, cached: true };
    }
    
    try {
      const result = await dispatch(thunks.fetchStatistics(params)).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }, [dispatch, thunks.fetchStatistics, statistics, lastStatsFetch, isCacheValid]);

  // Kurikulum specific methods
  const getAvailableMateri = useCallback(async (kurikulumId, params = {}) => {
    if (entityType !== 'kurikulum' || !thunks.getAvailableMateri) {
      throw new Error('getAvailableMateri only available for kurikulum entity');
    }
    
    try {
      const result = await dispatch(thunks.getAvailableMateri({ kurikulumId, params })).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  }, [dispatch, thunks.getAvailableMateri, entityType]);

  const assignMateri = useCallback(async (kurikulumId, materiIds) => {
    if (entityType !== 'kurikulum' || !thunks.assignMateri) {
      throw new Error('assignMateri only available for kurikulum entity');
    }
    
    try {
      const result = await dispatch(thunks.assignMateri({ kurikulumId, materiIds })).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  }, [dispatch, thunks.assignMateri, entityType]);

  const removeMateri = useCallback(async (kurikulumId, materiId) => {
    if (entityType !== 'kurikulum' || !thunks.removeMateri) {
      throw new Error('removeMateri only available for kurikulum entity');
    }
    
    try {
      const result = await dispatch(thunks.removeMateri({ kurikulumId, materiId })).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  }, [dispatch, thunks.removeMateri, entityType]);

  const reorderMateri = useCallback(async (kurikulumId, materiOrder) => {
    if (entityType !== 'kurikulum' || !thunks.reorderMateri) {
      throw new Error('reorderMateri only available for kurikulum entity');
    }
    
    try {
      const result = await dispatch(thunks.reorderMateri({ kurikulumId, materiOrder })).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  }, [dispatch, thunks.reorderMateri, entityType]);

  // Clear current item
  const clearCurrentItem = useCallback(() => {
    dispatch(actions.clearCurrentItem());
  }, [dispatch, actions.clearCurrentItem]);

  // Set filters
  const setFilters = useCallback((newFilters) => {
    dispatch(actions.setFilters(newFilters));
  }, [dispatch, actions.setFilters]);

  // Set search query
  const setSearchQuery = useCallback((query) => {
    dispatch(actions.setSearchQuery(query));
  }, [dispatch, actions.setSearchQuery]);

  // Clear errors
  const clearErrors = useCallback(() => {
    dispatch(actions.clearErrors());
  }, [dispatch, actions.clearErrors]);

  return {
    // Data
    items,
    totalItems,
    currentPage,
    totalPages,
    currentItem,
    dropdownOptions,
    statistics,
    availableMateri: availableItems,
    
    // Loading states
    loading,
    listLoading,
    itemLoading,
    dropdownLoading,
    statisticsLoading,
    
    // Error states
    error,
    listError,
    itemError,
    dropdownError,
    statisticsError,
    
    // UI state
    filters,
    searchQuery,
    
    // Actions
    fetchAll,
    fetchById,
    create,
    update,
    delete: deleteItem,
    getDropdownOptions,
    loadStatistics,
    
    // Kurikulum specific
    getAvailableMateri,
    assignMateri,
    removeMateri,
    reorderMateri,
    
    // Utility actions
    clearCurrentItem,
    setFilters,
    setSearchQuery,
    clearErrors,
  };
};

/**
 * Entity validation hook
 * Provides real-time validation for entity forms
 */
export const useEntityValidation = (entityType) => {
  const validation = getEntityValidation(entityType);
  
  const validateField = useCallback((fieldName, value, formData = {}) => {
    const fieldValidation = validation[fieldName];
    if (!fieldValidation) return { isValid: true, errors: [] };
    
    const errors = [];
    
    for (const rule of fieldValidation) {
      const { rule: ruleName, message, value: ruleValue, condition } = rule;
      const validationFn = VALIDATION_RULES[ruleName];
      
      if (!validationFn) continue;
      
      let isValid;
      if (ruleName === 'conditionalRequired') {
        isValid = validationFn(value, condition, formData);
      } else if (ruleValue !== undefined) {
        isValid = validationFn(value, ruleValue);
      } else {
        isValid = validationFn(value);
      }
      
      if (!isValid) {
        errors.push(message);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [validation]);

  const validateForm = useCallback((formData) => {
    const errors = {};
    let isValid = true;
    
    Object.keys(validation).forEach(fieldName => {
      const fieldValidation = validateField(fieldName, formData[fieldName], formData);
      if (!fieldValidation.isValid) {
        errors[fieldName] = fieldValidation.errors;
        isValid = false;
      }
    });
    
    return { isValid, errors };
  }, [validation, validateField]);

  return {
    validateField,
    validateForm,
  };
};

/**
 * Error handling hook
 * Provides unified error handling and user feedback
 */
export const useErrorHandler = () => {
  const showError = useCallback((error, defaultMessage = 'Terjadi kesalahan') => {
    let message = defaultMessage;
    
    if (typeof error === 'string') {
      message = error;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }
    
    Alert.alert('Error', message);
  }, []);

  const showSuccess = useCallback((message) => {
    Alert.alert('Berhasil', message);
  }, []);

  const showConfirmation = useCallback((message, onConfirm, onCancel = null) => {
    Alert.alert(
      'Konfirmasi',
      message,
      [
        { text: 'Batal', style: 'cancel', onPress: onCancel },
        { text: 'Ya', onPress: onConfirm },
      ]
    );
  }, []);

  const handleError = useCallback((error, context = '') => {
    console.error(`Error in ${context}:`, error);
    showError(error, context ? `Gagal ${context}` : undefined);
  }, [showError]);

  return {
    showError,
    showSuccess,
    showConfirmation,
    handleError,
  };
};

/**
 * Entity navigation hook
 * Provides smart navigation between entity screens
 */
export const useEntityNavigation = () => {
  const navigateToList = useCallback((navigation, entityType, stackName = 'MasterDataEntity') => {
    navigation.navigate(stackName, {
      entityType,
      mode: 'list'
    });
  }, []);

  const navigateToCreate = useCallback((navigation, entityType, stackName = 'MasterDataEntity') => {
    navigation.navigate(stackName, {
      entityType,
      mode: 'create'
    });
  }, []);

  const navigateToEdit = useCallback((navigation, entityType, item, stackName = 'MasterDataEntity') => {
    navigation.navigate(stackName, {
      entityType,
      mode: 'edit',
      itemId: item.id || item[`id_${entityType}`],
      item
    });
  }, []);

  const navigateToDetail = useCallback((navigation, entityType, item, stackName = 'MasterDataEntity') => {
    navigation.navigate(stackName, {
      entityType,
      mode: 'detail',
      itemId: item.id || item[`id_${entityType}`],
      item
    });
  }, []);

  const navigateToAssign = useCallback((navigation, entityType, item) => {
    if (entityType === 'kurikulum') {
      navigation.navigate('AssignMateri', {
        kurikulumId: item.id_kurikulum || item.id,
        kurikulumName: item.nama_kurikulum
      });
    }
  }, []);

  return {
    navigateToList,
    navigateToCreate,
    navigateToEdit,
    navigateToDetail,
    navigateToAssign,
  };
};

/**
 * Entity cache hook
 * Provides intelligent caching functionality
 */
export const useEntityCache = (entityType) => {
  const selectors = getEntitySelectors(entityType);
  const lastFetch = useSelector(selectors.selectLastFetch);
  const lastStatsFetch = useSelector(selectors.selectLastStatsFetch);
  
  const isCacheValid = useCallback((timestamp, duration = CACHE_DURATION) => {
    return timestamp && (Date.now() - timestamp < duration);
  }, []);

  const isListCacheValid = useCallback(() => {
    return isCacheValid(lastFetch);
  }, [lastFetch, isCacheValid]);

  const isStatsCacheValid = useCallback(() => {
    return isCacheValid(lastStatsFetch);
  }, [lastStatsFetch, isCacheValid]);

  return {
    isListCacheValid,
    isStatsCacheValid,
    isCacheValid,
  };
};