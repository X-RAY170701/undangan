import type { WeddingTheme } from "../themes";

export function ShimmerDivider({ theme }: { theme: Pick<WeddingTheme, "ampersand"> }) {
  return (
    <div
      aria-hidden
      className={`animate-shimmer mx-auto h-px w-full max-w-3xl bg-[length:200%_100%] bg-[linear-gradient(90deg,transparent,currentColor,transparent)] opacity-60 ${theme.ampersand}`}
    />
  );
}
