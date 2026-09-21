"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { TextField } from "@/components/ui/field";
import { uploadFile } from "@/lib/upload";

export function AudioUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah musik.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-neutral-800">{label}</span>

      {value ? (
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-2">
          <audio controls src={value} className="h-9 flex-1" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Hapus musik"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <label className="cursor-pointer rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-50">
          {uploading ? "Mengunggah..." : value ? "Ganti File" : "Unggah File Musik"}
          <input
            type="file"
            accept="audio/mpeg,audio/mp3,audio/ogg,audio/wav"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </label>
        <span className="text-xs text-neutral-400">MP3/OGG/WAV, maks 15MB</span>
      </div>

      <TextField
        label="Atau tempel link musik"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
      />

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
