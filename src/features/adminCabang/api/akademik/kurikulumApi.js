import api from '../../../../api/axiosConfig';

const BASE_URL = '/admin-cabang/akademik/kurikulum';

export const kurikulumApi = {
  /**
   * Get all kurikulum with optional filters
   * @param {Object} params - Query parameters (search, jenjang_id, page, limit, etc)
   * @returns {Promise} API response
   */
  getAll: async (params = {}) => {
    try {
      return await api.get(BASE_URL, { params });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new kurikulum
   * @param {Object} data - Kurikulum data
   * @returns {Promise} API response
   */
  create: async (data) => {
    try {
      return await api.post(BASE_URL, data);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get kurikulum by ID
   * @param {number|string} id - Kurikulum ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    try {
      return await api.get(`${BASE_URL}/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update kurikulum
   * @param {number|string} id - Kurikulum ID
   * @param {Object} data - Updated kurikulum data
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    try {
      return await api.put(`${BASE_URL}/${id}`, data);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete kurikulum
   * @param {number|string} id - Kurikulum ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    try {
      return await api.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Assign materi to kurikulum
   * @param {number|string} kurikulumId - Kurikulum ID
   * @param {Object} data - Assignment data (materi_id, urutan)
   * @returns {Promise} API response
   */
  assignMateri: async (kurikulumId, data) => {
    try {
      return await api.post(`${BASE_URL}/${kurikulumId}/assign-materi`, data);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Remove materi from kurikulum
   * @param {number|string} kurikulumId - Kurikulum ID
   * @param {number|string} materiId - Materi ID
   * @returns {Promise} API response
   */
  removeMateri: async (kurikulumId, materiId) => {
    try {
      return await api.delete(`${BASE_URL}/${kurikulumId}/remove-materi/${materiId}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reorder materi in kurikulum
   * @param {number|string} kurikulumId - Kurikulum ID
   * @param {Object} data - Reorder data (materi assignments with new urutan)
   * @returns {Promise} API response
   */
  reorderMateri: async (kurikulumId, data) => {
    try {
      return await api.post(`${BASE_URL}/${kurikulumId}/reorder-materi`, data);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get available materi for assignment
   * @param {number|string} kurikulumId - Kurikulum ID
   * @param {Object} params - Query parameters (jenjang_id, mata_pelajaran_id, kelas_id)
   * @returns {Promise} API response
   */
  getAvailableMateri: async (kurikulumId, params = {}) => {
    try {
      return await api.get(`${BASE_URL}/${kurikulumId}/available-materi`, { params });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get general kurikulum statistics
   * @returns {Promise} API response with statistics
   */
  getGeneralStatistics: async () => {
    try {
      return await api.get('/admin-cabang/akademik/statistics');
    } catch (error) {
      throw error;
    }
  }
};