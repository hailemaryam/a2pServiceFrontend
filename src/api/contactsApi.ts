import { baseApi } from "./baseApi";

export type ContactPayload = {
  id?: string | null;
  phone?: string | null;
  name?: string | null;
  email?: string | null;
};

export type ContactResponse = {
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
  id: string;
  phone: string;
  name?: string | null;
  email?: string | null;
};

export type PaginatedContacts = {
  items: ContactResponse[];
  total: number;
  page: number;
  size: number;
};

const sanitizeContactPayload = (payload: ContactPayload): ContactPayload => {
  const base: ContactPayload = {
    id: payload.id ?? null,
    phone: payload.phone ?? null,
    name: payload.name ?? null,
    email: payload.email ?? null,
  };
  return base;
};

// Contacts API using RTK Query
export const contactsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch paginated contacts
    fetchContacts: builder.query<
      PaginatedContacts,
      { page?: number; size?: number; query?: string } | void
    >({
      query: (params) => ({
        url: "/api/contacts",
        params: params || { page: 0, size: 20 },
      }),
      transformResponse: (response: any, _meta, arg) => {
        return {
          items: response?.items ?? response?.content ?? [],
          total: response?.total ?? response?.totalElements ?? 0,
          page:
            response?.page ??
            response?.pageNumber ??
            (typeof arg === "object" ? arg?.page : 0) ??
            0,
          size:
            response?.size ??
            response?.pageSize ??
            (typeof arg === "object" ? arg?.size : 20) ??
            20,
        };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: "Contact" as const, id })),
            { type: "Contact", id: "LIST" },
          ]
          : [{ type: "Contact", id: "LIST" }],
    }),

    // Get contact by ID
    getContactById: builder.query<ContactResponse, string>({
      query: (id) => `/api/contacts/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Contact", id }],
    }),

    // Create contact
    createContact: builder.mutation<ContactResponse, ContactPayload>({
      query: (payload) => {
        const body = sanitizeContactPayload(payload);
        return {
          url: "/api/contacts",
          method: "POST",
          body,
          headers: { "Content-Type": "application/json" },
        };
      },
      invalidatesTags: [{ type: "Contact", id: "LIST" }],
    }),

    // Update contact
    updateContact: builder.mutation<
      ContactResponse,
      { id: string; payload: ContactPayload }
    >({
      query: ({ id, payload }) => {
        const body = sanitizeContactPayload(payload);
        return {
          url: `/api/contacts/${id}`,
          method: "PUT",
          body,
          headers: { "Content-Type": "application/json" },
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Contact", id },
        { type: "Contact", id: "LIST" },
      ],
    }),

    // Search contact by phone
    searchContactByPhone: builder.query<ContactResponse | null, string>({
      query: (phone) => ({
        url: "/api/contacts/search/by-phone",
        params: { phone },
      }),
      transformResponse: (response: any) => response ?? null,
    }),



    // Upload contacts (multipart)
    uploadContactsMultipart: builder.mutation<
      any,
      { file: File; groupId?: string }
    >({
      query: ({ file, groupId }) => {
        const formData = new FormData();
        formData.append("file", file);
        if (groupId) {
          formData.append("groupId", groupId);
        }
        return {
          url: "/api/contacts/upload-file",
          method: "POST",
          body: formData,
          // Don't set Content-Type header for FormData, browser will set it with boundary
        };
      },
      invalidatesTags: [{ type: "Contact", id: "LIST" }],
    }),


    // Fetch contacts by group ID
    fetchContactsByGroupId: builder.query<
      PaginatedContacts,
      { groupId: string; page?: number; size?: number; query?: string }
    >({
      query: ({ groupId, ...params }) => ({
        url: `/api/contacts/group/${groupId}`,
        params: params || { page: 0, size: 20 },
      }),
      transformResponse: (response: any, _meta, arg) => {
        return {
          items: response?.items ?? response?.content ?? [],
          total: response?.total ?? response?.totalElements ?? 0,
          page:
            response?.page ??
            response?.pageNumber ??
            arg?.page ??
            0,
          size:
            response?.size ??
            response?.pageSize ??
            arg?.size ??
            20,
        };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: "Contact" as const, id })),
            { type: "Contact", id: "GRP_LIST" },
          ]
          : [{ type: "Contact", id: "GRP_LIST" }],
    }),

    // Delete contact
    deleteContact: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Contact", id },
        { type: "Contact", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useFetchContactsQuery,
  useGetContactByIdQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useSearchContactByPhoneQuery,
  useUploadContactsMultipartMutation,
  useFetchContactsByGroupIdQuery,
  useLazyFetchContactsQuery,
  useLazySearchContactByPhoneQuery,
} = contactsApi;

export { sanitizeContactPayload };
