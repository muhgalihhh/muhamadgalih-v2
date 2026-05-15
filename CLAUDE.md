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

## Architecture

**Server-first, monorepo serverless:**
- All Supabase communication goes through Next.js Server Actions in `app/actions/` — no separate API backend.
- React Server Components (RSC) are the default. `'use client'` is used **only** for components that wrap Framer Motion animations or require UI interactivity.

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
