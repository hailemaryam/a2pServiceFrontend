import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { ensureKeycloakToken, keycloak } from "./keycloak";

const baseUrl = (import.meta.env as any).VITE_API_BASE_URL || "";

// Custom base query with Keycloak authentication
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers, { endpoint }) => {
    try {
      const token = await ensureKeycloakToken();
      if (token) {
        // Sanitize token to prevent newline injection
        const cleanToken = token.trim().replace(/[\r\n]+/g, "");
        headers.set("Authorization", `Bearer ${cleanToken}`);
      }
      
      console.log(`[API Debug] Requesting: ${baseUrl}${endpoint}`);
      console.log(`[API Debug] Token present: ${!!token}`);
      
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
  tagTypes: [
    "Contact",
    "ContactGroup",
    "Sms",
    "Sender",
    "Payment",
    "ApiKey",
    "Profile",
    "Tenant",
    "SmsPackage",
    "SmsJob",
  ],
  endpoints: () => ({}),
});

