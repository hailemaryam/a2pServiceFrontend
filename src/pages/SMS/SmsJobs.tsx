import { useState, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useGetSmsJobsQuery } from "../../api/smsApi";

export default function SmsJobs() {
  const [page, setPage] = useState(0);
  const [size] = useState(20);

  const [statusFilter, setStatusFilter] = useState<string>("");

  const {
    data: smsJobsData,
    isLoading,
    error,
    refetch,
  } = useGetSmsJobsQuery({ page, size, status: statusFilter || undefined });

  const jobs = smsJobsData?.items ?? [];
  const total = smsJobsData?.total ?? 0;

  const totalPages = useMemo(() => {
    if (!size) return 1;
    return Math.max(1, Math.ceil(total / size));
  }, [size, total]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 0 || nextPage > totalPages - 1) return;
    setPage(nextPage);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400";
        case "SENDING":
          return "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400";
      case "FAILED":
        return "text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400";
      case "PENDING_APPROVAL":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div>
      <PageMeta title="SMS Jobs | Fast SMS" description="View your SMS sending history" />
      <PageBreadcrumb pageTitle="SMS Jobs History" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center border-b border-gray-200 pb-4 dark:border-gray-700">
             
             <div className="flex items-center gap-3 ml-auto">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                className="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-white dark:focus:border-brand-800"
              >
                <option value="">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="SENDING">Sending</option>
                <option value="FAILED">Failed</option>
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>

              <button
                  onClick={() => refetch()}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
              >
                  Refresh
              </button>
             </div>
            </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
               <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
              Failed to load SMS Jobs.
            </div>
          ) : jobs.length === 0 ? (
             <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-16 dark:border-gray-800 dark:bg-gray-800/50">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No SMS Jobs found.
                </p>
              </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-800">
                <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Type
                    </th>
                     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Recipients
                    </th>
                     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      SMS Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Status
                    </th>
                     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Approval
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                         {new Date(job.createdAt).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                             {job.jobType}
                        </span>
                      </td>
                       <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {job.totalRecipients}
                      </td>
                       <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {job.totalSmsCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" title={job.message}>
                        {job.message}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                       <td className="whitespace-nowrap px-6 py-4 text-sm">
                           <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${job.approvalStatus === 'APPROVED' ? 'text-green-600 bg-green-50' : job.approvalStatus === 'REJECTED' ? 'text-red-600 bg-red-50' : 'text-yellow-600 bg-yellow-50'}`}>
                             {job.approvalStatus}
                           </span>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-200">
                <div>
                  Page {page + 1} of {totalPages} · {total} total
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 0}
                  >
                    Previous
                  </button>
                  <button
                    className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
