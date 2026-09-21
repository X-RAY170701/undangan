"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(form.get("email")),
        password: String(form.get("password")),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Email atau password salah.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-neutral-50 px-6 py-16">
      <div className="animate-fade-in-up w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-rose-100 text-rose-700">
            <LogIn className="h-5 w-5" />
          </span>
          <h1 className="font-serif text-2xl text-neutral-900">Masuk</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField label="Email" name="email" type="email" required />
          <TextField
            label="Password"
            name="password"
            type="password"
            required
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-neutral-900 underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
