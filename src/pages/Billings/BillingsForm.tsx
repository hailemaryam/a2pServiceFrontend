import { useState, useCallback } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { TrashBinIcon, PlusIcon } from "../../icons";

// --- Type Definitions ---

// Type for a single descriptive detail line within a plan
interface PlanDetail {
  id: string; // Unique ID for keying purposes
  description: string;
}

// Type for a single SMS Pricing Plan
interface PricingPlan {
  id: string;
  name: "Small" | "Medium" | "Large" | string;
  price: string; // Stored as string for input field value
  minSms: string; // Stored as string for input field value
  maxSms: string; // Stored as string for input field value
  details: PlanDetail[];
}

// --- Initial Data ---

const initialPlans: PricingPlan[] = [
  {
    id: "plan-small",
    name: "Small",
    price: "0.00",
    minSms: "0",
    maxSms: "100",
    details: [],
  },
  {
    id: "plan-medium",
    name: "Medium",
    price: "0.00",
    minSms: "0",
    maxSms: "100",
    details: [],
  },
  {
    id: "plan-large",
    name: "Large",
    price: "0.00",
    minSms: "0",
    maxSms: "100",
    details: [],
  },
];

// --- Reusable Plan Component ---

interface PlanCardProps {
  plan: PricingPlan;
  onPlanChange: (updatedPlan: PricingPlan) => void;
  onRemovePlan: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onPlanChange,
  onRemovePlan,
}) => {
  // Handler for text inputs (Price, Min SMS, Max SMS)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onPlanChange({ ...plan, [name]: value });
  };

  // Handler to add a new detail line
  const handleAddDetail = () => {
    const newDetail: PlanDetail = {
      id: Date.now().toString(),
      description: "",
    };
    onPlanChange({ ...plan, details: [...plan.details, newDetail] });
  };

  // Handler for changing a specific detail description
  const handleDetailChange = (id: string, description: string) => {
    const updatedDetails = plan.details.map((detail) =>
      detail.id === id ? { ...detail, description } : detail
    );
    onPlanChange({ ...plan, details: updatedDetails });
  };

  // Handler to remove a specific detail line
  const handleRemoveDetail = (id: string) => {
    const filteredDetails = plan.details.filter((detail) => detail.id !== id);
    onPlanChange({ ...plan, details: filteredDetails });
  };

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          {plan.name}
        </h3>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-error-500 transition hover:bg-error-50 dark:hover:bg-error-500/10"
          onClick={() => onRemovePlan(plan.id)}
          title="Remove Plan"
        >
          <TrashBinIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Price Input */}
        <div>
          <label
            htmlFor={`price-${plan.id}`}
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Price (ETB)
          </label>
          <input
            id={`price-${plan.id}`}
            type="number"
            name="price"
            value={plan.price}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
        {/* Min SMS Input */}
        <div>
          <label
            htmlFor={`min-sms-${plan.id}`}
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Min SMS
          </label>
          <input
            id={`min-sms-${plan.id}`}
            type="number"
            name="minSms"
            value={plan.minSms}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
        {/* Max SMS Input */}
        <div>
          <label
            htmlFor={`max-sms-${plan.id}`}
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Max SMS
          </label>
          <input
            id={`max-sms-${plan.id}`}
            type="number"
            name="maxSms"
            value={plan.maxSms}
            onChange={handleInputChange}
            placeholder="100"
            min="0"
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Plan Details
        </h4>
        {plan.details.map((detail) => (
          <div
            key={detail.id}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50"
          >
            <input
              type="text"
              value={detail.description}
              onChange={(e) => handleDetailChange(detail.id, e.target.value)}
              placeholder="Enter detail description"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg text-error-500 transition hover:bg-error-50 dark:hover:bg-error-500/10"
              onClick={() => handleRemoveDetail(detail.id)}
            >
              <TrashBinIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          onClick={handleAddDetail}
        >
          <PlusIcon className="h-4 w-4" />
          Add Detail
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function BillingsForm() {
  const [plans, setPlans] = useState<PricingPlan[]>(initialPlans);

  // Updates a single plan object within the state array
  const handlePlanChange = useCallback((updatedPlan: PricingPlan) => {
    setPlans((currentPlans) =>
      currentPlans.map((plan) =>
        plan.id === updatedPlan.id ? updatedPlan : plan
      )
    );
  }, []);

  // Removes a plan from the state array
  const handleRemovePlan = useCallback((planId: string) => {
    setPlans((currentPlans) =>
      currentPlans.filter((plan) => plan.id !== planId)
    );
  }, []);

  // Adds a new custom plan
  const handleAddNewPlan = () => {
    const newPlan: PricingPlan = {
      id: `plan-${Date.now()}`,
      name: `Custom Plan ${plans.length + 1}`,
      price: "0.00",
      minSms: "0",
      maxSms: "100",
      details: [],
    };
    setPlans((currentPlans) => [...currentPlans, newPlan]);
  };

  // Logs/sends the final configuration to the backend
  const handleSaveAllPlans = () => {
    console.log("Saving all plans:", plans);
    // TODO: Add API call logic here (e.g., Axios.post('/api/plans', plans))
  };

  return (
    <div>
      <PageMeta
        title="SMS Pricing Plans | Fast SMS"
        description="Configure SMS pricing plans with dynamic details"
      />
      <PageBreadcrumb pageTitle="SMS Pricing Plans" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
            SMS Pricing Plans
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure pricing plans with dynamic details
          </p>
        </div>

        {/* Render all plan cards */}
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onPlanChange={handlePlanChange}
            onRemovePlan={handleRemovePlan}
          />
        ))}

        {/* Action Buttons at the bottom */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
            onClick={handleAddNewPlan}
          >
            <PlusIcon className="h-4 w-4" />
            Add New Plan
          </button>
          <button
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
            onClick={handleSaveAllPlans}
          >
            Save All Plans
          </button>
        </div>
      </div>
    </div>
  );
}
