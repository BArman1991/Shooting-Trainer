"use client";
import React from "react";
import { DrillMeta } from "../types/drill";

export default function CustomMeta({
  meta,
  onChange,
}: {
  meta: DrillMeta;
  onChange: (patch: Partial<DrillMeta>) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={meta.withVest}
          onChange={(e) => onChange({ withVest: e.target.checked })}
        />
        With vest
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={meta.withRun}
          onChange={(e) => onChange({ withRun: e.target.checked })}
        />
        With run
      </label>
    </div>
  );
}
