import api from '../../../api/axiosConfig';

/**
 * Tutor Attendance API service
 * Contains methods for tutor attendance management API requests
 */
export const tutorAttendanceApi = {
  /**
   * Generate QR token for tutor
   * @param {number|string} id_tutor - Tutor ID
   * @param {number} validDays - Number of days token should be valid
   * @returns {Promise} - API response with generated token
   */
  generateTutorToken: async (id_tutor, validDays = 30) => {
    return await api.post('/admin-shelter/tutor-attendance/generate-token', {
      id_tutor,
      valid_days: validDays
    });
  },

  /**
   * Record tutor attendance using QR code
   * @param {number|string} id_tutor - Tutor ID
   * @param {number|string} id_aktivitas - Activity ID
   * @param {string|null} status - Attendance status or null for auto-detection
   * @param {string} token - QR token for verification
   * @param {string} arrival_time - Arrival time (format: YYYY-MM-DD HH:MM:SS)
   * @returns {Promise} - API response with recorded attendance
   */
 recordTutorAttendanceByQr: async (id_aktivitas, token, arrival_time = null) => {
  const params = {
    id_aktivitas,
    token
  };
  
  if (arrival_time) {
    params.arrival_time = arrival_time;
  }
  
  return await api.post('/admin-shelter/tutor-attendance/record-by-qr', params);
},

  /**
   * Record tutor attendance manually
   * @param {number|string} id_tutor - Tutor ID
   * @param {number|string} id_aktivitas - Activity ID
   * @param {string|null} status - Attendance status or null for auto-detection
   * @param {string} notes - Verification notes
   * @param {string} arrival_time - Arrival time (format: YYYY-MM-DD HH:MM:SS)
   * @returns {Promise} - API response with recorded attendance
   */
  recordTutorAttendanceManually: async (id_tutor, id_aktivitas, status, notes = '', arrival_time = null) => {
    const params = {
      id_tutor,
      id_aktivitas,
      notes
    };
    
    if (status) {
      params.status = status;
    }
    
    if (arrival_time) {
      params.arrival_time = arrival_time;
    }
    
    return await api.post('/admin-shelter/tutor-attendance/record-manual', params);
  },

  /**
   * Get tutor attendance for an activity
   * @param {number|string} id_aktivitas - Activity ID
   * @returns {Promise} - API response with tutor attendance record
   */
  getTutorAttendanceByActivity: async (id_aktivitas) => {
    return await api.get(`/admin-shelter/tutor-attendance/activity/${id_aktivitas}`);
  },

  /**
   * Get attendance history for a tutor
   * @param {number|string} id_tutor - Tutor ID
   * @param {Object} filters - Optional filters (date_from, date_to, status)
   * @returns {Promise} - API response with attendance history
   */
  getTutorAttendanceHistory: async (id_tutor, filters = {}) => {
    return await api.get(`/admin-shelter/tutor-attendance/tutor/${id_tutor}`, {
      params: filters
    });
  }
};