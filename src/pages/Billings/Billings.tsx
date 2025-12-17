import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { CloseIcon } from "../../icons";
import { useInitializePaymentMutation } from "../../api/paymentApi";

// Type definition for the SMS package data
interface Package {
  name: string;
  range: string;
  price: number;
  perSms?: number;
  features: string[];
  isCurrent: boolean;
}

const packages: Package[] = [
  {
    name: "ጀማሪ", // Jemari (Beginner/Starter)
    range: "1,000 - 10,000 SMS",
    price: 650,
    features: [
      "Custom Sender ID",
      "Bulk SMS",
      "OTP",
      "Shared Shortcode",
      "Schedule SMS",
      "No Expiration",
    ],
    isCurrent: true,
  },
  {
    name: "አነስተኛ", // Ansetegna (Small/Moderate)
    range: "10,001 - 50,000 SMS",
    price: 3500.35,
    perSms: 0.35,
    features: [
      "Custom Sender ID",
      "Bulk SMS",
      "OTP",
      "Shared Shortcode",
      "Schedule SMS",
      "No Expiration",
    ],
    isCurrent: false,
  },
  {
    name: "ትልቅ", // Teleq (Large)
    range: "50,001 - 100,000 SMS",
    price: 12500.25,
    perSms: 0.25,
    features: [
      "Custom Sender ID",
      "Bulk SMS",
      "OTP",
      "Shared Shortcode",
      "Schedule SMS",
      "No Expiration",
    ],
    isCurrent: false,
  },
];

