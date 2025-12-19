import { baseApi } from "./baseApi";

// Types for API Key operations
export type ApiKeyResponse = {
  id: string;
  senderId: string;
  senderName: string;
  apiKey: string;
  name: string;
  createdAt: string;
};

export type CreateApiKeyPayload = {
  senderId: string;
  name?: string;
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

    // Get API key by ID - Not in spec (only DELETE /api/api-keys/{id} and GET /api/api-keys list)
    // Actually spec has NO get by ID endpoint. Removing it.
    
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

    // Update API key - Not in spec
  }),
});

// Export hooks for usage in functional components
export const {
  useGetApiKeysQuery,
  useCreateApiKeyMutation,
  useRevokeApiKeyMutation,
  useLazyGetApiKeysQuery,
} = apiKeyApi;

