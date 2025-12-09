import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axios';

export interface Contact {
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  phone?: string;
  name?: string;
  email?: string;
}

interface ContactsState {
  items: Contact[];
  total: number;
  page: number;
  size: number;
  status: 'idle' | 'loading' | 'failed';
  error?: string | null;
}

const initialState: ContactsState = {
  items: [],
  total: 0,
  page: 0,
  size: 20,
  status: 'idle',
  error: null,
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async ({ page = 0, size = 20 }: { page?: number; size?: number }) => {
    const resp = await api.get('/api/contacts', { params: { page, size } });
    return resp.data;
  }
);

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (payload: Contact) => {
    const resp = await api.post('/api/contacts', payload);
    return resp.data;
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ id, payload }: { id: string; payload: Contact }) => {
    const resp = await api.put(`/api/contacts/${id}`, payload);
    return resp.data;
  }
);

export const getContactById = createAsyncThunk(
  'contacts/getContactById',
  async (id: string) => {
    const resp = await api.get(`/api/contacts/${id}`);
    return resp.data;
  }
);

export const searchContactByPhone = createAsyncThunk(
  'contacts/searchContactByPhone',
  async (phone: string) => {
    const resp = await api.get('/api/contacts/search/by-phone', { params: { phone } });
    return resp.data;
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContacts.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'idle';
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 0;
        state.size = action.payload.size || state.size;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch contacts';
      })
      .addCase(createContact.fulfilled, (state, action: PayloadAction<Contact>) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateContact.fulfilled, (state, action: PayloadAction<Contact>) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      });
  },
});

export default contactsSlice.reducer;
