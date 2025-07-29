import { useState, useCallback } from 'react';

export const useFormValidation = (initialRules = {}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules for different field types
  const defaultRules = {
    required: (value, fieldName) => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} harus diisi`;
      }
      return null;
    },
    
    minLength: (minLength) => (value, fieldName) => {
      if (value && value.length < minLength) {
        return `${fieldName} minimal ${minLength} karakter`;
      }
      return null;
    },
    
    maxLength: (maxLength) => (value, fieldName) => {
      if (value && value.length > maxLength) {
        return `${fieldName} maksimal ${maxLength} karakter`;
      }
      return null;
    },
    
    email: (value, fieldName) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        return `${fieldName} tidak valid`;
      }
      return null;
    },
    
    numeric: (value, fieldName) => {
      if (value && isNaN(value)) {
        return `${fieldName} harus berupa angka`;
      }
      return null;
    },
    
    positiveNumber: (value, fieldName) => {
      if (value && (isNaN(value) || parseFloat(value) <= 0)) {
        return `${fieldName} harus berupa angka positif`;
      }
      return null;
    },
    
    unique: (checkUnique) => async (value, fieldName) => {
      if (value && checkUnique) {
        const isUnique = await checkUnique(value);
        if (!isUnique) {
          return `${fieldName} sudah digunakan`;
        }
      }
      return null;
    }
  };

  // Validate single field
  const validateField = useCallback(async (fieldName, value, rules = []) => {
    const fieldRules = rules.length > 0 ? rules : initialRules[fieldName] || [];
    let error = null;

    for (const rule of fieldRules) {
      if (typeof rule === 'string' && defaultRules[rule]) {
        error = await defaultRules[rule](value, fieldName);
      } else if (typeof rule === 'function') {
        error = await rule(value, fieldName);
      } else if (typeof rule === 'object' && rule.type && defaultRules[rule.type]) {
        if (rule.params) {
          error = await defaultRules[rule.type](...rule.params)(value, fieldName);
        } else {
          error = await defaultRules[rule.type](value, fieldName);
        }
      }
      
      if (error) break;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));

    return error;
  }, [initialRules]);

  // Validate all fields
  const validateForm = useCallback(async (formData, validationRules = {}) => {
    const rulesToUse = Object.keys(validationRules).length > 0 ? validationRules : initialRules;
    const newErrors = {};
    
    for (const [fieldName, rules] of Object.entries(rulesToUse)) {
      const value = formData[fieldName];
      const error = await validateField(fieldName, value, rules);
      if (error) {
        newErrors[fieldName] = error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [initialRules, validateField]);

  // Clear specific field error
  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  // Mark field as touched
  const touchField = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  }, []);

  // Get error for specific field
  const getFieldError = useCallback((fieldName) => {
    return errors[fieldName] || null;
  }, [errors]);

  // Check if field has error
  const hasFieldError = useCallback((fieldName) => {
    return !!errors[fieldName];
  }, [errors]);

  // Check if form is valid
  const isFormValid = useCallback(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Get all errors
  const getAllErrors = useCallback(() => {
    return errors;
  }, [errors]);

  // Handle field change with validation
  const handleFieldChange = useCallback(async (fieldName, value, rules = []) => {
    touchField(fieldName);
    
    // Clear error first for immediate feedback
    clearFieldError(fieldName);
    
    // Validate after a short delay to avoid too frequent validation
    const timeoutId = setTimeout(async () => {
      await validateField(fieldName, value, rules);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [validateField, touchField, clearFieldError]);

  // Mata pelajaran specific validation rules
  const mataPelajaranRules = {
    nama_mata_pelajaran: ['required', { type: 'maxLength', params: [255] }],
    kode_mata_pelajaran: ['required', { type: 'maxLength', params: [50] }],
    kategori: ['required'],
    deskripsi: [{ type: 'maxLength', params: [1000] }]
  };

  // Jenjang specific validation rules
  const jenjangRules = {
    nama_jenjang: ['required', { type: 'maxLength', params: [100] }],
    kode_jenjang: ['required', { type: 'maxLength', params: [10] }],
    urutan: ['required', 'positiveNumber'],
    deskripsi: [{ type: 'maxLength', params: [500] }]
  };

  // Kelas specific validation rules
  const kelasRules = {
    id_jenjang: ['required'],
    nama_kelas: ['required', { type: 'maxLength', params: [100] }],
    jenis_kelas: ['required'],
    tingkat: ['numeric'],
    urutan: ['required', 'positiveNumber'],
    deskripsi: [{ type: 'maxLength', params: [500] }]
  };

  return {
    // State
    errors,
    touched,
    
    // Validation functions
    validateField,
    validateForm,
    
    // Error management
    clearFieldError,
    clearAllErrors,
    getFieldError,
    hasFieldError,
    getAllErrors,
    
    // Form state
    touchField,
    isFormValid,
    handleFieldChange,
    
    // Predefined rules
    mataPelajaranRules,
    jenjangRules,
    kelasRules,
    
    // Rule builders
    defaultRules
  };
};