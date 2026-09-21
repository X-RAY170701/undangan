"use client";

/**
 * Lapisan "langit malam bertabur bintang" — Canvas 2D murni (BUKAN WebGL/three.js).
 *
 * Dipakai sebagai salah satu layer paralaks di Star3DCover. Canvas 2D dipilih
 * karena WebGL tidak tersedia di sebagian perangkat/lingkungan target — versi
 * three.js/react-three-fiber sebelumnya tampil "hitam polos".
 *
 * Fitur:
 * - ~ratusan bintang kecil (campuran putih-kebiruan & emas) yang berkelip
 * - beberapa "bintang terang" yang berdenyut lebih jelas
 * - INTERAKTIF: bintang di dekat pointer terdorong menjauh & menyala; seluruh
 *   langit bergeser tipis mengikuti pointer (paralaks)
 * - klik/tap → semburan percikan cahaya di titik itu
 * - hormati prefers-reduced-motion (tampil diam)
 * - berhenti saat tab tidak aktif; selalu menggambar minimal 1 frame saat mount
 */

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  vx: number;
  vy: number;
  twinkle: number;
  twinkleSpeed: number;
  bright: boolean;
  gold: boolean;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const WHITE = "214, 224, 255";
const GOLD = "255, 224, 170";

export default function StarlightScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    const sparks: Spark[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let raf = 0;

    function build() {
      const rect = canvas!.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(
        Math.min(320, Math.max(110, (width * height) / 5200))
      );
      stars = Array.from({ length: count }, () => {
        const bright = Math.random() < 0.08;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: bright ? 1.4 + Math.random() * 1.4 : 0.5 + Math.random() * 1.1,
          baseAlpha: bright ? 0.7 + Math.random() * 0.3 : 0.2 + Math.random() * 0.5,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: (bright ? 0.05 : 0.02) + Math.random() * 0.03,
          bright,
          gold: Math.random() < 0.32,
        };
      });
    }

    function frame() {
      ctx!.clearRect(0, 0, width, height);
      // langit malam: navy sangat gelap -> hampir hitam
      const bg = ctx!.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#070512");
      bg.addColorStop(0.55, "#04030b");
      bg.addColorStop(1, "#020207");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const shiftX = pointer.active ? ((cx - pointer.x) / cx) * 10 : 0;
      const shiftY = pointer.active ? ((cy - pointer.y) / cy) * 10 : 0;

      for (const s of stars) {
        if (!reduced) {
          s.x += s.vx;
          s.y += s.vy;
          s.twinkle += s.twinkleSpeed;

          if (pointer.active) {
            const dx = s.x - pointer.x;
            const dy = s.y - pointer.y;
            const dist2 = dx * dx + dy * dy;
            const R = 110;
            if (dist2 < R * R && dist2 > 0.01) {
              const dist = Math.sqrt(dist2);
              const force = (1 - dist / R) * 1.4;
              s.x += (dx / dist) * force;
              s.y += (dy / dist) * force;
            }
          }

          if (s.x < -4) s.x = width + 4;
          else if (s.x > width + 4) s.x = -4;
          if (s.y < -4) s.y = height + 4;
          else if (s.y > height + 4) s.y = -4;
        }

        const tw = reduced
          ? s.baseAlpha
          : s.baseAlpha * (0.5 + 0.5 * Math.sin(s.twinkle));

        let glow = 0;
        if (pointer.active && !reduced) {
          const dx = s.x - pointer.x;
          const dy = s.y - pointer.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) glow = (1 - d / 130) * 0.55;
        }

        const px = s.x + shiftX;
        const py = s.y + shiftY;
        const alpha = Math.min(1, tw + glow);
        const radius = s.r + glow * 2.2;
        const color = s.gold ? GOLD : WHITE;

        const g = ctx!.createRadialGradient(px, py, 0, px, py, radius * 3.2);
        g.addColorStop(0, `rgba(${color}, ${alpha})`);
        g.addColorStop(1, `rgba(${color}, 0)`);
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(px, py, radius * 3.2, 0, Math.PI * 2);
        ctx!.fill();
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.94;
        sp.vy *= 0.94;
        sp.life -= 0.022;
        if (sp.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const rad = 6 * (1 - sp.life) + 1;
        const g = ctx!.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, rad * 3);
        g.addColorStop(0, `rgba(255, 240, 210, ${sp.life})`);
        g.addColorStop(1, "rgba(255, 240, 210, 0)");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(sp.x, sp.y, rad * 3, 0, Math.PI * 2);
        ctx!.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    }
    function onLeave() {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    }
    function onDown(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (let i = 0; i < 16; i++) {
        const ang = (i / 16) * Math.PI * 2 + Math.random() * 0.4;
        const speed = 1.4 + Math.random() * 2.6;
        sparks.push({
          x,
          y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          life: 1,
        });
      }
    }
    function onVisibility() {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    }

    build();
    frame();

    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(build) : null;
    ro?.observe(canvas);
    window.addEventListener("resize", build);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("resize", build);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ touchAction: "pan-y" }}
    />
  );
}
