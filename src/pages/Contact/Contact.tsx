import React, { FormEvent, useMemo, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { DownloadIcon, PlusIcon } from "../../icons";
import {
  useFetchContactsQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useUploadContactsBinaryMutation,
  useUploadContactsMultipartMutation,
  ContactResponse,
} from "../../api/contactsApi";


import { useGetContactGroupsQuery } from "../../api/contactGroupsApi";
import Modal from "../../components/ui/modal/Modal";

type UploadMode = "binary" | "multipart";

export default function Contact() {
  const [page, setPage] = useState(0);
  const [size] = useState(20);

  // RTK Query hooks
  const {
    data: contactsData,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useFetchContactsQuery({ page, size });

  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();
  const [deleteContact] = useDeleteContactMutation();
  const [uploadContactsBinary, { isLoading: isUploadingBinary }] =
    useUploadContactsBinaryMutation();
  const [uploadContactsMultipart, { isLoading: isUploadingMultipart }] =
    useUploadContactsMultipartMutation();

  const contacts = contactsData?.items ?? [];
  const total = contactsData?.total ?? 0;
  const error = queryError
    ? "data" in queryError
      ? (queryError.data as any)?.message || "Failed to fetch contacts"
      : "Failed to fetch contacts"
    : null;

  // Fetch groups for dropdown
  const { data: groups = [] } = useGetContactGroupsQuery();

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form states
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode>("binary");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const totalPages = useMemo(() => {
    if (!size) return 1;
    return Math.max(1, Math.ceil(total / size));
  }, [size, total]);

  const resetContactForm = () => {
    setContactName("");
    setPhoneNumber("");
    setEmail("");
    setEditingId(null);
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!contactName.trim() || !phoneNumber.trim()) {
      setLocalError("Name and Phone are required.");
      return;
    }

    const payload = {
      name: contactName.trim(),
      phone: phoneNumber.trim(),
      email: email.trim() || null,
    };

    try {
      if (editingId) {
        await updateContact({ id: editingId, payload }).unwrap();
      } else {
        await createContact(payload).unwrap();
      }
      resetContactForm();
      setIsContactModalOpen(false);
    } catch (err: any) {
      setLocalError(
        err?.data?.message || err?.message || "Unable to save contact"
      );
    }
  };

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!uploadedFile) {
      setLocalError("Please select a file to upload.");
      return;
    }

    try {
      if (uploadMode === "binary") {
        await uploadContactsBinary({
          file: uploadedFile,
          groupId: selectedGroup || undefined,
        }).unwrap();
      } else {
        await uploadContactsMultipart({
          file: uploadedFile,
          groupId: selectedGroup || undefined,
        }).unwrap();
      }
      setUploadedFile(null);
      setSelectedGroup("");
      setIsUploadModalOpen(false);
      refetch();
    } catch (err: any) {
      setLocalError(err?.data?.message || err?.message || "Upload failed");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedFile(file);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleOpenCreateModal = () => {
    resetContactForm();
    setIsContactModalOpen(true);
  };

  const handleEditContact = (contact: ContactResponse) => {
    setEditingId(contact.id);
    setContactName(contact.name || "");
    setPhoneNumber(contact.phone || "");
    setEmail(contact.email || "");
    setIsContactModalOpen(true);
  };

  const handleDeleteContact = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteContact(id).unwrap();
        refetch();
      } catch (err: any) {
        setLocalError(
          err?.data?.message || err?.message || "Failed to delete contact"
        );
      }
    }
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 0 || nextPage > totalPages - 1) return;
    setPage(nextPage);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPage(0);
    // API search-by-phone exists, but paginated fetch keeps UI consistent; keep search as client-side filter for now.
  };

  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return contacts;
    const term = searchTerm.toLowerCase();
    return contacts.filter(
      (c) =>
        c.phone?.toLowerCase().includes(term) ||
        (c.name ?? "").toLowerCase().includes(term)
    );
  }, [contacts, searchTerm]);

  return (
    <div>
      <PageMeta title="Contact | Fast SMS" description="Manage your contacts" />
      <PageBreadcrumb pageTitle="Contact" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
            <button
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
              onClick={() => refetch()}
            >
              <DownloadIcon className="h-4 w-4" />
              Download Template
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex-1">
                <form className="relative mb-4" onSubmit={handleSearchSubmit}>
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Phone Number / Contact Name"
                    className="h-11 w-full max-w-md rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </form>

                <div className="mb-6 flex flex-wrap gap-3">
                  <button
                    onClick={handleRefresh}
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
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload Contacts
                  </button>
                  <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Create Contact
                  </button>
                </div>

                {loading && (
                  <div className="mb-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-200">
                    Loading contacts...
                  </div>
                )}

                {(error || localError) && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-100">
                    {localError || error}
                  </div>
                )}

                {!loading && filteredContacts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-16 dark:border-gray-800 dark:bg-gray-800/50">
                    <div className="mb-4">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400 dark:text-gray-500"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="9" x2="15" y2="9"></line>
                        <line x1="9" y1="13" x2="15" y2="13"></line>
                        <line x1="9" y1="17" x2="15" y2="17"></line>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No contacts found.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-800">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                      <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                            Phone
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                            Email
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
                        {filteredContacts.map((contact) => (
                          <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                              {contact.name || "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                              {contact.phone}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                              {contact.email || "—"}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleEditContact(contact)}
                                className="rounded-md px-3 py-1 text-xs font-medium text-brand-600 transition hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/30"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteContact(contact.id)}
                                className="ml-2 rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-200 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
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
                )}
              </div>

              <div className="ml-6">
                <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600">
                  <DownloadIcon className="h-5 w-5" />
                  Download Contacts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title={editingId ? "Update Contact" : "Contact Information"}
      >
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="contactName"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name
                </label>
                <input
                  id="contactName"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone
                </label>
                <input
                  id="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0912345678"
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                {isCreating || isUpdating
                  ? "Saving..."
                  : editingId
                  ? "Update"
                  : "Submit"}
              </button>
            </form>
      </Modal>

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Contacts"
      >
            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input
                    type="radio"
                    name="uploadMode"
                    value="binary"
                    checked={uploadMode === "binary"}
                    onChange={() => setUploadMode("binary")}
                  />
                  Binary
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input
                    type="radio"
                    name="uploadMode"
                    value="multipart"
                    checked={uploadMode === "multipart"}
                    onChange={() => setUploadMode("multipart")}
                  />
                  Multipart
                </label>
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  accept=".csv,.xlsx,.xls"
                />
                <div className="flex min-h-[100px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-brand-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-brand-800">
                  <svg
                    className="mb-4 h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {uploadedFile ? uploadedFile.name : "Drop or click to upload a file"}
                  </p>
                </div>
              </div>
              <div>
                <label
                  htmlFor="uploadGroup"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Select Group
                </label>
                  <select
                    id="uploadGroup"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                  >
                    <option value="">Select Group</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    type="submit"
                    disabled={isUploadingBinary || isUploadingMultipart}
                    className="w-full rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
                  >
                    {isUploadingBinary || isUploadingMultipart
                      ? "Uploading..."
                      : "Upload"}
                  </button>
                </div>
            </form>
      </Modal>
    </div>
  );
}
