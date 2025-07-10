import api from '../../../api/axiosConfig';

export const mataPelajaranApi = {
  getAllMataPelajaran: async (params = {}) => {
    return await api.get('/admin-cabang/mata-pelajaran', { params });
  },

  getMataPelajaranDetail: async (id) => {
    return await api.get(`/admin-cabang/mata-pelajaran/${id}`);
  },

  createMataPelajaran: async (mataPelajaranData) => {
    return await api.post('/admin-cabang/mata-pelajaran', mataPelajaranData);
  },

  updateMataPelajaran: async (id, mataPelajaranData) => {
    return await api.put(`/admin-cabang/mata-pelajaran/${id}`, mataPelajaranData);
  },

  deleteMataPelajaran: async (id) => {
    return await api.delete(`/admin-cabang/mata-pelajaran/${id}`);
  },

  getByJenjang: async (jenjangId) => {
    return await api.get(`/admin-cabang/mata-pelajaran/jenjang/${jenjangId}`);
  },

  getKategoriOptions: async () => {
    return await api.get('/admin-cabang/mata-pelajaran/kategori-options');
  },

  getStatistics: async () => {
    return await api.get('/admin-cabang/mata-pelajaran/statistics');
  },

  getForDropdown: async (params = {}) => {
    return await api.get('/admin-cabang/mata-pelajaran/dropdown', { params });
  },

  checkCanDelete: async (id) => {
    return await api.get(`/admin-cabang/mata-pelajaran/${id}/check-can-delete`);
  }
};