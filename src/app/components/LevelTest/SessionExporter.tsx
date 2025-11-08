import React, { useState } from "react";
import type { Session } from "../types/drill";
import { useEffect } from "react";

interface SessionExporterProps {
  sessions: Session[];
}

export default function SessionExporter({ sessions }: SessionExporterProps) {
  useEffect(() => {
    console.log("Sessions prop in SessionExporter:", sessions);
  }, [sessions]);

  const [selectedShooters, setSelectedShooters] = useState<string[]>([]);

  const drillNameMap: Record<string, string> = {
    level: "Level Test",
    short: "Short Drill",
    custom: "Custom Drill",
  };

  const allShooterNames = Array.from(
    new Set(sessions.map((s) => s.shooterName))
  );

  const handleShooterSelect = (shooterName: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedShooters((prev) => [...prev, shooterName]);
    } else {
      setSelectedShooters((prev) =>
        prev.filter((name) => name !== shooterName)
      );
    }
  };

  const generateCombinedCsv = () => {
    const selectedSessions = sessions.filter((session) =>
      selectedShooters.includes(session.shooterName)
    );

    if (selectedSessions.length === 0) {
      alert("Please select at least one shooter to generate CSV.");
      return;
    }

    // Deduplicate sessions to get only the most recent one per shooter
    const latestSessions = new Map<string, Session>();
    selectedSessions.forEach((session) => {
      const existingSession = latestSessions.get(session.shooterName);
      if (
        !existingSession ||
        new Date(session.startedAt) > new Date(existingSession.startedAt)
      ) {
        latestSessions.set(session.shooterName, session);
      }
    });

    const rows: string[] = [];
    rows.push(
      "Shooter name,Targets,Drill name,Total Time,Time to line,Reload time,Hit rate"
    );

    Array.from(latestSessions.values()).forEach((session) => {
      const totalShots = session.seq.length;
      const hitsCount = session.hits.filter((h) => h).length;
      const hitRateDisplay = `${hitsCount}/${totalShots}`;

      const sessionRow = [
        JSON.stringify(session.shooterName),
        totalShots,
        drillNameMap[session.config.mode] || session.config.mode, // Use mapped name, fallback to mode
        session.total,
        session.timeToLine || "",
        session.reloadTime || "",
        hitRateDisplay,
      ].join(",");
      rows.push(sessionRow);
    });

    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summary_results_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8 p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700">
      <h2 className="text-xl font-bold mb-4">Export Sessions</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Select Shooters:</h3>
        <div className="flex flex-wrap gap-2">
          {allShooterNames.map((shooterName) => (
            <label key={shooterName} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedShooters.includes(shooterName)}
                onChange={(e) =>
                  handleShooterSelect(shooterName, e.target.checked)
                }
                className="form-checkbox"
              />
              <span>{shooterName}</span>
            </label>
          ))}
        </div>
      </div>
      <button
        onClick={generateCombinedCsv}
        disabled={selectedShooters.length === 0}
        className="px-4 py-2 rounded-xl font-semibold border-2 border-black text-black
                   dark:border-white dark:text-white active:scale-[0.98]
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate Combined CSV
      </button>
    </div>
  );
}
