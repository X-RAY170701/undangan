import type { InvitationData } from "@/types/invitation";
import type { WeddingTheme } from "../themes";

export function LoveStory({
  data,
  theme,
}: {
  data: InvitationData;
  theme: WeddingTheme;
}) {
  if (!data.loveStory) return null;

  return (
    <section className={`px-6 py-16 ${theme.altSectionBg}`}>
      <h2
        className={`mb-6 text-center ${theme.headingFont} text-2xl ${theme.headingText}`}
      >
        Kisah Cinta Kami
      </h2>
      <p className="mx-auto max-w-xl whitespace-pre-line text-center text-sm leading-relaxed text-neutral-300">
        {data.loveStory}
      </p>
    </section>
  );
}
