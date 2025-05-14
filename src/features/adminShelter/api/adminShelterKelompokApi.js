import api from '../../../api/axiosConfig';
import { ADMIN_SHELTER_ENDPOINTS } from '../../../constants/endpoints';

/**
 * Admin Shelter Kelompok API service
 * Contains methods for kelompok (group) management API requests
 */
export const adminShelterKelompokApi = {
  /**
   * Get list of kelompok with pagination
   * @param {Object} params - Query parameters for filtering and pagination
   * @returns {Promise} - API response with kelompok data
   */
  getAllKelompok: async (params = {}) => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.LIST, { params });
  },

  /**
   * Get kelompok details
   * @param {number|string} id - Kelompok ID
   * @returns {Promise} - API response with kelompok details
   */
  getKelompokDetail: async (id) => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.DETAIL(id));
  },

  /**
   * Create new kelompok
   * @param {Object} kelompokData - Kelompok data
   * @returns {Promise} - API response
   */
  createKelompok: async (kelompokData) => {
    return await api.post(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.LIST, kelompokData);
  },

  /**
   * Update existing kelompok
   * @param {number|string} id - Kelompok ID
   * @param {Object} kelompokData - Kelompok data to update
   * @returns {Promise} - API response
   */
  updateKelompok: async (id, kelompokData) => {
    return await api.post(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.DETAIL(id), kelompokData);
  },

  /**
   * Delete kelompok
   * @param {number|string} id - Kelompok ID
   * @returns {Promise} - API response
   */
  deleteKelompok: async (id) => {
    return await api.delete(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.DETAIL(id));
  },

  /**
   * Get list of level anak binaan for dropdown
   * @returns {Promise} - API response with level data
   */
  getLevels: async () => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.LEVELS);
  },

  /**
   * Get list of available children for a shelter (not in any group)
   * @param {number|string} shelterId - Shelter ID
   * @returns {Promise} - API response with available children data
   */
  getAvailableChildren: async (shelterId) => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.AVAILABLE_CHILDREN(shelterId));
  },

  /**
   * Get list of children in a kelompok
   * @param {number|string} kelompokId - Kelompok ID
   * @returns {Promise} - API response with children data
   */
  getGroupChildren: async (kelompokId) => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.CHILDREN(kelompokId));
  },

  /**
   * Add child to kelompok
   * @param {number|string} kelompokId - Kelompok ID
   * @param {number|string} childId - Child ID
   * @returns {Promise} - API response
   */
  addChildToGroup: async (kelompokId, childId) => {
    return await api.post(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.ADD_CHILD(kelompokId), { id_anak: childId });
  },

  /**
   * Remove child from kelompok
   * @param {number|string} kelompokId - Kelompok ID
   * @param {number|string} childId - Child ID
   * @returns {Promise} - API response
   */
  removeChildFromGroup: async (kelompokId, childId) => {
    return await api.delete(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.REMOVE_CHILD(kelompokId, childId));
  },

  /**
   * Move child to another shelter
   * @param {number|string} childId - Child ID
   * @param {number|string} shelterId - New shelter ID
   * @returns {Promise} - API response
   */
  moveChildToShelter: async (childId, shelterId) => {
    return await api.post(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.MOVE_CHILD(childId), { id_shelter_baru: shelterId });
  }
};