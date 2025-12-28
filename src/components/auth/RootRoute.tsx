import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export default function RootRoute() {
  const { isAuthenticated, isSysAdmin, isTenantRole, tenantId } = useAuth();
  const location = useLocation();

  /**
   * HASH ROUTER PAYMENT CALLBACK SUPPORT
   * Example from Chapa:
   * https://fastsms.dev/#/?transactionId=TX_123
   * https://fastsms.dev/#/transactions?transactionId=TX_123
   */

  const searchParams = new URLSearchParams(window.location.search);
  const hashQuery = window.location.hash.includes("?")
    ? window.location.hash.split("?")[1]
    : "";

  const hashParams = new URLSearchParams(hashQuery);

  const txId =
    searchParams.get("transactionId") ||
    searchParams.get("tx_ref") ||
    searchParams.get("id") ||
    hashParams.get("transactionId") ||
    hashParams.get("tx_ref") ||
    hashParams.get("id");

  // 🔥 HIGHEST PRIORITY: PAYMENT CALLBACK
  if (isAuthenticated && txId) {
    // Clean URL (remove query params)
    const cleanUrl = `${window.location.origin}/#/transactions/${txId}`;
    window.history.replaceState({}, document.title, cleanUrl);

    console.log("Chapa callback detected → redirecting to:", txId);

    return <Navigate to={`/transactions/${txId}`} replace />;
  }

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  // 🚧 Tenant not onboarded
  if (isTenantRole && (!tenantId || tenantId === "unassigned")) {
    return <Navigate to="/onboard" replace />;
  }

  // 🧭 ROOT PATH DECISION ONLY
  if (location.pathname === "/") {
    if (isSysAdmin) {
      return <Navigate to="/admin" replace />;
    }

    if (isTenantRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // ✅ Let App routes handle everything else
  return null;
}
