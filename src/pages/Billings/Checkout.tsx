import { useLocation, useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { 
    smsCount: number; 
    packageTierId: string; 
    packageName: string;
    estimatedPrice: number; 
    pricePerSms: number;
  } | null;

  if (!state) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-error-500">No checkout data found</h2>
        <button 
          onClick={() => navigate("/billings")}
          className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg"
        >
          Return to Billing
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageMeta title="Checkout | Fast SMS" description="Complete your SMS purchase" />
      <PageBreadcrumb pageTitle="Checkout" />
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="max-w-2xl mx-auto text-center py-10">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-success-50 text-success-500 dark:bg-success-500/10">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
             </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Payment Coming Soon
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            We are currently integrating the payment gateway. Your order details are captured below.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-left border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Order Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Package Tier</span>
                <span className="font-medium text-gray-900 dark:text-white">{state.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">SMS Quantity</span>
                <span className="font-medium text-gray-900 dark:text-white">{state.smsCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Rate</span>
                <span className="font-medium text-gray-900 dark:text-white">{state.pricePerSms.toFixed(2)} ETB / SMS</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
                <span className="text-lg font-bold text-gray-800 dark:text-white">Total Estimated</span>
                <span className="text-lg font-bold text-brand-500">ETB {state.estimatedPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-x-4">
            <button
              onClick={() => navigate("/billings")}
              className="px-6 py-3 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
               disabled
               className="px-6 py-3 rounded-lg bg-brand-500 font-bold text-white opacity-50 cursor-not-allowed"
            >
               Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
