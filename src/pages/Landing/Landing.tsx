import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useKeycloak } from "@react-keycloak/web";
import { Link } from "react-router";

import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../hooks/useAuth";
import Features from "../../components/landing/Features";
import Pricing from "../../components/landing/Pricing";
import AboutUs from "../../components/landing/AboutUs";
import ContactUs from "../../components/landing/ContactUs";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

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
      redirectUri: `${window.location.origin}/#/landing`,
    });
  };

  /**
   * Trigger Keycloak registration
   */
  const handleRegister = () => {
    keycloak.register({
      redirectUri: `${window.location.origin}/#/landing`,
    });
  };

  if (!initialized) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300">
      <PageMeta
        title="Fast SMS | Enterprise A2P Messaging Solution"
        description="The ultimate A2P SMS platform for businesses in Ethiopia and beyond. Bulk SMS, OTP, API integration and more."
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link to="/landing" className="flex items-center gap-3">
                <img
                  src="/images/logo/favicon.png"
                  alt="Fast SMS Logo"
                  className="h-10 w-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/favicon.png";
                  }}
                />
                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                  FAST<span className="text-brand-500">SMS</span>
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <a href="#features" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors uppercase tracking-widest">Features</a>
              <a href="#pricing" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors uppercase tracking-widest">Pricing</a>
              <a href="#about" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors uppercase tracking-widest">About</a>
              <a href="#contact" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors uppercase tracking-widest">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <ThemeTogglerTwo />
              <button
                onClick={handleLogin}
                className="hidden sm:block text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-brand-500 transition-colors tracking-widest"
              >
                LOG IN
              </button>
              <button
                onClick={handleRegister}
                className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-brand-500/25 transition-all hover:scale-105 active:scale-95 tracking-widest"
              >
                GET STARTED
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-bold mb-8 animate-fade-in">
                <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
                THE #1 SMS PLATFORM IN ETHIOPIA
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-8">
                Reach your customers <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-brand-600">
                  instantly & reliably.
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                Powerful A2P SMS solutions for bulk messaging, OTPs, and enterprise communication.
                Simple integration, detailed analytics, and local support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleRegister}
                  className="px-10 py-5 bg-brand-500 hover:bg-brand-600 text-white font-black rounded-2xl shadow-2xl shadow-brand-500/30 transition-all hover:scale-[1.02] active:scale-95 text-lg"
                >
                  Start Messaging Now
                </button>
                <a
                  href="#features"
                  className="px-10 py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 transition-all text-lg"
                >
                  Explore Features
                </a>
              </div>
            </div>

            <div className="mt-16 lg:mt-0 relative">
              <div className="p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-2xl skew-y-1 transform hover:skew-y-0 transition-transform duration-700">
                <div className="bg-gray-900 rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-transparent"></div>
                  <div className="z-10 text-center">
                    <div className="w-20 h-20 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 transition-transform">
                      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <span className="text-gray-400 font-mono text-sm tracking-widest uppercase">System Dashboard Beta</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Components Sections */}
      <Features />
      <Pricing />
      <AboutUs />
      <ContactUs />

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
                FAST<span className="text-brand-500">SMS</span>
              </span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-brand-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-500 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-brand-500 transition-colors">Cookie Policy</a>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-600">
              &copy; {new Date().getFullYear()} Fast SMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
