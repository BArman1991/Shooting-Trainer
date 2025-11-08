import { Target, normalizeSeq } from "../types/drill";


export function expandSeq(seq: Target[]): Target[] {
  const out: Target[] = [];

  seq.forEach((t) => {
    const n = Math.max(1, t.shots ?? 1); // если не указано, считаем 1
    for (let i = 0; i < n; i++) {
      out.push({ ...t });
    }
  });

  return normalizeSeq(out);
}
