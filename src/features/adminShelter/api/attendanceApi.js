import api from '../../../api/axiosConfig';

/**
 * Attendance API service
 * Contains methods for attendance management API requests
 */
export const attendanceApi = {
  /**
   * Record attendance using QR code verification
   * @param {number|string} id_anak - Student ID
   * @param {number|string} id_aktivitas - Activity ID
   * @param {string} status - Attendance status ('present' or 'absent')
   * @param {string} token - QR token for verification
   * @returns {Promise} - API response with recorded attendance
   */
  recordAttendanceByQr: async (id_anak, id_aktivitas, status, token) => {
    return await api.post('/admin-shelter/attendance/record-by-qr', {
      id_anak,
      id_aktivitas,
      status,
      token
    });
  },

  /**
   * Record attendance manually
   * @param {number|string} id_anak - Student ID
   * @param {number|string} id_aktivitas - Activity ID
   * @param {string} status - Attendance status ('present' or 'absent')
   * @param {string} notes - Optional notes for manual verification
   * @returns {Promise} - API response with recorded attendance
   */
  recordAttendanceManually: async (id_anak, id_aktivitas, status, notes = '') => {
    return await api.post('/admin-shelter/attendance/record-manual', {
      id_anak,
      id_aktivitas,
      status,
      notes
    });
  },

  /**
   * Get attendance records for an activity
   * @param {number|string} id_aktivitas - Activity ID
   * @param {Object} filters - Optional filters (is_verified, verification_status)
   * @returns {Promise} - API response with attendance records
   */
  getAttendanceByActivity: async (id_aktivitas, filters = {}) => {
    return await api.get(`/admin-shelter/attendance/activity/${id_aktivitas}`, {
      params: filters
    });
  },

  /**
   * Get attendance records for a student
   * @param {number|string} id_anak - Student ID
   * @param {Object} filters - Optional filters (is_verified, verification_status, date_from, date_to)
   * @returns {Promise} - API response with attendance records
   */
  getAttendanceByStudent: async (id_anak, filters = {}) => {
    return await api.get(`/admin-shelter/attendance/student/${id_anak}`, {
      params: filters
    });
  },

  /**
   * Manually verify an attendance record
   * @param {number|string} id_absen - Attendance ID
   * @param {string} notes - Notes explaining manual verification
   * @returns {Promise} - API response
   */
  manualVerify: async (id_absen, notes) => {
    return await api.post(`/admin-shelter/attendance/${id_absen}/verify`, {
      notes
    });
  },

  /**
   * Reject an attendance verification
   * @param {number|string} id_absen - Attendance ID
   * @param {string} reason - Reason for rejection
   * @returns {Promise} - API response
   */
  rejectVerification: async (id_absen, reason) => {
    return await api.post(`/admin-shelter/attendance/${id_absen}/reject`, {
      reason
    });
  },

  /**
   * Get verification history for an attendance record
   * @param {number|string} id_absen - Attendance ID
   * @returns {Promise} - API response with verification history
   */
  getVerificationHistory: async (id_absen) => {
    return await api.get(`/admin-shelter/attendance/${id_absen}/verification-history`);
  },

  /**
   * Generate attendance statistics
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @param {number|string} id_shelter - Optional shelter ID
   * @returns {Promise} - API response with statistics
   */
  generateStats: async (startDate, endDate, id_shelter = null) => {
    const params = {
      start_date: startDate,
      end_date: endDate
    };
    
    if (id_shelter) {
      params.id_shelter = id_shelter;
    }
    
    return await api.post('/admin-shelter/attendance-reports/statistics', params);
  }
};