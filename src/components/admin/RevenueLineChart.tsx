import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useGetTransactionHistoryQuery } from "../../api/adminApi";

const RevenueLineChart: React.FC = () => {
  const [days, setDays] = useState(30);
  const { data: history, isLoading, error } = useGetTransactionHistoryQuery({ days });

  const chartData = useMemo(() => {
    if (!history) return { categories: [], seriesData: [] };

    // Create a map of existing data points for quick lookup
    const dataMap = new Map<string, number>();
    history.forEach((item) => {
      const dateStr = item.date || item.timestamp;
      if (dateStr) {
        const d = new Date(dateStr);
        // Normalize to local date string to match category generation
        const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        dataMap.set(key, item.totalAmount);
      }
    });

    const categories: string[] = [];
    const seriesData: number[] = [];

    // Generate last 'days' dates
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      categories.push(key);
      seriesData.push(dataMap.get(key) || 0); // Zero-fill if not found
    }

    return { categories, seriesData };
  }, [history, days]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] h-[400px] flex items-center justify-center">
        <div className="text-gray-500">Loading Revenue Data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] h-[400px] flex items-center justify-center">
        <div className="text-error-500">Failed to load revenue history</div>
      </div>
    );
  }

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#E57A38"], // Brand color
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
      size: chartData.seriesData.length === 1 ? 5 : 0, // Only show markers if very few points or specifically needed
      colors: ["#fff"],
      strokeColors: "#E57A38",
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
        formatter: (val) => `ETB ${val.toLocaleString()}`,
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
        text: "Revenue (ETB)",
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
      name: "Total Revenue",
      data: chartData.seriesData,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue History</h3>
          <p className="text-sm text-gray-500">Daily aggregate of successful payments</p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value={7}>Last 7 Days</option>
          <option value={14}>Last 14 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>
      <div id="revenue-chart">
        <Chart options={options} series={series} type="area" height={350} />
      </div>
    </div>
  );
};

export default RevenueLineChart;
