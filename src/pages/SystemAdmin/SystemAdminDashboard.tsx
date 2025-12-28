import { Link } from "react-router";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useAuth } from "../../hooks/useAuth";
import { useGetAdminDashboardQuery } from "../../api/dashboardApi";

/**
 * System Admin Dashboard - Overview with KPIs
 * This page is only accessible to users with the sys_admin role
 * Shows overview KPIs and quick links to system admin features
 */
const DashboardBarChart: React.FC<{ kpis: { totalTenants: number; pendingApprovals: number; activeSmsJobs: number; totalPackages: number; } }> = ({ kpis }) => {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: ['Tenants', 'Pending Senders', 'Pending SMS Jobs', 'Active Packages'],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: undefined },
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toString();
        }
      }
    },
    colors: ['#E57A38', '#F59E0B', '#10B981', '#3B82F6'], // Brand, Warning, Success, Info colors matching cards
    grid: {
      borderColor: '#f1f1f1',
    }
  };

  const series = [{
    name: 'Count',
    data: [kpis.totalTenants, kpis.pendingApprovals, kpis.activeSmsJobs, kpis.totalPackages]
  }];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Platform Overview</h3>
      <div id="chart">
        <Chart options={options} series={series} type="bar" height={350} />
      </div>
    
    </div>
  );
};

export default function SystemAdminDashboard() {
  const { username } = useAuth();
  const { data: adminData, isLoading } = useGetAdminDashboardQuery();

  // Use API data or fallbacks
  const kpis = {
    totalTenants: adminData?.tenantCount ?? 0,
    pendingApprovals: adminData?.pendingSenderCount ?? 0,
    activeSmsJobs: adminData?.pendingSmsJobCount ?? 0, // Assuming API returns 'pending' count as per prompt, key mapped accordingly
    totalPackages: adminData?.activePackageCount ?? 0,
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading Admin Dashboard...</div>;
  }

  return (
    <>
      <PageMeta title="System Admin Dashboard | Fast SMS" description="System administration dashboard" />
      <PageBreadcrumb pageTitle="System Admin Dashboard" />
      <div className="space-y-6 pb-8">
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="mb-6">
      
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {username || "System Admin"}
            </p>
          </div>

          {/* Interactive KPI Cards (Navigation) */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Tenants Management */}
            <Link 
              to="/admin/tenants"
              className="group relative rounded-xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-brand-500/50"
            >
              <div className="flex items-center justify-between mb-4">
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">Tenants Management</h3>
                   <p className="text-xs text-gray-500 mt-1">Manage all tenants in the system</p>
                 </div>
                 <div className="p-3 bg-brand-100 rounded-lg group-hover:bg-brand-200 dark:bg-brand-500/10 dark:group-hover:bg-brand-500/20 transition-colors">
                    <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                 </div>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{kpis.totalTenants}</span>
                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Total Tenants</span>
              </div>
              {/* Mini Graph Visualization (Placeholder bar) */}
              <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </Link>

            {/* Sender Approvals */}
            <Link 
              to="/admin/senders"
              className="group relative rounded-xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-warning-500/50"
            >
              <div className="flex items-center justify-between mb-4">
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 group-hover:text-warning-600 dark:text-white dark:group-hover:text-warning-400">Sender Approvals</h3>
                   <p className="text-xs text-gray-500 mt-1">Review sender ID requests</p>
                 </div>
                 <div className="p-3 bg-warning-100 rounded-lg group-hover:bg-warning-200 dark:bg-warning-500/10 dark:group-hover:bg-warning-500/20 transition-colors">
                    <svg className="w-6 h-6 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                 </div>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{kpis.pendingApprovals}</span>
                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Pending Approvals</span>
              </div>
               {/* Mini Graph Visualization */}
               <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                <div className="h-full bg-warning-500 rounded-full" style={{ width: kpis.pendingApprovals > 0 ? '50%' : '5%' }}></div>
              </div>
            </Link>

            {/* SMS Job Approvals */}
            <Link 
              to="/admin/sms-jobs"
              className="group relative rounded-xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-success-500/50"
            >
              <div className="flex items-center justify-between mb-4">
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 group-hover:text-success-600 dark:text-white dark:group-hover:text-success-400">SMS Job Approvals</h3>
                   <p className="text-xs text-gray-500 mt-1">Review pending SMS jobs</p>
                 </div>
                 <div className="p-3 bg-success-100 rounded-lg group-hover:bg-success-200 dark:bg-success-500/10 dark:group-hover:bg-success-500/20 transition-colors">
                    <svg className="w-6 h-6 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                 </div>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{kpis.activeSmsJobs}</span>
                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Pending SMS Jobs</span>
              </div>
              {/* Mini Graph Visualization */}
              <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                <div className="h-full bg-success-500 rounded-full" style={{ width: kpis.activeSmsJobs > 0 ? '40%' : '5%' }}></div>
              </div>
            </Link>

            {/* SMS Packages */}
            <Link 
              to="/admin/sms-packages"
              className="group relative rounded-xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-info-500/50"
            >
              <div className="flex items-center justify-between mb-4">
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 group-hover:text-info-600 dark:text-white dark:group-hover:text-info-400">SMS Packages</h3>
                   <p className="text-xs text-gray-500 mt-1">Manage pricing & packages</p>
                 </div>
                 <div className="p-3 bg-info-100 rounded-lg group-hover:bg-info-200 dark:bg-info-500/10 dark:group-hover:bg-info-500/20 transition-colors">
                    <svg className="w-6 h-6 text-info-600 dark:text-info-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                 </div>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{kpis.totalPackages}</span>
                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Active Packages</span>
              </div>
               {/* Mini Graph Visualization */}
               <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                <div className="h-full bg-info-500 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </Link>
          </div>

          {/* Bar Chart Section */}
          <DashboardBarChart kpis={kpis} />
          
        </div>
      </div>
    </>
  );
}



