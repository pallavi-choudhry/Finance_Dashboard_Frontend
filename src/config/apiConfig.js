const RENDER_DEFAULT_API = 'https://finance-dashboard-backend-2fn9.onrender.com/api';

export const apiBaseURL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : (import.meta.env.DEV 
    ? 'http://localhost:5001/api'  // Development
    : RENDER_DEFAULT_API);          // Production

export const backendPublicOrigin = apiBaseURL.replace(/\/api\/?$/, '');