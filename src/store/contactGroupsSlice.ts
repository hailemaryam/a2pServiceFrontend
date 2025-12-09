import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axios';

export interface ContactGroup {
  id?: string;
  name?: string;
  description?: string;
}

interface ContactGroupsState {
  items: ContactGroup[];
  total: number;
  page: number;
  size: number;
  status: 'idle' | 'loading' | 'failed';
  error?: string | null;
}

const initialState: ContactGroupsState = {
  items: [],
  total: 0,
  page: 0,
  size: 20,
  status: 'idle',
  error: null,
};

export const fetchContactGroups = createAsyncThunk(
  'contactGroups/fetch',
  async ({ page = 0, size = 20 }: { page?: number; size?: number }) => {
    const resp = await api.get('/api/contact-groups', { params: { page, size } });
    return resp.data;
  }
);

export const createContactGroup = createAsyncThunk(
  'contactGroups/create',
  async (payload: ContactGroup) => {
    const resp = await api.post('/api/contact-groups', payload);
    return resp.data;
  }
);

const contactGroupsSlice = createSlice({
  name: 'contactGroups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactGroups.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContactGroups.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'idle';
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 0;
        state.size = action.payload.size || state.size;
      })
      .addCase(fetchContactGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch contact groups';
      })
      .addCase(createContactGroup.fulfilled, (state, action: PayloadAction<ContactGroup>) => {
        state.items.unshift(action.payload);
        state.total += 1;
      });
  },
});

export default contactGroupsSlice.reducer;
