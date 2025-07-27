// Entity Types
export const ENTITY_TYPES = {
  JENJANG: 'jenjang',
  MATA_PELAJARAN: 'mataPelajaran',
  KELAS: 'kelas',
  MATERI: 'materi',
  KURIKULUM: 'kurikulum',
};

// Field Types
export const FIELD_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  SELECT: 'select',
  SWITCH: 'switch',
  DATE: 'date',
  CASCADE_SELECT: 'cascade_select',
};

// Base Configuration Template
const BASE_ENTITY_CONFIG = {
  name: '',
  displayName: '',
  displayNamePlural: '',
  apiEndpoints: {},
  fields: {},
  validation: {},
  relationships: {},
  ui: {
    listTitle: '',
    createTitle: '',
    editTitle: '',
    detailTitle: '',
    colors: {
      primary: '#3498db',
      success: '#27ae60',
      warning: '#f39c12',
      danger: '#e74c3c',
    }
  }
};

// Entity Configurations
export const ENTITY_CONFIGS = {
  [ENTITY_TYPES.JENJANG]: {
    ...BASE_ENTITY_CONFIG,
    name: 'jenjang',
    displayName: 'Jenjang',
    displayNamePlural: 'Jenjang',
    apiEndpoints: {
      base: '/admin-cabang/master-data/jenjang',
      list: '/admin-cabang/master-data/jenjang',
      create: '/admin-cabang/master-data/jenjang',
      detail: (id) => `/admin-cabang/master-data/jenjang/${id}`,
      update: (id) => `/admin-cabang/master-data/jenjang/${id}`,
      delete: (id) => `/admin-cabang/master-data/jenjang/${id}`,
      dropdown: '/admin-cabang/master-data/jenjang-dropdown',
      statistics: '/admin-cabang/master-data/jenjang-statistics',
      checkUrutan: '/admin-cabang/master-data/jenjang-check-urutan',
      existingUrutan: '/admin-cabang/master-data/jenjang-existing-urutan',
    },
    fields: {
      id_jenjang: { type: FIELD_TYPES.NUMBER, readonly: true },
      nama_jenjang: { 
        type: FIELD_TYPES.TEXT, 
        required: true, 
        label: 'Nama Jenjang',
        placeholder: 'Contoh: SD, SMP, SMA'
      },
      urutan: { 
        type: FIELD_TYPES.NUMBER, 
        required: true, 
        label: 'Urutan',
        placeholder: 'Urutan jenjang (1, 2, 3, ...)'
      },
      deskripsi: { 
        type: FIELD_TYPES.TEXTAREA, 
        label: 'Deskripsi',
        placeholder: 'Deskripsi jenjang pendidikan'
      },
      is_active: { 
        type: FIELD_TYPES.SWITCH, 
        label: 'Status Aktif',
        defaultValue: true
      },
    },
    validation: {
      nama_jenjang: [
        { rule: 'required', message: 'Nama jenjang wajib diisi' },
        { rule: 'minLength', value: 2, message: 'Nama jenjang minimal 2 karakter' },
        { rule: 'maxLength', value: 50, message: 'Nama jenjang maksimal 50 karakter' },
      ],
      urutan: [
        { rule: 'required', message: 'Urutan wajib diisi' },
        { rule: 'number', message: 'Urutan harus berupa angka' },
        { rule: 'min', value: 1, message: 'Urutan minimal 1' },
        { rule: 'unique', message: 'Urutan sudah digunakan' },
      ],
    },
    ui: {
      listTitle: 'Daftar Jenjang',
      createTitle: 'Tambah Jenjang',
      editTitle: 'Edit Jenjang',
      detailTitle: 'Detail Jenjang',
      colors: { primary: '#3498db' }
    }
  },

  [ENTITY_TYPES.MATA_PELAJARAN]: {
    ...BASE_ENTITY_CONFIG,
    name: 'mataPelajaran',
    displayName: 'Mata Pelajaran',
    displayNamePlural: 'Mata Pelajaran',
    apiEndpoints: {
      base: '/admin-cabang/master-data/mata-pelajaran',
      list: '/admin-cabang/master-data/mata-pelajaran',
      create: '/admin-cabang/master-data/mata-pelajaran',
      detail: (id) => `/admin-cabang/master-data/mata-pelajaran/${id}`,
      update: (id) => `/admin-cabang/master-data/mata-pelajaran/${id}`,
      delete: (id) => `/admin-cabang/master-data/mata-pelajaran/${id}`,
      dropdown: '/admin-cabang/master-data/mata-pelajaran-dropdown',
      statistics: '/admin-cabang/master-data/mata-pelajaran-statistics',
      byJenjang: (jenjangId) => `/admin-cabang/master-data/mata-pelajaran-jenjang/${jenjangId}`,
      cascadeData: '/admin-cabang/master-data/mata-pelajaran-cascade-data',
    },
    fields: {
      id_mata_pelajaran: { type: FIELD_TYPES.NUMBER, readonly: true },
      nama_mata_pelajaran: { 
        type: FIELD_TYPES.TEXT, 
        required: true, 
        label: 'Nama Mata Pelajaran',
        placeholder: 'Contoh: Matematika, Bahasa Indonesia'
      },
      kode_mata_pelajaran: { 
        type: FIELD_TYPES.TEXT, 
        required: true, 
        label: 'Kode Mata Pelajaran',
        placeholder: 'Contoh: MTK, BIN'
      },
      id_jenjang: { 
        type: FIELD_TYPES.CASCADE_SELECT, 
        label: 'Jenjang',
        placeholder: 'Pilih jenjang (kosong = semua jenjang)',
        source: 'jenjang',
        allowEmpty: true
      },
      kategori: { 
        type: FIELD_TYPES.SELECT, 
        label: 'Kategori',
        options: [
          { value: 'umum', label: 'Umum' },
          { value: 'agama', label: 'Agama' },
          { value: 'keterampilan', label: 'Keterampilan' },
          { value: 'ekstrakurikuler', label: 'Ekstrakurikuler' },
        ]
      },
      deskripsi: { 
        type: FIELD_TYPES.TEXTAREA, 
        label: 'Deskripsi',
        placeholder: 'Deskripsi mata pelajaran'
      },
      status: { 
        type: FIELD_TYPES.SELECT, 
        label: 'Status',
        defaultValue: 'aktif',
        options: [
          { value: 'aktif', label: 'Aktif' },
          { value: 'nonaktif', label: 'Non Aktif' },
        ]
      },
    },
    validation: {
      nama_mata_pelajaran: [
        { rule: 'required', message: 'Nama mata pelajaran wajib diisi' },
        { rule: 'minLength', value: 2, message: 'Nama minimal 2 karakter' },
        { rule: 'maxLength', value: 100, message: 'Nama maksimal 100 karakter' },
      ],
      kode_mata_pelajaran: [
        { rule: 'required', message: 'Kode mata pelajaran wajib diisi' },
        { rule: 'minLength', value: 2, message: 'Kode minimal 2 karakter' },
        { rule: 'maxLength', value: 10, message: 'Kode maksimal 10 karakter' },
      ],
    },
    relationships: {
      jenjang: { type: 'belongsTo', entity: 'jenjang', optional: true }
    },
    ui: {
      listTitle: 'Daftar Mata Pelajaran',
      createTitle: 'Tambah Mata Pelajaran',
      editTitle: 'Edit Mata Pelajaran',
      detailTitle: 'Detail Mata Pelajaran',
      colors: { primary: '#27ae60' }
    }
  },

  [ENTITY_TYPES.KELAS]: {
    ...BASE_ENTITY_CONFIG,
    name: 'kelas',
    displayName: 'Kelas',
    displayNamePlural: 'Kelas',
    apiEndpoints: {
      base: '/admin-cabang/master-data/kelas',
      list: '/admin-cabang/master-data/kelas',
      create: '/admin-cabang/master-data/kelas',
      detail: (id) => `/admin-cabang/master-data/kelas/${id}`,
      update: (id) => `/admin-cabang/master-data/kelas/${id}`,
      delete: (id) => `/admin-cabang/master-data/kelas/${id}`,
      dropdown: '/admin-cabang/master-data/kelas-dropdown',
      statistics: '/admin-cabang/master-data/kelas-statistics',
      byJenjang: (jenjangId) => `/admin-cabang/master-data/kelas-jenjang/${jenjangId}`,
      cascadeData: '/admin-cabang/master-data/kelas-cascade-data',
    },
    fields: {
      id_kelas: { type: FIELD_TYPES.NUMBER, readonly: true },
      id_jenjang: { 
        type: FIELD_TYPES.CASCADE_SELECT, 
        required: true, 
        label: 'Jenjang',
        placeholder: 'Pilih jenjang',
        source: 'jenjang'
      },
      jenis_kelas: { 
        type: FIELD_TYPES.SELECT, 
        required: true, 
        label: 'Jenis Kelas',
        defaultValue: 'standard',
        options: [
          { value: 'standard', label: 'Standard' },
          { value: 'custom', label: 'Custom' },
        ]
      },
      tingkat: { 
        type: FIELD_TYPES.NUMBER, 
        label: 'Tingkat',
        placeholder: 'Tingkat kelas (1, 2, 3, ...)',
        conditionalShow: { field: 'jenis_kelas', value: 'standard' }
      },
      nama_kelas: { 
        type: FIELD_TYPES.TEXT, 
        label: 'Nama Kelas',
        placeholder: 'Nama kelas custom',
        conditionalShow: { field: 'jenis_kelas', value: 'custom' },
        conditionalRequired: { field: 'jenis_kelas', value: 'custom' }
      },
      urutan: { 
        type: FIELD_TYPES.NUMBER, 
        label: 'Urutan',
        placeholder: 'Urutan dalam jenjang'
      },
      deskripsi: { 
        type: FIELD_TYPES.TEXTAREA, 
        label: 'Deskripsi',
        placeholder: 'Deskripsi kelas'
      },
      is_active: { 
        type: FIELD_TYPES.SWITCH, 
        label: 'Status Aktif',
        defaultValue: true
      },
    },
    validation: {
      id_jenjang: [
        { rule: 'required', message: 'Jenjang wajib dipilih' },
      ],
      jenis_kelas: [
        { rule: 'required', message: 'Jenis kelas wajib dipilih' },
      ],
      tingkat: [
        { rule: 'conditionalRequired', condition: { field: 'jenis_kelas', value: 'standard' }, message: 'Tingkat wajib diisi untuk kelas standard' },
        { rule: 'number', message: 'Tingkat harus berupa angka' },
        { rule: 'min', value: 1, message: 'Tingkat minimal 1' },
      ],
      nama_kelas: [
        { rule: 'conditionalRequired', condition: { field: 'jenis_kelas', value: 'custom' }, message: 'Nama kelas wajib diisi untuk kelas custom' },
        { rule: 'maxLength', value: 50, message: 'Nama kelas maksimal 50 karakter' },
      ],
    },
    relationships: {
      jenjang: { type: 'belongsTo', entity: 'jenjang', required: true }
    },
    ui: {
      listTitle: 'Daftar Kelas',
      createTitle: 'Tambah Kelas',
      editTitle: 'Edit Kelas',
      detailTitle: 'Detail Kelas',
      colors: { primary: '#f39c12' }
    }
  },

  [ENTITY_TYPES.MATERI]: {
    ...BASE_ENTITY_CONFIG,
    name: 'materi',
    displayName: 'Materi',
    displayNamePlural: 'Materi',
    apiEndpoints: {
      base: '/admin-cabang/master-data/materi',
      list: '/admin-cabang/master-data/materi',
      create: '/admin-cabang/master-data/materi',
      detail: (id) => `/admin-cabang/master-data/materi/${id}`,
      update: (id) => `/admin-cabang/master-data/materi/${id}`,
      delete: (id) => `/admin-cabang/master-data/materi/${id}`,
      dropdown: '/admin-cabang/master-data/materi-dropdown',
      statistics: '/admin-cabang/master-data/materi-statistics',
      byMataPelajaran: '/admin-cabang/master-data/materi-mata-pelajaran',
      byKelas: (kelasId) => `/admin-cabang/master-data/materi-kelas/${kelasId}`,
      cascadeData: '/admin-cabang/master-data/materi-cascade-data',
    },
    fields: {
      id_materi: { type: FIELD_TYPES.NUMBER, readonly: true },
      nama_materi: { 
        type: FIELD_TYPES.TEXT, 
        required: true, 
        label: 'Nama Materi',
        placeholder: 'Contoh: Bilangan Bulat, Tata Bahasa'
      },
      kode_materi: { 
        type: FIELD_TYPES.TEXT, 
        required: true, 
        label: 'Kode Materi',
        placeholder: 'Contoh: MTK001, BIN001'
      },
      id_mata_pelajaran: { 
        type: FIELD_TYPES.CASCADE_SELECT, 
        required: true, 
        label: 'Mata Pelajaran',
        placeholder: 'Pilih mata pelajaran',
        source: 'mataPelajaran',
        cascadeWith: 'id_jenjang'
      },
      id_kelas: { 
        type: FIELD_TYPES.CASCADE_SELECT, 
        required: true, 
        label: 'Kelas',
        placeholder: 'Pilih kelas',
        source: 'kelas',
        cascadeWith: 'id_jenjang'
      },
      deskripsi: { 
        type: FIELD_TYPES.TEXTAREA, 
        label: 'Deskripsi',
        placeholder: 'Deskripsi materi pembelajaran'
      },
      durasi_menit: { 
        type: FIELD_TYPES.NUMBER, 
        label: 'Durasi (Menit)',
        placeholder: 'Estimasi durasi pembelajaran'
      },
      tingkat_kesulitan: { 
        type: FIELD_TYPES.SELECT, 
        label: 'Tingkat Kesulitan',
        options: [
          { value: 'mudah', label: 'Mudah' },
          { value: 'sedang', label: 'Sedang' },
          { value: 'sulit', label: 'Sulit' },
        ]
      },
    },
    validation: {
      nama_materi: [
        { rule: 'required', message: 'Nama materi wajib diisi' },
        { rule: 'minLength', value: 3, message: 'Nama minimal 3 karakter' },
        { rule: 'maxLength', value: 100, message: 'Nama maksimal 100 karakter' },
      ],
      kode_materi: [
        { rule: 'required', message: 'Kode materi wajib diisi' },
        { rule: 'minLength', value: 3, message: 'Kode minimal 3 karakter' },
        { rule: 'maxLength', value: 20, message: 'Kode maksimal 20 karakter' },
      ],
      id_mata_pelajaran: [
        { rule: 'required', message: 'Mata pelajaran wajib dipilih' },
      ],
      id_kelas: [
        { rule: 'required', message: 'Kelas wajib dipilih' },
      ],
      durasi_menit: [
        { rule: 'number', message: 'Durasi harus berupa angka' },
        { rule: 'min', value: 1, message: 'Durasi minimal 1 menit' },
      ],
    },
    relationships: {
      mataPelajaran: { type: 'belongsTo', entity: 'mataPelajaran', required: true },
      kelas: { type: 'belongsTo', entity: 'kelas', required: true },
      jenjang: { type: 'belongsTo', entity: 'jenjang', via: 'kelas' }
    },
    ui: {
      listTitle: 'Daftar Materi',
      createTitle: 'Tambah Materi',
      editTitle: 'Edit Materi',
      detailTitle: 'Detail Materi',
      colors: { primary: '#e74c3c' }
    }
  },

  [ENTITY_TYPES.KURIKULUM]: {
    ...BASE_ENTITY_CONFIG,
    name: 'kurikulum',
    displayName: 'Kurikulum',
    displayNamePlural: 'Kurikulum',
    apiEndpoints: {
      base: '/admin-cabang/akademik/kurikulum',
      list: '/admin-cabang/akademik/kurikulum',
      create: '/admin-cabang/akademik/kurikulum',
      detail: (id) => `/admin-cabang/akademik/kurikulum/${id}`,
      update: (id) => `/admin-cabang/akademik/kurikulum/${id}`,
      delete: (id) => `/admin-cabang/akademik/kurikulum/${id}`,
      statistics: '/admin-cabang/akademik/statistics',
      assignMateri: (id) => `/admin-cabang/akademik/kurikulum/${id}/assign-materi`,
      removeMateri: (id, materiId) => `/admin-cabang/akademik/kurikulum/${id}/remove-materi/${materiId}`,
      reorderMateri: (id) => `/admin-cabang/akademik/kurikulum/${id}/reorder-materi`,
      availableMateri: (id) => `/admin-cabang/akademik/kurikulum/${id}/available-materi`,
      setActive: (id) => `/admin-cabang/akademik/kurikulum/${id}/set-active`,
    },
    fields: {
      id_kurikulum: { type: FIELD_TYPES.NUMBER, readonly: true },
      nama_kurikulum: { 
        type: FIELD_TYPES.TEXT, 
        required: true, 
        label: 'Nama Kurikulum',
        placeholder: 'Contoh: Kurikulum 2024'
      },
      tahun_berlaku: { 
        type: FIELD_TYPES.NUMBER, 
        required: true, 
        label: 'Tahun Berlaku',
        placeholder: 'Tahun mulai berlaku'
      },
      id_jenjang: { 
        type: FIELD_TYPES.CASCADE_SELECT, 
        label: 'Jenjang',
        placeholder: 'Pilih jenjang (kosong = semua jenjang)',
        source: 'jenjang',
        allowEmpty: true
      },
      deskripsi: { 
        type: FIELD_TYPES.TEXTAREA, 
        label: 'Deskripsi',
        placeholder: 'Deskripsi kurikulum'
      },
      status: { 
        type: FIELD_TYPES.SELECT, 
        label: 'Status',
        defaultValue: 'draft',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'aktif', label: 'Aktif' },
          { value: 'nonaktif', label: 'Non Aktif' },
        ]
      },
      is_active: { 
        type: FIELD_TYPES.SWITCH, 
        label: 'Kurikulum Utama',
        defaultValue: false
      },
    },
    validation: {
      nama_kurikulum: [
        { rule: 'required', message: 'Nama kurikulum wajib diisi' },
        { rule: 'minLength', value: 3, message: 'Nama minimal 3 karakter' },
        { rule: 'maxLength', value: 100, message: 'Nama maksimal 100 karakter' },
      ],
      tahun_berlaku: [
        { rule: 'required', message: 'Tahun berlaku wajib diisi' },
        { rule: 'number', message: 'Tahun harus berupa angka' },
        { rule: 'min', value: 2020, message: 'Tahun minimal 2020' },
        { rule: 'max', value: 2030, message: 'Tahun maksimal 2030' },
      ],
    },
    relationships: {
      jenjang: { type: 'belongsTo', entity: 'jenjang', optional: true },
      materi: { type: 'hasMany', entity: 'materi', through: 'kurikulum_materi' }
    },
    ui: {
      listTitle: 'Daftar Kurikulum',
      createTitle: 'Tambah Kurikulum',
      editTitle: 'Edit Kurikulum',
      detailTitle: 'Detail Kurikulum',
      colors: { primary: '#9b59b6' },
      specialActions: ['assign-materi']
    }
  },
};

