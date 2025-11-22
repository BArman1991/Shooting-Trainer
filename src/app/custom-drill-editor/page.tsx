"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  CustomDrill,
  CustomTargetSpec,
  TargetType,
  ShootingPosition,
} from "../components/types/drill";
import LargeButton from "../components/ui/LargeButton"; // Assuming LargeButton exists

const defaultTarget: CustomTargetSpec = {
  distance: 10,
  targetType: "chest",
  shootingPosition: "standing",
};

export default function CustomDrillEditor() {
  const [drillName, setDrillName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [targets, setTargets] = useState<CustomTargetSpec[]>([defaultTarget]);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    (newTargets[index] as any)[field] = value;
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

    const newDrill: CustomDrill = {
      id: uuidv4(),
      name: drillName,
      description: description.trim() === "" ? undefined : description,
      targets,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const existingDrillsString = localStorage.getItem("customDrills:v1");
      const existingDrills: CustomDrill[] = existingDrillsString
        ? JSON.parse(existingDrillsString)
        : [];
      localStorage.setItem(
        "customDrills:v1",
        JSON.stringify([...existingDrills, newDrill])
      );
      alert("Drill saved successfully!");
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
      <h1 className="text-2xl font-bold mb-4">Create Custom Drill</h1>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

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
          <button
            onClick={() => handleRemoveTarget(index)}
            className="text-red-500 hover:text-red-700 p-2"
            title="Remove target"
          >
            🗑
          </button>
        </div>
      ))}

      <button
        onClick={handleAddTarget}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition mb-4"
      >
        Add target
      </button>

      <div>
        <LargeButton onClick={handleSaveDrill}>Save Drill</LargeButton>
      </div>
    </div>
  );
}
