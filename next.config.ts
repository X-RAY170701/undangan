import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Diatur lewat env var (bukan di-hardcode) supaya repo ini tetap bisa dipakai
  // di root domain (klien lain) maupun di subpath seperti demo di
  // arpdigital.online/undangan (di belakang reverse proxy Apache).
  // Kosongkan NEXT_BASE_PATH di .env untuk deploy di root domain.
  basePath: process.env.NEXT_BASE_PATH || "",
  allowedDevOrigins: ["10.20.29.59", "203.175.126.89", "203.175.126.94"],
  images: {
    // Foto undangan asli (cover/galeri yang di-upload user) tersimpan same-origin
    // di /public/uploads — tidak butuh remotePatterns. Ini cuma untuk foto contoh
    // (picsum.photos) yang dipakai halaman demo /preview & sample-data.ts.
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
