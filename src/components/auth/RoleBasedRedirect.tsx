import { useEffect } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useKeycloak } from "@react-keycloak/web";
import { registerTenant } from "../../api/tenantApi";

/**
 * Component that handles role-based redirection after authentication
 * Also handles tenant registration for tenant users
 */
export default function RoleBasedRedirect() {
  const { isAuthenticated, isSysAdmin, isTenantRole } = useAuth();
  const { keycloak } = useKeycloak();

  useEffect(() => {
    const handleTenantRegistration = async () => {
      // Only register tenant for tenant users, not sys_admin
      if (isAuthenticated && isTenantRole && !isSysAdmin) {
        // Check if we've already attempted registration (prevent duplicate calls)
        const registrationKey = `tenant_registered_${keycloak.tokenParsed?.sub}`;
        const hasRegistered = sessionStorage.getItem(registrationKey);

        if (!hasRegistered) {
          try {
            const result = await registerTenant();
            if (result.success) {
              // Mark as registered to prevent duplicate calls
              sessionStorage.setItem(registrationKey, "true");
              console.log("Tenant registration successful");
            } else {
              console.error("Tenant registration failed:", result.error);
              // Don't block navigation on registration failure
              // Backend should handle duplicate registrations gracefully
            }
          } catch (error) {
            console.error("Error during tenant registration:", error);
            // Don't block navigation on error
          }
        }
      }
    };

    if (isAuthenticated) {
      handleTenantRegistration();
    }
  }, [isAuthenticated, isTenantRole, isSysAdmin, keycloak]);

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  // Show loading state while checking registration
  // The registration happens in useEffect, so we can proceed with navigation
  if (isSysAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (isTenantRole) {
    // Redirect to tenant dashboard (root path)
    return <Navigate to="/" replace />;
  }

  // Fallback to landing if no recognized role
  return <Navigate to="/landing" replace />;
}



