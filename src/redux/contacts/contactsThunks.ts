import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  contactsApi,
  ContactPayload,
  ContactResponse,
  PaginatedContacts,
} from "../../api/contactsApi";

export const fetchContacts = createAsyncThunk<
  PaginatedContacts,
  { page?: number; size?: number }
>("contacts/fetchContacts", async ({ page = 0, size = 20 }) => {
  return contactsApi.fetchContacts({ page, size });
});

export const getContactById = createAsyncThunk<ContactResponse, string>(
  "contacts/getContactById",
  async (id: string) => {
    return contactsApi.getContactById(id);
  }
);

export const createContact = createAsyncThunk<ContactResponse, ContactPayload>(
  "contacts/createContact",
  async (payload) => {
    return contactsApi.createContact(payload);
  }
);

export const updateContact = createAsyncThunk<
  ContactResponse,
  { id: string; data: ContactPayload }
>("contacts/updateContact", async ({ id, data }) => {
  return contactsApi.updateContact({ id, payload: data });
});

export const searchContactByPhone = createAsyncThunk<ContactResponse | null, string>(
  "contacts/searchContactByPhone",
  async (phone: string) => {
    return contactsApi.searchContactByPhone(phone);
  }
);

export const uploadContactsBinary = createAsyncThunk<any, { file: File; groupId?: string }>(
  "contacts/uploadContactsBinary",
  async ({ file, groupId }) => {
    return contactsApi.uploadContactsBinary(file, groupId);
  }
);

export const uploadContactsMultipart = createAsyncThunk<
  any,
  { file: File; groupId?: string }
>("contacts/uploadContactsMultipart", async ({ file, groupId }) => {
  return contactsApi.uploadContactsMultipart(file, groupId);
});



