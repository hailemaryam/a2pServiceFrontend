import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  DownloadIcon,
  PlusIcon,
  FileIcon,
} from "../../icons";

export default function Contact() {
  const [activeTab, setActiveTab] = useState<"contacts" | "groups">("contacts");

  return (
    <div>
      <PageMeta
        title="Contact Template | Fast SMS"
        description="Manage your contacts and groups"
      />
      <PageBreadcrumb pageTitle="Contact Template" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto max-w-5xl">
          {/* Top Header Section */}
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Contact Template
            </h2>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]">
              <DownloadIcon className="h-4 w-4" />
              Download Template
            </button>
          </div>

          {/* Main Content Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
            {/* Tabs and Download Contacts Button in the same row */}
            <div className="mb-6 flex items-start justify-between">
              {/* Tabs */}
              <div className="flex-1">
                <div className="mb-6 flex gap-8 border-b-2 border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setActiveTab("contacts")}
                    className={`pb-3 font-medium transition-colors ${
                      activeTab === "contacts"
                        ? "border-b-2 border-error-500 text-error-600 dark:text-error-400"
                        : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Contacts
                  </button>
                  <button
                    onClick={() => setActiveTab("groups")}
                    className={`pb-3 font-medium transition-colors ${
                      activeTab === "groups"
                        ? "border-b-2 border-error-500 text-error-600 dark:text-error-400"
                        : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Groups
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Phone Number / Contact Name"
                    className="h-11 w-full max-w-md rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>

                {/* Action Toolbar */}
                <div className="mb-6 flex flex-wrap gap-3">
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Refresh
                  </button>
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload Contacts
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]">
                    <PlusIcon className="h-4 w-4" />
                    Create Contact
                  </button>
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-16 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="mb-4">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400 dark:text-gray-500"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="9" x2="15" y2="9"></line>
                      <line x1="9" y1="13" x2="15" y2="13"></line>
                      <line x1="9" y1="17" x2="15" y2="17"></line>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No contacts found by this name.
                  </p>
                </div>
              </div>

              {/* Download Contacts Button - Positioned on the right */}
              <div className="ml-6">
                <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600">
                  <DownloadIcon className="h-5 w-5" />
                  Download Contacts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
