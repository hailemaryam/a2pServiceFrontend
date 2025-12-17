import { baseApi } from "./baseApi";

// Types for Admin operations (SysAdmin approval flows)
export type TenantResponse = {
  id: string;
  name?: string;
  email?: string;
  status: string;
  createdAt: string;
  [key: string]: any;
};

export type SenderApprovalPayload = {
  senderId: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
};

export type SmsJobApprovalPayload = {
  jobId: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
};

export type SmsPackageResponse = {
  id: string;
  name: string;
  price: number;
  smsCount: number;
  description?: string;
  isActive: boolean;
  [key: string]: any;
};

export type CreateSmsPackagePayload = {
  name: string;
  price: number;
  smsCount: number;
  description?: string;
};

// Admin API using RTK Query (for sys_admin only)
export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Tenants Management
    getTenants: builder.query<
      { items: TenantResponse[]; total: number; page: number; size: number },
      { page?: number; size?: number }
    >({
      query: ({ page = 0, size = 20 }) => ({
        url: "/api/admin/tenants",
        params: { page, size },
      }),
      transformResponse: (response: any, _meta, arg) => {
        return {
          items: response?.items ?? response?.content ?? [],
          total: response?.total ?? response?.totalElements ?? 0,
          page: response?.page ?? response?.pageNumber ?? arg.page ?? 0,
          size: response?.size ?? response?.pageSize ?? arg.size ?? 20,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Tenant" as const, id })),
              { type: "Tenant", id: "LIST" },
            ]
          : [{ type: "Tenant", id: "LIST" }],
    }),

    getTenantById: builder.query<TenantResponse, string>({
      query: (id) => `/api/admin/tenants/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Tenant", id }],
    }),

    // Sender Approvals
    getPendingSenders: builder.query<any[], void>({
      query: () => "/api/admin/senders/pending",
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response?.items ?? [];
      },
      providesTags: [{ type: "Sender", id: "PENDING" }],
    }),

    approveSender: builder.mutation<any, SenderApprovalPayload>({
      query: ({ senderId, status, rejectionReason }) => ({
        url: `/api/admin/senders/${senderId}/approve`,
        method: "POST",
        body: { status, rejectionReason },
      }),
      invalidatesTags: [
        { type: "Sender", id: "PENDING" },
        { type: "Sender", id: "LIST" },
      ],
    }),

    // SMS Job Approvals
    getPendingSmsJobs: builder.query<any[], void>({
      query: () => "/api/admin/sms-jobs/pending",
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response?.items ?? [];
      },
      providesTags: [{ type: "SmsJob", id: "PENDING" }],
    }),

    approveSmsJob: builder.mutation<any, SmsJobApprovalPayload>({
      query: ({ jobId, status, rejectionReason }) => ({
        url: `/api/admin/sms-jobs/${jobId}/approve`,
        method: "POST",
        body: { status, rejectionReason },
      }),
      invalidatesTags: [
        { type: "SmsJob", id: "PENDING" },
        { type: "Sms", id: "LIST" },
      ],
    }),

    // SMS Packages Management
    getSmsPackages: builder.query<SmsPackageResponse[], void>({
      query: () => "/api/admin/sms-packages",
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response?.items ?? [];
      },
      providesTags: [{ type: "SmsPackage", id: "LIST" }],
    }),

    getSmsPackageById: builder.query<SmsPackageResponse, string>({
      query: (id) => `/api/admin/sms-packages/${id}`,
      providesTags: (_result, _error, id) => [{ type: "SmsPackage", id }],
    }),

    createSmsPackage: builder.mutation<SmsPackageResponse, CreateSmsPackagePayload>({
      query: (payload) => ({
        url: "/api/admin/sms-packages",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "SmsPackage", id: "LIST" }],
    }),

    updateSmsPackage: builder.mutation<SmsPackageResponse, { id: string; payload: Partial<CreateSmsPackagePayload> }>({
      query: ({ id, payload }) => ({
        url: `/api/admin/sms-packages/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SmsPackage", id },
        { type: "SmsPackage", id: "LIST" },
      ],
    }),

    deleteSmsPackage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/admin/sms-packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "SmsPackage", id },
        { type: "SmsPackage", id: "LIST" },
      ],
    }),

    // NOTE: Tenant access to packages may be via /api/packages (verify with backend)
    getTenantPackages: builder.query<SmsPackageResponse[], void>({
      query: () => "/api/packages",
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response?.items ?? [];
      },
      providesTags: [{ type: "SmsPackage", id: "TENANT_LIST" }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetTenantsQuery,
  useGetTenantByIdQuery,
  useGetPendingSendersQuery,
  useApproveSenderMutation,
  useGetPendingSmsJobsQuery,
  useApproveSmsJobMutation,
  useGetSmsPackagesQuery,
  useGetSmsPackageByIdQuery,
  useCreateSmsPackageMutation,
  useUpdateSmsPackageMutation,
  useDeleteSmsPackageMutation,
  useGetTenantPackagesQuery,
  useLazyGetTenantsQuery,
  useLazyGetSmsPackagesQuery,
} = adminApi;

