import api from '../../../../api/axiosConfig';

/**
 * Master Data Jenjang API service
 * Endpoints updated to /admin-cabang/master-data/jenjang
 */
export const jenjangApi = {
  /**
   * Get all jenjang with pagination and search
   * @param {Object} params - Query parameters
   * @param {string} [params.search] - Search term
   * @param {number} [params.page] - Page number
   * @param {number} [params.per_page] - Items per page
   * @param {string} [params.sort_by] - Sort field
   * @param {string} [params.sort_order] - Sort order (asc/desc)
   * @returns {Promise} - API response with jenjang data
   */
  getAll: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/jenjang', { params });
  },

  /**
   * Get jenjang detail
   * @param {number|string} id - Jenjang ID
   * @returns {Promise} - API response with jenjang details
   */
  getDetail: async (id) => {
    return await api.get(`/admin-cabang/master-data/jenjang/${id}`);
  },

  /**
   * Create new jenjang
   * @param {Object} jenjangData - Jenjang data
   * @param {string} jenjangData.nama_jenjang - Jenjang name
   * @param {string} jenjangData.deskripsi - Description
   * @param {boolean} [jenjangData.is_active] - Active status
   * @returns {Promise} - API response
   */
  create: async (jenjangData) => {
    return await api.post('/admin-cabang/master-data/jenjang', jenjangData);
  },

  /**
   * Update jenjang
   * @param {number|string} id - Jenjang ID
   * @param {Object} jenjangData - Jenjang data
   * @returns {Promise} - API response
   */
  update: async (id, jenjangData) => {
    return await api.put(`/admin-cabang/master-data/jenjang/${id}`, jenjangData);
  },

  /**
   * Delete jenjang
   * @param {number|string} id - Jenjang ID
   * @returns {Promise} - API response
   */
  delete: async (id) => {
    return await api.delete(`/admin-cabang/master-data/jenjang/${id}`);
  },

  /**
   * Get jenjang for dropdown
   * @param {Object} params - Query parameters
   * @param {boolean} [params.active_only] - Only active jenjang
   * @returns {Promise} - API response with dropdown data
   */
  getForDropdown: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/jenjang/dropdown', { params });
  },

  /**
   * Get jenjang statistics
   * @returns {Promise} - API response with statistics
   */
  getStatistics: async () => {
    return await api.get('/admin-cabang/master-data/jenjang/statistics');
  },

  /**
   * Get kelas by jenjang
   * @param {number|string} id - Jenjang ID
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with kelas data
   */
  getKelas: async (id, params = {}) => {
    return await api.get(`/admin-cabang/master-data/jenjang/${id}/kelas`, { params });
  },

  /**
   * Get mata pelajaran by jenjang
   * @param {number|string} id - Jenjang ID
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with mata pelajaran data
   */
  getMataPelajaran: async (id, params = {}) => {
    return await api.get(`/admin-cabang/master-data/jenjang/${id}/mata-pelajaran`, { params });
  },

  /**
   * Check if jenjang can be deleted
   * @param {number|string} id - Jenjang ID
   * @returns {Promise} - API response with validation result
   */
  checkCanDelete: async (id) => {
    return await api.get(`/admin-cabang/master-data/jenjang/${id}/check-can-delete`);
  },

  /**
   * Toggle jenjang active status
   * @param {number|string} id - Jenjang ID
   * @returns {Promise} - API response
   */
  toggleActive: async (id) => {
    return await api.post(`/admin-cabang/master-data/jenjang/${id}/toggle-active`);
  }
};