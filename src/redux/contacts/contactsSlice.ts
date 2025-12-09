import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createContact,
  fetchContacts,
  getContactById,
  searchContactByPhone,
  updateContact,
  uploadContactsBinary,
  uploadContactsMultipart,
} from "./contactsThunks";
import { ContactResponse } from "../../api/contactsApi";

export type ContactsState = {
  items: ContactResponse[];
  total: number;
  page: number;
  size: number;
  loading: boolean;
  error: string | null;
  selectedContact: ContactResponse | null;
};

const initialState: ContactsState = {
  items: [],
  total: 0,
  page: 0,
  size: 20,
  loading: false,
  error: null,
  selectedContact: null,
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchContacts.fulfilled,
        (
          state,
          action: PayloadAction<{
            items: ContactResponse[];
            total: number;
            page: number;
            size: number;
          }>
        ) => {
          state.loading = false;
          state.items = action.payload.items;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.size = action.payload.size;
        }
      )
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch contacts";
      })
      .addCase(getContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContactById.fulfilled, (state, action: PayloadAction<ContactResponse>) => {
        state.loading = false;
        state.selectedContact = action.payload;
      })
      .addCase(getContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load contact";
      })
      .addCase(createContact.fulfilled, (state, action: PayloadAction<ContactResponse>) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateContact.fulfilled, (state, action: PayloadAction<ContactResponse>) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) {
          state.items[idx] = action.payload;
        }
        if (state.selectedContact?.id === action.payload.id) {
          state.selectedContact = action.payload;
        }
      })
      .addCase(searchContactByPhone.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedContact = action.payload;
        }
      })
      .addCase(uploadContactsBinary.rejected, (state, action) => {
        state.error = action.error.message || "Binary upload failed";
      })
      .addCase(uploadContactsMultipart.rejected, (state, action) => {
        state.error = action.error.message || "Multipart upload failed";
      });
  },
});

export default contactsSlice.reducer;



