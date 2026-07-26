# Admin Shell + Dashboard Redesign

## Goal
Refresh the visual polish of the admin CMS shell (`src/components/admin/AdminSidebar.tsx`) and dashboard overview (`src/app/admin/(dashboard)/page.tsx`), bringing in a small amount of brand personality while keeping the "plain/utilitarian" functional baseline the admin area is meant to have (per project `CLAUDE.md`). Other admin pages (works, gallery, etc.) and `(dashboard)/layout.tsx` are out of scope — layout needs no changes since the shared shell itself (slate-950 sidebar + slate-50 canvas) is unchanged, only the sidebar's internal styling and the dashboard page.

## Design tokens

**Color** — base stays neutral: `slate-950` sidebar, `slate-50` canvas, white cards. Single accent swapped from generic `indigo-600` to **violet `#845EF7`**, already available as the Tailwind utility color `violet` (flat, not the stock `violet-500..900` scale) via `--color-violet` in `globals.css`'s `@theme` block — no CSS changes needed to consume it, just use `bg-violet`, `text-violet`, `border-violet`, with opacity modifiers (`bg-violet/10`, `shadow-violet/20`) for tints. Used for: active nav indicator, the primary (Skills) stat card, focus/hover accents. Existing emerald/orange/purple stat-tile icon tints are left as-is.

**Type** — page/greeting heading on the dashboard, and the sidebar "MG" wordmark, use **Syne** via the existing `font-display` Tailwind utility (from `--font-display` in `@theme`, already loaded in root layout, just currently unused in admin). Everything else stays on `font-body` / default (Plus Jakarta Sans).

**Layout** — sidebar keeps its `w-56` / `bg-slate-950` shell, no structural changes. Active nav item switches from a solid indigo block to `bg-violet/10` + a 2px left border in `violet` + a subtle `shadow-violet/20`, instead of a filled block.

**Signature element** — one small inline SVG squiggle/underline in `violet` beneath the dashboard's greeting heading ("Hey, Mizarie 👋"), stroke-drawn in once via CSS `@keyframes` on mount (respects `prefers-reduced-motion`). This is the single "personality" flourish for this pass — no other decorative elements are added (e.g. sidebar logo does NOT get its own decorative mark, to keep the flourish singular per restraint).

## Non-goals
- No changes to `globals.css` public-site `@theme` tokens (only a new admin-only keyframes block is added, outside `@theme`).
- No new dependencies (reuse `lucide-react`, existing fonts, Tailwind v4 utilities).
- No changes to list/form pages (works, gallery, experience, etc.), the login page, or `(dashboard)/layout.tsx`.
- No dark-mode toggle for admin (layout already forces `colorScheme: "light"`).
- No generic reusable "topbar" component — since only the dashboard page is in scope this pass, adding shared-shell scaffolding for pages that aren't being touched yet is premature.

## Testing
Manual verification via dev server + Playwright browser: sidebar active-state styling on `/admin` route (violet left-border + tint, no more solid indigo block), sidebar wordmark renders in Syne, dashboard heading reads "Hey, Mizarie 👋" in Syne with the violet squiggle beneath it and animates in once, Skills stat card uses violet icon chip while other three keep their existing tints, Quick Actions hover state uses violet instead of indigo, `prefers-reduced-motion: reduce` shows the squiggle fully drawn with no animation, no regressions to nav links / active-route detection / sign-out.
