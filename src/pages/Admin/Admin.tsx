import { Navigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { MailIcon, ChatIcon, PlugInIcon, PieChartIcon } from "../../icons";
import { useGetTenantDashboardQuery } from "../../api/dashboardApi";

const DashboardKpiCards: React.FC = () => {
  const { data: dashboardData, isLoading } = useGetTenantDashboardQuery();

  if (isLoading) {
    return <div className="mb-8 p-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-800">Loading Dashboard stats...</div>;
  }

  const {
    remainingCredits = 0,
    smsSentBySource = { API: 0, MANUAL: 0, CSV_UPLOAD: 0 },
    contactCount = 0
  } = dashboardData || {};

  const totalSmsSent = smsSentBySource.API + smsSentBySource.MANUAL + smsSentBySource.CSV_UPLOAD;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Remaining Credits */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 flex items-center justify-between">
          <ChatIcon className="h-9 w-9 text-brand-500" />
        </div>
        <h2 className="mb-1 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          {remainingCredits.toLocaleString()}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Remaining SMS Credits
        </p>
      </div>

      {/* Card 2: Total SMS Sent */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 flex items-center justify-between">
          <MailIcon className="h-9 w-9 text-orange-500" />
        </div>
        <h2 className="mb-1 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          {totalSmsSent.toLocaleString()}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total SMS Sent</p>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-x-2">
          <span>API: {smsSentBySource.API}</span>
          <span>|</span>
          <span>Manual: {smsSentBySource.MANUAL}</span>
        </div>
      </div>

      {/* Card 3: Contacts */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 flex items-center justify-between">
          <PlugInIcon className="h-9 w-9 text-success-500" />
        </div>
        <h2 className="mb-1 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          {contactCount.toLocaleString()}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Contacts</p>
      </div>

      {/* Card 4: Placeholder/Other */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 flex items-center justify-between">
          <PieChartIcon className="h-9 w-9 text-blue-500" />
        </div>
        <h2 className="mb-1 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          {smsSentBySource.CSV_UPLOAD.toLocaleString()}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Bulk (CSV) Sent</p>
      </div>
    </div>
  );
};

/**
 * Renders the SMS Requests Overview Line Chart.
 */
import SmsOverviewChart from "../../components/dashboard/SmsOverviewChart";


export default function Admin() {
  const searchParams = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search);
  const txRef = searchParams.get('tx_ref') || searchParams.get('transactionId') || searchParams.get('id');

  if (txRef) {
    console.log("Payment callback detected on Dashboard, redirecting to transaction:", txRef);
    // Use window.location to force a redirect if Navigate behaves oddly inside nested routes/layouts, 
    // though Navigate should work fine.
    // Ensure we are redirecting to the transaction page
    return <Navigate to={`/transactions/${txRef}`} replace />;
  }

  return (
    <>
      <PageMeta title="Dashboard | Fast SMS" description="Dashboard page for Fast SMS" />
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="space-y-6">
        {/* Dashboard KPI Cards */}
        <DashboardKpiCards />

        {/* Recent SMS Table */}
        {/* <RecentSMSTable /> */}

        {/* Statistics Line Chart */}
        {/* <StatisticsChart /> */}

        <SmsOverviewChart />

      </div>
    </>
  );
}