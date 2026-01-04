import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useGetTenantSmsPackagesQuery, SmsPackageTier } from "../../api/tenantApi";

// Static features list as per instructions ("informational / marketing text")
const STATIC_FEATURES = [
  "Custom Sender ID",
  "Bulk SMS",
  "OTP",
  "Shared Shortcode",
  "Schedule SMS",
  "No Expiration",
];

export default function Billings() {
  const navigate = useNavigate();
  const [smsCount, setSmsCount] = useState<number | "">(1000);
  
  // Fetch packages from Backend
  const { data: packages = [], isLoading, error, refetch } = useGetTenantSmsPackagesQuery();

  const minSms = 1000;
  const maxSms = 100000;

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSmsCount(Number(event.target.value));
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") {
      setSmsCount("");
      return;
    }
    const num = Number(value);
    setSmsCount(num);
  };

  const handleBlur = () => {
    if (smsCount === "" || smsCount < minSms) {
      setSmsCount(minSms);
    } else if (smsCount > maxSms) {
      setSmsCount(maxSms);
    }
  };

  const handleQuickAdd = (amount: number) => {
    setSmsCount((prev) => (Number(prev || 0) + amount));
  };

  // Determine active package logic: min <= smsCount <= max
  const getActivePackageForSmsCount = (count: number | ""): SmsPackageTier | undefined => {
    if (count === "") return undefined;
    return packages.find(
      (pkg) => 
        count >= pkg.minSmsCount && 
        (pkg.maxSmsCount === undefined || pkg.maxSmsCount === null || count <= pkg.maxSmsCount)
    );
  };
  
  const activePackage = getActivePackageForSmsCount(smsCount);

  // Calculate estimated price
  const totalPrice = activePackage && smsCount !== "" ? smsCount * activePackage.pricePerSms : 0;

  const handleOrderNow = () => {
    if (!activePackage) return;
    navigate("/billing/checkout", {
      state: {
        smsCount,
        packageTierId: activePackage.id,
        packageName: activePackage.description,
        estimatedPrice: totalPrice,
        pricePerSms: activePackage.pricePerSms,
      }
    });
  };

  // Render Package Card (Visual Only)
  const PackageCard = ({ pkg }: { pkg: SmsPackageTier }) => {
    const isActive = activePackage?.id === pkg.id;

    const cardClass = isActive
      ? "border-4 border-brand-500 shadow-theme-lg dark:border-brand-500 transform scale-105 z-10"
      : "border border-gray-200 dark:border-gray-800 opacity-80 hover:opacity-100";

    const rangeText = pkg.maxSmsCount 
      ? `${pkg.minSmsCount.toLocaleString()} - ${pkg.maxSmsCount.toLocaleString()}`
      : `${pkg.minSmsCount.toLocaleString()}+`;

    return (
      <div
        className={`p-6 rounded-xl transition-all duration-300 flex flex-col bg-white dark:bg-white/[0.03] ${cardClass}`}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-white">
            {pkg.description || "SMS Package"}
          </h3>
          {isActive && (
            <span className="bg-brand-500 text-white text-xs sm:text-sm font-bold py-1 px-3 rounded-full shadow-sm">
              Active
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 mt-2">
          Range: {rangeText} SMS
        </p>
        <div className="my-3">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {pkg.pricePerSms.toFixed(2)} <span className="text-base font-normal text-gray-500">ETB/SMS</span>
          </p>
        </div>
        <ul className="space-y-2 mt-4 flex-grow border-t border-gray-100 dark:border-gray-700 pt-4">
          {STATIC_FEATURES.slice(0, 4).map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
               <span className="mr-2 text-success-500">✓</span> {feature}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <PageMeta title="SMS Pricing | Fast SMS" description="Dynamic SMS Pricing" />
      <PageBreadcrumb pageTitle="Pricing" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        
        {/* Header */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Flexible SMS Pricing
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
              Slide to choose the volume that fits your needs. The more you send, the less you pay per SMS.
            </p>
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
                Refresh Packages
              </button>
          </div>
        </div>

        {/* Pricing Configurator Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700 shadow-sm">
            
            {/* 1. Slider & Input */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <label className="text-lg font-medium text-gray-700 dark:text-white">
                  How many SMS do you need?
                </label>
                <div className="flex items-center gap-2">
                   <input
                    type="number"
                    min={minSms}
                    max={maxSms}
                    value={smsCount}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-28 p-2 text-right font-bold text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                   />
                   <span className="text-gray-500 font-medium">SMS</span>
                </div>
              </div>

              {/* Quick Add Buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[1000, 5000, 10000, 50000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickAdd(amount)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 dark:hover:bg-brand-900/30 dark:hover:text-brand-400 dark:hover:border-brand-800 transition-all"
                  >
                    +{amount.toLocaleString()}
                  </button>
                ))}
                <button
                  onClick={() => setSmsCount(minSms)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 transition-all ml-auto"
                >
                  Reset
                </button>
              </div>

              <input
                type="range"
                min={minSms}
                max={maxSms}
                step={100}
                value={smsCount === "" ? minSms : smsCount}
                onChange={handleSliderChange}
                className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none slider-thumb-brand"
                style={{
                  background: `linear-gradient(to right, #E57A38 0%, #E57A38 ${
                    (((Number(smsCount) || minSms) - minSms) / (maxSms - minSms)) * 100
                  }%, #d1d5db ${
                    (((Number(smsCount) || minSms) - minSms) / (maxSms - minSms)) * 100
                  }%, #d1d5db 100%)`,
                }}
              />
              <style>{`
                .slider-thumb-brand::-webkit-slider-thumb {
                   appearance: none;
                   width: 24px;
                   height: 24px;
                   border-radius: 50%;
                   background: #E57A38;
                   cursor: pointer;
                   border: 4px solid #fff;
                   box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                   transition: transform 0.1s;
                }
                .slider-thumb-brand::-webkit-slider-thumb:hover {
                   transform: scale(1.1);
                }
                 .slider-thumb-brand::-moz-range-thumb {
                   width: 24px;
                   height: 24px;
                   border-radius: 50%;
                   background: #E57A38;
                   cursor: pointer;
                   border: 4px solid #fff;
                   box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
              `}</style>
              <div className="flex justify-between text-xs font-medium text-gray-400 mt-2">
                 <span>{minSms.toLocaleString()}</span>
                 <span>{maxSms.toLocaleString()}</span>
              </div>
            </div>

            {/* 2. Live Pricing Box */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-theme-xs border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300">
               
               {/* Left: Price Breakdown */}
               <div className="flex-1 w-full text-center md:text-left">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Estimated Total Price
                  </p>
                  <div className="flex items-baseline justify-center md:justify-start gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      ETB {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  {activePackage ? (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-center md:justify-start">
                       <span className="bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 px-2 py-0.5 rounded font-medium">
                         {activePackage.description} Tier
                       </span>
                       <span>
                         {(Number(smsCount) || 0).toLocaleString()} SMS × {activePackage.pricePerSms.toFixed(2)} ETB
                       </span>
                    </div>
                  ) : (
                    <p className="mt-2 text-error-500 font-medium">No package available for this volume</p>
                  )}
               </div>

               {/* Right: Order Button */}
               <div>
                  <button
                    onClick={handleOrderNow}
                    disabled={!activePackage}
                    className="w-full md:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    Order Now
                  </button>
               </div>
            </div>

          </div>
        </div>

        {/* 3. Package Cards (Visual Reference) */}
        <div className="mb-12">
           <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
             Available Packages
           </h3>
           
           {isLoading ? (
             <div className="text-center py-10">Loading packages...</div>
           ) : error ? (
             <div className="text-center py-10 text-error-500">Failed to load packages.</div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map(pkg => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
