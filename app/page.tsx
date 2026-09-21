import Link from "next/link";
import {
  BookHeart,
  CalendarHeart,
  Images,
  Sparkles,
} from "lucide-react";
import { Nav } from "@/components/nav";
import { getTheme } from "@/components/templates/themes";
import { query } from "@/lib/db";
import type { Template } from "@/types/invitation";

const features = [
  {
    icon: CalendarHeart,
    label: "RSVP Online",
    description: "Tamu konfirmasi kehadiran langsung dari undangan.",
  },
  {
    icon: Images,
    label: "Galeri Foto",
    description: "Tampilkan momen berharga Anda dan pasangan.",
  },
  {
    icon: BookHeart,
    label: "Buku Tamu Digital",
    description: "Kumpulkan ucapan & doa dari para tamu.",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function Home() {
  const templates = await query<Template[]>(
    "select * from templates where is_active = true order by created_at asc"
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50">
      <Nav />

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="animate-float pointer-events-none absolute -left-12 top-10 h-40 w-40 rounded-full bg-rose-200/50 blur-3xl"
        />
        <div
          aria-hidden
          style={{ ["--float-rotate" as string]: "8deg", animationDelay: "1.5s" }}
          className="animate-float pointer-events-none absolute -right-16 top-32 h-56 w-56 rounded-full bg-amber-200/50 blur-3xl"
        />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 py-20 text-center">
          <span className="animate-fade-in-up inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-medium text-amber-800">
            <Sparkles className="h-3.5 w-3.5" />
            Undangan siap terbit dalam hitungan menit
          </span>
          <h1
            className="animate-fade-in-up font-serif text-4xl leading-tight text-neutral-900 sm:text-5xl"
            style={{ animationDelay: "0.1s" }}
          >
            Undangan Pernikahan Digital yang Elegan
          </h1>
          <p
            className="animate-fade-in-up max-w-xl text-neutral-600"
            style={{ animationDelay: "0.2s" }}
          >
            Pilih desain, isi data Anda, dan bagikan undangan dalam hitungan
            menit. Lengkap dengan RSVP, galeri foto, dan buku tamu digital.
          </p>

          <div
            className="animate-fade-in-up mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3"
            style={{ animationDelay: "0.3s" }}
          >
            {features.map(({ icon: Icon, label, description }) => (
              <div
                key={label}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-neutral-200 bg-white/70 px-4 py-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-rose-100 text-rose-700 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium text-neutral-900">{label}</p>
                <p className="text-xs text-neutral-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-6 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template, index) => {
          const theme = getTheme(template.slug);
          const ThemeIcon = theme.icon;
          return (
            <div
              key={template.id}
              className="animate-fade-in-up group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-neutral-900/10"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <Link
                href={`/preview/${template.slug}`}
                target="_blank"
                className={`relative flex h-44 items-center justify-center overflow-hidden font-serif text-white ${theme.cover.bgClass}`}
              >
                <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-70" />
                <span
                  className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full ${theme.iconWrap}`}
                >
                  <ThemeIcon className="h-4 w-4" />
                </span>
                <span
                  className={`relative ${theme.namesFont} text-xl transition-transform duration-300 group-hover:scale-105`}
                >
                  {template.name}
                </span>
                <span className="absolute bottom-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-neutral-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Lihat Contoh
                </span>
              </Link>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h2 className="font-serif text-xl text-neutral-900">
                  {template.name}
                </h2>
                <p className="flex-1 text-sm text-neutral-600">
                  {template.description}
                </p>
                <div className="flex items-center justify-between gap-2 pt-2">
                  <span className="font-medium text-neutral-900">
                    {formatPrice(template.price)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/preview/${template.slug}`}
                      target="_blank"
                      className="rounded-full border border-neutral-300 px-3.5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                      Lihat Contoh
                    </Link>
                    <Link
                      href={`/checkout/${template.slug}`}
                      className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-neutral-700 hover:shadow-lg hover:shadow-neutral-900/20 active:scale-95"
                    >
                      Pesan
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {!templates.length ? (
          <p className="col-span-full text-center text-sm text-neutral-500">
            Belum ada template tersedia. Pastikan migrasi database sudah
            dijalankan.
          </p>
        ) : null}
      </section>
    </div>
  );
}
