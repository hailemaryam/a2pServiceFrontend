import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { 
  useGetSmsPackagesQuery, 
  useCreateSmsPackageMutation, 
  useUpdateSmsPackageMutation, 
  useDeleteSmsPackageMutation,
  SmsPackageTier
} from "../../api/adminApi";
import { CloseIcon } from "../../icons";

// --- Components ---

interface SmsPackageModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<SmsPackageTier>) => Promise<void>;
  initialData?: SmsPackageTier | null;
  isLoading: boolean;
}

const SmsPackageModal = ({ onClose, onSubmit, initialData, isLoading }: SmsPackageModalProps) => {
  const [formData, setFormData] = useState<Partial<SmsPackageTier>>({
    minSmsCount: initialData?.minSmsCount || 0,
    maxSmsCount: initialData?.maxSmsCount,
    pricePerSms: initialData?.pricePerSms || 0,
    description: initialData?.description || "",
    isActive: initialData?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
          {initialData ? "Edit SMS Package" : "Create New SMS Package"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Min SMS Count
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.minSmsCount}
                onChange={(e) => setFormData({ ...formData, minSmsCount: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Max SMS Count (Optional)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Unlimited"
                value={formData.maxSmsCount || ""}
                onChange={(e) => {
                   const val = e.target.value;
                   setFormData({ ...formData, maxSmsCount: val ? Number(val) : undefined });
                }}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Price Per SMS ($ or ETB)
            </label>
            <input
              type="number"
              step="0.0001"
              min="0"
              required
              value={formData.pricePerSms}
              onChange={(e) => setFormData({ ...formData, pricePerSms: parseFloat(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-3">
             <input
               type="checkbox"
               id="isActive"
               checked={formData.isActive}
               onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
               className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
             />
             <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
               Active
             </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-bold text-white shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Package"}
          </button>
        </form>
      </div>
    </div>
  );
};


export default function SmsPackagesPage() {
  const { data: packages = [], isLoading, error } = useGetSmsPackagesQuery();
  const [createPackage, { isLoading: isCreating }] = useCreateSmsPackageMutation();
  const [updatePackage, { isLoading: isUpdating }] = useUpdateSmsPackageMutation();
  const [deletePackage] = useDeleteSmsPackageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<SmsPackageTier | null>(null);

  const handleSave = async (data: Partial<SmsPackageTier>) => {
    try {
      if (editingPackage) {
        await updatePackage({ id: editingPackage.id, body: data }).unwrap();
      } else {
        await createPackage(data as any).unwrap();
      }
      setIsModalOpen(false);
      setEditingPackage(null);
    } catch (err) {
      console.error("Failed to save package", err);
      alert("Failed to save package. Please check inputs.");
    }
  };

  const handleEdit = (pkg: SmsPackageTier) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      try {
        await deletePackage(id).unwrap();
      } catch (err) {
        console.error("Failed to delete", err);
        alert("Failed to delete package.");
      }
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-success-100 text-success-800 rounded-full dark:bg-success-500/10 dark:text-success-400">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full dark:bg-gray-500/10 dark:text-gray-400">
        Inactive
      </span>
    );
  };

  if (isLoading) return <div className="p-10 text-center">Loading packages...</div>;
  if (error) return <div className="p-10 text-center text-error-500">Error loading packages.</div>;

  return (
    <>
      <PageMeta title="SMS Packages | Fast SMS" description="Manage SMS packages" />
      <PageBreadcrumb pageTitle="SMS Tiers" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
          
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Pricing Tiers</h3>
            <button
              onClick={() => { setEditingPackage(null); setIsModalOpen(true); }}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              + Add Package
            </button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 dark:border-gray-700/50">
                  <TableCell isHeader className="px-4 py-3 text-sm font-medium text-gray-500">Min SMS</TableCell>
                  <TableCell isHeader className="px-4 py-3 text-sm font-medium text-gray-500">Max SMS</TableCell>
                  <TableCell isHeader className="px-4 py-3 text-sm font-medium text-gray-500">Price</TableCell>
                  <TableCell isHeader className="px-4 py-3 text-sm font-medium text-gray-500">Description</TableCell>
                  <TableCell isHeader className="px-4 py-3 text-sm font-medium text-gray-500">Status</TableCell>
                  <TableCell isHeader className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No SMS packages found. Create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  packages.map((pkg) => (
                    <TableRow key={pkg.id} className="border-b border-gray-100 last:border-0 dark:border-gray-700/50">
                      <TableCell className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {pkg.minSmsCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {pkg.maxSmsCount ? pkg.maxSmsCount.toLocaleString() : "Unlimited"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
                        {pkg.pricePerSms.toFixed(4)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {pkg.description}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {getStatusBadge(pkg.isActive)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => handleEdit(pkg)}
                             className="text-sm font-medium text-brand-500 hover:text-brand-600"
                           >
                             Edit
                           </button>
                           <button 
                             onClick={() => handleDelete(pkg.id)}
                             className="text-sm font-medium text-error-500 hover:text-error-600"
                           >
                             Delete
                           </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <SmsPackageModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleSave}
          initialData={editingPackage}
          isLoading={isCreating || isUpdating}
        />
      )}
    </>
  );
}
