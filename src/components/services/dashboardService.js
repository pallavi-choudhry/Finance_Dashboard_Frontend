// dashboardService.js
import api from './api'; // or your axios instance

export const dashboardService = {
  getDashboardData: async () => {
    try {
      const response = await api.get('/dashboard/summary');
      
      // Return consistent structure
      return {
        success: true,
        data: {
          totals: {
            totalIncome: Number(response.data?.data?.totals?.totalIncome || 
                        response.data?.totals?.totalIncome || 0),
            totalExpenses: Number(response.data?.data?.totals?.totalExpenses || 
                          response.data?.totals?.totalExpenses || 0),
            netBalance: Number(response.data?.data?.totals?.netBalance || 
                       response.data?.totals?.netBalance || 0)
          },
          categoryTotals: response.data?.data?.categoryTotals || 
                         response.data?.categoryTotals || [],
          trends: response.data?.data?.trends || 
                 response.data?.trends || [],
          yearlyTrends: response.data?.data?.yearlyTrends ||
                        response.data?.yearlyTrends || [],
          recentActivity: response.data?.data?.recentActivity || 
                         response.data?.recentActivity || []
        }
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};