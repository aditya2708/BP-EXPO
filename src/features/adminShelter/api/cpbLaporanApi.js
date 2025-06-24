import api from '../../../api/axiosConfig';

/**
 * CPB Laporan API service
 * Contains methods for CPB (Calon Penerima Beasiswa) reports API requests
 */
export const cpbLaporanApi = {
  /**
   * Get CPB report summary with counts by status
   * @param {Object} params - Query parameters
   * @param {string} params.jenis_kelamin - Gender filter
   * @param {string} params.kelas - Class filter
   * @param {string} params.status_orang_tua - Parent status filter
   * @returns {Promise} - API response with CPB summary data
   */
  getCpbReport: async (params = {}) => {
    return await api.get('/admin-shelter/laporan/cpb', { params });
  },

  /**
   * Get children by specific CPB status
   * @param {string} status - CPB status (BCPB, CPB, NPB, PB)
   * @param {Object} params - Query parameters
   * @param {string} params.jenis_kelamin - Gender filter
   * @param {string} params.kelas - Class filter
   * @param {string} params.status_orang_tua - Parent status filter
   * @param {string} params.search - Search term
   * @returns {Promise} - API response with children data
   */
  getCpbByStatus: async (status, params = {}) => {
    return await api.get(`/admin-shelter/laporan/cpb/status/${status}`, { params });
  },

  /**
   * Get available filter options
   * @returns {Promise} - API response with filter options
   */
  getFilterOptions: async () => {
    return await api.get('/admin-shelter/laporan/cpb/filter-options');
  },

  /**
   * Export CPB data
   * @param {Object} params - Export parameters
   * @param {string} params.status - CPB status filter
   * @param {string} params.jenis_kelamin - Gender filter
   * @param {string} params.kelas - Class filter
   * @param {string} params.status_orang_tua - Parent status filter
   * @returns {Promise} - API response with export data
   */
  exportCpbData: async (params = {}) => {
    return await api.get('/admin-shelter/laporan/cpb/export', { params });
  }
};