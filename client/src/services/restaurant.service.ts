import api from './api';

export const RestaurantService = {
  async register(data: any) {
    try {
      const response = await api.post('/restaurants/register', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  // Add other restaurant-related API calls here
};

export default RestaurantService;