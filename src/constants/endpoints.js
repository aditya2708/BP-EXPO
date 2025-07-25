export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  USER: '/auth/user'
};

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
  },
  KELUARGA: {
    LIST: '/admin-pusat/keluarga',
    DETAIL: (id) => `/admin-pusat/keluarga/${id}`,
    DROPDOWN: '/admin-pusat/keluarga-dropdown',
    WILBIN_BY_KACAB: (kacabId) => `/admin-pusat/keluarga-wilbin/${kacabId}`,
    SHELTER_BY_WILBIN: (wilbinId) => `/admin-pusat/keluarga-shelter/${wilbinId}`
  },
  TUTOR_HONOR_SETTINGS: {
    LIST: '/admin-pusat/tutor-honor-settings',
    ACTIVE: '/admin-pusat/tutor-honor-settings/active',
    CREATE: '/admin-pusat/tutor-honor-settings',
    DETAIL: (id) => `/admin-pusat/tutor-honor-settings/${id}`,
    UPDATE: (id) => `/admin-pusat/tutor-honor-settings/${id}`,
    SET_ACTIVE: (id) => `/admin-pusat/tutor-honor-settings/${id}/set-active`,
    DELETE: (id) => `/admin-pusat/tutor-honor-settings/${id}`,
    CALCULATE_PREVIEW: '/admin-pusat/tutor-honor-settings/calculate-preview',
    STATISTICS: '/admin-pusat/tutor-honor-settings-statistics'
  }
};

export const ADMIN_CABANG_ENDPOINTS = {
  DASHBOARD: '/admin-cabang/dashboard',
  PROFILE: '/admin-cabang/profile',
  SURVEY_APPROVAL: {
    LIST: '/admin-cabang/survey-approval',
    STATS: '/admin-cabang/survey-approval/stats',
    DETAIL: (id) => `/admin-cabang/survey-approval/${id}`,
    APPROVE: (id) => `/admin-cabang/survey-approval/${id}/approve`,
    REJECT: (id) => `/admin-cabang/survey-approval/${id}/reject`
  },
  PENGAJUAN_DONATUR: {
    CPB_CHILDREN: '/admin-cabang/pengajuan-donatur/cpb-children',
    AVAILABLE_DONATUR: '/admin-cabang/pengajuan-donatur/available-donatur',
    ASSIGN_DONATUR: '/admin-cabang/pengajuan-donatur/assign-donatur',
    CHILD_DETAIL: (id) => `/admin-cabang/pengajuan-donatur/child-detail/${id}`
  },
  DONATUR: {
    LIST: '/admin-cabang/donatur',
    CREATE: '/admin-cabang/donatur',
    DETAIL: (id) => `/admin-cabang/donatur/${id}`,
    UPDATE: (id) => `/admin-cabang/donatur/${id}`,
    DELETE: (id) => `/admin-cabang/donatur/${id}`,
    FILTER_OPTIONS: '/admin-cabang/donatur-filter-options',
    SHELTERS_BY_WILBIN: (wilbinId) => `/admin-cabang/donatur-shelters/${wilbinId}`,
    STATS: '/admin-cabang/donatur-stats'
  },
  KURIKULUM: {
    LIST: '/admin-cabang/kurikulum',
    DETAIL: (id) => `/admin-cabang/kurikulum/${id}`,
    CREATE: '/admin-cabang/kurikulum',
    UPDATE: (id) => `/admin-cabang/kurikulum/${id}`,
    DELETE: (id) => `/admin-cabang/kurikulum/${id}`,
    ACTIVE: '/admin-cabang/kurikulum/active',
    SET_ACTIVE: (id) => `/admin-cabang/kurikulum/${id}/set-active`,
    STATISTICS: (id) => `/admin-cabang/kurikulum/${id}/statistics`,
    TAHUN_BERLAKU: '/admin-cabang/kurikulum/tahun-berlaku',
    ADD_MATERI: (id) => `/admin-cabang/kurikulum/${id}/materi`,
    REMOVE_MATERI: (id, materiId) => `/admin-cabang/kurikulum/${id}/materi/${materiId}`
  },

  MATA_PELAJARAN: {
    LIST: '/admin-cabang/mata-pelajaran',
    DETAIL: (id) => `/admin-cabang/mata-pelajaran/${id}`,
    CREATE: '/admin-cabang/mata-pelajaran',
    UPDATE: (id) => `/admin-cabang/mata-pelajaran/${id}`,
    DELETE: (id) => `/admin-cabang/mata-pelajaran/${id}`,
    BY_KATEGORI: (kategori) => `/admin-cabang/mata-pelajaran/kategori/${kategori || ''}`,
    KATEGORI_OPTIONS: '/admin-cabang/mata-pelajaran/kategori-options',
    STATISTICS: '/admin-cabang/mata-pelajaran/statistics',
    DROPDOWN: '/admin-cabang/mata-pelajaran/dropdown'
  }
};

