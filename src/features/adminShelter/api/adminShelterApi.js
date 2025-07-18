import api from '../../../api/axiosConfig';
import { ADMIN_SHELTER_ENDPOINTS } from '../../../constants/endpoints';

/**
 * Admin Shelter API service
 * Contains methods for admin shelter specific API requests
 * Note: For anak (children) operations, use adminShelterAnakApi instead
 */
export const adminShelterApi = {
  /**
   * Get admin shelter dashboard data
   * @returns {Promise} - API response with dashboard data
   */
  getDashboard: async () => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.DASHBOARD);
  },

  /**
   * Get admin shelter profile
   * @returns {Promise} - API response with profile data
   */
  getProfile: async () => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.PROFILE);
  },

  /**
   * Update admin shelter profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} - API response
   */
  updateProfile: async (profileData) => {
    return await api.post(ADMIN_SHELTER_ENDPOINTS.PROFILE, profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Get list of donatur
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with donatur data
   */
  getDonatur: async (params = {}) => {
    return await api.get('/donatur', { params });
  },

  /**
   * Get donatur details
   * @param {number|string} donaturId - Donatur ID
   * @returns {Promise} - API response with donatur details
   */
  getDonaturDetail: async (donaturId) => {
    return await api.get(`/donatur/${donaturId}`);
  },

  /**
   * Get list of attendance
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with attendance data
   */
  getAttendance: async (params = {}) => {
    return await api.get('/attendance', { params });
  },

  /**
   * Get attendance details
   * @param {number|string} attendanceId - Attendance ID
   * @returns {Promise} - API response with attendance details
   */
  getAttendanceDetail: async (attendanceId) => {
    return await api.get(`/attendance/${attendanceId}`);
  },

  /**
   * Create attendance
   * @param {Object} attendanceData - Attendance data
   * @returns {Promise} - API response
   */
  createAttendance: async (attendanceData) => {
    return await api.post('/attendance', attendanceData);
  },

  /**
   * Update attendance
   * @param {number|string} attendanceId - Attendance ID
   * @param {Object} attendanceData - Attendance data
   * @returns {Promise} - API response
   */
  updateAttendance: async (attendanceId, attendanceData) => {
    return await api.put(`/attendance/${attendanceId}`, attendanceData);
  },

  /**
   * Get today's attendance
   * @returns {Promise} - API response with today's attendance data
   */
  getTodayAttendance: async () => {
    return await api.get('/attendance/today');
  },

  /**
   * Mark child as present
   * @param {number|string} childId - Child ID
   * @returns {Promise} - API response
   */
  markPresent: async (childId) => {
    return await api.post(`/attendance/present/${childId}`);
  },

  /**
   * Mark child as absent
   * @param {number|string} childId - Child ID
   * @returns {Promise} - API response
   */
  markAbsent: async (childId) => {
    return await api.post(`/attendance/absent/${childId}`);
  }
};