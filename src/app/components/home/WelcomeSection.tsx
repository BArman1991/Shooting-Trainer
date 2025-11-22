"use client";

import React from "react";
import ActionButton from "@/app/components/ui/ActionButton";
import { useRouter } from "next/navigation";

export default function WelcomeSection() {
  const router = useRouter();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shooting Trainer</h1>
      <p className="mb-4">Choose a drill or create your own!</p>

      <div className="mb-6">
        <ActionButton
          onClick={() => router.push("/drills/new")}
          variant="primary"
        >
          Create New Drill
        </ActionButton>
      </div>
    </div>
  );
}
