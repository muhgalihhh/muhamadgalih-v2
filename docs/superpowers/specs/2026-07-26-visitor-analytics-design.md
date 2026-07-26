# Visitor Analytics Feature

## Goal
Add a lightweight, self-hosted pageview analytics system for the public portfolio site, visible only in the admin CMS, that automatically excludes the site owner's own visits (no manual toggling required) and never counts local development traffic.

## Data model

New Supabase migration `supabase/migrations/016_analytics.sql`:

```sql
create table analytics_pageviews (
  id bigint generated always as identity primary key,
  path text not null,
  referrer_source text not null default 'direct',
  session_id text not null,
  created_at timestamptz not null default now()
);

create index analytics_pageviews_created_at_idx on analytics_pageviews (created_at);
create index analytics_pageviews_session_id_idx on analytics_pageviews (session_id);

alter table analytics_pageviews enable row level security;

-- Anyone (including anonymous visitors) can log a pageview, but never read them back.
create policy "anyone can insert a pageview"
  on analytics_pageviews for insert
  to anon, authenticated
  with check (true);

-- Only the authenticated admin (the only authenticated role in this app) can read.
create policy "authenticated can read pageviews"
  on analytics_pageviews for select
  to authenticated
  using (true);
```

`referrer_source` is one of: `google`, `instagram`, `facebook`, `twitter`, `linkedin`, `github`, `internal`, `direct`, `other`. Classification happens server-side (see below) before insert — the raw referrer URL is never stored, only the bucketed source.

## Tracking flow

