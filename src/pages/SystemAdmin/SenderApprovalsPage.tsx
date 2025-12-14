import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { CheckCircleIcon, CloseIcon } from "../../icons";

// Dummy data - will be replaced with API calls
const dummySenderRequests = [
  {
    id: "1",
    tenantName: "Acme Corporation",
    senderId: "ACME",
    requestType: "New Sender",
    status: "Pending",
    requestedAt: "2024-01-15",
    reason: "Marketing campaigns",
  },
  {
    id: "2",
    tenantName: "Tech Solutions Ltd",
    senderId: "TECHSOL",
    requestType: "New Sender",
    status: "Pending",
    requestedAt: "2024-02-20",
    reason: "Customer notifications",
  },
  {
    id: "3",
    tenantName: "Startup Inc",
    senderId: "STARTUP",
    requestType: "Update Sender",
    status: "Approved",
    requestedAt: "2024-03-10",
    reason: "Brand name change",
  },
];

export default function SenderApprovalsPage() {
  const [senderRequests, setSenderRequests] = useState(dummySenderRequests);

  const handleApprove = (id: string) => {
    setSenderRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Approved" } : req))
    );
    // TODO: API call to approve sender
  };

  const handleReject = (id: string) => {
    setSenderRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Rejected" } : req))
    );
    // TODO: API call to reject sender
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
      <PageMeta title="Sender Approvals | Fast SMS" description="Approve or reject sender ID requests" />
      <PageBreadcrumb pageTitle="Sender Approvals" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
            
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and approve sender ID requests from tenants
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
                    Sender ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Request Type
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Reason
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
                {senderRequests.map((request) => (
                  <TableRow
                    key={request.id}
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {request.tenantName}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {request.senderId}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {request.requestType}
                    </TableCell>
                    <TableCell className="hidden md:table-cell px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {request.reason}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {request.requestedAt}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {request.status === "Pending" && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-success-500 rounded-lg hover:bg-success-600 dark:bg-success-500 dark:hover:bg-success-600"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-error-500 rounded-lg hover:bg-error-600 dark:bg-error-500 dark:hover:bg-error-600"
                          >
                            <CloseIcon className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                      {request.status !== "Pending" && (
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

