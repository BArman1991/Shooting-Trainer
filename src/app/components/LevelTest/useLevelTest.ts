import { useEffect, useMemo, useRef, useState } from 'react';

export type Stance = 'standing' | 'kneeling';
export type Target = { order: number; distance: number; type: string; stance: Stance };
export type RunState = 'idle' | 'running' | 'reached_line' | 'reloading' | 'finished';

export function useLevelTest(seq: Target[], reloadAfter: number | null) {
  const [runState, setRunState] = useState<RunState>('idle');
  const [currentShot, setCurrentShot] = useState(1);
  const [hits, setHits] = useState<(boolean|null)[]>(Array(seq.length).fill(null));

  // timers
  const t0 = useRef<number|null>(null);
  const tReach = useRef<number|null>(null);
  const tLastShot = useRef<number|null>(null);
  const reloadStart = useRef<number|null>(null);
  const reloadEnd = useRef<number|null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (runState === 'idle' || runState === 'finished') return;
    const tick = () => { setNow(performance.now()); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, [runState]);

  const elapsedMs = useMemo(() => {
    if (!t0.current) return 0;
    const end = runState === 'finished' && tLastShot.current ? tLastShot.current : now;
    return Math.max(0, end - t0.current);
  }, [now, runState]);

  const startRun = () => {
    setHits(Array(seq.length).fill(null));
    setCurrentShot(1);
    t0.current = performance.now();
    setRunState('running');
  };

  const markReachedLine = () => {
    if (runState !== 'running') return;
    tReach.current = performance.now();
    setRunState('reached_line');
  };

  const confirmShot = (hit: boolean) => {
    if (runState !== 'reached_line') return;
    const newHits = [...hits];
    newHits[currentShot-1] = hit;
    setHits(newHits);
    tLastShot.current = performance.now();

    if (reloadAfter && currentShot === reloadAfter) {
      setCurrentShot(currentShot+1);
      setRunState('reloading');
      return;
    }
    const next = currentShot+1;
    setCurrentShot(next);
    if (next > seq.length) setRunState('finished');
  };

  const startReload = () => {
    if (runState!=='reloading') return;
    reloadStart.current = performance.now();
  };

  const endReload = () => {
    if (runState!=='reloading' || !reloadStart.current) return;
    reloadEnd.current = performance.now();
    setRunState('reached_line');
  };

  return {
    runState, currentShot, currentTarget: seq[currentShot-1], hits,
    startRun, markReachedLine, confirmShot, startReload, endReload,
    elapsedSec: (elapsedMs/1000).toFixed(2),
    timeToLine: tReach.current && t0.current ? ((tReach.current-t0.current)/1000).toFixed(2) : null,
    reloadTime: reloadStart.current && reloadEnd.current ? ((reloadEnd.current-reloadStart.current)/1000).toFixed(2) : null,
  };
}
