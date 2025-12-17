import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { ReactNode } from "react";

interface AdminRouteProps {
  /**
   * Redirect path if user is not authenticated or not sys_admin
   */
  redirectTo?: string;
  /**
   * Child component to render
   */
  children?: ReactNode;
}

/**
 * Admin Route Component
 * Guards routes to allow access only for users with "sys_admin" role
 * Frontend-only protection - backend should always validate authorization
 */
export default function AdminRoute({
  redirectTo = "/landing",
  children,
}: AdminRouteProps) {
  const { isAuthenticated, isSysAdmin } = useAuth();

  // If not authenticated, redirect to landing/signin
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If not sys_admin, redirect to home (tenant dashboard)
  if (!isSysAdmin) {
    return <Navigate to="/" replace />;
  }

  // If children are provided, render them, otherwise use Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
}

