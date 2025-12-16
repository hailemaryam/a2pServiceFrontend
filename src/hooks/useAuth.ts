import { useKeycloak } from "@react-keycloak/web";
import { useAppSelector } from "../store";

/**
 * Custom hook that provides authentication state and user roles
 * Centralizes access to authentication information from both Keycloak and Redux
 */
export const useAuth = () => {
  const { keycloak } = useKeycloak();
  const authState = useAppSelector((state) => state.auth);

  // Get roles from Keycloak token (source of truth)
  const roles = keycloak.tokenParsed?.realm_access?.roles || authState.roles || [];
  
  // Check if user is authenticated
  const isAuthenticated = keycloak.authenticated || authState.authenticated;

  // Helper functions to check specific roles
  const isSysAdmin = roles.includes("sys_admin");
  const isTenantAdmin = roles.includes("tenant_admin");
  const isTenantUser = roles.includes("tenant_user");
  const isTenantRole = isTenantAdmin || isTenantUser;

  return {
    isAuthenticated,
    roles,
    isSysAdmin,
    isTenantAdmin,
    isTenantUser,
    isTenantRole,
    keycloak,
    username: authState.username || keycloak.tokenParsed?.preferred_username || null,
    token: authState.token || keycloak.token || null,
  };
};



