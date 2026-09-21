export async function uploadFile(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Gagal mengunggah file");
  }

  const { url } = (await res.json()) as { url: string };
  return url;
}
