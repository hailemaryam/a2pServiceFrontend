import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { useGetSmsPackagesQuery } from "../../api/adminApi";

export default function SmsPackagesPage() {
  const { data: packages = [], isLoading, error } = useGetSmsPackagesQuery();

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-success-100 text-success-800 rounded-full dark:bg-success-500/10 dark:text-success-400">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full dark:bg-gray-500/10 dark:text-gray-400">
        Inactive
      </span>
    );
  };

  if (isLoading) {
    return (
      <>
        <PageMeta title="SMS Packages | Fast SMS" description="Manage SMS packages and pricing" />
        <PageBreadcrumb pageTitle="SMS Tiers" />
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading SMS packages...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMeta title="SMS Packages | Fast SMS" description="Manage SMS packages and pricing" />
        <PageBreadcrumb pageTitle="SMS Tiers" />
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
            <div className="text-center py-12">
              <p className="text-error-600 dark:text-error-400">Failed to load SMS packages. Please try again.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="SMS Packages | Fast SMS" description="Manage SMS packages and pricing" />
      <PageBreadcrumb pageTitle="SMS Tiers" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View SMS pricing tiers (Read-only monitoring)
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
                    Min SMS Count
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Max SMS Count
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Price Per SMS ($)
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Description
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      No SMS tiers found
                    </TableCell>
                  </TableRow>
                ) : (
                  packages.map((pkg) => (
                    <TableRow
                      key={pkg.id}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {pkg.minSmsCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {pkg.maxSmsCount ? pkg.maxSmsCount.toLocaleString() : "Unlimited"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {pkg.pricePerSms ? `$${pkg.pricePerSms.toFixed(3)}` : "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {pkg.description || "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(pkg.isActive)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
