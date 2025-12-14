import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { CheckCircleIcon, CloseIcon, EyeIcon } from "../../icons";

// Dummy data - will be replaced with API calls
const dummySmsJobs = [
  {
    id: "1",
    tenantName: "Acme Corporation",
    message: "Special offer: 50% off on all products!",
    recipientCount: 1000,
    scheduledAt: "2024-01-20 10:00",
    status: "Pending",
    requestedAt: "2024-01-15",
  },
  {
    id: "2",
    tenantName: "Tech Solutions Ltd",
    message: "Your order has been shipped. Track it here...",
    recipientCount: 500,
    scheduledAt: "2024-02-25 14:30",
    status: "Pending",
    requestedAt: "2024-02-20",
  },
  {
    id: "3",
    tenantName: "Startup Inc",
    message: "Welcome to our service!",
    recipientCount: 250,
    scheduledAt: "2024-03-15 09:00",
    status: "Approved",
    requestedAt: "2024-03-10",
  },
];

export default function SmsJobApprovalsPage() {
  const [smsJobs, setSmsJobs] = useState(dummySmsJobs);

  const handleApprove = (id: string) => {
    setSmsJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status: "Approved" } : job))
    );
    // TODO: API call to approve SMS job
  };

  const handleReject = (id: string) => {
    setSmsJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status: "Rejected" } : job))
    );
    // TODO: API call to reject SMS job
  };

  const getStatusBadge = (status: string) => {
    if (status === "Approved") {
      return (
        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-success-100 text-success-800 rounded-full dark:bg-success-500/10 dark:text-success-400">
          Approved
        </span>
      );
    }
    if (status === "Rejected") {
      return (
        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-error-100 text-error-800 rounded-full dark:bg-error-500/10 dark:text-error-400">
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-warning-100 text-warning-800 rounded-full dark:bg-warning-500/10 dark:text-warning-400">
        Pending
      </span>
    );
  };

  return (
    <>
      <PageMeta title="SMS Job Approvals | Fast SMS" description="Approve or reject SMS job requests" />
      <PageBreadcrumb pageTitle="SMS Job Approvals" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
                SMS Job Approvals
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and approve SMS job requests before they are sent
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-800">
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Tenant
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Message Preview
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Recipients
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Scheduled At
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Requested At
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {smsJobs.map((job) => (
                  <TableRow
                    key={job.id}
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {job.tenantName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                      <div className="truncate" title={job.message}>
                        {job.message}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {job.recipientCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {job.scheduledAt}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(job.status)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {job.requestedAt}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {job.status === "Pending" && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            title="View Details"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleApprove(job.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-success-500 rounded-lg hover:bg-success-600 dark:bg-success-500 dark:hover:bg-success-600"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(job.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-error-500 rounded-lg hover:bg-error-600 dark:bg-error-500 dark:hover:bg-error-600"
                          >
                            <CloseIcon className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                      {job.status !== "Pending" && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">No actions</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}

