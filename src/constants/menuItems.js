// src/constants/menuItems.js

/**
 * Menu Items Constants
 * Organized menu structure for Admin Cabang & Admin Shelter
 * Icons from Ionicons, colors following design system
 */

// ============================================================================
// ADMIN CABANG MENU ITEMS
// ============================================================================

/**
 * Master Data Menu Items - Admin Cabang
 */
export const MASTER_DATA_MENU_ITEMS = [
  {
    id: 'jenjang',
    title: 'Jenjang',
    description: 'Kelola jenjang pendidikan',
    icon: 'school',
    color: '#3498db',
    screens: {
      list: 'JenjangList',
      form: 'JenjangForm',
      detail: 'JenjangDetail'
    },
    quickActions: [
      { title: 'Tambah Jenjang', icon: 'add-circle', screen: 'JenjangForm' }
    ]
  },
  {
    id: 'mata_pelajaran', 
    title: 'Mata Pelajaran',
    description: 'Kelola mata pelajaran per jenjang',
    icon: 'book',
    color: '#2ecc71',
    screens: {
      list: 'MataPelajaranList',
      form: 'MataPelajaranForm', 
      detail: 'MataPelajaranDetail'
    },
    quickActions: [
      { title: 'Tambah Mata Pelajaran', icon: 'add-circle', screen: 'MataPelajaranForm' }
    ]
  },
  {
    id: 'kelas',
    title: 'Kelas',
    description: 'Kelola kelas per jenjang', 
    icon: 'library',
    color: '#e74c3c',
    screens: {
      list: 'KelasList',
      form: 'KelasForm',
      detail: 'KelasDetail'
    },
    quickActions: [
      { title: 'Tambah Kelas', icon: 'add-circle', screen: 'KelasForm' }
    ]
  },
  {
    id: 'materi',
    title: 'Materi',
    description: 'Kelola materi pembelajaran',
    icon: 'document-text', 
    color: '#f39c12',
    screens: {
      list: 'MateriList',
      form: 'MateriForm',
      detail: 'MateriDetail'
    },
    quickActions: [
      { title: 'Tambah Materi', icon: 'add-circle', screen: 'MateriForm' }
    ]
  }
];

/**
 * Akademik Menu Items - Admin Cabang
 */
export const AKADEMIK_MENU_ITEMS = [
  {
    id: 'kurikulum',
    title: 'Kurikulum',
    description: 'Kelola kurikulum dan assignment materi',
    icon: 'library-outline',
    color: '#8e44ad',
    screens: {
      list: 'KurikulumList',
      form: 'KurikulumForm',
      detail: 'KurikulumDetail'
    },
    quickActions: [
      { title: 'Buat Kurikulum', icon: 'add-circle', screen: 'KurikulumForm' },
      { title: 'Assign Materi', icon: 'link', screen: 'MateriAssignmentModal' }
    ]
  }
];

/**
 * Main Admin Cabang Menu Sections
 */
export const ADMIN_CABANG_MENU_SECTIONS = [
  {
    id: 'master_data',
    title: 'Master Data',
    subtitle: 'Kelola data dasar sistem',
    icon: 'filing',
    color: '#3498db',
    screen: 'MasterDataMenu',
    items: MASTER_DATA_MENU_ITEMS
  },
  {
    id: 'akademik', 
    title: 'Akademik',
    subtitle: 'Kelola kurikulum dan pembelajaran',
    icon: 'school-outline',
    color: '#8e44ad',
    screen: 'AkademikMenu',
    items: AKADEMIK_MENU_ITEMS
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    subtitle: 'Ringkasan dan statistik',
    icon: 'analytics',
    color: '#27ae60',
    screen: 'AdminCabangDashboard'
  },
  {
    id: 'profile',
    title: 'Profil',
    subtitle: 'Kelola profil dan pengaturan',
    icon: 'person',
    color: '#95a5a6', 
    screen: 'AdminCabangProfile'
  }
];

// ============================================================================
// ADMIN SHELTER MENU ITEMS
// ============================================================================

/**
 * Anak Management Menu Items - Admin Shelter
 */
export const ANAK_MENU_ITEMS = [
  {
    id: 'anak_list',
    title: 'Daftar Anak',
    description: 'Kelola data anak asuh',
    icon: 'people',
    color: '#3498db',
    screen: 'AnakList'
  },
  {
    id: 'anak_statistics',
    title: 'Statistik Anak',
    description: 'Lihat statistik dan laporan',
    icon: 'bar-chart',
    color: '#2ecc71',
    screen: 'AnakStatistics'
  }
];

/**
 * Semester Management Menu Items - Admin Shelter
 */
export const SEMESTER_MENU_ITEMS = [
  {
    id: 'semester_list',
    title: 'Daftar Semester', 
    description: 'Kelola semester dan tahun ajaran',
    icon: 'calendar',
    color: '#e74c3c',
    screen: 'SemesterList'
  },
  {
    id: 'semester_active',
    title: 'Semester Aktif',
    description: 'Lihat semester yang sedang berjalan',
    icon: 'calendar-number',
    color: '#f39c12',
    screen: 'SemesterActive'
  }
];

/**
 * Learning Management Menu Items - Admin Shelter
 */
export const LEARNING_MENU_ITEMS = [
  {
    id: 'tutor',
    title: 'Tutor',
    description: 'Kelola data tutor dan kompetensi',
    icon: 'person-add',
    color: '#9b59b6',
    screen: 'TutorList'
  },
  {
    id: 'kelompok',
    title: 'Kelompok Belajar',
    description: 'Kelola kelompok belajar anak',
    icon: 'people-circle',
    color: '#34495e',
    screen: 'KelompokList'
  },
  {
    id: 'attendance',
    title: 'Presensi',
    description: 'Catat dan lihat presensi anak',
    icon: 'checkmark-circle',
    color: '#27ae60',
    screen: 'AttendanceList'
  }
];

