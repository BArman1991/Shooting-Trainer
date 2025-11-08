"use client";

import React from "react";
import {
  TestConfig,
  Target,
  Mode,
  PRESET_SHORT,
  cloneSeq,
  normalizeSeq,
} from "../types/drill";
import CustomBuilder from "../custom/CustomBuilder";

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

      {/* Кастомный редактор */}
      {mode === "custom" && (
        <div
          className={`border rounded-lg p-3 bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600 ${
            disabled ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {/* Вынесли “умную” часть в CustomBuilder,
              но оставили быстрые кнопки тут, чтобы ничего не ломать */}
          <CustomBuilder
            seq={seq}
            reloadAfter={reloadAfter}
            onChange={(next) => onChange({ ...value, ...next })}
          />

          {/* Простой редактор как раньше (можно позже убрать, если CustomBuilder всё закрывает) */}
          <div className="font-semibold mt-4 mb-2">Quick edit</div>
          <div className="space-y-2">
            {seq.map((t, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-2 text-sm font-bold">#{idx + 1}</div>
                <div className="col-span-3">
                  <input
                    type="number"
                    min={1}
                    value={t.distance}
                    onChange={(e) =>
                      updateTarget(idx, { distance: Number(e.target.value) })
                    }
                    className="w-full border rounded px-2 py-1 border-zinc-300 dark:border-zinc-600 bg-white text-black dark:bg-black dark:text-white"
                    placeholder="m"
                  />
                </div>
                <div className="col-span-4">
                  <select
                    value={t.type}
                    onChange={(e) =>
                      updateTarget(idx, {
                        type: e.target.value as Target["type"],
                      })
                    }
                    className="w-full border rounded px-2 py-1 border-zinc-300 dark:border-zinc-600 bg-white text-black dark:bg-black dark:text-white"
                  >
                    <option value="chest">chest</option>
                    <option value="half-head">half-head</option>
                    <option value="full-body">full-body</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <select
                    value={t.stance}
                    onChange={(e) =>
                      updateTarget(idx, {
                        stance: e.target.value as Target["stance"],
                      })
                    }
                    className="w-full border rounded px-2 py-1 border-zinc-300 dark:border-zinc-600 bg-white text-black dark:bg-black dark:text-white"
                  >
                    <option value="standing">standing</option>
                    <option value="kneeling">kneeling</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <button
              className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600"
              onClick={addTarget}
            >
              Add target
            </button>
            <button
              className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600"
              onClick={removeLastTarget}
            >
              Remove last
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <label className="text-sm">Reload after shot # (optional):</label>
            <input
              type="number"
              min={1}
              max={Math.max(1, seq.length - 1)}
              value={reloadAfter ?? ""}
              onChange={(e) => setReloadAfter(e.target.value)}
              className="w-24 border rounded px-2 py-1 border-zinc-300 dark:border-zinc-600 bg-white text-black dark:bg-black dark:text-white"
            />
            <span className="text-xs opacity-70">
              leave empty for no reload
            </span>
          </div>

          <div className="mt-1 text-xs opacity-60">
            Valid values: 1 … {Math.max(1, seq.length - 1)} (reload happens
            between shot N and N+1)
          </div>
        </div>
      )}
    </div>
  );
}
