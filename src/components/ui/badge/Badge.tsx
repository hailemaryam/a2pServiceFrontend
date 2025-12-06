import React from "react";

type BadgeColor = "success" | "warning" | "error" | "primary" | "default";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  className?: string;
}

const colorClass: Record<BadgeColor, string> = {
  success: "bg-green-100 text-green-800 dark:bg-green-900/30",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30",
  error: "bg-red-100 text-red-800 dark:bg-red-900/30",
  primary: "bg-brand-100 text-brand-800 dark:bg-brand-900/30",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-900/30",
};

const sizeClass: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-sm",
  lg: "px-3 py-1 text-sm",
};

export default function Badge({
  children,
  color = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-medium ${sizeClass[size]} ${colorClass[color]} ${className}`}
    >
      {children}
    </span>
  );
}
