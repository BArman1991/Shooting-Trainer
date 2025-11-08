/** Simple haptics on mobile devices (typed, no `any`) */
type VibrateFn = (pattern: number | number[]) => boolean;

export const vibrate = (ms = 25): void => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    (navigator as Navigator & { vibrate: VibrateFn }).vibrate(ms);
  }
};

/** Format milliseconds as `xx.xx s` */
export const formatMs = (ms: number): string => (ms / 1000).toFixed(2) + ' s';

/** Format seconds as `xx.xx` (no unit) */
export const formatSec = (s: number): string => s.toFixed(2);
