'use client';
import React from 'react';

/** Final results card + CSV export hook (passed in as prop) */
export default function ResultsPanel({
  shooter,
  total,
  timeToLine,
  reloadTime,
  hits,
  seq,
  onExport,
}: {
  shooter: string;
  total: string;
  timeToLine?: string;
  reloadTime?: string;
  hits: (boolean | null)[];
  seq: { order: number; distance: number; type: string; stance: string }[];
  onExport: () => void;
}) {
  return (
    <div className="mt-8 border rounded p-4">
      <div className="text-lg font-semibold mb-2">Results</div>

      {shooter && (
        <div className="mb-2">
          <strong>Shooter:</strong> {shooter}
        </div>
      )}

      <div>Targets: {seq.length}</div>
      <div>Total time: {total} s</div>
      {timeToLine && <div>Time to line: {timeToLine} s</div>}
      {reloadTime && <div>Reload time: {reloadTime} s</div>}
      <div>
        Hit rate: {hits.slice(0, seq.length).filter((h) => h === true).length}/{seq.length}
      </div>

      <button onClick={onExport} className="mt-3 px-3 py-2 rounded border bg-black text-white">
        Export CSV
      </button>
    </div>
  );
}
