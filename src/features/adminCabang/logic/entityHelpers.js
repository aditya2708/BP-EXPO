// logic/entityHelpers.js
// Utility functions and data transformers

import { ToastAndroid } from 'react-native';
import { getEntityConfig, ENTITY_TYPES } from '../configs/entityConfigs';

// =============================================================================
// NAVIGATION HELPERS
// =============================================================================

export const navigateToEntity = (navigation, entityType, mode, options = {}) => {
  navigation.navigate('Entity', {
    entityType,
    mode,
    ...options
  });
};

export const navigateToList = (navigation, entityType) => {
  navigateToEntity(navigation, entityType, 'list');
};

export const navigateToForm = (navigation, entityType, itemId = null) => {
  navigateToEntity(navigation, entityType, 'form', {
    itemId,
    isEdit: !!itemId
  });
};

export const navigateToDetail = (navigation, entityType, itemId) => {
  navigateToEntity(navigation, entityType, 'detail', { itemId });
};

export const navigateToAssign = (navigation, entityType, itemId) => {
  navigateToEntity(navigation, entityType, 'assign', { itemId });
};

// =============================================================================
// DATA TRANSFORMATION HELPERS
// =============================================================================

export const transformApiResponse = (data, entityType) => {
  const config = getEntityConfig(entityType);
  
  if (Array.isArray(data)) {
    return data.map(item => transformSingleItem(item, config));
  }
  
  return transformSingleItem(data, config);
};

const transformSingleItem = (item, config) => {
  if (!item) return null;
  
  // Ensure ID field is standardized
  const standardItem = {
    ...item,
    id: item.id || item[config.api.idField]
  };
  
  // Transform date fields
  const dateFields = ['created_at', 'updated_at', 'tanggal'];
  dateFields.forEach(field => {
    if (standardItem[field]) {
      standardItem[field] = new Date(standardItem[field]);
    }
  });
  
  return standardItem;
};

