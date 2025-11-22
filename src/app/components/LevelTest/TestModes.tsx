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
import NavButton from "../ui/NavButton";

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
      </div>
      <NavButton href="/" variant="secondary" size="medium" className="mt-4">Back to Main Page</NavButton>
    </div>
  );
}
