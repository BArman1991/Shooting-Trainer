"use client";

import React from "react";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
};

export default function LargeButton({ onClick, children, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
