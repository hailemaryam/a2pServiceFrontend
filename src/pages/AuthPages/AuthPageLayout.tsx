import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-4 sm:p-6 bg-white z-1 dark:bg-gray-900 lg:p-0">
      <div className="relative flex flex-col justify-center w-full min-h-screen lg:h-screen lg:flex-row dark:bg-gray-900">
        <div className="flex flex-col justify-center flex-1 w-full lg:w-1/2">
          {children}
        </div>
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-gray-800/50 lg:flex">
          <div className="relative flex items-center justify-center w-full h-full z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs px-4">
              <Link to="/" className="block mb-4">
                <img
                  width={231}
                  height={48}
                  src="/images/logo/auth-logo.png"
                  alt="Logo"
                  className="w-auto h-12 object-contain"
                  onError={(e) => {
                    // Fallback to banner if auth-logo doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = "/banner.png";
                    target.className = "w-auto h-12 object-contain";
                  }}
                />
              </Link>
              {/* <p className="text-center text-gray-400 dark:text-white/60">
               Let there be fast SMS
              </p> */}
            </div>
          </div>
        </div>
        <div className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
