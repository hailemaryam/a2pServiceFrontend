import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useGetSmsOverviewQuery } from "../../api/dashboardApi";

const SmsOverviewChart: React.FC = () => {
  const [granularity, setGranularity] = React.useState<string>("MONTH");
  const { data: response, isLoading, error } = useGetSmsOverviewQuery({ granularity });

  const overview = response?.points;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] h-[350px] flex items-center justify-center">
        <div className="text-gray-500">Loading SMS Overview...</div>
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] h-[350px] flex items-center justify-center">
        <div className="text-error-500">Failed to load SMS usage summary</div>
      </div>
    );
  }

  // Transform data for the chart
  const categories = (overview || []).map((item) => {
    return item.label;
  });

  const seriesData = (overview || []).map((item) => item.totalSms);

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#3B82F6"], // Blue color for SMS
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    markers: {
      size: 4,
      colors: ["#fff"],
      strokeColors: "#3B82F6",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    grid: {
      borderColor: "#f1f1f1",
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
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `${val} messages`,
      },
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: "#6B7280",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: "#6B7280",
        },
        formatter: (val) => val.toLocaleString(),
      },
      title: {
        text: "Messages Sent",
        style: {
          fontSize: "12px",
          fontWeight: 500,
          color: "#6B7280",
        },
      },
    },
  };

  const series = [
    {
      name: "SMS Count",
      data: seriesData,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SMS Overview</h3>
          <p className="text-sm text-gray-500">{granularity.charAt(0) + granularity.slice(1).toLowerCase()}ly message traffic summary</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          {(['MONTH', 'QUARTER', 'YEAR'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${granularity === g
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <div id="sms-overview-chart">
        <Chart options={options} series={series} type="area" height={350} />
      </div>
    </div>
  );
};

export default SmsOverviewChart;
