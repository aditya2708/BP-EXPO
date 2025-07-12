import api from '../../../../api/axiosConfig';

/**
 * Master Data Mata Pelajaran API service  
 * Endpoints updated to /admin-cabang/master-data/mata-pelajaran
 */
export const mataPelajaranApi = {
  /**
   * Get all mata pelajaran with filters
   * @param {Object} params - Query parameters
   * @param {string} [params.search] - Search term
   * @param {number} [params.id_jenjang] - Filter by jenjang
   * @param {string} [params.kategori] - Filter by kategori
   * @param {number} [params.page] - Page number
   * @param {number} [params.per_page] - Items per page
   * @returns {Promise} - API response with mata pelajaran data
   */
  getAll: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/mata-pelajaran', { params });
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
   * @param {string} mataPelajaranData.nama_mata_pelajaran - Subject name
   * @param {string} mataPelajaranData.kategori - Category
   * @param {string} mataPelajaranData.deskripsi - Description
   * @param {Array} mataPelajaranData.jenjang_ids - Array of jenjang IDs
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
  }
};