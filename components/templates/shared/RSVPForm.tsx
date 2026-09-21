"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TextAreaField, TextField } from "@/components/ui/field";
import type { Attendance } from "@/types/invitation";
import type { ThemeStyle } from "../themes";

export function RSVPForm({
  invitationId,
  theme,
  isPreview = false,
}: {
  invitationId: string;
  theme: ThemeStyle;
  isPreview?: boolean;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    if (isPreview) {
      setTimeout(() => {
        setSubmitting(false);
        setDone(true);
      }, 400);
      return;
    }

    const form = new FormData(event.currentTarget);
    const payload = {
      invitationId,
      guestName: String(form.get("guestName") ?? "").trim(),
      attendance: form.get("attendance") as Attendance,
      guestCount: Number(form.get("guestCount") ?? 1),
      message: String(form.get("message") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal mengirim RSVP");
      setDone(true);
      // Segarkan data server (mis. daftar ucapan di GuestBook) supaya tamu
      // langsung melihat ucapannya sendiri tanpa perlu reload manual.
      router.refresh();
    } catch {
      setError("Gagal mengirim RSVP, silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <section className="px-6 py-16 text-center">
        <p className={`${theme.headingFont} text-xl ${theme.headingText}`}>
          Terima kasih atas konfirmasi Anda!
        </p>
        {isPreview ? (
          <p className="mt-2 text-xs text-neutral-400">
            (Ini contoh tampilan — belum ada RSVP yang benar-benar terkirim.)
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <section className={`px-6 py-16 ${theme.altSectionBg}`}>
      <h2
        className={`mb-6 text-center ${theme.headingFont} text-2xl ${theme.headingText}`}
      >
        Konfirmasi Kehadiran
      </h2>
      {isPreview ? (
        <p className="mx-auto mb-4 max-w-md text-center text-xs text-neutral-400">
          Contoh tampilan form RSVP — coba isi untuk melihat responsnya.
        </p>
      ) : null}
      <form
        onSubmit={handleSubmit}
        className={`mx-auto flex max-w-md flex-col gap-4 rounded-2xl border p-6 sm:p-8 ${theme.countdownBox}`}
      >
        <TextField label="Nama" name="guestName" required />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-neutral-200">
            Kehadiran
          </span>
          <div className="flex gap-4 text-sm text-neutral-200">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="attendance"
                value="hadir"
                defaultChecked
                required
              />
              Hadir
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="attendance" value="tidak_hadir" />
              Tidak Hadir
            </label>
          </div>
        </div>
        <TextField
          label="Jumlah Tamu"
          name="guestCount"
          type="number"
          min={1}
          defaultValue={1}
        />
        <TextAreaField label="Ucapan & Doa" name="message" />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Mengirim..." : "Kirim"}
        </Button>
      </form>
    </section>
  );
}
