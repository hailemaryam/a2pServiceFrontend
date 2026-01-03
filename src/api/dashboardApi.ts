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

// SMS Overview chart data: list of { date: string, count: number }
export type SmsOverviewResponse = {
  date: string;
  count: number;
}[];

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
