import { NextResponse } from "next/server";
import crypto from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/auth";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
};

const MAX_SIZE_BY_TYPE: Record<string, number> = {
  image: 8 * 1024 * 1024,
  audio: 15 * 1024 * 1024,
};

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
  }

  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Tipe file tidak didukung" }, { status: 400 });
  }

  const kind = file.type.startsWith("audio/") ? "audio" : "image";
  const maxSize = MAX_SIZE_BY_TYPE[kind];
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `Ukuran file maksimal ${Math.round(maxSize / (1024 * 1024))}MB` },
      { status: 400 }
    );
  }

  const filename = `${crypto.randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", user.id);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${user.id}/${filename}` });
}
