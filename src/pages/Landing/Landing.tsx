import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useKeycloak } from "@react-keycloak/web";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../AuthPages/AuthPageLayout";
import { useAuth } from "../../hooks/useAuth";
import { ChevronLeftIcon } from "../../icons";

type AuthMode = "initial" | "login" | "register";

/**
 * Landing page shown to unauthenticated users
 * Embeds Keycloak login/registration forms in an iframe within the left panel
 * Right side branding remains unchanged
 */
export default function Landing() {
  const { keycloak: keycloakInstance, initialized } = useKeycloak();
  const { isAuthenticated, roles } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>("initial");
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && initialized) {
      const isSysAdmin = roles.includes("sys_admin");
      const isTenantRole = roles.includes("tenant_admin") || roles.includes("tenant_user");
      
      if (isSysAdmin) {
        navigate("/admin", { replace: true });
      } else if (isTenantRole) {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, roles, navigate, initialized]);

  // Check for Keycloak callback in URL and handle it
  useEffect(() => {
    if (!initialized) return;

    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hasCode = urlParams.has("code") || hashParams.has("code");
    const hasError = urlParams.has("error") || hashParams.has("error");
    const hasState = urlParams.has("state") || hashParams.has("state");

    // If we have callback parameters, Keycloak is processing authentication
    if (hasCode || hasError || hasState) {
      // Keycloak will process this automatically via ReactKeycloakProvider
      // We just need to wait for it to complete
      // Clean up URL after a short delay
      setTimeout(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
        setAuthMode("initial");
      }, 100);
    }
  }, [initialized]);

  // Listen for Keycloak authentication success
  useEffect(() => {
    if (!initialized) return;

    // Check periodically if authentication completed
    const checkAuth = setInterval(() => {
      if (keycloakInstance.authenticated) {
        setAuthMode("initial");
        setIframeKey((prev) => prev + 1);
        clearInterval(checkAuth);
      }
    }, 500);

    return () => clearInterval(checkAuth);
  }, [initialized, keycloakInstance, authMode]);

  // Generate Keycloak login URL
  const getLoginUrl = (): string => {
    const redirectUri = encodeURIComponent(window.location.origin + "/landing");
    const clientId = encodeURIComponent("a2p-ui-client");
    const responseType = "code";
    const scope = "openid";
    
    // Generate state and nonce for security
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Store state in sessionStorage for validation
    sessionStorage.setItem("keycloak_state", state);
    sessionStorage.setItem("keycloak_nonce", nonce);

    return `https://auth.fastsms.dev/realms/a2p-realm/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${state}&nonce=${nonce}`;
  };

  // Generate Keycloak registration URL
  const getRegisterUrl = (): string => {
    const loginUrl = getLoginUrl();
    return loginUrl + "&kc_action=REGISTER";
  };

  const handleLoginClick = () => {
    setAuthMode("login");
    setIframeKey((prev) => prev + 1);
  };

  const handleRegisterClick = () => {
    setAuthMode("register");
    setIframeKey((prev) => prev + 1);
  };

  const handleBackToInitial = () => {
    setAuthMode("initial");
    setIframeKey((prev) => prev + 1);
  };

  // Handle iframe load
  const handleIframeLoad = () => {
    // Iframe loaded - Keycloak form is ready
    // When user submits, Keycloak will redirect the iframe
    // We'll detect the callback in the parent window via the useEffect above
  };

  // Don't show anything if authenticated (redirect will happen)
  if (isAuthenticated && initialized) {
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
          {authMode === "initial" ? (
            // Initial state: Show Login and Register buttons
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
                    onClick={handleLoginClick}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
                  >
                    Login
                  </button>

                  <button
                    onClick={handleRegisterClick}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Show Keycloak form in iframe
            <div className="flex flex-col flex-1">
              <div className="w-full max-w-md pt-10 mx-auto">
                <button
                  onClick={handleBackToInitial}
                  className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <ChevronLeftIcon className="size-5" />
                  Back
                </button>
              </div>
              <div className="flex flex-col flex-1 w-full max-w-md mx-auto">
                <div className="flex-1 w-full">
                  <div className="mb-5 sm:mb-8">
                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                      {authMode === "login" ? "Sign In" : "Sign Up"}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {authMode === "login"
                        ? "Enter your email and password to sign in!"
                        : "Enter your information to create an account!"}
                    </p>
                  </div>
                  <div className="w-full h-[500px] border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700">
                    <iframe
                      key={iframeKey}
                      ref={iframeRef}
                      src={authMode === "login" ? getLoginUrl() : getRegisterUrl()}
                      className="w-full h-full border-0"
                      title={authMode === "login" ? "Keycloak Login" : "Keycloak Registration"}
                      onLoad={handleIframeLoad}
                      allow="clipboard-read; clipboard-write"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AuthLayout>
    </>
  );
}
