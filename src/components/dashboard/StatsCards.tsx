import React from "react";
import { 
  DollarLineIcon, 
  GroupIcon, 
  PaperPlaneIcon 
} from "../../icons";

interface StatsCardsProps {
  remainingCredits: number;
  contactCount: number;
  totalSent: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ 
  remainingCredits, 
  contactCount, 
  totalSent 
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
      {/* Remaining Credits */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining Credits</p>
            <h4 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {remainingCredits.toLocaleString()}
            </h4>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/10">
            <DollarLineIcon className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Total Contacts */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Contacts</p>
            <h4 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {contactCount.toLocaleString()}
            </h4>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-50 text-success-500 dark:bg-success-500/10">
            <GroupIcon className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Total SMS Sent */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total SMS Sent</p>
            <h4 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {totalSent.toLocaleString()}
            </h4>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
            <PaperPlaneIcon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
