import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { ENTITY_CONFIGS } from '../configs/entityConfigs';

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

export const transformApiResponse = (data, entityType) => {
  if (!data) return null;
  
  const config = ENTITY_CONFIGS[entityType];
  if (!config?.transforms) return data;
  
  return config.transforms.fromApi ? config.transforms.fromApi(data) : data;
};

export const transformForSubmission = (data, entityType) => {
  if (!data) return {};
  
  const config = ENTITY_CONFIGS[entityType];
  if (!config?.transforms) return data;
  
  return config.transforms.toApi ? config.transforms.toApi(data) : data;
};

export const normalizeListData = (response) => {
  if (!response) return { data: [], pagination: null };
  
  return {
    data: response.data || [],
    pagination: response.meta ? {
      currentPage: response.meta.current_page,
      lastPage: response.meta.last_page,
      perPage: response.meta.per_page,
      total: response.meta.total
    } : null
  };
};

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export const validateField = (fieldName, value, entityType) => {
  const config = ENTITY_CONFIGS[entityType];
  const field = config?.fields?.find(f => f.name === fieldName);
  
  if (!field?.validation) return null;
  
  const rules = field.validation;
  
  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    return `${field.label} wajib diisi`;
  }
  
  // Min length validation
  if (rules.minLength && value && value.toString().length < rules.minLength) {
    return `${field.label} minimal ${rules.minLength} karakter`;
  }
  
  // Max length validation
  if (rules.maxLength && value && value.toString().length > rules.maxLength) {
    return `${field.label} maksimal ${rules.maxLength} karakter`;
  }
  
  // Pattern validation
  if (rules.pattern && value && !rules.pattern.test(value)) {
    return rules.patternMessage || `Format ${field.label} tidak valid`;
  }
  
  // Custom validation
  if (rules.custom && typeof rules.custom === 'function') {
    return rules.custom(value);
  }
  
  return null;
};

export const validateForm = (formData, entityType) => {
  const config = ENTITY_CONFIGS[entityType];
  const errors = {};
  
  config?.fields?.forEach(field => {
    const error = validateField(field.name, formData[field.name], entityType);
    if (error) {
      errors[field.name] = error;
    }
  });
  
  // Cross-field validation
  if (config?.validation?.crossField) {
    const crossErrors = config.validation.crossField(formData);
    Object.assign(errors, crossErrors);
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ============================================================================
// FORMAT HELPERS
// ============================================================================

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  switch (format) {
    case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
    case 'DD MMM YYYY': {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                     'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${day} ${months[d.getMonth()]} ${year}`;
    }
    default: return `${day}/${month}/${year}`;
  }
};

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'Rp 0';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (number) => {
  if (!number && number !== 0) return '0';
  return new Intl.NumberFormat('id-ID').format(number);
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// ============================================================================
// ENTITY RELATIONSHIP HELPERS
// ============================================================================

export const getCascadeOptions = async (fieldName, parentValue, entityType) => {
  const config = ENTITY_CONFIGS[entityType];
  const field = config?.fields?.find(f => f.name === fieldName);
  
  if (!field?.cascade) return [];
  
  try {
    if (typeof field.cascade.optionsLoader === 'function') {
      return await field.cascade.optionsLoader(parentValue);
    }
    return field.cascade.options || [];
  } catch (error) {
    console.error(`Error loading cascade options for ${fieldName}:`, error);
    return [];
  }
};

export const getFieldOptions = async (fieldName, entityType) => {
  const config = ENTITY_CONFIGS[entityType];
  const field = config?.fields?.find(f => f.name === fieldName);
  
  if (!field?.options) return [];
  
  try {
    if (typeof field.options === 'function') {
      return await field.options();
    }
    return field.options;
  } catch (error) {
    console.error(`Error loading options for ${fieldName}:`, error);
    return [];
  }
};

export const getRelatedEntity = (entityType, relatedField) => {
  const config = ENTITY_CONFIGS[entityType];
  const field = config?.fields?.find(f => f.name === relatedField);
  return field?.relatedEntity || null;
};

// ============================================================================
// NAVIGATION HELPERS
// ============================================================================

export const navigateToEntity = (navigation, entityType, mode = 'list', params = {}) => {
  const routeParams = {
    entityType,
    mode,
    ...params
  };
  
  navigation.navigate('Entity', routeParams);
};

export const getEntityTitle = (entityType, mode = 'list', item = null) => {
  const config = ENTITY_CONFIGS[entityType];
  const baseTitle = config?.labels?.plural || entityType;
  
  switch (mode) {
    case 'list': return baseTitle;
    case 'create': return `Tambah ${config?.labels?.singular || entityType}`;
    case 'edit': return `Edit ${config?.labels?.singular || entityType}`;
    case 'detail': return item ? getEntityDisplayValue(item, entityType) : `Detail ${config?.labels?.singular || entityType}`;
    case 'assign': return `Assign ${config?.labels?.singular || entityType}`;
    default: return baseTitle;
  }
};

export const getEntityDisplayValue = (item, entityType) => {
  if (!item) return '';
  
  const config = ENTITY_CONFIGS[entityType];
  const displayField = config?.display?.field || 'name';
  
  return item[displayField] || item.id || '';
};

// ============================================================================
// CACHE UTILITIES
// ============================================================================

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getCacheKey = (entityType, operation, params = {}) => {
  const paramsStr = Object.keys(params).length > 0 ? JSON.stringify(params) : '';
  return `${entityType}_${operation}_${paramsStr}`;
};

export const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export const getCache = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
};

export const clearCache = (pattern = null) => {
  if (!pattern) {
    cache.clear();
    return;
  }
  
  const keys = Array.from(cache.keys());
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  });
};

export const invalidateEntityCache = (entityType) => {
  clearCache(entityType);
};

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

export const extractErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.message) return error.message;
  
  return 'Terjadi kesalahan yang tidak diketahui';
};

export const extractValidationErrors = (error) => {
  if (error?.response?.data?.errors) {
    return error.response.data.errors;
  }
  return null;
};

export const showErrorToast = (message, title = 'Error') => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    visibilityTime: 4000
  });
};

export const showSuccessToast = (message, title = 'Sukses') => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    visibilityTime: 3000
  });
};

export const showConfirmAlert = (title, message, onConfirm, onCancel = null) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Batal',
        style: 'cancel',
        onPress: onCancel
      },
      {
        text: 'Ya',
        style: 'destructive',
        onPress: onConfirm
      }
    ],
    { cancelable: false }
  );
};

// ============================================================================
// SEARCH & FILTER UTILITIES
// ============================================================================

export const filterData = (data, searchQuery, entityType) => {
  if (!searchQuery || !data?.length) return data;
  
  const config = ENTITY_CONFIGS[entityType];
  const searchFields = config?.search?.fields || ['name'];
  
  const query = searchQuery.toLowerCase();
  
  return data.filter(item => {
    return searchFields.some(field => {
      const value = item[field];
      if (!value) return false;
      return value.toString().toLowerCase().includes(query);
    });
  });
};

export const sortData = (data, sortBy, sortOrder = 'asc') => {
  if (!data?.length || !sortBy) return data;
  
  return [...data].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    // Handle null/undefined values
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return sortOrder === 'asc' ? 1 : -1;
    if (bVal == null) return sortOrder === 'asc' ? -1 : 1;
    
    // Convert to string for comparison
    aVal = aVal.toString().toLowerCase();
    bVal = bVal.toString().toLowerCase();
    
    if (sortOrder === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });
};