import api from '../../../api/axiosConfig';
import { ADMIN_CABANG_ENDPOINTS, MANAGEMENT_ENDPOINTS } from '../../../constants/endpoints';

/**
 * Admin Cabang API service
 * Contains methods for admin cabang specific API requests
 */
export const adminCabangApi = {
  /**
   * Get admin cabang dashboard data
   * @returns {Promise} - API response with dashboard data
   */
  getDashboard: async () => {
    return await api.get(ADMIN_CABANG_ENDPOINTS.DASHBOARD);
  },

  /**
   * Get admin cabang profile
   * @returns {Promise} - API response with profile data
   */
  getProfile: async () => {
    return await api.get(ADMIN_CABANG_ENDPOINTS.PROFILE);
  },

  /**
   * Update admin cabang profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} - API response
   */
  updateProfile: async (profileData) => {
    return await api.post(ADMIN_CABANG_ENDPOINTS.PROFILE, profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // ============ KURIKULUM OPERATIONS ============
  
  /**
   * Get all kurikulum
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with kurikulum data
   */
  getAllKurikulum: async (params = {}) => {
    return await api.get('/admin-cabang/kurikulum', { params });
  },

  /**
   * Get kurikulum detail
   * @param {number|string} id - Kurikulum ID
   * @returns {Promise} - API response with kurikulum details
   */
  getKurikulumDetail: async (id) => {
    return await api.get(`/admin-cabang/kurikulum/${id}`);
  },

  /**
   * Create new kurikulum
   * @param {Object} kurikulumData - Kurikulum data
   * @returns {Promise} - API response
   */
  createKurikulum: async (kurikulumData) => {
    return await api.post('/admin-cabang/kurikulum', kurikulumData);
  },

  /**
   * Update kurikulum
   * @param {number|string} id - Kurikulum ID
   * @param {Object} kurikulumData - Kurikulum data
   * @returns {Promise} - API response
   */
  updateKurikulum: async (id, kurikulumData) => {
    return await api.put(`/admin-cabang/kurikulum/${id}`, kurikulumData);
  },

  /**
   * Delete kurikulum
   * @param {number|string} id - Kurikulum ID
   * @returns {Promise} - API response
   */
  deleteKurikulum: async (id) => {
    return await api.delete(`/admin-cabang/kurikulum/${id}`);
  },

  /**
   * Get active kurikulum
   * @returns {Promise} - API response with active kurikulum
   */
  getActiveKurikulum: async () => {
    return await api.get('/admin-cabang/kurikulum/active');
  },

  /**
   * Set kurikulum as active
   * @param {number|string} id - Kurikulum ID
   * @returns {Promise} - API response
   */
  setActiveKurikulum: async (id) => {
    return await api.post(`/admin-cabang/kurikulum/${id}/set-active`);
  },

  /**
   * Get kurikulum statistics
   * @param {number|string} id - Kurikulum ID
   * @returns {Promise} - API response with statistics
   */
  getKurikulumStatistics: async (id) => {
    return await api.get(`/admin-cabang/kurikulum/${id}/statistics`);
  },

  /**
   * Get tahun berlaku options
   * @returns {Promise} - API response with tahun berlaku data
   */
  getTahunBerlaku: async () => {
    return await api.get('/admin-cabang/kurikulum/tahun-berlaku');
  },

  /**
   * Add materi to kurikulum (supports creating new materi)
   * @param {number|string} id - Kurikulum ID
   * @param {Object} materiData - Materi data
   * @param {string} materiData.id_mata_pelajaran - Mata Pelajaran ID
   * @param {string} materiData.id_kelas - Kelas ID
   * @param {string} [materiData.id_materi] - Existing Materi ID (if selecting existing)
   * @param {string} [materiData.new_materi_name] - New materi name (if creating new)
   * @returns {Promise} - API response
   */
  addMateriToKurikulum: async (id, materiData) => {
    return await api.post(`/admin-cabang/kurikulum/${id}/materi`, materiData);
  },

  /**
   * Remove materi from kurikulum
   * @param {number|string} id - Kurikulum ID
   * @param {number|string} materiId - Kurikulum Materi ID
   * @returns {Promise} - API response
   */
  removeMateriFromKurikulum: async (id, materiId) => {
    return await api.delete(`/admin-cabang/kurikulum/${id}/materi/${materiId}`);
  },

  /**
   * Get kurikulum cascade data
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with cascade data
   */
  getKurikulumCascadeData: async (params) => {
    return await api.get('/admin-cabang/kurikulum/cascade-data', { params });
  },

  /**
   * Check if kurikulum can be deleted
   * @param {number|string} id - Kurikulum ID
   * @returns {Promise} - API response
   */
  checkCanDeleteKurikulum: async (id) => {
    return await api.get(`/admin-cabang/kurikulum/${id}/check-can-delete`);
  },

  /**
   * Duplicate kurikulum
   * @param {number|string} id - Kurikulum ID
   * @param {Object} newData - New kurikulum data
   * @returns {Promise} - API response
   */
  duplicateKurikulum: async (id, newData) => {
    return await api.post(`/admin-cabang/kurikulum/${id}/duplicate`, newData);
  },

  // ============ WILBIN OPERATIONS ============

  /**
   * Get list of wilbin (wilayah binaan)
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with wilbin data
   */
  getWilbin: async (params = {}) => {
    return await api.get(MANAGEMENT_ENDPOINTS.WILBIN, { params });
  },

  /**
   * Get wilbin details
   * @param {number|string} wilbinId - Wilbin ID
   * @returns {Promise} - API response with wilbin details
   */
  getWilbinDetail: async (wilbinId) => {
    return await api.get(MANAGEMENT_ENDPOINTS.WILBIN_DETAIL(wilbinId));
  },

  /**
   * Create new wilbin
   * @param {Object} wilbinData - Wilbin data
   * @returns {Promise} - API response
   */
  createWilbin: async (wilbinData) => {
    return await api.post(MANAGEMENT_ENDPOINTS.WILBIN, wilbinData);
  },

  /**
   * Update wilbin
   * @param {number|string} wilbinId - Wilbin ID
   * @param {Object} wilbinData - Wilbin data
   * @returns {Promise} - API response
   */
  updateWilbin: async (wilbinId, wilbinData) => {
    return await api.put(MANAGEMENT_ENDPOINTS.WILBIN_DETAIL(wilbinId), wilbinData);
  },

  /**
   * Delete wilbin
   * @param {number|string} wilbinId - Wilbin ID
   * @returns {Promise} - API response
   */
  deleteWilbin: async (wilbinId) => {
    return await api.delete(MANAGEMENT_ENDPOINTS.WILBIN_DETAIL(wilbinId));
  },

  // ============ SHELTER OPERATIONS ============

  /**
   * Get list of shelters
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with shelter data
   */
  getShelters: async (params = {}) => {
    return await api.get(MANAGEMENT_ENDPOINTS.SHELTER, { params });
  },

  /**
   * Get shelter details
   * @param {number|string} shelterId - Shelter ID
   * @returns {Promise} - API response with shelter details
   */
  getShelterDetail: async (shelterId) => {
    return await api.get(MANAGEMENT_ENDPOINTS.SHELTER_DETAIL(shelterId));
  },

  /**
   * Create new shelter
   * @param {Object} shelterData - Shelter data
   * @returns {Promise} - API response
   */
  createShelter: async (shelterData) => {
    return await api.post(MANAGEMENT_ENDPOINTS.SHELTER, shelterData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Update shelter
   * @param {number|string} shelterId - Shelter ID
   * @param {Object} shelterData - Shelter data
   * @returns {Promise} - API response
   */
  updateShelter: async (shelterId, shelterData) => {
    return await api.post(MANAGEMENT_ENDPOINTS.SHELTER_DETAIL(shelterId), shelterData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete shelter
   * @param {number|string} shelterId - Shelter ID
   * @returns {Promise} - API response
   */
  deleteShelter: async (shelterId) => {
    return await api.delete(MANAGEMENT_ENDPOINTS.SHELTER_DETAIL(shelterId));
  },

  // ============ ADMIN SHELTER OPERATIONS ============

  /**
   * Get list of admin shelter
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with admin shelter data
   */
  getAdminShelters: async (params = {}) => {
    return await api.get('/admin-shelter', { params });
  },

  /**
   * Get admin shelter details
   * @param {number|string} adminShelterId - Admin Shelter ID
   * @returns {Promise} - API response with admin shelter details
   */
  getAdminShelterDetail: async (adminShelterId) => {
    return await api.get(`/admin-shelter/${adminShelterId}`);
  },

  /**
   * Create new admin shelter
   * @param {Object} adminShelterData - Admin Shelter data
   * @returns {Promise} - API response
   */
  createAdminShelter: async (adminShelterData) => {
    return await api.post('/admin-shelter', adminShelterData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Update admin shelter
   * @param {number|string} adminShelterId - Admin Shelter ID
   * @param {Object} adminShelterData - Admin Shelter data
   * @returns {Promise} - API response
   */
  updateAdminShelter: async (adminShelterId, adminShelterData) => {
    return await api.post(`/admin-shelter/${adminShelterId}`, adminShelterData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete admin shelter
   * @param {number|string} adminShelterId - Admin Shelter ID
   * @returns {Promise} - API response
   */
  deleteAdminShelter: async (adminShelterId) => {
    return await api.delete(`/admin-shelter/${adminShelterId}`);
  },

  // ============ JENJANG OPERATIONS ============

  /**
   * Get all jenjang
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with jenjang data
   */
  getAllJenjang: async (params = {}) => {
    return await api.get('/admin-cabang/jenjang', { params });
  },

  /**
   * Get jenjang for dropdown
   * @returns {Promise} - API response with jenjang dropdown data
   */
  getJenjangForDropdown: async () => {
    return await api.get('/admin-cabang/jenjang/dropdown');
  },

  /**
   * Get jenjang statistics
   * @returns {Promise} - API response with jenjang statistics
   */
  getJenjangStatistics: async () => {
    return await api.get('/admin-cabang/jenjang/statistics');
  },

  // ============ MATA PELAJARAN OPERATIONS ============

  /**
   * Get mata pelajaran by jenjang
   * @param {number|string} jenjangId - Jenjang ID
   * @returns {Promise} - API response with mata pelajaran data
   */
  getMataPelajaranByJenjang: async (jenjangId) => {
    return await api.get(`/admin-cabang/mata-pelajaran/jenjang/${jenjangId}`);
  },

  /**
   * Get mata pelajaran for dropdown
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with mata pelajaran dropdown data
   */
  getMataPelajaranForDropdown: async (params = {}) => {
    return await api.get('/admin-cabang/mata-pelajaran/dropdown', { params });
  },

  // ============ KELAS OPERATIONS ============

  /**
   * Get kelas by jenjang
   * @param {number|string} jenjangId - Jenjang ID
   * @returns {Promise} - API response with kelas data
   */
  getKelasByJenjang: async (jenjangId) => {
    return await api.get(`/admin-cabang/jenjang/${jenjangId}/kelas`);
  },

  // ============ MATERI OPERATIONS ============

  /**
   * Get materi by kelas
   * @param {number|string} kelasId - Kelas ID
   * @returns {Promise} - API response with materi data
   */
  getMateriByKelas: async (kelasId) => {
    return await api.get(`/admin-cabang/materi/kelas/${kelasId}`);
  },

  /**
   * Create new materi
   * @param {Object} materiData - Materi data
   * @returns {Promise} - API response
   */
  createMateri: async (materiData) => {
    return await api.post('/admin-cabang/materi', materiData);
  },

  /**
   * Get materi for dropdown
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with materi dropdown data
   */
  getMateriForDropdown: async (params = {}) => {
    return await api.get('/admin-cabang/materi/dropdown', { params });
  }
};