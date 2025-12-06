import { useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { MailIcon, ChatIcon, PlugInIcon, PieChartIcon, FileIcon } from "../../icons";

// --- Type Definitions for Data Structures ---
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

// --- Reusable Components ---

/**
 * Dashboard KPI Cards Component
 */
const DashboardKpiCards: React.FC = () => (
  <div className="mb-8 flex flex-wrap gap-5">
    {/* Card 1: Total SMS Requests */}
    <div className="min-w-[220px] flex-1 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between">
        <ChatIcon className="h-9 w-9 text-orange-500" />
        <select className="rounded-lg border border-gray-300 bg-transparent px-2 py-1 text-xs text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <option>Last 30...</option>
        </select>
      </div>
      <h2 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-white">NaN</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Total SMS Requests{" "}
        <span className="font-semibold text-success-500 dark:text-success-400">0% ↑</span>
      </p>
    </div>

    {/* Card 2: Total API Requests */}
    <div className="min-w-[220px] flex-1 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between">
        <PlugInIcon className="h-9 w-9 text-orange-500" />
        <select className="rounded-lg border border-gray-300 bg-transparent px-2 py-1 text-xs text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <option>Last 30...</option>
        </select>
      </div>
      <h2 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-white">0</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">Total API Requests 0</p>
    </div>

    {/* Card 3: Bulk SMS Request */}
    <div className="min-w-[220px] flex-1 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <MailIcon className="h-9 w-9 text-orange-500" />
        <div className="flex flex-col gap-1">
          <select className="rounded-lg border border-gray-300 bg-transparent px-2 py-1 text-xs text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <option>pending</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="w-24 rounded-lg border border-gray-300 bg-transparent px-2 py-1 text-xs text-gray-700 shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-500"
          />
        </div>
      </div>
      <h2 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-white">0</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">Bulk SMS Request</p>
    </div>

    {/* Card 4: SMS Status */}
    <div className="min-w-[220px] flex-1 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <PieChartIcon className="h-9 w-9 text-orange-500" />
        <div className="flex flex-col gap-1">
          <select className="rounded-lg border border-gray-300 bg-transparent px-2 py-1 text-xs text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <option>Last 30...</option>
          </select>
          <select className="rounded-lg border border-gray-300 bg-transparent px-2 py-1 text-xs text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <option>pending</option>
          </select>
        </div>
      </div>
      <h2 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-white">0</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">SMS Status 0</p>
    </div>
  </div>
);

/**
 * Recent SMS Table Component
 */
const RecentSMSTable: React.FC = () => (
  <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
    <h3 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
      Recent SMS (past 7 days)
    </h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              CONTACT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              MESSAGE
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              DATE
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-white/[0.03]">
          <tr>
            <td colSpan={4} className="px-6 py-16 text-center">
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
);

/**
 * Renders the bottom Statistics Line Chart.
 */
const StatisticsChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "sales" | "revenue">("overview");

  const options: ApexOptions = {
    colors: ["#3670e8", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 300,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
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
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      borderColor: "#E5E7EB",
      strokeDashArray: 3,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      categories: statisticsData.map((d) => d.date),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    yaxis: {
      min: 600,
      max: 1000,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    legend: {
      show: false,
    },
  };

  const series = [
    {
      name: "Current",
      data: statisticsData.map((d) => d.value),
    },
    {
      name: "Previous",
      data: statisticsData.map((d) => d.previousValue || 0),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
          SMS Requests Overview
        </h3>
        {/* <span className="text-sm text-gray-500 dark:text-gray-400">
          Target you've set for each month
        </span> */}
      </div>

      <div className="mb-6 flex items-center justify-between">
        {/* <div className="flex gap-2">
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "overview"
                ? "bg-brand-500 text-white shadow-theme-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "sales"
                ? "bg-brand-500 text-white shadow-theme-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("sales")}
          >
            Sales
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "revenue"
                ? "bg-brand-500 text-white shadow-theme-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("revenue")}
          >
            Revenue
          </button>
        </div> */}
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          05 Feb - 06 March
        </button>
      </div>

      <Chart options={options} series={series} type="area" height={300} />
    </div>
  );
};

// --- Main Dashboard Component ---
export default function Admin() {
  return (
    <div>
      <PageMeta title="Admin | Fast SMS" description="Admin page for Fast SMS" />
      <PageBreadcrumb pageTitle="Admin" />
      <div className="space-y-6">
        {/* Dashboard KPI Cards */}
        <DashboardKpiCards />

        {/* Recent SMS Table */}
        <RecentSMSTable />

        {/* Statistics Line Chart */}
        <StatisticsChart />
      </div>
    </div>
  );
}
