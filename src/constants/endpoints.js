// src/constants/endpoints.js

/**
 * API Endpoints Constants
 * Organized by sections: Admin Cabang (Master Data + Akademik), Admin Shelter, Management
 */

const BASE_URL = '/api';

// ============================================================================
// ADMIN CABANG ENDPOINTS
// ============================================================================

export const ADMIN_CABANG_ENDPOINTS = {
  // Core endpoints
  DASHBOARD: `${BASE_URL}/admin-cabang/dashboard`,
  PROFILE: `${BASE_URL}/admin-cabang/profile`,

  // Master Data Section
  MASTER_DATA: {
    // Jenjang
    JENJANG: `${BASE_URL}/admin-cabang/master-data/jenjang`,
    JENJANG_DETAIL: (id) => `${BASE_URL}/admin-cabang/master-data/jenjang/${id}`,
    JENJANG_DROPDOWN: `${BASE_URL}/admin-cabang/master-data/jenjang/dropdown`,
    JENJANG_STATISTICS: `${BASE_URL}/admin-cabang/master-data/jenjang/statistics`,
    JENJANG_CHECK_DELETE: (id) => `${BASE_URL}/admin-cabang/master-data/jenjang/${id}/check-can-delete`,

    // Mata Pelajaran
    MATA_PELAJARAN: `${BASE_URL}/admin-cabang/master-data/mata-pelajaran`,
    MATA_PELAJARAN_DETAIL: (id) => `${BASE_URL}/admin-cabang/master-data/mata-pelajaran/${id}`,
    MATA_PELAJARAN_DROPDOWN: `${BASE_URL}/admin-cabang/master-data/mata-pelajaran/dropdown`,
    MATA_PELAJARAN_BY_JENJANG: (jenjangId) => `${BASE_URL}/admin-cabang/master-data/mata-pelajaran/by-jenjang/${jenjangId}`,
    MATA_PELAJARAN_STATISTICS: `${BASE_URL}/admin-cabang/master-data/mata-pelajaran/statistics`,
    MATA_PELAJARAN_CASCADE: `${BASE_URL}/admin-cabang/master-data/mata-pelajaran/cascade`,
    MATA_PELAJARAN_CHECK_DELETE: (id) => `${BASE_URL}/admin-cabang/master-data/mata-pelajaran/${id}/check-can-delete`,

    // Kelas
    KELAS: `${BASE_URL}/admin-cabang/master-data/kelas`,
    KELAS_DETAIL: (id) => `${BASE_URL}/admin-cabang/master-data/kelas/${id}`,
    KELAS_DROPDOWN: `${BASE_URL}/admin-cabang/master-data/kelas/dropdown`,
    KELAS_BY_JENJANG: (jenjangId) => `${BASE_URL}/admin-cabang/master-data/kelas/by-jenjang/${jenjangId}`,
    KELAS_STATISTICS: `${BASE_URL}/admin-cabang/master-data/kelas/statistics`,
    KELAS_TINGKAT_OPTIONS: (jenjangId) => `${BASE_URL}/admin-cabang/master-data/kelas/tingkat-options/${jenjangId}`,
    KELAS_VALIDATE: `${BASE_URL}/admin-cabang/master-data/kelas/validate`,
    KELAS_CASCADE: `${BASE_URL}/admin-cabang/master-data/kelas/cascade`,
    KELAS_CHECK_DELETE: (id) => `${BASE_URL}/admin-cabang/master-data/kelas/${id}/check-can-delete`,

    // Materi
    MATERI: `${BASE_URL}/admin-cabang/master-data/materi`,
    MATERI_DETAIL: (id) => `${BASE_URL}/admin-cabang/master-data/materi/${id}`,
    MATERI_DROPDOWN: `${BASE_URL}/admin-cabang/master-data/materi/dropdown`,
    MATERI_BY_KELAS: (kelasId) => `${BASE_URL}/admin-cabang/master-data/materi/by-kelas/${kelasId}`,
    MATERI_BY_MATA_PELAJARAN: (mataPelajaranId) => `${BASE_URL}/admin-cabang/master-data/materi/by-mata-pelajaran/${mataPelajaranId}`,
    MATERI_STATISTICS: `${BASE_URL}/admin-cabang/master-data/materi/statistics`,
    MATERI_VALIDATE: `${BASE_URL}/admin-cabang/master-data/materi/validate`,
    MATERI_CASCADE: `${BASE_URL}/admin-cabang/master-data/materi/cascade`,
    MATERI_CHECK_DELETE: (id) => `${BASE_URL}/admin-cabang/master-data/materi/${id}/check-can-delete`,
  },

  // Akademik Section
  AKADEMIK: {
    // Kurikulum
    KURIKULUM: `${BASE_URL}/admin-cabang/akademik/kurikulum`,
    KURIKULUM_DETAIL: (id) => `${BASE_URL}/admin-cabang/akademik/kurikulum/${id}`,
    KURIKULUM_ACTIVE: `${BASE_URL}/admin-cabang/akademik/kurikulum/active`,
    KURIKULUM_SET_ACTIVE: (id) => `${BASE_URL}/admin-cabang/akademik/kurikulum/${id}/set-active`,
    KURIKULUM_STATISTICS: `${BASE_URL}/admin-cabang/akademik/kurikulum/statistics`,
    KURIKULUM_TAHUN_BERLAKU: `${BASE_URL}/admin-cabang/akademik/kurikulum/tahun-berlaku`,
    KURIKULUM_DUPLICATE: (id) => `${BASE_URL}/admin-cabang/akademik/kurikulum/${id}/duplicate`,
    KURIKULUM_CHECK_DELETE: (id) => `${BASE_URL}/admin-cabang/akademik/kurikulum/${id}/check-can-delete`,
    
    // Materi Assignment
    KURIKULUM_ASSIGN_MATERI: (id) => `${BASE_URL}/admin-cabang/akademik/kurikulum/${id}/assign-materi`,
    KURIKULUM_REMOVE_MATERI: (id) => `${BASE_URL}/admin-cabang/akademik/kurikulum/${id}/remove-materi`,
    KURIKULUM_REORDER_MATERI: (id) => `${BASE_URL}/admin-cabang/akademik/kurikulum/${id}/reorder-materi`,
    KURIKULUM_CASCADE_DATA: `${BASE_URL}/admin-cabang/akademik/kurikulum/cascade-data`,
  }
};

