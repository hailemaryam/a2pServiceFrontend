import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  contactsApi,
  ContactPayload,
  ContactResponse,
  PaginatedContacts,
} from "../../api/contactsApi";
import { store } from "../store";

export const fetchContacts = createAsyncThunk<
  PaginatedContacts,
  { page?: number; size?: number }
>("contacts/fetchContacts", async ({ page = 0, size = 20 }) => {
  const result = await store.dispatch(
    contactsApi.endpoints.fetchContacts.initiate({ page, size })
  );
  if ("data" in result && result.data != null) {
    return result.data as PaginatedContacts;
  }
  throw new Error("Failed to fetch contacts");
});

export const getContactById = createAsyncThunk<ContactResponse, string>(
  "contacts/getContactById",
  async (id: string) => {
    const result = await store.dispatch(
      contactsApi.endpoints.getContactById.initiate(id)
    );
    if ("data" in result && result.data != null) {
      return result.data as ContactResponse;
    }
    throw new Error("Failed to get contact");
  }
);

export const createContact = createAsyncThunk<ContactResponse, ContactPayload>(
  "contacts/createContact",
  async (payload) => {
    const result = await store.dispatch(
      contactsApi.endpoints.createContact.initiate(payload)
    );
    if ("data" in result && result.data != null) {
      return result.data;
    }
    throw new Error("Failed to create contact");
  }
);

export const updateContact = createAsyncThunk<
  ContactResponse,
  { id: string; data: ContactPayload }
>(
  "contacts/updateContact",
  async ({ id, data }) => {
    const result = await store.dispatch(
      contactsApi.endpoints.updateContact.initiate({ id, payload: data })
    );
    if ("data" in result && result.data != null) {
      return result.data;
    }
    throw new Error("Failed to update contact");
  }
);

export const searchContactByPhone = createAsyncThunk<ContactResponse | null, string>(
  "contacts/searchContactByPhone",
  async (phone: string) => {
    const result = await store.dispatch(
      contactsApi.endpoints.searchContactByPhone.initiate(phone)
    );
    if ("data" in result && result.data != null) {
      return result.data as ContactResponse;
    }
    return null;
  }
);

export const uploadContactsBinary = createAsyncThunk<any, { file: File; groupId?: string }>(
  "contacts/uploadContactsBinary",
  async ({ file, groupId }) => {
    const result = await store.dispatch(
      contactsApi.endpoints.uploadContactsBinary.initiate({ file, groupId })
    );
    if ("data" in result && result.data != null) {
      return result.data;
    }
    throw new Error("Failed to upload contacts");
  }
);

export const uploadContactsMultipart = createAsyncThunk<
  any,
  { file: File; groupId?: string }
>(
  "contacts/uploadContactsMultipart",
  async ({ file, groupId }) => {
    const result = await store.dispatch(
      contactsApi.endpoints.uploadContactsMultipart.initiate({ file, groupId })
    );
    if ("data" in result && result.data != null) {
      return result.data;
    }
    throw new Error("Failed to upload contacts");
  }
);




