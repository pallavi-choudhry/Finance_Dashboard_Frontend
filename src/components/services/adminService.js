import api from './api';

export const userService = {
  async getAllUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async createUser(userData) {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  async updateUserRole(id, role) {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  async updateUserStatus(id, status) {
    const response = await api.put(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }
};