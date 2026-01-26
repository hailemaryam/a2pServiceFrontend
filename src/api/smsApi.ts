import { baseApi } from "./baseApi";

// Types for SMS operations
export type SingleSmsPayload = {
  senderId: string;
  phoneNumber: string;
  message: string;
  scheduledAt?: string; // ISO 8601 datetime string for scheduled SMS
};

export type GroupSmsPayload = {
  senderId: string;
  groupId: string;
  message: string;
  scheduledAt?: string; // ISO 8601 datetime string for scheduled SMS
};

export type BulkSmsPayload = {
  senderId: string;
  message: string;
  file: File;
  scheduledAt?: string; // ISO 8601 datetime string for scheduled SMS
};

export type SmsJobResponse = {
  id: string;
  jobType: "SINGLE" | "GROUP" | "BULK";
  status: "PENDING_APPROVAL" | "SCHEDULED" | "SENDING" | "COMPLETED" | "FAILED";
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  totalRecipients: number;
  totalSmsCount: number;
  scheduledAt?: string;
  createdAt: string;
  messageContent: string;
};

export type SmsRecipientResponse = {
  id: string;
  senderId: string;
  job: SmsJobResponse;
  phoneNumber: string;
  message: string;
  webhookUrl?: string;
  messageType: "ENGLISH" | "UNICODE";
  status: "PENDING" | "SENT" | "DELIVERED" | "FAILED" | "QUEUED";
  retryCount: number;
  sentAt?: string;
};

// SMS API using RTK Query
export const smsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Send single SMS
    sendSingleSms: builder.mutation<SmsJobResponse, SingleSmsPayload>({
      query: (payload) => ({
        url: "/api/sms/single",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "SmsJob", id: "LIST" }],
    }),

    // Send group SMS
    sendGroupSms: builder.mutation<SmsJobResponse, GroupSmsPayload>({
      query: (payload) => ({
        url: "/api/sms/group",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "SmsJob", id: "LIST" }],
    }),

    // Send bulk SMS (multipart file upload)
    sendBulkSms: builder.mutation<SmsJobResponse, BulkSmsPayload>({
      query: ({ file, senderId, message, scheduledAt }) => {
        const formData = new FormData();
        formData.append("senderId", senderId);
        formData.append("message", message);
        if (scheduledAt) {
          formData.append("scheduledAt", scheduledAt);
        }
        formData.append("file", file, file.name);
        return {
          url: "/api/sms/bulk",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "SmsJob", id: "LIST" }],
    }),


    // Get SMS Jobs (Tenant)
    getSmsJobs: builder.query<
      { items: SmsJobResponse[]; total: number; page: number; size: number },
      { page?: number; size?: number; status?: string }
    >({
      query: ({ page = 0, size = 20, status }) => ({
        url: "/api/sms",
        params: { page, size, status },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: "SmsJob" as const, id })),
            { type: "SmsJob", id: "LIST" },
          ]
          : [{ type: "SmsJob", id: "LIST" }],
    }),

    // Get SMS Job Recipients
    getSmsJobRecipients: builder.query<
      { items: SmsRecipientResponse[]; total: number; page: number; size: number },
      { jobId: string; page?: number; size?: number; search?: string }
    >({
      query: ({ jobId, page = 0, size = 20, search }) => ({
        url: `/api/sms/${jobId}/recipients`,
        params: { page, size, search },
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useSendSingleSmsMutation,
  useSendGroupSmsMutation,
  useSendBulkSmsMutation,
  useGetSmsJobsQuery,
  useGetSmsJobRecipientsQuery,
} = smsApi;

