import { baseApi } from "./baseApi";

// Types for Payment operations
export type InitializePaymentPayload = {
  amount: number;
  // Add other fields based on backend requirements (e.g., currency, description)
};

export type PaymentResponse = {
  id: string;
  status: string;
  amount: number;
  currency?: string;
  transactionId?: string;
  checkoutUrl?: string; // For Chapa redirect
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
};

export type TransactionResponse = {
  id: string;
  amount: number;
  status: string;
  type?: string;
  description?: string;
  transactionId?: string;
  createdAt: string;
  [key: string]: any;
};

// Payment API using RTK Query
export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Initialize payment (Chapa integration)
    initializePayment: builder.mutation<PaymentResponse, InitializePaymentPayload>({
      query: (payload) => ({
        url: "/api/payments/initialize",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Payment", id: "LIST" }],
    }),

    // Verify payment status
    verifyPayment: builder.query<PaymentResponse, string>({
      query: (paymentId) => `/api/payments/verify/${paymentId}`,
      providesTags: (_result, _error, id) => [{ type: "Payment", id }],
    }),

    // Get payment history/transactions
    getTransactions: builder.query<
      { items: TransactionResponse[]; total: number; page: number; size: number },
      { page?: number; size?: number }
    >({
      query: ({ page = 0, size = 20 }) => ({
        url: "/api/payments/transactions",
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
              ...result.items.map(({ id }) => ({ type: "Payment" as const, id })),
              { type: "Payment", id: "LIST" },
            ]
          : [{ type: "Payment", id: "LIST" }],
    }),

    // Get single transaction by ID
    getTransactionById: builder.query<TransactionResponse, string>({
      query: (id) => `/api/payments/transactions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Payment", id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useInitializePaymentMutation,
  useVerifyPaymentQuery,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useLazyGetTransactionsQuery,
  useLazyVerifyPaymentQuery,
} = paymentApi;

