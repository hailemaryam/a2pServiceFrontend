import { useState, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

// Type definitions for component state
interface SmsState {
  senderId: string;
  phoneNumber: string;
  message: string;
  contactSearch: string;
}

// Constants for SMS limits (GSM encoding)
const GSM_CHAR_LIMIT = 160;
const GSM_CONCAT_CHAR_LIMIT = 153;

export default function SendSMS() {
  const [activeTab, setActiveTab] = useState<"Single" | "Bulk" | "File">("Single");
  const [smsData, setSmsData] = useState<SmsState>({
    senderId: "",
    phoneNumber: "",
    message: "",
    contactSearch: "",
  });

  // Calculate SMS metrics (based on GSM encoding)
  const { charsUsed, smsParts, price } = useMemo(() => {
    const chars = smsData.message.length;
    let parts = 0;

    // Determine the character limit based on whether concatenation is needed
    if (chars > 0) {
      if (chars <= GSM_CHAR_LIMIT) {
        parts = 1;
      } else {
        // Calculate parts for concatenated messages
        parts = Math.ceil(chars / GSM_CONCAT_CHAR_LIMIT);
      }
    }
    // Placeholder for actual price calculation logic
    const calculatedPrice = (parts * 0.5).toFixed(2); // Example rate: 0.5 ETB per part
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending SMS:", smsData);
    // Add logic for sending the SMS
  };

  // The fields displayed for 'Single SMS'
  const SingleSmsForm: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column - Form Inputs */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
          Single SMS form
        </h3>
        <div className="space-y-6">
          <label className="block">
            <span className="text-gray-600 dark:text-gray-400 font-medium mb-1 block">
              Sender ID
            </span>
            <select
              name="senderId"
              value={smsData.senderId}
              onChange={handleChange}
              className="mt-1 block w-full h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              <option value="">Select Sender ID</option>
              <option value="TamSMS">TamSMS</option>
              <option value="ServiceAlert">ServiceAlert</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-600 dark:text-gray-400 font-medium mb-1 block">
              Phone Number
            </span>
            <input
              type="text"
              name="phoneNumber"
              value={smsData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="mt-1 block w-full h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </label>
        </div>
      </div>
      {/* Right Column - Search Contacts */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
          Search Contacts
        </h3>
        <label className="block">
          <div className="relative">
            <input
              type="text"
              name="contactSearch"
              value={smsData.contactSearch}
              onChange={handleChange}
              placeholder="Phone Number / Contact Name"
              className="pl-10 mt-1 block w-full h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
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
        </label>
      </div>

      {/* Full Width - Message Area */}
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

        {/* SMS Details Block */}
        <div className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <p>
            Encoding: <span className="font-semibold">GSM</span>
          </p>
          <p>
            SMS Parts: <span className="font-semibold">{smsParts}</span>
          </p>
          <p>
            Chars Used: <span className="font-semibold">{charsUsed}</span> /{" "}
            {smsParts > 1 ? GSM_CONCAT_CHAR_LIMIT * smsParts : GSM_CHAR_LIMIT}
          </p>
          <p>
            Price: <span className="font-semibold">{price} ETB</span>
          </p>
        </div>
        {/* Send Button */}
        <button
          type="submit"
          className="mt-6 px-6 py-3 bg-brand-500 text-white font-semibold rounded-lg shadow-theme-xs hover:bg-brand-600 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-500 dark:hover:bg-brand-600"
          disabled={!smsData.phoneNumber || !smsData.message}
        >
          Send SMS
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <PageMeta title="Send SMS | Fast SMS" description="Send SMS messages" />
      <PageBreadcrumb pageTitle="Send SMS" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="font-sans">
          {/* --- Header/Navigation --- */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Send SMS</h1>
            <div className="text-sm text-brand-500 dark:text-brand-400">
              <span className="text-gray-500 dark:text-gray-400">Dashboard / </span>
              <span className="font-medium ml-1">Send SMS</span>
            </div>
          </div>

          {/* --- Content Card --- */}
          <div className="bg-white dark:bg-white/[0.03] p-8 rounded-xl shadow-theme-md border border-gray-200 dark:border-gray-800">
            {/* --- Tab Navigation --- */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {(["Single", "Bulk", "File"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-lg transition-colors duration-200 ${
                      activeTab === tab
                        ? "border-error-500 text-error-600 dark:text-error-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab} SMS
                  </button>
                ))}
              </nav>
            </div>

            {/* --- Form Section --- */}
            <form onSubmit={handleSubmit}>
              {activeTab === "Single" && <SingleSmsForm />}
              {activeTab === "Bulk" && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  Bulk SMS form coming soon...
                </div>
              )}
              {activeTab === "File" && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  File SMS form coming soon...
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
