'use client';
import React from 'react';
import ActionButton from '../ui/ActionButton';

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
      <ActionButton
        disabled={!canShoot}
        onClick={onHit}
        variant="hit"
        className="flex-1 h-32 text-2xl font-bold"
      >
        HIT
      </ActionButton>
      <ActionButton
        disabled={!canShoot}
        onClick={onMiss}
        variant="miss"
        className="flex-1 h-32 text-2xl font-bold"
      >
        MISS
      </ActionButton>
    </div>
  );
}
