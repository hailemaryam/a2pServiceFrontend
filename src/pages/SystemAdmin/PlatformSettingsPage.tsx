import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  useGetPlatformDailySmsLimitQuery,
  useUpdatePlatformDailySmsLimitMutation,
} from "../../api/adminApi";
import { toast } from "react-toastify";

export default function PlatformSettingsPage() {
  const { data, isLoading, error } = useGetPlatformDailySmsLimitQuery();
  const [updateDailyLimit, { isLoading: isSaving }] = useUpdatePlatformDailySmsLimitMutation();
  const [dailyLimitInput, setDailyLimitInput] = useState("");

  useEffect(() => {
    if (data?.dailySmsLimit != null) {
      setDailyLimitInput(String(data.dailySmsLimit));
    } else {
      setDailyLimitInput("");
    }
  }, [data?.dailySmsLimit]);

  const handleSave = async () => {
    const trimmed = dailyLimitInput.trim();
    const nextLimit = trimmed === "" ? null : Number(trimmed);

    if (nextLimit !== null && (!Number.isInteger(nextLimit) || nextLimit <= 0)) {
      toast.error("Daily SMS limit must be a positive whole number.");
      return;
    }

    try {
      await updateDailyLimit({ dailySmsLimit: nextLimit }).unwrap();
      toast.success(nextLimit == null ? "Platform daily limit cleared." : "Platform daily limit updated.");
    } catch (err) {
      console.error("Failed to update platform daily SMS limit", err);
      toast.error("Failed to update platform daily SMS limit.");
    }
  };

  const handleClear = async () => {
    try {
      await updateDailyLimit({ dailySmsLimit: null }).unwrap();
      setDailyLimitInput("");
      toast.success("Platform daily limit cleared.");
    } catch (err) {
      console.error("Failed to clear platform daily SMS limit", err);
      toast.error("Failed to clear platform daily SMS limit.");
    }
  };

  return (
    <>
      <PageMeta title="Platform Settings | Fast SMS" description="Manage platform-wide settings" />
      <PageBreadcrumb pageTitle="Platform Settings" />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Daily SMS Limit
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This platform limit applies to tenants that do not have their own override.
            </p>
          </div>

          {isLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading settings...</p>
          ) : error ? (
            <p className="text-sm text-error-600 dark:text-error-400">Failed to load settings.</p>
          ) : (
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full lg:max-w-md">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Platform daily recipient limit
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={dailyLimitInput}
                  onChange={(event) => setDailyLimitInput(event.target.value)}
                  placeholder="Unlimited"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Empty means unlimited unless a tenant-specific limit is set.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-11 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </button>
                <button
                  onClick={handleClear}
                  disabled={isSaving}
                  className="h-11 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Clear Limit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
