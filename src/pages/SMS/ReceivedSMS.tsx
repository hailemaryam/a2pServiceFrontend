import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

// --- Type Definitions ---
interface ReceivedSmsRecord {
  id: string;
  message: string;
  contact: string;
  status: "RECEIVED";
  date: string;
}

interface ReplyData {
  contact: string;
  message: string;
}

// Dummy Data
const dummyReceivedLogs: ReceivedSmsRecord[] = [
  {
    id: "ELS",
    message: "681896410",
    contact: "+251 946 70 57 41",
    status: "RECEIVED",
    date: "08/23/25, 3:00 AM",
  },
  {
    id: "ELS",
    message: "U",
    contact: "+251 978 65 45 44",
    status: "RECEIVED",
    date: "08/23/25, 3:00 AM",
  },
  {
    id: "ELS",
    message: "667432521",
    contact: "+251 951 51 06 04",
    status: "RECEIVED",
    date: "08/23/25, 3:00 AM",
  },
  {
    id: "ELS",
    message: "1096066748",
    contact: "+251 970 57 03 77",
    status: "RECEIVED",
    date: "08/23/25, 3:00 AM",
  },
  {
    id: "ELS",
    message: "Stop",
    contact: "+251 949 67 36 89",
    status: "RECEIVED",
    date: "08/23/25, 3:00 AM",
  },
  {
    id: "ELS",
    message: "667432521",
    contact: "+251 900 64 01 60",
    status: "RECEIVED",
    date: "08/23/25, 3:00 AM",
  },
  {
    id: "ELS",
    message: "(859115026)8989",
    contact: "+251 923 42 32 14",
    status: "RECEIVED",
    date: "08/23/25, 3:00 AM",
  },
  {
    id: "ELS",
    message: "2676817",
    contact: "+251 948 76 99 11",
    status: "RECEIVED",
    date: "08/23/25, 3:00 AM",
  },
];

// --- Reply Modal Component ---
interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReplyData | null;
}

const ReplyModal: React.FC<ReplyModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  // Function to remove spaces and the '+' from the contact number for display (as shown in image)
  const formatContactNumber = (contact: string) => contact.replace(/\s/g, '').replace('+', '');

  return (
    // Overlay style matching other modals (create group, etc.)
    <div
      className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        {/* Modal Header */}
        <div className="mb-5 border-b border-gray-200 pb-3 dark:border-gray-700">
          <h3 className="pr-8 text-lg font-semibold text-gray-900 dark:text-white">
            Reply to Message
          </h3>
        </div>

        {/* Modal Body */}
        <div className="space-y-5">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Replying to: <span className="font-semibold text-gray-900 dark:text-white">{formatContactNumber(data.contact)}</span>
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Original message: <span className="font-semibold text-gray-900 dark:text-white">"{data.message}"</span>
          </p>

          {/* Select Sender ID */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sender ID:
            </label>
            <select className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800">
              <option value="">Select Sender ID</option>
              {/* Dummy Sender IDs */}
              <option value="ID1">MySenderID_1</option>
              <option value="ID2">MySenderID_2</option>
            </select>
          </div>

          {/* Reply Textarea */}
          <div>
            <label htmlFor="reply-message" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Your reply
            </label>
            <textarea
              id="reply-message"
              rows={4}
              placeholder="Type your reply here..."
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            ></textarea>
          </div>
          
          {/* Send Reply Button */}
          <button
            onClick={() => {
              // Add logic to send the reply here
              console.log("Sending reply to:", data.contact);
              onClose();
            }}
            className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function ReceivedSMS() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyData, setReplyData] = useState<ReplyData | null>(null);
  const totalPages = 5;

  const handleReplyClick = (contact: string, message: string) => {
    setReplyData({ contact, message });
    setIsModalOpen(true);
  };

  const getStatusBadge = () => (
    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-success-100 text-success-800 rounded-full dark:bg-success-500/10 dark:text-success-400">
      RECEIVED
    </span>
  );

  const renderPagination = () => {
    const pagesToShow = [1, 2, 3, 4, 5];
    return (
      <div className="flex justify-center items-center mt-6 space-x-1">
        <button
          className="p-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          &laquo;
        </button>
        <button
          className="p-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          &lsaquo;
        </button>

        {pagesToShow.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              currentPage === page
                ? "bg-brand-500 text-white dark:bg-brand-500"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          className="p-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          &rsaquo;
        </button>
        <button
          className="p-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
        >
          &raquo;
        </button>
      </div>
    );
  };

  return (
    <div>
      <PageMeta
        title="Received SMS LOG | Fast SMS"
        description="View received SMS messages"
      />
      <PageBreadcrumb pageTitle="Received SMS LOG" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="font-sans max-w-6xl mx-auto">
          {/* --- Filter and Search Bar --- */}
          <div className="bg-white dark:bg-white/[0.03] p-6 rounded-xl shadow-theme-md border border-gray-200 dark:border-gray-800 mb-8">
            <div className="flex justify-between items-end gap-4">
              {/* Phone Number / Contact Name Search */}
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Phone Number / Contact Name"
                  className="w-full h-11 rounded-lg border border-gray-300 bg-transparent px-10 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => {
                  // Refresh logic here
                  console.log("Refreshing received SMS...");
                }}
                className="flex items-center justify-center h-11 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-theme-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-150 whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* --- Received SMS Log Table --- */}
          <div className="overflow-x-auto bg-white dark:bg-white/[0.03] rounded-xl shadow-theme-md border border-gray-200 dark:border-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    message
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  {/* CHANGED HEADER: Remarks to Reply */}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Reply
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-white/[0.03] divide-y divide-gray-200 dark:divide-gray-700">
                {dummyReceivedLogs.map((log, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {log.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.date}
                    </td>
                    {/* ADDED REPLY BUTTON (using dark blue color for consistency with the image) */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleReplyClick(log.contact, log.message)}
                        className="px-3 py-1 text-xs font-semibold rounded-lg text-white transition"
                        style={{ backgroundColor: "#E57A38" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d4692a")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E57A38")}
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* --- Pagination --- */}
            {renderPagination()}
          </div>
        </div>
      </div>

      {/* --- Reply Modal --- */}
      <ReplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={replyData}
      />
    </div>
  );
}