"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(form.get("email")),
        password: String(form.get("password")),
      }),
    });

    const body = await res.json().catch(() => null);
    setLoading(false);
    if (!res.ok) {
      setError(body?.error ?? "Gagal mendaftar, silakan coba lagi.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-neutral-50 px-6 py-16">
      <div className="animate-fade-in-up w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-rose-100 text-rose-700">
            <UserPlus className="h-5 w-5" />
          </span>
          <h1 className="font-serif text-2xl text-neutral-900">Daftar</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField label="Email" name="email" type="email" required />
          <TextField
            label="Password"
            name="password"
            type="password"
            minLength={6}
            required
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Memproses..." : "Daftar"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-neutral-900 underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
