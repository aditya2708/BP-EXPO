import api from '../../../api/axiosConfig';

export const kelasApi = {
  getAllKelas: async (params = {}) => {
    return await api.get('/admin-cabang/kelas', { params });
  },

  getKelasDetail: async (id) => {
    return await api.get(`/admin-cabang/kelas/${id}`);
  },

  createKelas: async (kelasData) => {
    return await api.post('/admin-cabang/kelas', kelasData);
  },

  updateKelas: async (id, kelasData) => {
    return await api.put(`/admin-cabang/kelas/${id}`, kelasData);
  },

  deleteKelas: async (id) => {
    return await api.delete(`/admin-cabang/kelas/${id}`);
  },

  getByJenjang: async (jenjangId) => {
    return await api.get(`/admin-cabang/kelas/jenjang/${jenjangId}`);
  },

  getForDropdown: async (params = {}) => {
    return await api.get('/admin-cabang/kelas/dropdown', { params });
  }
};