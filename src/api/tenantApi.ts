import { baseApi } from "./baseApi";
import { ensureKeycloakToken } from "./keycloak";

const baseUrl = (import.meta.env as any).VITE_API_BASE_URL || "";

/**
 * Registers a tenant and tenant admin for the current user
 * This should only be called for users with tenant roles (tenant_user, tenant_admin)
 * @returns Promise with the registration response
 */
export const registerTenant = async (payload: { name: string; phone?: string; isCompany: boolean; tinNumber: string; description: string; company: boolean }): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const token = await ensureKeycloakToken();
    
    if (!token) {
      return { success: false, error: "No authentication token available" };
    }

    const response = await fetch(`${baseUrl}/api/register/onboard`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Registration failed" }));
      return { 
        success: false, 
        error: errorData.message || `Registration failed with status ${response.status}` 
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Tenant registration error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
};

// Types for Tenant API
export type SmsPackageTier = {
  id: string;
  minSmsCount: number;
  maxSmsCount?: number;
  pricePerSms: number;
  description?: string;
  isActive: boolean;
};

// Tenant API 
export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenantSmsPackages: builder.query<SmsPackageTier[], void>({
      query: () => "/api/admin/sms-packages",
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response?.items ?? response?.content ?? [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "SmsPackage" as const, id })),
              { type: "SmsPackage", id: "LIST" },
            ]
          : [{ type: "SmsPackage", id: "LIST" }],
    }),
  }),
});

// Export hooks
export const { useGetTenantSmsPackagesQuery } = tenantApi;
