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

// SMS Overview chart data
export type SmsOverviewPoint = {
  label: string;
  periodStart: string;
  periodEnd: string;
  totalSms: number;
};

export type SmsOverviewResponse = {
  granularity: "MONTH" | "QUARTER" | "YEAR";
  points: SmsOverviewPoint[];
};

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
    getSmsOverview: builder.query<SmsOverviewResponse, { days?: number } | void>({
      query: (params) => ({
        url: "/api/dashboard/overview",
        params: { days: params && typeof params === 'object' ? params.days : 30 },
      }),
    }),
  }),
});

export const {
  useGetTenantDashboardQuery,
  useGetAdminDashboardQuery,
  useGetSmsOverviewQuery,
} = dashboardApi;
