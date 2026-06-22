import { useEffect, useState, type FormEvent } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}

const buttonClass =
  "rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800";

export default function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
  disabled = false,
  className = "",
}: PaginationProps) {
  const [pageInput, setPageInput] = useState(String(page + 1));

  useEffect(() => {
    setPageInput(String(page + 1));
  }, [page]);

  const clampPage = (targetPage: number) => {
    if (totalPages <= 0) return 0;
    return Math.max(0, Math.min(targetPage, totalPages - 1));
  };

  const handleGoToPage = (e?: FormEvent) => {
    e?.preventDefault();
    const parsed = parseInt(pageInput, 10);
    if (Number.isNaN(parsed)) return;
    onPageChange(clampPage(parsed - 1));
  };

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 dark:text-gray-200 ${className}`}
    >
      <div>
        Page {page + 1} of {totalPages} · {total} total
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => onPageChange(0)}
          disabled={disabled || page <= 0}
        >
          First
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page <= 0}
        >
          Previous
        </button>
        <form onSubmit={handleGoToPage} className="flex items-center gap-1.5">
          <label htmlFor="pagination-page-input" className="text-xs text-gray-500 dark:text-gray-400">
            Go to
          </label>
          <input
            id="pagination-page-input"
            type="number"
            min={1}
            max={totalPages}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            disabled={disabled || totalPages <= 1}
            className="h-7 w-14 rounded-md border border-gray-300 bg-transparent px-2 text-center text-xs text-gray-800 focus:border-brand-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white dark:focus:border-brand-800"
          />
          <button
            type="submit"
            className={buttonClass}
            disabled={disabled || totalPages <= 1}
          >
            Go
          </button>
        </form>
        <button
          type="button"
          className={buttonClass}
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= totalPages - 1}
        >
          Next
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => onPageChange(totalPages - 1)}
          disabled={disabled || page >= totalPages - 1}
        >
          Last
        </button>
      </div>
    </div>
  );
}
