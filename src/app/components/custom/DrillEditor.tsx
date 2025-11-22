"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  CustomDrill,
  CustomTargetSpec,
  TargetType,
  ShootingPosition,
} from "../types/drill";
import ActionButton from "../ui/ActionButton";
import { useRouter } from "next/navigation";

const defaultTarget: CustomTargetSpec = {
  distance: 10,
  targetType: "chest",
  shootingPosition: "standing",
};

export default function DrillEditor({ drillId }: { drillId?: string }) {
  const [drillName, setDrillName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [targets, setTargets] = useState<CustomTargetSpec[]>([defaultTarget]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  React.useEffect(() => {
    if (drillId) {
      try {
        const existingDrillsString = localStorage.getItem("customDrills:v1");
        const existingDrills: CustomDrill[] = existingDrillsString
          ? JSON.parse(existingDrillsString)
          : [];
        const drillToEdit = existingDrills.find((d) => d.id === drillId);
        if (drillToEdit) {
          setDrillName(drillToEdit.name);
          setDescription(drillToEdit.description || "");
          setTargets(drillToEdit.targets);
        } else {
          setErrorMessage("Drill not found.");
        }
      } catch (error) {
        setErrorMessage("Failed to load drill for editing.");
        console.error("Error loading drill:", error);
      }
    }
  }, [drillId]);

  const handleAddTarget = () => {
    setTargets([...targets, { ...defaultTarget }]);
  };

  const handleRemoveTarget = (index: number) => {
    setTargets(targets.filter((_: CustomTargetSpec, i: number) => i !== index));
  };

  const handleTargetChange = (
    index: number,
    field: keyof CustomTargetSpec,
    value: string | number
  ) => {
    const newTargets = [...targets];
    const targetToUpdate = newTargets[index];

    switch (field) {
      case "distance":
        if (typeof value === "number") {
          targetToUpdate.distance = value;
        }
        break;
      case "targetType":
        if (typeof value === "string") {
          targetToUpdate.targetType = value as TargetType;
        }
        break;
      case "shootingPosition":
        if (typeof value === "string") {
          targetToUpdate.shootingPosition = value as ShootingPosition;
        }
        break;
      default:
        console.warn(`Unhandled field: ${field}`);
    }

    setTargets(newTargets);
  };

  const handleSaveDrill = () => {
    setErrorMessage("");

    if (!drillName.trim()) {
      setErrorMessage("Drill name cannot be empty.");
      return;
    }
    if (targets.length === 0) {
      setErrorMessage("At least one target is required.");
      return;
    }
    for (const target of targets) {
      if (!target.distance || !target.targetType || !target.shootingPosition) {
        setErrorMessage("All target fields must be filled.");
        return;
      }
    }

    try {
      const existingDrillsString = localStorage.getItem("customDrills:v1");
      const existingDrills: CustomDrill[] = existingDrillsString
        ? JSON.parse(existingDrillsString)
        : [];

      let updatedDrills: CustomDrill[];

      if (drillId) {
        // Update existing drill
        updatedDrills = existingDrills.map((d) =>
          d.id === drillId
            ? {
                ...d,
                name: drillName,
                description:
                  description.trim() === "" ? undefined : description,
                targets,
                updatedAt: new Date().toISOString(),
              }
            : d
        );
      } else {
        // Create new drill
        const newDrill: CustomDrill = {
          id: uuidv4(),
          name: drillName,
          description: description.trim() === "" ? undefined : description,
          targets,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        updatedDrills = [...existingDrills, newDrill];
      }

      localStorage.setItem("customDrills:v1", JSON.stringify(updatedDrills));
      alert("Drill saved successfully!");
      router.push("/");
      // Optionally reset form or redirect
      setDrillName("");
      setDescription("");
      setTargets([defaultTarget]);
    } catch (error) {
      setErrorMessage("Failed to save drill. Please try again.");
      console.error("Error saving custom drill:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {drillId ? "Edit Custom Drill" : "Create Custom Drill"}
      </h1>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <div className="flex justify-between items-center mb-4">
        <ActionButton onClick={() => router.push("/")} variant="secondary">
          Back to Main Page
        </ActionButton>
        <ActionButton onClick={handleSaveDrill} variant="primary">
          Save Drill
        </ActionButton>
      </div>

      <div className="mb-4">
        <label htmlFor="drillName" className="block text-sm font-medium mb-1">
          Drill Name
        </label>
        <input
          type="text"
          id="drillName"
          className="border rounded px-3 py-2 w-full dark:bg-zinc-800 dark:border-zinc-700"
          value={drillName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDrillName(e.target.value)
          }
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description (Optional)
        </label>
        <textarea
          id="description"
          rows={3}
          className="border rounded px-3 py-2 w-full dark:bg-zinc-800 dark:border-zinc-700"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
        ></textarea>
      </div>

      <h2 className="text-xl font-semibold mb-3">Targets</h2>
      <ActionButton
        onClick={handleAddTarget}
        variant="primary"
        className="mb-4"
      >
        Add target
      </ActionButton>
      {targets.map((target: CustomTargetSpec, index: number) => (
        <div
          key={index}
          className="border rounded-lg p-3 mb-3 bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 flex items-center gap-4"
        >
          <span className="font-bold">#{index + 1}</span>
          <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Distance (m)
              </label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full dark:bg-zinc-800 dark:border-zinc-700"
                value={target.distance}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleTargetChange(
                    index,
                    "distance",
                    parseInt(e.target.value)
                  )
                }
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Target Type
              </label>
              <select
                className="border rounded px-3 py-2 w-full dark:bg-zinc-800 dark:border-zinc-700"
                value={target.targetType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleTargetChange(
                    index,
                    "targetType",
                    e.target.value as TargetType
                  )
                }
                required
              >
                <option value="head">Head</option>
                <option value="chest">Chest</option>
                <option value="half-body">Half-Body</option>
                <option value="body">Body</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Shooting Position
              </label>
              <select
                className="border rounded px-3 py-2 w-full dark:bg-zinc-800 dark:border-zinc-700"
                value={target.shootingPosition}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleTargetChange(
                    index,
                    "shootingPosition",
                    e.target.value as ShootingPosition
                  )
                }
                required
              >
                <option value="lying">Lying</option>
                <option value="half-squat">Half-Squat</option>
                <option value="standing">Standing</option>
              </select>
            </div>
          </div>
          <ActionButton
            onClick={() => handleRemoveTarget(index)}
            variant="danger"
            className="p-2"
            title="Remove target"
          >
            🗑
          </ActionButton>
        </div>
      ))}
    </div>
  );
}
