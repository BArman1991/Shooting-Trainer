"use client";

import React from "react";
import Link from "next/link";

type NavButtonVariant = "primary" | "secondary" | "danger" | "success";
type NavButtonSize = "small" | "medium" | "large";

type Props = {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: NavButtonVariant;
  size?: NavButtonSize;
  className?: string; // Allow custom classes to be passed
};

export default function NavButton({
  href,
  children,
  disabled,
  variant = "primary",
  size = "medium",
  className = "",
}: Props) {
  const baseClasses = "rounded transition disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-blue-500 text-white hover:bg-blue-600",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
  };

  return (
    <Link href={href}>
      <button
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    </Link>
  );
}
