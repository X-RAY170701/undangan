import type { RsvpResponse } from "@/types/invitation";
import type { WeddingTheme } from "../themes";

export function GuestBook({
  responses,
  theme,
}: {
  responses: RsvpResponse[];
  theme: WeddingTheme;
}) {
  const withMessage = responses.filter((r) => r.message);
  if (withMessage.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <h2
        className={`mb-6 text-center ${theme.headingFont} text-2xl ${theme.headingText}`}
      >
        Ucapan &amp; Doa
      </h2>
      <div className="mx-auto flex max-w-md flex-col gap-3">
        {withMessage.map((response) => (
          <div
            key={response.id}
            className={`rounded-xl border p-4 ${theme.guestBookCard}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">
                {response.guest_name}
              </p>
              <span
                className={`text-xs ${
                  response.attendance === "hadir"
                    ? "text-emerald-400"
                    : "text-neutral-500"
                }`}
              >
                {response.attendance === "hadir" ? "Hadir" : "Tidak hadir"}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-300">
              {response.message}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
