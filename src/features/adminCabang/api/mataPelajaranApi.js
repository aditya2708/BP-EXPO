// 10. src/features/adminCabang/api/mataPelajaranApi.js
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

  getByKategori: async (kategori = null) => {
    const endpoint = kategori ? `/admin-cabang/mata-pelajaran/kategori/${kategori}` : '/admin-cabang/mata-pelajaran/kategori';
    return await api.get(endpoint);
  },

  getKategoriOptions: async () => {
    return await api.get('/admin-cabang/mata-pelajaran/kategori-options');
  },

  getStatistics: async () => {
    return await api.get('/admin-cabang/mata-pelajaran/statistics');
  },

  getForDropdown: async () => {
    return await api.get('/admin-cabang/mata-pelajaran/dropdown');
  },

  checkCanDelete: async (id) => {
    return await api.get(`/admin-cabang/mata-pelajaran/${id}/check-can-delete`);
  }
};