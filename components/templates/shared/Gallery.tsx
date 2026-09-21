"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { InvitationData } from "@/types/invitation";
import type { ThemeStyle } from "../themes";

export function Gallery({
  data,
  theme,
}: {
  data: InvitationData;
  theme: ThemeStyle;
}) {
  const photos = data.galleryUrls.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const dragDeltaX = useRef(0);

  if (photos.length === 0) return null;

  function goTo(next: number) {
    setIndex(Math.max(0, Math.min(photos.length - 1, next)));
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragStartX.current = e.clientX;
    dragDeltaX.current = 0;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) return;
    dragDeltaX.current = e.clientX - dragStartX.current;
  }

  function handlePointerUp() {
    if (dragStartX.current === null) return;
    const threshold = 60;
    if (dragDeltaX.current > threshold) goTo(index - 1);
    else if (dragDeltaX.current < -threshold) goTo(index + 1);
    dragStartX.current = null;
    dragDeltaX.current = 0;
    setDragging(false);
  }

  return (
    <section className="px-6 py-16">
      <h2 className={`mb-8 text-center ${theme.headingFont} text-2xl ${theme.headingText}`}>
        Galeri
      </h2>
      <div className="mx-auto max-w-2xl">
        <div
          className="relative touch-pan-y select-none overflow-hidden rounded-xl"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div
            className={`flex ${dragging ? "" : "transition-transform duration-500 ease-out"}`}
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {photos.map((url, i) => (
              <img
                key={`${url}-${i}`}
                src={url}
                alt={`Galeri foto ${i + 1}`}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="aspect-[4/5] w-full shrink-0 object-cover sm:aspect-[16/10]"
              />
            ))}
          </div>

          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                aria-label="Foto sebelumnya"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-neutral-900 shadow-md backdrop-blur-sm transition-opacity outline-none hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:pointer-events-none disabled:opacity-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                disabled={index === photos.length - 1}
                aria-label="Foto berikutnya"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-neutral-900 shadow-md backdrop-blur-sm transition-opacity outline-none hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:pointer-events-none disabled:opacity-0"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>

        {photos.length > 1 ? (
          <div className="mt-4 flex justify-center gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ke foto ${i + 1}`}
                className={`h-2 rounded-full transition-all outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  i === index ? `w-6 bg-current ${theme.ampersand}` : "w-2 bg-white/25"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