// ============================================================================
// ADMIN SHELTER ENDPOINTS
// ============================================================================

export const ADMIN_SHELTER_ENDPOINTS = {
  // Core endpoints
  DASHBOARD: `${BASE_URL}/admin-shelter/dashboard`,
  PROFILE: `${BASE_URL}/admin-shelter/profile`,

  // Anak Management
  ANAK: `${BASE_URL}/admin-shelter/anak`,
  ANAK_DETAIL: (id) => `${BASE_URL}/admin-shelter/anak/${id}`,
  ANAK_STATISTICS: `${BASE_URL}/admin-shelter/anak/statistics`,

  // Semester Management
  SEMESTER: `${BASE_URL}/admin-shelter/semester`,
  SEMESTER_DETAIL: (id) => `${BASE_URL}/admin-shelter/semester/${id}`,
  SEMESTER_ACTIVE: `${BASE_URL}/admin-shelter/semester/active`,
  SEMESTER_SET_ACTIVE: (id) => `${BASE_URL}/admin-shelter/semester/${id}/set-active`,
  SEMESTER_STATISTICS: (id) => `${BASE_URL}/admin-shelter/semester/${id}/statistics`,
  SEMESTER_TAHUN_AJARAN: `${BASE_URL}/admin-shelter/semester/tahun-ajaran`,
  SEMESTER_BY_TAHUN: `${BASE_URL}/admin-shelter/semester/by-tahun-ajaran`,
  SEMESTER_DUPLICATE: (id) => `${BASE_URL}/admin-shelter/semester/${id}/duplicate`,
  SEMESTER_CHECK_DELETE: (id) => `${BASE_URL}/admin-shelter/semester/${id}/check-can-delete`,

  // Donatur & Attendance
  DONATUR: `${BASE_URL}/admin-shelter/donatur`,
  DONATUR_DETAIL: (id) => `${BASE_URL}/admin-shelter/donatur/${id}`,
  ATTENDANCE: `${BASE_URL}/admin-shelter/attendance`,
  ATTENDANCE_DETAIL: (id) => `${BASE_URL}/admin-shelter/attendance/${id}`,

  // Tutor & Kelompok
  TUTOR: `${BASE_URL}/admin-shelter/tutor`,
  TUTOR_DETAIL: (id) => `${BASE_URL}/admin-shelter/tutor/${id}`,
  TUTOR_COMPETENCY: (tutorId) => `${BASE_URL}/admin-shelter/tutor/${tutorId}/competency`,
  KELOMPOK: `${BASE_URL}/admin-shelter/kelompok`,
  KELOMPOK_DETAIL: (id) => `${BASE_URL}/admin-shelter/kelompok/${id}`,
  KELOMPOK_LEVELS: `${BASE_URL}/admin-shelter/kelompok-levels`,
  KELOMPOK_AVAILABLE_CHILDREN: (shelterId) => `${BASE_URL}/admin-shelter/kelompok/available-children/${shelterId}`,
  KELOMPOK_CHILDREN: (kelompokId) => `${BASE_URL}/admin-shelter/kelompok/${kelompokId}/children`,

  // Letters & Documents
  SURAT: (childId) => `${BASE_URL}/admin-shelter/anak/${childId}/surat`,
  SURAT_DETAIL: (childId, suratId) => `${BASE_URL}/admin-shelter/anak/${childId}/surat/${suratId}`,
};

