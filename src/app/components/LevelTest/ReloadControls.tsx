'use client';
import React from 'react';

export default function ReloadControls({
  reloadStart,
  reloadEnd,
  onStart,
  onEnd,
}: {
  reloadStart: number | null;
  reloadEnd: number | null;
  onStart: () => void;
  onEnd: () => void;
}) {
  return (
    <div className="flex gap-4 mb-8">
      <button
        onClick={onStart}
        disabled={!!reloadStart}
        className="flex-1 h-24 text-xl font-bold rounded-lg bg-blue-600 text-white active:bg-blue-700 disabled:bg-gray-400"
        title="Start reload timer"
      >
        {reloadStart ? 'Reloading…' : 'Start Reload'}
      </button>
      <button
        onClick={onEnd}
        disabled={!reloadStart || !!reloadEnd}
        className="flex-1 h-24 text-xl font-bold rounded-lg bg-purple-600 text-white active:bg-purple-700 disabled:bg-gray-400"
        title="Finish reload and resume shooting"
      >
        End Reload
      </button>
    </div>
  );
}
