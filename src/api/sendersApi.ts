import { baseApi } from "./baseApi";

// Types for Sender ID operations
// Types for Sender ID operations
export type SenderResponse = {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "REJECTED";
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  message: string;
};

export type CreateSenderPayload = {
  name: string;
};

export type PaginatedSenders = {
  items: SenderResponse[];
  total: number;
  page: number;
  size: number;
};

// Senders API using RTK Query
export const sendersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get paginated sender IDs for current tenant
    getSenders: builder.query<
      PaginatedSenders,
      { page?: number; size?: number; query?: string } | void
    >({
      query: (params) => ({
        url: "/api/senders",
        params: params || { page: 0, size: 20 },
      }),
      transformResponse: (response: any, _meta, arg) => {
        const items = Array.isArray(response)
          ? response
          : response?.items ?? response?.content ?? [];
        const total = response?.total ?? response?.totalElements ?? items.length;
        const page =
          response?.page ??
          response?.pageNumber ??
          (typeof arg === "object" ? arg?.page : 0) ??
          0;
        const size =
          response?.size ??
          response?.pageSize ??
          (typeof arg === "object" ? arg?.size : 20) ??
          20;

        return {
          items,
          total,
          page,
          size,
        };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: "Sender" as const, id })),
            { type: "Sender", id: "LIST" },
          ]
          : [{ type: "Sender", id: "LIST" }],
    }),

    // Get sender by ID
    getSenderById: builder.query<SenderResponse, string>({
      query: (id) => `/api/senders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Sender", id }],
    }),

    // Create new sender ID request
    createSender: builder.mutation<SenderResponse, CreateSenderPayload>({
      query: (payload) => ({
        url: "/api/senders",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Sender", id: "LIST" }],
    }),

    // Update sender (e.g., resubmit for approval)
    updateSender: builder.mutation<SenderResponse, { id: string; payload: Partial<CreateSenderPayload> }>({
      query: ({ id, payload }) => ({
        url: `/api/senders/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Sender", id },
        { type: "Sender", id: "LIST" },
      ],
    }),

    // Delete sender
    deleteSender: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/senders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Sender", id },
        { type: "Sender", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetSendersQuery,
  useGetSenderByIdQuery,
  useCreateSenderMutation,
  useUpdateSenderMutation,
  useDeleteSenderMutation,
  useLazyGetSendersQuery,
} = sendersApi;

