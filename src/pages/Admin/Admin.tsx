import { useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { UserCircleIcon, BoxIcon, MoreDotIcon } from "../../icons";

// --- Type Definitions for Data Structures ---
interface MetricData {
  title: string;
  value: string;
  change: number; // Percentage change
  isPositive: boolean;
  icon: React.ReactNode;
}

interface SalesData {
  month: string;
  sales: number;
  target?: number;
}

interface StatisticsData {
  date: string;
  value: number;
  previousValue?: number;
}

// --- Mock Data ---
const keyMetrics: MetricData[] = [
  {
    title: "Customers",
    value: "3,782",
    change: 11.01,
    isPositive: true,
    icon: <UserCircleIcon className="h-6 w-6" />,
  },
  {
    title: "Orders",
    value: "5,359",
    change: 9.05,
    isPositive: false,
    icon: <BoxIcon className="h-6 w-6" />,
  },
];

const monthlySalesData: SalesData[] = [
  { month: "Jan", sales: 450 },
  { month: "Feb", sales: 750 },
  { month: "Mar", sales: 300 },
  { month: "Apr", sales: 550 },
  { month: "May", sales: 500 },
  { month: "Jun", sales: 400 },
  { month: "Jul", sales: 600 },
  { month: "Aug", sales: 450 },
  { month: "Sep", sales: 500 },
  { month: "Oct", sales: 350 },
  { month: "Nov", sales: 480 },
  { month: "Dec", sales: 520 },
];

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
 * Renders a single Key Metric card (Customers or Orders).
 */
const KeyMetricCard: React.FC<{ metric: MetricData }> = ({ metric }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
      <div className="text-brand-500 dark:text-brand-400">{metric.icon}</div>
    </div>
    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">{metric.title}</p>
    <p className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
      {metric.value}
    </p>
    <span
      className={`text-sm font-medium ${
        metric.isPositive
          ? "text-success-500 dark:text-success-400"
          : "text-error-500 dark:text-error-400"
      }`}
    >
      {metric.isPositive ? "↑" : "↓"} {Math.abs(metric.change).toFixed(2)}%
    </span>
  </div>
);

/**
 * Renders the Monthly Target Progress Ring.
 */
const MonthlyTarget: React.FC = () => {
  const completionPercentage = 75.55;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
            Monthly Target
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Target you've set for each month
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <MoreDotIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-6 flex items-center justify-center">
        <div className="relative">
          <svg className="h-32 w-32 -rotate-90 transform">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-brand-500 dark:text-brand-400"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {completionPercentage}%
            </p>
            <span className="text-xs text-success-500 dark:text-success-400">+10%</span>
          </div>
        </div>
      </div>

      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        You earn $3287 today, its higher than last month. Keep up your good work!
      </p>

      <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
        <div>
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Target</p>
          <p className="text-sm font-semibold text-error-500 dark:text-error-400">
            $20K ↓
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Revenue</p>
          <p className="text-sm font-semibold text-success-500 dark:text-success-400">
            $16K ↑
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Today</p>
          <p className="text-sm font-semibold text-success-500 dark:text-success-400">
            $1.5K ↑
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Renders the Monthly Sales Bar Chart.
 */
const MonthlySalesChart: React.FC = () => {
  const options: ApexOptions = {
    colors: ["#3670e8", "#e0e0e0"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 250,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: monthlySalesData.map((d) => d.month),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#6B7280",
        },
      },
    },
    yaxis: {
      max: 800,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#6B7280",
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#E5E7EB",
      strokeDashArray: 3,
    },
    fill: {
      opacity: [1, 0.5],
    },
    tooltip: {
      y: {
        formatter: (val: number) => `$${val}`,
      },
    },
    legend: {
      show: false,
    },
  };

  const series = [
    {
      name: "Sales",
      data: monthlySalesData.map((d) => d.sales),
    },
    {
      name: "Target",
      data: monthlySalesData.map(() => 600), // Placeholder target values
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Monthly Sales
        </h3>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <MoreDotIcon className="h-5 w-5" />
        </button>
      </div>
      <Chart options={options} series={series} type="bar" height={250} />
    </div>
  );
};

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
          Statistics
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Target you've set for each month
        </span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
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
        </div>
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
        {/* Top Row: Metrics and Target */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            {keyMetrics.map((metric) => (
              <KeyMetricCard key={metric.title} metric={metric} />
            ))}
          </div>
          <div className="lg:col-span-1">
            <MonthlyTarget />
          </div>
        </div>

        {/* Middle Row: Monthly Sales */}
        <MonthlySalesChart />

        {/* Bottom Row: Statistics */}
        <StatisticsChart />
      </div>
    </div>
  );
}
