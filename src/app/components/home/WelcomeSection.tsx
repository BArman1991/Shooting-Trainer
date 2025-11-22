"use client";

import React from "react";
import NavButton from "@/app/components/ui/NavButton";

export default function WelcomeSection() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shooting Trainer</h1>
      <p className="mb-4">Choose a drill or create your own!</p>

      <div className="mb-6">
        <NavButton href="/drills/new" variant="primary" size="medium">
          Create New Drill
        </NavButton>
      </div>
    </div>
  );
}
