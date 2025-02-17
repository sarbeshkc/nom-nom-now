import api from './api';

export const ProfileService = {
  async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  },

  async updateProfile(formData: FormData) {
    const response = await api.put('/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteAvatar() {
    const response = await api.delete('/profile/avatar');
    return response.data;
  }
};

export default ProfileService;