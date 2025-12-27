import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useKeycloak } from "@react-keycloak/web";

import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../AuthPages/AuthPageLayout";
import { useAuth } from "../../hooks/useAuth";

export default function Landing() {
  const { keycloak, initialized } = useKeycloak();
  const { isAuthenticated, roles } = useAuth();
  const navigate = useNavigate();

  /**
   * Redirect authenticated users based on role
   */
  useEffect(() => {
    if (!initialized || !isAuthenticated) return;

    const isSysAdmin = roles.includes("sys_admin");
    const isTenant =
      roles.includes("tenant_admin") || roles.includes("tenant_user");

    if (isSysAdmin) {
      navigate("/admin", { replace: true });
    } else if (isTenant) {
      navigate("/", { replace: true });
    }
  }, [initialized, isAuthenticated, roles, navigate]);

  /**
   * Trigger Keycloak login
   */
  const handleLogin = () => {
    keycloak.login({
      redirectUri: `${window.location.origin}#/landing`,
    });
  };

  /**
   * Trigger Keycloak registration
   */
  const handleRegister = () => {
    keycloak.register({
      redirectUri: `${window.location.origin}#/landing`,
    });
  };

  /**
   * While Keycloak initializes, avoid flicker
   */
  if (!initialized) {
    return null;
  }

  /**
   * If authenticated, redirect effect will handle navigation
   */
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <PageMeta
        title="Welcome | Fast SMS"
        description="Sign in or register to access Fast SMS"
      />

      <AuthLayout>
        <div className="flex flex-col justify-center flex-1 w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
                Welcome to Fast SMS
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                Sign in to your account or create a new one to get started
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={handleLogin}
                className="inline-flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 sm:py-3.5 sm:text-base"
              >
                Login
              </button>

              <button
                onClick={handleRegister}
                className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] dark:focus:ring-offset-gray-900 sm:py-3.5 sm:text-base"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
