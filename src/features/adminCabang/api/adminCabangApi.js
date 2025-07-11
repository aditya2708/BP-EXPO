import api from '../../../api/axiosConfig';
import { ADMIN_CABANG_ENDPOINTS, MANAGEMENT_ENDPOINTS } from '../../../constants/endpoints';

// Import restructured APIs
import { jenjangApi } from './masterData/jenjangApi';
import { mataPelajaranApi } from './masterData/mataPelajaranApi';
import { kelasApi } from './masterData/kelasApi';
import { materiApi } from './masterData/materiApi';
import { kurikulumApi } from './akademik/kurikulumApi';

/**
 * Admin Cabang API service - Main API orchestrator
 * Reorganized by sections: Dashboard, Profile, Master Data, Akademik, Management
 */
export const adminCabangApi = {
  // ============ DASHBOARD & PROFILE ============
  getDashboard: async () => api.get(ADMIN_CABANG_ENDPOINTS.DASHBOARD),
  
  getProfile: async () => api.get(ADMIN_CABANG_ENDPOINTS.PROFILE),
  
  updateProfile: async (profileData) => api.post(ADMIN_CABANG_ENDPOINTS.PROFILE, profileData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // ============ MASTER DATA SECTION ============
  masterData: {
    jenjang: jenjangApi,
    mataPelajaran: mataPelajaranApi,
    kelas: kelasApi,
    materi: materiApi,
  },

  // ============ AKADEMIK SECTION ============
  akademik: {
    kurikulum: kurikulumApi,
  },

  // ============ MANAGEMENT OPERATIONS ============
  getAdminShelters: async (params = {}) => api.get('/admin-shelter', { params }),
  
  getAdminShelterDetail: async (adminShelterId) => api.get(`/admin-shelter/${adminShelterId}`),
  
  createAdminShelter: async (adminShelterData) => api.post('/admin-shelter', adminShelterData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  updateAdminShelter: async (adminShelterId, adminShelterData) => api.post(`/admin-shelter/${adminShelterId}`, adminShelterData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  deleteAdminShelter: async (adminShelterId) => api.delete(`/admin-shelter/${adminShelterId}`),

  // ============ WILBIN OPERATIONS ============
  getWilbin: async (params = {}) => api.get(MANAGEMENT_ENDPOINTS.WILBIN, { params }),
  
  getWilbinDetail: async (wilbinId) => api.get(MANAGEMENT_ENDPOINTS.WILBIN_DETAIL(wilbinId)),
  
  createWilbin: async (wilbinData) => api.post(MANAGEMENT_ENDPOINTS.WILBIN, wilbinData),
  
  updateWilbin: async (wilbinId, wilbinData) => api.put(MANAGEMENT_ENDPOINTS.WILBIN_DETAIL(wilbinId), wilbinData),
  
  deleteWilbin: async (wilbinId) => api.delete(MANAGEMENT_ENDPOINTS.WILBIN_DETAIL(wilbinId)),

  // ============ BACKWARD COMPATIBILITY (DEPRECATED) ============
  // Legacy direct method access - will be removed in Phase 10
  getAllJenjang: jenjangApi.getAll,
  getJenjangForDropdown: jenjangApi.getForDropdown,
  getJenjangStatistics: jenjangApi.getStatistics,
  getMataPelajaranByJenjang: mataPelajaranApi.getByJenjang,
  getMataPelajaranForDropdown: mataPelajaranApi.getForDropdown,
  getKelasByJenjang: kelasApi.getByJenjang,
  getMateriByKelas: materiApi.getByKelas,
  createMateri: materiApi.create,
  getMateriForDropdown: materiApi.getForDropdown,
  getAllKurikulum: kurikulumApi.getAll,
  getKurikulumDetail: kurikulumApi.getDetail,
  createKurikulum: kurikulumApi.create,
  updateKurikulum: kurikulumApi.update,
  deleteKurikulum: kurikulumApi.delete,
  getActiveKurikulum: kurikulumApi.getActive,
  setActiveKurikulum: kurikulumApi.setActive,
  getKurikulumStatistics: kurikulumApi.getStatistics,
  getTahunBerlaku: kurikulumApi.getTahunBerlaku,
  addMateriToKurikulum: kurikulumApi.assignMateri,
  removeMateriFromKurikulum: kurikulumApi.removeMateri,
  getKurikulumCascadeData: kurikulumApi.getCascadeData,
  checkCanDeleteKurikulum: kurikulumApi.checkCanDelete,
  duplicateKurikulum: kurikulumApi.duplicate,
};