import { baseApi } from "./baseApi";

// Types for Admin operations

// --- Tenants ---
export type TenantResponse = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  smsCredit: number; // int64
  smsApprovalThreshold: number; // int32
  createdAt: string; // Instant
  updatedAt: string; // Instant
};

export type UpdateTenantStatusPayload = {
  status: "ACTIVE" | "INACTIVE";
};

export type UpdateTenantThresholdPayload = {
  approvalThreshold: number;
};

// --- Senders ---
export type SenderResponse = {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "REJECTED";
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  message: string;
};

export type RejectSenderPayload = {
  reason: string;
};

// --- SMS Jobs ---
export type SmsJobResponse = {
  id: string;
  jobType: "SINGLE" | "GROUP" | "BULK";
  status: "PENDING_APPROVAL" | "SCHEDULED" | "SENDING" | "COMPLETED" | "FAILED";
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  totalRecipients: number;
  totalSmsCount: number;
  scheduledAt?: string;
  createdAt: string;
  message: string;
};

export type RejectSmsJobPayload = {
  reason: string;
};

// --- SMS Packages (Tiers) ---
export type SmsPackageTier = {
  id: string;
  minSmsCount: number;
  maxSmsCount?: number;
  pricePerSms: number;
  description?: string;
  isActive: boolean;
};

export type CreateSmsPackagePayload = {
  minSmsCount: number;
  maxSmsCount?: number;
  pricePerSms: number;
  description?: string;
  isActive: boolean;
};


// --- Transactions ---
export type TransactionResponse = {
  id: string;
  tenantId: string;
  amountPaid: number;
  smsCredited: number;
  paymentStatus: "SUCCESSFUL" | "FAILED" | "IN_PROGRESS" | "CANCELED";
  smsPackage: {
    id: string;
    minSmsCount: number;
    maxSmsCount: number;
    pricePerSms: number;
    description: string;
    isActive: boolean;
    active: boolean;
  };
  createdAt: string;
  updatedAt: string;
};

// Admin API using RTK Query (for sys_admin only)
export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- Tenants Management ---
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

    updateTenantStatus: builder.mutation<TenantResponse, { id: string; status: "ACTIVE" | "INACTIVE" }>({
      query: ({ id, status }) => ({
        url: `/api/admin/tenants/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tenant", id },
        { type: "Tenant", id: "LIST" },
      ],
    }),

    updateTenantThreshold: builder.mutation<TenantResponse, { id: string; threshold: number }>({
      query: ({ id, threshold }) => ({
        url: `/api/admin/tenants/${id}/threshold`,
        method: "PUT",
        body: { approvalThreshold: threshold },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tenant", id },
        { type: "Tenant", id: "LIST" },
      ],
    }),

    // --- Sender Approvals ---
    // Spec: /api/admin/senders/pending for the list of pending
    getPendingSenders: builder.query<SenderResponse[], void>({
      query: () => "/api/admin/senders/pending",
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response?.items ?? response?.content ?? [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Sender" as const, id })),
              { type: "Sender", id: "LIST_PENDING" },
            ]
          : [{ type: "Sender", id: "LIST_PENDING" }],
    }),

    approveSender: builder.mutation<SenderResponse, string>({
      query: (id) => ({
        url: `/api/admin/senders/${id}/approve`,
        method: "POST", 
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Sender", id },
        { type: "Sender", id: "LIST_PENDING" },
      ],
    }),

    rejectSender: builder.mutation<SenderResponse, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/api/admin/senders/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Sender", id },
        { type: "Sender", id: "LIST_PENDING" },
      ],
    }),

    // --- SMS Job Approvals ---
    // Spec: /api/admin/sms-jobs/pending
    getPendingSmsJobs: builder.query<SmsJobResponse[], void>({
      query: () => "/api/admin/sms-jobs/pending",
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response?.items ?? response?.content ?? [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "SmsJob" as const, id })),
              { type: "SmsJob", id: "LIST_PENDING" },
            ]
          : [{ type: "SmsJob", id: "LIST_PENDING" }],
    }),

    approveSmsJob: builder.mutation<SmsJobResponse, string>({
      query: (jobId) => ({
        url: `/api/admin/sms-jobs/${jobId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, jobId) => [
        { type: "SmsJob", id: jobId },
        { type: "SmsJob", id: "LIST_PENDING" },
      ],
    }),

    rejectSmsJob: builder.mutation<SmsJobResponse, { jobId: string; reason: string }>({
      query: ({ jobId, reason }) => ({
        url: `/api/admin/sms-jobs/${jobId}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { jobId }) => [
        { type: "SmsJob", id: jobId },
        { type: "SmsJob", id: "LIST_PENDING" },
      ],
    }),

    // --- SMS Packages (Tiers) ---
    getSmsPackages: builder.query<SmsPackageTier[], void>({
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

    createSmsPackage: builder.mutation<SmsPackageTier, CreateSmsPackagePayload>({
      query: (body) => ({
        url: "/api/admin/sms-packages",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SmsPackage", id: "LIST" }],
    }),

    updateSmsPackage: builder.mutation<SmsPackageTier, { id: string; body: Partial<CreateSmsPackagePayload> }>({
      query: ({ id, body }) => ({
        url: `/api/admin/sms-packages/${id}`,
        method: "PUT",
        body,
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
    invalidatesTags: [{ type: "SmsPackage", id: "LIST" }],
    }),

    // --- Transactions ---
    getAllTransactions: builder.query<
      { items: TransactionResponse[]; total: number; page: number; size: number },
      { page?: number; size?: number; status?: string; tenantId?: string }
    >({
      query: ({ page = 0, size = 20, status, tenantId }) => ({
        url: "/api/admin/payments/transactions",
        params: { page, size, status, tenantId },
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
              ...result.items.map(({ id }) => ({ type: "Payment" as const, id })),
              { type: "Payment", id: "LIST" },
            ]
          : [{ type: "Payment", id: "LIST" }],
    }),
  }),
});

// Export hooks
export const {
  useGetTenantsQuery,
  useGetTenantByIdQuery,
  useUpdateTenantStatusMutation,
  useUpdateTenantThresholdMutation,
  useGetPendingSendersQuery,
  useApproveSenderMutation,
  useRejectSenderMutation,
  useGetPendingSmsJobsQuery,
  useApproveSmsJobMutation,
  useRejectSmsJobMutation,
  useGetSmsPackagesQuery,
  useCreateSmsPackageMutation,
  useUpdateSmsPackageMutation,
  useDeleteSmsPackageMutation,
  useGetAllTransactionsQuery,
} = adminApi;
