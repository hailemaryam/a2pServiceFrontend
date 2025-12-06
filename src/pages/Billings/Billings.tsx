import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

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
  // State for the slider value, initializing near the minimum
  const [smsCount, setSmsCount] = useState<number>(1000);
  const minSms = 1000;
  const maxSms = 100000;

  // Function to handle slider change
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSmsCount(Number(event.target.value));
  };

  // Component for rendering a single package card
  const PackageCard: React.FC<{ pkg: Package }> = ({ pkg }) => {
    // Determine the border and button styles based on whether it's the current package
    const cardClass = pkg.isCurrent
      ? "border-4 border-brand-500 shadow-theme-lg dark:border-brand-500"
      : "border border-gray-200 dark:border-gray-800";
    const buttonClass = pkg.isCurrent
      ? "bg-brand-500 hover:bg-brand-600 text-white"
      : "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300";
    const priceText = pkg.perSms
      ? `ETB ${pkg.price.toFixed(2)}\n${pkg.perSms.toFixed(2)} ETB per SMS`
      : `ETB ${pkg.price}`;

    return (
      <div
        className={`p-6 rounded-xl transition duration-300 ease-in-out flex flex-col bg-white dark:bg-white/[0.03] ${cardClass}`}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-white">
            {pkg.name}
          </h3>
          {pkg.isCurrent && (
            <span className="bg-brand-500 text-white text-sm font-bold py-1 px-3 rounded-full">
              Current
            </span>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{pkg.range}</p>
        <div className="my-4">
          <p className="text-4xl font-bold text-brand-500 dark:text-brand-400 whitespace-pre-wrap">
            {priceText}
          </p>
        </div>
        <ul className="space-y-3 mt-4 flex-grow">
          {pkg.features.map((feature, index) => (
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
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="font-sans">
          {/* --- Header/Navigation --- */}
          <div className="flex justify-end text-sm text-brand-500 mb-8">
            <span className="text-gray-500 dark:text-gray-400">Dashboard / </span>
            <span className="font-medium ml-1">SMS LOG</span>
          </div>

          {/* --- Title Section --- */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">
              SMS LOG
            </h1>
            <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300">
              TamSMS Shortcode
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
              Choose your SMS package
            </p>
          </div>

          {/* --- SMS Count Slider --- */}
          <div className="mb-12 p-6 bg-white dark:bg-white/[0.03] rounded-xl shadow-theme-md border border-gray-200 dark:border-gray-800">
            <label className="text-lg font-medium text-gray-700 dark:text-white block mb-4">
              Number of SMS:
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-brand-500 dark:text-brand-400 font-semibold whitespace-nowrap">
                {smsCount.toLocaleString()} SMS
              </span>
              <input
                type="range"
                min={minSms}
                max={maxSms}
                step={100}
                value={smsCount}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #465fff 0%, #465fff ${((smsCount - minSms) / (maxSms - minSms)) * 100}%, #E5E7EB ${((smsCount - minSms) / (maxSms - minSms)) * 100}%, #E5E7EB 100%)`,
                }}
              />
              <input
                type="number"
                min={minSms}
                max={maxSms}
                value={smsCount}
                onChange={handleSliderChange}
                className="w-32 p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-right font-mono bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>{minSms.toLocaleString()}</span>
              <span>{maxSms.toLocaleString()}</span>
            </div>
          </div>

          {/* --- Pricing Cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {packages.map((pkg) => (
              <PackageCard key={pkg.name} pkg={pkg} />
            ))}
          </div>

          {/* --- Footer Notes --- */}
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
    </div>
  );
}
