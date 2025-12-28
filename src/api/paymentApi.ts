import { baseApi } from "./baseApi";

// Types for Payment operations
// Types for Payment operations
export type InitializePaymentPayload = {
  amount: number;
  returnUrl?: string;
};

export type PaymentResponse = {
  checkoutUrl: string;
  transactionId: string;
  smsCredits: number;
};

export type PaymentTransaction = {
  id: string;
  tenantId: string;
  amountPaid: number;
  smsCredited: number;
  paymentStatus: "SUCCESSFUL" | "FAILED" | "IN_PROGRESS" | "CANCELED";
  smsPackage?: {
    id: string;
    minSmsCount: number;
    maxSmsCount?: number;
    pricePerSms: number;
    description?: string;
    isActive: boolean;
  };
  createdAt: string;
  updatedAt: string;
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

    // Get payment history/transactions
    getTransactions: builder.query<
      { items: PaymentTransaction[]; total: number; page: number; size: number },
      { page?: number; size?: number; status?: string }
    >({
      query: ({ page = 0, size = 20, status }) => ({
        url: "/api/payments/transactions",
        params: { page, size, status },
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
    getTransactionById: builder.query<PaymentTransaction, string>({
      query: (id) => `/api/payments/transactions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Payment", id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useInitializePaymentMutation,
  useGetTransactionsQuery,
  useLazyGetTransactionsQuery,
  useGetTransactionByIdQuery,
} = paymentApi;

