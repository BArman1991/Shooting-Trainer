'use client';
import React from 'react';

export default function HitMissButtons({
  canShoot,
  onHit,
  onMiss,
}: {
  canShoot: boolean;
  onHit: () => void;
  onMiss: () => void;
}) {
  return (
    <div className="flex gap-2 w-full mb-6">
      <button
        disabled={!canShoot}
        onClick={onHit}
        className="flex-1 h-32 bg-green-600 text-white text-2xl font-bold rounded-xl
                   disabled:bg-gray-400 active:scale-95 transition"
      >
        HIT
      </button>
      <button
        disabled={!canShoot}
        onClick={onMiss}
        className="flex-1 h-32 bg-red-600 text-white text-2xl font-bold rounded-xl
                   disabled:bg-gray-400 active:scale-95 transition"
      >
        MISS
      </button>
    </div>
  );
}
