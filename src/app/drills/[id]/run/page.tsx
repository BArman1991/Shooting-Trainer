"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LevelTestContainer from "../../../components/LevelTest/LevelTestContainer";
import {
  CustomDrill,
  TestConfig,
  PRESET_LEVEL,
  PRESET_SHORT,
  normalizeSeq,
  DEFAULT_META,
  TargetType,
  Stance,
} from "../../../components/types/drill";
import ActionButton from "../../../components/ui/ActionButton";

export default function RunDrillPage() {
  const params = useParams();
  const drillId = params.id as string;
  const router = useRouter();

  const [initialConfig, setInitialConfig] = useState<TestConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDrillConfig = () => {
      let config: TestConfig | null = null;

      if (drillId === "level") {
        config = {
          mode: "level",
          seq: PRESET_LEVEL,
          reloadAfter: 5,
          meta: DEFAULT_META,
        };
      } else if (drillId === "short") {
        config = {
          mode: "short",
          seq: PRESET_SHORT,
          reloadAfter: null,
          meta: DEFAULT_META,
        };
      } else {
        try {
          const existingDrillsString = localStorage.getItem("customDrills:v1");
          const existingDrills: CustomDrill[] = existingDrillsString
            ? JSON.parse(existingDrillsString)
            : [];
          const selectedDrill = existingDrills.find((d) => d.id === drillId);

          if (selectedDrill) {
            const newSeq = selectedDrill.targets.map((targetSpec, index) => ({
              order: index + 1,
              distance: targetSpec.distance,
              type: targetSpec.targetType as TargetType,
              stance: targetSpec.shootingPosition as Stance,
              shots: 1,
            }));

            config = {
              mode: "custom",
              seq: normalizeSeq(newSeq),
              reloadAfter: null,
              meta: {
                ...DEFAULT_META,
                drillName: selectedDrill.name,
                drillId: selectedDrill.id,
              },
            };
          } else {
            console.error("Custom drill not found with ID:", drillId);
          }
        } catch (error) {
          console.error("Failed to load custom drill:", error);
        }
      }
      setInitialConfig(config);
      setLoading(false);
    };

    loadDrillConfig();
  }, [drillId]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading drill...</div>;
  }

  if (!initialConfig) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Error: Drill not found or could not be loaded.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <ActionButton onClick={() => router.push("/")} variant="secondary">
          Back to Main Page
        </ActionButton>
      </div>
      <LevelTestContainer initialConfig={initialConfig} />
    </div>
  );
}
