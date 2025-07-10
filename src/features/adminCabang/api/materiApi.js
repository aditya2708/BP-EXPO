import api from '../../../api/axiosConfig';

export const materiApi = {
  getAllMateri: async (params = {}) => {
    return await api.get('/admin-cabang/materi', { params });
  },

  getMateriDetail: async (id) => {
    return await api.get(`/admin-cabang/materi/${id}`);
  },

  createMateri: async (materiData) => {
    return await api.post('/admin-cabang/materi', materiData);
  },

  updateMateri: async (id, materiData) => {
    return await api.put(`/admin-cabang/materi/${id}`, materiData);
  },

  deleteMateri: async (id) => {
    return await api.delete(`/admin-cabang/materi/${id}`);
  },

  getByKelas: async (kelasId) => {
    return await api.get(`/admin-cabang/materi/kelas/${kelasId}`);
  },

  getByMataPelajaran: async (params) => {
    return await api.get('/admin-cabang/materi/mata-pelajaran', { params });
  },

  getCascadeData: async (params) => {
    return await api.get('/admin-cabang/materi/cascade-data', { params });
  },

  getForDropdown: async (params = {}) => {
    return await api.get('/admin-cabang/materi/dropdown', { params });
  }
};