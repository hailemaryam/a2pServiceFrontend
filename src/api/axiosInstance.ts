import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ensureKeycloakToken, keycloak } from "./keycloak";

const axiosInstance = axios.create({
  baseURL: (import.meta.env as any).VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await ensureKeycloakToken();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // If token refresh fails, force a login on the next response 401 handler
      console.warn("Keycloak token refresh failed", error);
    }
    return config;
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        await keycloak.login();
      } catch (loginError) {
        console.error("Keycloak login redirect failed", loginError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;



