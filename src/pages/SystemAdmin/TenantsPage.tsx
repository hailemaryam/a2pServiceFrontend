import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { EyeIcon } from "../../icons";
import { useGetTenantsQuery, useUpdateTenantStatusMutation } from "../../api/adminApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TenantsPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const { data, isLoading, error } = useGetTenantsQuery({ page, size });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateTenantStatusMutation();

  const tenants = data?.items || [];
  const total = data?.total || 0;

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Tenant status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusUpper = status?.toUpperCase() || "";
    if (statusUpper === "ACTIVE") {
      return (
        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-success-100 text-success-800 rounded-full dark:bg-success-500/10 dark:text-success-400">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-error-100 text-error-800 rounded-full dark:bg-error-500/10 dark:text-error-400">
        {status || "Unknown"}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <>
        <PageMeta title="Tenants Management | Fast SMS" description="Manage all tenants" />
        <PageBreadcrumb pageTitle="Tenants Management" />
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading tenants...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMeta title="Tenants Management | Fast SMS" description="Manage all tenants" />
        <PageBreadcrumb pageTitle="Tenants Management" />
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
            <div className="text-center py-12">
              <p className="text-error-600 dark:text-error-400">Failed to load tenants. Please try again.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Tenants Management | Fast SMS" description="Manage all tenants" />
      <PageBreadcrumb pageTitle="Tenants Management" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage all tenants in the system
              </p>
            </div>
          </div>

          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-800">
                  <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Tenant Name
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Email
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </TableCell>
                  {/* Package column removed as it's not in the API response */}
                   <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    SMS Credit
                  </TableCell>
                   <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Threshold
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
                {tenants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      No tenants found
                    </TableCell>
                  </TableRow>
                ) : (
                  tenants.map((tenant) => (
                    <TableRow
                      key={tenant.id}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {tenant.name || "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {tenant.email || "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(tenant.status)}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {tenant.smsCredit != null ? tenant.smsCredit.toLocaleString() : "0"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {tenant.smsApprovalThreshold != null ? tenant.smsApprovalThreshold.toLocaleString() : "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(tenant.createdAt)}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            title="View Details"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(tenant.id, tenant.status)}
                            disabled={isUpdating}
                            className={`px-3 py-1 text-xs font-medium rounded-lg text-white ${
                              tenant.status === "ACTIVE" 
                                ? "bg-error-500 hover:bg-error-600" 
                                : "bg-success-500 hover:bg-success-600"
                            }`}
                          >
                             {tenant.status === "ACTIVE" ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {total > size && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {page * size + 1} to {Math.min((page + 1) * size, total)} of {total} tenants
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={(page + 1) * size >= total}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-700"
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
