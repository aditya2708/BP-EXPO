import api from '../../../../api/axiosConfig';

/**
 * Master Data Kelas API service
 * Endpoints updated to /admin-cabang/master-data/kelas
 */
export const kelasApi = {
  /**
   * Get all kelas with filters
   * @param {Object} params - Query parameters
   * @param {string} [params.search] - Search term
   * @param {number} [params.id_jenjang] - Filter by jenjang
   * @param {number} [params.tingkat] - Filter by tingkat
   * @param {number} [params.page] - Page number
   * @param {number} [params.per_page] - Items per page
   * @returns {Promise} - API response with kelas data
   */
  getAll: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/kelas', { params });
  },

  /**
   * Get kelas detail
   * @param {number|string} id - Kelas ID
   * @returns {Promise} - API response with kelas details
   */
  getDetail: async (id) => {
    return await api.get(`/admin-cabang/master-data/kelas/${id}`);
  },

  /**
   * Create new kelas
   * @param {Object} kelasData - Kelas data
   * @param {string} kelasData.nama_kelas - Kelas name
   * @param {number} kelasData.tingkat - Grade level
   * @param {number} kelasData.id_jenjang - Jenjang ID
   * @param {string} [kelasData.deskripsi] - Description
   * @returns {Promise} - API response
   */
  create: async (kelasData) => {
    return await api.post('/admin-cabang/master-data/kelas', kelasData);
  },

  /**
   * Update kelas
   * @param {number|string} id - Kelas ID
   * @param {Object} kelasData - Kelas data
   * @returns {Promise} - API response
   */
  update: async (id, kelasData) => {
    return await api.put(`/admin-cabang/master-data/kelas/${id}`, kelasData);
  },

  /**
   * Delete kelas
   * @param {number|string} id - Kelas ID
   * @returns {Promise} - API response
   */
  delete: async (id) => {
    return await api.delete(`/admin-cabang/master-data/kelas/${id}`);
  },

  /**
   * Get kelas by jenjang
   * @param {number|string} jenjangId - Jenjang ID
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with kelas data
   */
  getByJenjang: async (jenjangId, params = {}) => {
    return await api.get(`/admin-cabang/master-data/kelas/jenjang/${jenjangId}`, { params });
  },

  /**
   * Get kelas for dropdown
   * @param {Object} params - Query parameters
   * @param {number} [params.id_jenjang] - Filter by jenjang
   * @param {boolean} [params.active_only] - Only active kelas
   * @returns {Promise} - API response with dropdown data
   */
  getForDropdown: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/kelas/dropdown', { params });
  },

  /**
   * Get kelas statistics
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with statistics
   */
  getStatistics: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/kelas/statistics', { params });
  },

  /**
   * Check if kelas can be deleted
   * @param {number|string} id - Kelas ID
   * @returns {Promise} - API response with validation result
   */
  checkCanDelete: async (id) => {
    return await api.get(`/admin-cabang/master-data/kelas/${id}/check-can-delete`);
  },

  /**
   * Get tingkat options by jenjang
   * @param {number|string} jenjangId - Jenjang ID
   * @returns {Promise} - API response with tingkat options
   */
  getTingkatOptions: async (jenjangId) => {
    return await api.get(`/admin-cabang/master-data/kelas/tingkat-options/${jenjangId}`);
  },

  /**
   * Validate kelas data (tingkat vs jenjang)
   * @param {Object} kelasData - Kelas data to validate
   * @returns {Promise} - API response with validation result
   */
  validate: async (kelasData) => {
    return await api.post('/admin-cabang/master-data/kelas/validate', kelasData);
  },

  /**
   * Get cascade data (jenjang -> kelas)
   * @param {Object} params - Query parameters
   * @param {number} [params.id_jenjang] - Jenjang ID
   * @returns {Promise} - API response with cascade data
   */
  getCascadeData: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/kelas/cascade', { params });
  }
};