export default function Billings() {
  const [smsCount, setSmsCount] = useState<number>(1000);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billingName, setBillingName] = useState("");
  const [subscription, setSubscription] = useState("");
  
  const [initializePayment, { isLoading: isPaying }] = useInitializePaymentMutation();

  const minSms = 1000;
  const maxSms = 100000;

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSmsCount(Number(event.target.value));
  };

  const handlePackageClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
    setBillingName("");
    setSubscription("");
  };

  const getActivePackageForSmsCount = (count: number): string | null => {
    if (count <= 10000) {
      return "ጀማሪ";
    } else if (count <= 50000) {
      return "አነስተኛ";
    } else {
      return "ትልቅ";
    }
  };

  const PackageCard: React.FC<{ pkg: Package; index: number }> = ({ pkg, index }) => {
    const activePackageName = getActivePackageForSmsCount(smsCount);
    const isActiveForSmsCount = activePackageName === pkg.name;

    // First card never gets the orange border
    const showOrangeBorder = index !== 0 && isActiveForSmsCount;

    const cardClass = pkg.isCurrent && !showOrangeBorder
      ? "border-4 border-brand-500 shadow-theme-lg dark:border-brand-500"
      : showOrangeBorder
      ? "border-4 border-[#E57A38] shadow-[0_4px_20px_rgba(229,122,56,0.3)] dark:border-[#E57A38]"
      : "border border-gray-200 dark:border-gray-800";

    const buttonClass = pkg.isCurrent
      ? "bg-brand-500 hover:bg-brand-600 text-white"
      : "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300";

    const priceText = pkg.perSms
      ? `ETB ${pkg.price.toFixed(2)}\n${pkg.perSms.toFixed(2)} ETB per SMS`
      : `ETB ${pkg.price}`;

    return (
      <div
        className={`p-6 rounded-xl transition duration-300 ease-in-out flex flex-col bg-white dark:bg-white/[0.03] cursor-pointer hover:shadow-theme-md ${cardClass}`}
        onClick={() => handlePackageClick(pkg)}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-white">
            {pkg.name}
          </h3>
          {pkg.isCurrent && (
            <span className="bg-brand-500 text-white text-xs sm:text-sm font-bold py-1 px-2 sm:px-3 rounded-full">
              Current
            </span>
          )}
        </div>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">{pkg.range}</p>
        <div className="my-3 sm:my-4">
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-500 dark:text-brand-400 whitespace-pre-wrap">
            {priceText}
          </p>
        </div>
        <ul className="space-y-3 mt-4 flex-grow">
          {pkg.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center text-gray-600 dark:text-gray-300"
            >
              <svg
                className="w-5 h-5 text-success-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <button
          className={`mt-6 w-full py-3 rounded-lg font-bold transition duration-150 ${buttonClass}`}
          disabled={pkg.isCurrent}
          onClick={() => console.log(`Selecting ${pkg.name} plan`)}
        >
          {pkg.isCurrent ? "Current Plan" : "Select Plan"}
        </button>
      </div>
    );
  };

  return (
    <div>
      <PageMeta title="SMS LOG | Fast SMS" description="SMS pricing and packages" />
      <PageBreadcrumb pageTitle="SMS LOG" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="font-sans">
          <div className="mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-300">
              TamSMS Shortcode
            </h2>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mt-2">
              Choose your SMS package
            </p>
          </div>

          <div className="mb-8 sm:mb-12 p-4 sm:p-6 bg-white dark:bg-white/[0.03] rounded-xl shadow-theme-md border border-gray-200 dark:border-gray-800">
            <label className="text-base sm:text-lg font-medium text-gray-700 dark:text-white block mb-3 sm:mb-4">
              Number of SMS:
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:space-x-4">
              <span className="text-brand-500 dark:text-brand-400 font-semibold whitespace-nowrap text-sm sm:text-base">
                {smsCount.toLocaleString()} SMS
              </span>
              <input
                type="range"
                min={minSms}
                max={maxSms}
                step={100}
                value={smsCount}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-offset-2 slider-thumb-orange"
                style={{
                  background: `linear-gradient(to right, #E57A38 0%, #E57A38 ${
                    ((smsCount - minSms) / (maxSms - minSms)) * 100
                  }%, #E5E7EB ${
                    ((smsCount - minSms) / (maxSms - minSms)) * 100
                  }%, #E5E7EB 100%)`,
                }}
              />
              <style>{`
                .slider-thumb-orange::-webkit-slider-thumb {
                  appearance: none;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: #E57A38;
                  cursor: pointer;
                  border: 2px solid #fff;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .slider-thumb-orange::-moz-range-thumb {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: #E57A38;
                  cursor: pointer;
                  border: 2px solid #fff;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
              `}</style>
              <input
                type="number"
                min={minSms}
                max={maxSms}
                value={smsCount}
                onChange={handleSliderChange}
                className="w-full sm:w-32 p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-right font-mono bg-white dark:bg-gray-900 text-gray-800 dark:text-white text-sm sm:text-base"
              />
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>{minSms.toLocaleString()}</span>
              <span>{maxSms.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-10">
            {packages.map((pkg, index) => (
              <PackageCard key={pkg.name} pkg={pkg} index={index} />
            ))}
          </div>

          <div className="space-y-3 mt-10">
            <blockquote className="p-4 bg-error-50 dark:bg-error-500/10 border-l-4 border-error-500 text-error-700 dark:text-error-400 rounded-md">
              * If you are a new user please call to{" "}
              <a
                href="tel:0979434331"
                className="font-bold underline hover:text-error-800 dark:hover:text-error-300"
              >
                0979434331
              </a>{" "}
              before paying.
            </blockquote>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              * All prices are VAT inclusive.
            </p>
          </div>
        </div>
      </div>

      {isModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <CloseIcon className="h-6 w-6" />
            </button>

            <div className="mb-4 sm:mb-5 border-b border-gray-200 pb-3 dark:border-gray-700">
              <h3 className="pr-6 sm:pr-8 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                subscription for "{selectedPackage.name} Billing #no 109"
              </h3>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Billing Name:
                </label>
                <input
                  type="text"
                  placeholder="Billing Name"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subscription:
                </label>
                <select
                  value={subscription}
                  onChange={(e) => setSubscription(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">Select Sender ID</option>
                  <option value="TamSMS">TamSMS</option>
                  <option value="ServiceAlert">ServiceAlert</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Billing Amount:
                </label>
                <p className="mb-2 font-bold text-gray-900 dark:text-white">
                  ETB {selectedPackage.price.toFixed(2)}
                </p>
                <input
                  type="text"
                  value={`ETB ${selectedPackage.price.toFixed(2)}`}
                  readOnly
                  className="h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Payment Method:
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  <input
                    type="radio"
                    name="payment_method_modal"
                    defaultChecked
                    className="h-4 w-4 text-brand-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    FENANPAY Fenan Pay
                  </span>
                </div>
              </div>

              <button
                disabled={isPaying}
                 onClick={async () => {
                   if (!selectedPackage) return;
                   try {
                     const response = await initializePayment({ 
                       amount: selectedPackage.price,
                       // description: `Purchase ${selectedPackage.name} package` // If API supports it
                     }).unwrap();
                     
                     if (response.checkoutUrl) {
                       window.location.href = response.checkoutUrl;
                     } else {
                       alert("Payment initialized but no checkout URL returned.");
                     }
                   } catch (error: any) {
                     console.error("Payment failed", error);
                     alert(error?.data?.message || "Payment initialization failed");
                   }
                 }}
                className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600 disabled:opacity-70"
              >
                {isPaying ? "Processing..." : "Pay Now"}
              </button>

              <div>
                <h4 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
                  Or Pay With Cash:
                </h4>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Note: After payment please contact{" "}
                  <a
                    href="tel:+251979434331"
                    className="font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    +251979434331
                  </a>{" "}
                  with your code.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