// Validation Rules
export const VALIDATION_RULES = {
  required: (value) => value !== null && value !== undefined && value !== '',
  minLength: (value, min) => String(value).length >= min,
  maxLength: (value, max) => String(value).length <= max,
  number: (value) => !isNaN(Number(value)),
  min: (value, min) => Number(value) >= min,
  max: (value, max) => Number(value) <= max,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  unique: (value, field, entityType, excludeId) => {
    // This will be implemented in validation hook
    return true; // Placeholder
  },
  conditionalRequired: (value, condition, formData) => {
    if (formData[condition.field] === condition.value) {
      return VALIDATION_RULES.required(value);
    }
    return true;
  },
};

// Helper Functions
export const getEntityConfig = (entityType) => {
  return ENTITY_CONFIGS[entityType] || null;
};

export const getEntityFields = (entityType) => {
  const config = getEntityConfig(entityType);
  return config ? config.fields : {};
};

export const getEntityValidation = (entityType) => {
  const config = getEntityConfig(entityType);
  return config ? config.validation : {};
};

export const getEntityApiEndpoints = (entityType) => {
  const config = getEntityConfig(entityType);
  return config ? config.apiEndpoints : {};
};

export const getEntityRelationships = (entityType) => {
  const config = getEntityConfig(entityType);
  return config ? config.relationships : {};
};

export const getEntityUI = (entityType) => {
  const config = getEntityConfig(entityType);
  return config ? config.ui : {};
};

// Navigation Helper
export const getEntityTitle = (entityType, mode, item = null) => {
  const config = getEntityConfig(entityType);
  if (!config) return 'Entity';

  switch (mode) {
    case 'list':
      return config.ui.listTitle;
    case 'create':
      return config.ui.createTitle;
    case 'edit':
      return config.ui.editTitle;
    case 'detail':
      return config.ui.detailTitle;
    case 'assign':
      return `Assign Materi - ${item?.nama_kurikulum || 'Kurikulum'}`;
    default:
      return config.displayName;
  }
};