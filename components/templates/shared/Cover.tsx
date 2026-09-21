import type { InvitationData } from "@/types/invitation";
import type { WeddingTheme } from "../themes";
import { GununganSilhouette } from "./GununganSilhouette";
import { Star3DCover } from "./Star3DCover";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function initialsOf(name: string) {
  return (name || "?").trim().charAt(0).toUpperCase();
}

interface CoverProps {
  data: InvitationData;
  theme: WeddingTheme;
}

function ClassicCover({ data, theme }: CoverProps) {
  const Icon = theme.icon;
  return (
    <section
      className={`relative flex min-h-[70vh] flex-col items-center justify-end gap-4 bg-cover bg-center px-6 pb-16 pt-24 text-center text-white ${theme.cover.bgClass}`}
      style={{
        backgroundImage: data.coverPhotoUrl
          ? `${theme.cover.overlay}, url(${data.coverPhotoUrl})`
          : undefined,
      }}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full ${theme.iconWrap}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <p
        className={`${theme.headingFont} text-sm uppercase tracking-[0.3em] ${theme.cover.eyebrowText}`}
      >
        {theme.eyebrow}
      </p>
      <h1 className={`${theme.namesFont} text-4xl leading-tight sm:text-5xl`}>
        {data.groomName || "Mempelai Pria"}
        <span className={`mx-3 ${theme.ampersand}`}>&amp;</span>
        {data.brideName || "Mempelai Wanita"}
      </h1>
      {data.events[0]?.date ? (
        <p className={`text-sm tracking-wide ${theme.cover.dateText}`}>
          {formatDate(data.events[0].date)}
        </p>
      ) : null}
    </section>
  );
}

