import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { keycloak } from "../../api/keycloak";

export type AuthState = {
  username: string | null;
  roles: string[];
  token: string | null;
  tokenParsed: any | null;
  authenticated: boolean;
};

const initialState: AuthState = {
  username: null,
  roles: [],
  token: null,
  tokenParsed: null,
  authenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthFromKeycloak: (
      state,
      action: PayloadAction<{
        username: string | null;
        roles: string[];
        token: string | null;
        tokenParsed: any | null;
        authenticated: boolean;
      }>
    ) => {
      state.username = action.payload.username;
      state.roles = action.payload.roles;
      state.token = action.payload.token;
      state.tokenParsed = action.payload.tokenParsed;
      state.authenticated = action.payload.authenticated;
    },
    clearAuth: (state) => {
      state.username = null;
      state.roles = [];
      state.token = null;
      state.tokenParsed = null;
      state.authenticated = false;
    },
  },
});

export const { setAuthFromKeycloak, clearAuth } = authSlice.actions;
export default authSlice.reducer;

export const buildAuthPayloadFromKeycloak = () => {
  const username = keycloak.tokenParsed?.preferred_username ?? null;
  const roles =
    (keycloak.tokenParsed?.realm_access?.roles as string[] | undefined) ?? [];
  return {
    username,
    roles,
    token: keycloak.token ?? null,
    tokenParsed: keycloak.tokenParsed ?? null,
    authenticated: Boolean(keycloak.authenticated),
  };
};



