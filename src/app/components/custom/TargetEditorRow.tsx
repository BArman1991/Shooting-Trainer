"use client";
import React from "react";
import { Target, Stance, TargetSize } from "../types";

export default function TargetEditorRow({
  index,
  target,
  onChange,
}: {
  index: number;
  target: Target;
  onChange: (idx: number, patch: Partial<Target>) => void;
}) {
  const t = target;
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-1 text-sm font-bold">#{index + 1}</div>

      <div className="col-span-2">
        <input
          type="number"
          min={1}
          value={t.distance}
          onChange={(e) => onChange(index, { distance: Number(e.target.value) })}
          className="w-full border rounded px-2 py-1 border-zinc-300 dark:border-zinc-600 bg-white text-black dark:bg-black dark:text-white"
          placeholder="m"
        />
      </div>

      <div className="col-span-3">
        <select
          value={t.type}
          onChange={(e) => onChange(index, { type: e.target.value as Target["type"] })}
          className="w-full border rounded px-2 py-1 border-zinc-300 dark:border-zinc-600 bg-white text-black dark:bg-black dark:text-white"
        >
          <option value="chest">chest</option>
          <option value="half-head">half-head</option>
          <option value="full-body">full-body</option>
        </select>
      </div>

      <div className="col-span-2">
        <select
          value={t.stance}
          onChange={(e) => onChange(index, { stance: e.target.value as Stance })}
          className="w-full border rounded px-2 py-1 border-zinc-300 dark:border-zinc-600 bg-white text-black dark:bg-black dark:text-white"
        >
          <option value="standing">standing</option>
          <option value="kneeling">kneeling</option>
        </select>
      </div>

      <div className="col-span-2">
        <input
          type="number"
          min={1}
          value={t.shots ?? 1}
          onChange={(e) => onChange(index, { shots: Math.max(1, Number(e.target.value || 1)) })}
          className="w-full border rounded px-2 py-1 border-zinc-300 dark:border-zinc-600 bg-white text-black dark:bg-black dark:text-white"
          placeholder="shots"
        />
      </div>

      <div className="col-span-2">
        <select
          value={t.size ?? "full"}
          onChange={(e) => onChange(index, { size: e.target.value as TargetSize, sizeCm: undefined })}
          className="w-full border rounded px-2 py-1 border-zinc-300 dark:border-zinc-600 bg-white text-black dark:bg-black dark:text-white"
        >
          <option value="full">full</option>
          <option value="medium">medium</option>
          <option value="small">small</option>
          <option value="custom">custom</option>
        </select>
      </div>

      {(t.size ?? "full") === "custom" && (
        <div className="col-span-2">
          <input
            type="number"
            min={10}
            value={t.sizeCm ?? 150}
            onChange={(e) => onChange(index, { sizeCm: Number(e.target.value) })}
            className="w-full border rounded px-2 py-1 border-zinc-300 dark:border-zinc-600 bg-white text-black dark:bg-black dark:text-white"
            placeholder="size (mm/cm)"
          />
        </div>
      )}
    </div>
  );
}
