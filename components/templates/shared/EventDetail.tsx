import type { InvitationData, InvitationEvent } from "@/types/invitation";
import type { TemplateLayout, WeddingTheme } from "../themes";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type EventStyle = "card-grid" | "bordered-table" | "scalloped" | "centered-list";

const STYLE_BY_LAYOUT: Record<TemplateLayout, EventStyle> = {
  classic: "card-grid",
  gate: "card-grid",
  "modern-split": "bordered-table",
  "editorial-split": "bordered-table",
  organic: "scalloped",
  scrapbook: "scalloped",
  "ornate-frame": "centered-list",
  "3d-starlight": "centered-list",
};

interface EventDetailProps {
  theme: WeddingTheme;
  events: InvitationEvent[];
}

function CardGridEvents({ theme, events }: EventDetailProps) {
  return (
    <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
      {events.map((event, index) => (
        <div
          key={`${event.name}-${index}`}
          className={`rounded-xl border p-6 text-center ${theme.detail.cardBg}`}
        >
          <h3 className={`${theme.headingFont} text-xl ${theme.detail.cardTitle}`}>
            {event.name}
          </h3>
          {event.date ? (
            <p className={`mt-2 text-sm ${theme.detail.cardMuted}`}>{formatDate(event.date)}</p>
          ) : null}
          {event.startTime ? (
            <p className={`text-sm ${theme.detail.cardMuted}`}>
              {event.startTime}
              {event.endTime ? ` - ${event.endTime}` : ""} WIB
            </p>
          ) : null}
          {event.venueName ? (
            <p className={`mt-3 text-sm font-medium ${theme.detail.cardStrong}`}>
              {event.venueName}
            </p>
          ) : null}
          {event.venueAddress ? (
            <p className={`text-xs ${theme.detail.cardMuted}`}>{event.venueAddress}</p>
          ) : null}
          {event.mapsUrl ? (
            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 inline-block rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${theme.detail.linkBorder}`}
            >
              Lihat Lokasi
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function BorderedTableEvents({ theme, events }: EventDetailProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col divide-y divide-white/10">
      {events.map((event, index) => (
        <div
          key={`${event.name}-${index}`}
          className="grid grid-cols-1 gap-1 py-6 sm:grid-cols-[1fr_2fr]"
        >
          <h3 className={`${theme.headingFont} text-lg font-medium ${theme.detail.cardTitle}`}>
            {event.name}
          </h3>
          <div>
            {event.date ? (
              <p className={`text-sm ${theme.detail.cardMuted}`}>{formatDate(event.date)}</p>
            ) : null}
            {event.startTime ? (
              <p className={`text-sm ${theme.detail.cardMuted}`}>
                {event.startTime}
                {event.endTime ? ` - ${event.endTime}` : ""} WIB
              </p>
            ) : null}
            {event.venueName ? (
              <p className={`mt-1 text-sm font-medium ${theme.detail.cardStrong}`}>
                {event.venueName}
              </p>
            ) : null}
            {event.venueAddress ? (
              <p className={`text-xs ${theme.detail.cardMuted}`}>{event.venueAddress}</p>
            ) : null}
            {event.mapsUrl ? (
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-3 inline-block border px-4 py-1.5 text-xs font-medium transition-colors ${theme.detail.linkBorder}`}
              >
                Lihat Lokasi
              </a>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScallopedEvents({ theme, events }: EventDetailProps) {
  return (
    <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
      {events.map((event, index) => (
        <div
          key={`${event.name}-${index}`}
          className={`rounded-[2rem] border-2 border-dashed p-6 text-center ${theme.detail.cardBg} ${
            index % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1"
          }`}
        >
          <h3 className={`${theme.headingFont} text-xl ${theme.detail.cardTitle}`}>
            {event.name}
          </h3>
          {event.date ? (
            <p className={`mt-2 text-sm ${theme.detail.cardMuted}`}>{formatDate(event.date)}</p>
          ) : null}
          {event.startTime ? (
            <p className={`text-sm ${theme.detail.cardMuted}`}>
              {event.startTime}
              {event.endTime ? ` - ${event.endTime}` : ""} WIB
            </p>
          ) : null}
          {event.venueName ? (
            <p className={`mt-3 text-sm font-medium ${theme.detail.cardStrong}`}>
              {event.venueName}
            </p>
          ) : null}
          {event.venueAddress ? (
            <p className={`text-xs ${theme.detail.cardMuted}`}>{event.venueAddress}</p>
          ) : null}
          {event.mapsUrl ? (
            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 inline-block rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${theme.detail.linkBorder}`}
            >
              Lihat Lokasi
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function CenteredListEvents({ theme, events }: EventDetailProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-8 text-center">
      {events.map((event, index) => (
        <div key={`${event.name}-${index}`} className="flex flex-col items-center gap-1.5">
          {index > 0 ? (
            <span className={`mb-4 h-2 w-2 rotate-45 border ${theme.detail.linkBorder}`} />
          ) : null}
          <h3 className={`${theme.headingFont} text-xl ${theme.detail.cardTitle}`}>
            {event.name}
          </h3>
          {event.date ? (
            <p className={`text-sm ${theme.detail.cardMuted}`}>{formatDate(event.date)}</p>
          ) : null}
          {event.startTime ? (
            <p className={`text-sm ${theme.detail.cardMuted}`}>
              {event.startTime}
              {event.endTime ? ` - ${event.endTime}` : ""} WIB
            </p>
          ) : null}
          {event.venueName ? (
            <p className={`mt-2 text-sm font-medium ${theme.detail.cardStrong}`}>
              {event.venueName}
            </p>
          ) : null}
          {event.venueAddress ? (
            <p className={`text-xs ${theme.detail.cardMuted}`}>{event.venueAddress}</p>
          ) : null}
          {event.mapsUrl ? (
            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3 inline-block rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${theme.detail.linkBorder}`}
            >
              Lihat Lokasi
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function EventDetail({
  data,
  theme,
}: {
  data: InvitationData;
  theme: WeddingTheme;
}) {
  const events = data.events.filter((event) => event.name);
  if (events.length === 0) return null;

  const style = STYLE_BY_LAYOUT[theme.layout];

  return (
    <section className={`px-6 py-16 ${theme.detail.sectionBg}`}>
      <h2 className={`mb-10 text-center ${theme.headingFont} text-2xl ${theme.detail.heading}`}>
        Rangkaian Acara
      </h2>
      {style === "bordered-table" ? (
        <BorderedTableEvents theme={theme} events={events} />
      ) : style === "scalloped" ? (
        <ScallopedEvents theme={theme} events={events} />
      ) : style === "centered-list" ? (
        <CenteredListEvents theme={theme} events={events} />
      ) : (
        <CardGridEvents theme={theme} events={events} />
      )}
    </section>
  );
}
