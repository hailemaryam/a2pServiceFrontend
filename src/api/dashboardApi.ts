import { baseApi } from "./baseApi";

export type TenantDashboardResponse = {
  remainingCredits: number;
  smsSentBySource: {
    API: number;
    MANUAL: number;
    CSV_UPLOAD: number;
  };
  contactCount: number;
};

export type AdminDashboardResponse = {
  tenantCount: number;
  pendingSenderCount: number;
  pendingSmsJobCount: number;
  activePackageCount: number;
};

// Assuming the response is a map or list of data points for the chart.
// The user example just said "string", but typically chart data is structural.
// I'll define it loosely as 'any' for now or a generic structure if I knew better.
// Given the chart usage, it likely returns { labels: string[], datasets: ... } or similar.
// For now, let's assume it returns a list of { date: string, value: number } to match frontend mock?
// The user prompt said: Response example: "string" (can be chart data or aggregated stats).
// Let's stick to `any` until we see real data, or define a flexible type.
export type SmsOverviewResponse = any;

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenantDashboard: builder.query<TenantDashboardResponse, void>({
      query: () => "/api/dashboard",
      providesTags: ["Sms", "Contact", "Sender", "Payment"], // Invalidate if any of these change?
    }),
    getAdminDashboard: builder.query<AdminDashboardResponse, void>({
      query: () => "/api/dashboard/admin",
      providesTags: ["Tenant", "Sender", "SmsJob", "SmsPackage"],
    }),
    getSmsOverview: builder.query<SmsOverviewResponse, void>({
      query: () => "/api/dashboard/overview",
    }),
  }),
});

export const {
  useGetTenantDashboardQuery,
  useGetAdminDashboardQuery,
  useGetSmsOverviewQuery,
} = dashboardApi;
