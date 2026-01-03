import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useGetTransactionHistoryQuery } from "../../api/adminApi";

const RevenueLineChart: React.FC = () => {
  const { data: history, isLoading, error } = useGetTransactionHistoryQuery({ days: 30 });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] h-[400px] flex items-center justify-center">
        <div className="text-gray-500">Loading Revenue Data...</div>
      </div>
    );
  }

  if (error || !history) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] h-[400px] flex items-center justify-center">
        <div className="text-error-500">Failed to load revenue history</div>
      </div>
    );
  }

  // Transform data for the chart
  const categories = history.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
  
  const seriesData = history.map((item) => item.totalAmount);

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#E57A38"], // Brand color
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 350,
      type: "line",
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
      data: seriesData,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue History (Last 30 Days)</h3>
          <p className="text-sm text-gray-500">Daily aggregate of successful payments</p>
        </div>
      </div>
      <div id="revenue-chart">
        <Chart options={options} series={series} type="area" height={350} />
      </div>
    </div>
  );
};

export default RevenueLineChart;
