import { useState, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  useSendSingleSmsMutation,
  useSendGroupSmsMutation,
  useSendBulkSmsMutation,
} from "../../api/smsApi";
import { useGetSendersQuery, useCreateSenderMutation } from "../../api/sendersApi";
import { useGetContactGroupsQuery } from "../../api/contactGroupsApi";
import { CloseIcon } from "../../icons";

// Type definitions for component state
interface SmsState {
  senderId: string;
  phoneNumber: string;
  message: string;
  selectedGroup?: string;
  uploadedFile?: File | null;
  scheduledAt?: string; // ISO 8601 datetime string
}

// Constants for SMS limits (GSM encoding)
const GSM_CHAR_LIMIT = 160;
const GSM_CONCAT_CHAR_LIMIT = 153;

export default function SendSMS() {
  // Tabs: Single, Group, Bulk (File)
  const [activeTab, setActiveTab] = useState<"Single" | "Group" | "Bulk">("Single");
  
  const [smsData, setSmsData] = useState<SmsState>({
    senderId: "",
    phoneNumber: "",
    message: "",
    selectedGroup: "",
    uploadedFile: null,
    scheduledAt: undefined,
  });

  // Modal State
  const [isSenderModalOpen, setIsSenderModalOpen] = useState(false);
  const [newSenderName, setNewSenderName] = useState("");

  // RTK Query hooks
  const { data: senders = [] } = useGetSendersQuery();
  const { data: contactGroups = [] } = useGetContactGroupsQuery();
  
  const [sendSingleSms, { isLoading: isSendingSingle }] = useSendSingleSmsMutation();
  const [sendGroupSms, { isLoading: isSendingGroup }] = useSendGroupSmsMutation();
  const [sendBulkSms, { isLoading: isSendingBulk }] = useSendBulkSmsMutation();
  const [createSender, { isLoading: isCreatingSender }] = useCreateSenderMutation();

  // Get approved senders only
  const approvedSenders = useMemo(
    () => senders.filter((sender) => sender.status === "APPROVED"),
    [senders]
  );

  // Calculate SMS metrics (based on GSM encoding)
  const { charsUsed, smsParts, price } = useMemo(() => {
    const chars = smsData.message.length;
    let parts = 0;
    if (chars > 0) {
      if (chars <= GSM_CHAR_LIMIT) {
        parts = 1;
      } else {
        parts = Math.ceil(chars / GSM_CONCAT_CHAR_LIMIT);
      }
    }
    // Placeholder price logic
    const calculatedPrice = (parts * 0.5).toFixed(2);
    return {
      charsUsed: chars,
      smsParts: parts,
      price: calculatedPrice,
    };
  }, [smsData.message]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSmsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSmsData((prev) => ({ ...prev, uploadedFile: file }));
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmsData((prev) => ({
      ...prev,
      scheduledAt: e.target.value ? new Date(e.target.value).toISOString() : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === "Single") {
        if (!smsData.senderId || !smsData.phoneNumber || !smsData.message) {
          alert("Please fill in all required fields");
          return;
        }
        await sendSingleSms({
          senderId: smsData.senderId,
          phoneNumber: smsData.phoneNumber,
          message: smsData.message,
          scheduledAt: smsData.scheduledAt,
        }).unwrap();
        alert("Single SMS sent successfully!");
        setSmsData((prev) => ({ ...prev, phoneNumber: "", message: "", scheduledAt: undefined }));
      } else if (activeTab === "Group") {
        if (!smsData.senderId || !smsData.selectedGroup || !smsData.message) {
          alert("Please fill in all required fields (Group)");
          return;
        }
        await sendGroupSms({
          senderId: smsData.senderId,
          groupId: smsData.selectedGroup!,
          message: smsData.message,
          scheduledAt: smsData.scheduledAt,
        }).unwrap();
        alert("Group SMS sent successfully!");
        setSmsData((prev) => ({ ...prev, message: "", scheduledAt: undefined }));
      } else if (activeTab === "Bulk") {
        // Bulk = File Upload
        if (!smsData.senderId || !smsData.uploadedFile || !smsData.message) {
          alert("Please fill in all required fields and upload a file");
          return;
        }
        await sendBulkSms({
          senderId: smsData.senderId,
          message: smsData.message,
          file: smsData.uploadedFile,
          scheduledAt: smsData.scheduledAt,
        }).unwrap();
        alert("Bulk SMS (File) sent successfully!");
        setSmsData((prev) => ({ ...prev, uploadedFile: null, message: "", scheduledAt: undefined }));
      }
    } catch (error: any) {
      console.error("Failed to send SMS:", error);
      alert(error?.data?.message || error?.message || "Failed to send SMS.");
    }
  };

  // Reusable Message Block to avoid duplication
  const MessageBlock = () => (
    <div className="md:col-span-2">
      <label className="block">
        <span className="text-gray-600 dark:text-gray-400 font-medium mb-1 block">
          Message
        </span>
        <textarea
          name="message"
          value={smsData.message}
          onChange={handleChange}
          placeholder="Type your message here..."
          rows={6}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 resize-y"
        />
      </label>
      <div className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
        <p>Encoding: <span className="font-semibold">GSM</span></p>
        <p>SMS Parts: <span className="font-semibold">{smsParts}</span></p>
        <p>Chars Used: <span className="font-semibold">{charsUsed}</span> / {smsParts > 1 ? GSM_CONCAT_CHAR_LIMIT * smsParts : GSM_CHAR_LIMIT}</p>
        <p>Price: <span className="font-semibold">{price} ETB</span></p>
      </div>
      <label className="block mt-4">
        <span className="text-gray-600 dark:text-gray-400 font-medium mb-1 block">
          Schedule SMS (Optional)
        </span>
        <input
          type="datetime-local"
          onChange={handleScheduleChange}
          className="mt-1 block w-full h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        />
      </label>
      <button
        type="submit"
        disabled={isSendingSingle || isSendingGroup || isSendingBulk}
        className="mt-6 px-6 py-3 bg-brand-500 text-white font-semibold rounded-lg shadow-theme-xs hover:bg-brand-600 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-500 dark:hover:bg-brand-600"
      >
        {isSendingSingle || isSendingGroup || isSendingBulk ? "Sending..." : "Send SMS"}
      </button>
    </div>
  );

  return (
    <div>
      <PageMeta title="Send SMS | Fast SMS" description="Send SMS messages" />
      <PageBreadcrumb pageTitle="Send SMS" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="font-sans">
          
          {/* Header & Sender ID Request */}
          <div className="flex justify-between items-center mb-4 sm:mb-8">
            {/* <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Campaign</h2> */}
             <button
              onClick={() => setIsSenderModalOpen(true)}
              className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition"
            >
              Request New Sender ID
            </button>
          </div>

          <div className="bg-white dark:bg-white/[0.03] p-4 sm:p-6 lg:p-8 rounded-xl shadow-theme-md border border-gray-200 dark:border-gray-800">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-8">
              <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                {(["Single", "Group", "Bulk"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab
                        ? "border-brand-500 text-brand-600 dark:text-brand-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab === "Bulk" ? "Bulk (File)" : tab} SMS
                  </button>
                ))}
              </nav>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Left Column: Inputs based on Tab */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-white mb-3 sm:mb-4">
                    {activeTab} SMS Details
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Sender ID (Common) */}
                    <label className="block">
                      <span className="text-gray-600 dark:text-gray-400 font-medium mb-1 block">
                        Sender ID
                      </span>
                      <select
                        name="senderId"
                        value={smsData.senderId}
                        onChange={handleChange}
                        className="w-full h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
                      >
                         <option value="">Select Sender ID</option>
                        {approvedSenders.map((s) => (
                          <option key={s.id} value={s.id}>{s.name || s.senderId}</option>
                        ))}
                      </select>
                    </label>

                    {/* Single: Phone Number */}
                    {activeTab === "Single" && (
                      <label className="block">
                        <span className="text-gray-600 dark:text-gray-400 font-medium mb-1 block">
                          Phone Number
                        </span>
                        <input
                          type="text"
                          name="phoneNumber"
                          value={smsData.phoneNumber}
                          onChange={handleChange}
                          placeholder="+251..."
                          className="w-full h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
                        />
                      </label>
                    )}

                    {/* Group: Select Group */}
                    {activeTab === "Group" && (
                      <label className="block">
                        <span className="text-gray-600 dark:text-gray-400 font-medium mb-1 block">
                          Contact Group
                        </span>
                        <select
                          name="selectedGroup"
                          value={smsData.selectedGroup}
                          onChange={handleChange}
                           className="w-full h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
                        >
                          <option value="">Select Group</option>
                          {contactGroups.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                          ))}
                        </select>
                      </label>
                    )}

                    {/* Bulk: File Upload */}
                    {activeTab === "Bulk" && (
                      <label className="block">
                        <span className="text-gray-600 dark:text-gray-400 font-medium mb-1 block">
                          Upload File (CSV/Excel)
                        </span>
                        <input
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={handleFileChange}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-gray-800 dark:file:text-brand-400"
                        />
                        <p className="mt-1 text-xs text-cool-gray-500">
                          File should contain 'phoneNumber' column.
                        </p>
                      </label>
                    )}
                  </div>
                </div>

                {/* Right Column (Single Only): Search Contacts? */}
                {activeTab === "Single" && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-white mb-3 sm:mb-4">
                      Search Contacts
                    </h3>
                    {/* Placeholder for contact search */}
                    <input
                      type="text"
                      className="w-full h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
                      placeholder="Search to autofill phone..."
                    />
                  </div>
                )}
                
                {/* Full Width Message Block */}
                <MessageBlock />

              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Request Sender ID Modal */}
      {isSenderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
             <button
              onClick={() => setIsSenderModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Request Sender ID
            </h3>
            <input
              type="text"
              value={newSenderName}
              onChange={(e) => setNewSenderName(e.target.value)}
              placeholder="e.g. MyBrand"
              className="mb-4 w-full h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsSenderModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                disabled={isCreatingSender}
                onClick={async () => {
                   if (!newSenderName.trim()) return;
                   try {
                     await createSender({ name: newSenderName }).unwrap();
                     alert("Sender ID requested! Waiting for admin approval.");
                     setIsSenderModalOpen(false);
                     setNewSenderName("");
                   } catch (error: any) {
                     alert(error?.data?.message || "Failed.");
                   }
                }}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {isCreatingSender ? "Requesting..." : "Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
