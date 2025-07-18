/**
 * Error handling utilities for consistent error processing across the app
 */

/**
 * Extract error message from various error response structures
 * @param {any} error - Error object or string
 * @returns {string} - Clean error message
 */
export const extractErrorMessage = (error) => {
  // Ensure we're working with a consistent type
  if (typeof error === 'string') {
    return error;
  }

  // Handle null/undefined gracefully
  if (!error) {
    return 'Terjadi kesalahan yang tidak diketahui';
  }

  // Try different error response structures
  const errorPaths = [
    error.message,
    error.data?.message,
    error.response?.data?.message,
    error.error?.message
  ];

  for (const path of errorPaths) {
    if (typeof path === 'string' && path.trim().length > 0) {
      return path;
    }
  }

  // Fallback to generic message
  return 'Terjadi kesalahan yang tidak diketahui';
};

/**
 * Extract validation errors from error response
 * @param {any} error - Error object
 * @returns {object|null} - Validation errors object or null
 */
export const extractValidationErrors = (error) => {
  // Handle null/undefined gracefully
  if (!error || typeof error !== 'object') {
    return null;
  }

  // Try different validation error structures
  const validationPaths = [
    error.errors,
    error.data?.errors,
    error.response?.data?.errors,
    error.error?.errors
  ];

  for (const path of validationPaths) {
    if (path && typeof path === 'object') {
      return path;
    }
  }

  return null;
};

/**
 * Format validation errors for display in Alert
 * @param {object} errors - Validation errors object
 * @returns {string|null} - Formatted error string or null
 */
export const formatValidationErrors = (errors) => {
  if (!errors || typeof errors !== 'object') {
    return null;
  }

  const errorMessages = [];
  
  Object.keys(errors).forEach(field => {
    const fieldErrors = Array.isArray(errors[field]) ? errors[field] : [errors[field]];
    
    fieldErrors.forEach(message => {
      if (typeof message === 'string' && message.trim().length > 0) {
        errorMessages.push(`• ${message}`);
      }
    });
  });

  return errorMessages.length > 0 ? errorMessages.join('\n') : null;
};

/**
 * Check if error response indicates a validation error
 * @param {any} error - Error object
 * @returns {boolean} - True if validation error
 */
export const isValidationError = (error) => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  // Check for 422 status code (validation error)
  const statusPaths = [
    error.status,
    error.response?.status,
    error.data?.status
  ];

  for (const status of statusPaths) {
    if (status === 422) {
      return true;
    }
  }

  // Check for validation errors object
  return extractValidationErrors(error) !== null;
};

/**
 * Get error type for better error handling
 * @param {any} error - Error object
 * @returns {string} - Error type: 'validation', 'network', 'server', 'unknown'
 */
export const getErrorType = (error) => {
  if (!error) {
    return 'unknown';
  }

  // Check for validation errors
  if (isValidationError(error)) {
    return 'validation';
  }

  // Check for network errors
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return 'network';
  }

  // Check for server errors
  const statusPaths = [
    error.status,
    error.response?.status,
    error.data?.status
  ];

  for (const status of statusPaths) {
    if (status >= 500) {
      return 'server';
    }
  }

  return 'unknown';
};

/**
 * Create a standardized error object for Redux state
 * @param {any} error - Raw error from API call
 * @returns {object} - Standardized error object
 */
export const createStandardError = (error) => {
  return {
    message: extractErrorMessage(error),
    validationErrors: extractValidationErrors(error),
    type: getErrorType(error),
    originalError: error
  };
};