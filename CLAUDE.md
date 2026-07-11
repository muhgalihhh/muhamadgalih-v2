# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site for Mizarie — a Full-Stack Engineer, UI/UX Designer, and Illustrator. The site showcases software engineering projects, UI/UX work, and illustration/graphic design.

## Tech Stack

- **Framework:** Next.js 16 (App Router), TypeScript strict mode
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (scroll animations, `useScroll`, `useTransform`, `whileInView`, `staggerChildren`)
- **Backend/Auth:** Supabase via `@supabase/ssr`
- **Deployment:** Vercel (serverless monorepo, no separate backend)

## Commands

```bash
npm run dev    # start dev server (localhost:3000)
npm run build
npm run lint
```

## Architecture

**Server-first, monorepo serverless:**
- All Supabase communication goes through Next.js Server Actions in `app/actions/` — no separate API backend.
- React Server Components (RSC) are the default. `'use client'` is used **only** for components that wrap Framer Motion animations or require UI interactivity.

**Two apps in one:**
- Public portfolio (`src/app/*` site routes) — the design-system rules below apply here.
- Admin CMS at `src/app/admin/` — auth-gated dashboard (`(dashboard)/` route group) covering works, gallery, experience, skills, organizations, certificates, testimonials, contact messages. Plain/utilitarian UI (slate palette) — the playful design rules do NOT apply to admin screens.

**Supabase clients (`src/lib/supabase/`):** three variants — `client.ts` (browser), `server.ts` (RSC/Server Actions, user-scoped via cookies), `service.ts` (service-role key, bypasses RLS — admin-only mutations, never use in public-facing code paths).

**Admin auth:** no `middleware.ts`; each `(dashboard)/layout.tsx` calls `supabase.auth.getUser()` server-side and `redirect()`s to `/admin/login` if unauthenticated.

## Design System & UI Rules

**Visual style — "fun", playful, and artistic:**
- Color palette: vibrant/playful with bold contrasts (bright pastels + neon accents, or modern neo-brutalism). Mesh gradients or animated gradients for section backgrounds.
- Layouts: Bento Grid or asymmetric layouts for work showcases (not standard card grids).

**Scroll animations (mandatory via Framer Motion):**
- Text elements (hero titles, descriptions): reveal word-by-word or line-by-line using `staggerChildren` + `whileInView`.
- Cards, images, and UI elements: must animate in on scroll — use `fade-up`, `scale-in`, or light parallax. Elements should be hidden outside the viewport and animate in when scrolled into view.

**Portfolio presentation:**
- Illustration/Graphic Design: Masonry layout with zoom-in hover effect on images.
- Software/UI/UX projects: Interactive cards with floating-animation tech-stack badges on hover.

**Mobile navigation:**
- Use a "Magic Navigation Menu" (curved bottom nav). The curve must be smooth and icons must have a spring/bounce animation on press.