// ============================================================================
// MANAGEMENT ENDPOINTS
// ============================================================================

export const MANAGEMENT_ENDPOINTS = {
  // Admin Shelter Management
  ADMIN_SHELTER: `${BASE_URL}/admin-shelter`,
  ADMIN_SHELTER_DETAIL: (id) => `${BASE_URL}/admin-shelter/${id}`,

  // Wilbin Management
  WILBIN: `${BASE_URL}/wilbin`,
  WILBIN_DETAIL: (id) => `${BASE_URL}/wilbin/${id}`,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Build URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} - URL with query string
 */
export const buildUrlWithParams = (baseUrl, params = {}) => {
  const url = new URL(baseUrl, window.location.origin);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.pathname + url.search;
};

/**
 * Get master data endpoints by section
 * @param {string} section - Section name (jenjang, mata_pelajaran, kelas, materi)
 * @returns {Object} - Section endpoints
 */
export const getMasterDataEndpoints = (section) => {
  const sectionMap = {
    jenjang: 'JENJANG',
    mata_pelajaran: 'MATA_PELAJARAN',
    kelas: 'KELAS',
    materi: 'MATERI'
  };
  
  const sectionKey = sectionMap[section];
  if (!sectionKey) return null;
  
  return Object.keys(ADMIN_CABANG_ENDPOINTS.MASTER_DATA)
    .filter(key => key.startsWith(sectionKey))
    .reduce((obj, key) => {
      obj[key] = ADMIN_CABANG_ENDPOINTS.MASTER_DATA[key];
      return obj;
    }, {});
};

// Export all endpoint categories
export default {
  ADMIN_CABANG_ENDPOINTS,
  ADMIN_SHELTER_ENDPOINTS,
  MANAGEMENT_ENDPOINTS,
  buildUrlWithParams,
  getMasterDataEndpoints
};