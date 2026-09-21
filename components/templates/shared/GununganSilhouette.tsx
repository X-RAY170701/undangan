export function GununganSilhouette({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 200 300"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden
    >
      <path d="M100,8 C132,58 158,88 170,138 C179,176 167,208 150,228 C165,240 176,258 172,282 L28,282 C24,258 35,240 50,228 C33,208 21,176 30,138 C42,88 68,58 100,8 Z" />
      <path
        d="M100,40 C118,72 132,92 140,126 C146,152 138,174 126,190"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <path
        d="M100,40 C82,72 68,92 60,126 C54,152 62,174 74,190"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
    </svg>
  );
}
