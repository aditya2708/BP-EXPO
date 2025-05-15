// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  USER: '/auth/user'
};

// Admin Pusat endpoints
// Add this to src/constants/endpoints.js

// Admin Pusat endpoints
export const ADMIN_PUSAT_ENDPOINTS = {
  DASHBOARD: '/admin-pusat/dashboard',
  PROFILE: '/admin-pusat/profile',
  ANAK: {
    LIST: '/admin-pusat/anak',
    DETAIL: (id) => `/admin-pusat/anak/${id}`,
    TOGGLE_STATUS: (id) => `/admin-pusat/anak/${id}/toggle-status`,
    SUMMARY: '/admin-pusat/anak-summary'
  },
  RAPORT: {
    LIST: (childId) => `/admin-pusat/anak/${childId}/raport`,
    DETAIL: (childId, raportId) => `/admin-pusat/anak/${childId}/raport/${raportId}`
  },
  PRESTASI: {
    LIST: (childId) => `/admin-pusat/anak/${childId}/prestasi`,
    DETAIL: (childId, prestasiId) => `/admin-pusat/anak/${childId}/prestasi/${prestasiId}`
  },
  RIWAYAT: {
    LIST: (childId) => `/admin-pusat/anak/${childId}/riwayat`,
    DETAIL: (childId, riwayatId) => `/admin-pusat/anak/${childId}/riwayat/${riwayatId}`
  }
};

// Admin Cabang endpoints
export const ADMIN_CABANG_ENDPOINTS = {
  DASHBOARD: '/admin-cabang/dashboard',
  PROFILE: '/admin-cabang/profile'
};

// Admin Shelter endpoints
export const ADMIN_SHELTER_ENDPOINTS = {
  DASHBOARD: '/admin-shelter/dashboard',
  PROFILE: '/admin-shelter/profile',
  ANAK: {
    LIST: '/admin-shelter/anak',
    DETAIL: (id) => `/admin-shelter/anak/${id}`,
    TOGGLE_STATUS: (id) => `/admin-shelter/anak/${id}/toggle-status`
  },
  RAPORT: {
    LIST: (childId) => `/admin-shelter/anak/${childId}/raport`,
    CREATE: (childId) => `/admin-shelter/anak/${childId}/raport/create`,
    DETAIL: (childId, raportId) => `/admin-shelter/anak/${childId}/raport/${raportId}`,
    UPDATE: (childId, raportId) => `/admin-shelter/anak/${childId}/raport/${raportId}/update`
  },
 PRESTASI: {
  LIST: (childId) => `/admin-shelter/anak/${childId}/prestasi`,
  CREATE: (childId) => `/admin-shelter/anak/${childId}/prestasi`,  // Same as LIST
  DETAIL: (childId, prestasiId) => `/admin-shelter/anak/${childId}/prestasi/${prestasiId}`,
  UPDATE: (childId, prestasiId) => `/admin-shelter/anak/${childId}/prestasi/${prestasiId}`, // Same as DETAIL
  DELETE: (childId, prestasiId) => `/admin-shelter/anak/${childId}/prestasi/${prestasiId}`  // Same as DETAIL
},

RIWAYAT: {
  LIST: (childId) => `/admin-shelter/anak/${childId}/riwayat`,
  CREATE: (childId) => `/admin-shelter/anak/${childId}/riwayat`,  // Same as LIST
  DETAIL: (childId, riwayatId) => `/admin-shelter/anak/${childId}/riwayat/${riwayatId}`,
  UPDATE: (childId, riwayatId) => `/admin-shelter/anak/${childId}/riwayat/${riwayatId}`, // Same as DETAIL
  DELETE: (childId, riwayatId) => `/admin-shelter/anak/${childId}/riwayat/${riwayatId}`  // Same as DETAIL
},
TUTOR: {
    LIST: '/admin-shelter/tutor',
    DETAIL: (id) => `/admin-shelter/tutor/${id}`,
    CREATE: '/admin-shelter/tutor',
    UPDATE: (id) => `/admin-shelter/tutor/${id}`
},
 KELOMPOK: {
    LIST: '/admin-shelter/kelompok',
    DETAIL: (id) => `/admin-shelter/kelompok/${id}`,
    LEVELS: '/admin-shelter/kelompok-levels',
    AVAILABLE_CHILDREN: (shelterId) => `/admin-shelter/kelompok/available-children/${shelterId}`,
    GROUP_CHILDREN: (kelompokId) => `/admin-shelter/kelompok/${kelompokId}/children`,
    ADD_CHILD: (kelompokId) => `/admin-shelter/kelompok/${kelompokId}/add-child`,
    REMOVE_CHILD: (kelompokId, childId) => `/admin-shelter/kelompok/${kelompokId}/remove-child/${childId}`,
    MOVE_CHILD: (childId) => `/admin-shelter/move-child/${childId}`
  },
  KELUARGA: {
  LIST: '/admin-shelter/keluarga',
  DETAIL: (id) => `/admin-shelter/keluarga/${id}`,
  DROPDOWN: '/admin-shelter/keluarga-dropdown',
  WILBIN_BY_KACAB: (kacabId) => `/admin-shelter/keluarga-wilbin/${kacabId}`,
  SHELTER_BY_WILBIN: (wilbinId) => `/admin-shelter/keluarga-shelter/${wilbinId}`
},
PENGAJUAN_ANAK: {
  SEARCH_KELUARGA: '/admin-shelter/pengajuan-anak/search-keluarga',
  VALIDATE_KK: '/admin-shelter/pengajuan-anak/validate-kk',
  SUBMIT: '/admin-shelter/pengajuan-anak/submit'
},
 SURVEY: {
    LIST: '/admin-shelter/survey',
    DETAIL: (id_keluarga) => `/admin-shelter/survey/${id_keluarga}`,
  },
  SURVEY_VALIDATION: {
  LIST: '/admin-shelter/survey-validation',
  VALIDATE: (id_survey) => `/admin-shelter/survey-validation/${id_survey}`,
  SUMMARY: '/admin-shelter/survey-validation/summary'
}
};

// Donatur endpoints
export const DONATUR_ENDPOINTS = {
  DASHBOARD: '/donatur/dashboard',
  PROFILE: '/donatur/profile',
  CHILDREN: '/donatur/children'
};

// Management endpoints (for admin roles)
export const MANAGEMENT_ENDPOINTS = {
  // User management
  USERS: '/users',
  USER_DETAIL: (id) => `/users/${id}`,
  
  // Kacab management
  KACAB: '/kacab',
  KACAB_DETAIL: (id) => `/kacab/${id}`,
  
  // Wilbin management
  WILBIN: '/wilbin',
  WILBIN_DETAIL: (id) => `/wilbin/${id}`,
  
  // Shelter management
  SHELTER: '/shelter',
  SHELTER_DETAIL: (id) => `/shelter/${id}`
};