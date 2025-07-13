import api from '../../../../api/axiosConfig';

/**
 * Master Data Materi API service
 * Extracted from kurikulum API and adminCabangApi
 * Focus: Independent CRUD operations for materi as master data
 */
export const materiApi = {
  /**
   * Get all materi with filtering and pagination
   * @param {Object} params - Query parameters
   * @param {string} [params.search] - Search term
   * @param {number} [params.id_kelas] - Filter by kelas
   * @param {number} [params.id_mata_pelajaran] - Filter by mata pelajaran
   * @param {number} [params.id_jenjang] - Filter by jenjang
   * @param {number} [params.page] - Page number
   * @param {number} [params.per_page] - Items per page
   * @returns {Promise} - API response with materi data
   */
  getAll: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/materi', { params });
  },

  /**
   * Get materi detail
   * @param {number|string} id - Materi ID
   * @returns {Promise} - API response with materi details
   */
  getDetail: async (id) => {
    return await api.get(`/admin-cabang/master-data/materi/${id}`);
  },

  /**
   * Create new materi
   * @param {Object} materiData - Materi data
   * @param {string} materiData.nama_materi - Materi name
   * @param {string} materiData.deskripsi - Description
   * @param {number} materiData.id_mata_pelajaran - Mata pelajaran ID
   * @param {number} materiData.id_kelas - Kelas ID
   * @param {number} [materiData.urutan] - Order sequence
   * @returns {Promise} - API response
   */
  create: async (materiData) => {
    return await api.post('/admin-cabang/master-data/materi', materiData);
  },

  /**
   * Update materi
   * @param {number|string} id - Materi ID
   * @param {Object} materiData - Materi data
   * @returns {Promise} - API response
   */
  update: async (id, materiData) => {
    return await api.put(`/admin-cabang/master-data/materi/${id}`, materiData);
  },

  /**
   * Delete materi
   * @param {number|string} id - Materi ID
   * @returns {Promise} - API response
   */
  delete: async (id) => {
    return await api.delete(`/admin-cabang/master-data/materi/${id}`);
  },

  /**
   * Get materi for dropdown
   * @param {Object} params - Query parameters
   * @param {number} [params.id_kelas] - Filter by kelas
   * @param {number} [params.id_mata_pelajaran] - Filter by mata pelajaran
   * @param {number} [params.id_jenjang] - Filter by jenjang
   * @returns {Promise} - API response with dropdown data
   */
  getForDropdown: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/materi/dropdown', { params });
  },

  /**
   * Get materi by kelas
   * @param {number|string} kelasId - Kelas ID
   * @param {Object} params - Additional query parameters
   * @returns {Promise} - API response with materi data
   */
  getByKelas: async (kelasId, params = {}) => {
    return await api.get(`/admin-cabang/master-data/materi/kelas/${kelasId}`, { params });
  },

  /**
   * Get materi by mata pelajaran
   * @param {number|string} mataPelajaranId - Mata pelajaran ID
   * @param {Object} params - Additional query parameters
   * @returns {Promise} - API response with materi data
   */
  getByMataPelajaran: async (mataPelajaranId, params = {}) => {
    return await api.get(`/admin-cabang/master-data/materi/mata-pelajaran/${mataPelajaranId}`, { params });
  },

  /**
   * Get cascade data (jenjang -> mata pelajaran -> kelas -> materi)
   * @param {Object} params - Query parameters
   * @param {number} [params.id_jenjang] - Jenjang ID
   * @param {number} [params.id_mata_pelajaran] - Mata pelajaran ID
   * @param {number} [params.id_kelas] - Kelas ID
   * @returns {Promise} - API response with cascade data
   */
  getCascadeData: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/materi/cascade', { params });
  },

  /**
   * Check if materi can be deleted
   * @param {number|string} id - Materi ID
   * @returns {Promise} - API response with validation result
   */
  checkCanDelete: async (id) => {
    return await api.get(`/admin-cabang/master-data/materi/${id}/check-can-delete`);
  },

  /**
   * Get materi statistics
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with statistics
   */
  getStatistics: async (params = {}) => {
    return await api.get('/admin-cabang/master-data/materi/statistics', { params });
  },

  /**
   * Validate materi data before save
   * @param {Object} materiData - Materi data to validate
   * @returns {Promise} - API response with validation result
   */
  validate: async (materiData) => {
    return await api.post('/admin-cabang/master-data/materi/validate', materiData);
  },

  /**
   * Bulk create materi
   * @param {Array} materiList - Array of materi data
   * @returns {Promise} - API response
   */
  bulkCreate: async (materiList) => {
    return await api.post('/admin-cabang/master-data/materi/bulk', { materi: materiList });
  }
};