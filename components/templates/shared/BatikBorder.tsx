export function BatikBorder() {
  return (
    <div
      aria-hidden
      className="animate-batik-drift h-3 w-full bg-[#3a2410]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 7px, rgba(212,175,55,0.55) 7px 8px, transparent 8px 15px), repeating-linear-gradient(45deg, transparent 0 7px, rgba(212,175,55,0.55) 7px 8px, transparent 8px 15px)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}
