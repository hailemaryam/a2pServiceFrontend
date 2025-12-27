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

// Contact Groups API using RTK Query
export const contactGroupsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all contact groups
    getContactGroups: builder.query<ContactGroupResponse[], void>({
      query: () => "/api/contact-groups",
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response?.items ?? response?.content ?? [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "ContactGroup" as const, id })),
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

