import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useGetSmsOverviewQuery } from "../../api/dashboardApi";

const SmsOverviewChart: React.FC = () => {
  const { data: overview, isLoading, error } = useGetSmsOverviewQuery();

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
  const categories = overview.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
  
  const seriesData = overview.map((item) => item.count);

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
          <p className="text-sm text-gray-500">Daily message traffic summary</p>
        </div>
      </div>
      <div id="sms-overview-chart">
        <Chart options={options} series={series} type="area" height={350} />
      </div>
    </div>
  );
};

export default SmsOverviewChart;
