import api from '../../../api/axiosConfig';
import { DONATUR_ENDPOINTS } from '../../../constants/endpoints';

/**
 * Donatur API service
 * Contains methods for donatur specific API requests
 */
export const donaturApi = {
  /**
   * Get donatur dashboard data
   * @returns {Promise} - API response with dashboard data
   */
  getDashboard: async () => {
    return await api.get(DONATUR_ENDPOINTS.DASHBOARD);
  },

  /**
   * Get donatur profile
   * @returns {Promise} - API response with profile data
   */
  getProfile: async () => {
    return await api.get(DONATUR_ENDPOINTS.PROFILE);
  },

  /**
   * Update donatur profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} - API response
   */
  updateProfile: async (profileData) => {
    return await api.post(DONATUR_ENDPOINTS.PROFILE, profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Get sponsored children
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with children data
   */
  getSponsoredChildren: async (params = {}) => {
    return await api.get(DONATUR_ENDPOINTS.CHILDREN, { params });
  },

  /**
   * Get sponsored child details
   * @param {number|string} childId - Child ID
   * @returns {Promise} - API response with child details
   */
  getChildDetails: async (childId) => {
    return await api.get(`${DONATUR_ENDPOINTS.CHILDREN}/${childId}`);
  },

  /**
   * Get donation history
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with donation history
   */
  getDonationHistory: async (params = {}) => {
    return await api.get('/donations', { params });
  },

  /**
   * Get donation details
   * @param {number|string} donationId - Donation ID
   * @returns {Promise} - API response with donation details
   */
  getDonationDetails: async (donationId) => {
    return await api.get(`/donations/${donationId}`);
  },

  /**
   * Create new donation
   * @param {Object} donationData - Donation data
   * @returns {Promise} - API response
   */
  createDonation: async (donationData) => {
    return await api.post('/donations', donationData);
  },

  /**
   * Get notifications
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with notifications
   */
  getNotifications: async (params = {}) => {
    return await api.get('/notifications', { params });
  },

  /**
   * Mark notification as read
   * @param {number|string} notificationId - Notification ID
   * @returns {Promise} - API response
   */
  markNotificationAsRead: async (notificationId) => {
    return await api.put(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} - API response
   */
  markAllNotificationsAsRead: async () => {
    return await api.put('/notifications/read-all');
  },

  /**
   * Get upcoming events
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with events data
   */
  getEvents: async (params = {}) => {
    return await api.get('/events', { params });
  },

  /**
   * Get child attendance history
   * @param {number|string} childId - Child ID
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with attendance data
   */
  getChildAttendance: async (childId, params = {}) => {
    return await api.get(`/children/${childId}/attendance`, { params });
  },

  /**
   * Get child academic progress
   * @param {number|string} childId - Child ID
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with academic progress data
   */
  getChildProgress: async (childId, params = {}) => {
    return await api.get(`/children/${childId}/progress`, { params });
  }
};