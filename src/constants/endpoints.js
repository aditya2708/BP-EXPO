// src/constants/endpoints.js

/**
 * API Endpoints Constants
 * Organized by sections: Auth, Admin Cabang, Admin Shelter, Management
 */

const BASE_URL = '';

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  USER: `${BASE_URL}/auth/user`
};

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
    KELAS_CHECK_DELETE: (id) => `${BASE_URL}/admin-cabang/master-data/kelas/${id}/check-can-delete`,

    // Materi
    MATERI: `${BASE_URL}/admin-cabang/master-data/materi`,
    MATERI_DETAIL: (id) => `${BASE_URL}/admin-cabang/master-data/materi/${id}`,
    MATERI_DROPDOWN: `${BASE_URL}/admin-cabang/master-data/materi/dropdown`,
    MATERI_BY_MATA_PELAJARAN: (mataPelajaranId) => `${BASE_URL}/admin-cabang/master-data/materi/by-mata-pelajaran/${mataPelajaranId}`,
    MATERI_STATISTICS: `${BASE_URL}/admin-cabang/master-data/materi/statistics`,
    MATERI_CHECK_DELETE: (id) => `${BASE_URL}/admin-cabang/master-data/materi/${id}/check-can-delete`,
  },

  // Akademik Section
  AKADEMIK: {
    // Kurikulum
    KURIKULUM: `${BASE_URL}/admin-cabang/akademik/kurikulum`,
    KURIKULUM_DETAIL: (id) => `${BASE_URL}/admin-cabang/akademik/kurikulum/${id}`,
    KURIKULUM_DROPDOWN: `${BASE_URL}/admin-cabang/akademik/kurikulum/dropdown`,
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
  },

  // Survey Approval
  SURVEY_APPROVAL: {
    LIST: `${BASE_URL}/admin-cabang/survey-approval`,
    DETAIL: (id) => `${BASE_URL}/admin-cabang/survey-approval/${id}`,
    APPROVE: (id) => `${BASE_URL}/admin-cabang/survey-approval/${id}/approve`,
    REJECT: (id) => `${BASE_URL}/admin-cabang/survey-approval/${id}/reject`,
    STATS: `${BASE_URL}/admin-cabang/survey-approval/stats`,
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

  // Survey Management
  SURVEY: {
    LIST: (anakId) => `${BASE_URL}/admin-shelter/anak/${anakId}/survey`,
    DETAIL: (anakId, surveyId) => `${BASE_URL}/admin-shelter/anak/${anakId}/survey/${surveyId}`,
    CREATE: (anakId) => `${BASE_URL}/admin-shelter/anak/${anakId}/survey`,
    UPDATE: (anakId, surveyId) => `${BASE_URL}/admin-shelter/anak/${anakId}/survey/${surveyId}`,
    DELETE: (anakId, surveyId) => `${BASE_URL}/admin-shelter/anak/${anakId}/survey/${surveyId}`,
  },

  // Raport Management
  RAPORT: {
    LIST: (anakId) => `${BASE_URL}/admin-shelter/anak/${anakId}/raport`,
    DETAIL: (anakId, raportId) => `${BASE_URL}/admin-shelter/anak/${anakId}/raport/${raportId}`,
    CREATE: (anakId) => `${BASE_URL}/admin-shelter/anak/${anakId}/raport`,
    UPDATE: (anakId, raportId) => `${BASE_URL}/admin-shelter/anak/${anakId}/raport/${raportId}`,
    DELETE: (anakId, raportId) => `${BASE_URL}/admin-shelter/anak/${anakId}/raport/${raportId}`,
  },

  // Prestasi Management
  PRESTASI: {
    LIST: (anakId) => `${BASE_URL}/admin-shelter/anak/${anakId}/prestasi`,
    DETAIL: (anakId, prestasiId) => `${BASE_URL}/admin-shelter/anak/${anakId}/prestasi/${prestasiId}`,
    CREATE: (anakId) => `${BASE_URL}/admin-shelter/anak/${anakId}/prestasi`,
    UPDATE: (anakId, prestasiId) => `${BASE_URL}/admin-shelter/anak/${anakId}/prestasi/${prestasiId}`,
    DELETE: (anakId, prestasiId) => `${BASE_URL}/admin-shelter/anak/${anakId}/prestasi/${prestasiId}`,
  },

  // Riwayat Management
  RIWAYAT: {
    LIST: (anakId) => `${BASE_URL}/admin-shelter/anak/${anakId}/riwayat`,
    DETAIL: (anakId, riwayatId) => `${BASE_URL}/admin-shelter/anak/${anakId}/riwayat/${riwayatId}`,
    CREATE: (anakId) => `${BASE_URL}/admin-shelter/anak/${anakId}/riwayat`,
    UPDATE: (anakId, riwayatId) => `${BASE_URL}/admin-shelter/anak/${anakId}/riwayat/${riwayatId}`,
    DELETE: (anakId, riwayatId) => `${BASE_URL}/admin-shelter/anak/${anakId}/riwayat/${riwayatId}`,
  }
};

// ============================================================================
// DONATUR ENDPOINTS
// ============================================================================

export const DONATUR_ENDPOINTS = {
  // Core endpoints
  DASHBOARD: `${BASE_URL}/donatur/dashboard`,
  PROFILE: `${BASE_URL}/donatur/profile`,

  // Marketplace
  MARKETPLACE: {
    AVAILABLE_CHILDREN: `${BASE_URL}/donatur/marketplace/children`,
    CHILD_PROFILE: (childId) => `${BASE_URL}/donatur/marketplace/children/${childId}`,
    SPONSOR_CHILD: (childId) => `${BASE_URL}/donatur/marketplace/children/${childId}/sponsor`,
    FILTERS: `${BASE_URL}/donatur/marketplace/filters`,
    FEATURED_CHILDREN: `${BASE_URL}/donatur/marketplace/featured`,
  }
};

// ============================================================================
// MANAGEMENT ENDPOINTS
// ============================================================================

export const MANAGEMENT_ENDPOINTS = {
  // Admin Cabang Management
  ADMIN_CABANG: `${BASE_URL}/admin-cabang`,
  ADMIN_CABANG_DETAIL: (id) => `${BASE_URL}/admin-cabang/${id}`,

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
  AUTH_ENDPOINTS,
  ADMIN_CABANG_ENDPOINTS,
  ADMIN_SHELTER_ENDPOINTS,
  DONATUR_ENDPOINTS,
  MANAGEMENT_ENDPOINTS,
  buildUrlWithParams,
  getMasterDataEndpoints
};