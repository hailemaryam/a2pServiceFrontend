import { useState, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  useSendSingleSmsMutation,
  useSendGroupSmsMutation,
  useSendBulkSmsMutation,
} from "../../api/smsApi";
import { toast } from "react-toastify";
import { useGetSendersQuery } from "../../api/sendersApi";
import { useGetContactGroupsQuery } from "../../api/contactGroupsApi";

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
const GSM_CONCAT_CHAR_LIMIT = 153; // Standard GSM 7-bit concat limit
const UNICODE_CHAR_LIMIT = 70;
const UNICODE_CONCAT_CHAR_LIMIT = 67; // Standard UCS-2 concat limit

export default function SendSMS() {
  // Tabs: Single, Group, Bulk (File)
  const [activeTab, setActiveTab] = useState<"Single" | "Group" | "Bulk">(
    "Single"
  );

  const [smsData, setSmsData] = useState<SmsState>({
    senderId: "",
    phoneNumber: "",
    message: "",
    selectedGroup: "",
    uploadedFile: null,
    scheduledAt: undefined,
  });

  // Key to force re-render of file input
  const [inputKey, setInputKey] = useState(Date.now());

  // Modal State
  // const [isSenderModalOpen, setIsSenderModalOpen] = useState(false);
  // const [newSenderName, setNewSenderName] = useState("");

  // RTK Query hooks
  const { data: senders = [] } = useGetSendersQuery();
  const { data: contactGroups = [] } = useGetContactGroupsQuery();

  const [sendSingleSms, { isLoading: isSendingSingle }] =
    useSendSingleSmsMutation();
  const [sendGroupSms, { isLoading: isSendingGroup }] =
    useSendGroupSmsMutation();
  const [sendBulkSms, { isLoading: isSendingBulk }] = useSendBulkSmsMutation();
  // const [createSender, { isLoading: isCreatingSender }] = useCreateSenderMutation();

  // Get approved senders only
  const approvedSenders = useMemo(
    () => senders.filter((sender) => sender.status === "ACTIVE"),
    [senders]
  );

  // Calculate SMS metrics (based on GSM encoding)
  const { charsUsed, smsParts, encoding } = useMemo(() => {
    const chars = smsData.message.length;
    let detectedEncoding: "GSM" | "UNICODE" = "GSM";

    // Detect encoding (User provided logic: charCode > 127 is Unicode)
    for (let i = 0; i < chars; i++) {
      if (smsData.message.charCodeAt(i) > 127) {
        detectedEncoding = "UNICODE";
        break;
      }
    }

    let parts = 0;
    const singleLimit =
      detectedEncoding === "GSM" ? GSM_CHAR_LIMIT : UNICODE_CHAR_LIMIT;
    const concatLimit =
      detectedEncoding === "GSM"
        ? GSM_CONCAT_CHAR_LIMIT
        : UNICODE_CONCAT_CHAR_LIMIT;

    if (chars > 0) {
      if (chars <= singleLimit) {
        parts = 1;
      } else {
        parts = Math.ceil(chars / concatLimit);
      }
    }

    return {
      charsUsed: chars,
      smsParts: parts,
      encoding: detectedEncoding,
    };
  }, [smsData.message]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setSmsData((prev) => ({ ...prev, [name]: value }));
  };



  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError(null); // Reset error on new file selection

    if (!file) {
      setSmsData((prev) => ({ ...prev, uploadedFile: null }));
      return;
    }

    // 1. Validate File Type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    // Some browsers might not detect CSV type correctly, so check extension too
    const isCsv = file.name.toLowerCase().endsWith(".csv");
    const isExceL = file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls");

    if (!validTypes.includes(file.type) && !isCsv && !isExceL) {
      setFileError("Invalid file type. Please upload a CSV or Excel file.");
      setSmsData((prev) => ({ ...prev, uploadedFile: null }));
      return;
    }

    // 2. Client-side CSV Validation (Lightweight)
    if (isCsv) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (!text || text.trim().length === 0) {
          setFileError("The file is empty. Please upload a file with data.");
          setSmsData((prev) => ({ ...prev, uploadedFile: null }));
          return;
        }

        const lines = text.split(/\r\n|\n/);
        const header = lines[0]?.toLowerCase();

        if (!header || !header.includes("phonenumber")) {
          setFileError("Missing 'phoneNumber' column in the header. Please check your CSV file.");
          setSmsData((prev) => ({ ...prev, uploadedFile: null }));
          return;
        }

        // Basic check: at least one row of data
        if (lines.length < 2 || lines.every((line, idx) => idx === 0 || !line.trim())) {
          setFileError("The file contains no data rows. Please add contacts.");
          setSmsData((prev) => ({ ...prev, uploadedFile: null }));
          return;
        }

        // If all checks pass
        setSmsData((prev) => ({ ...prev, uploadedFile: file }));
      };
      reader.onerror = () => {
        setFileError("Failed to read file.");
        setSmsData((prev) => ({ ...prev, uploadedFile: null }));
      };
      reader.readAsText(file);
    } else {
      // Excel files - accept for now (server-side validation)
      setSmsData((prev) => ({ ...prev, uploadedFile: file }));
    }
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmsData((prev) => ({
      ...prev,
      scheduledAt: e.target.value
        ? new Date(e.target.value).toISOString()
        : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === "Single") {
        if (!smsData.senderId || !smsData.phoneNumber || !smsData.message) {
          toast.error("Please fill in all required fields");
          return;
        }
        await sendSingleSms({
          senderId: smsData.senderId,
          phoneNumber: smsData.phoneNumber,
          message: smsData.message,
          scheduledAt: smsData.scheduledAt
        }).unwrap();
        toast.success("Single SMS sent successfully!");
        setSmsData((prev) => ({
          ...prev,
          phoneNumber: "",
          message: "",
          scheduledAt: undefined,
        }));
      } else if (activeTab === "Group") {
        if (!smsData.senderId || !smsData.selectedGroup || !smsData.message) {
          toast.error("Please fill in all required fields (Group)");
          return;
        }
        await sendGroupSms({
          senderId: smsData.senderId,
          groupId: smsData.selectedGroup!,
          message: smsData.message,
          scheduledAt: smsData.scheduledAt,
        }).unwrap();
        toast.success("Group SMS sent successfully!");
        setSmsData((prev) => ({
          ...prev,
          message: "",
          scheduledAt: undefined,
        }));
      } else if (activeTab === "Bulk") {
        // Bulk = File Upload
        if (!smsData.senderId || !smsData.uploadedFile || !smsData.message) {
          toast.error("Please fill in all required fields and upload a file");
          return;
        }
        await sendBulkSms({
          senderId: smsData.senderId,
          message: smsData.message,
          file: smsData.uploadedFile,
          scheduledAt: smsData.scheduledAt,
        }).unwrap();
        toast.success("Bulk SMS (File) sent successfully!");
        setSmsData((prev) => ({
          ...prev,
          uploadedFile: null,
          message: "",
          scheduledAt: undefined,
        }));
        setInputKey(Date.now());
      }
    } catch (error: any) {
      console.error("Failed to send SMS:", error);
      toast.error(
        error?.data?.message || error?.message || "Failed to send SMS."
      );
    }
  };

  return (
    <div>
      <PageMeta title="Send SMS | Fast SMS" description="Send SMS messages" />
      <PageBreadcrumb pageTitle="Send SMS" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="font-sans">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-8">
            {/* <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Campaign</h2> */}
          </div>

          <div className="bg-white dark:bg-white/[0.03] p-4 sm:p-6 lg:p-8 rounded-xl shadow-theme-md border border-gray-200 dark:border-gray-800">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-8">
              <nav
                className="-mb-px flex space-x-8 overflow-x-auto"
                aria-label="Tabs"
              >
                {(["Single", "Group", "Bulk"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab
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
                          <option key={s.id} value={s.id}>
                            {s.name || s.id}
                          </option>
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
                            <option key={g.id} value={g.id}>
                              {g.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    {/* Bulk: File Upload */}
                    {activeTab === "Bulk" && (
                      <div className="space-y-2">
                        <label className="block">
                          <span className="text-gray-600 dark:text-gray-400 font-medium mb-1 block">
                            Upload File (CSV/Excel)
                          </span>
                          <div className="relative">
                            <input
                              key={inputKey}
                              type="file"
                              accept=".csv,.xlsx,.xls"
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex h-11 items-center justify-between rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm dark:border-gray-700">
                              <span className="text-gray-500 truncate mr-2">
                                {smsData.uploadedFile ? smsData.uploadedFile.name : "Choose file..."}
                              </span>
                              <span className="bg-brand-50 text-brand-700 dark:bg-gray-800 dark:text-brand-400 px-3 py-1 rounded-md text-xs font-semibold">
                                Browse
                              </span>
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-cool-gray-500">
                            File should contain 'phoneNumber' column.
                          </p>
                          {fileError && (
                            <p className="mt-2 text-sm text-error-500 font-medium animate-pulse">
                              ⚠️ {fileError}
                            </p>
                          )}
                        </label>
                      </div>
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
                    <p>
                      Encoding:{" "}
                      <span className="font-semibold">{encoding}</span>
                    </p>
                    <p>
                      SMS Parts:{" "}
                      <span className="font-semibold">{smsParts}</span>
                    </p>
                    <p>
                      Chars Used:{" "}
                      <span className="font-semibold">{charsUsed}</span> /{" "}
                      {smsParts > 1
                        ? (encoding === "GSM"
                          ? GSM_CONCAT_CHAR_LIMIT
                          : UNICODE_CONCAT_CHAR_LIMIT) * smsParts
                        : encoding === "GSM"
                          ? GSM_CHAR_LIMIT
                          : UNICODE_CHAR_LIMIT}
                    </p>
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
                    disabled={
                      isSendingSingle || isSendingGroup || isSendingBulk
                    }
                    className="mt-6 px-6 py-3 bg-brand-500 text-white font-semibold rounded-lg shadow-theme-xs hover:bg-brand-600 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-500 dark:hover:bg-brand-600"
                  >
                    {isSendingSingle || isSendingGroup || isSendingBulk
                      ? "Sending..."
                      : "Send SMS"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Request Sender ID Modal Removed */}
    </div>
  );
}
