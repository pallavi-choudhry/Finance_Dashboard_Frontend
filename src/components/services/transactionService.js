import api from './api';

export const transactionService = {

  async getTransactions(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const res = await api.get(`/transactions${params ? `?${params}` : ''}`);
    return res.data.data; // ✅ important
  },

  async createTransaction(data) {
    const res = await api.post('/transactions', data);
    return res.data.data;
  },

  async updateTransaction(id, data) {
    const res = await api.put(`/transactions/${id}`, data);
    return res.data.data;
  },

  async deleteTransaction(id) {
    const res = await api.delete(`/transactions/${id}`);
    return res.data;
  }
};