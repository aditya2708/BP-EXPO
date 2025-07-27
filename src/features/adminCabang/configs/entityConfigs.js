// configs/entityConfigs.js
// Single source of truth for all entity configurations

// =============================================================================
// CONSTANTS
// =============================================================================

export const ENTITY_TYPES = {
  JENJANG: 'jenjang',
  MATA_PELAJARAN: 'mataPelajaran',
  KELAS: 'kelas',
  MATERI: 'materi',
  KURIKULUM: 'kurikulum'
};

export const FIELD_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  PICKER: 'picker',
  DATE: 'date',
  SWITCH: 'switch',
  FILE: 'file',
  NUMBER: 'number',
  EMAIL: 'email',
  PHONE: 'phone'
};

export const VALIDATION_RULES = {
  REQUIRED: 'required',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  EMAIL_FORMAT: 'emailFormat',
  PHONE_FORMAT: 'phoneFormat',
  NUMERIC: 'numeric',
  UNIQUE: 'unique'
};

// =============================================================================
// BASE CONFIGURATION TEMPLATE
// =============================================================================

const createBaseConfig = () => ({
  // API Configuration
  api: {
    endpoints: {},
    idField: 'id',
    nameField: 'nama'
  },
  
  // UI Configuration
  ui: {
    title: '',
    subtitle: '',
    icon: 'folder',
    color: '#007AFF',
    listEmptyText: 'Belum ada data',
    listEmptySubtext: 'Tap tombol + untuk menambah data baru'
  },
  
  // Field Configuration
  fields: [],
  
  // Validation Rules
  validation: {},
  
  // Search Configuration
  search: {
    enabled: true,
    placeholder: 'Cari...',
    fields: []
  },
  
  // List Configuration
  list: {
    renderCard: 'default',
    showActions: true,
    pullToRefresh: true,
    pagination: true
  },
  
  // Form Configuration
  form: {
    sections: [],
    submitText: 'Simpan',
    resetText: 'Reset'
  },
  
  // Navigation Configuration
  navigation: {
    headerTitle: '',
    showBackButton: true,
    rightButton: null
  }
});

// =============================================================================
// VALIDATION RULE IMPLEMENTATIONS
// =============================================================================

export const VALIDATION_HANDLERS = {
  [VALIDATION_RULES.REQUIRED]: (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'Field ini wajib diisi';
    }
    return null;
  },
  
  [VALIDATION_RULES.MIN_LENGTH]: (value, minLength) => {
    if (value && value.length < minLength) {
      return `Minimal ${minLength} karakter`;
    }
    return null;
  },
  
  [VALIDATION_RULES.MAX_LENGTH]: (value, maxLength) => {
    if (value && value.length > maxLength) {
      return `Maksimal ${maxLength} karakter`;
    }
    return null;
  },
  
  [VALIDATION_RULES.EMAIL_FORMAT]: (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Format email tidak valid';
    }
    return null;
  },
  
  [VALIDATION_RULES.PHONE_FORMAT]: (value) => {
    if (value && !/^(\+62|62|0)[0-9]{9,12}$/.test(value.replace(/[-\s]/g, ''))) {
      return 'Format nomor telepon tidak valid';
    }
    return null;
  },
  
  [VALIDATION_RULES.NUMERIC]: (value) => {
    if (value && isNaN(value)) {
      return 'Harus berupa angka';
    }
    return null;
  }
};

// =============================================================================
// ENTITY CONFIGURATIONS
// =============================================================================