export const ADMIN_SHELTER_ENDPOINTS = {
  DASHBOARD: '/admin-shelter/dashboard',
  PROFILE: '/admin-shelter/profile',
  ANAK: {
    LIST: '/admin-shelter/anak',
    DETAIL: (id) => `/admin-shelter/anak/${id}`,
    TOGGLE_STATUS: (id) => `/admin-shelter/anak/${id}/toggle-status`
  },
  KEUANGAN: {
    LIST: '/admin-shelter/keuangan',
    DETAIL: (id) => `/admin-shelter/keuangan/${id}`,
    CREATE: '/admin-shelter/keuangan',
    UPDATE: (id) => `/admin-shelter/keuangan/${id}`,
    DELETE: (id) => `/admin-shelter/keuangan/${id}`,
    BY_CHILD: (childId) => `/admin-shelter/keuangan/child/${childId}`,
    STATISTICS: '/admin-shelter/keuangan-statistics'
  },
  KURIKULUM: {
    LIST: '/admin-shelter/kurikulum',
    DETAIL: (id) => `/admin-shelter/kurikulum/${id}`,
    PREVIEW: (id) => `/admin-shelter/kurikulum/${id}/preview`,
    DROPDOWN: '/admin-shelter/kurikulum-dropdown'
  },
  RAPORT: {
    LIST: (childId) => `/admin-shelter/anak/${childId}/raport`,
    CREATE: (childId) => `/admin-shelter/anak/${childId}/raport/create`,
    DETAIL: (childId, raportId) => `/admin-shelter/anak/${childId}/raport/${raportId}`,
    UPDATE: (childId, raportId) => `/admin-shelter/anak/${childId}/raport/${raportId}/update`
  },
  PRESTASI: {
    LIST: (childId) => `/admin-shelter/anak/${childId}/prestasi`,
    CREATE: (childId) => `/admin-shelter/anak/${childId}/prestasi`,
    DETAIL: (childId, prestasiId) => `/admin-shelter/anak/${childId}/prestasi/${prestasiId}`,
    UPDATE: (childId, prestasiId) => `/admin-shelter/anak/${childId}/prestasi/${prestasiId}`,
    DELETE: (childId, prestasiId) => `/admin-shelter/anak/${childId}/prestasi/${prestasiId}`
  },
  RIWAYAT: {
    LIST: (childId) => `/admin-shelter/anak/${childId}/riwayat`,
    CREATE: (childId) => `/admin-shelter/anak/${childId}/riwayat`,
    DETAIL: (childId, riwayatId) => `/admin-shelter/anak/${childId}/riwayat/${riwayatId}`,
    UPDATE: (childId, riwayatId) => `/admin-shelter/anak/${childId}/riwayat/${riwayatId}`,
    DELETE: (childId, riwayatId) => `/admin-shelter/anak/${childId}/riwayat/${riwayatId}`
  },
  TUTOR: {
    LIST: '/admin-shelter/tutor',
    DETAIL: (id) => `/admin-shelter/tutor/${id}`,
    CREATE: '/admin-shelter/tutor',
    UPDATE: (id) => `/admin-shelter/tutor/${id}`
  },
  TUTOR_HONOR: {
    GET_TUTOR_HONOR: (tutorId) => `/admin-shelter/tutor-honor/tutor/${tutorId}`,
    GET_HISTORY: (tutorId) => `/admin-shelter/tutor-honor/tutor/${tutorId}/history`,
    GET_STATISTICS: (tutorId) => `/admin-shelter/tutor-honor/tutor/${tutorId}/statistics`,
    GET_MONTHLY_DETAIL: (tutorId, month, year) => `/admin-shelter/tutor-honor/tutor/${tutorId}/month/${month}/year/${year}`,
    CALCULATE: (tutorId) => `/admin-shelter/tutor-honor/calculate/${tutorId}`,
    APPROVE: (honorId) => `/admin-shelter/tutor-honor/approve/${honorId}`,
    MARK_PAID: (honorId) => `/admin-shelter/tutor-honor/mark-paid/${honorId}`,
    GET_STATS: '/admin-shelter/tutor-honor/stats',
    CURRENT_SETTINGS: '/admin-shelter/tutor-honor/current-settings',
    CALCULATE_PREVIEW: '/admin-shelter/tutor-honor/calculate-preview',
    GET_TUTOR_PREVIEW: (tutorId) => `/admin-shelter/tutor-honor/tutor/${tutorId}/preview`,
    GET_YEAR_RANGE: (tutorId) => `/admin-shelter/tutor-honor/tutor/${tutorId}/year-range`
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
  AKTIVITAS: {
    LIST: '/admin-shelter/aktivitas',
    DETAIL: (id) => `/admin-shelter/aktivitas/${id}`,
    CREATE: '/admin-shelter/aktivitas'
  },
  SURAT: {
    LIST: (childId) => `/admin-shelter/anak/${childId}/surat`,
    CREATE: (childId) => `/admin-shelter/anak/${childId}/surat`,
    DETAIL: (childId, suratId) => `/admin-shelter/anak/${childId}/surat/${suratId}`,
    UPDATE: (childId, suratId) => `/admin-shelter/anak/${childId}/surat/${suratId}`,
    DELETE: (childId, suratId) => `/admin-shelter/anak/${childId}/surat/${suratId}`,
    MARK_READ: (childId, suratId) => `/admin-shelter/anak/${childId}/surat/${suratId}/read`
  },
  RAPORT_FORMAL: {
    LIST: (childId) => `/admin-shelter/anak/${childId}/raport-formal`,
    CREATE: (childId) => `/admin-shelter/anak/${childId}/raport-formal`,
    DETAIL: (childId, raportId) => `/admin-shelter/anak/${childId}/raport-formal/${raportId}`,
    UPDATE: (childId, raportId) => `/admin-shelter/anak/${childId}/raport-formal/${raportId}`,
    DELETE: (childId, raportId) => `/admin-shelter/anak/${childId}/raport-formal/${raportId}`
  },
  HISTORI: {
    LIST: '/admin-shelter/laporan/histori',
    DETAIL: (id) => `/admin-shelter/laporan/histori/detail/${id}`,
    JENIS_HISTORI_OPTIONS: '/admin-shelter/laporan/histori/jenis-histori-options',
    AVAILABLE_YEARS: '/admin-shelter/laporan/histori/available-years'
  }
};

export const DONATUR_ENDPOINTS = {
  DASHBOARD: '/donatur/dashboard',
  PROFILE: '/donatur/profile',
  CHILDREN: '/donatur/children',
  CHILD_DETAIL: (childId) => `/donatur/children/${childId}`,
  
  SURAT: {
    LIST: (childId) => `/donatur/children/${childId}/surat`,
    CREATE: (childId) => `/donatur/children/${childId}/surat`,
    DETAIL: (childId, suratId) => `/donatur/children/${childId}/surat/${suratId}`,
    MARK_READ: (childId, suratId) => `/donatur/children/${childId}/surat/${suratId}/read`
  },
  
  PRESTASI: {
    LIST: (childId) => `/donatur/children/${childId}/prestasi`,
    DETAIL: (childId, prestasiId) => `/donatur/children/${childId}/prestasi/${prestasiId}`,
    MARK_READ: (childId, prestasiId) => `/donatur/children/${childId}/prestasi/${prestasiId}/read`
  },
  
  RAPORT: {
    LIST: (childId) => `/donatur/children/${childId}/raport`,
    DETAIL: (childId, raportId) => `/donatur/children/${childId}/raport/${raportId}`,
    SUMMARY: (childId) => `/donatur/children/${childId}/raport-summary`
  },
  
  AKTIVITAS: {
    LIST: (childId) => `/donatur/children/${childId}/aktivitas`,
    DETAIL: (childId, aktivitasId) => `/donatur/children/${childId}/aktivitas/${aktivitasId}`,
    ATTENDANCE_SUMMARY: (childId) => `/donatur/children/${childId}/attendance-summary`
  },

  BILLING: {
    LIST: '/donatur/billing',
    DETAIL: (id) => `/donatur/billing/${id}`,
    BY_CHILD: (childId) => `/donatur/billing/child/${childId}`,
    SUMMARY: '/donatur/billing-summary',
    SEMESTERS: '/donatur/billing-semesters'
  },

  MARKETPLACE: {
    AVAILABLE_CHILDREN: '/donatur/marketplace/available-children',
    CHILD_PROFILE: (childId) => `/donatur/marketplace/children/${childId}/profile`,
    SPONSOR_CHILD: (childId) => `/donatur/marketplace/children/${childId}/sponsor`,
    FILTERS: '/donatur/marketplace/filters',
    FEATURED_CHILDREN: '/donatur/marketplace/featured-children'
  }
};

export const MANAGEMENT_ENDPOINTS = {
  USERS: '/users',
  USER_DETAIL: (id) => `/users/${id}`,
  
  KACAB: '/kacab',
  KACAB_DETAIL: (id) => `/kacab/${id}`,
  
  WILBIN: '/wilbin',
  WILBIN_DETAIL: (id) => `/wilbin/${id}`,
  
  SHELTER: '/shelter',
  SHELTER_DETAIL: (id) => `/shelter/${id}`
};