/**
 * Main Admin Shelter Menu Sections
 */
export const ADMIN_SHELTER_MENU_SECTIONS = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    subtitle: 'Ringkasan dan overview',
    icon: 'home',
    color: '#3498db',
    screen: 'AdminShelterDashboard'
  },
  {
    id: 'anak',
    title: 'Manajemen Anak',
    subtitle: 'Kelola data anak asuh',
    icon: 'people',
    color: '#2ecc71',
    screen: 'AnakMenu',
    items: ANAK_MENU_ITEMS
  },
  {
    id: 'semester',
    title: 'Semester',
    subtitle: 'Kelola semester dan kurikulum',
    icon: 'calendar',
    color: '#e74c3c', 
    screen: 'SemesterMenu',
    items: SEMESTER_MENU_ITEMS
  },
  {
    id: 'learning',
    title: 'Pembelajaran',
    subtitle: 'Tutor, kelompok, dan presensi',
    icon: 'school',
    color: '#f39c12',
    screen: 'LearningMenu',
    items: LEARNING_MENU_ITEMS
  },
  {
    id: 'donatur',
    title: 'Donatur',
    subtitle: 'Kelola data donatur',
    icon: 'heart',
    color: '#e91e63',
    screen: 'DonaturList'
  },
  {
    id: 'profile',
    title: 'Profil',
    subtitle: 'Kelola profil shelter',
    icon: 'person',
    color: '#95a5a6',
    screen: 'AdminShelterProfile'
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get menu item by ID
 * @param {string} menuType - 'admin_cabang' or 'admin_shelter'
 * @param {string} itemId - Menu item ID
 * @returns {Object|null} - Menu item or null
 */
export const getMenuItem = (menuType, itemId) => {
  const sections = menuType === 'admin_cabang' ? ADMIN_CABANG_MENU_SECTIONS : ADMIN_SHELTER_MENU_SECTIONS;
  
  for (const section of sections) {
    if (section.id === itemId) return section;
    if (section.items) {
      const item = section.items.find(item => item.id === itemId);
      if (item) return item;
    }
  }
  return null;
};

/**
 * Get menu items by section
 * @param {string} menuType - 'admin_cabang' or 'admin_shelter'
 * @param {string} sectionId - Section ID
 * @returns {Array} - Menu items in section
 */
export const getMenuItemsBySection = (menuType, sectionId) => {
  const menuItem = getMenuItem(menuType, sectionId);
  return menuItem?.items || [];
};

/**
 * Build navigation function for menu item
 * @param {Object} navigation - React Navigation object
 * @param {string} screen - Screen name
 * @param {Object} params - Navigation parameters
 * @returns {Function} - Navigation function
 */
export const buildNavigationHandler = (navigation, screen, params = {}) => {
  return () => navigation.navigate(screen, params);
};

/**
 * Get menu items with navigation handlers
 * @param {Array} menuItems - Menu items array
 * @param {Object} navigation - React Navigation object
 * @param {Object} stats - Statistics object (optional)
 * @returns {Array} - Menu items with navigation handlers
 */
export const getMenuItemsWithNavigation = (menuItems, navigation, stats = {}) => {
  return menuItems.map(item => ({
    ...item,
    subtitle: stats[item.id] ? `${stats[item.id]} ${item.title.toLowerCase()}` : item.description,
    onPress: buildNavigationHandler(navigation, item.screens?.list || item.screen),
    quickActions: item.quickActions?.map(action => ({
      ...action,
      onPress: buildNavigationHandler(navigation, action.screen)
    }))
  }));
};

/**
 * Get quick action items
 * @param {Array} menuItems - Menu items array
 * @param {Object} navigation - React Navigation object
 * @returns {Array} - Flattened quick actions
 */
export const getQuickActions = (menuItems, navigation) => {
  return menuItems
    .filter(item => item.quickActions?.length > 0)
    .flatMap(item => 
      item.quickActions.map(action => ({
        ...action,
        color: item.color,
        onPress: buildNavigationHandler(navigation, action.screen)
      }))
    );
};

// ============================================================================
// MENU CONFIGURATION
// ============================================================================

/**
 * Menu configuration by user role
 */
export const MENU_CONFIG = {
  admin_cabang: {
    sections: ADMIN_CABANG_MENU_SECTIONS,
    defaultScreen: 'AdminCabangDashboard'
  },
  admin_shelter: {
    sections: ADMIN_SHELTER_MENU_SECTIONS,
    defaultScreen: 'AdminShelterDashboard'
  }
};

/**
 * Get menu configuration by role
 * @param {string} role - User role
 * @returns {Object} - Menu configuration
 */
export const getMenuConfig = (role) => {
  return MENU_CONFIG[role] || MENU_CONFIG.admin_shelter;
};

// Export all menu constants
export default {
  MASTER_DATA_MENU_ITEMS,
  AKADEMIK_MENU_ITEMS,
  ADMIN_CABANG_MENU_SECTIONS,
  ANAK_MENU_ITEMS,
  SEMESTER_MENU_ITEMS,
  LEARNING_MENU_ITEMS,
  ADMIN_SHELTER_MENU_SECTIONS,
  MENU_CONFIG,
  getMenuItem,
  getMenuItemsBySection,
  buildNavigationHandler,
  getMenuItemsWithNavigation,
  getQuickActions,
  getMenuConfig
};