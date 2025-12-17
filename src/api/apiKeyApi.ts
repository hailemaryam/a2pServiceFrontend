import { baseApi } from "./baseApi";

// Types for API Key operations
export type ApiKeyResponse = {
  id: string;
  key: string; // May be masked or shown only once
  name?: string;
  createdAt: string;
  lastUsedAt?: string;
  isActive: boolean;
  [key: string]: any;
};

export type CreateApiKeyPayload = {
  name?: string;
  // Add other fields based on backend requirements
};

// API Key API using RTK Query
export const apiKeyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all API keys for current tenant
    getApiKeys: builder.query<ApiKeyResponse[], void>({
      query: () => "/api/api-keys",
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response?.items ?? response?.content ?? [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "ApiKey" as const, id })),
              { type: "ApiKey", id: "LIST" },
            ]
          : [{ type: "ApiKey", id: "LIST" }],
    }),

    // Get API key by ID
    getApiKeyById: builder.query<ApiKeyResponse, string>({
      query: (id) => `/api/api-keys/${id}`,
      providesTags: (_result, _error, id) => [{ type: "ApiKey", id }],
    }),

    // Create new API key
    createApiKey: builder.mutation<ApiKeyResponse, CreateApiKeyPayload>({
      query: (payload) => ({
        url: "/api/api-keys",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "ApiKey", id: "LIST" }],
    }),

    // Revoke/delete API key
    revokeApiKey: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/api-keys/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ApiKey", id },
        { type: "ApiKey", id: "LIST" },
      ],
    }),

    // Update API key (e.g., change name, toggle active)
    updateApiKey: builder.mutation<ApiKeyResponse, { id: string; payload: Partial<CreateApiKeyPayload & { isActive?: boolean }> }>({
      query: ({ id, payload }) => ({
        url: `/api/api-keys/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ApiKey", id },
        { type: "ApiKey", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetApiKeysQuery,
  useGetApiKeyByIdQuery,
  useCreateApiKeyMutation,
  useRevokeApiKeyMutation,
  useUpdateApiKeyMutation,
  useLazyGetApiKeysQuery,
} = apiKeyApi;

