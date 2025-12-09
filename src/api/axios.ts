import axios from "axios";
import { keycloak } from "../auth/keycloak";

const api = axios.create({
  baseURL: (import.meta.env as any).VITE_API_BASE_URL || "",
  headers: { "Content-Type": "application/json" },
});

// Attach Keycloak token and try to refresh before each request
api.interceptors.request.use(
  async (config) => {
    try {
      if (keycloak) {
        // ensure token is valid for at least 30s
        await keycloak.updateToken(30);
        const token = keycloak.token;
        if (token) {
          config.headers = config.headers || {};
          (config.headers as any).Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      // token refresh failed — let the request proceed without token
      console.warn("Keycloak token update failed", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
