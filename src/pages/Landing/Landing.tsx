import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useKeycloak } from "@react-keycloak/web";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../AuthPages/AuthPageLayout";
import { useAuth } from "../../hooks/useAuth";

/**
 * Landing page shown to unauthenticated users
 * Displays Login and Register buttons matching SignInForm/SignUpForm design
 * Note: System admins should only use Login (Register button is shown but Keycloak will handle role restrictions)
 */
export default function Landing() {
  const { keycloak } = useKeycloak();
  const { isAuthenticated, roles } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const isSysAdmin = roles.includes("sys_admin");
      const isTenantRole = roles.includes("tenant_admin") || roles.includes("tenant_user");
      
      if (isSysAdmin) {
        navigate("/system-admin", { replace: true });
      } else if (isTenantRole) {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, roles, navigate]);

  const handleLogin = () => {
    keycloak.login();
  };

  const handleRegister = () => {
    // Keycloak registration flow
    // Keycloak will handle role restrictions - sys_admin users won't be able to register
    keycloak.register();
  };

  // Don't show anything if authenticated (redirect will happen)
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
        <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Welcome to Fast SMS
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sign in to your account or create a new one
                </p>
              </div>
              <div className="space-y-4">
                <button
                  onClick={handleLogin}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
                >
                  Login
                </button>

                <button
                  onClick={handleRegister}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}

