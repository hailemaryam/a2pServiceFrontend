import { baseApi } from "./baseApi";

// Types for Contact Group operations
export type ContactGroupResponse = {
  id: string;
  name: string;
  description?: string;
  contactCount?: number;
  createdAt: string;
  updatedAt?: string;
  [key: string]: any;
};

export type CreateContactGroupPayload = {
  name: string;
  description?: string;
};

export type PaginatedContactGroups = {
  items: ContactGroupResponse[];
  total: number;
  page: number;
  size: number;
};

// Contact Groups API using RTK Query
export const contactGroupsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get paginated contact groups
    getContactGroups: builder.query<
      PaginatedContactGroups,
      { page?: number; size?: number; query?: string } | void
    >({
      query: (params) => ({
        url: "/api/contact-groups",
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
            ...result.items.map(({ id }) => ({
              type: "ContactGroup" as const,
              id,
            })),
            { type: "ContactGroup", id: "LIST" },
          ]
          : [{ type: "ContactGroup", id: "LIST" }],
    }),

    // Get contact group by ID
    getContactGroupById: builder.query<ContactGroupResponse, string>({
      query: (id) => `/api/contact-groups/${id}`,
      providesTags: (_result, _error, id) => [{ type: "ContactGroup", id }],
    }),

    // Create contact group
    createContactGroup: builder.mutation<ContactGroupResponse, CreateContactGroupPayload>({
      query: (payload) => ({
        url: "/api/contact-groups",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "ContactGroup", id: "LIST" }],
    }),

    // Update contact group
    updateContactGroup: builder.mutation<
      ContactGroupResponse,
      { id: string; payload: Partial<CreateContactGroupPayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/api/contact-groups/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ContactGroup", id },
        { type: "ContactGroup", id: "LIST" },
      ],
    }),

    // Delete contact group
    deleteContactGroup: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/contact-groups/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ContactGroup", id },
        { type: "ContactGroup", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetContactGroupsQuery,
  useGetContactGroupByIdQuery,
  useCreateContactGroupMutation,
  useUpdateContactGroupMutation,
  useDeleteContactGroupMutation,
  useLazyGetContactGroupsQuery,
} = contactGroupsApi;

