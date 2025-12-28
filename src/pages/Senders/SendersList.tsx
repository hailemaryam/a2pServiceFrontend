import { useState, FormEvent } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  PencilIcon,
  TrashBinIcon,
  PlusIcon,
} from "../../icons";
import {
  useGetSendersQuery,
  useCreateSenderMutation,
  useUpdateSenderMutation,
  useDeleteSenderMutation,
  SenderResponse,
} from "../../api/sendersApi";
import { toast } from "react-toastify";
import Modal from "../../components/ui/modal/Modal";

export default function SendersList() {
  const [senderSearch, setSenderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // RTK Query hooks
  const { data: senders = [], isLoading } = useGetSendersQuery();
  const [createSender, { isLoading: isCreating }] = useCreateSenderMutation();
  const [updateSender, { isLoading: isUpdating }] = useUpdateSenderMutation();
  const [deleteSender] = useDeleteSenderMutation();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSender, setEditingSender] = useState<SenderResponse | null>(null);
  
  // Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [senderToDelete, setSenderToDelete] = useState<string | null>(null);

  // Form states
  const [senderName, setSenderName] = useState("");
  const [editSenderName, setEditSenderName] = useState("");

  // Handlers
  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!senderName.trim()) return;
    try {
      await createSender({ name: senderName }).unwrap();
      setSenderName("");
      setIsCreateModalOpen(false);
      toast.success("Sender request submitted successfully!");
    } catch (error: any) {
      console.error("Failed to create sender", error);
      toast.error(error?.data?.message || "Failed to create sender");
    }
  };

  const handleEditClick = (sender: SenderResponse) => {
    setEditingSender(sender);
    setEditSenderName(sender.name);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingSender || !editSenderName.trim()) return;
    try {
      await updateSender({ 
        id: editingSender.id, 
        payload: { name: editSenderName } 
      }).unwrap();
      closeEditModal();
      toast.success("Sender updated successfully!");
    } catch (error: any) {
      console.error("Failed to update sender", error);
      toast.error(error?.data?.message || "Failed to update sender");
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingSender(null);
    setEditSenderName("");
  };

  const confirmDelete = (id: string) => {
    setSenderToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (senderToDelete) {
      try {
        await deleteSender(senderToDelete).unwrap();
        toast.success("Sender deleted successfully");
        setIsDeleteModalOpen(false);
        setSenderToDelete(null);
      } catch (error: any) {
        console.error("Failed to delete sender", error);
        toast.error(error?.data?.message || "Failed to delete sender");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      INACTIVE: "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      PENDING_VERIFICATION: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      REJECTED: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    const style = styles[status as keyof typeof styles] || styles.INACTIVE;
    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${style}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  // Filter local
  const filteredSenders = senders.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(senderSearch.toLowerCase());
    const matchesStatus = statusFilter ? s.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageMeta
        title="Sender List | Fast SMS"
        description="Manage your SMS sender IDs"
      />
      <PageBreadcrumb pageTitle="Sender List" />
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto max-w-5xl">
          
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
            >
              <PlusIcon className="h-5 w-5" />
              Request Sender ID
            </button>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search Senders..."
                value={senderSearch}
                onChange={(e) => setSenderSearch(e.target.value)}
                className="h-11 w-full max-w-sm rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white"
              />
            </div>
             <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-white dark:focus:border-brand-800"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="PENDING_VERIFICATION">Pending Verification</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-transparent">
                {isLoading ? (
                  <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
                ) : filteredSenders.length === 0 ? (
                  <tr><td colSpan={4} className="p-4 text-center text-gray-500">No senders found.</td></tr>
                ) : (
                  filteredSenders.map((sender) => (
                    <tr key={sender.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {sender.name}
                        {sender.message && (
                          <p className="text-xs text-error-500 mt-1">{sender.message}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">{getStatusBadge(sender.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(sender.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEditClick(sender)}
                            className="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(sender.id)}
                            className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400"
                            title="Delete"
                          >
                            <TrashBinIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Request Sender ID"
        disableBackdropBlur={true}
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium dark:text-gray-300">Sender Name</label>
            <input
              type="text"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="e.g. MyBrand"
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {isCreating ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Sender ID"
      >
        <form onSubmit={handleEditSubmit}>
           <div className="mb-4">
            <label className="mb-2 block text-sm font-medium dark:text-gray-300">Sender Name</label>
            <input
              type="text"
              required
              value={editSenderName}
              onChange={(e) => setEditSenderName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this sender? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
