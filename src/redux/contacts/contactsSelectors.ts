import { RootState } from "../store";

export const selectContactsState = (state: RootState) => state.contacts;
export const selectContacts = (state: RootState) => state.contacts.items;
export const selectContactsLoading = (state: RootState) => state.contacts.loading;
export const selectContactsError = (state: RootState) => state.contacts.error;
export const selectSelectedContact = (state: RootState) => state.contacts.selectedContact;



