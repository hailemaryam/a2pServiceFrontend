import { useParams, useNavigate, useSearchParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import { useGetTransactionByIdQuery } from "../../api/paymentApi";
import { useEffect } from "react";

export default function TransactionDetail() {
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Resolve ID: if paramId is a placeholder, try getting from query params
  const transactionId =
    paramId && paramId !== "check-status" && paramId !== "verify"
      ? paramId
      : searchParams.get("transactionId") ||
        searchParams.get("id") ||
        searchParams.get("tx_ref") ||
        null;

  useEffect(() => {
    // If we are on check-status but found an ID in params, update state or URL
    if ((paramId === "check-status" || paramId === "verify") && transactionId) {
      // Optionally update URL to be clean: navigate(`/transactions/${transactionId}`, { replace: true });
    }
  }, [paramId, transactionId]);

  const {
    data: transaction,
    isLoading,
    error,
  } = useGetTransactionByIdQuery(transactionId || "", {
    skip: !transactionId,
  });

  if (!transactionId && (paramId === "check-status" || paramId === "verify")) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Verifying Payment...
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we look for your transaction.
        </p>
        <button
          onClick={() => navigate("/billings-form")}
          className="mt-4 text-brand-500 hover:text-brand-600 font-medium"
        >
          Go to Transaction History
        </button>
      </div>
    );
  }

  if (!transactionId) {
    return (
      <div className="p-10 text-center text-error-500">
        Invalid Transaction ID
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title={`Transaction ${transactionId?.substring(0, 8)} | Fast SMS`}
        description="Transaction Details"
      />
      <PageBreadcrumb pageTitle="Transaction Details" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Transaction Details
            </h2>
            <button
              onClick={() => navigate("/billings-form")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Back to History
            </button>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-brand-500"></div>
              <p className="mt-2 text-gray-500">Loading details...</p>
            </div>
          ) : error || !transaction ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
              <p className="font-semibold">
                Failed to load transaction details.
              </p>
              <p className="text-sm mt-1">Please check the ID and try again.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
              {/* Status Header */}
              <div className="mb-8 flex flex-col items-center justify-center border-b border-gray-200 pb-8 dark:border-gray-700 sm:flex-row sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Amount
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ETB {transaction.amountPaid.toFixed(2)}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
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
                    size="lg"
                  >
                    {transaction.paymentStatus}
                  </Badge>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Transaction ID
                  </p>
                  <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white break-all">
                    {transaction.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Date & Time
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    SMS Credits Added
                  </p>
                  <p className="mt-1 text-lg font-semibold text-success-600 dark:text-success-400">
                    +{transaction.smsCredited.toLocaleString()}
                  </p>
                </div>

                {transaction.smsPackage && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Package
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {transaction.smsPackage.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      ({transaction.smsPackage.minSmsCount} -{" "}
                      {transaction.smsPackage.maxSmsCount || "Unlimited"} SMS)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
