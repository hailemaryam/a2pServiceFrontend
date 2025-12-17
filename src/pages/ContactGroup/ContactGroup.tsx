import { useState, FormEvent, useEffect } from "react";
import { useSearchParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  GroupIcon,
  PencilIcon,
  TrashBinIcon,
  CloseIcon,
} from "../../icons";
import {
  useGetContactGroupsQuery,
  useCreateContactGroupMutation,
  useUpdateContactGroupMutation,
  useDeleteContactGroupMutation,
  ContactGroupResponse,
} from "../../api/contactGroupsApi";

export default function ContactGroup() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [groupSearch, setGroupSearch] = useState("");

  // RTK Query hooks
  const { data: groups = [], isLoading } = useGetContactGroupsQuery();
  const [createGroup, { isLoading: isCreating }] = useCreateContactGroupMutation();
  const [updateGroup, { isLoading: isUpdating }] = useUpdateContactGroupMutation();
  const [deleteGroup] = useDeleteContactGroupMutation();

  // Modal states
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ContactGroupResponse | null>(null);

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
      alert("Group Name is required.");
      return;
    }
    try {
      await createGroup({ name: groupName, description: groupDescription }).unwrap();
      // Reset form
      setGroupName("");
      setGroupDescription("");
      setIsGroupModalOpen(false);
    } catch (error: any) {
      console.error("Failed to create group", error);
      alert(error?.data?.message || "Failed to create group");
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
      alert("Group Name is required.");
      return;
    }
    try {
      await updateGroup({ 
        id: editingGroup.id, 
        payload: { name: editGroupName, description: editGroupDescription } 
      }).unwrap();
      // Reset form
      closeEditModal();
    } catch (error: any) {
      console.error("Failed to update group", error);
      alert(error?.data?.message || "Failed to update group");
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this group? Contacts in this group will not be deleted.")) {
      try {
        await deleteGroup(id).unwrap();
      } catch (error: any) {
        console.error("Failed to delete group", error);
        alert(error?.data?.message || "Failed to delete group");
      }
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingGroup(null);
    setEditGroupName("");
    setEditGroupDescription("");
  };

  // Filter groups locally
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  return (
    <div>
      <PageMeta
        title="Contact Group | Fast SMS"
        description="Manage your contact groups"
      />
      <PageBreadcrumb pageTitle="Contact Group" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto max-w-5xl">
          {/* Top Header Section */}
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
            {/* <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Contact Group
            </h2> */}
          </div>

          {/* Main Content Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
            {/* Search Bar for Groups */}
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

            {/* Action Toolbar for Groups */}
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                 onClick={() => setIsGroupModalOpen(true)}
                 className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
               >
                 <GroupIcon className="h-4 w-4" />
                 Create Group
               </button>
            </div>

            {/* Groups Table */}
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-white/[0.03]">
                  {isLoading ? (
                     <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        Loading groups...
                      </td>
                    </tr>
                  ) : filteredGroups.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
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
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick(group)}
                              className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                              title="Edit Group"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(group.id)}
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
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {isGroupModalOpen && (
        <div
          className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsGroupModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsGroupModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <CloseIcon className="h-6 w-6" />
            </button>

            {/* Modal Header */}
            <div className="mb-5 border-b border-gray-200 pb-3 dark:border-gray-700">
              <h3 className="pr-8 text-lg font-semibold text-gray-900 dark:text-white">
                Create New Group
              </h3>
            </div>
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
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {isEditModalOpen && editingGroup && (
        <div
          className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4"
          onClick={closeEditModal}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeEditModal}
              className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <CloseIcon className="h-6 w-6" />
            </button>

            {/* Modal Header */}
            <div className="mb-5 border-b border-gray-200 pb-3 dark:border-gray-700">
              <h3 className="pr-8 text-lg font-semibold text-gray-900 dark:text-white">
                Edit Group
              </h3>
            </div>
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
          </div>
        </div>
      )}
    </div>
  );
}
