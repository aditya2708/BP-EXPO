import api from '../../../api/axiosConfig';
import { ADMIN_SHELTER_ENDPOINTS } from '../../../constants/endpoints';

/**
 * Histori Laporan API service
 * Contains methods for histori laporan related API requests
 */
export const historiLaporanApi = {
  /**
   * Get laporan histori anak with filters
   * @param {Object} params - Query parameters
   * @param {number} params.year - Year filter
   * @param {string} params.jenis_histori - Jenis histori filter
   * @param {string} params.search - Search filter
   * @returns {Promise} - API response with histori data
   */
  getLaporanHistori: async (params = {}) => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.HISTORI.LIST, { params });
  },

  /**
   * Get histori detail
   * @param {number|string} historiId - Histori ID
   * @returns {Promise} - API response with histori detail data
   */
  getHistoriDetail: async (historiId) => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.HISTORI.DETAIL(historiId));
  },

  /**
   * Get available jenis histori options for filter
   * @returns {Promise} - API response with jenis histori types
   */
  getJenisHistoriOptions: async () => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.HISTORI.JENIS_HISTORI_OPTIONS);
  },

  /**
   * Get available years for filter
   * @returns {Promise} - API response with available years
   */
  getAvailableYears: async () => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.HISTORI.AVAILABLE_YEARS);
  }
};