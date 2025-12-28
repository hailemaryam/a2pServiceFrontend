import { useState } from "react";
import { useGetAllTransactionsQuery } from "../../api/adminApi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function SystemAdminTransactions() {
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [statusFilter, setStatusFilter] = useState("");
  const [tenantIdFilter, setTenantIdFilter] = useState("");

  const { data, isLoading, error } = useGetAllTransactionsQuery({
    page,
    size,
    status: statusFilter || undefined,
    tenantId: tenantIdFilter || undefined,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
        return "text-green-500 bg-green-50 dark:bg-green-500/10";
      case "FAILED":
        return "text-red-500 bg-red-50 dark:bg-red-500/10";
      case "IN_PROGRESS":
        return "text-blue-500 bg-blue-50 dark:bg-blue-500/10";
      case "CANCELED":
        return "text-gray-500 bg-gray-50 dark:bg-gray-500/10";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-500/10";
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < (data?.total ? Math.ceil(data.total / size) : 1)) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading Transactions...</div>
    );
  }

  return (
    <>
      <PageMeta
        title="All Transactions | Fast SMS"
        description="View all system payment transactions"
      />
      <PageBreadcrumb pageTitle="All Transactions" />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h3 className="hidden lg:block text-lg font-semibold text-gray-900 dark:text-white">
              Transactions
            </h3>
            
            <div className="flex flex-col gap-3 sm:flex-row w-full lg:w-auto">
              {/* Filter by Tenant ID */}
              <input
                type="text"
                placeholder="Filter by Tenant ID"
                value={tenantIdFilter}
                onChange={(e) => {
                  setTenantIdFilter(e.target.value);
                  setPage(0);
                }}
                className="w-full sm:w-64 h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all dark:border-gray-700 dark:text-white dark:focus:border-brand-800"
              />

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                className="w-full sm:w-auto h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all dark:border-gray-700 dark:text-white dark:focus:border-brand-800"
              >
                <option value="">All Statuses</option>
                <option value="SUCCESSFUL">Successful</option>
                <option value="FAILED">Failed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>
          </div>

          {error ? (
            <div className="p-4 text-center text-red-500">
              Failed to load transactions.
            </div>
          ) : data?.items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No transactions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap text-left text-sm">
                <thead className="bg-gray-100 dark:bg-white/[0.03]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">ID</th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">Tenant ID</th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">Amount</th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">Credits</th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">Package</th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {data?.items.map((tx) => (
                    <tr 
                      key={tx.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {tx.id.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {tx.tenantId.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        ${tx.amountPaid.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {tx.smsCredited.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {tx.smsPackage?.description || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                            tx.paymentStatus
                          )}`}
                        >
                          {tx.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {data && data.total > 0 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-4 dark:border-gray-800 sm:flex-row">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing {data.page * data.size + 1} to{" "}
                {Math.min((data.page + 1) * data.size, data.total)} of{" "}
                {data.total} entries
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-white/[0.03]"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={
                    (page + 1) * size >= data.total
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-white/[0.03]"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
