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

export type SmsResponse = {
  id: string;
  status: string;
  message?: string;
  phoneNumber?: string;
  sentAt?: string;
  [key: string]: any;
};

export type SmsJobResponse = {
  id: string;
  status: string;
  senderId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  totalRecipients?: number;
  successCount?: number;
  failureCount?: number;
  [key: string]: any;
};

// SMS API using RTK Query
export const smsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Send single SMS
    sendSingleSms: builder.mutation<SmsResponse, SingleSmsPayload>({
      query: (payload) => ({
        url: "/api/sms/single",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Sms", id: "LIST" }],
    }),

    // Send group SMS
    sendGroupSms: builder.mutation<SmsResponse, GroupSmsPayload>({
      query: (payload) => ({
        url: "/api/sms/group",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Sms", id: "LIST" }],
    }),

    // Send bulk SMS (multipart file upload)
    sendBulkSms: builder.mutation<SmsResponse, BulkSmsPayload>({
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

    // NOTE: SMS History endpoint (GET /api/sms/jobs) does not exist for Tenants
    // This endpoint is Admin-only. Tenant users should not use this.
    // If needed for tenants, backend must provide a separate endpoint like /api/sms/history
  }),
});

// Export hooks for usage in functional components
export const {
  useSendSingleSmsMutation,
  useSendGroupSmsMutation,
  useSendBulkSmsMutation,
} = smsApi;

