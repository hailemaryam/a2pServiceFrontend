import { useState, useEffect } from "react";
import Modal from "../../components/ui/modal/Modal";
import { useFetchContactsByGroupIdQuery } from "../../api/contactsApi";
import { useDebounce } from "../../hooks/useDebounce";

interface ViewGroupContactsModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
    groupName: string;
}

export default function ViewGroupContactsModal({
    isOpen,
    onClose,
    groupId,
    groupName,
}: ViewGroupContactsModalProps) {
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, error } = useFetchContactsByGroupIdQuery(
        { groupId, page, size, query: debouncedSearch },
        { skip: !isOpen }
    );

    // Reset page when debounced search term changes
    useEffect(() => {
        setPage(0);
    }, [debouncedSearch]);

    const contacts = data?.items ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / size));

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 0 || nextPage > totalPages - 1) return;
        setPage(nextPage);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Contacts in "${groupName}"`}
            size="lg"
        >
            <div className="space-y-4">
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                            className="h-4 w-4 text-gray-400"
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
                        placeholder="Search contacts..."
                        value={search}
                        onChange={handleSearchChange}
                        className="h-10 w-full rounded-lg border border-gray-300 bg-transparent pl-9 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                </div>
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Phone
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Email
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-white/[0.03]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500">
                                        Loading contacts...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={3} className="px-4 py-4 text-center text-sm text-red-500">
                                        Failed to load contacts.
                                    </td>
                                </tr>
                            ) : contacts.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500">
                                        No contacts found in this group.
                                    </td>
                                </tr>
                            ) : (
                                contacts.map((contact) => (
                                    <tr key={contact.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                            {contact.name || "-"}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                            {contact.phone}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                            {contact.email || "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal Pagination */}
                <div className="flex items-center justify-between px-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                        Page {page + 1} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 0 || isLoading}
                        >
                            Previous
                        </button>
                        <button
                            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages - 1 || isLoading}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
