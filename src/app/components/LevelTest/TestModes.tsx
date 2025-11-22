"use client";

import React, { useEffect, useState } from "react";
import {
  TestConfig,
  Target,
  Mode,
  PRESET_SHORT,
  cloneSeq,
  normalizeSeq,
  CustomDrill,
} from "../types/drill";
import Link from "next/link";

/** Кнопки режимов */
const modeBtn = (active: boolean, disabled?: boolean) =>
  [
    "px-4 py-2 rounded-xl font-semibold border-2",
    active
      ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
      : "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-600",
    disabled
      ? "!bg-transparent !cursor-not-allowed !text-zinc-700 !border-zinc-500 dark:!text-zinc-200 dark:!border-zinc-500"
      : "active:scale-[0.98]",
  ].join(" ");

export default function TestModes({
  value,
  onChange,
  disabled = false,
}: {
  value: TestConfig;
  onChange: (next: TestConfig) => void;
  disabled?: boolean;
}) {
  const { mode, seq, reloadAfter } = value;

  /** Переключение режима */
  const setMode = (m: Mode) => {
    if (disabled) return;
    if (m === "level") {
      onChange({ mode: "level", seq: cloneSeq(value.seq), reloadAfter: 5 });
    } else if (m === "short") {
      onChange({
        mode: "short",
        seq: cloneSeq(PRESET_SHORT),
        reloadAfter: null,
      });
    } else {
      const base: Target[] =
        seq?.length > 0
          ? normalizeSeq(seq)
          : [
              { order: 1, distance: 50, type: "chest", stance: "standing" },
              { order: 2, distance: 70, type: "half-head", stance: "standing" },
              {
                order: 3,
                distance: 100,
                type: "full-body",
                stance: "kneeling",
              },
            ];
      onChange({ mode: "custom", seq: base, reloadAfter: null });
    }
  };

  /** Обновление одного таргета */
  const updateTarget = (idx: number, patch: Partial<Target>) => {
    if (disabled) return;
    const next = seq.map((t, i) => (i === idx ? { ...t, ...patch } : t));
    onChange({ ...value, seq: normalizeSeq(next) });
  };

  /** Добавить/удалить цель */
  const addTarget = () => {
    if (disabled) return;
    const next: Target[] = [
      ...seq,
      {
        order: seq.length + 1,
        distance: 50,
        type: "chest",
        stance: "standing",
      },
    ];
    onChange({ ...value, seq: normalizeSeq(next) });
  };

  const removeLastTarget = () => {
    if (disabled || seq.length <= 1) return;
    const next = seq.slice(0, -1);

    let nextReload = reloadAfter;
    if (nextReload != null) {
      const max = Math.max(1, next.length - 1);
      if (nextReload > max) nextReload = max >= 1 ? max : null;
      if (nextReload != null && nextReload < 1) nextReload = null;
    }

    onChange({ ...value, seq: normalizeSeq(next), reloadAfter: nextReload });
  };

  /** Установка момента перезарядки */
  const setReloadAfter = (raw: string) => {
    if (disabled) return;
    const trimmed = raw.trim();
    if (trimmed === "") {
      onChange({ ...value, reloadAfter: null });
      return;
    }
    const n = Number(trimmed);
    if (!Number.isNaN(n) && n >= 1 && n < seq.length) {
      onChange({ ...value, reloadAfter: n });
    }
  };

  return (
    <div className="mb-4">
      {/* Режимы */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setMode("level")}
          disabled={disabled}
          className={modeBtn(mode === "level", disabled)}
        >
          Level Test (10)
        </button>
        <button
          onClick={() => setMode("short")}
          disabled={disabled}
          className={modeBtn(mode === "short", disabled)}
        >
          Short Drill (3)
        </button>
        <button
          onClick={() => setMode("custom")}
          disabled={disabled}
          className={modeBtn(mode === "custom", disabled)}
        >
          Custom Drill
        </button>
      </div>

      {/* removed custom drill builder here */}
    </div>
  );
}

type CustomDrillSelectorProps = {
  value: TestConfig;
  onChange: (next: TestConfig) => void;
  disabled?: boolean;
};

function CustomDrillSelector({
  value,
  onChange,
  disabled = false,
}: CustomDrillSelectorProps) {
  const [savedDrills, setSavedDrills] = useState<CustomDrill[]>([]);
  const [selectedDrillId, setSelectedDrillId] = useState<string | null>(null);

  useEffect(() => {
    loadDrills();
  }, []);

  const loadDrills = () => {
    try {
      const existingDrillsString = localStorage.getItem("customDrills:v1");
      const drills: CustomDrill[] = existingDrillsString
        ? JSON.parse(existingDrillsString)
        : [];
      setSavedDrills(drills);
      if (drills.length > 0 && !selectedDrillId) {
        setSelectedDrillId(drills[0].id);
        applyDrill(drills[0]);
      }
    } catch (error) {
      console.error("Failed to load custom drills:", error);
    }
  };

  const applyDrill = (drill: CustomDrill) => {
    const newSeq: Target[] = drill.targets.map((targetSpec, index) => ({
      order: index + 1,
      distance: targetSpec.distance,
      type: (() => {
        switch (targetSpec.targetType) {
          case "head":
            return "half-head";
          case "chest":
            return "chest";
          case "half-body":
            return "full-body"; // Closest match
          case "body":
            return "full-body";
          default:
            return "chest"; // Default fallback
        }
      })(),
      stance: (() => {
        switch (targetSpec.shootingPosition) {
          case "lying":
            return "kneeling"; // Closest match
          case "half-squat":
            return "standing"; // Closest match
          case "standing":
            return "standing";
          default:
            return "standing"; // Default fallback
        }
      })(),
      shots: 1, // Default shots to 1 for custom drills
    }));
    onChange({
      mode: "custom",
      seq: normalizeSeq(newSeq),
      reloadAfter: null, // For now, no reload after for custom drills, can be added later
      meta: { ...(value.meta || {}), drillName: drill.name, drillId: drill.id }, // Add drillName and drillId to meta
    });
  };

  const handleDrillSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedDrillId(id);
    const selectedDrill = savedDrills.find((drill) => drill.id === id);
    if (selectedDrill) {
      applyDrill(selectedDrill);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Select a Custom Drill</h2>
      {savedDrills.length === 0 ? (
        <p className="text-sm opacity-70">
          No custom drills saved yet. Create one above!
        </p>
      ) : (
        <select
          className="border rounded px-3 py-2 w-full dark:bg-zinc-800 dark:border-zinc-700"
          value={selectedDrillId || ""}
          onChange={handleDrillSelect}
          disabled={disabled}
        >
          {savedDrills.map((drill) => (
            <option key={drill.id} value={drill.id}>
              {drill.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
