import { Navigate } from "react-router";
// import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
// import { useKeycloak } from "@react-keycloak/web";
import Admin from "../../pages/Admin/Admin";
import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import AppHeader from "../../layout/AppHeader";
import Backdrop from "../../layout/Backdrop";
import AppSidebar from "../../layout/AppSidebar";
// import { registerTenant } from "../../api/tenantApi";

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
  const { isAuthenticated, isSysAdmin, isTenantRole, tenantId } = useAuth();
  // const { keycloak } = useKeycloak();

  // Redirect to onboarding if tenant is not fully set up
  if (isAuthenticated && isTenantRole && (!tenantId || tenantId === "unassigned")) {
      return <Navigate to="/onboard" replace />;
  }

  // Check for payment callback params (Chapa, etc. often redirect to root/dashboard with params)
  // If found, redirect to our transaction detail page
  const searchParams = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search);
  const txRef = searchParams.get('tx_ref') || searchParams.get('transactionId') || searchParams.get('id');
  
  if (isAuthenticated && txRef) {
      // Clean redirect to transaction detail
      // Using 'check-status' logic if we want to be safe, or direct ID if we trust it's the ID.
      // Chapa 'tx_ref' is usually the transaction ID in our system contexts.
      console.log("Payment callback detected, redirecting to transaction:", txRef);
      return <Navigate to={`/transactions/${txRef}`} replace />;
  }

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



