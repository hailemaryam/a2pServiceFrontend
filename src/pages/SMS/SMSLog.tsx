import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

// Type definitions for a single SMS record
interface SmsRecord {
  id: string;
  message: string;
  contact: string;
  status: "PENDING" | "SENT" | "FAILED" | "Deliverd";
  tagName: string;
  date: string;
}

// Dummy Data
const dummyLogs: SmsRecord[] = [
  {
    id: "ELS",
    message: "test",
    contact: "0980269063",
    status: "PENDING",
    tagName: "N/A",
    date: "10/08",
  },
  {
    id: "ELS",
    message: "hi",
    contact: "0900640160",
    status: "PENDING",
    tagName: "N/A",
    date: "09/24",
  },
  {
    id: "ELS",
    message: "yes sofo it works",
    contact: "+251912063417",
    status: "PENDING",
    tagName: "N/A",
    date: "09/24",
  },
  {
    id: "ELS",
    message: "test kal",
    contact: "0900640160",
    status: "PENDING",
    tagName: "N/A",
    date: "09/24",
  },
  {
    id: "ELS",
    message: "test kal",
    contact: "0900640160",
    status: "PENDING",
    tagName: "N/A",
    date: "09/24",
  },
  {
    id: "ELS",
    message: "test kal",
    contact: "0900640160",
    status: "PENDING",
    tagName: "N/A",
    date: "09/24",
  },
  {
    id: "ELS",
    message: "test kal",
    contact: "0900640160",
    status: "PENDING",
    tagName: "N/A",
    date: "09/24",
  },
];

export default function SMSLog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const totalPages = 5;

  // Function to determine badge style based on status
  const getStatusBadge = (status: SmsRecord["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-warning-100 text-warning-800 rounded-full dark:bg-warning-500/10 dark:text-warning-400">
            PENDING
          </span>
        );
      case "SENT":
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-success-100 text-success-800 rounded-full dark:bg-success-500/10 dark:text-success-400">
            SENT
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-error-100 text-error-800 rounded-full dark:bg-error-500/10 dark:text-error-400">
            FAILED
          </span>
        );
      case "Deliverd":
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-success-100 text-success-800 rounded-full dark:bg-success-500/10 dark:text-success-400">
            Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full dark:bg-gray-800 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  // Helper for Pagination rendering
  const renderPagination = () => {
    const pagesToShow = [1, 2, 3, 4, 5];
    return (
      <div className="flex justify-center items-center mt-6 space-x-1">
        <button
          className="p-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          &laquo;
        </button>
        <button
          className="p-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          &lsaquo;
        </button>

        {pagesToShow.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              currentPage === page
                ? "bg-brand-500 text-white dark:bg-brand-500"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          className="p-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          &rsaquo;
        </button>
        <button
          className="p-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
        >
          &raquo;
        </button>
      </div>
    );
  };

  return (
    <div>
      <PageMeta title="SMS LOG | Fast SMS" description="SMS sending history and logs" />
      <PageBreadcrumb pageTitle="SMS LOG" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="font-sans">
          {/* --- Header/Navigation --- */}
          <div className="flex justify-between items-center mb-8">
            {/* <h1 className="text-3xl font-bold text-gray-800 dark:text-white">SMS LOG</h1> */}
            <div className="text-sm text-brand-500 dark:text-brand-400">
              {/* <span className="text-gray-500 dark:text-gray-400">Dashboard / </span>
              <span className="font-medium ml-1">SMS LOG</span> */}
            </div>
          </div>

          {/* --- Filter and Search Bar --- */}
          <div className="bg-white dark:bg-white/[0.03] p-6 rounded-xl shadow-theme-md border border-gray-200 dark:border-gray-800 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* Phone Number / Contact Name Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Phone Number / Contact Name"
                    className="w-full h-11 rounded-lg border border-gray-300 bg-transparent px-10 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              {/* Tag Name Search */}
              <div className="md:col-span-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tag Name"
                    className="w-full h-11 rounded-lg border border-gray-300 bg-transparent px-10 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h.01M7 3h5.653a4 4 0 013.91 3.551L17 12l-1.437 5.449a4 4 0 01-3.91 3.551H7a4 4 0 01-4-4V7a4 4 0 014-4z"
                    ></path>
                  </svg>
                </div>
              </div>
              {/* Status Dropdown */}
              <div className="md:col-span-1">
                <select
                  className="w-full h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                  defaultValue="All Status"
                >
                  <option value="All Status">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="SENT">Sent</option>
                  <option value="FAILED">Failed</option>
                  <option value="Deliverd">Delivered</option>
                </select>
              </div>
              {/* Date Picker */}
              <div className="md:col-span-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-11 rounded-lg border border-gray-300 bg-transparent px-4 pr-10 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                  <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h.01M12 11h.01M16 11h.01M4 21h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </button>
                  {isCalendarOpen && (
                    <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-theme-lg p-4">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setIsCalendarOpen(false);
                        }}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Refresh Button */}
              <div className="md:col-span-1">
                <button className="flex items-center justify-center w-full h-11 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-theme-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-150">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 0012 4.079V1m0 0l3 3m-3-3l-3 3m1.412 11.086c-.57.994-1.398 1.839-2.398 2.502s-2.071 1.09-3.267 1.09-2.385-.36-3.267-1.09c-.999-.663-1.828-1.508-2.398-2.502M12 21.079V23m0 0l-3-3m3 3l3-3"
                    ></path>
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* --- SMS Log Table --- */}
          <div className="overflow-x-auto bg-white dark:bg-white/[0.03] rounded-xl shadow-theme-md border border-gray-200 dark:border-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    message
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    status
                  </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]"
                    >
                      Tag Name
                    </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-white/[0.03] divide-y divide-gray-200 dark:divide-gray-700">
                {dummyLogs.map((log, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {log.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(log.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="block truncate max-w-[150px]" title={log.tagName}>
                        {log.tagName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* --- Pagination --- */}
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
}
