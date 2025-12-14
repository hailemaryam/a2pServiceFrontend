import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  /**
   * Allowed roles for this route
   * If empty, any authenticated user can access
   */
  allowedRoles?: string[];
  /**
   * Redirect path if user is not authenticated
   */
  redirectTo?: string;
  /**
   * Child component to render (typically AppLayout)
   */
  children?: ReactNode;
}

/**
 * Protected Route Component
 * Guards routes based on authentication and roles
 * Frontend-only protection - backend should always validate authorization
 */
export default function ProtectedRoute({ 
  allowedRoles = [], 
  redirectTo = "/landing",
  children
}: ProtectedRouteProps) {
  const { isAuthenticated, roles } = useAuth();

  // If not authenticated, redirect to landing page
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If roles are specified, check if user has at least one of them
  if (allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some((role) => roles.includes(role));
    
    if (!hasRequiredRole) {
      // User doesn't have required role, redirect based on their actual role
      const isSysAdmin = roles.includes("sys_admin");
      const isTenantRole = roles.includes("tenant_admin") || roles.includes("tenant_user");
      
      if (isSysAdmin) {
        return <Navigate to="/admin" replace />;
      } else if (isTenantRole) {
        return <Navigate to="/" replace />;
      } else {
        return <Navigate to={redirectTo} replace />;
      }
    }
  }

  // If children are provided, render them, otherwise use Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
}

