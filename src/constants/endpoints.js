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