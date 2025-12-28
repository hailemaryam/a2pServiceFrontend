import { useParams, Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useGetTenantByIdQuery } from "../../api/adminApi";

export default function SystemAdminTenantDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: tenant, isLoading, error } = useGetTenantByIdQuery(id || "", {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        Loading tenant details...
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="p-8 text-center text-red-500">
        Tenant not found or failed to load.
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    return status === "ACTIVE" ? (
      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-success-100 text-success-800 rounded-full dark:bg-success-500/10 dark:text-success-400">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-error-100 text-error-800 rounded-full dark:bg-error-500/10 dark:text-error-400">
        Inactive
      </span>
    );
  };

  return (
    <>
      <PageMeta
        title={`${tenant.name} | Tenant Details`}
        description="View tenant profile"
      />
      <PageBreadcrumb pageTitle="Tenant Details" />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {tenant.name}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Tenant ID: {tenant.id}
              </p>
            </div>
            <div>{getStatusBadge(tenant.status)}</div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white truncate" title={tenant.email}>
                    {tenant.email}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {tenant.phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                SMS Configuration
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">SMS Credit</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {tenant.smsCredit?.toLocaleString() ?? 0}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Approval Threshold</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {tenant.smsApprovalThreshold?.toLocaleString() ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Metadata</h3>
            <div className="flex flex-wrap gap-6 text-sm">
                <div>
                    <span className="text-gray-400 mr-2">Created At:</span>
                    <span className="text-gray-700 dark:text-gray-300">{new Date(tenant.createdAt).toLocaleString()}</span>
                </div>
                <div>
                    <span className="text-gray-400 mr-2">Last Updated:</span>
                    <span className="text-gray-700 dark:text-gray-300">{new Date(tenant.updatedAt).toLocaleString()}</span>
                </div>
            </div>
          </div>
          
           <div className="mt-8 flex justify-end">
             <Link
               to="/admin/tenants"
               className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
             >
               Back to Tenants List
             </Link>
           </div>
        </div>
      </div>
    </>
  );
}
