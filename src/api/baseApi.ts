import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { ensureKeycloakToken, keycloak } from "./keycloak";

const baseUrl = (import.meta.env as any).VITE_API_BASE_URL || "";

// Custom base query with Keycloak authentication
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers, { extra, endpoint, type, forced }) => {
    try {
      const token = await ensureKeycloakToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // Don't set Content-Type header here - it will be set automatically by fetchBaseQuery
      // For FormData, browser will set it with boundary automatically
      return headers;
    } catch (error) {
      console.warn("Keycloak token refresh failed", error);
      return headers;
    }
  },
});

// Base query with 401 error handling
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    try {
      await keycloak.login();
    } catch (loginError) {
      console.error("Keycloak login redirect failed", loginError);
    }
  }

  return result;
};

// Create the base API slice
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Contact"],
  endpoints: () => ({}),
});

