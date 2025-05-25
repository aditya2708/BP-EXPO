import api from '../../../api/axiosConfig';
import { ADMIN_SHELTER_ENDPOINTS } from '../../../constants/endpoints';

/**
 * Admin Shelter Riwayat API service
 * Contains methods for riwayat (history records) management API requests
 */
export const adminShelterRiwayatApi = {
  /**
   * Get list of history records for a child
   * @param {number|string} childId - Child ID
   * @param {Object} params - Query parameters for filtering and pagination
   * @returns {Promise} - API response with history records data
   */
  getRiwayat: async (childId, params = {}) => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.RIWAYAT.LIST(childId), { params });
  },

  /**
   * Get history record details
   * @param {number|string} childId - Child ID
   * @param {number|string} riwayatId - History record ID
   * @returns {Promise} - API response with history record details
   */
  getRiwayatDetail: async (childId, riwayatId) => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.RIWAYAT.DETAIL(childId, riwayatId));
  },

  /**
   * Create new history record
   * @param {number|string} childId - Child ID
   * @param {Object} riwayatData - History record data (FormData object)
   * @returns {Promise} - API response
   */
  createRiwayat: async (childId, riwayatData) => {
    // Always set is_read to 0
    if (riwayatData instanceof FormData && !riwayatData.has('is_read')) {
      riwayatData.append('is_read', "0");
    }
    
    return await api.post(ADMIN_SHELTER_ENDPOINTS.RIWAYAT.LIST(childId), riwayatData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // Increase timeout to 30 seconds
    });
  },

  /**
   * Update existing history record
   * @param {number|string} childId - Child ID
   * @param {number|string} riwayatId - History record ID
   * @param {Object} riwayatData - History record data to update (FormData object)
   * @returns {Promise} - API response
   */
  updateRiwayat: async (childId, riwayatId, riwayatData) => {
    // Always set is_read to 0 if not provided
    if (riwayatData instanceof FormData && !riwayatData.has('is_read')) {
      riwayatData.append('is_read', "0");
    }
    
    return await api.post(ADMIN_SHELTER_ENDPOINTS.RIWAYAT.DETAIL(childId, riwayatId), riwayatData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // Increase timeout to 30 seconds
    });
  },

  /**
   * Delete history record
   * @param {number|string} childId - Child ID
   * @param {number|string} riwayatId - History record ID
   * @returns {Promise} - API response
   */
  deleteRiwayat: async (childId, riwayatId) => {
    return await api.delete(ADMIN_SHELTER_ENDPOINTS.RIWAYAT.DETAIL(childId, riwayatId));
  }
};