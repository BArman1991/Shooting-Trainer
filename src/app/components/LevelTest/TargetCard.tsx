'use client';
import React from 'react';

type Target = { order: number; distance: number; type: string; stance: string };

/** Current target card: distance / type / stance */
export default function TargetCard({ target }: { target: Target }) {
  return (
    <div className="mb-6 p-4 rounded-xl border-2
                    bg-yellow-50 border-zinc-300 text-zinc-800
                    dark:bg-zinc-900 dark:border-zinc-600 dark:text-white">
      <div className="text-xl font-extrabold mb-1">Target #{target.order}</div>
      <div className="text-lg text-zinc-700 dark:text-zinc-300">
        {target.distance} m • {target.type} • Stance: {target.stance}
      </div>
    </div>
  );
}
