import api from '../../../../api/axiosConfig';

/**
 * Akademik Kurikulum API service
 * Focus: Assignment operations, not master data creation
 * Endpoints updated to /admin-cabang/akademik/kurikulum
 */
export const kurikulumApi = {
  /**
   * Get all kurikulum with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with kurikulum data
   */
  getAll: async (params = {}) => {
    return await api.get('/admin-cabang/akademik/kurikulum', { params });
  },

  /**
   * Get kurikulum detail with assigned materi
   * @param {number|string} id - Kurikulum ID
   * @returns {Promise} - API response with kurikulum details
   */
  getDetail: async (id) => {
    return await api.get(`/admin-cabang/akademik/kurikulum/${id}`);
  },

  /**
   * Create new kurikulum
   * @param {Object} kurikulumData - Kurikulum data
   * @returns {Promise} - API response
   */
  create: async (kurikulumData) => {
    return await api.post('/admin-cabang/akademik/kurikulum', kurikulumData);
  },

  /**
   * Update kurikulum
   * @param {number|string} id - Kurikulum ID
   * @param {Object} kurikulumData - Kurikulum data
   * @returns {Promise} - API response
   */
  update: async (id, kurikulumData) => {
    return await api.put(`/admin-cabang/akademik/kurikulum/${id}`, kurikulumData);
  },

  /**
   * Delete kurikulum
   * @param {number|string} id - Kurikulum ID
   * @returns {Promise} - API response
   */
  delete: async (id) => {
    return await api.delete(`/admin-cabang/akademik/kurikulum/${id}`);
  },

  /**
   * Get active kurikulum
   * @returns {Promise} - API response with active kurikulum
   */
  getActive: async () => {
    return await api.get('/admin-cabang/akademik/kurikulum/active');
  },

  /**
   * Set kurikulum as active
   * @param {number|string} id - Kurikulum ID
   * @returns {Promise} - API response
   */
  setActive: async (id) => {
    return await api.post(`/admin-cabang/akademik/kurikulum/${id}/set-active`);
  },

  /**
   * Get kurikulum statistics
   * @param {number|string} id - Kurikulum ID
   * @returns {Promise} - API response with statistics
   */
  getStatistics: async (id) => {
    return await api.get(`/admin-cabang/akademik/kurikulum/${id}/statistics`);
  },

  /**
   * Get tahun berlaku options
   * @returns {Promise} - API response with tahun berlaku data
   */
  getTahunBerlaku: async () => {
    return await api.get('/admin-cabang/akademik/kurikulum/tahun-berlaku');
  },

  // ============ MATERI ASSIGNMENT OPERATIONS ============

  /**
   * Assign existing materi to kurikulum
   * @param {number|string} id - Kurikulum ID
   * @param {Object} assignmentData - Assignment data
   * @param {Array} assignmentData.materi_ids - Array of materi IDs
   * @param {number} [assignmentData.urutan_mulai] - Starting order
   * @returns {Promise} - API response
   */
  assignMateri: async (id, assignmentData) => {
    return await api.post(`/admin-cabang/akademik/kurikulum/${id}/assign-materi`, assignmentData);
  },

  /**
   * Remove materi from kurikulum
   * @param {number|string} id - Kurikulum ID
   * @param {number|string} materiId - Kurikulum Materi ID (not materi ID)
   * @returns {Promise} - API response
   */
  removeMateri: async (id, materiId) => {
    return await api.delete(`/admin-cabang/akademik/kurikulum/${id}/remove-materi/${materiId}`);
  },

  /**
   * Reorder materi in kurikulum
   * @param {number|string} id - Kurikulum ID
   * @param {Object} reorderData - Reorder data
   * @param {Array} reorderData.materi_order - Array of {id, urutan}
   * @returns {Promise} - API response
   */
  reorderMateri: async (id, reorderData) => {
    return await api.post(`/admin-cabang/akademik/kurikulum/${id}/reorder-materi`, reorderData);
  },

  /**
   * Get available materi for assignment
   * @param {number|string} id - Kurikulum ID
   * @param {Object} params - Query parameters
   * @param {number} [params.id_jenjang] - Filter by jenjang
   * @param {number} [params.id_mata_pelajaran] - Filter by mata pelajaran
   * @param {number} [params.id_kelas] - Filter by kelas
   * @param {string} [params.search] - Search term
   * @returns {Promise} - API response with available materi
   */
  getAvailableMateri: async (id, params = {}) => {
    return await api.get(`/admin-cabang/akademik/kurikulum/${id}/available-materi`, { params });
  },

  /**
   * Get assigned materi for kurikulum
   * @param {number|string} id - Kurikulum ID
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with assigned materi
   */
  getAssignedMateri: async (id, params = {}) => {
    return await api.get(`/admin-cabang/akademik/kurikulum/${id}/assigned-materi`, { params });
  },

  // ============ UTILITY OPERATIONS ============

  /**
   * Get cascade data for kurikulum creation
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with cascade data
   */
  getCascadeData: async (params = {}) => {
    return await api.get('/admin-cabang/akademik/kurikulum/cascade-data', { params });
  },

  /**
   * Check if kurikulum can be deleted
   * @param {number|string} id - Kurikulum ID
   * @returns {Promise} - API response with validation result
   */
  checkCanDelete: async (id) => {
    return await api.get(`/admin-cabang/akademik/kurikulum/${id}/check-can-delete`);
  },

  /**
   * Duplicate kurikulum with new data
   * @param {number|string} id - Kurikulum ID
   * @param {Object} newData - New kurikulum data
   * @returns {Promise} - API response
   */
  duplicate: async (id, newData) => {
    return await api.post(`/admin-cabang/akademik/kurikulum/${id}/duplicate`, newData);
  },

  /**
   * Export kurikulum data
   * @param {number|string} id - Kurikulum ID
   * @param {string} format - Export format (pdf, excel)
   * @returns {Promise} - API response with file
   */
  export: async (id, format = 'pdf') => {
    return await api.get(`/admin-cabang/akademik/kurikulum/${id}/export`, {
      params: { format },
      responseType: 'blob'
    });
  }
};