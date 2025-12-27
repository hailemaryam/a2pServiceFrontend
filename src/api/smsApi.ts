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
  message: string;
};



// SMS API using RTK Query
export const smsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Send single SMS
    sendSingleSms: builder.mutation<SmsJobResponse, SingleSmsPayload & { apiKey: string }>({
      query: ({ apiKey, phoneNumber, message, scheduledAt }) => ({
        url: "/api/p/sms/send",
        method: "POST",
        headers: {
          "API-Key": apiKey,
        },
        body: {
          to: phoneNumber,
          message,
          scheduledAt,
          // senderId is inferred from API Key by backend, or ignored
        },
      }),
      invalidatesTags: [{ type: "Sms", id: "LIST" }],
    }),

    // Send group SMS
    sendGroupSms: builder.mutation<SmsJobResponse, GroupSmsPayload>({
      query: (payload) => ({
        url: "/api/sms/group",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Sms", id: "LIST" }],
    }),

    // Send bulk SMS (multipart file upload)
    sendBulkSms: builder.mutation<SmsJobResponse, BulkSmsPayload>({
      query: ({ file, senderId, message, scheduledAt }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("senderId", senderId);
        formData.append("message", message);
        if (scheduledAt) {
          formData.append("scheduledAt", scheduledAt);
        }
        return {
          url: "/api/sms/bulk",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Sms", id: "LIST" }],
    }),


    // Get SMS Jobs (Tenant)
    getSmsJobs: builder.query<
      { items: SmsJobResponse[]; total: number; page: number; size: number },
      { page?: number; size?: number }
    >({
      query: ({ page = 0, size = 20 }) => ({
          url: "/api/sms",
          params: { page, size },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Sms" as const, id })),
              { type: "Sms", id: "LIST" },
            ]
          : [{ type: "Sms", id: "LIST" }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useSendSingleSmsMutation,
  useSendGroupSmsMutation,
  useSendBulkSmsMutation,
  useGetSmsJobsQuery,

} = smsApi;

