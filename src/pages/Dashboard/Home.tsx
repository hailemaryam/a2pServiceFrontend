import { useState } from "react";
import { useFetchContactsQuery } from "../../api/contactsApi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { DownloadIcon, PlusIcon, FileIcon, GroupIcon } from "../../icons";


/**
 * Renders the main Contact Management interface.
 */
export default function Home() {
  // State for the search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  // State to track the active tab
  const [activeTab, setActiveTab] = useState<"contacts" | "groups">("contacts");

  // Fetch contacts from API
  const { data: contactsData, isLoading, isError, refetch } = useFetchContactsQuery({ 
    page: 0, 
    size: 50 // Fetching more for the dashboard view
  });

  const contacts = contactsData?.items || [];

  // --- Handlers for button actions ---

  const handleDownloadTemplate = () => {
    console.log("Downloading contact template...");
    // Logic to initiate file download
  };

  const handleDownloadContacts = () => {
    console.log("Downloading all contacts...");
    // Logic to export current contacts data
  };

  const handleRefresh = () => {
    console.log("Refreshing contact list...");
    refetch();
  };

  const handleUploadContacts = () => {
    console.log("Opening contact upload dialogue...");
    // Logic to trigger file upload input
  };

  const handleCreateContact = () => {
    console.log("Opening 'Create Contact' form...");
    // Logic to navigate to or display a contact creation form
  };

  // --- Filtering logic ---

  const filteredContacts = contacts.filter(
    (contact) =>
      (contact.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
  );

  return (
    <div>
      <PageMeta
        title="Fast SMS "
        description="Welcome to  Fast SMS."
      />
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="contact-management-container">
          {/* Header section with Download Template button */}
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Contact Template
            </h2>
            <button
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
              onClick={handleDownloadTemplate}
            >
              <DownloadIcon className="h-4 w-4" />
              Download Template
            </button>
          </div>

          {/* Main content area */}
          <div className="main-content-area">
            <div className="mb-6 flex items-center justify-between">
              {/* Tabs: Contacts and Groups */}
              <div className="flex gap-2">
                <button
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeTab === "contacts"
                      ? "bg-brand-500 text-white shadow-theme-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("contacts")}
                >
                  Contacts
                </button>
                <button
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeTab === "groups"
                      ? "bg-brand-500 text-white shadow-theme-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("groups")}
                >
                  Groups
                </button>
              </div>

              {/* Download Contacts button */}
              <button
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                onClick={handleDownloadContacts}
              >
                <DownloadIcon className="h-4 w-4" />
                Download Contacts
              </button>
            </div>

            {activeTab === "contacts" && (
              <div className="contacts-view">
                {/* Search Input */}
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>

                {/* Action Buttons */}
                <div className="mb-6 flex flex-wrap gap-3">
                  <button
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                    onClick={handleRefresh}
                  >
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
                  <button
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                    onClick={handleUploadContacts}
                  >
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
                  <button
                    className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
                    onClick={handleCreateContact}
                  >
                    <PlusIcon className="h-4 w-4" />
                    Create Contact
                  </button>
                </div>

                {/* Contact List / No Contacts Found Message */}
                {isError ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 py-8 dark:border-red-900/50 dark:bg-red-900/10">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Failed to load contacts. Please try refreshing.
                    </p>
                    <button 
                      onClick={() => refetch()}
                      className="mt-2 text-sm font-medium text-red-600 underline hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Retry
                    </button>
                  </div>
                ) : isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                     <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
                     <p className="mt-4 text-sm text-gray-500">Loading contacts...</p>
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-12 dark:border-gray-800 dark:bg-gray-800/50">
                    <FileIcon className="mb-4 h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No contacts found matching your criteria.
                    </p>
                  </div>
                ) : (
                  <div className="contact-list space-y-3">
                     <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                      Showing {filteredContacts.length} contacts
                    </p>
                    {filteredContacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                      >
                         <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white">
                              {contact.name || "Unknown Name"}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {contact.phone}
                            </p>
                         </div>
                         <div className="flex gap-2">
                             {/* Placeholder actions */}
                             <button className="text-sm text-brand-500 hover:underline">Edit</button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "groups" && (
              <div className="groups-view">
                <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-12 dark:border-gray-800 dark:bg-gray-800/50">
                  <GroupIcon className="mb-4 h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Groups management interface goes here...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

