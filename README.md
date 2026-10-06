# muhamadgalih-v2

Portfolio pribadi + admin CMS. Next.js 16 (App Router), Tailwind CSS 4, Framer Motion, Supabase.

## Prasyarat

- Node.js 20+ (dites di Node 24)
- Project Supabase

## Setup

```bash
npm ci
```

Buat `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Wajib untuk admin CMS (bypass RLS) — jangan pernah expose ke client
SUPABASE_SERVICE_ROLE_KEY=<service_role key>

# Opsional — notifikasi email form kontak via resend.com
RESEND_API_KEY=
```

Semua key ada di Supabase Dashboard → Project Settings → API Keys.

## Database (hanya untuk project Supabase baru)

Jalankan file di `supabase/migrations/` **berurutan** lewat Supabase Dashboard → SQL Editor (atau `supabase db push`).

- Sebelum menjalankan `003_create_admin_user.sql`, ganti email & password admin di dalamnya.
- Kalau project ref berbeda, update hostname Supabase di `images.remotePatterns` pada `next.config.ts`.
- Login Google untuk testimoni: aktifkan provider Google di Supabase → Authentication → Providers, dan tambahkan `<NEXT_PUBLIC_SITE_URL>/auth/callback` ke Redirect URLs.

## Menjalankan

```bash
npm run dev     # http://localhost:3000
npm run build
npm run start
npm run lint
```

- Situs publik: `/`
- Admin CMS: `/admin` (login di `/admin/login`)

## Deploy

Vercel. Set environment variables yang sama seperti `.env.local` di project settings, dengan `NEXT_PUBLIC_SITE_URL` diisi domain produksi.
