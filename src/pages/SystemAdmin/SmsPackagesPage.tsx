import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { PencilIcon, PlusIcon } from "../../icons";

// Dummy data - will be replaced with API calls
const dummyPackages = [
  {
    id: "1",
    name: "Basic",
    smsCount: 1000,
    price: 50,
    validityDays: 30,
    features: "Standard delivery, Basic support",
    status: "Active",
  },
  {
    id: "2",
    name: "Premium",
    smsCount: 5000,
    price: 200,
    validityDays: 30,
    features: "Priority delivery, Priority support",
    status: "Active",
  },
  {
    id: "3",
    name: "Enterprise",
    smsCount: 10000,
    price: 350,
    validityDays: 30,
    features: "Instant delivery, 24/7 support, API access",
    status: "Active",
  },
  {
    id: "4",
    name: "Starter",
    smsCount: 500,
    price: 25,
    validityDays: 30,
    features: "Standard delivery",
    status: "Inactive",
  },
];

export default function SmsPackagesPage() {
  const [packages] = useState(dummyPackages);

  const getStatusBadge = (status: string) => {
    if (status === "Active") {
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

  return (
    <>
      <PageMeta title="SMS Packages | Fast SMS" description="Manage SMS packages and pricing" />
      <PageBreadcrumb pageTitle="SMS Packages" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
             
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage SMS packages, pricing, and package assignments to tenants
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600">
              <PlusIcon className="w-4 h-4" />
              Create Package
            </button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-800">
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Package Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    SMS Count
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Price ($)
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Validity (Days)
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Features
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    Status
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
                {packages.map((pkg) => (
                  <TableRow
                    key={pkg.id}
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {pkg.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {pkg.smsCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      ${pkg.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {pkg.validityDays} days
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {pkg.features}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(pkg.status)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="p-2 text-brand-600 transition-colors rounded-lg hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
                        title="Edit Package"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
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

