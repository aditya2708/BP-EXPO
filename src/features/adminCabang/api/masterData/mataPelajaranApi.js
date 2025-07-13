// src/features/adminCabang/api/masterData/mataPelajaranApi.js
import api from '../../../../api/axiosConfig';

/**
 * Master Data Mata Pelajaran API service
 * Updated endpoints to /admin-cabang/master-data/mata-pelajaran
 */
export const mataPelajaranApi = {
  /**
   * Get all mata pelajaran with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with mata pelajaran data
   */
  getAll: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/mata-pelajaran', { params });
  },

  /**
   * Get mata pelajaran stats (wrapper for getStatistics)
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with stats data
   */
  getStats: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/mata-pelajaran/statistics', { params });
  },

  /**
   * Get mata pelajaran detail
   * @param {number|string} id - Mata pelajaran ID
   * @returns {Promise} - API response with mata pelajaran details
   */
  getDetail: async (id) => {
    return await api.get(`/admin-cabang/master-data/mata-pelajaran/${id}`);
  },

  /**
   * Create new mata pelajaran
   * @param {Object} mataPelajaranData - Mata pelajaran data
   * @returns {Promise} - API response
   */
  create: async (mataPelajaranData) => {
    return await api.post('/admin-cabang/master-data/mata-pelajaran', mataPelajaranData);
  },

  /**
   * Update mata pelajaran
   * @param {number|string} id - Mata pelajaran ID
   * @param {Object} mataPelajaranData - Mata pelajaran data
   * @returns {Promise} - API response
   */
  update: async (id, mataPelajaranData) => {
    return await api.put(`/admin-cabang/master-data/mata-pelajaran/${id}`, mataPelajaranData);
  },

  /**
   * Delete mata pelajaran
   * @param {number|string} id - Mata pelajaran ID
   * @returns {Promise} - API response
   */
  delete: async (id) => {
    return await api.delete(`/admin-cabang/master-data/mata-pelajaran/${id}`);
  },

  /**
   * Get mata pelajaran by jenjang
   * @param {number|string} jenjangId - Jenjang ID
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with mata pelajaran data
   */
  getByJenjang: async (jenjangId, params = {}) => {
    return await api.get(`/admin-cabang/master-data/mata-pelajaran/jenjang/${jenjangId}`, { params });
  },

  /**
   * Get mata pelajaran for dropdown
   * @param {Object} params - Query parameters
   * @param {number} [params.id_jenjang] - Filter by jenjang
   * @param {string} [params.kategori] - Filter by kategori
   * @param {boolean} [params.active_only] - Only active subjects
   * @returns {Promise} - API response with dropdown data
   */
  getForDropdown: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/mata-pelajaran/dropdown', { params });
  },

  /**
   * Get kategori options
   * @returns {Promise} - API response with kategori options
   */
  getKategoriOptions: async () => {
    return await api.get('/admin-cabang/master-data/mata-pelajaran/kategori-options');
  },

  /**
   * Get mata pelajaran statistics
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with statistics
   */
  getStatistics: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/mata-pelajaran/statistics', { params });
  },

  /**
   * Check if mata pelajaran can be deleted
   * @param {number|string} id - Mata pelajaran ID
   * @returns {Promise} - API response with validation result
   */
  checkCanDelete: async (id) => {
    return await api.get(`/admin-cabang/master-data/mata-pelajaran/${id}/check-can-delete`);
  },

  /**
   * Get cascade data (jenjang -> mata pelajaran)
   * @param {Object} params - Query parameters
   * @param {number} [params.id_jenjang] - Jenjang ID
   * @returns {Promise} - API response with cascade data
   */
  getCascadeData: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/mata-pelajaran/cascade', { params });
  },

  /**
   * Assign jenjang to mata pelajaran
   * @param {number|string} id - Mata pelajaran ID
   * @param {Array} jenjangIds - Array of jenjang IDs
   * @returns {Promise} - API response
   */
  assignJenjang: async (id, jenjangIds) => {
    return await api.post(`/admin-cabang/master-data/mata-pelajaran/${id}/assign-jenjang`, {
      jenjang_ids: jenjangIds
    });
  },

  /**
   * Remove jenjang from mata pelajaran
   * @param {number|string} id - Mata pelajaran ID
   * @param {number|string} jenjangId - Jenjang ID
   * @returns {Promise} - API response
   */
  removeJenjang: async (id, jenjangId) => {
    return await api.delete(`/admin-cabang/master-data/mata-pelajaran/${id}/remove-jenjang/${jenjangId}`);
  },

  /**
   * Validate mata pelajaran data before save
   * @param {Object} mataPelajaranData - Mata pelajaran data to validate
   * @returns {Promise} - API response with validation result
   */
  validate: async (mataPelajaranData) => {
    return await api.post('/admin-cabang/master-data/mata-pelajaran/validate', mataPelajaranData);
  },

  /**
   * Bulk create mata pelajaran
   * @param {Array} mataPelajaranList - Array of mata pelajaran data
   * @returns {Promise} - API response
   */
  bulkCreate: async (mataPelajaranList) => {
    return await api.post('/admin-cabang/master-data/mata-pelajaran/bulk', { 
      mata_pelajaran: mataPelajaranList 
    });
  },

  /**
   * Bulk update mata pelajaran
   * @param {Array} updateList - Array of {id, data} objects
   * @returns {Promise} - API response
   */
  bulkUpdate: async (updateList) => {
    return await api.put('/admin-cabang/master-data/mata-pelajaran/bulk', { 
      updates: updateList 
    });
  },

  /**
   * Get mata pelajaran by kategori
   * @param {string} kategori - Kategori name
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with mata pelajaran data
   */
  getByKategori: async (kategori, params = {}) => {
    return await api.get(`/admin-cabang/master-data/mata-pelajaran/kategori/${kategori}`, { params });
  },

  /**
   * Export mata pelajaran data
   * @param {Object} params - Export parameters
   * @param {string} [params.format] - Export format (excel, pdf, csv)
   * @returns {Promise} - API response with file
   */
  export: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/mata-pelajaran/export', {
      params,
      responseType: 'blob'
    });
  },

  /**
   * Import mata pelajaran from file
   * @param {FormData} formData - Form data with file
   * @returns {Promise} - API response
   */
  import: async (formData) => {
    return await api.post('/admin-cabang/master-data/mata-pelajaran/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Get import template
   * @param {string} format - Template format (excel, csv)
   * @returns {Promise} - API response with template file
   */
  getImportTemplate: async (format = 'excel') => {
    return await api.get('/admin-cabang/master-data/mata-pelajaran/import-template', {
      params: { format },
      responseType: 'blob'
    });
  }
};