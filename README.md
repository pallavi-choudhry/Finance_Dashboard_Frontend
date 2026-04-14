# Finance Manager (Frontend)

## Live demo

- **Backend (Render):** [https://finance-dashboard-backend-2fn9.onrender.com](https://finance-dashboard-backend-2fn9.onrender.com) — root returns JSON; [API health](https://finance-dashboard-backend-2fn9.onrender.com/api/test).
- **Frontend (Netlify):** deploy this app and use your Netlify URL. The **login** page lists live links for this app and the API.

### Netlify

Optional env: `VITE_API_URL=https://finance-dashboard-backend-2fn9.onrender.com/api` (production build otherwise defaults to this URL in code).

### Render (CORS)

Set `CORS_ORIGINS=https://YOUR-SITE.netlify.app` so the browser can call the API. Also set `MONGO_URI` and `JWT_SECRET`.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
