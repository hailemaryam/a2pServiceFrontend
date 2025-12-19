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

export type PaginatedSmsJobs = {
  items: SmsJobResponse[];
  total: number;
  page: number;
  size: number;
};

export type ReceivedSmsResponse = {
  id: string;
  sender: string;
  recipient: string;
  message: string;
  receivedAt: string;
};

export type PaginatedReceivedSms = {
  items: ReceivedSmsResponse[];
  total: number;
  page: number;
  size: number;
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

    // Get SMS History (Jobs)
    getSmsJobs: builder.query<PaginatedSmsJobs, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => ({
        url: "/api/sms/jobs",
        params: { page, size },
      }),
      transformResponse: (response: any, _meta, arg) => {
        return {
          items: response?.items ?? response?.content ?? [],
          total: response?.total ?? response?.totalElements ?? 0,
          page: response?.page ?? response?.pageNumber ?? arg.page ?? 0,
          size: response?.size ?? response?.pageSize ?? arg.size ?? 10,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "SmsJob" as const, id })),
              { type: "SmsJob", id: "LIST" },
            ]
          : [{ type: "SmsJob", id: "LIST" }],
    }),

    // Get Received SMS
    getReceivedSms: builder.query<PaginatedReceivedSms, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => ({
        url: "/api/sms/received",
        params: { page, size },
      }),
      transformResponse: (response: any, _meta, arg) => {
        return {
          items: response?.items ?? response?.content ?? [],
          total: response?.total ?? response?.totalElements ?? 0,
          page: response?.page ?? response?.pageNumber ?? arg.page ?? 0,
          size: response?.size ?? response?.pageSize ?? arg.size ?? 10,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Sms" as const, id })),
              { type: "Sms", id: "RECEIVED_LIST" },
            ]
          : [{ type: "Sms", id: "RECEIVED_LIST" }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useSendSingleSmsMutation,
  useSendGroupSmsMutation,
  useSendBulkSmsMutation,
  useGetSmsJobsQuery,
  useGetReceivedSmsQuery,
} = smsApi;

