import { useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { MailIcon, ChatIcon, PlugInIcon, PieChartIcon, FileIcon } from "../../icons";
import { useKeycloak } from "@react-keycloak/web";

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

const DashboardKpiCards: React.FC = () => (
  <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {/* Card 1: Total SMS Requests */}
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between">
        <ChatIcon className="h-9 w-9 text-orange-500" />
        {/* UPDATED TIME PERIOD DROPDOWN */}
        <select className="rounded-lg border border-gray-300 bg-transparent px-2 py-1 text-xs text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {timePeriodOptions.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>
      <h2 className="mb-1 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">NaN</h2>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        Total SMS Requests{" "}
        <span className="font-semibold text-success-500 dark:text-success-400">0% ↑</span>
      </p>
    </div>

    {/* Card 2: Total API Requests */}
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between">
        <PlugInIcon className="h-9 w-9 text-orange-500" />
        {/* UPDATED TIME PERIOD DROPDOWN */}
        <select className="rounded-lg border border-gray-300 bg-transparent px-2 py-1 text-xs text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {timePeriodOptions.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>
      <h2 className="mb-1 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">0</h2>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total API Requests 0</p>
    </div>

    {/* Card 3: Bulk SMS Request */}
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <MailIcon className="h-9 w-9 text-orange-500" />
        <div className="flex flex-col gap-1">
          {/* Status Dropdown (from previous request) */}
          <select className="rounded-lg border border-gray-300 bg-transparent px-2 py-1 text-xs text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {smsStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="w-24 rounded-lg border border-gray-300 bg-transparent px-2 py-1 text-xs text-gray-700 shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-500"
          />
        </div>
      </div>
      <h2 className="mb-1 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">0</h2>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Bulk SMS Request</p>
    </div>

    {/* Card 4: SMS Status */}
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <PieChartIcon className="h-9 w-9 text-orange-500" />
        <div className="flex flex-col gap-1">
          {/* UPDATED TIME PERIOD DROPDOWN */}
          <select className="rounded-lg border border-gray-300 bg-transparent px-2 py-1 text-xs text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {timePeriodOptions.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
          {/* Status Dropdown (from previous request) */}
          <select className="rounded-lg border border-gray-300 bg-transparent px-2 py-1 text-xs text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {smsStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <h2 className="mb-1 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">0</h2>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">SMS Status 0</p>
    </div>
  </div>
);

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

/**
 * Renders the SMS Requests Overview Line Chart.
 */
const StatisticsChart: React.FC = () => {
  const [selected, setSelected] = useState<string>("optionOne");

  const getButtonClass = (option: string) => {
    return selected === option
      ? "bg-white text-gray-900 shadow-theme-xs dark:bg-gray-800 dark:text-white"
      : "text-gray-600 dark:text-gray-400";
  };

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
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
          SMS Requests Overview
        </h3>
      </div>

     <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900 mb-4 sm:mb-6">
      <button
        onClick={() => setSelected("optionOne")}
        className={`px-2 sm:px-3 py-1.5 sm:py-2 font-medium w-full rounded-md text-xs sm:text-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "optionOne"
        )}`}
      >
        Monthly
      </button>

      <button
        onClick={() => setSelected("optionTwo")}
        className={`px-2 sm:px-3 py-1.5 sm:py-2 font-medium w-full rounded-md text-xs sm:text-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "optionTwo"
        )}`}
      >
        Quarterly
      </button>

      <button
        onClick={() => setSelected("optionThree")}
        className={`px-2 sm:px-3 py-1.5 sm:py-2 font-medium w-full rounded-md text-xs sm:text-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "optionThree"
        )}`}
      >
        Annually
      </button>
    </div>

      <div className="overflow-x-auto">
        <Chart options={options} series={series} type="area" height={250} />
      </div>
    </div>
  );
};

export default function Admin() {
  const {keycloak} = useKeycloak();
  const username = keycloak.tokenParsed?.preferred_username;
  const roles    = keycloak.tokenParsed?.realm_access?.roles || [];
  return (
    <div>
      <h1>username: {username}</h1>
      <h1>roles: {roles.join(", ")}</h1>
      <h1>token parsed: {JSON.stringify(keycloak.tokenParsed)}</h1>
      <br />
      <br />
      <h1>token: {keycloak.token}</h1>
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