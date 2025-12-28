import { useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { CheckCircleIcon, CloseIcon } from "../../icons";
import { useGetPendingSendersQuery, useApproveSenderMutation, useRejectSenderMutation } from "../../api/adminApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SenderApprovalsPage() {
  const { data: senders = [], isLoading, error } = useGetPendingSendersQuery();
  const [approveSender, { isLoading: isApproving }] = useApproveSenderMutation();
  const [rejectSender, { isLoading: isRejecting }] = useRejectSenderMutation();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async (id: string) => {
    try {
      await approveSender(id).unwrap();
      toast.success("Sender approved successfully");
    } catch (err) {
      console.error("Failed to approve sender:", err);
      toast.error("Failed to approve sender. Please try again.");
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    try {
      await rejectSender({ id, reason: rejectionReason }).unwrap();
      toast.success("Sender rejected successfully");
      setRejectingId(null);
      setRejectionReason("");
    } catch (err) {
      console.error("Failed to reject sender:", err);
      toast.error("Failed to reject sender. Please try again.");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "APPROVED" || status === "ACTIVE") {
      return (
        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-success-100 text-success-800 rounded-full dark:bg-success-500/10 dark:text-success-400">
          Approved
        </span>
      );
    }
    if (status === "REJECTED" || status === "INACTIVE") {
      return (
        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-error-100 text-error-800 rounded-full dark:bg-error-500/10 dark:text-error-400">
          {status === "INACTIVE" ? "Inactive" : "Rejected"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-warning-100 text-warning-800 rounded-full dark:bg-warning-500/10 dark:text-warning-400">
        Pending
      </span>
    );
  };

  if (isLoading) {
    return (
      <>
        <PageMeta title="Sender Approvals | Fast SMS" description="Approve or reject sender ID requests" />
        <PageBreadcrumb pageTitle="Sender Approvals" />
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading sender requests...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMeta title="Sender Approvals | Fast SMS" description="Approve or reject sender ID requests" />
        <PageBreadcrumb pageTitle="Sender Approvals" />
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
            <div className="text-center py-12">
              <p className="text-error-600 dark:text-error-400">Failed to load sender requests. Please try again.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Sender Approvals | Fast SMS" description="Approve or reject sender ID requests" />
      <PageBreadcrumb pageTitle="Sender Approvals" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and approve sender ID requests from tenants
              </p>
            </div>
          </div>

          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-800">
                  <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Tenant
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Sender Name
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                     Message
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Created At
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {senders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      No pending sender requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  senders.map((sender) => (
                    <TableRow
                      key={sender.id}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                       <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                        <Link to={`/admin/tenants/${sender.tenantId}`}>
                          {sender.tenantId || "N/A"}
                        </Link>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {sender.name || "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {sender.message || "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(sender.status)}
                      </TableCell>
                      <TableCell className=" hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(sender.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {sender.status === "PENDING_VERIFICATION" && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(sender.id)}
                              disabled={isApproving || isRejecting}
                              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-success-500 rounded-lg hover:bg-success-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-success-500 dark:hover:bg-success-600"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectingId(sender.id)}
                              disabled={isApproving || isRejecting}
                              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-error-500 rounded-lg hover:bg-error-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-error-500 dark:hover:bg-error-600"
                            >
                              <CloseIcon className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-800 w-full max-w-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Reject Sender Request</h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Please provide a reason for rejecting this sender request.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="mb-4 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setRejectingId(null);
                  setRejectionReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingId)}
                disabled={!rejectionReason.trim() || isRejecting}
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-error-500 rounded-lg hover:bg-error-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-error-500 dark:hover:bg-error-600"
              >
                {isRejecting ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
