import type { Invitation, RsvpResponse } from "@/types/invitation";
import { getTheme } from "./themes";
import { BatikBorder } from "./shared/BatikBorder";
import { Cover } from "./shared/Cover";
import { Countdown } from "./shared/Countdown";
import { CoupleInfo } from "./shared/CoupleInfo";
import { EnvelopeIntro } from "./shared/EnvelopeIntro";
import { EventDetail } from "./shared/EventDetail";
import { Gallery } from "./shared/Gallery";
import { LoveStory } from "./shared/LoveStory";
import { Reveal } from "./shared/Reveal";
import { RSVPForm } from "./shared/RSVPForm";
import { GuestBook } from "./shared/GuestBook";
import { MusicPlayer } from "./shared/MusicPlayer";
import { ShimmerDivider } from "./shared/ShimmerDivider";

interface WeddingTemplateProps {
  invitation: Pick<Invitation, "id" | "data">;
  templateSlug?: string | null;
  rsvpResponses?: RsvpResponse[];
  isPreview?: boolean;
  /** true saat dirender di dalam panel pratinjau editor (bukan sebagai halaman
   * penuh) — komponen anak yang biasanya `fixed`/mengunci scroll body (envelope
   * pembuka, tombol musik) menyesuaikan supaya tetap terkurung di panel itu. */
  embedded?: boolean;
}

export function WeddingTemplate({
  invitation,
  templateSlug,
  rsvpResponses = [],
  isPreview = false,
  embedded = false,
}: WeddingTemplateProps) {
  const { data } = invitation;
  const theme = getTheme(templateSlug);
  // Client components can't receive the `icon` component reference across
  // the server/client boundary (RSC serialization), so strip it before
  // passing theme down to any "use client" child.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { icon, ...themeStyle } = theme;

  const content = (
    <div
      className={`min-h-screen bg-black font-sans text-neutral-100 ${embedded ? "relative" : ""}`}
    >
      <Cover data={data} theme={theme} />
      {theme.envelopeIntro ? <BatikBorder /> : null}
      {data.events[0]?.date ? (
        <div className="-mt-10 px-6 pb-4">
          <Countdown targetDate={data.events[0].date} theme={themeStyle} />
        </div>
      ) : null}
      <Reveal>
        <CoupleInfo data={data} theme={theme} />
      </Reveal>
      <ShimmerDivider theme={theme} />
      <Reveal>
        <EventDetail data={data} theme={theme} />
      </Reveal>
      <Reveal>
        <LoveStory data={data} theme={theme} />
      </Reveal>
      <Reveal>
        <Gallery data={data} theme={themeStyle} />
      </Reveal>
      <ShimmerDivider theme={theme} />
      {data.rsvpEnabled ? (
        <Reveal>
          <RSVPForm
            invitationId={invitation.id}
            theme={themeStyle}
            isPreview={isPreview}
          />
        </Reveal>
      ) : null}
      {data.guestBookEnabled ? (
        <Reveal>
          <GuestBook responses={rsvpResponses} theme={theme} />
        </Reveal>
      ) : null}
      {theme.envelopeIntro ? <BatikBorder /> : null}
      <footer className={`px-6 py-10 text-center text-xs ${theme.footerText}`}>
        Dibuat dengan cinta melalui Undangan Digital
      </footer>
      <MusicPlayer url={data.musicUrl} embedded={embedded} />
    </div>
  );

  const framed =
    theme.layout === "ornate-frame" ? (
      <div className={`min-h-screen border-8 border-double ${theme.countdownBox}`}>
        {content}
      </div>
    ) : (
      content
    );

  if (theme.envelopeIntro) {
    return (
      <EnvelopeIntro
        groomName={data.groomName}
        brideName={data.brideName}
        eventDate={data.events[0]?.date}
        embedded={embedded}
      >
        {framed}
      </EnvelopeIntro>
    );
  }

  return framed;
}
