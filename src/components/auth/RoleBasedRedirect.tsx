import { useEffect } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

/**
 * Component that handles role-based redirection after authentication
 * Also handles tenant registration for tenant users
 */
export default function RoleBasedRedirect() {
  const { isAuthenticated, isSysAdmin, isTenantRole } = useAuth();

  // Auto-registration login removed as we now require onboarding form
  useEffect(() => {
    // Only kept for potential future use or if this component is used
  }, []);

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



