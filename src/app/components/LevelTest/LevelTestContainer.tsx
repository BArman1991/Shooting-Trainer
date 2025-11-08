"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Timer from "./Timer";
import TargetCard from "./TargetCard";
import ReloadControls from "./ReloadControls";
import HitMissButtons from "./HitMissButtons";
import ResultsPanel from "./ResultsPanel";
import SessionExporter from "./SessionExporter";
import TestModes from "./TestModes";
import { vibrate, formatSec } from "../ui/utils";
import { PRESET_LEVEL, TestConfig, Target } from "../types/drill";

type RunState = "idle" | "running" | "reached_line" | "reloading" | "finished";
type Stance = "standing" | "kneeling";

export default function LevelTestContainer() {
  /** Config: selected mode, sequence of targets, reload point */
  const [config, setConfig] = useState<TestConfig>({
    mode: "level",
    seq: PRESET_LEVEL,
    reloadAfter: 5,
  });

  /** Shooter name */
  const [shooterName, setShooterName] = useState("");
  const [shooterSaved, setShooterSaved] = useState<string | null>(null);

  /** Run state and shots */
  const [runState, setRunState] = useState<RunState>("idle");
  const [currentShot, setCurrentShot] = useState(1);

  /** Безопасная последовательность */
  const seq: Target[] = Array.isArray(config?.seq) ? config.seq : [];
  const seqLen = seq.length;

  /** Безопасная инициализация hits */
  const [hits, setHits] = useState<(boolean | null)[]>(() =>
    Array(seqLen).fill(null)
  );

  /** Timers */
  const t0 = useRef<number | null>(null);
  const tReach = useRef<number | null>(null);
  const tLastShot = useRef<number | null>(null);
  const reloadStart = useRef<number | null>(null);
  const reloadEnd = useRef<number | null>(null);

  /** Animation frame для обновления таймера */
  const rafRef = useRef<number | null>(null);
  const [now, setNow] = useState(0);

  const [sessions, setSessions] = useState<Session[]>([]);

  const saveSession = () => {
    if (!shooterSaved || runState !== "finished") return;

    const session: Session = {
      id: Math.random().toString(36).substring(7),
      name: `${shooterSaved || ""} - ${config.mode} - ${new Date().toLocaleString()}`,
      shooterName: shooterSaved || "",
      date: new Date().toISOString().split('T')[0],
      startedAt: new Date(t0.current || 0).toISOString(),
      config: config,
      total: (elapsedMs / 1000).toFixed(2),
      timeToLine: timeToLine ? timeToLine.toFixed(2) : undefined,
      reloadTime: reloadSecondsFinal ? reloadSecondsFinal.toFixed(2) : undefined,
      hits: hits,
      seq: seq,
    };
    setSessions((prev) => [...prev, session]);
  };

  useEffect(() => {
    console.log("Current sessions in LevelTestContainer:", sessions);
    if (runState === "finished") {
      saveSession();
      return;
    }
    if (runState === "idle") return; // Only return if idle, to allow finished state to process
    const tick = () => {
      setNow(performance.now());
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [runState, shooterSaved, config, hits, seq, t0]);

  /** Reset hits array when sequence changes in idle state */
  useEffect(() => {
    if (runState === "idle") {
      setHits(Array(seqLen).fill(null));
      setCurrentShot(1);

      // safeguard: correct reloadAfter if out of range
      if (config.reloadAfter != null) {
        const max = Math.max(1, seqLen - 1);
        if (config.reloadAfter < 1 || config.reloadAfter > max) {
          setConfig((prev) => ({
            ...prev,
            reloadAfter: max >= 1 ? max : null,
          }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seqLen]);

  /** Derived values */
  const elapsedMs = useMemo(() => {
    if (!t0.current) return 0;
    const end =
      runState === "finished" && tLastShot.current ? tLastShot.current : now;
    return Math.max(0, end - t0.current);
  }, [now, runState]);

  const timeToLine =
    tReach.current && t0.current ? (tReach.current - t0.current) / 1000 : null;

  const reloadSecondsRunning =
    runState === "reloading" && reloadStart.current && !reloadEnd.current
      ? (now - reloadStart.current) / 1000
      : null;

  const reloadSecondsFinal =
    reloadStart.current && reloadEnd.current
      ? (reloadEnd.current - reloadStart.current) / 1000
      : null;

  const reloadAfter = config.reloadAfter;

  /** Actions */
  const startRun = () => {
    if (!shooterName.trim() || seqLen === 0) return;
    vibrate();
    setShooterSaved(shooterName.trim());
    setHits(Array(seqLen).fill(null));
    setCurrentShot(1);
    t0.current = performance.now();
    tReach.current = null;
    tLastShot.current = null;
    reloadStart.current = null;
    reloadEnd.current = null;
    setRunState("running");
  };

  const markReachedLine = () => {
    if (runState !== "running") return;
    vibrate();
    tReach.current = performance.now();
    setRunState("reached_line");
  };

  const confirmShot = (hit: boolean) => {
    if (runState !== "reached_line" || currentShot > seqLen) return;
    vibrate();

    const newHits = [...hits];
    newHits[currentShot - 1] = hit;
    setHits(newHits);

    tLastShot.current = performance.now();

    if (reloadAfter != null && currentShot === reloadAfter) {
      setCurrentShot(currentShot + 1);
      setRunState("reloading");
      return;
    }

    const next = currentShot + 1;
    setCurrentShot(next);
    if (next === seqLen + 1) setRunState("finished");
  };

  const startReload = () => {
    if (runState !== "reloading" || reloadStart.current) return;
    vibrate();
    reloadStart.current = performance.now();
  };

  const endReload = () => {
    if (runState !== "reloading" || !reloadStart.current || reloadEnd.current)
      return;
    vibrate();
    reloadEnd.current = performance.now();
    setRunState("reached_line");
  };

  const resetAll = () => {
    vibrate();
    setRunState("idle");
    setShooterSaved(null);
    setHits(Array(seqLen).fill(null));
    setCurrentShot(1);
    t0.current =
      tReach.current =
      tLastShot.current =
      reloadStart.current =
      reloadEnd.current =
        null;
  };

  /** Безопасно получаем текущую цель */
  const idx = Math.max(0, Math.min(seqLen - 1, currentShot - 1));
  const currentTarget = seqLen > 0 ? seq[idx] : undefined;
  const canShoot = runState === "reached_line" && seqLen > 0 && currentShot <= seqLen;

  /** UI */
  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto bg-white text-black dark:bg-black dark:text-white">
      <h1 className="text-2xl font-bold mb-3">Shooting Trainer</h1>

      {/* Modes */}
      <TestModes
        value={config}
        onChange={setConfig}
        disabled={runState !== "idle"}
      />

      {/* Shooter name */}
      {(runState === "idle" || runState === "finished") && (
        <div className="mb-4 flex gap-3 items-center">
          <label className="text-sm">Shooter name:</label>
          <input
            value={shooterName}
            onChange={(e) => setShooterName(e.target.value)}
            className="border rounded px-3 py-2 flex-1
             border-zinc-400 text-black placeholder-zinc-500
             dark:border-zinc-600 dark:bg-black dark:text-white dark:placeholder-zinc-400"
            placeholder="Enter shooter name"
          />
        </div>
      )}

      {shooterSaved && runState !== "idle" && (
        <div className="mb-2 text-sm">
          <strong>Shooter:</strong> {shooterSaved}
        </div>
      )}

      <Timer valueMs={elapsedMs} />

      {timeToLine && (
        <div className="text-sm opacity-70 mb-2">
          Reached line at {formatSec(timeToLine)} s
        </div>
      )}

      {runState === "reloading" && (
        <div className="text-sm opacity-70 mb-2">
          {reloadSecondsRunning
            ? `Reload: ${reloadSecondsRunning.toFixed(2)} s (running)`
            : reloadSecondsFinal
            ? `Reload: ${reloadSecondsFinal.toFixed(2)} s (final)`
            : "Reload waiting to start"}
        </div>
      )}

      {reloadSecondsFinal && runState !== "reloading" && (
        <div className="text-sm opacity-70 mb-2">
          Reload: {reloadSecondsFinal.toFixed(2)} s (final)
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <button
          onClick={startRun}
          disabled={runState !== "idle" || !shooterName.trim()}
          className="rounded-xl px-4 py-2 border-2 border-black text-black
               dark:border-white dark:text-white active:scale-[0.98]
               disabled:!bg-transparent disabled:!text-zinc-600 disabled:!border-zinc-500
               dark:disabled:!text-zinc-300 dark:disabled:!border-zinc-500"
        >
          Start
        </button>
        <button
          onClick={markReachedLine}
          disabled={runState !== "running"}
          className="rounded-xl px-4 py-2 border-2 border-black text-black
               dark:border-white dark:text-white active:scale-[0.98]
               disabled:!bg-transparent disabled:!text-zinc-600 disabled:!border-zinc-500
               dark:disabled:!text-zinc-300 dark:disabled:!border-zinc-500"
        >
          Reached Line
        </button>
        <button
          onClick={resetAll}
          className="rounded-xl px-4 py-2 border-2 border-black text-black
               dark:border-white dark:text-white active:scale-[0.98]"
        >
          Reset
        </button>
      </div>

      {/* Target card */}
      {currentShot <= seqLen && currentTarget && <TargetCard target={currentTarget} />}

      {/* Reload controls */}
      {runState === "reloading" && (
        <ReloadControls
          reloadStart={reloadStart.current}
          reloadEnd={reloadEnd.current}
          onStart={startReload}
          onEnd={endReload}
        />
      )}

      <HitMissButtons
        canShoot={canShoot}
        onHit={() => confirmShot(true)}
        onMiss={() => confirmShot(false)}
      />

      <div className="grid grid-cols-5 gap-2 mb-6">
        {hits.slice(0, seqLen).map((h, i) => {
          const base =
            "h-12 rounded-lg flex items-center justify-center text-lg font-bold border";
          const cls =
            h === true
              ? "bg-emerald-600 border-emerald-600 text-white"
              : h === false
              ? "bg-rose-600 border-rose-600 text-white"
              : "bg-zinc-100 border-zinc-300 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300";
          return (
            <div key={i} className={`${base} ${cls}`}>
              {i + 1}
            </div>
          );
        })}
      </div>

      {runState === "finished" && (
        <ResultsPanel
          shooter={shooterSaved || ""}
          total={(elapsedMs / 1000).toFixed(2)}
          timeToLine={timeToLine ? timeToLine.toFixed(2) : undefined}
          reloadTime={reloadSecondsFinal ? reloadSecondsFinal.toFixed(2) : undefined}
          hits={hits}
          seq={seq}
          onExport={() => {
            vibrate();

            const rows: string[] = [];
            rows.push("Shooter,Mode,Targets,TotalTime,TimeToLine,ReloadTime,HitCount");
            const hitCount = hits.slice(0, seqLen).filter((h) => h).length;
            rows.push(
              [
                JSON.stringify(shooterSaved || ""),
                config.mode,
                seqLen,
                (elapsedMs / 1000).toFixed(2),
                timeToLine ? timeToLine.toFixed(2) : "",
                reloadSecondsFinal ? reloadSecondsFinal.toFixed(2) : "",
                hitCount,
              ].join(",")
            );
            rows.push("Shot,Distance,Type,Stance,Result");
            seq.forEach((t, i) => {
              const res = hits[i] === true ? "HIT" : hits[i] === false ? "MISS" : "";
              rows.push([i + 1, t.distance, t.type, t.stance, res].join(","));
            });
            const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `result_${(shooterSaved || "shooter").replace(/\s+/g, "_")}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        />
      )}

      <SessionExporter sessions={sessions} />
    </div>
  );
}
