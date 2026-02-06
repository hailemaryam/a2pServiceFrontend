import { useState } from "react";
import Modal from "../ui/modal/Modal";
import { useProcessManualPaymentMutation } from "../../api/adminApi";
import { toast } from "react-toastify";

interface ManualPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    tenant: {
        id: string;
        name: string;
    } | null;
}

export default function ManualPaymentModal({ isOpen, onClose, tenant }: ManualPaymentModalProps) {
    const [amount, setAmount] = useState<string>("");
    const [transactionIdValue, setTransactionIdValue] = useState<string>("");
    const [processManualPayment, { isLoading }] = useProcessManualPaymentMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenant) return;

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error("Please enter a valid amount greater than zero");
            return;
        }

        try {
            await processManualPayment({
                tenantId: tenant.id,
                amount: numAmount,
                transactionIdentification: transactionIdValue || undefined,
            }).unwrap();
            toast.success(`Manual payment of ${numAmount} ETB processed for ${tenant.name}`);
            setAmount("");
            setTransactionIdValue("");
            onClose();
        } catch (err: any) {
            console.error("Failed to process manual payment", err);
            toast.error(err.data?.message || "Failed to process manual payment");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Manual Payment"
            footer={
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !amount}
                        className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:opacity-50"
                    >
                        {isLoading ? "Processing..." : "Confirm Payment"}
                    </button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tenant Name
                    </label>
                    <input
                        type="text"
                        readOnly
                        value={tenant?.name || ""}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-500 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Payment Amount (ETB)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount in ETB"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-brand-500"
                        required
                        autoFocus
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        The system will automatically find the best SMS package for this amount.
                    </p>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Transaction Reference / ID (Optional)
                    </label>
                    <input
                        type="text"
                        value={transactionIdValue}
                        onChange={(e) => setTransactionIdValue(e.target.value)}
                        placeholder="Enter reference or transaction ID"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-brand-500"
                    />
                </div>
            </form>
        </Modal>
    );
}
