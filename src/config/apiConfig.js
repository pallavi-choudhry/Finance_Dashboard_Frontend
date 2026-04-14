/**
 * API base for axios. Local dev defaults to localhost; production build defaults to deployed Render API
 * unless VITE_API_URL is set (recommended on Netlify: VITE_API_URL=https://your-backend.onrender.com/api).
 */
const RENDER_DEFAULT_API =
  'https://finance-dashboard-backend-2fn9.onrender.com/api';

export const apiBaseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  (import.meta.env.DEV ? 'https://finance-dashboard-backend-2fn9.onrender.com/api' : RENDER_DEFAULT_API);

/** Origin only (no /api), for “Live backend” links on the login page */
export const backendPublicOrigin = apiBaseURL.replace(/\/api\/?$/, '');
