import { useState, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useInitializePaymentMutation } from "../../api/paymentApi";
import { useGetTenantSmsPackagesQuery } from "../../api/tenantApi";

// Hardcoded features list (Marketing text, static)
const FEATURES_LIST = [
  "Custom Sender ID",
  "Bulk SMS",
  "OTP",
  "Shared Shortcode",
  "Schedule SMS",
  "No Expiration",
];

export default function Billings() {
  const [smsCount, setSmsCount] = useState<number>(1000);
  
  // Fetch packages from Tenant API
  const { data: packages = [], isLoading: isLoadingPackages, error: loadError } = useGetTenantSmsPackagesQuery();
  
  const [initializePayment, { isLoading: isPaying }] = useInitializePaymentMutation();

  const minSms = 1000;
  const maxSms = 100000;

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSmsCount(Number(event.target.value));
  };

  // Determine active package tier based on smsCount
  const activePackage = useMemo(() => {
    if (!packages || packages.length === 0) return null;
    return packages.find(
      (pkg) => 
        smsCount >= pkg.minSmsCount && 
        (pkg.maxSmsCount === undefined || pkg.maxSmsCount === null || smsCount <= pkg.maxSmsCount)
    );
  }, [packages, smsCount]);

  // Calculate dynamic price
  const totalPrice = activePackage ? smsCount * activePackage.pricePerSms : 0;

  const handlePayment = async () => {
    if (!activePackage) {
      alert("No applicable package found for this SMS count.");
      return;
    }

    try {
      // Send smsCount + packageTierId (if needed by backend, though backend usually re-calcs)
      // The instruction says: "Frontend sends only: smsCount + packageTierId"
      const response = await initializePayment({ 
        amount: totalPrice, // UI display amount, backend should verify
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
  };

  if (isLoadingPackages) {
    return <div className="p-10 text-center">Loading packages...</div>;
  }

  if (loadError) {
    return <div className="p-10 text-center text-error-500">Failed to load package pricing. Please try again later.</div>;
  }

  return (
    <div>
      <PageMeta title="SMS LOG | Fast SMS" description="SMS pricing and packages" />
      <PageBreadcrumb pageTitle="SMS LOG" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="font-sans">
          <div className="mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-300">
              TamSMS Pricing
            </h2>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mt-2">
              Select the number of SMS you need.
            </p>
          </div>

          {/* Slider Section */}
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

          {/* Pricing & Features Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Active Package Info & Price */}
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-theme-lg">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">
                Active Tier: <span className="text-brand-500">{activePackage ? activePackage.description : "None"}</span>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {activePackage ? `InRange: ${activePackage.minSmsCount.toLocaleString()} - ${activePackage.maxSmsCount ? activePackage.maxSmsCount.toLocaleString() : "Unlimited"} SMS` : "Select a valid range"}
              </p>

              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ETB {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  {activePackage && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      (@ {activePackage.pricePerSms.toFixed(2)} / SMS)
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <input
                    type="radio"
                    name="payment_method"
                    defaultChecked
                    className="h-4 w-4 text-brand-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    FENANPAY Fenan Pay
                  </span>
                </div>
                
                <button
                  onClick={handlePayment}
                  disabled={isPaying || !activePackage}
                  className="w-full py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold transition duration-150 shadow-theme-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPaying ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>

            {/* Right: Static Features List */}
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <h4 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                What's included:
              </h4>
              <ul className="space-y-3">
                {FEATURES_LIST.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
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
            </div>
          </div>

          {/* <div className="space-y-3 mt-10">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
