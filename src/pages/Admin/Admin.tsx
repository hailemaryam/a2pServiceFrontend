import { useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { MailIcon, ChatIcon, PlugInIcon, PieChartIcon, FileIcon } from "../../icons";
import { useGetTenantDashboardQuery } from "../../api/dashboardApi";

/*
interface StatisticsData {
  date: string;
  value: number;
  previousValue?: number;
}

const statisticsData: StatisticsData[] = [
  { date: "1", value: 700, previousValue: 650 },
  { date: "2", value: 720, previousValue: 660 },
  { date: "3", value: 750, previousValue: 680 },
  { date: "4", value: 780, previousValue: 700 },
  { date: "5", value: 810, previousValue: 730 },
  { date: "6", value: 850, previousValue: 760 },
  { date: "7", value: 870, previousValue: 790 },
];

// Define the new time-period options
const timePeriodOptions = [
  "Today",
  "Last 7 Days",
  "Last 30 Days",
  "Total",
];

// Define the new SMS status options
const smsStatusOptions = [
  "pending",
  "expired",
  "sent",
  "submitted",
  "buffered",
  "rejected",
  "failed",
];
*/

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

/*
const RecentSMSTable: React.FC = () => (
  <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
    <h3 className="mb-4 sm:mb-5 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
      Recent SMS (past 7 days)
    </h3>
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                ID
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                CONTACT
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                MESSAGE
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                DATE
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-white/[0.03]">
            <tr>
              <td colSpan={4} className="px-3 sm:px-6 py-12 sm:py-16 text-center">
                <div className="flex flex-col items-center justify-center">
                  <FileIcon className="mb-4 h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <p className="mb-1 font-medium text-gray-900 dark:text-white">
                    No recent SMS found
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You have not sent any SMS in the past 7 days.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
*/

/**
 * Renders the SMS Requests Overview Line Chart.
 */
import { useGetSmsOverviewQuery } from "../../api/dashboardApi";

const StatisticsChart: React.FC = () => {
  // Fetch chart data (no granularity param needed now)
  const { data: overviewData, isLoading } = useGetSmsOverviewQuery();

  // Log data to help user identify structure
  if (overviewData) {
    console.log("[Dashboard Chart] Overview Data:", overviewData);
  }

  // ADAPTER: Attempt to map unknown response to chart format
  // We expect array of { date: string, count: number } or similar.
  // If it's different, this will need adjustment after we see the log.
  const chartCategories: string[] = Array.isArray(overviewData) 
    ? overviewData.map((d: any) => d.date || d.label || d.period || "")
    : [];
    
  const chartData: number[] = Array.isArray(overviewData)
    ? overviewData.map((d: any) => Number(d.count || d.value || d.total || 0))
    : [];

  const options: ApexOptions = {
    colors: ["#E57A38"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 300,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [2, 1],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      categories: chartCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      // min: 0,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 3,
    },
  };

  const series = [
    {
      name: "SMS Count",
      data: chartData,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
          SMS Overview
        </h3>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
             <div className="h-[250px] flex items-center justify-center text-gray-500">Loading Chart...</div>
        ) : (
            <Chart options={options} series={series} type="area" height={250} />
        )}
      </div>
    </div>
  );
};

export default function Admin() {
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
        <StatisticsChart />
      </div>
    </>
  );
}

// Hardcoded data commented out for now
/*
interface StatisticsData {
  date: string;
  value: number;
  previousValue?: number;
}

const statisticsData: StatisticsData[] = [
  { date: "1", value: 700, previousValue: 650 },
  { date: "2", value: 720, previousValue: 660 },
  { date: "3", value: 750, previousValue: 680 },
  { date: "4", value: 780, previousValue: 700 },
  { date: "5", value: 810, previousValue: 730 },
  { date: "6", value: 850, previousValue: 760 },
  { date: "7", value: 870, previousValue: 790 },
];

const timePeriodOptions = [
  "Today",
  "Last 7 Days",
  "Last 30 Days",
  "Total",
];

const smsStatusOptions = [
  "pending",
  "expired",
  "sent",
  "submitted",
  "buffered",
  "rejected",
  "failed",
];
*/