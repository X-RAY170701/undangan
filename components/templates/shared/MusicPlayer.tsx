"use client";

import { useEffect, useRef, useState } from "react";

export function MusicPlayer({
  url,
  embedded = false,
}: {
  url: string;
  /** true saat dirender di dalam panel pratinjau editor (bukan halaman penuh) —
   * pakai posisi `absolute` yang terikat ke panel, bukan `fixed` ke viewport,
   * dan JANGAN auto-play (mengganggu saat user sedang edit). */
  embedded?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  // `playing` mengikuti event asli dari elemen <audio> (onPlay/onPause), BUKAN
  // ditebak optimis saat tombol diklik — audio.play() bisa gagal (URL rusak,
  // format tidak didukung, kebijakan autoplay browser) dan promise-nya di-catch
  // diam-diam; kalau state diubah manual di sini, tombol bisa menampilkan ikon
  // "sedang main" padahal tidak ada suara.
  const [playing, setPlaying] = useState(false);
  const autoStartedRef = useRef(false);

  // Backsound: mulai otomatis pada INTERAKSI PERTAMA user di halaman (klik/tap/
  // ketik). Browser memblokir autoplay tanpa gesture, tapi memutar di dalam
  // handler gesture pertama diizinkan — ini pola standar undangan digital.
  useEffect(() => {
    if (!url || embedded) return;

    function tryAutoStart(e: Event) {
      if (autoStartedRef.current) return;
      // abaikan kalau gesture-nya justru menekan tombol musik itu sendiri
      if (
        e.target instanceof Element &&
        e.target.closest("[data-music-toggle]")
      ) {
        return;
      }
      const audio = audioRef.current;
      if (!audio || !audio.paused) return;
      autoStartedRef.current = true;
      audio.play().then(
        () => detach(), // sukses → berhenti mendengarkan
        () => {
          autoStartedRef.current = false; // gagal → biarkan interaksi berikutnya coba lagi
        }
      );
    }

    function detach() {
      window.removeEventListener("pointerdown", tryAutoStart);
      window.removeEventListener("keydown", tryAutoStart);
      window.removeEventListener("touchend", tryAutoStart);
    }

    window.addEventListener("pointerdown", tryAutoStart);
    window.addEventListener("keydown", tryAutoStart);
    window.addEventListener("touchend", tryAutoStart);
    return detach;
  }, [url, embedded]);

  if (!url) return null;

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={url}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        data-music-toggle
        onClick={toggle}
        aria-label={playing ? "Jeda musik" : "Putar musik"}
        className={`${embedded ? "absolute" : "fixed"} bottom-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg outline-none transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95 ${
          playing ? "animate-pulse" : ""
        }`}
      >
        {playing ? "❚❚" : "▶"}
      </button>
    </>
  );
}
