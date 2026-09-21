"use client";

import { useEffect, useState } from "react";
import { GununganSilhouette } from "./GununganSilhouette";
import { BatikBorder } from "./BatikBorder";

export function EnvelopeIntro({
  groomName,
  brideName,
  eventDate,
  embedded = false,
  children,
}: {
  groomName: string;
  brideName: string;
  eventDate?: string;
  /** true saat dirender di dalam panel pratinjau editor (bukan halaman penuh):
   * jangan kunci scroll seluruh halaman, dan batasi overlay ke panel ini saja
   * (bukan `fixed` yang menutupi seluruh layar termasuk form di sampingnya). */
  embedded?: boolean;
  children: React.ReactNode;
}) {
  const [stage, setStage] = useState<"closed" | "opening" | "opened">(
    "closed"
  );

  useEffect(() => {
    // Saat embedded (dalam panel pratinjau editor), elemen ini bisa saja
    // sedang tidak terlihat (mis. panelnya "hidden" di layar mobile) tapi
    // effect-nya tetap jalan — kalau body ikut dikunci di sini, seluruh
    // halaman editor jadi tidak bisa di-scroll tanpa cara membukanya lagi.
    if (embedded) return;
    document.body.style.overflow = stage === "opened" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [stage, embedded]);

  function handleOpen() {
    setStage("opening");
    setTimeout(() => setStage("opened"), 1000);
  }

  return (
    <div className={embedded ? "relative" : undefined}>
      {stage !== "opened" ? (
        <div
          className={`${embedded ? "absolute" : "fixed"} inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-b from-[#2b1a0d] via-[#3a2410] to-[#2b1a0d] px-6 text-center text-amber-50 [perspective:1400px] ${
            stage === "opening" ? "animate-envelope-fade-out" : ""
          }`}
          style={stage === "opening" ? { animationDelay: "500ms" } : undefined}
        >
          <BatikBorder />

          <div
            className={`relative -mt-4 h-40 w-28 origin-bottom text-amber-400/80 [transform-style:preserve-3d] ${
              stage === "opening" ? "animate-envelope-flap-open" : "animate-float"
            }`}
          >
            <GununganSilhouette className="h-full w-full" />
          </div>

          <p className="font-playfair text-xs uppercase tracking-[0.35em] text-amber-300">
            Undangan Pernikahan Adat Jawa
          </p>
          <h1 className="font-playfair text-3xl leading-tight sm:text-4xl">
            {groomName || "Mempelai Pria"}
            <span className="mx-3 text-amber-400">&amp;</span>
            {brideName || "Mempelai Wanita"}
          </h1>
          {eventDate ? (
            <p className="text-sm tracking-wide text-amber-200">
              {new Date(eventDate).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleOpen}
            disabled={stage === "opening"}
            className="mt-4 rounded-full border border-amber-400 px-6 py-2.5 text-sm font-medium tracking-wide text-amber-100 outline-none transition-all duration-300 hover:bg-amber-400 hover:text-[#2b1a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100 active:scale-95 disabled:opacity-60"
          >
            Buka Undangan
          </button>

          <BatikBorder />
        </div>
      ) : null}
      {children}
    </div>
  );
}
