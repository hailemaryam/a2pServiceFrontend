import { Navigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useKeycloak } from "@react-keycloak/web";
import Admin from "../../pages/Admin/Admin";
import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import AppHeader from "../../layout/AppHeader";
import Backdrop from "../../layout/Backdrop";
import AppSidebar from "../../layout/AppSidebar";
import { registerTenant } from "../../api/tenantApi";

/**
 * Layout wrapper for tenant dashboard at root path
 */
const TenantDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Root route component that handles "/"
 * - Unauthenticated users -> redirect to /landing
 * - sys_admin -> redirect to /admin
 * - tenant users -> show tenant dashboard (Admin component) with layout
 * Also handles tenant registration for tenant users after Keycloak login
 */
export default function RootRoute() {
  const { isAuthenticated, isSysAdmin, isTenantRole } = useAuth();
  const { keycloak } = useKeycloak();

  // Handle tenant registration for tenant users (not sys_admin)
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

  // If not authenticated, redirect to landing
  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  // If sys_admin, redirect to system admin dashboard
  if (isSysAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // If tenant user, show tenant dashboard with layout
  if (isTenantRole) {
    return (
      <SidebarProvider>
        <TenantDashboardLayout>
          <Admin />
        </TenantDashboardLayout>
      </SidebarProvider>
    );
  }

  // Fallback - should not reach here, but redirect to landing
  return <Navigate to="/landing" replace />;
}


