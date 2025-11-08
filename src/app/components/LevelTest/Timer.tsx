'use client';
import React from 'react';
import { formatMs } from '../ui/utils';

/** Prominent timer for mobile (large font, centered) */
export default function Timer({ valueMs }: { valueMs: number }) {
  return (
    <div className="text-6xl font-mono font-bold text-center mb-4">
      {formatMs(valueMs)}
    </div>
  );
}
