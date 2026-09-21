"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TextAreaField, TextField } from "@/components/ui/field";
import { AudioUploadField } from "@/components/editor/audio-upload-field";
import { ImageUploadField } from "@/components/editor/image-upload-field";
import { WeddingTemplate } from "@/components/templates/WeddingTemplate";
import { uploadFile } from "@/lib/upload";
import type { Invitation, InvitationData, InvitationEvent } from "@/types/invitation";

function updateEvent(
  events: InvitationEvent[],
  index: number,
  patch: Partial<InvitationEvent>
) {
  return events.map((event, i) => (i === index ? { ...event, ...patch } : event));
}

export function InvitationEditor({
  invitation,
  templateSlug,
}: {
  invitation: Invitation;
  templateSlug: string | null;
}) {
  const router = useRouter();
  const [data, setData] = useState<InvitationData>(invitation.data);
  const [status, setStatus] = useState(invitation.status);
  const [saving, setSaving] = useState<"draft" | "published" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  function set<K extends keyof InvitationData>(key: K, value: InvitationData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function save(nextStatus: "draft" | "published") {
    setSaving(nextStatus);
    setMessage(null);
    try {
      const res = await fetch(`/api/invitations/${invitation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, status: nextStatus }),
      });
      if (!res.ok) throw new Error();
      setStatus(nextStatus);
      setMessage(
        nextStatus === "published"
          ? "Undangan berhasil diterbitkan."
          : "Draft tersimpan."
      );
      router.refresh();
    } catch {
      setMessage("Gagal menyimpan, silakan coba lagi.");
    } finally {
      setSaving(null);
    }
  }

  async function addGalleryPhoto(file: File) {
    setUploadingGallery(true);
    try {
      const url = await uploadFile(file);
      set("galleryUrls", [...data.galleryUrls, url]);
    } finally {
      setUploadingGallery(false);
    }
  }

  return (
    <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col gap-8 overflow-y-auto border-r border-neutral-200 bg-white p-6 lg:h-[calc(100vh-65px)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              Status: {status === "published" ? "Terbit" : "Draft"}
            </p>
            <p className="text-xs text-neutral-400">/u/{invitation.slug}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => save("draft")}
              disabled={saving !== null}
            >
              {saving === "draft" ? "Menyimpan..." : "Simpan Draft"}
            </Button>
            <Button onClick={() => save("published")} disabled={saving !== null}>
              {saving === "published" ? "Menerbitkan..." : "Terbitkan"}
            </Button>
          </div>
        </div>
        {message ? <p className="text-sm text-neutral-600">{message}</p> : null}

        <section className="flex flex-col gap-4">
          <h2 className="font-serif text-lg text-neutral-900">Data Mempelai</h2>
          <ImageUploadField
            label="Foto Cover"
            value={data.coverPhotoUrl}
            onChange={(url) => set("coverPhotoUrl", url)}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Nama Panggilan Pria"
              value={data.groomName}
              onChange={(e) => set("groomName", e.target.value)}
            />
            <TextField
              label="Nama Panggilan Wanita"
              value={data.brideName}
              onChange={(e) => set("brideName", e.target.value)}
            />
            <TextField
              label="Nama Lengkap Pria"
              value={data.groomFullName}
              onChange={(e) => set("groomFullName", e.target.value)}
            />
            <TextField
              label="Nama Lengkap Wanita"
              value={data.brideFullName}
              onChange={(e) => set("brideFullName", e.target.value)}
            />
            <TextField
              label="Orang Tua Pria"
              value={data.groomParents}
              onChange={(e) => set("groomParents", e.target.value)}
            />
            <TextField
              label="Orang Tua Wanita"
              value={data.brideParents}
              onChange={(e) => set("brideParents", e.target.value)}
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg text-neutral-900">
              Acara &amp; Lokasi
            </h2>
            <button
              type="button"
              onClick={() =>
                set("events", [
                  ...data.events,
                  {
                    name: "",
                    date: "",
                    startTime: "",
                    endTime: "",
                    venueName: "",
                    venueAddress: "",
                    mapsUrl: "",
                  },
                ])
              }
              className="text-xs font-medium text-neutral-600 underline"
            >
              + Tambah Acara
            </button>
          </div>
          {data.events.map((event, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4"
            >
              <TextField
                id={`event-${index}-name`}
                label="Nama Acara"
                value={event.name}
                onChange={(e) =>
                  set("events", updateEvent(data.events, index, { name: e.target.value }))
                }
              />
              <div className="grid grid-cols-3 gap-3">
                <TextField
                  id={`event-${index}-date`}
                  label="Tanggal"
                  type="date"
                  value={event.date}
                  onChange={(e) =>
                    set("events", updateEvent(data.events, index, { date: e.target.value }))
                  }
                />
                <TextField
                  id={`event-${index}-start`}
                  label="Mulai"
                  type="time"
                  value={event.startTime}
                  onChange={(e) =>
                    set(
                      "events",
                      updateEvent(data.events, index, { startTime: e.target.value })
                    )
                  }
                />
                <TextField
                  id={`event-${index}-end`}
                  label="Selesai"
                  type="time"
                  value={event.endTime}
                  onChange={(e) =>
                    set("events", updateEvent(data.events, index, { endTime: e.target.value }))
                  }
                />
              </div>
              <TextField
                id={`event-${index}-venue-name`}
                label="Nama Tempat"
                value={event.venueName}
                onChange={(e) =>
                  set(
                    "events",
                    updateEvent(data.events, index, { venueName: e.target.value })
                  )
                }
              />
              <TextAreaField
                id={`event-${index}-venue-address`}
                label="Alamat"
                value={event.venueAddress}
                onChange={(e) =>
                  set(
                    "events",
                    updateEvent(data.events, index, { venueAddress: e.target.value })
                  )
                }
              />
              <TextField
                id={`event-${index}-maps-url`}
                label="Link Google Maps"
                value={event.mapsUrl}
                onChange={(e) =>
                  set("events", updateEvent(data.events, index, { mapsUrl: e.target.value }))
                }
              />
              {data.events.length > 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "events",
                      data.events.filter((_, i) => i !== index)
                    )
                  }
                  className="self-end text-xs text-red-600 underline"
                >
                  Hapus acara ini
                </button>
              ) : null}
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-lg text-neutral-900">Cerita Cinta</h2>
          <TextAreaField
            label="Ceritakan kisah Anda"
            rows={6}
            value={data.loveStory}
            onChange={(e) => set("loveStory", e.target.value)}
          />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-lg text-neutral-900">Galeri Foto</h2>
          <div className="flex flex-wrap gap-3">
            {data.galleryUrls.map((url, index) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt={`Galeri ${index + 1}`}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "galleryUrls",
                      data.galleryUrls.filter((_, i) => i !== index)
                    )
                  }
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}
            <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-neutral-300 text-xs text-neutral-500 hover:bg-neutral-50">
              {uploadingGallery ? "..." : "+ Foto"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingGallery}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) addGalleryPhoto(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-lg text-neutral-900">Musik Latar</h2>
          <p className="text-xs text-neutral-500">
            Musik akan diputar lewat tombol mengambang di undangan (tamu perlu klik
            untuk memutar). Unggah file sendiri atau tempel link musik yang sudah
            ada.
          </p>
          <AudioUploadField
            label="Musik"
            value={data.musicUrl}
            onChange={(url) => set("musicUrl", url)}
          />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-lg text-neutral-900">
            Pengaturan RSVP
          </h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.rsvpEnabled}
              onChange={(e) => set("rsvpEnabled", e.target.checked)}
            />
            Aktifkan form konfirmasi kehadiran
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.guestBookEnabled}
              onChange={(e) => set("guestBookEnabled", e.target.checked)}
            />
            Tampilkan buku tamu / ucapan
          </label>
        </section>
      </div>

      <div className="hidden overflow-y-auto bg-neutral-100 lg:block lg:h-[calc(100vh-65px)]">
        <div className="mx-auto max-w-md py-6">
          <WeddingTemplate
            invitation={{ id: invitation.id, data }}
            templateSlug={templateSlug}
            isPreview
            embedded
          />
        </div>
      </div>
    </div>
  );
}
