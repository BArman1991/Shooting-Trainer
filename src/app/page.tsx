"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CustomDrill,
  Target,
  PRESET_LEVEL,
  PRESET_SHORT,
} from "./components/types/drill";
import LargeButton from "./components/ui/LargeButton";

const ALL_PRESETS = {
  level: {
    id: "level",
    name: "Level Test (10)",
    description: "Standard 10-stage test.",
    targets: PRESET_LEVEL,
  },
  short: {
    id: "short",
    name: "Short Drill (3)",
    description: "Quick 3-stage drill.",
    targets: PRESET_SHORT,
  },
};

export default function HomePage() {
  const [customDrills, setCustomDrills] = useState<CustomDrill[]>([]);

  useEffect(() => {
    loadCustomDrills();
  }, []);

  const loadCustomDrills = () => {
    try {
      const existingDrillsString = localStorage.getItem("customDrills:v1");
      const drills: CustomDrill[] = existingDrillsString
        ? JSON.parse(existingDrillsString)
        : [];
      setCustomDrills(drills);
    } catch (error) {
      console.error("Failed to load custom drills:", error);
    }
  };

  const allDrills = [
    ALL_PRESETS.level,
    ALL_PRESETS.short,
    ...customDrills,
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shooting Trainer</h1>
      <p className="mb-4">Choose a drill or create your own!</p>

      <div className="mb-6">
        <Link href="/drills/new">
          <LargeButton>Create New Drill</LargeButton>
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-3">Available Drills</h2>
      <div className="space-y-4">
        {allDrills.map((drill) => (
          <div
            key={drill.id}
            className="border rounded-lg p-4 bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
          >
            <h3 className="text-lg font-semibold">{drill.name}</h3>
            {drill.description && (
              <p className="text-sm opacity-70 mb-2">{drill.description}</p>
            )}
            <div className="flex gap-2 mt-2">
              <Link href={`/drills/${drill.id}/run`}>
                <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm">
                  Run
                </button>
              </Link>
              {drill.id !== "level" && drill.id !== "short" && (
                <Link href={`/drills/${drill.id}/edit`}>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm">
                    Edit
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
