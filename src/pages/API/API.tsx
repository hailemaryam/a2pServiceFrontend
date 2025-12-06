import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  PlusIcon,
  TrashBinIcon,
  EyeIcon,
  CopyIcon,
  FileIcon,
  CloseIcon,
} from "../../icons";

// --- Data Structure for the Table ---
interface ApiToken {
  id: number;
  token: string;
  senderId: string;
  date: string;
}

const apiTokens: ApiToken[] = [
  {
    id: 1,
    token: "****************************",
    senderId: "Unavailable",
    date: "20/08/25",
  },
  {
    id: 2,
    token: "****************************",
    senderId: "Unavailable",
    date: "25/08/25",
  },
];

export default function API() {
  const [tokens, setTokens] = useState<ApiToken[]>(apiTokens);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [senderId, setSenderId] = useState("");
  const [permissions, setPermissions] = useState("");

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    // You can add a toast notification here
  };

  const handleDeleteToken = (id: number) => {
    setTokens(tokens.filter((token) => token.id !== id));
  };

  const handleCreateApi = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setSenderId("");
    setPermissions("");
  };

  const handleSaveApi = () => {
    // Add logic to save API token
    console.log("Saving API:", { senderId, permissions });
    closeCreateModal();
  };

  return (
    <div>
      <PageMeta
        title="API | Fast SMS"
        description="Manage your API tokens and settings"
      />
      <PageBreadcrumb pageTitle="API" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto max-w-6xl">
          {/* 1. API Instructions */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800/50">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-800 dark:text-white">
                For API usage please use:
              </p>
              <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600">
                <FileIcon className="h-4 w-4" />
                Docs
              </button>
            </div>
            <div className="mb-3 text-brand-500 dark:text-brand-400">
              https://els-lottery.name.et/api/v1/private/sms/send
            </div>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              URL in POST method using body, JSON:
            </p>
            <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-100 p-4 font-mono text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              {`{
  "message": "hi",
  "phoneNumber": "0900640160"
}`}
            </pre>
          </div>

          {/* 2. Search and Action Section */}
          <div className="mb-8 flex items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
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
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            {/* Create API Button */}
            <button
              onClick={handleCreateApi}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700"
            >
              <PlusIcon className="h-5 w-5" />
              Create API
            </button>
          </div>

          {/* 3. API Token Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Sender ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-white/[0.03]">
                {tokens.map((token) => (
                  <tr
                    key={token.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                          {token.token}
                        </span>
                        <button
                          className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          title="View Token"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCopyToken(token.token)}
                          className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          title="Copy Token"
                        >
                          <CopyIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {token.senderId}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {token.date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        onClick={() => handleDeleteToken(token.id)}
                        className="text-error-500 transition hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
                        title="Delete Token"
                      >
                        <TrashBinIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create API Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900">
            {/* Close Button */}
            <button
              onClick={closeCreateModal}
              className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <CloseIcon className="h-6 w-6" />
            </button>

            {/* Modal Header */}
            <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
              <h3 className="pr-8 text-xl font-semibold text-gray-900 dark:text-white">
                API Information
              </h3>
            </div>

            {/* Modal Content */}
            <div className="space-y-6">
              {/* Sender ID */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sender ID
                </label>
                <select
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">Choose sender ID</option>
                  <option value="TamSMS">TamSMS</option>
                  <option value="ServiceAlert">ServiceAlert</option>
                </select>
              </div>

              {/* Permissions */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Permissions
                </label>
                <select
                  value={permissions}
                  onChange={(e) => setPermissions(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">Choose permission(s)</option>
                  <option value="Read">Read</option>
                  <option value="Write">Write</option>
                  <option value="Read/Write">Read/Write</option>
                </select>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveApi}
                className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
