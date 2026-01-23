import { useState, FormEvent, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  GroupIcon,
  PencilIcon,
  EyeIcon,
} from "../../icons";
import ViewGroupContactsModal from "./ViewGroupContactsModal";
import {
  useGetContactGroupsQuery,
  useCreateContactGroupMutation,
  useUpdateContactGroupMutation,
  useDeleteContactGroupMutation,
  ContactGroupResponse,
} from "../../api/contactGroupsApi";
import { toast } from "react-toastify";
import Modal from "../../components/ui/modal/Modal";
import { TrashBinIcon } from "../../icons";
import { useDebounce } from "../../hooks/useDebounce";

export default function ContactGroup() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [groupSearch, setGroupSearch] = useState("");
  const debouncedGroupSearch = useDebounce(groupSearch, 500);
  const [page, setPage] = useState(0);
  const [size] = useState(20);

  // RTK Query hooks
  const { data: groupsData, isLoading, refetch } = useGetContactGroupsQuery({ page, size, query: debouncedGroupSearch });

  // Reset page when debounced search term changes
  useEffect(() => {
    setPage(0);
  }, [debouncedGroupSearch]);
  const [createGroup, { isLoading: isCreating }] = useCreateContactGroupMutation();
  const [updateGroup, { isLoading: isUpdating }] = useUpdateContactGroupMutation();
  const [deleteGroup] = useDeleteContactGroupMutation();

  const groups = groupsData?.items ?? [];
  const total = groupsData?.total ?? 0;

  const totalPages = useMemo(() => {
    if (!size) return 1;
    return Math.max(1, Math.ceil(total / size));
  }, [size, total]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 0 || nextPage > totalPages - 1) return;
    setPage(nextPage);
  };

  // Modal states
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ContactGroupResponse | null>(null);

  // Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

  // View Group Contacts state
  const [viewingGroup, setViewingGroup] = useState<{ id: string; name: string } | null>(null);

  // Check if we should open the group modal from URL
  useEffect(() => {
    if (searchParams.get("openGroupModal") === "true") {
      setIsGroupModalOpen(true);
      // Remove the query parameter from URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Create form states
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  // Edit form states
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");

  // Handlers
  const handleGroupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.error("Group Name is required.");
      return;
    }
    try {
      await createGroup({ name: groupName, description: groupDescription }).unwrap();
      // Reset form
      setGroupName("");
      setGroupDescription("");
      setIsGroupModalOpen(false);
      toast.success("Contact group created successfully!");
    } catch (error: any) {
      console.error("Failed to create group", error);
      toast.error(error?.data?.message || "Failed to create group");
    }
  };

  const handleEditClick = (group: ContactGroupResponse) => {
    setEditingGroup(group);
    setEditGroupName(group.name);
    setEditGroupDescription(group.description || "");
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editGroupName.trim() || !editingGroup) {
      toast.error("Group Name is required.");
      return;
    }
    try {
      await updateGroup({
        id: editingGroup.id,
        payload: { name: editGroupName, description: editGroupDescription }
      }).unwrap();
      // Reset form
      closeEditModal();
      toast.success("Contact group updated successfully!");
    } catch (error: any) {
      console.error("Failed to update group", error);
      toast.error(error?.data?.message || "Failed to update group");
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingGroup(null);
    setEditGroupName("");
    setEditGroupDescription("");
  };

  const confirmDelete = (id: string) => {
    setGroupToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (groupToDelete) {
      try {
        await deleteGroup(groupToDelete).unwrap();
        toast.success("Contact group deleted successfully");
        setIsDeleteModalOpen(false);
        setGroupToDelete(null);
      } catch (error: any) {
        console.error("Failed to delete group", error);
        toast.error(error?.data?.message || "Failed to delete group");
      }
    }
  };

  // No local filtering, using server-side search results directly
  const filteredGroups = groups;

  return (
    <div>
      <PageMeta
        title="Contact Group | Fast SMS"
        description="Manage your contact groups"
      />
      <PageBreadcrumb pageTitle="Contact Group" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search Groups..."
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
                className="h-11 w-full max-w-xs rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                <GroupIcon className="h-4 w-4" />
                Create Group
              </button>
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Group Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Number of Contacts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-white/[0.03]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        Loading groups...
                      </td>
                    </tr>
                  ) : filteredGroups.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No groups found.
                      </td>
                    </tr>
                  ) : (
                    filteredGroups.map((group) => (
                      <tr
                        key={group.id}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {group.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {group.description || "-"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(group.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {group.contactCount || 0}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span className="inline-flex rounded-full bg-green-50 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Active
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewingGroup({ id: group.id, name: group.name })}
                              className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                              title="View Contacts"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditClick(group)}
                              className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                              title="Edit Group"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => confirmDelete(group.id)}
                              className="text-error-500 transition hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
                              title="Delete Group"
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
              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-200">
                <div>
                  Page {page + 1} of {totalPages} · {total} total
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 0}
                  >
                    Previous
                  </button>
                  <button
                    className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      <Modal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        title="Create New Group"
      >
        <form onSubmit={handleGroupSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="groupName"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Group Name
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. VIP Customers"
              required
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
          <div>
            <label
              htmlFor="groupDescription"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description (Optional)
            </label>
            <textarea
              id="groupDescription"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Description of the group..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600 disabled:opacity-70"
          >
            {isCreating ? "Creating..." : "Create Group"}
          </button>
        </form>
      </Modal>

      {/* Edit Group Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Group"
      >
        <form onSubmit={handleEditSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="editGroupName"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Group Name
            </label>
            <input
              id="editGroupName"
              type="text"
              value={editGroupName}
              onChange={(e) => setEditGroupName(e.target.value)}
              placeholder="Group Name"
              required
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
          <div>
            <label
              htmlFor="editGroupDescription"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description (Optional)
            </label>
            <textarea
              id="editGroupDescription"
              value={editGroupDescription}
              onChange={(e) => setEditGroupDescription(e.target.value)}
              placeholder="Description of the group..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600 disabled:opacity-70"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={closeEditModal}
              className="rounded-lg bg-gray-500 px-6 py-3 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          Are you sure you want to delete this contact group?
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

      {/* View Group Contacts Modal */}
      {viewingGroup && (
        <ViewGroupContactsModal
          isOpen={!!viewingGroup}
          onClose={() => setViewingGroup(null)}
          groupId={viewingGroup.id}
          groupName={viewingGroup.name}
        />
      )}
    </div>
  );
}
