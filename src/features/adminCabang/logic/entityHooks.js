// logic/entityHooks.js
// Unified hooks for all entity CRUD operations

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Alert, ToastAndroid } from 'react-native';
import { 
  getEntityConfig, 
  getValidationRules, 
  VALIDATION_HANDLERS,
  ENTITY_TYPES 
} from '../configs/entityConfigs';

// =============================================================================
// CORE ENTITY CRUD HOOK
// =============================================================================

export const useEntityCRUD = (entityType) => {
  const dispatch = useDispatch();
  const config = getEntityConfig(entityType);
  
  // Redux selectors
  const items = useSelector(state => state.entities[entityType]?.items || []);
  const currentItem = useSelector(state => state.entities[entityType]?.currentItem || null);
  const loading = useSelector(state => state.entities[entityType]?.loading || false);
  const error = useSelector(state => state.entities[entityType]?.error || null);
  const meta = useSelector(state => state.entities[entityType]?.meta || {});
  
  // Local state
  const [localLoading, setLocalLoading] = useState(false);
  
  // Actions
  const fetchItems = useCallback(async (params = {}) => {
    try {
      setLocalLoading(true);
      await dispatch({
        type: `${entityType}/fetchAll`,
        payload: params
      });
    } catch (err) {
      console.error(`Error fetching ${entityType}:`, err);
    } finally {
      setLocalLoading(false);
    }
  }, [dispatch, entityType]);
  
  const fetchItemById = useCallback(async (id) => {
    try {
      setLocalLoading(true);
      await dispatch({
        type: `${entityType}/fetchById`,
        payload: { id }
      });
    } catch (err) {
      console.error(`Error fetching ${entityType} by ID:`, err);
    } finally {
      setLocalLoading(false);
    }
  }, [dispatch, entityType]);
  
  const createItem = useCallback(async (data) => {
    try {
      setLocalLoading(true);
      const result = await dispatch({
        type: `${entityType}/create`,
        payload: data
      });
      
      if (result.type.endsWith('/fulfilled')) {
        ToastAndroid.show(`${config.ui.title} berhasil ditambahkan`, ToastAndroid.SHORT);
        return { success: true, data: result.payload };
      } else {
        throw new Error(result.payload?.message || 'Gagal menambahkan data');
      }
    } catch (err) {
      ToastAndroid.show(`Gagal menambahkan ${config.ui.title}`, ToastAndroid.SHORT);
      return { success: false, error: err.message };
    } finally {
      setLocalLoading(false);
    }
  }, [dispatch, entityType, config.ui.title]);
  
  const updateItem = useCallback(async (id, data) => {
    try {
      setLocalLoading(true);
      const result = await dispatch({
        type: `${entityType}/update`,
        payload: { id, data }
      });
      
      if (result.type.endsWith('/fulfilled')) {
        ToastAndroid.show(`${config.ui.title} berhasil diupdate`, ToastAndroid.SHORT);
        return { success: true, data: result.payload };
      } else {
        throw new Error(result.payload?.message || 'Gagal mengupdate data');
      }
    } catch (err) {
      ToastAndroid.show(`Gagal mengupdate ${config.ui.title}`, ToastAndroid.SHORT);
      return { success: false, error: err.message };
    } finally {
      setLocalLoading(false);
    }
  }, [dispatch, entityType, config.ui.title]);
  
  const deleteItem = useCallback(async (id) => {
    try {
      setLocalLoading(true);
      const result = await dispatch({
        type: `${entityType}/delete`,
        payload: { id }
      });
      
      if (result.type.endsWith('/fulfilled')) {
        ToastAndroid.show(`${config.ui.title} berhasil dihapus`, ToastAndroid.SHORT);
        return { success: true };
      } else {
        throw new Error(result.payload?.message || 'Gagal menghapus data');
      }
    } catch (err) {
      ToastAndroid.show(`Gagal menghapus ${config.ui.title}`, ToastAndroid.SHORT);
      return { success: false, error: err.message };
    } finally {
      setLocalLoading(false);
    }
  }, [dispatch, entityType, config.ui.title]);
  
  const clearCurrentItem = useCallback(() => {
    dispatch({
      type: `${entityType}/clearCurrent`
    });
  }, [dispatch, entityType]);
  
  return {
    // Data
    items,
    currentItem,
    loading: loading || localLoading,
    error,
    meta,
    
    // Actions
    fetchItems,
    fetchItemById,
    createItem,
    updateItem,
    deleteItem,
    clearCurrentItem,
    
    // Utils
    config
  };
};

