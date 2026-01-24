import { useState } from "react";
import { useGetTenantSmsPackagesQuery, SmsPackageTier } from "../../api/tenantApi";

const STATIC_FEATURES = [
    "Custom Sender ID",
    "Bulk SMS",
    "OTP & Transactional SMS",
    "API Access",
    "Schedule SMS",
    "No Expiration",
];

export default function Pricing() {
    const [smsCount, setSmsCount] = useState<number | "">(1000);
    const { data: packages = [], isLoading, error } = useGetTenantSmsPackagesQuery();

    const minSms = 1;
    const maxSms = 1000000;

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

    const getActivePackageForSmsCount = (count: number | ""): SmsPackageTier | undefined => {
        if (count === "") return undefined;
        return packages.find(
            (pkg) =>
                count >= pkg.minSmsCount &&
                (pkg.maxSmsCount === undefined || pkg.maxSmsCount === null || count <= pkg.maxSmsCount)
        );
    };

    const activePackage = getActivePackageForSmsCount(smsCount);
    const totalPrice = activePackage && smsCount !== "" ? smsCount * activePackage.pricePerSms : 0;

    const PackageCard = ({ pkg }: { pkg: SmsPackageTier }) => {
        const isActive = activePackage?.id === pkg.id;
        const cardClass = isActive
            ? "border-4 border-brand-500 shadow-xl dark:border-brand-500 transform scale-105 z-10"
            : "border border-gray-200 dark:border-gray-800 opacity-80 hover:opacity-100";

        const rangeText = pkg.maxSmsCount
            ? `${pkg.minSmsCount.toLocaleString()} - ${pkg.maxSmsCount.toLocaleString()}`
            : `${pkg.minSmsCount.toLocaleString()}+`;

        return (
            <div className={`p-6 rounded-2xl transition-all duration-300 flex flex-col bg-white dark:bg-gray-800 ${cardClass}`}>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {pkg.description || "SMS Package"}
                    </h3>
                    {isActive && (
                        <span className="bg-brand-500 text-white text-xs font-bold py-1 px-3 rounded-full">
                            Best Value
                        </span>
                    )}
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 mt-2">
                    Range: {rangeText} SMS
                </p>
                <div className="mb-6">
                    <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                        {pkg.pricePerSms.toFixed(2)} <span className="text-base font-normal text-gray-500">ETB/SMS</span>
                    </p>
                </div>
                <ul className="space-y-3 mt-auto border-t border-gray-100 dark:border-gray-700 pt-6">
                    {STATIC_FEATURES.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span className="mr-3 text-brand-500 font-bold">✓</span> {feature}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <section id="pricing" className="py-24 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                        The more you send, the less you pay per SMS. No hidden fees or contracts.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto mb-20">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 sm:p-12 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="mb-12 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
                            <div>
                                <label className="text-xl font-bold text-gray-900 dark:text-white">
                                    How many SMS do you need?
                                </label>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">Adjust the slider to see your price tiers.</p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex items-center justify-center gap-3">
                                <input
                                    type="number"
                                    min={minSms}
                                    max={maxSms}
                                    value={smsCount}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className="w-32 p-3 text-center font-bold text-xl border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none shadow-sm"
                                />
                                <span className="text-gray-500 font-bold text-lg">SMS</span>
                            </div>
                        </div>

                        <div className="mb-12">
                            <input
                                type="range"
                                min={minSms}
                                max={maxSms}
                                step={100}
                                value={smsCount === "" ? minSms : smsCount}
                                onChange={handleSliderChange}
                                className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none slider-thumb-brand"
                                style={{
                                    background: `linear-gradient(to right, #E57A38 0%, #E57A38 ${(((Number(smsCount) || minSms) - minSms) / (maxSms - minSms)) * 100}%, #d1d5db ${(((Number(smsCount) || minSms) - minSms) / (maxSms - minSms)) * 100}%, #d1d5db 100%)`,
                                }}
                            />
                            <div className="flex justify-between text-sm font-semibold text-gray-400 mt-4">
                                <span>{minSms.toLocaleString()}</span>
                                <span>{maxSms.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-md border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1">
                                    Estimated Total Price
                                </p>
                                <div className="flex items-baseline justify-center md:justify-start gap-2">
                                    <span className="text-5xl font-black text-gray-900 dark:text-white">
                                        ETB {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                {activePackage && (
                                    <p className="mt-3 text-gray-500 dark:text-gray-400 font-medium">
                                        {(Number(smsCount) || 0).toLocaleString()} SMS × {activePackage.pricePerSms.toFixed(2)} ETB/SMS
                                    </p>
                                )}
                            </div>
                            <a
                                href="#/register"
                                className="w-full md:w-auto px-10 py-4 bg-brand-500 hover:bg-brand-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-center"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {isLoading ? (
                        <div className="col-span-3 text-center py-10">Loading packages...</div>
                    ) : error ? (
                        <div className="col-span-3 text-center py-10 text-red-500">Failed to load local pricing packages.</div>
                    ) : (
                        packages.map(pkg => (
                            <PackageCard key={pkg.id} pkg={pkg} />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
