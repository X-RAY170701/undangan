"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { InvitationData } from "@/types/invitation";
import type { ThemeStyle } from "../themes";
import { StarlightScene } from "./three";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Cover "langit malam" interaktif — TANPA WebGL.
 *
 * Susunan lapisan (paralaks: makin depan makin besar geserannya):
 *  1. bintang Canvas 2D (paling jauh)          data-depth 0.05
 *  2. bokeh besar buram                         data-depth 0.12
 *  3. blok nama mempelai di ruang 3D (CSS)      data-depth 0.18 + rotate mengikuti pointer
 *  4. partikel/sparkle depan                    data-depth 0.4
 *
 * GSAP menggerakkan: animasi masuk bertahap, geseran paralaks & kemiringan 3D
 * mengikuti pointer (gsap.quickTo — halus & hemat), dan "float" idle.
 * Semua dinonaktifkan kalau prefers-reduced-motion aktif (tetap tampil, diam).
 */
export function Star3DCover({
  data,
  theme,
}: {
  data: InvitationData;
  theme: ThemeStyle;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const revealEls = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.set(revealEls, { y: 28, autoAlpha: 0 });
      gsap.to(revealEls, {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      });

      if (reduced) return;

      // "float" idle lembut
      gsap.to("[data-float]", {
        y: "+=10",
        duration: 3.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Paralaks + kemiringan 3D mengikuti pointer
      const depthEls = gsap.utils.toArray<HTMLElement>("[data-depth]");
      const setX = depthEls.map((el) =>
        gsap.quickTo(el, "x", { duration: 0.7, ease: "power2.out" })
      );
      const setY = depthEls.map((el) =>
        gsap.quickTo(el, "y", { duration: 0.7, ease: "power2.out" })
      );
      const tiltEl = root.querySelector<HTMLElement>("[data-tilt]");
      const setRotY = tiltEl
        ? gsap.quickTo(tiltEl, "rotationY", { duration: 0.8, ease: "power2.out" })
        : null;
      const setRotX = tiltEl
        ? gsap.quickTo(tiltEl, "rotationX", { duration: 0.8, ease: "power2.out" })
        : null;

      const onMove = (e: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        depthEls.forEach((el, i) => {
          const depth = parseFloat(el.dataset.depth || "0");
          setX[i](-nx * depth * 45);
          setY[i](-ny * depth * 45);
        });
        setRotY?.(nx * 7);
        setRotX?.(-ny * 7);
      };
      const onLeave = () => {
        depthEls.forEach((_, i) => {
          setX[i](0);
          setY[i](0);
        });
        setRotY?.(0);
        setRotX?.(0);
      };

      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      return () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-[#04030b] px-6 py-24 text-center text-white [perspective:1100px]"
    >
      {/* 1. Bintang Canvas 2D — paling jauh */}
      <div className="absolute inset-0" data-depth="0.05">
        <StarlightScene />
      </div>

      {/* 2. Bokeh besar buram — kedalaman menengah */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        data-depth="0.12"
        aria-hidden="true"
      >
        <span className="absolute left-[12%] top-[16%] h-40 w-40 rounded-full bg-amber-200/10 blur-3xl" />
        <span className="absolute right-[8%] top-[28%] h-56 w-56 rounded-full bg-indigo-300/10 blur-3xl" />
        <span className="absolute bottom-[10%] left-[28%] h-44 w-44 rounded-full bg-amber-100/10 blur-3xl" />
      </div>

      {/* 3. Blok nama mempelai — di ruang 3D, miring mengikuti pointer */}
      <div
        className="pointer-events-none relative z-10 [transform-style:preserve-3d]"
        data-tilt
      >
        <div data-float className="flex flex-col items-center gap-5 [transform-style:preserve-3d]">
          <div data-reveal>
            <div data-depth="0.22">
              {data.coverPhotoUrl ? (
                <div
                  className={`h-28 w-28 overflow-hidden rounded-full border-2 bg-cover bg-center shadow-[0_0_50px_-8px_rgba(255,224,170,0.55)] ${theme.photoRing}`}
                  style={{ backgroundImage: `url(${data.coverPhotoUrl})` }}
                />
              ) : (
                <span className="block h-3 w-3 rotate-45 bg-amber-200 shadow-[0_0_24px_4px_rgba(255,224,170,0.7)]" />
              )}
            </div>
          </div>

          <div data-reveal>
            <p
              data-depth="0.16"
              className={`${theme.headingFont} text-xs uppercase tracking-[0.4em] ${theme.cover.eyebrowText}`}
            >
              {theme.eyebrow}
            </p>
          </div>

          <div data-reveal>
            <h1
              data-depth="0.3"
              className={`${theme.namesFont} text-4xl leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] sm:text-5xl`}
            >
              {data.groomName || "Mempelai Pria"}
              <span className={`mx-3 ${theme.ampersand}`}>&amp;</span>
              {data.brideName || "Mempelai Wanita"}
            </h1>
          </div>

          {data.events[0]?.date ? (
            <div data-reveal>
              <p
                data-depth="0.2"
                className={`text-sm tracking-wide ${theme.cover.dateText}`}
              >
                {formatDate(data.events[0].date)}
              </p>
            </div>
          ) : null}

          <div data-reveal>
            <p
              data-depth="0.24"
              className="text-[11px] tracking-wide text-white/35"
            >
              Gerakkan atau sentuh layar &mdash; langitnya ikut bergerak &#10024;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