// =============================================================================
// VALIDATION HOOK
// =============================================================================

export const useEntityValidation = (entityType) => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  
  const config = getEntityConfig(entityType);
  
  const validateField = useCallback((fieldKey, value) => {
    const rules = getValidationRules(entityType, fieldKey);
    const fieldErrors = [];
    
    for (const rule of rules) {
      const handler = VALIDATION_HANDLERS[rule.rule];
      if (handler) {
        const error = handler(value, rule.value);
        if (error) {
          fieldErrors.push(error);
        }
      }
    }
    
    return fieldErrors;
  }, [entityType]);
  
  const validateForm = useCallback((formData) => {
    const newErrors = {};
    let hasErrors = false;
    
    // Validate all fields with rules
    config.fields.forEach(field => {
      const fieldErrors = validateField(field.key, formData[field.key]);
      if (fieldErrors.length > 0) {
        newErrors[field.key] = fieldErrors[0]; // Show first error only
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    setIsValid(!hasErrors);
    
    return !hasErrors;
  }, [config.fields, validateField]);
  
  const validateSingleField = useCallback((fieldKey, value) => {
    const fieldErrors = validateField(fieldKey, value);
    
    setErrors(prev => ({
      ...prev,
      [fieldKey]: fieldErrors.length > 0 ? fieldErrors[0] : null
    }));
    
    return fieldErrors.length === 0;
  }, [validateField]);
  
  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(false);
  }, []);
  
  const clearFieldError = useCallback((fieldKey) => {
    setErrors(prev => ({
      ...prev,
      [fieldKey]: null
    }));
  }, []);
  
  return {
    errors,
    isValid,
    validateForm,
    validateSingleField,
    clearErrors,
    clearFieldError
  };
};

// =============================================================================
// NAVIGATION HOOK
// =============================================================================

export const useEntityNavigation = () => {
  const navigation = useNavigation();
  
  const navigateToList = useCallback((entityType) => {
    navigation.navigate('Entity', {
      entityType,
      mode: 'list'
    });
  }, [navigation]);
  
  const navigateToForm = useCallback((entityType, options = {}) => {
    navigation.navigate('Entity', {
      entityType,
      mode: 'form',
      itemId: options.itemId || null,
      isEdit: !!options.itemId,
      ...options
    });
  }, [navigation]);
  
  const navigateToDetail = useCallback((entityType, itemId) => {
    navigation.navigate('Entity', {
      entityType,
      mode: 'detail',
      itemId
    });
  }, [navigation]);
  
  const navigateToAssign = useCallback((entityType, itemId) => {
    navigation.navigate('Entity', {
      entityType,
      mode: 'assign',
      itemId
    });
  }, [navigation]);
  
  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('AdminCabangDashboard');
    }
  }, [navigation]);
  
  return {
    navigateToList,
    navigateToForm,
    navigateToDetail,
    navigateToAssign,
    goBack
  };
};

// =============================================================================
// ERROR HANDLER HOOK
// =============================================================================

