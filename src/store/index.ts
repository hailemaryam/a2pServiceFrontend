import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authReducer from "../redux/auth/authSlice";
import { baseApi } from "../api/baseApi";
// import contactsReducer from "../redux/contacts/contactsSlice";
// import contactGroupsReducer from "./contactGroupsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // contacts: contactsReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    // contactGroups: contactGroupsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
