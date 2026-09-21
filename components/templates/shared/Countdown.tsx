"use client";

import { useEffect, useState } from "react";
import type { ThemeStyle } from "../themes";

function getRemaining(targetIso: string) {
  const diff = new Date(targetIso).getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
  };
}

export function Countdown({
  targetDate,
  theme,
}: {
  targetDate: string;
  theme: ThemeStyle;
}) {
  const [remaining, setRemaining] = useState<ReturnType<
    typeof getRemaining
  > | null>(null);

  useEffect(() => {
    if (!targetDate) return;
    // Tick immediately so the countdown doesn't wait a full second to appear,
    // then keep it in sync every second.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(getRemaining(targetDate));
    const interval = setInterval(() => {
      setRemaining(getRemaining(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate || !remaining) return null;

  const units = [
    { label: "Hari", value: remaining.days },
    { label: "Jam", value: remaining.hours },
    { label: "Menit", value: remaining.minutes },
    { label: "Detik", value: remaining.seconds },
  ];

  return (
    <div className="flex justify-center gap-3 sm:gap-6">
      {units.map((unit) => (
        <div
          key={unit.label}
          className={`flex w-16 flex-col items-center rounded-xl border py-3 sm:w-20 ${theme.countdownBox}`}
        >
          <span className="font-serif text-2xl text-white sm:text-3xl">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-[11px] uppercase tracking-wide text-neutral-400">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
