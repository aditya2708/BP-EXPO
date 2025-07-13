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
  // ============ GENERAL METHODS ============
  get: (endpoint) => api.get(`/admin-cabang${endpoint}`),
  post: (endpoint, data) => api.post(`/admin-cabang${endpoint}`, data),
  put: (endpoint, data) => api.put(`/admin-cabang${endpoint}`, data),
  delete: (endpoint) => api.delete(`/admin-cabang${endpoint}`),

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
    
    // General master data statistics
    getStatistics: async () => api.get('/admin-cabang/master-data/statistics'),
  },

  // ============ AKADEMIK SECTION ============
  akademik: {
    kurikulum: kurikulumApi,
    
    // General akademik statistics
    getStatistics: async () => api.get('/admin-cabang/akademik/statistics'),
    
    // Recent kurikulum
    getRecentKurikulum: async (limit = 5) => api.get(`/admin-cabang/akademik/kurikulum/recent?limit=${limit}`),
    
    // Semester data
    getSemesterData: async () => api.get('/admin-cabang/akademik/semester'),
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

  // ============ TUTOR OPERATIONS ============
  getTutors: async (params = {}) => api.get('/tutor', { params }),
  
  getTutorDetail: async (tutorId) => api.get(`/tutor/${tutorId}`),
  
  createTutor: async (tutorData) => api.post('/tutor', tutorData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  updateTutor: async (tutorId, tutorData) => api.post(`/tutor/${tutorId}`, tutorData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  deleteTutor: async (tutorId) => api.delete(`/tutor/${tutorId}`),

  // ============ SURVEY OPERATIONS ============
  getSurveys: async (params = {}) => api.get('/survey', { params }),
  
  getSurveyDetail: async (surveyId) => api.get(`/survey/${surveyId}`),
  
  approveSurvey: async (surveyId, approvalData) => api.post(`/survey/${surveyId}/approve`, approvalData),
  
  rejectSurvey: async (surveyId, rejectionData) => api.post(`/survey/${surveyId}/reject`, rejectionData),

  // ============ DONATUR OPERATIONS ============
  getDonatur: async (params = {}) => api.get('/donatur', { params }),
  
  getDonaturDetail: async (donaturId) => api.get(`/donatur/${donaturId}`),
  
  createDonatur: async (donaturData) => api.post('/donatur', donaturData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  updateDonatur: async (donaturId, donaturData) => api.post(`/donatur/${donaturId}`, donaturData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  deleteDonatur: async (donaturId) => api.delete(`/donatur/${donaturId}`),
  
  activateDonatur: async (donaturId) => api.post(`/donatur/${donaturId}/activate`),
  
  deactivateDonatur: async (donaturId) => api.post(`/donatur/${donaturId}/deactivate`),
};