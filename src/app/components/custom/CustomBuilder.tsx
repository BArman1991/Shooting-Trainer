"use client";

import React from "react";
import type { Target } from "../LevelTest/TestModes";

type Props = {
  seq: Target[];
  reloadAfter: number | null;
  onChange: (next: { seq: Target[]; reloadAfter: number | null }) => void;
};

export default function CustomBuilder({ seq, reloadAfter, onChange }: Props) {
  return (
    <div
      className="border rounded-lg p-3 bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
    >
      <div className="font-semibold mb-2">🧱 Custom Drill Builder</div>

      <p className="text-sm opacity-70 mb-3">
        Здесь позже появится продвинутая настройка упражнений.
      </p>

      <div className="text-xs opacity-60 mb-3">
        Кол-во целей: <strong>{seq.length}</strong> | Перезарядка после:{" "}
        <strong>{reloadAfter ?? "без перезарядки"}</strong>
      </div>

      <button
        className="px-3 py-2 rounded border border-zinc-400 dark:border-zinc-600 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
        onClick={() =>
          onChange({
            seq: [
              ...seq,
              {
                order: seq.length + 1,
                distance: 50,
                type: "chest",
                stance: "standing",
              },
            ],
            reloadAfter,
          })
        }
      >
        ➕ Добавить цель
      </button>
    </div>
  );
}
