# Undangan Digital

Platform jual-beli undangan pernikahan digital: pembeli memilih template, membayar via Midtrans, lalu mengustomisasi undangan sendiri (data mempelai, acara, galeri foto, cerita cinta, musik, RSVP) dan mendapat link undangan unik untuk dibagikan ke tamu.

Stack: Next.js 16 (App Router) · MySQL (self-hosted) · Midtrans Snap.

## Setup

1. **Install dependencies** (sudah dijalankan sebelumnya):
   ```bash
   npm install
   ```

2. **Buat database & user MySQL**, lalu jalankan skema:
   ```bash
   mysql -u root -e "
   CREATE DATABASE undangan_digital CHARACTER SET utf8mb4;
   CREATE USER 'undangan_user'@'localhost' IDENTIFIED BY '<password>';
   GRANT ALL PRIVILEGES ON undangan_digital.* TO 'undangan_user'@'localhost';
   "
   mysql -u root undangan_digital < mysql/schema.sql
   ```
   Ini membuat semua tabel (`users`, `sessions`, `templates`, `orders`, `invitations`, `rsvp_responses`) dan mengisi 6 template contoh.

3. **Daftar akun Midtrans** di https://midtrans.com (Sandbox cukup untuk testing), lalu ambil `Server Key` dan `Client Key` dari dashboard Sandbox.

4. **Isi `.env.local`** (sudah dibuat, tinggal diisi) dengan kredensial DB dari langkah 2 & Midtrans dari langkah 3.

5. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka http://localhost:3001

6. **Setup webhook Midtrans** (supaya order otomatis berubah jadi "paid" setelah bayar): di dashboard Midtrans Sandbox, isi **Payment Notification URL** dengan `https://<domain-publik-anda>/api/midtrans/notification`. Untuk testing lokal, gunakan tunnel seperti `ngrok` agar Midtrans bisa mengakses endpoint ini.

## Struktur Proyek

- `app/` — halaman & API routes (App Router)
- `app/api/auth/` — register/login/logout (session cookie, tanpa email konfirmasi karena tidak ada SMTP)
- `app/api/upload/` — upload foto ke `public/uploads/<userId>/`
- `components/templates/themes.ts` — konfigurasi warna/font per template (6 tema)
- `components/templates/shared/` — komponen section undangan (Cover, EventDetail, dst.), theme-aware
- `components/templates/WeddingTemplate.tsx` — komponen utama yang merender undangan sesuai `template.slug`
- `components/editor/` — form kustomisasi undangan + live preview
- `lib/db.ts` — pool koneksi MySQL (`mysql2/promise`)
- `lib/auth.ts` — hash password, session cookie (`hashPassword`, `createSession`, `getCurrentUser`)
- `lib/midtrans.ts` — helper Midtrans Snap
- `types/invitation.ts` — tipe data undangan
- `mysql/schema.sql` — skema database

## Alur Aplikasi

1. Pembeli lihat katalog template di `/`, klik "Pesan Sekarang" → `/checkout/[slug]`.
2. Bayar via Midtrans Snap. Setelah pembayaran sukses, webhook (`/api/midtrans/notification`) mengubah order jadi `paid` dan membuat baris undangan baru (draft).
3. Pembeli edit undangan di `/editor/[invitationId]` (form + live preview), lalu klik "Terbitkan".
4. Undangan bisa diakses publik di `/u/[slug]` dan tamu bisa mengisi RSVP + ucapan.
5. Pembeli pantau semua undangannya di `/dashboard`.

## Menambah Template Baru

1. Tambah entri baru di `components/templates/themes.ts` (warna, font, ikon) — `slug` di sini harus sama persis dengan `slug` di tabel `templates`.
2. Tambah baris template baru ke tabel `templates` (via SQL atau MySQL client), pakai `slug` yang sama.
3. `WeddingTemplate` otomatis memakai tema itu untuk undangan dengan `template_id` yang sesuai — tidak perlu bikin komponen baru kecuali ingin layout yang berbeda total dari 6 tema yang ada.
