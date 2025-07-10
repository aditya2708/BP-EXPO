import api from '../../../api/axiosConfig';

export const jenjangApi = {
  getAllJenjang: async (params = {}) => {
    return await api.get('/admin-cabang/jenjang', { params });
  },

  getJenjangDetail: async (id) => {
    return await api.get(`/admin-cabang/jenjang/${id}`);
  },

  getKelas: async (id) => {
    return await api.get(`/admin-cabang/jenjang/${id}/kelas`);
  },

  getMataPelajaran: async (id) => {
    return await api.get(`/admin-cabang/jenjang/${id}/mata-pelajaran`);
  },

  getForDropdown: async () => {
    return await api.get('/admin-cabang/jenjang/dropdown');
  },

  getStatistics: async () => {
    return await api.get('/admin-cabang/jenjang/statistics');
  }
};