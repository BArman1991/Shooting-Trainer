export type Stance = "standing" | "kneeling";
export type TargetSize = "full" | "medium" | "small" | "custom";

export type Target = {
  order: number;
  distance: number;
  type: "chest" | "half-head" | "full-body";
  stance: Stance;
  shots?: number; // по умолчанию 1
  size?: TargetSize; // по умолчанию 'full'
  sizeCm?: number; // если size === 'custom'
};

export type TargetType = "head" | "chest" | "half-body" | "body";
export type ShootingPosition = "lying" | "half-squat" | "standing";

export type CustomTargetSpec = {
  distance: number;
  targetType: TargetType;
  shootingPosition: ShootingPosition;
};

export type CustomDrill = {
  id: string; // uuid
  name: string;
  description?: string;
  targets: CustomTargetSpec[];
  createdAt: string;
  updatedAt: string;
};

export type DrillMeta = {
  withVest: boolean;
  withRun: boolean;
  drillName?: string;
  drillId?: string;
};

export type Mode = "level" | "short" | "custom";

export type TestConfig = {
  mode: Mode;
  seq: Target[];
  reloadAfter: number | null; // между N и N+1; null = без перезарядки
  meta?: DrillMeta;
};

export type Session = {
  id: string;
  name: string;
  shooterName: string;
  date: string;
  startedAt: string;
  config: TestConfig;
  total: string; // Add total time in seconds as a string
  timeToLine?: string; // Optional time to line as a string
  reloadTime?: string; // Optional reload time as a string
  hits: (boolean | null)[]; // Array of hit/miss results
  seq: Target[]; // The sequence of targets for the session
};

export const PRESET_LEVEL: Target[] = [
  { order: 1, distance: 10, type: "chest", stance: "standing", shots: 1 },
  { order: 2, distance: 15, type: "chest", stance: "standing", shots: 1 },
  { order: 3, distance: 20, type: "chest", stance: "standing", shots: 1 },
  { order: 4, distance: 25, type: "chest", stance: "standing", shots: 1 },
  { order: 5, distance: 30, type: "chest", stance: "standing", shots: 1 },
  { order: 6, distance: 35, type: "chest", stance: "standing", shots: 1 },
  { order: 7, distance: 40, type: "chest", stance: "standing", shots: 1 },
  { order: 8, distance: 45, type: "chest", stance: "standing", shots: 1 },
  { order: 9, distance: 50, type: "chest", stance: "standing", shots: 1 },
  { order: 10, distance: 50, type: "chest", stance: "kneeling", shots: 1 },
];

export const PRESET_SHORT: Target[] = [
  { order: 1, distance: 10, type: "chest", stance: "standing", shots: 1 },
  { order: 2, distance: 15, type: "chest", stance: "standing", shots: 1 },
  { order: 3, distance: 20, type: "chest", stance: "kneeling", shots: 1 },
];

// утилиты
export const DEFAULT_META: DrillMeta = { withVest: false, withRun: false };
export const normalizeSeq = (arr: Target[]) =>
  arr.map((t, i) => ({ ...t, order: i + 1 }));
export const cloneSeq = (arr: Target[]) => arr.map((t) => ({ ...t }));