function ModernSplitCover({ data, theme }: CoverProps) {
  const Icon = theme.icon;
  return (
    <section className="grid min-h-[70vh] grid-cols-1 sm:grid-cols-2">
      <div
        className={`order-2 min-h-[35vh] bg-cover bg-center sm:order-1 sm:min-h-full ${theme.cover.bgClass}`}
        style={{
          backgroundImage: data.coverPhotoUrl
            ? `url(${data.coverPhotoUrl})`
            : undefined,
        }}
      />
      <div
        className={`order-1 flex flex-col items-start justify-center gap-4 bg-black px-8 py-16 sm:order-2 sm:px-14 ${theme.headingText}`}
      >
        <span
          className={`flex h-10 w-10 items-center justify-center ${theme.iconWrap}`}
        >
          <Icon className="h-4.5 w-4.5" strokeWidth={2} />
        </span>
        <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
          {theme.eyebrow}
        </p>
        <h1 className={`${theme.namesFont} text-4xl leading-tight sm:text-5xl`}>
          {data.groomName || "Mempelai Pria"}
        </h1>
        <span className={`text-lg ${theme.ampersand}`}>&amp;</span>
        <h1 className={`${theme.namesFont} text-4xl leading-tight sm:text-5xl`}>
          {data.brideName || "Mempelai Wanita"}
        </h1>
        <div className="mt-2 h-px w-16 bg-white/20" />
        {data.events[0]?.date ? (
          <p className="text-sm tracking-wide text-neutral-400">
            {formatDate(data.events[0].date)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function OrganicCover({ data, theme }: CoverProps) {
  const Icon = theme.icon;
  return (
    <section
      className={`relative flex min-h-[70vh] flex-col items-center justify-center gap-5 overflow-hidden px-6 py-16 text-center ${theme.altSectionBg}`}
    >
      <Icon
        className={`animate-float pointer-events-none absolute left-6 top-10 h-12 w-12 opacity-30 sm:left-16 ${theme.ampersand}`}
      />
      <Icon
        className={`animate-float pointer-events-none absolute bottom-10 right-6 h-16 w-16 opacity-20 sm:right-16 ${theme.ampersand}`}
        style={{ animationDelay: "1.5s" }}
      />

      <div
        className={`h-64 w-56 overflow-hidden rounded-t-full border-4 bg-cover bg-center shadow-lg ${theme.photoRing}`}
        style={{
          backgroundImage: data.coverPhotoUrl
            ? `url(${data.coverPhotoUrl})`
            : undefined,
        }}
      />

      <p
        className={`${theme.headingFont} text-sm italic tracking-wide ${theme.headingText}`}
      >
        {theme.eyebrow}
      </p>
      <h1
        className={`${theme.namesFont} text-4xl leading-tight sm:text-5xl ${theme.headingText}`}
      >
        {data.groomName || "Mempelai Pria"}
        <span className={`mx-3 ${theme.ampersand}`}>&amp;</span>
        {data.brideName || "Mempelai Wanita"}
      </h1>
      {data.events[0]?.date ? (
        <p className="text-sm tracking-wide text-neutral-400">
          {formatDate(data.events[0].date)}
        </p>
      ) : null}
    </section>
  );
}

function OrnateFrameCover({ data, theme }: CoverProps) {
  return (
    <section
      className={`relative flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-cover bg-center px-6 py-20 text-center text-white ${theme.cover.bgClass}`}
      style={{
        backgroundImage: data.coverPhotoUrl
          ? `${theme.cover.overlay}, url(${data.coverPhotoUrl})`
          : undefined,
      }}
    >
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full border-2 text-2xl ${theme.namesFont} ${theme.countdownBox}`}
      >
        {initialsOf(data.groomName)}
        <span className="mx-0.5 text-sm opacity-70">&amp;</span>
        {initialsOf(data.brideName)}
      </div>
      <div className={`h-px w-10 ${theme.ampersand} bg-current opacity-60`} />
      <p
        className={`${theme.headingFont} text-xs uppercase tracking-[0.4em] ${theme.cover.eyebrowText}`}
      >
        {theme.eyebrow}
      </p>
      <h1 className={`${theme.namesFont} text-4xl leading-tight sm:text-5xl`}>
        {data.groomName || "Mempelai Pria"}
        <span className={`mx-3 ${theme.ampersand}`}>&amp;</span>
        {data.brideName || "Mempelai Wanita"}
      </h1>
      <div className={`h-px w-10 ${theme.ampersand} bg-current opacity-60`} />
      {data.events[0]?.date ? (
        <p className={`text-sm tracking-wide ${theme.cover.dateText}`}>
          {formatDate(data.events[0].date)}
        </p>
      ) : null}
    </section>
  );
}

function EditorialSplitCover({ data, theme }: CoverProps) {
  const Icon = theme.icon;
  return (
    <section className="grid min-h-[70vh] grid-cols-1 sm:grid-cols-5">
      <div
        className={`order-1 flex flex-col justify-center gap-3 px-8 py-16 text-left text-white sm:col-span-3 sm:px-12 ${theme.cover.bgClass}`}
      >
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.iconWrap}`}
        >
          <Icon className="h-4.5 w-4.5" strokeWidth={2} />
        </span>
        <p
          className={`text-xs uppercase tracking-[0.35em] ${theme.cover.eyebrowText}`}
        >
          {theme.eyebrow}
        </p>
        <h1
          className={`${theme.namesFont} text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl`}
        >
          {data.groomName || "Mempelai Pria"}
        </h1>
        <span className={`text-2xl ${theme.ampersand}`}>&amp;</span>
        <h1
          className={`${theme.namesFont} text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl`}
        >
          {data.brideName || "Mempelai Wanita"}
        </h1>
        {data.events[0]?.date ? (
          <p className={`mt-2 text-sm tracking-wide ${theme.cover.dateText}`}>
            {formatDate(data.events[0].date)}
          </p>
        ) : null}
      </div>
      <div
        className={`order-2 min-h-[35vh] bg-cover bg-center sm:col-span-2 sm:min-h-full ${theme.cover.bgClass}`}
        style={{
          backgroundImage: data.coverPhotoUrl
            ? `linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url(${data.coverPhotoUrl})`
            : undefined,
        }}
      />
    </section>
  );
}

function ScrapbookCover({ data, theme }: CoverProps) {
  return (
    <section
      className={`relative flex min-h-[70vh] flex-col items-center justify-center gap-6 overflow-hidden px-6 py-16 text-center ${theme.altSectionBg}`}
    >
      <div className="relative -rotate-3">
        <div
          className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-6 bg-white/70 shadow-sm"
          aria-hidden
        />
        <div
          className={`h-72 w-60 rounded-sm border-[10px] border-white bg-cover bg-center shadow-xl ${theme.cover.bgClass}`}
          style={{
            backgroundImage: data.coverPhotoUrl
              ? `url(${data.coverPhotoUrl})`
              : undefined,
          }}
        />
      </div>

      <p className={`${theme.namesFont} text-lg ${theme.headingText}`}>
        {theme.eyebrow}
      </p>
      <h1
        className={`${theme.namesFont} text-4xl leading-tight sm:text-5xl ${theme.headingText}`}
      >
        {data.groomName || "Mempelai Pria"}
        <span className={`mx-3 ${theme.ampersand}`}>&amp;</span>
        {data.brideName || "Mempelai Wanita"}
      </h1>
      {data.events[0]?.date ? (
        <p className="text-sm tracking-wide text-neutral-400">
          {formatDate(data.events[0].date)}
        </p>
      ) : null}
    </section>
  );
}

function GateCover({ data, theme }: CoverProps) {
  return (
    <section
      className={`relative flex min-h-[70vh] flex-col items-center justify-end gap-4 overflow-hidden bg-cover bg-center px-6 pb-16 pt-24 text-center text-white ${theme.cover.bgClass}`}
      style={{
        backgroundImage: data.coverPhotoUrl
          ? `${theme.cover.overlay}, url(${data.coverPhotoUrl})`
          : undefined,
      }}
    >
      <GununganSilhouette className="animate-float pointer-events-none absolute -left-10 bottom-0 h-72 w-56 text-amber-400/15 sm:-left-4" />
      <GununganSilhouette
        className="animate-float pointer-events-none absolute -right-10 bottom-0 h-72 w-56 text-amber-400/15 sm:-right-4"
        style={{ animationDelay: "1.5s" }}
      />

      <p
        className={`${theme.headingFont} relative text-sm uppercase tracking-[0.3em] ${theme.cover.eyebrowText}`}
      >
        {theme.eyebrow}
      </p>
      <h1
        className={`${theme.namesFont} relative text-4xl leading-tight sm:text-5xl`}
      >
        {data.groomName || "Mempelai Pria"}
        <span className={`mx-3 ${theme.ampersand}`}>&amp;</span>
        {data.brideName || "Mempelai Wanita"}
      </h1>
      {data.events[0]?.date ? (
        <p
          className={`relative text-sm tracking-wide ${theme.cover.dateText}`}
        >
          {formatDate(data.events[0].date)}
        </p>
      ) : null}
    </section>
  );
}

export function Cover({ data, theme }: CoverProps) {
  switch (theme.layout) {
    case "modern-split":
      return <ModernSplitCover data={data} theme={theme} />;
    case "organic":
      return <OrganicCover data={data} theme={theme} />;
    case "ornate-frame":
      return <OrnateFrameCover data={data} theme={theme} />;
    case "editorial-split":
      return <EditorialSplitCover data={data} theme={theme} />;
    case "scrapbook":
      return <ScrapbookCover data={data} theme={theme} />;
    case "gate":
      return <GateCover data={data} theme={theme} />;
    case "3d-starlight": {
      // Star3DCover adalah "use client" (butuh GSAP + pointer). Komponen client
      // tidak boleh menerima `theme.icon` (referensi komponen) lewat batas
      // server->client — buang dulu, sisanya (ThemeStyle) aman.
      const { icon: _icon, ...themeStyle } = theme;
      void _icon;
      return <Star3DCover data={data} theme={themeStyle} />;
    }
    case "classic":
    default:
      return <ClassicCover data={data} theme={theme} />;
  }
}
