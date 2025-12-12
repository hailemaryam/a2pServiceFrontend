import axiosInstance from "./axiosInstance";

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

export const contactsApi = {
  fetchContacts: async ({
    page = 0,
    size = 20,
  }: {
    page?: number;
    size?: number;
  }): Promise<PaginatedContacts> => {
    const { data } = await axiosInstance.get("/api/contacts", {
      params: { page, size },
    });
    return {
      items: data?.items ?? data?.content ?? [],
      total: data?.total ?? data?.totalElements ?? 0,
      page: data?.page ?? data?.pageNumber ?? page,
      size: data?.size ?? data?.pageSize ?? size,
    };
  },

  getContactById: async (id: string): Promise<ContactResponse> => {
    const { data } = await axiosInstance.get(`/api/contacts/${id}`);
    return data;
  },

  createContact: async (payload: ContactPayload): Promise<ContactResponse> => {
    const body = sanitizeContactPayload(payload);
    const { data } = await axiosInstance.post("/api/contacts", body, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  updateContact: async ({
    id,
    payload,
  }: {
    id: string;
    payload: ContactPayload;
  }): Promise<ContactResponse> => {
    const body = sanitizeContactPayload(payload);
    const { data } = await axiosInstance.put(`/api/contacts/${id}`, body, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  searchContactByPhone: async (phone: string): Promise<ContactResponse | null> => {
    const { data } = await axiosInstance.get("/api/contacts/search/by-phone", {
      params: { phone },
    });
    return data ?? null;
  },

  uploadContactsBinary: async (
    file: File,
    groupId?: string
  ): Promise<any> => {
    const buffer = await file.arrayBuffer();
    const { data } = await axiosInstance.post("/api/contacts/upload", buffer, {
      headers: { "Content-Type": "application/octet-stream" },
      params: groupId ? { groupId } : undefined,
    });
    return data;
  },

  uploadContactsMultipart: async (
    file: File,
    groupId?: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    if (groupId) {
      formData.append("groupId", groupId);
    }
    const { data } = await axiosInstance.post(
      "/api/contacts/upload-file",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  },
};

export { sanitizeContactPayload };




