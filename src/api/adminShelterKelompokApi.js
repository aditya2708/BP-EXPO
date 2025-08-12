import api from '../../../api/axiosConfig';
import { ADMIN_SHELTER_ENDPOINTS } from '../../../constants/endpoints';

/**
 * Admin Shelter Kelompok API service - SIMPLIFIED & STREAMLINED
 * 
 * UPDATED: Removed over-engineered methods, focused on core functionality
 * Philosophy: SIMPLIFY & STREAMLINE - provide essential CRUD + kelas gabungan support
 */
export const adminShelterKelompokApi = {
  // =================================
  // CORE CRUD OPERATIONS
  // =================================

  /**
   * Get list of kelompok with optional filtering
   * @param {Object} params - Query parameters
   * @param {string} params.search - Search query
   * @param {Array} params.kelas_ids - Filter by kelas IDs (for kelas gabungan)
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @returns {Promise} - API response with kelompok data
   */
  getAllKelompok: async (params = {}) => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.LIST, { params });
  },

  /**
   * Get kelompok details with kelas gabungan info
   * @param {number|string} id - Kelompok ID
   * @returns {Promise} - API response with kelompok details
   */
  getKelompokDetail: async (id) => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.DETAIL(id));
  },

  /**
   * Create new kelompok with kelas gabungan
   * @param {Object} kelompokData - Kelompok data
   * @param {string} kelompokData.nama_kelompok - Kelompok name
   * @param {Array} kelompokData.kelas_gabungan - Array of kelas IDs
   * @param {number} kelompokData.jumlah_anggota - Number of members
   * @param {Array} kelompokData.anak_ids - Array of anak IDs to assign (optional)
   * @returns {Promise} - API response
   */
  createKelompok: async (kelompokData) => {
    return await api.post(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.CREATE, kelompokData);
  },

  /**
   * Update kelompok
   * @param {number|string} id - Kelompok ID
   * @param {Object} kelompokData - Kelompok data
   * @returns {Promise} - API response
   */
  updateKelompok: async (id, kelompokData) => {
    return await api.post(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.UPDATE(id), kelompokData);
  },

  /**
   * Delete kelompok
   * @param {number|string} id - Kelompok ID
   * @returns {Promise} - API response
   */
  deleteKelompok: async (id) => {
    return await api.delete(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.DELETE(id));
  },

  // =================================
  // KELAS SYSTEM (NEW - replaces old LEVELS)
  // =================================

  /**
   * Get available kelas for kelompok form (replaces getLevels)
   * @returns {Promise} - API response with kelas data grouped by jenjang
   */
  getAvailableKelas: async () => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.AVAILABLE_KELAS);
  },

  // =================================
  // ANAK MANAGEMENT (Enhanced)
  // =================================

  /**
   * Get available anak for specific kelompok (with kelas gabungan compatibility)
   * @param {number|string} kelompokId - Kelompok ID
   * @returns {Promise} - API response with available anak data
   */
  getAvailableAnak: async (kelompokId) => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.AVAILABLE_ANAK(kelompokId));
  },

  /**
   * Add anak to kelompok
   * @param {number|string} kelompokId - Kelompok ID
   * @param {Object} data - Request data
   * @param {Array} data.anak_ids - Array of anak IDs to add
   * @returns {Promise} - API response
   */
  addAnak: async (kelompokId, data) => {
    return await api.post(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.ADD_ANAK(kelompokId), data);
  },

  /**
   * Remove anak from kelompok
   * @param {number|string} kelompokId - Kelompok ID
   * @param {number|string} anakId - Anak ID
   * @returns {Promise} - API response
   */
  removeAnak: async (kelompokId, anakId) => {
    return await api.delete(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.REMOVE_ANAK(kelompokId, anakId));
  },

  /**
   * Get kelompok statistics
   * @param {number|string} kelompokId - Kelompok ID
   * @returns {Promise} - API response with kelompok statistics
   */
  getKelompokStats: async (kelompokId) => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.STATS(kelompokId));
  },

};