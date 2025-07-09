// 9. src/features/adminCabang/api/kurikulumApi.js
import api from '../../../api/axiosConfig';

export const kurikulumApi = {
  getAllKurikulum: async (params = {}) => {
    return await api.get('/admin-cabang/kurikulum', { params });
  },

  getKurikulumDetail: async (id) => {
    return await api.get(`/admin-cabang/kurikulum/${id}`);
  },

  createKurikulum: async (kurikulumData) => {
    return await api.post('/admin-cabang/kurikulum', kurikulumData);
  },

  updateKurikulum: async (id, kurikulumData) => {
    return await api.put(`/admin-cabang/kurikulum/${id}`, kurikulumData);
  },

  deleteKurikulum: async (id) => {
    return await api.delete(`/admin-cabang/kurikulum/${id}`);
  },

  getActive: async () => {
    return await api.get('/admin-cabang/kurikulum/active');
  },

  setActive: async (id) => {
    return await api.post(`/admin-cabang/kurikulum/${id}/set-active`);
  },

  getStatistics: async (id) => {
    return await api.get(`/admin-cabang/kurikulum/${id}/statistics`);
  },

  getTahunBerlaku: async () => {
    return await api.get('/admin-cabang/kurikulum/tahun-berlaku');
  },

  addMateri: async (id, materiData) => {
    return await api.post(`/admin-cabang/kurikulum/${id}/materi`, materiData);
  },

  removeMateri: async (id, materiId) => {
    return await api.delete(`/admin-cabang/kurikulum/${id}/materi/${materiId}`);
  },

  checkCanDelete: async (id) => {
    return await api.get(`/admin-cabang/kurikulum/${id}/check-can-delete`);
  },

  duplicateKurikulum: async (id, newData) => {
    return await api.post(`/admin-cabang/kurikulum/${id}/duplicate`, newData);
  }
};