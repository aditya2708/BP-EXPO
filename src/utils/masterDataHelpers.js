// src/utils/masterDataHelpers.js

/**
 * Master Data Helper Functions
 * Validation, formatting, and utility functions for master data operations
 */

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate jenjang data
 * @param {Object} data - Jenjang data
 * @returns {Object} - Validation result
 */
export const validateJenjang = (data) => {
  const errors = {};
  
  if (!data.nama_jenjang?.trim()) errors.nama_jenjang = 'Nama jenjang wajib diisi';
  if (data.nama_jenjang?.length > 100) errors.nama_jenjang = 'Nama jenjang maksimal 100 karakter';
  if (!data.deskripsi?.trim()) errors.deskripsi = 'Deskripsi wajib diisi';
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Validate mata pelajaran data
 * @param {Object} data - Mata pelajaran data
 * @returns {Object} - Validation result
 */
export const validateMataPelajaran = (data) => {
  const errors = {};
  
  if (!data.nama_mata_pelajaran?.trim()) errors.nama_mata_pelajaran = 'Nama mata pelajaran wajib diisi';
  if (!data.kategori?.trim()) errors.kategori = 'Kategori wajib dipilih';
  if (!data.jenjang_ids?.length) errors.jenjang_ids = 'Minimal satu jenjang harus dipilih';
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Validate kelas data
 * @param {Object} data - Kelas data
 * @returns {Object} - Validation result
 */
export const validateKelas = (data) => {
  const errors = {};
  
  if (!data.nama_kelas?.trim()) errors.nama_kelas = 'Nama kelas wajib diisi';
  if (!data.id_jenjang) errors.id_jenjang = 'Jenjang wajib dipilih';
  if (!data.tingkat) errors.tingkat = 'Tingkat wajib diisi';
  
  // Validate tingkat vs jenjang consistency
  if (data.id_jenjang && data.tingkat) {
    const tingkatRanges = {
      1: [1, 6], // SD: 1-6
      2: [7, 9], // SMP: 7-9  
      3: [10, 12] // SMA: 10-12
    };
    
    const range = tingkatRanges[data.id_jenjang];
    if (range && (data.tingkat < range[0] || data.tingkat > range[1])) {
      errors.tingkat = `Tingkat tidak sesuai dengan jenjang (${range[0]}-${range[1]})`;
    }
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Validate materi data
 * @param {Object} data - Materi data
 * @returns {Object} - Validation result
 */
export const validateMateri = (data) => {
  const errors = {};
  
  if (!data.nama_materi?.trim()) errors.nama_materi = 'Nama materi wajib diisi';
  if (!data.id_mata_pelajaran) errors.id_mata_pelajaran = 'Mata pelajaran wajib dipilih';
  if (!data.id_kelas) errors.id_kelas = 'Kelas wajib dipilih';
  if (!data.jenis_materi) errors.jenis_materi = 'Jenis materi wajib dipilih';
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Validate kurikulum data
 * @param {Object} data - Kurikulum data
 * @returns {Object} - Validation result
 */
export const validateKurikulum = (data) => {
  const errors = {};
  
  if (!data.nama_kurikulum?.trim()) errors.nama_kurikulum = 'Nama kurikulum wajib diisi';
  if (!data.tahun_berlaku) errors.tahun_berlaku = 'Tahun berlaku wajib diisi';
  if (data.tahun_berlaku < 2000 || data.tahun_berlaku > new Date().getFullYear() + 5) {
    errors.tahun_berlaku = 'Tahun berlaku tidak valid';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

// ============================================================================
// DISPLAY FORMATTING HELPERS
// ============================================================================

/**
 * Format master data status
 * @param {boolean} isActive - Active status
 * @returns {Object} - Formatted status with color
 */
export const formatStatus = (isActive) => ({
  text: isActive ? 'Aktif' : 'Tidak Aktif',
  color: isActive ? '#27ae60' : '#e74c3c',
  bg: isActive ? '#d5f4e6' : '#fadbd8'
});

/**
 * Format mata pelajaran kategori
 * @param {string} kategori - Category
 * @returns {Object} - Formatted category with color
 */
export const formatKategori = (kategori) => {
  const kategoriMap = {
    wajib: { text: 'Wajib', color: '#e74c3c', bg: '#fadbd8' },
    pilihan: { text: 'Pilihan', color: '#f39c12', bg: '#fdeaa7' },
    pengembangan: { text: 'Pengembangan', color: '#3498db', bg: '#d6eaf8' },
    muatan_lokal: { text: 'Muatan Lokal', color: '#9b59b6', bg: '#ebdef0' }
  };
  
  return kategoriMap[kategori] || { text: kategori, color: '#7f8c8d', bg: '#ecf0f1' };
};

/**
 * Format jenis materi
 * @param {string} jenis - Material type
 * @returns {Object} - Formatted type with icon
 */
export const formatJenisMateri = (jenis) => {
  const jenisMap = {
    teori: { text: 'Teori', icon: 'book', color: '#3498db' },
    praktik: { text: 'Praktik', icon: 'construct', color: '#e74c3c' },
    campuran: { text: 'Campuran', icon: 'library', color: '#f39c12' }
  };
  
  return jenisMap[jenis] || { text: jenis, icon: 'document', color: '#7f8c8d' };
};

/**
 * Format tingkat kelas
 * @param {number} tingkat - Class level
 * @param {string} jenjanNama - Level name
 * @returns {string} - Formatted class level
 */
export const formatTingkatKelas = (tingkat, jenjangNama) => {
  if (!tingkat || !jenjangNama) return '-';
  
  const prefixMap = {
    'SD': 'Kelas',
    'SMP': 'Kelas', 
    'SMA': 'Kelas',
    'SMK': 'Kelas'
  };
  
  const prefix = prefixMap[jenjangNama.toUpperCase()] || 'Tingkat';
  return `${prefix} ${tingkat}`;
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Format number with thousand separator
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('id-ID').format(num);
};

// ============================================================================
// DATA TRANSFORMATION HELPERS
// ============================================================================

/**
 * Transform data for dropdown options
 * @param {Array} data - Raw data array
 * @param {string} valueKey - Key for value
 * @param {string} labelKey - Key for label
 * @returns {Array} - Dropdown options
 */
export const transformToOptions = (data, valueKey = 'id', labelKey = 'name') => {
  if (!Array.isArray(data)) return [];
  
  return data.map(item => ({
    value: item[valueKey],
    label: item[labelKey],
    data: item
  }));
};

/**
 * Build cascade options for jenjang -> mata pelajaran -> kelas
 * @param {Object} cascadeData - Cascade data from API
 * @returns {Object} - Organized cascade options
 */
export const buildCascadeOptions = (cascadeData) => {
  const { jenjang = [], mata_pelajaran = [], kelas = [] } = cascadeData;
  
  return {
    jenjang: transformToOptions(jenjang, 'id_jenjang', 'nama_jenjang'),
    mata_pelajaran: mata_pelajaran.reduce((acc, mp) => {
      mp.jenjang.forEach(j => {
        if (!acc[j.id_jenjang]) acc[j.id_jenjang] = [];
        acc[j.id_jenjang].push({
          value: mp.id_mata_pelajaran,
          label: mp.nama_mata_pelajaran,
          data: mp
        });
      });
      return acc;
    }, {}),
    kelas: kelas.reduce((acc, k) => {
      if (!acc[k.id_jenjang]) acc[k.id_jenjang] = [];
      acc[k.id_jenjang].push({
        value: k.id_kelas,
        label: `${k.nama_kelas} (Tingkat ${k.tingkat})`,
        data: k
      });
      return acc;
    }, {})
  };
};

/**
 * Group data by field
 * @param {Array} data - Data array
 * @param {string} field - Field to group by
 * @returns {Object} - Grouped data
 */
export const groupBy = (data, field) => {
  if (!Array.isArray(data)) return {};
  
  return data.reduce((acc, item) => {
    const key = item[field];
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

// ============================================================================
// SEARCH AND FILTER HELPERS
// ============================================================================

/**
 * Build search params for API
 * @param {Object} filters - Filter object
 * @returns {Object} - Clean params object
 */
export const buildSearchParams = (filters) => {
  const params = {};
  
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        params[key] = value.join(',');
      } else if (!Array.isArray(value)) {
        params[key] = value;
      }
    }
  });
  
  return params;
};

/**
 * Filter data by search term
 * @param {Array} data - Data array
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} - Filtered data
 */
export const filterBySearch = (data, searchTerm, searchFields) => {
  if (!searchTerm || !Array.isArray(data)) return data;
  
  const term = searchTerm.toLowerCase();
  return data.filter(item => 
    searchFields.some(field => 
      String(item[field] || '').toLowerCase().includes(term)
    )
  );
};

// ============================================================================
// STATISTICS HELPERS
// ============================================================================

/**
 * Calculate master data statistics
 * @param {Object} stats - Raw statistics
 * @returns {Object} - Formatted statistics
 */
export const formatStatistics = (stats) => {
  if (!stats) return {};
  
  return {
    total: formatNumber(stats.total || 0),
    active: formatNumber(stats.active || 0),
    inactive: formatNumber(stats.inactive || 0),
    activePercentage: stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0,
    growth: stats.growth || 0
  };
};

// ============================================================================
// ERROR HANDLING HELPERS
// ============================================================================

/**
 * Parse API error response
 * @param {Object} error - Error object
 * @returns {string} - User-friendly error message
 */
export const parseApiError = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.message) return error.message;
  return 'Terjadi kesalahan. Silakan coba lagi.';
};

/**
 * Handle validation errors from API
 * @param {Object} error - Error object with validation errors
 * @returns {Object} - Formatted validation errors
 */
export const parseValidationErrors = (error) => {
  const errors = error?.response?.data?.errors || {};
  const formatted = {};
  
  Object.keys(errors).forEach(field => {
    formatted[field] = Array.isArray(errors[field]) ? errors[field][0] : errors[field];
  });
  
  return formatted;
};

// ============================================================================
// EXPORT ALL HELPERS
// ============================================================================

export default {
  // Validation
  validateJenjang,
  validateMataPelajaran,
  validateKelas,
  validateMateri,
  validateKurikulum,
  
  // Formatting
  formatStatus,
  formatKategori,
  formatJenisMateri,
  formatTingkatKelas,
  formatDate,
  formatNumber,
  
  // Transformation
  transformToOptions,
  buildCascadeOptions,
  groupBy,
  
  // Search & Filter
  buildSearchParams,
  filterBySearch,
  
  // Statistics
  formatStatistics,
  
  // Error Handling
  parseApiError,
  parseValidationErrors
};