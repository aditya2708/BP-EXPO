import api from '../../../api/axiosConfig';

/**
 * Raport Laporan API service
 * Contains methods for raport (report card) related API requests
 */
export const raportLaporanApi = {
  /**
   * Get laporan raport with filters
   * @param {Object} params - Query parameters
   * @param {number} params.semester_id - Semester ID filter
   * @param {string} params.tahun_ajaran - Academic year filter
   * @param {string} params.mata_pelajaran - Subject filter
   * @param {string} params.status - Raport status filter
   * @returns {Promise} - API response with laporan data
   */
  getLaporanRaport: async (params = {}) => {
    return await api.get('/admin-shelter/laporan/raport', { params });
  },

  /**
   * Get child detail raport report
   * @param {number|string} childId - Child ID
   * @param {Object} params - Query parameters
   * @param {number} params.semester_id - Semester ID filter
   * @param {string} params.tahun_ajaran - Academic year filter
   * @param {string} params.mata_pelajaran - Subject filter
   * @returns {Promise} - API response with child detail data
   */
  getChildDetailReport: async (childId, params = {}) => {
    return await api.get(`/admin-shelter/laporan/raport/child/${childId}`, { params });
  },

  /**
   * Get available semester options for filter
   * @returns {Promise} - API response with semester options
   */
  getSemesterOptions: async () => {
    return await api.get('/admin-shelter/laporan/raport/semester-options');
  },

  /**
   * Get available mata pelajaran options for filter
   * @returns {Promise} - API response with subject options
   */
  getMataPelajaranOptions: async () => {
    return await api.get('/admin-shelter/laporan/raport/mata-pelajaran-options');
  },

  /**
   * Get available years for filter
   * @returns {Promise} - API response with available years
   */
  getAvailableYears: async () => {
    return await api.get('/admin-shelter/laporan/raport/available-years');
  }
};