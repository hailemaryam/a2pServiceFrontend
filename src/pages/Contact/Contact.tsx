import { useState, FormEvent } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  DownloadIcon,
  PlusIcon,
  GroupIcon,
  PencilIcon,
  TrashBinIcon,
  CloseIcon,
  CalenderIcon,
} from "../../icons";

// Type definition for Group
interface Group {
  id: number;
  name: string;
  createdAt: string;
  contactCount: number;
}

const dummyGroups: Group[] = [
  {
    id: 1,
    name: "tamcon-dev",
    createdAt: "16/08/2025",
    contactCount: 0,
  },
];

export default function Contact() {
  const [activeTab, setActiveTab] = useState<"contacts" | "groups">("contacts");
  const [groupSearch, setGroupSearch] = useState("");
  
  // Modal states
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Form states
  const [groupName, setGroupName] = useState("");
  const [groupColor, setGroupColor] = useState("#000000");
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Handlers
  const handleGroupSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      alert("Group Name is required.");
      return;
    }
    console.log("Creating group:", { name: groupName, color: groupColor });
    // Reset form
    setGroupName("");
    setGroupColor("#000000");
    setIsGroupModalOpen(false);
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !phoneNumber.trim()) {
      alert("Contact Name and Phone Number are required.");
      return;
    }
    console.log("Creating contact:", { contactName, phoneNumber, gender, birthDate });
    // Reset form
    setContactName("");
    setPhoneNumber("");
    setGender("");
    setBirthDate("");
    setIsContactModalOpen(false);
  };

  const handleUploadSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) {
      alert("Please select a file to upload.");
      return;
    }
    console.log("Uploading contacts:", { file: uploadedFile.name, group: selectedGroup });
    // Reset form
    setUploadedFile(null);
    setSelectedGroup("");
    setIsUploadModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedFile(file);
  };

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

                {activeTab === "contacts" && (
                  <>
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
                      <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
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
                        onClick={() => setIsContactModalOpen(true)}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                      >
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
                  </>
                )}

                {activeTab === "groups" && (
                  <>
                    {/* Search Bar for Groups */}
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
                        placeholder="Group Name"
                        value={groupSearch}
                        onChange={(e) => setGroupSearch(e.target.value)}
                        className="h-11 w-full max-w-xs rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>

                    {/* Action Toolbar for Groups */}
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
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Upload Groups
                      </button>
                      <button
                        onClick={() => setIsGroupModalOpen(true)}
                        className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
                      >
                        <GroupIcon className="h-4 w-4" />
                        Create Group
                      </button>
                    </div>

                    {/* Groups Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              Group Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              Created At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              Number of Contacts
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-white/[0.03]">
                          {dummyGroups.map((group) => (
                            <tr
                              key={group.id}
                              className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                            >
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                {group.name}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {group.createdAt}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {group.contactCount}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    title="Download Group"
                                  >
                                    <DownloadIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    title="Edit Group"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="text-error-500 transition hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
                                    title="Delete Group"
                                  >
                                    <TrashBinIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

              {/* Download Contacts Button - Positioned on the right (only show for contacts tab) */}
              {activeTab === "contacts" && (
                <div className="ml-6">
                  <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600">
                    <DownloadIcon className="h-5 w-5" />
                    Download Contacts
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Group Information Modal */}
      {isGroupModalOpen && (
        <div
          className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsGroupModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsGroupModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <CloseIcon className="h-6 w-6" />
            </button>

            {/* Modal Header */}
            <div className="mb-5 border-b border-gray-200 pb-3 dark:border-gray-700">
              <h3 className="pr-8 text-lg font-semibold text-gray-900 dark:text-white">
                Group Information
              </h3>
            </div>
            <form onSubmit={handleGroupSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="groupName"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Group Name
                </label>
                <input
                  id="groupName"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label
                  htmlFor="groupColor"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="groupColor"
                    type="color"
                    value={groupColor}
                    onChange={(e) => setGroupColor(e.target.value)}
                    className="h-11 w-20 cursor-pointer rounded-lg border border-gray-300 bg-transparent dark:border-gray-700"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">{groupColor}</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Information Modal */}
      {isContactModalOpen && (
        <div
          className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsContactModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <CloseIcon className="h-6 w-6" />
            </button>

            {/* Modal Header */}
            <div className="mb-5 border-b border-gray-200 pb-3 dark:border-gray-700">
              <h3 className="pr-8 text-lg font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h3>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="contactName"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Contact Name
                </label>
                <input
                  id="contactName"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0912345678"
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="birthDate"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Birth Date
                </label>
                <div className="relative flex items-center">
                  <input
                    id="birthDate"
                    type="text"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    placeholder="dd/mm/yyyy"
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-4 pr-10 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                  <CalenderIcon className="pointer-events-none absolute right-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upload Contacts Modal */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <CloseIcon className="h-6 w-6" />
            </button>

            {/* Modal Header */}
            <div className="mb-5 border-b border-gray-200 pb-3 dark:border-gray-700">
              <h3 className="pr-8 text-lg font-semibold text-gray-900 dark:text-white">
                Upload Contacts
              </h3>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  accept=".csv,.xlsx,.xls"
                />
                <div className="flex min-h-[100px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-brand-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-brand-800">
                  <svg
                    className="mb-4 h-12 w-12 text-gray-400"
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {uploadedFile
                      ? uploadedFile.name
                      : "Drop or click to upload a file"}
                  </p>
                </div>
              </div>
              <div>
                <label
                  htmlFor="uploadGroup"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Select Group
                </label>
                <select
                  id="uploadGroup"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">Select Group</option>
                  {dummyGroups.map((group) => (
                    <option key={group.id} value={group.name}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  type="submit"
                  className="rounded-lg bg-[#36304a] px-6 py-3 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-[#2a2538]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-lg bg-gray-500 px-6 py-3 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