export const prepareFormData = (formData, entityType) => {
  const config = getEntityConfig(entityType);
  const prepared = { ...formData };
  
  // Remove empty strings and null values
  Object.keys(prepared).forEach(key => {
    if (prepared[key] === '' || prepared[key] === null) {
      delete prepared[key];
    }
  });
  
  // Handle file uploads
  config.fields.forEach(field => {
    if (field.type === 'file' && prepared[field.key]) {
      // Convert file object to FormData if needed
      const file = prepared[field.key];
      if (file && typeof file === 'object' && file.uri) {
        prepared[field.key] = {
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream',
          name: file.name || 'file'
        };
      }
    }
  });
  
  return prepared;
};

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} wajib diisi`;
  }
  return null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Format email tidak valid';
  }
  return null;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  const cleanPhone = phone.replace(/[-\s]/g, '');
  if (!phoneRegex.test(cleanPhone)) {
    return 'Format nomor telepon tidak valid';
  }
  return null;
};

export const validateMinLength = (value, minLength) => {
  if (value && value.length < minLength) {
    return `Minimal ${minLength} karakter`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength) => {
  if (value && value.length > maxLength) {
    return `Maksimal ${maxLength} karakter`;
  }
  return null;
};

export const validateNumeric = (value) => {
  if (value && isNaN(value)) {
    return 'Harus berupa angka';
  }
  return null;
};

// =============================================================================
// FORMAT HELPERS
// =============================================================================

export const formatDate = (date, format = 'id') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  switch (format) {
    case 'id':
      return d.toLocaleDateString('id-ID');
    case 'id-long':
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'datetime':
      return d.toLocaleString('id-ID');
    case 'iso':
      return d.toISOString();
    default:
      return d.toLocaleDateString('id-ID');
  }
};

export const formatCurrency = (amount, currency = 'IDR') => {
  if (!amount && amount !== 0) return '';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatNumber = (number, decimals = 0) => {
  if (!number && number !== 0) return '';
  
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// =============================================================================
// ENTITY RELATIONSHIP HELPERS
// =============================================================================

export const getEntityDisplayName = (item, entityType) => {
  const config = getEntityConfig(entityType);
  return item?.[config.api.nameField] || 'Unnamed';
};

export const getEntityIcon = (entityType) => {
  const config = getEntityConfig(entityType);
  return config.ui.icon;
};

export const getEntityColor = (entityType) => {
  const config = getEntityConfig(entityType);
  return config.ui.color;
};

export const buildCascadeOptions = (data, parentField, childField) => {
  const options = {};
  
  data.forEach(item => {
    const parentId = item[parentField];
    if (!options[parentId]) {
      options[parentId] = [];
    }
    options[parentId].push({
      label: item.nama || item.name,
      value: item.id
    });
  });
  
  return options;
};

export const filterByParent = (items, parentId, parentField) => {
  if (!parentId) return [];
  return items.filter(item => item[parentField] === parentId);
};

// =============================================================================
// SEARCH AND FILTER HELPERS
// =============================================================================

export const buildSearchQuery = (searchText, searchFields, items) => {
  if (!searchText.trim()) return items;
  
  const query = searchText.toLowerCase().trim();
  return items.filter(item => {
    return searchFields.some(field => {
      const value = item[field];
      if (!value) return false;
      return String(value).toLowerCase().includes(query);
    });
  });
};

export const applyFilters = (items, filters) => {
  let filtered = [...items];
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      filtered = filtered.filter(item => {
        if (Array.isArray(value)) {
          return value.includes(item[key]);
        }
        return item[key] === value;
      });
    }
  });
  
  return filtered;
};

export const buildFilterOptions = (items, field) => {
  const uniqueValues = [...new Set(items.map(item => item[field]))];
  return uniqueValues
    .filter(value => value !== null && value !== undefined)
    .map(value => ({
      label: String(value),
      value: value
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

// =============================================================================
// CACHE UTILITIES
// =============================================================================

export const generateCacheKey = (entityType, action, params = {}) => {
  const baseKey = `${entityType}_${action}`;
  
  if (Object.keys(params).length === 0) {
    return baseKey;
  }
  
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('_');
    
  return `${baseKey}_${paramString}`;
};

export const isCacheExpired = (timestamp, maxAge = 5 * 60 * 1000) => {
  if (!timestamp) return true;
  return (Date.now() - timestamp) > maxAge;
};

export const clearExpiredCache = (cache, maxAge = 5 * 60 * 1000) => {
  const now = Date.now();
  const cleaned = {};
  
  Object.entries(cache).forEach(([key, value]) => {
    if (value.timestamp && (now - value.timestamp) <= maxAge) {
      cleaned[key] = value;
    }
  });
  
  return cleaned;
};

// =============================================================================
// ERROR HANDLING HELPERS
// =============================================================================

export const extractErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.response?.data?.errors) {
    const errors = error.response.data.errors;
    const firstError = Object.values(errors)[0];
    return Array.isArray(firstError) ? firstError[0] : firstError;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Terjadi kesalahan';
};

export const showToast = (message, duration = ToastAndroid.SHORT) => {
  ToastAndroid.show(message, duration);
};

export const showSuccessToast = (message) => {
  showToast(message, ToastAndroid.SHORT);
};

export const showErrorToast = (error) => {
  const message = extractErrorMessage(error);
  showToast(message, ToastAndroid.LONG);
};

// =============================================================================
// FORM HELPERS
// =============================================================================

export const getInitialFormData = (entityType, existingData = {}) => {
  const config = getEntityConfig(entityType);
  const initialData = {};
  
  config.fields.forEach(field => {
    if (existingData[field.key] !== undefined) {
      initialData[field.key] = existingData[field.key];
    } else if (field.defaultValue !== undefined) {
      initialData[field.key] = field.defaultValue;
    } else {
      switch (field.type) {
        case 'switch':
          initialData[field.key] = false;
          break;
        case 'number':
          initialData[field.key] = '';
          break;
        default:
          initialData[field.key] = '';
      }
    }
  });
  
  return initialData;
};

export const validateFormField = (fieldConfig, value) => {
  const errors = [];
  
  // Required validation
  if (fieldConfig.required) {
    const error = validateRequired(value, fieldConfig.label);
    if (error) errors.push(error);
  }
  
  if (!value) return errors; // Skip other validations if empty
  
  // Type-specific validations
  switch (fieldConfig.type) {
    case 'email':
      const emailError = validateEmail(value);
      if (emailError) errors.push(emailError);
      break;
      
    case 'phone':
      const phoneError = validatePhone(value);
      if (phoneError) errors.push(phoneError);
      break;
      
    case 'number':
      const numericError = validateNumeric(value);
      if (numericError) errors.push(numericError);
      break;
  }
  
  // Length validations
  if (fieldConfig.minLength) {
    const minError = validateMinLength(value, fieldConfig.minLength);
    if (minError) errors.push(minError);
  }
  
  if (fieldConfig.maxLength) {
    const maxError = validateMaxLength(value, fieldConfig.maxLength);
    if (maxError) errors.push(maxError);
  }
  
  return errors;
};

// =============================================================================
// API HELPERS
// =============================================================================

export const buildApiUrl = (entityType, action, params = {}) => {
  const config = getEntityConfig(entityType);
  const endpoint = config.api.endpoints[action];
  
  if (typeof endpoint === 'function') {
    return endpoint(params.id || params);
  }
  
  return endpoint;
};

export const transformApiData = (data, entityType) => {
  // Handle different API response formats
  if (data?.data) {
    return {
      items: Array.isArray(data.data) ? data.data : [data.data],
      meta: data.meta || {}
    };
  }
  
  if (Array.isArray(data)) {
    return {
      items: data,
      meta: {}
    };
  }
  
  return {
    items: [data],
    meta: {}
  };
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};

export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// =============================================================================
// ENTITY-SPECIFIC HELPERS
// =============================================================================

export const getJenjangDisplayText = (jenjang) => {
  if (!jenjang) return '';
  return `${jenjang.nama} (${jenjang.urutan || 'No order'})`;
};

export const getKelasDisplayText = (kelas) => {
  if (!kelas) return '';
  const jenjangText = kelas.jenjang?.nama || 'Unknown';
  return `${kelas.nama} - ${jenjangText} Tingkat ${kelas.tingkat}`;
};

export const getMataPelajaranDisplayText = (mataPelajaran) => {
  if (!mataPelajaran) return '';
  const kategoriText = mataPelajaran.kategori ? ` (${mataPelajaran.kategori})` : '';
  return `${mataPelajaran.nama}${kategoriText}`;
};

export const getMateriDisplayText = (materi) => {
  if (!materi) return '';
  const mpText = materi.mata_pelajaran?.nama || 'Unknown Subject';
  const tingkatText = materi.tingkat_kesulitan ? ` - ${capitalizeFirst(materi.tingkat_kesulitan)}` : '';
  return `${materi.judul} (${mpText}${tingkatText})`;
};

export const getKurikulumDisplayText = (kurikulum) => {
  if (!kurikulum) return '';
  const statusText = kurikulum.is_active ? ' - AKTIF' : '';
  return `${kurikulum.nama} (${kurikulum.tahun_berlaku}${statusText})`;
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'aktif':
    case 'active':
    case true:
      return '#28A745';
    case 'tidak aktif':
    case 'inactive':
    case false:
      return '#6C757D';
    case 'draft':
      return '#FFC107';
    case 'pending':
      return '#17A2B8';
    default:
      return '#6C757D';
  }
};

export const getStatusText = (status) => {
  switch (status?.toLowerCase()) {
    case 'aktif':
    case 'active':
    case true:
      return 'Aktif';
    case 'tidak aktif':
    case 'inactive':
    case false:
      return 'Tidak Aktif';
    case 'draft':
      return 'Draft';
    case 'pending':
      return 'Pending';
    default:
      return 'Unknown';
  }
};