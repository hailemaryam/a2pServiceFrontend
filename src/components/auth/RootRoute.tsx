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

  // 🔴 HANDLE PAYMENT CALLBACK FIRST - Synchronous check during render
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);

  const txId =
    searchParams.get('transactionId') ||
    searchParams.get('tx_ref') ||
    searchParams.get('id') ||
    hashParams.get('transactionId') ||
    hashParams.get('tx_ref') ||
    hashParams.get('id');

  if (isAuthenticated && txId) {
    // clean URL immediately
    const cleanUrl = new URL(window.location.href);
    cleanUrl.search = '';
    // Also clean hash params if they exist in the hash part
    if (cleanUrl.hash.includes('?')) {
        cleanUrl.hash = cleanUrl.hash.split('?')[0];
    }
    
    window.history.replaceState({}, document.title, cleanUrl.toString());

    console.log("Payment callback detected (render-phase), redirecting to transaction:", txId);
    return <Navigate to={`/transactions/${txId}`} replace />;
  }

  // 🔽 NOW DO NORMAL AUTH FLOW

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  // Redirect to onboarding if tenant is not fully set up
  if (isAuthenticated && isTenantRole && (!tenantId || tenantId === "unassigned")) {
      return <Navigate to="/onboard" replace />;
  }

  if (isSysAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (isTenantRole) {
    return (
      <SidebarProvider>
        <TenantDashboardLayout>
          <Admin />
        </TenantDashboardLayout>
      </SidebarProvider>
    );
  }

  // Fallback
  return <Navigate to="/landing" replace />;
}



