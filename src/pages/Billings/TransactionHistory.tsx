import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import { CloseIcon } from "../../icons";
import {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
} from "../../api/paymentApi";

// --- Components ---

const TransactionDetailModal = ({
  transactionId,
  onClose,
}: {
  transactionId: string;
  onClose: () => void;
}) => {
  const {
    data: transaction,
    isLoading,
    error,
  } = useGetTransactionByIdQuery(transactionId);

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
          Transaction Details
        </h3>

        {isLoading ? (
          <div className="py-10 text-center">Loading details...</div>
        ) : error || !transaction ? (
          <div className="py-10 text-center text-error-500">
            Failed to load transaction details.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Transaction ID
                </p>
                <p className="font-mono text-sm font-medium text-gray-900 dark:text-white break-all">
                  {transaction.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(transaction.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Amount Paid
                </p>
                <p className="text-lg font-bold text-brand-500">
                  ETB {transaction.amountPaid.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  SMS Credits
                </p>
                <p className="text-lg font-bold text-success-600">
                  +{transaction.smsCredited.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Status
              </p>
              <Badge
                color={
                  transaction.paymentStatus === "SUCCESSFUL"
                    ? "success"
                    : transaction.paymentStatus === "FAILED"
                    ? "error"
                    : transaction.paymentStatus === "IN_PROGRESS"
                    ? "warning"
                    : "default"
                }
              >
                {transaction.paymentStatus}
              </Badge>
            </div>

            {transaction.smsPackage && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Package Details
                </p>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {transaction.smsPackage.description || "Custom Package"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Range: {transaction.smsPackage.minSmsCount} -{" "}
                    {transaction.smsPackage.maxSmsCount || "Unlimited"} SMS
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function TransactionHistory() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Fetch transactions list
  const { data, isLoading, error } = useGetTransactionsQuery({
    page,
    size: pageSize,
    status: statusFilter || undefined,
  });

  const transactions = data?.items || [];
  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <div>
      <PageMeta
        title="Transaction History | Fast SMS"
        description="View your payment history and transactions"
      />
      <PageBreadcrumb pageTitle="Transaction History" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {/* Header & Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 ml-auto">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-white dark:focus:border-brand-800"
            >
              <option value="">All Statuses</option>
              <option value="SUCCESSFUL">Successful</option>
              <option value="FAILED">Failed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-10 text-center text-gray-500">
              Loading transactions...
            </div>
          ) : error ? (
            <div className="py-10 text-center text-error-500">
              Failed to load transactions.
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No transactions found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Transaction ID</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-right">Credits</th>
                  <th className="px-4 py-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => navigate(`/transactions/${tx.id}`)}
                    className="border-b border-gray-100 last:border-0 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleDateString()}{" "}
                      <span className="text-xs text-gray-500 ml-1">
                        {new Date(tx.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-mono text-gray-500 dark:text-gray-400">
                      {tx.id.substring(0, 18)}...
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-right text-gray-900 dark:text-white">
                      ETB {tx.amountPaid.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-right text-success-600 dark:text-success-400">
                      +{tx.smsCredited.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge
                        color={
                          tx.paymentStatus === "SUCCESSFUL"
                            ? "success"
                            : tx.paymentStatus === "FAILED"
                            ? "error"
                            : tx.paymentStatus === "IN_PROGRESS"
                            ? "warning"
                            : "default"
                        }
                      >
                        {tx.paymentStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {data && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {page + 1} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="rounded px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {transactionId && (
        <TransactionDetailModal
          transactionId={transactionId}
          onClose={() => navigate("/transactions")}
        />
      )}
    </div>
  );
}