export const ENTITY_CONFIGS = {
  
  // ---------------------------------------------------------------------------
  // JENJANG CONFIGURATION
  // ---------------------------------------------------------------------------
  [ENTITY_TYPES.JENJANG]: {
    ...createBaseConfig(),
    
    api: {
      endpoints: {
        list: '/admin-cabang/jenjang',
        create: '/admin-cabang/jenjang',
        detail: (id) => `/admin-cabang/jenjang/${id}`,
        update: (id) => `/admin-cabang/jenjang/${id}`,
        delete: (id) => `/admin-cabang/jenjang/${id}`
      },
      idField: 'id',
      nameField: 'nama'
    },
    
    ui: {
      title: 'Jenjang',
      subtitle: 'Kelola data jenjang pendidikan',
      icon: 'graduation-cap',
      color: '#28A745',
      listEmptyText: 'Belum ada jenjang',
      listEmptySubtext: 'Tap tombol + untuk menambah jenjang baru'
    },
    
    fields: [
      {
        key: 'nama',
        label: 'Nama Jenjang',
        type: FIELD_TYPES.TEXT,
        placeholder: 'Contoh: SD, SMP, SMA',
        required: true,
        searchable: true
      },
      {
        key: 'deskripsi',
        label: 'Deskripsi',
        type: FIELD_TYPES.TEXTAREA,
        placeholder: 'Deskripsi jenjang (opsional)',
        required: false,
        rows: 3
      }
    ],
    
    validation: {
      nama: [
        { rule: VALIDATION_RULES.REQUIRED },
        { rule: VALIDATION_RULES.MIN_LENGTH, value: 2 },
        { rule: VALIDATION_RULES.MAX_LENGTH, value: 50 }
      ]
    },
    
    search: {
      enabled: true,
      placeholder: 'Cari jenjang...',
      fields: ['nama', 'deskripsi']
    },
    
    form: {
      sections: [
        {
          title: 'Informasi Jenjang',
          fields: ['nama', 'deskripsi']
        }
      ]
    }
  },
  
  // ---------------------------------------------------------------------------
  // MATA PELAJARAN CONFIGURATION
  // ---------------------------------------------------------------------------
  [ENTITY_TYPES.MATA_PELAJARAN]: {
    ...createBaseConfig(),
    
    api: {
      endpoints: {
        list: '/admin-cabang/mata-pelajaran',
        create: '/admin-cabang/mata-pelajaran',
        detail: (id) => `/admin-cabang/mata-pelajaran/${id}`,
        update: (id) => `/admin-cabang/mata-pelajaran/${id}`,
        delete: (id) => `/admin-cabang/mata-pelajaran/${id}`,
        categories: '/admin-cabang/mata-pelajaran/kategori-options'
      },
      idField: 'id',
      nameField: 'nama'
    },
    
    ui: {
      title: 'Mata Pelajaran',
      subtitle: 'Kelola data mata pelajaran',
      icon: 'book-open',
      color: '#17A2B8',
      listEmptyText: 'Belum ada mata pelajaran',
      listEmptySubtext: 'Tap tombol + untuk menambah mata pelajaran baru'
    },
    
    fields: [
      {
        key: 'nama',
        label: 'Nama Mata Pelajaran',
        type: FIELD_TYPES.TEXT,
        placeholder: 'Contoh: Matematika, Bahasa Indonesia',
        required: true,
        searchable: true
      },
      {
        key: 'kategori',
        label: 'Kategori',
        type: FIELD_TYPES.PICKER,
        placeholder: 'Pilih kategori',
        required: true,
        options: [], // Will be loaded from API
        searchable: true
      },
      {
        key: 'deskripsi',
        label: 'Deskripsi',
        type: FIELD_TYPES.TEXTAREA,
        placeholder: 'Deskripsi mata pelajaran (opsional)',
        required: false,
        rows: 3
      }
    ],
    
    validation: {
      nama: [
        { rule: VALIDATION_RULES.REQUIRED },
        { rule: VALIDATION_RULES.MIN_LENGTH, value: 2 },
        { rule: VALIDATION_RULES.MAX_LENGTH, value: 100 }
      ],
      kategori: [
        { rule: VALIDATION_RULES.REQUIRED }
      ]
    },
    
    search: {
      enabled: true,
      placeholder: 'Cari mata pelajaran...',
      fields: ['nama', 'kategori', 'deskripsi']
    },
    
    form: {
      sections: [
        {
          title: 'Informasi Mata Pelajaran',
          fields: ['nama', 'kategori', 'deskripsi']
        }
      ]
    }
  },
  
  // ---------------------------------------------------------------------------
  // KELAS CONFIGURATION
  // ---------------------------------------------------------------------------
  [ENTITY_TYPES.KELAS]: {
    ...createBaseConfig(),
    
    api: {
      endpoints: {
        list: '/admin-cabang/kelas',
        create: '/admin-cabang/kelas',
        detail: (id) => `/admin-cabang/kelas/${id}`,
        update: (id) => `/admin-cabang/kelas/${id}`,
        delete: (id) => `/admin-cabang/kelas/${id}`,
        jenjangOptions: '/admin-cabang/jenjang'
      },
      idField: 'id',
      nameField: 'nama'
    },
    
    ui: {
      title: 'Kelas',
      subtitle: 'Kelola data kelas',
      icon: 'users',
      color: '#FFC107',
      listEmptyText: 'Belum ada kelas',
      listEmptySubtext: 'Tap tombol + untuk menambah kelas baru'
    },
    
    fields: [
      {
        key: 'jenjang_id',
        label: 'Jenjang',
        type: FIELD_TYPES.PICKER,
        placeholder: 'Pilih jenjang',
        required: true,
        options: [], // Will be loaded from API
        searchable: true
      },
      {
        key: 'nama',
        label: 'Nama Kelas',
        type: FIELD_TYPES.TEXT,
        placeholder: 'Contoh: Kelas 1A, Kelas 7B',
        required: true,
        searchable: true
      },
      {
        key: 'tingkat',
        label: 'Tingkat',
        type: FIELD_TYPES.NUMBER,
        placeholder: 'Contoh: 1, 2, 3',
        required: true
      },
      {
        key: 'kapasitas',
        label: 'Kapasitas Maksimal',
        type: FIELD_TYPES.NUMBER,
        placeholder: 'Contoh: 30',
        required: false
      },
      {
        key: 'deskripsi',
        label: 'Deskripsi',
        type: FIELD_TYPES.TEXTAREA,
        placeholder: 'Deskripsi kelas (opsional)',
        required: false,
        rows: 3
      }
    ],
    
    validation: {
      jenjang_id: [
        { rule: VALIDATION_RULES.REQUIRED }
      ],
      nama: [
        { rule: VALIDATION_RULES.REQUIRED },
        { rule: VALIDATION_RULES.MIN_LENGTH, value: 2 },
        { rule: VALIDATION_RULES.MAX_LENGTH, value: 50 }
      ],
      tingkat: [
        { rule: VALIDATION_RULES.REQUIRED },
        { rule: VALIDATION_RULES.NUMERIC }
      ],
      kapasitas: [
        { rule: VALIDATION_RULES.NUMERIC }
      ]
    },
    
    search: {
      enabled: true,
      placeholder: 'Cari kelas...',
      fields: ['nama', 'tingkat', 'deskripsi']
    },
    
    form: {
      sections: [
        {
          title: 'Informasi Kelas',
          fields: ['jenjang_id', 'nama', 'tingkat', 'kapasitas', 'deskripsi']
        }
      ]
    },
    
    // Cascading dropdown rules
    cascading: {
      triggers: ['jenjang_id'],
      dependencies: {
        jenjang_id: {
          affects: [], // No direct cascade for kelas
          endpoint: null
        }
      }
    }
  },
  
  // ---------------------------------------------------------------------------
  // MATERI CONFIGURATION
  // ---------------------------------------------------------------------------
  [ENTITY_TYPES.MATERI]: {
    ...createBaseConfig(),
    
    api: {
      endpoints: {
        list: '/admin-cabang/materi',
        create: '/admin-cabang/materi',
        detail: (id) => `/admin-cabang/materi/${id}`,
        update: (id) => `/admin-cabang/materi/${id}`,
        delete: (id) => `/admin-cabang/materi/${id}`,
        mataPelajaranOptions: '/admin-cabang/mata-pelajaran'
      },
      idField: 'id',
      nameField: 'judul'
    },
    
    ui: {
      title: 'Materi',
      subtitle: 'Kelola materi pembelajaran',
      icon: 'file-text',
      color: '#6F42C1',
      listEmptyText: 'Belum ada materi',
      listEmptySubtext: 'Tap tombol + untuk menambah materi baru'
    },
    
    fields: [
      {
        key: 'mata_pelajaran_id',
        label: 'Mata Pelajaran',
        type: FIELD_TYPES.PICKER,
        placeholder: 'Pilih mata pelajaran',
        required: true,
        options: [], // Will be loaded from API
        searchable: true
      },
      {
        key: 'judul',
        label: 'Judul Materi',
        type: FIELD_TYPES.TEXT,
        placeholder: 'Masukkan judul materi',
        required: true,
        searchable: true
      },
      {
        key: 'deskripsi',
        label: 'Deskripsi',
        type: FIELD_TYPES.TEXTAREA,
        placeholder: 'Deskripsi materi',
        required: true,
        rows: 4,
        searchable: true
      },
      {
        key: 'tingkat_kesulitan',
        label: 'Tingkat Kesulitan',
        type: FIELD_TYPES.PICKER,
        placeholder: 'Pilih tingkat kesulitan',
        required: true,
        options: [
          { label: 'Mudah', value: 'mudah' },
          { label: 'Sedang', value: 'sedang' },
          { label: 'Sulit', value: 'sulit' }
        ]
      },
      {
        key: 'file_materi',
        label: 'File Materi',
        type: FIELD_TYPES.FILE,
        placeholder: 'Upload file materi (PDF, DOC, PPT)',
        required: false,
        accept: '.pdf,.doc,.docx,.ppt,.pptx'
      }
    ],
    
    validation: {
      mata_pelajaran_id: [
        { rule: VALIDATION_RULES.REQUIRED }
      ],
      judul: [
        { rule: VALIDATION_RULES.REQUIRED },
        { rule: VALIDATION_RULES.MIN_LENGTH, value: 3 },
        { rule: VALIDATION_RULES.MAX_LENGTH, value: 200 }
      ],
      deskripsi: [
        { rule: VALIDATION_RULES.REQUIRED },
        { rule: VALIDATION_RULES.MIN_LENGTH, value: 10 }
      ],
      tingkat_kesulitan: [
        { rule: VALIDATION_RULES.REQUIRED }
      ]
    },
    
    search: {
      enabled: true,
      placeholder: 'Cari materi...',
      fields: ['judul', 'deskripsi', 'tingkat_kesulitan']
    },
    
    form: {
      sections: [
        {
          title: 'Informasi Materi',
          fields: ['mata_pelajaran_id', 'judul', 'deskripsi', 'tingkat_kesulitan']
        },
        {
          title: 'File Materi',
          fields: ['file_materi']
        }
      ]
    }
  },
  
  // ---------------------------------------------------------------------------
  // KURIKULUM CONFIGURATION
  // ---------------------------------------------------------------------------
  [ENTITY_TYPES.KURIKULUM]: {
    ...createBaseConfig(),
    
    api: {
      endpoints: {
        list: '/admin-cabang/kurikulum',
        create: '/admin-cabang/kurikulum',
        detail: (id) => `/admin-cabang/kurikulum/${id}`,
        update: (id) => `/admin-cabang/kurikulum/${id}`,
        delete: (id) => `/admin-cabang/kurikulum/${id}`,
        setActive: (id) => `/admin-cabang/kurikulum/${id}/set-active`,
        addMateri: (id) => `/admin-cabang/kurikulum/${id}/materi`,
        removeMateri: (id, materiId) => `/admin-cabang/kurikulum/${id}/materi/${materiId}`,
        tahunBerlaku: '/admin-cabang/kurikulum/tahun-berlaku'
      },
      idField: 'id',
      nameField: 'nama'
    },
    
    ui: {
      title: 'Kurikulum',
      subtitle: 'Kelola kurikulum pembelajaran',
      icon: 'layers',
      color: '#DC3545',
      listEmptyText: 'Belum ada kurikulum',
      listEmptySubtext: 'Tap tombol + untuk menambah kurikulum baru'
    },
    
    fields: [
      {
        key: 'nama',
        label: 'Nama Kurikulum',
        type: FIELD_TYPES.TEXT,
        placeholder: 'Contoh: Kurikulum 2024',
        required: true,
        searchable: true
      },
      {
        key: 'tahun_berlaku',
        label: 'Tahun Berlaku',
        type: FIELD_TYPES.NUMBER,
        placeholder: 'Contoh: 2024',
        required: true
      },
      {
        key: 'deskripsi',
        label: 'Deskripsi',
        type: FIELD_TYPES.TEXTAREA,
        placeholder: 'Deskripsi kurikulum',
        required: true,
        rows: 4,
        searchable: true
      },
      {
        key: 'is_active',
        label: 'Status Aktif',
        type: FIELD_TYPES.SWITCH,
        required: false,
        defaultValue: false
      }
    ],
    
    validation: {
      nama: [
        { rule: VALIDATION_RULES.REQUIRED },
        { rule: VALIDATION_RULES.MIN_LENGTH, value: 3 },
        { rule: VALIDATION_RULES.MAX_LENGTH, value: 100 }
      ],
      tahun_berlaku: [
        { rule: VALIDATION_RULES.REQUIRED },
        { rule: VALIDATION_RULES.NUMERIC }
      ],
      deskripsi: [
        { rule: VALIDATION_RULES.REQUIRED },
        { rule: VALIDATION_RULES.MIN_LENGTH, value: 10 }
      ]
    },
    
    search: {
      enabled: true,
      placeholder: 'Cari kurikulum...',
      fields: ['nama', 'tahun_berlaku', 'deskripsi']
    },
    
    form: {
      sections: [
        {
          title: 'Informasi Kurikulum',
          fields: ['nama', 'tahun_berlaku', 'deskripsi', 'is_active']
        }
      ]
    },
    
    // Special actions for kurikulum
    specialActions: [
      {
        key: 'assign_materi',
        label: 'Assign Materi',
        icon: 'plus-circle',
        color: '#28A745',
        mode: 'assign'
      },
      {
        key: 'set_active',
        label: 'Set Aktif',
        icon: 'check-circle',
        color: '#007AFF',
        confirmMessage: 'Yakin ingin mengaktifkan kurikulum ini?'
      }
    ]
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getEntityConfig = (entityType) => {
  const config = ENTITY_CONFIGS[entityType];
  if (!config) {
    throw new Error(`Entity configuration for '${entityType}' not found`);
  }
  return config;
};

export const getFieldConfig = (entityType, fieldKey) => {
  const config = getEntityConfig(entityType);
  return config.fields.find(field => field.key === fieldKey);
};

export const getValidationRules = (entityType, fieldKey) => {
  const config = getEntityConfig(entityType);
  return config.validation[fieldKey] || [];
};

export const getSearchableFields = (entityType) => {
  const config = getEntityConfig(entityType);
  return config.fields.filter(field => field.searchable).map(field => field.key);
};

export const getRequiredFields = (entityType) => {
  const config = getEntityConfig(entityType);
  return config.fields.filter(field => field.required).map(field => field.key);
};

export default ENTITY_CONFIGS;