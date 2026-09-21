"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        callbacks: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

const snapUrl =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

export function CheckoutButton({
  templateSlug,
  isLoggedIn,
}: {
  templateSlug: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Skrip Midtrans Snap dimuat async (next/script) dan bisa saja belum siap
  // saat tombol diklik (koneksi lambat, atau user klik cepat). Sebelumnya
  // `window.snap?.pay(...)` diam-diam tidak melakukan apa-apa kalau `snap`
  // belum ada — order/token sudah dibuat di server, tapi popup pembayaran
  // tidak pernah muncul dan tidak ada pesan error sama sekali.
  const [snapReady, setSnapReady] = useState(false);

  async function handleCheckout() {
    if (!isLoggedIn) {
      router.push(`/login?next=/checkout/${templateSlug}`);
      return;
    }

    if (!snapReady || !window.snap) {
      setError(
        "Modul pembayaran masih dimuat, tunggu sebentar lalu coba lagi."
      );
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/midtrans/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateSlug }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Gagal memulai pembayaran");

      window.snap.pay(body.token, {
        onSuccess: () => router.push("/dashboard"),
        onPending: () => router.push("/dashboard"),
        onError: () => setError("Pembayaran gagal, silakan coba lagi."),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src={snapUrl}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        onReady={() => setSnapReady(true)}
        onError={() =>
          setError("Gagal memuat modul pembayaran. Periksa koneksi internet Anda.")
        }
      />
      <Button
        onClick={handleCheckout}
        disabled={loading || (isLoggedIn && !snapReady)}
      >
        {loading
          ? "Memproses..."
          : isLoggedIn && !snapReady
            ? "Memuat modul pembayaran..."
            : "Bayar Sekarang"}
      </Button>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </>
  );
}
