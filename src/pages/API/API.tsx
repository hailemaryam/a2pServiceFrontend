import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  PlusIcon,
  TrashBinIcon,
  CopyIcon,
  CloseIcon,
} from "../../icons";
import {
  useGetApiKeysQuery,
  useCreateApiKeyMutation,
  useRevokeApiKeyMutation,
} from "../../api/apiKeyApi";
import { useGetSendersQuery } from "../../api/sendersApi";

export default function API() {
  const { data: tokens = [], isLoading } = useGetApiKeysQuery();
  const { data: senders = [] } = useGetSendersQuery();
  const [createApiKey, { isLoading: isCreating }] = useCreateApiKeyMutation();
  const [revokeApiKey] = useRevokeApiKeyMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [selectedSenderId, setSelectedSenderId] = useState("");

  // Helper to copy token to clipboard
  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    alert("Token copied to clipboard!");
  };

  // Handle Revoke
  const handleDeleteToken = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to revoke this API key? This cannot be undone."
      )
    ) {
      try {
        await revokeApiKey(id).unwrap();
      } catch (error) {
        console.error("Failed to revoke key", error);
        alert("Failed to revoke API key");
      }
    }
  };

  const handleCreateApi = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setKeyName("");
    setSelectedSenderId("");
  };

  const handleSaveApi = async () => {
    if (!keyName.trim()) {
      alert("Please enter a name for the API Key");
      return;
    }
    if (!selectedSenderId) {
      alert("Please select a Sender ID");
      return;
    }
    try {
      await createApiKey({
        name: keyName,
        senderId: selectedSenderId,
      }).unwrap();
      closeCreateModal();
    } catch (error) {
      console.error("Failed to create key", error);
      alert("Failed to create API key");
    }
  };

  const activeSenders = senders.filter((s) => s.status === "ACTIVE");

  return (
    <div>
      <PageMeta
        title="API | Fast SMS"
        description="Manage your API tokens and settings"
      />
      <PageBreadcrumb pageTitle="API" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto max-w-6xl">
          {/* 1. API Instructions */}
          <div className="mb-6 sm:mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-800/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Integration Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Endpoint URL (POST)</p>
                <code className="text-brand-500 dark:text-brand-400 break-all">
                  https://fastsms.dev/api/p/sms/send
                </code>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Headers</p>
                <div className="rounded border border-gray-200 bg-white p-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 font-mono">
                  API-Key: &lt;Your_API_Key_Below&gt;
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Request Body (JSON)</p>
                <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-100 p-4 font-mono text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
{`{
  "to": "2519...",
  "message": "Hello World",
  "scheduledAt": "2030-03-10T16:15:50Z",      // Optional
  "webhookUrl": "https://test.com/webhook"    // Optional
}`}
                </pre>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  * <code>scheduledAt</code> and <code>webhookUrl</code> are optional fields.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Search and Action Section */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 sm:max-w-md">
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
                placeholder="Search keys..."
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            {/* Create API Button */}
            <button
              onClick={handleCreateApi}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700"
            >
              <PlusIcon className="h-5 w-5" />
              Generate API Key
            </button>
          </div>

          {/* 3. API Token Table */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl border border-gray-200 bg-white shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Key Name
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      API Token
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Sender Name
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Created At
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-white/[0.03]">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Loading API keys...
                      </td>
                    </tr>
                  ) : tokens.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No API keys found. Generate one to get started.
                      </td>
                    </tr>
                  ) : (
                    tokens.map((token) => (
                      <tr
                        key={token.id}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                      >
                        <td className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 dark:text-white font-medium">
                          {token.name || "Unnamed Key"}
                        </td>
                        <td className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                              {token.apiKey
                                ? `${token.apiKey.substring(0, 8)}...`
                                : "****************"}
                            </span>
                            <button
                              onClick={() =>
                                handleCopyToken(token.apiKey || "")
                              }
                              className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                              title="Copy Token"
                            >
                              <CopyIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {token.senderName || "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {token.createdAt
                            ? new Date(token.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteToken(token.id)}
                              className="text-error-500 transition hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
                              title="Revoke Token"
                            >
                              <TrashBinIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create API Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeCreateModal}
              className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <CloseIcon className="h-6 w-6" />
            </button>

            <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
              <h3 className="pr-8 text-xl font-semibold text-gray-900 dark:text-white">
                Generate API Key
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Key Name (e.g. "Production App")
                </label>
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="Enter a name for this key"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Linked Sender ID
                </label>
                <select
                  value={selectedSenderId}
                  onChange={(e) => setSelectedSenderId(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">Select a sender ID</option>
                  {activeSenders.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Only ACTIVE sender IDs can be used.
                </p>
              </div>

              <button
                onClick={handleSaveApi}
                disabled={isCreating}
                className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700 disabled:opacity-50"
              >
                {isCreating ? "Generating..." : "Generate Key"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
