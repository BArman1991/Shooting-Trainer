"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CustomDrill,
  Target,
  PRESET_LEVEL,
  PRESET_SHORT,
} from "./components/types/drill";
import WelcomeSection from "./components/home/WelcomeSection";
import DrillList from "./components/home/DrillList";

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
      <WelcomeSection />
      <DrillList allDrills={allDrills} />
    </div>
  );
}
