"use client";

import React from "react";
import NavButton from "@/app/components/ui/NavButton";
import { CustomDrill, PRESET_LEVEL, PRESET_SHORT, Target } from "../types/drill";

type DrillItem = {
  id: string;
  name: string;
  description?: string;
  targets: Target[];
};

type DrillListProps = {
  allDrills: DrillItem[];
};

export default function DrillList({ allDrills }: DrillListProps) {
  return (
    <div className="container mx-auto p-4">
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
              <NavButton
                href={`/drills/${drill.id}/run`}
                variant="success"
                size="small"
              >
                Run
              </NavButton>
              {drill.id !== "level" && drill.id !== "short" && (
                <NavButton
                  href={`/drills/${drill.id}/edit`}
                  variant="primary"
                  size="small"
                >
                  Edit
                </NavButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
