
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export default function PaymentCallbackHandler() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Only proceed if authenticated to avoid redirecting before auth is ready
    if (!isAuthenticated) return;

    // Detect callback params
    const txRef = searchParams.get("tx_ref");
    const transactionId = searchParams.get("transactionId");
    const id = searchParams.get("id");

    // Resolve the key to use (prioritize direct ID, then Chapa params)
    const resolvedId = id || transactionId || txRef;

    if (resolvedId) {
      // 1. Clean the URL by replacing the current entry
      // 2. Navigate to the detail view using Path Param strategy
      navigate(`/transactions/${resolvedId}`, { replace: true });
    }
  }, [isAuthenticated, searchParams, navigate]);

  return null; // This component handles logic only, no UI
}
