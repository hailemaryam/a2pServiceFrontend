import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useAuth } from "../../hooks/useAuth";

/**
 * System Admin Dashboard - Overview with KPIs
 * This page is only accessible to users with the sys_admin role
 * Shows overview KPIs and quick links to system admin features
 */
export default function SystemAdminDashboard() {
  const { username } = useAuth();

  // Dummy KPI data - will be replaced with API calls
  const kpis = {
    totalTenants: 150,
    pendingApprovals: 12,
    activeSmsJobs: 8,
    totalPackages: 4,
  };

  return (
    <>
      <PageMeta title="System Admin Dashboard | Fast SMS" description="System administration dashboard" />
      <PageBreadcrumb pageTitle="System Admin Dashboard" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="mb-6">
           
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {username || "System Admin"}
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tenants</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {kpis.totalTenants}
                  </p>
                </div>
                <div className="p-3 bg-brand-100 rounded-lg dark:bg-brand-500/10">
                  <svg
                    className="w-6 h-6 text-brand-600 dark:text-brand-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approvals</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {kpis.pendingApprovals}
                  </p>
                </div>
                <div className="p-3 bg-warning-100 rounded-lg dark:bg-warning-500/10">
                  <svg
                    className="w-6 h-6 text-warning-600 dark:text-warning-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active SMS Jobs</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {kpis.activeSmsJobs}
                  </p>
                </div>
                <div className="p-3 bg-success-100 rounded-lg dark:bg-success-500/10">
                  <svg
                    className="w-6 h-6 text-success-600 dark:text-success-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Packages</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {kpis.totalPackages}
                  </p>
                </div>
                <div className="p-3 bg-info-100 rounded-lg dark:bg-info-500/10">
                  <svg
                    className="w-6 h-6 text-info-600 dark:text-info-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {/* Tenants Management */}
            <Link
              to="/admin/tenants"
              className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition hover:border-brand-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-brand-800"
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Tenants Management
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage all tenants in the system, view tenant details, and configure tenant settings
              </p>
            </Link>

            {/* Sender Approvals */}
            <Link
              to="/admin/senders"
              className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition hover:border-brand-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-brand-800"
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Sender Approvals
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and approve sender ID requests from tenants
              </p>
            </Link>

            {/* SMS Job Approvals */}
            <Link
              to="/admin/sms-jobs"
              className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition hover:border-brand-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-brand-800"
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                SMS Job Approvals
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and approve SMS job requests before they are sent
              </p>
            </Link>

            {/* SMS Packages */}
            <Link
              to="/admin/sms-packages"
              className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition hover:border-brand-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-brand-800"
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                SMS Packages
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage SMS packages, pricing, and package assignments to tenants
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}



