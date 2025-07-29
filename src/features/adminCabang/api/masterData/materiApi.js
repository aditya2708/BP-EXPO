import api from '../../../../api/axiosConfig';

const BASE_URL = '/admin-cabang/master-data';

export const materiApi = {
  // Get all materi with pagination and filters
  getAll: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/materi`, { params });
    return response.data;
  },

  // Get materi by ID
  getById: async (id) => {
    const response = await api.get(`${BASE_URL}/materi/${id}`);
    return response.data;
  },

  // Create new materi
  create: async (data) => {
    const response = await api.post(`${BASE_URL}/materi`, data);
    return response.data;
  },

  // Update materi
  update: async (id, data) => {
    const response = await api.put(`${BASE_URL}/materi/${id}`, data);
    return response.data;
  },

  // Delete materi
  delete: async (id) => {
    const response = await api.delete(`${BASE_URL}/materi/${id}`);
    return response.data;
  },

  // Get statistics
  getStatistics: async () => {
    const response = await api.get(`${BASE_URL}/materi-statistics`);
    return response.data;
  },

  // Get dropdown data with filters
  getDropdown: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/materi-dropdown`, { params });
    return response.data;
  },

  // Get cascade data (jenjang -> mata_pelajaran -> kelas)
  getCascadeData: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/materi-cascade-data`, { params });
    return response.data;
  },

  // Get materi by mata pelajaran
  getByMataPelajaran: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/materi-mata-pelajaran`, { params });
    return response.data;
  },

  // Get materi by kelas
  getByKelas: async (kelasId, params = {}) => {
    const response = await api.get(`${BASE_URL}/materi-kelas/${kelasId}`, { params });
    return response.data;
  },

  // Validate unique combination (mata_pelajaran + kelas + nama_materi)
  validateUnique: async (data) => {
    const { id_mata_pelajaran, id_kelas, nama_materi, exclude_id } = data;
    const response = await api.post(`${BASE_URL}/materi-validate-unique`, {
      id_mata_pelajaran,
      id_kelas, 
      nama_materi,
      exclude_id
    });
    return response.data;
  },

  // Check if materi can be deleted (not used in kurikulum)
  checkDependencies: async (id) => {
    const response = await api.get(`${BASE_URL}/materi/${id}/dependencies`);
    return response.data;
  },

  // Get available mata pelajaran for selected kelas
  getAvailableMataPelajaran: async (kelasId) => {
    const response = await api.get(`${BASE_URL}/materi-available-mapel/${kelasId}`);
    return response.data;
  },

  // Get available kelas for selected mata pelajaran  
  getAvailableKelas: async (mataPelajaranId) => {
    const response = await api.get(`${BASE_URL}/materi-available-kelas/${mataPelajaranId}`);
    return response.data;
  },

  // ANALYTICS ENDPOINTS

  // Get usage analytics overview
  getAnalytics: async (filters = {}) => {
    const response = await api.get(`${BASE_URL}/materi-analytics`, { params: filters });
    return response.data;
  },

  // Get specific materi analytics
  getMateriAnalytics: async (materiId) => {
    const response = await api.get(`${BASE_URL}/materi/${materiId}/analytics`);
    return response.data;
  },

  // Get usage trends
  getUsageTrends: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/materi-usage-trends`, { params });
    return response.data;
  },

  // Get unused materi
  getUnusedMateri: async (filters = {}) => {
    const response = await api.get(`${BASE_URL}/materi-unused`, { params: filters });
    return response.data;
  },

  // Get optimization recommendations
  getOptimizationRecommendations: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/materi-recommendations`, { params });
    return response.data;
  },

  // Get usage history for specific materi
  getUsageHistory: async (materiId, params = {}) => {
    const response = await api.get(`${BASE_URL}/materi/${materiId}/usage-history`, { params });
    return response.data;
  },

  // Generate usage report
  generateUsageReport: async (params = {}) => {
    const response = await api.post(`${BASE_URL}/materi-usage-report`, params);
    return response.data;
  },

  // BULK OPERATIONS

  // Bulk delete materi
  bulkDelete: async (materiIds) => {
    const response = await api.post(`${BASE_URL}/materi-bulk-delete`, { materi_ids: materiIds });
    return response.data;
  },

  // Bulk duplicate materi
  bulkDuplicate: async (data) => {
    const response = await api.post(`${BASE_URL}/materi-bulk-duplicate`, data);
    return response.data;
  },

  // Bulk move materi
  bulkMove: async (data) => {
    const response = await api.post(`${BASE_URL}/materi-bulk-move`, data);
    return response.data;
  },

  // Bulk export materi
  bulkExport: async (materiIds, format = 'json') => {
    const response = await api.post(`${BASE_URL}/materi-bulk-export`, { 
      materi_ids: materiIds,
      format 
    });
    return response.data;
  },

  // TEMPLATE OPERATIONS

  // Get templates
  getTemplates: async () => {
    const response = await api.get(`${BASE_URL}/materi-templates`);
    return response.data;
  },

  // Create template
  createTemplate: async (data) => {
    const response = await api.post(`${BASE_URL}/materi-templates`, data);
    return response.data;
  },

  // Apply template
  applyTemplate: async (data) => {
    const response = await api.post(`${BASE_URL}/materi-apply-template`, data);
    return response.data;
  },

  // IMPORT/EXPORT

  // Import materi
  importMateri: async (data) => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('format', data.format);
    if (data.target_jenjang_id) formData.append('target_jenjang_id', data.target_jenjang_id);
    formData.append('overwrite_existing', data.overwrite_existing);
    formData.append('validate_dependencies', data.validate_dependencies);

    const response = await api.post(`${BASE_URL}/materi-import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Export materi
  exportMateri: async (data) => {
    const response = await api.post(`${BASE_URL}/materi-export`, data);
    return response.data;
  }
};

export default materiApi;