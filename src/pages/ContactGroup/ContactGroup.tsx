import { useState, FormEvent, useEffect } from "react";
import { useSearchParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  GroupIcon,
  PencilIcon,
  TrashBinIcon,
  CloseIcon,
  DownloadIcon,
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

export default function ContactGroup() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [groupSearch, setGroupSearch] = useState("");

  // Modal states
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Check if we should open the group modal from URL
  useEffect(() => {
    if (searchParams.get("openGroupModal") === "true") {
      setIsGroupModalOpen(true);
      // Remove the query parameter from URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Form states
  const [groupName, setGroupName] = useState("");
  const [groupColor, setGroupColor] = useState("#000000");

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

  return (
    <div>
      <PageMeta
        title="Contact Group | Fast SMS"
        description="Manage your contact groups"
      />
      <PageBreadcrumb pageTitle="Contact Group" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto max-w-5xl">
          {/* Top Header Section */}
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
            {/* <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Contact Group
            </h2> */}
          </div>

          {/* Main Content Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
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
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {groupColor}
                  </span>
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
    </div>
  );
}