**Client component** `src/components/analytics/PageviewTracker.tsx` (new file):
- `"use client"`, renders nothing (`return null`).
- Uses `usePathname()` from `next/navigation`.
- `useEffect` keyed on `pathname`: calls the `recordPageview(pathname, document.referrer || null)` server action, fire-and-forget (no loading state, ignore the returned promise's rejection — a failed analytics call must never break the page).

**Wiring**: `src/components/ui/PublicLayout.tsx` already computes `const isAdmin = pathname.startsWith("/admin")` at line 18 to conditionally render public chrome (Navbar, MobileNav, etc.). Add `{!isAdmin && <PageviewTracker />}` alongside those conditional renders. This guarantees the tracker never mounts on `/admin/*` routes — no separate "am I on an admin route" check is needed inside the tracker itself.

**Server action** `src/app/actions/analytics.ts` (new file), function `recordPageview(path: string, referrer: string | null)`:

1. `if (process.env.NODE_ENV !== "production") return;` — local dev traffic is never recorded, regardless of login state.
2. Create the request-scoped Supabase client via `createClient()` from `src/lib/supabase/server.ts` (cookie-based, same helper used elsewhere in the app). Call `const { data: { user } } = await supabase.auth.getUser();` — if `user` is non-null, `return` immediately (the site owner is logged into `/admin` in this browser, so this visit is self-traffic and must not be counted). No new auth concept is introduced; this reuses the existing Supabase Auth session that admin login already creates.
3. Read/write a session cookie via `cookies()` from `next/headers`: look for a cookie named `av_sid`. If absent, generate one with `crypto.randomUUID()`. Either way, set it (or refresh it) with `maxAge: 60 * 30` (30 minutes), `httpOnly: true`, `sameSite: "lax"` — this both creates new sessions and extends active ones, so a visitor who keeps browsing for longer than 30 minutes still counts as one continuous session as long as they don't go idle for a full 30 minutes.
4. Classify the referrer into `referrer_source` via a small helper `classifyReferrer(referrer: string | null, ownHost: string): string` (co-located in the same file). `ownHost` is obtained via `(await headers()).get("host")` from `next/headers` — the actual host of the incoming request, so this works correctly on any domain (custom domain, Vercel preview URL, localhost) without needing a new env var:
   - `null` or empty string → `"direct"`
   - hostname equals `ownHost` (the site's own domain for this request) → `"internal"`
   - hostname includes `google.` → `"google"`
   - hostname includes `instagram.com` → `"instagram"`
   - hostname includes `facebook.com` → `"facebook"`
   - hostname includes `twitter.com` or `x.com` → `"twitter"`
   - hostname includes `linkedin.com` → `"linkedin"`
   - hostname includes `github.com` → `"github"`
   - anything else parseable → `"other"`
   - malformed/unparseable referrer string → `"other"` (never throw)
5. Insert one row: `{ path, referrer_source: classifyReferrer(referrer, ownHost), session_id: sessionId }` using the same request-scoped Supabase client from step 2 (relies on the `anon`/`authenticated` insert policy — no service-role client involved, since this runs on every public visitor's request and `service.ts` is reserved for admin-only mutations per this project's existing convention).
6. Wrap steps 3-5 in a `try/catch` that swallows errors silently (a broken insert must never surface to the visitor or break navigation).

## Admin Analytics page

**Route**: `src/app/admin/(dashboard)/analytics/page.tsx` (server component) + `src/app/admin/(dashboard)/analytics/AnalyticsClient.tsx` (presentational, receives pre-fetched data as props — no client-side data fetching needed since this is a simple read-once admin page, matching the pattern of other admin list pages like Works/Gallery).

**Sidebar**: add one entry to the `nav` array in `src/components/admin/AdminSidebar.tsx`, right after `Overview`: `{ label: "Analytics", href: "/admin/analytics", icon: TrendingUp }` (new `TrendingUp` import from `lucide-react`, already a project dependency).

**Data fetching** (in `page.tsx`, server-side): use the normal request-scoped `createClient()` from `src/lib/supabase/server.ts` (the admin viewing this page is already authenticated, so the `authenticated can read` RLS policy applies — no service-role client needed here either). Fetch all rows from `analytics_pageviews` where `created_at >= now() - interval '30 days'`, ordered by `created_at`. Given this is a personal portfolio (low traffic volume), aggregation happens in plain JS in the server component rather than a Postgres view or RPC function:

- **Total pageviews (30d)**: `rows.length`
- **Unique visits (30d)**: count of distinct `session_id` values
- **Pageviews today**: filter rows where `created_at` falls on the current calendar date (server's local date), then `.length`
- **Daily series (last 14 days)**: bucket rows by `created_at`'s date into a `Map<string, number>` keyed `YYYY-MM-DD`, pre-seeded with the last 14 calendar dates set to 0 so days with zero traffic still render a (empty) bar in order
- **Top pages**: bucket rows by `path` into a `Map<string, number>`, sort descending by count, take top 5
- **Top referrers**: bucket rows by `referrer_source` into a `Map<string, number>`, sort descending by count, take top 5 (all buckets shown if fewer than 5 distinct sources occurred)

All four aggregates are computed from the same single 30-day row fetch — only one database round trip.

**Layout** (`AnalyticsClient.tsx`), following the established admin visual language (violet accent `bg-violet`/`text-violet`, `font-display` page title, white `rounded-2xl border border-slate-100` panels):

1. Header: `<h1 className="font-display ...">Analytics</h1>` + subtext "Last 30 days".
2. Stat row: 3 cards (Total Pageviews, Unique Visits, Today) in the same visual style as the Dashboard's existing stat cards (`bg-white rounded-2xl border border-slate-100`), first card's icon chip in violet, matching the Dashboard convention already shipped.
3. Daily chart panel: hand-rolled bar chart — a flex row of 14 `<div>` bars, each bar's height set via inline `style={{ height: '...%' }}` proportional to `count / maxCount`, bar color `bg-violet`, with the date (day number) as a small label underneath each bar. No charting library — plain divs + Tailwind, matching the "no new dependencies" precedent set during the admin restyle.
4. Two-column panel row (stacks to one column on narrow viewports): "Top Pages" list and "Top Referrers" list, each row showing the label and a small right-aligned count, using the same `divide-y divide-slate-100` row pattern already used on other admin list pages (e.g. Works).

## Non-goals
- No new third-party analytics service (Plausible, GA, Vercel Analytics, etc.) — fully self-hosted in the existing Supabase project.
- No IP-based tracking, storage, or geolocation — only `path`, `referrer_source`, `session_id`, `created_at` are stored, no PII.
- No raw event browser/export UI, date-range picker, or filtering beyond the fixed 30-day / 14-day windows described above — this is a first pass; a richer explorer view can be a later iteration if actually needed.
- No changes to the anonymous/public read access — anon can only INSERT, never SELECT, enforced at the RLS level (not just in application code).
- No data retention/cleanup job — volume is low enough for a personal portfolio that pruning isn't needed yet.

## Testing
Manual verification via dev server + Playwright browser, plus a quick Supabase check:
- Confirm `NODE_ENV !== "production"` guard: browsing the site in `next dev` produces zero new rows in `analytics_pageviews`.
- Temporarily bypass the dev guard (or test against a production build) to confirm: visiting public pages while logged out of `/admin` inserts a row with the correct `path`; visiting public pages while logged into `/admin` in the same browser inserts nothing.
- Confirm session dedup: reloading the same page within 30 minutes reuses the same `av_sid` cookie/session_id; after the cookie is cleared or expires, a new session_id is generated.
- Confirm referrer classification with a few manual `document.referrer` values (via browser devtools override or a temporary test call) covering google/instagram/direct/other.
- Confirm the `/admin/analytics` page renders the stat cards, 14-day bar chart, and top-pages/top-referrers lists without errors against seeded rows, and that the sidebar "Analytics" link and active-state styling work like the other nav items.
- Confirm anon cannot read: attempt a `select` against `analytics_pageviews` using the anon key (e.g. via `curl` against the Supabase REST endpoint) and confirm it returns zero rows / is denied by RLS.
