export type Stance = "standing" | "kneeling";
export type TargetSize = "full" | "medium" | "small" | "custom";

export type Target = {
  order: number;
  distance: number;
  type: "chest" | "half-head" | "full-body";
  stance: Stance;
  shots?: number;         // по умолчанию 1
  size?: TargetSize;      // по умолчанию 'full'
  sizeCm?: number;        // если size === 'custom'
};

export type DrillMeta = {
  withVest: boolean;
  withRun: boolean;
};

export type Mode = "level" | "short" | "custom";

export type TestConfig = {
  mode: Mode;
  seq: Target[];
  reloadAfter: number | null; // между N и N+1; null = без перезарядки
  meta?: DrillMeta;
};

// утилиты
export const DEFAULT_META: DrillMeta = { withVest: false, withRun: false };
export const normalizeSeq = (arr: Target[]) =>
  arr.map((t, i) => ({ ...t, order: i + 1 }));
export const cloneSeq = (arr: Target[]) => arr.map((t) => ({ ...t }));
