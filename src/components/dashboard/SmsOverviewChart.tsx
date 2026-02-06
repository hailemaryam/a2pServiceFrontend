import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useGetSmsOverviewQuery } from "../../api/dashboardApi";

const SmsOverviewChart: React.FC = () => {
  const [days, setDays] = useState(30);
  const { data: points, isLoading, error } = useGetSmsOverviewQuery({ days });

  const chartData = useMemo(() => {
    if (!points) return { categories: [], seriesData: [] };

    const categories = points.map((p) => {
      const date = new Date(p.timestamp);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    });

    const seriesData = points.map((p) => p.totalSms);

    return { categories, seriesData };
  }, [points]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] h-[400px] flex items-center justify-center">
        <div className="text-gray-500">Loading SMS Traffic...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] h-[400px] flex items-center justify-center">
        <div className="text-error-500">Failed to load SMS usage summary</div>
      </div>
    );
  }

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#3B82F6"], // Blue color for SMS traffic
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
      size: chartData.seriesData.length === 1 ? 5 : 0,
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
        formatter: (val) => `${val.toLocaleString()} messages`,
      },
    },
    xaxis: {
      type: "category",
      categories: chartData.categories,
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
        rotate: -45,
        hideOverlappingLabels: true,
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
      data: chartData.seriesData,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SMS Traffic</h3>
          <p className="text-sm text-gray-500">Daily aggregate of sent messages</p>
        </div>
        <div className="relative">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <div id="sms-overview-chart" className="-ml-2">
        <Chart options={options} series={series} type="area" height={350} />
      </div>
    </div>
  );
};

export default SmsOverviewChart;