export const useErrorHandler = () => {
  const [globalError, setGlobalError] = useState(null);
  
  const handleError = useCallback((error, context = '') => {
    console.error(`Error in ${context}:`, error);
    
    let errorMessage = 'Terjadi kesalahan';
    
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    setGlobalError({
      message: errorMessage,
      context,
      timestamp: new Date().toISOString()
    });
    
    // Show toast for immediate feedback
    ToastAndroid.show(errorMessage, ToastAndroid.LONG);
    
    return errorMessage;
  }, []);
  
  const showAlert = useCallback((title, message, actions = []) => {
    const defaultActions = [
      { text: 'OK', style: 'default' }
    ];
    
    Alert.alert(title, message, actions.length > 0 ? actions : defaultActions);
  }, []);
  
  const showConfirmation = useCallback((title, message, onConfirm, onCancel) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Batal', style: 'cancel', onPress: onCancel },
        { text: 'OK', style: 'default', onPress: onConfirm }
      ]
    );
  }, []);
  
  const showDeleteConfirmation = useCallback((entityName, onConfirm) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Yakin ingin menghapus ${entityName}? Tindakan ini tidak dapat dibatalkan.`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: onConfirm }
      ]
    );
  }, []);
  
  const clearError = useCallback(() => {
    setGlobalError(null);
  }, []);
  
  return {
    globalError,
    handleError,
    showAlert,
    showConfirmation,
    showDeleteConfirmation,
    clearError
  };
};

// =============================================================================
// CACHE HOOK
// =============================================================================

export const useEntityCache = (entityType) => {
  const [cache, setCache] = useState({});
  const [lastFetch, setLastFetch] = useState({});
  
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  const isCacheValid = useCallback((key) => {
    const fetchTime = lastFetch[key];
    if (!fetchTime) return false;
    
    return (Date.now() - fetchTime) < CACHE_DURATION;
  }, [lastFetch]);
  
  const getCachedData = useCallback((key) => {
    if (isCacheValid(key)) {
      return cache[key];
    }
    return null;
  }, [cache, isCacheValid]);
  
  const setCachedData = useCallback((key, data) => {
    setCache(prev => ({
      ...prev,
      [key]: data
    }));
    setLastFetch(prev => ({
      ...prev,
      [key]: Date.now()
    }));
  }, []);
  
  const clearCache = useCallback((key) => {
    if (key) {
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[key];
        return newCache;
      });
      setLastFetch(prev => {
        const newLastFetch = { ...prev };
        delete newLastFetch[key];
        return newLastFetch;
      });
    } else {
      setCache({});
      setLastFetch({});
    }
  }, []);
  
  const invalidateCache = useCallback((pattern) => {
    if (pattern) {
      setLastFetch(prev => {
        const newLastFetch = { ...prev };
        Object.keys(newLastFetch).forEach(key => {
          if (key.includes(pattern)) {
            delete newLastFetch[key];
          }
        });
        return newLastFetch;
      });
    }
  }, []);
  
  return {
    getCachedData,
    setCachedData,
    clearCache,
    invalidateCache,
    isCacheValid
  };
};

// =============================================================================
// CONFIG RESOLVER HOOK
// =============================================================================

export const useEntityConfig = (entityType) => {
  const config = useMemo(() => {
    try {
      return getEntityConfig(entityType);
    } catch (error) {
      console.error('Error getting entity config:', error);
      return null;
    }
  }, [entityType]);
  
  const getFieldsBySection = useCallback((sectionTitle) => {
    if (!config?.form?.sections) return [];
    
    const section = config.form.sections.find(s => s.title === sectionTitle);
    if (!section) return [];
    
    return section.fields.map(fieldKey => 
      config.fields.find(field => field.key === fieldKey)
    ).filter(Boolean);
  }, [config]);
  
  const getRequiredFields = useCallback(() => {
    if (!config?.fields) return [];
    return config.fields.filter(field => field.required);
  }, [config]);
  
  const getSearchableFields = useCallback(() => {
    if (!config?.fields) return [];
    return config.fields.filter(field => field.searchable);
  }, [config]);
  
  const getPickerFields = useCallback(() => {
    if (!config?.fields) return [];
    return config.fields.filter(field => field.type === 'picker');
  }, [config]);
  
  return {
    config,
    getFieldsBySection,
    getRequiredFields,
    getSearchableFields,
    getPickerFields
  };
};

// =============================================================================
// SEARCH & FILTER HOOK
// =============================================================================

export const useEntitySearch = (entityType, items = []) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  
  const config = getEntityConfig(entityType);
  const searchableFields = config.search.fields;
  
  const filteredItems = useMemo(() => {
    let result = [...items];
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => {
        return searchableFields.some(field => {
          const value = item[field];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
      });
    }
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result = result.filter(item => {
          if (Array.isArray(value)) {
            return value.includes(item[key]);
          }
          return item[key] === value;
        });
      }
    });
    
    return result;
  }, [items, searchQuery, filters, searchableFields]);
  
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);
  
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);
  
  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilters,
    clearSearch,
    filteredItems,
    hasActiveFilters: Object.keys(filters).length > 0 || searchQuery.trim().length > 0
  };
};

// =============================================================================
// FORM STATE HOOK
// =============================================================================

export const useEntityForm = (entityType, initialData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [isDirty, setIsDirty] = useState(false);
  
  const config = getEntityConfig(entityType);
  
  const updateField = useCallback((fieldKey, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
    setIsDirty(true);
  }, []);
  
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setIsDirty(false);
  }, [initialData]);
  
  const setFormData_ = useCallback((data) => {
    setFormData(data);
    setIsDirty(false);
  }, []);
  
  const getFieldValue = useCallback((fieldKey) => {
    return formData[fieldKey] ?? '';
  }, [formData]);
  
  return {
    formData,
    setFormData: setFormData_,
    updateField,
    resetForm,
    getFieldValue,
    isDirty
  };
};