"use client";

import { useEffect, useRef, useState } from "react";

export function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // Content starts fully visible (safe default for SSR / slow-JS mobile
  // connections) — only once React has hydrated do we arm the hidden→reveal
  // animation, so a delayed or failed script load never leaves whole
  // sections invisible against the dark background.
  const [hydrated, setHydrated] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const className = !hydrated ? "" : visible ? "animate-reveal-up" : "opacity-0";

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
