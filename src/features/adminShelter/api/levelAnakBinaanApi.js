import api from '../../../api/axiosConfig';
import { ADMIN_SHELTER_ENDPOINTS } from '../../../constants/endpoints';

/**
 * Level Anak Binaan API service
 * Contains methods for fetching level anak binaan data
 */
export const levelAnakBinaanApi = {
  /**
   * Get levels for the logged-in shelter admin
   * @returns {Promise} - API response with levels data
   */
  getLevels: async () => {
    return await api.get(ADMIN_SHELTER_ENDPOINTS.KELOMPOK.LEVELS);
  }
};