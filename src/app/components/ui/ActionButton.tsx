"use client";

import React from "react";

type ActionButtonVariant = "primary" | "secondary" | "reset" | "hit" | "miss" | "danger";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: ActionButtonVariant;
  className?: string;
  title?: string;
};

export default function ActionButton({
  onClick,
  children,
  disabled,
  variant = "primary",
  className = "",
}: Props) {
  const baseClasses =
    "rounded-xl px-4 py-2 border-2 text-black dark:text-white active:scale-[0.98] disabled:!bg-transparent disabled:!text-zinc-600 disabled:!border-zinc-500 dark:disabled:!text-zinc-300 dark:disabled:!border-zinc-500";

  const variantClasses = {
    primary: "border-black dark:border-white", // Default for Start, Reached Line
    secondary: "border-black dark:border-white", // Reset button
    reset: "border-black dark:border-white", // Reset button, same as primary
    hit: "bg-emerald-600 border-emerald-600 text-white",
    miss: "bg-rose-600 border-rose-600 text-white",
    danger: "bg-red-500 border-red-500 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
