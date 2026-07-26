# Visitor Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Self-hosted pageview analytics for the public site, visible only in the admin CMS, that automatically excludes the site owner's own visits and dev-mode traffic. Per `docs/superpowers/specs/2026-07-26-visitor-analytics-design.md`.

**Architecture:** One new Supabase table (`analytics_pageviews`) with RLS allowing anonymous INSERT but only authenticated SELECT. A tiny client component fires a Server Action on every public-page navigation; the action filters out dev-mode and admin-session traffic before writing. A new admin page reads and aggregates the last 30 days in plain JS (no charting library, no Postgres view — traffic volume is low).

**Tech Stack:** Next.js 16 Server Actions, `@supabase/ssr`, Postgres RLS, lucide-react (`TrendingUp` icon) — no new npm dependencies.

## Global Constraints

- No new npm dependencies (spec non-goal: no charting library).
- No PII stored: only `path`, `referrer_source` (bucketed, not raw URL), `session_id`, `created_at`.
- Anonymous role may only INSERT into `analytics_pageviews`, never SELECT — enforced via RLS, not application code.
- `service.ts` (service-role client) must NOT be used anywhere in this feature — both the public insert path and the admin read path use the normal request-scoped `createClient()` from `src/lib/supabase/server.ts` (insert relies on the anon RLS policy; the admin read relies on the `authenticated` RLS policy, since the admin viewing `/admin/analytics` is already logged in).
- `recordPageview` must never throw in a way that breaks the visitor's page — wrap in try/catch, swallow errors.
- Dev-mode guard (`NODE_ENV !== "production"` → no-op) must be the very first check in `recordPageview`.

---

### Task 1: Database migration

**Files:**
- Create: `supabase/migrations/016_analytics.sql`

**Interfaces:**
- Produces: table `analytics_pageviews` with columns `id, path, referrer_source, session_id, created_at`, consumed by Task 2's insert and Task 5's select.

- [ ] **Step 1: Write the migration file**

Create `supabase/migrations/016_analytics.sql`:

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

create policy "anyone can insert a pageview"
  on analytics_pageviews for insert
  to anon, authenticated
  with check (true);

create policy "authenticated can read pageviews"
  on analytics_pageviews for select
  to authenticated
  using (true);
```

- [ ] **Step 2: Apply the migration to the live Supabase project**

This project (`nzmvgjjepavdtynscaui`, name `muhgalihhh-v2`) has no local Supabase CLI stack — migrations are applied directly to the hosted project. Use the `mcp__supabase__apply_migration` tool with `project_id: "nzmvgjjepavdtynscaui"`, `name: "analytics_pageviews"`, and the SQL from Step 1 as `query`. **Confirm with the user before running this** — it's a live schema change to their production database, even though it's purely additive (new table, nothing modified or dropped).

- [ ] **Step 3: Verify the table and RLS policies exist**

Run `mcp__supabase__list_tables` (or `execute_sql` with `select * from analytics_pageviews limit 1;`) against project `nzmvgjjepavdtynscaui` and confirm the table exists with 0 rows and no errors.

- [ ] **Step 4: Commit**

Leave the change unstaged — user commits manually (do not run `git commit`).

---

### Task 2: Server actions — recordPageview, classifyReferrer, getAnalyticsSummary

**Files:**
- Create: `src/app/actions/analytics.ts`

**Interfaces:**
- Produces: `recordPageview(path: string, referrer: string | null): Promise<void>` — consumed by Task 3's `PageviewTracker`.
- Produces: `interface AnalyticsSummary { totalPageviews: number; uniqueVisits: number; todayPageviews: number; dailySeries: { date: string; count: number }[]; topPages: { path: string; count: number }[]; topReferrers: { source: string; count: number }[] }` and `getAnalyticsSummary(): Promise<AnalyticsSummary>` — consumed by Task 5's `page.tsx`.
- Consumes: `createClient` from `src/lib/supabase/server.ts` (existing helper, no changes needed).

- [ ] **Step 1: Write the file**

Create `src/app/actions/analytics.ts`:

```ts
"use server";

import { headers, cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const KNOWN_REFERRERS: Array<{ match: string; source: string }> = [
  { match: "google.", source: "google" },
  { match: "instagram.com", source: "instagram" },
  { match: "facebook.com", source: "facebook" },
  { match: "twitter.com", source: "twitter" },
  { match: "x.com", source: "twitter" },
  { match: "linkedin.com", source: "linkedin" },
  { match: "github.com", source: "github" },
];

function classifyReferrer(referrer: string | null, ownHost: string | null): string {
  if (!referrer) return "direct";
  let hostname: string;
  try {
    hostname = new URL(referrer).hostname;
  } catch {
    return "other";
  }
  if (ownHost && hostname === ownHost) return "internal";
  const known = KNOWN_REFERRERS.find((entry) => hostname.includes(entry.match));
  return known ? known.source : "other";
}

const SESSION_COOKIE = "av_sid";
const SESSION_MAX_AGE = 60 * 30; // 30 minutes

export async function recordPageview(path: string, referrer: string | null) {
  if (process.env.NODE_ENV !== "production") return;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return; // admin's own visit — never counted

    const cookieStore = await cookies();
    let sessionId = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sessionId) sessionId = crypto.randomUUID();
    cookieStore.set(SESSION_COOKIE, sessionId, {
      maxAge: SESSION_MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
    });

    const headerList = await headers();
    const ownHost = headerList.get("host");
    const referrerSource = classifyReferrer(referrer, ownHost);

    await supabase.from("analytics_pageviews").insert({
      path,
      referrer_source: referrerSource,
      session_id: sessionId,
    });
  } catch {
    // Analytics must never break the visitor's page
  }
}

export interface AnalyticsSummary {
  totalPageviews: number;
  uniqueVisits: number;
  todayPageviews: number;
  dailySeries: { date: string; count: number }[];
  topPages: { path: string; count: number }[];
  topReferrers: { source: string; count: number }[];
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const supabase = await createClient();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: rows } = await supabase
    .from("analytics_pageviews")
    .select("path, referrer_source, session_id, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: true });

  const pageviews = rows ?? [];

  const dailyMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    dailyMap.set(d.toISOString().slice(0, 10), 0);
  }

  const pageMap = new Map<string, number>();
  const referrerMap = new Map<string, number>();
  const sessions = new Set<string>();

  for (const row of pageviews) {
    sessions.add(row.session_id);
    pageMap.set(row.path, (pageMap.get(row.path) ?? 0) + 1);
    referrerMap.set(row.referrer_source, (referrerMap.get(row.referrer_source) ?? 0) + 1);

    const dateKey = row.created_at.slice(0, 10);
    if (dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, (dailyMap.get(dateKey) ?? 0) + 1);
    }
  }

  const todayKey = new Date().toISOString().slice(0, 10);

  return {
    totalPageviews: pageviews.length,
    uniqueVisits: sessions.size,
    todayPageviews: dailyMap.get(todayKey) ?? 0,
    dailySeries: Array.from(dailyMap.entries()).map(([date, count]) => ({ date, count })),
    topPages: Array.from(pageMap.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    topReferrers: Array.from(referrerMap.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
  };
}
```

- [ ] **Step 2: Type-check**

Run: `source ~/.nvm/nvm.sh && npx tsc --noEmit`
Expected: no new errors from `src/app/actions/analytics.ts`.

- [ ] **Step 3: Commit**

Leave the change unstaged — user commits manually (do not run `git commit`).

---

### Task 3: Client tracker component + wire into PublicLayout

**Files:**
- Create: `src/components/analytics/PageviewTracker.tsx`
- Modify: `src/components/ui/PublicLayout.tsx`

**Interfaces:**
- Consumes: `recordPageview` from `src/app/actions/analytics.ts` (Task 2).
- No exports consumed by later tasks.

- [ ] **Step 1: Create the tracker component**

Create `src/components/analytics/PageviewTracker.tsx`:

```tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { recordPageview } from "@/app/actions/analytics";

export default function PageviewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    recordPageview(pathname, document.referrer || null).catch(() => {});
  }, [pathname]);

  return null;
}
```

- [ ] **Step 2: Wire it into PublicLayout**

In `src/components/ui/PublicLayout.tsx`, add the import and render it conditionally alongside the other `!isAdmin` elements:

```tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import MusicPlayer from "./MusicPlayer";
import CustomCursor from "./CustomCursor";
import SplashScreen from "./SplashScreen";
import PageviewTracker from "@/components/analytics/PageviewTracker";

interface PublicLayoutProps {
  children: React.ReactNode;
  musicUrl?: string | null;
  songTitle?: string | null;
}

export default function PublicLayout({ children, musicUrl, songTitle }: PublicLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <SplashScreen />}
      {!isAdmin && <CustomCursor />}
      {!isAdmin && <Navbar />}
      {!isAdmin && <PageviewTracker />}
      {children}
      {!isAdmin && <MobileNav />}
      {!isAdmin && <MusicPlayer musicUrl={musicUrl} songTitle={songTitle} />}
    </>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `source ~/.nvm/nvm.sh && npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

Leave the change unstaged — user commits manually (do not run `git commit`).

---

### Task 4: Admin sidebar nav entry

**Files:**
- Modify: `src/components/admin/AdminSidebar.tsx`

**Interfaces:**
- No new exports/props.

- [ ] **Step 1: Add the icon import**

In `src/components/admin/AdminSidebar.tsx`, add `TrendingUp` to the existing `lucide-react` import list (currently `LayoutDashboard, Wrench, Briefcase, FolderOpen, Award, Mail, LogOut, ExternalLink, Images, MessageSquareQuote, Inbox, Users`):

```tsx
import {
  LayoutDashboard,
  TrendingUp,
  Wrench,
  Briefcase,
  FolderOpen,
  Award,
  Mail,
  LogOut,
  ExternalLink,
  Images,
  MessageSquareQuote,
  Inbox,
  Users,
} from "lucide-react";
```

- [ ] **Step 2: Add the nav entry right after Overview**

Replace:

```tsx
const nav = [
  { label: "Overview",      href: "/admin",               icon: LayoutDashboard },
  { label: "Skills",        href: "/admin/skills",        icon: Wrench },
```

with:

```tsx
const nav = [
  { label: "Overview",      href: "/admin",               icon: LayoutDashboard },
  { label: "Analytics",     href: "/admin/analytics",     icon: TrendingUp },
  { label: "Skills",        href: "/admin/skills",        icon: Wrench },
```

- [ ] **Step 3: Type-check**

Run: `source ~/.nvm/nvm.sh && npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

Leave the change unstaged — user commits manually (do not run `git commit`).

---

### Task 5: Admin Analytics page

**Files:**
- Create: `src/app/admin/(dashboard)/analytics/page.tsx`

**Interfaces:**
- Consumes: `getAnalyticsSummary` and `AnalyticsSummary` from `src/app/actions/analytics.ts` (Task 2).

Note on structure: the spec describes a `page.tsx` + separate `AnalyticsClient.tsx`, following the Works/Gallery pattern. But this page has **zero interactivity** (no forms, no client state) — the closer precedent in this codebase is `src/app/admin/(dashboard)/page.tsx` (the Dashboard), which is a single self-contained async server component with no client-side split. Follow that pattern here instead: one file, no `"use client"`, no separate Client component. This avoids an unnecessary file split for a page that never needs one.

- [ ] **Step 1: Write the page**

Create `src/app/admin/(dashboard)/analytics/page.tsx`:

```tsx
import { getAnalyticsSummary } from "@/app/actions/analytics";

const REFERRER_LABELS: Record<string, string> = {
  google: "Google",
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "Twitter / X",
  linkedin: "LinkedIn",
  github: "GitHub",
  internal: "Internal",
  direct: "Direct",
  other: "Other",
};

export default async function AnalyticsAdminPage() {
  const summary = await getAnalyticsSummary();
  const maxDaily = Math.max(1, ...summary.dailySeries.map((d) => d.count));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Last 30 days</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl p-6 border border-slate-100 bg-white">
          <div className="w-10 h-10 bg-violet/10 rounded-xl flex items-center justify-center mb-4">
            <span className="text-violet text-lg font-bold">#</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">{summary.totalPageviews}</p>
          <p className="text-sm text-slate-500">Total Pageviews</p>
        </div>
        <div className="rounded-2xl p-6 border border-slate-100 bg-white">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
            <span className="text-emerald-600 text-lg font-bold">#</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">{summary.uniqueVisits}</p>
          <p className="text-sm text-slate-500">Unique Visits</p>
        </div>
        <div className="rounded-2xl p-6 border border-slate-100 bg-white">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
            <span className="text-orange-600 text-lg font-bold">#</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">{summary.todayPageviews}</p>
          <p className="text-sm text-slate-500">Today</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <h2 className="font-semibold text-slate-900 mb-4">Daily Pageviews (14 days)</h2>
        <div className="flex items-end gap-2 h-40">
          {summary.dailySeries.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full bg-violet/80 rounded-t-md min-h-[2px]"
                style={{ height: `${(d.count / maxDaily) * 100}%` }}
                title={`${d.date}: ${d.count}`}
              />
              <span className="text-[10px] text-slate-400">{d.date.slice(8, 10)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Top Pages</h2>
          {summary.topPages.length === 0 ? (
            <p className="text-sm text-slate-400">No data yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {summary.topPages.map((p) => (
                <div key={p.path} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-slate-700 truncate">{p.path}</span>
                  <span className="text-slate-500 font-medium">{p.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Top Referrers</h2>
          {summary.topReferrers.length === 0 ? (
            <p className="text-sm text-slate-400">No data yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {summary.topReferrers.map((r) => (
                <div key={r.source} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-slate-700">{REFERRER_LABELS[r.source] ?? r.source}</span>
                  <span className="text-slate-500 font-medium">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check and build**

Run: `source ~/.nvm/nvm.sh && npm run build`
Expected: build succeeds, `/admin/analytics` appears in the route list.

- [ ] **Step 3: Commit**

Leave the change unstaged — user commits manually (do not run `git commit`).

---

### Task 6: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Confirm dev-mode guard**

With `npm run dev` running, visit a public page (e.g. `/`, `/works`) a few times as a logged-out visitor. Run `mcp__supabase__execute_sql` (project `nzmvgjjepavdtynscaui`) with `select count(*) from analytics_pageviews;` — expect the count to be unaffected by this dev-mode browsing (the `NODE_ENV !== "production"` guard should have no-op'd every call).

- [ ] **Step 2: Confirm admin-session exclusion and anon insert, against a production build**

Run `npm run build && npm run start` (production mode) locally. In one browser context, log into `/admin`, then visit `/` and `/works` a couple times — confirm via `execute_sql` count that no new rows were added. In a separate incognito/logged-out browser context, visit `/`, `/about`, `/works` — confirm new rows *do* appear with the correct `path` values.

- [ ] **Step 3: Confirm session dedup**

In the logged-out context from Step 2, reload the same page 3-4 times quickly. Query `select session_id, count(*) from analytics_pageviews group by session_id;` — the reloads should share one `session_id` (one session, multiple pageview rows).

- [ ] **Step 4: Confirm RLS blocks anon reads**

Using `curl` against the Supabase REST endpoint with the anon key (from `.env.local`'s `NEXT_PUBLIC_SUPABASE_ANON_KEY`), attempt `GET {SUPABASE_URL}/rest/v1/analytics_pageviews` with header `apikey: <anon key>` — confirm it returns an empty array or a permissions error, never actual rows.

- [ ] **Step 5: Visual check of the admin page**

Using the Playwright browser tool, log into `/admin`, navigate to `/admin/analytics`, and confirm: the sidebar shows "Analytics" with the violet active-state styling (matching other nav items), the heading renders in Syne, the 3 stat cards show real numbers from Steps 2-3's test data, the 14-day bar chart renders bars proportional to daily counts, and Top Pages / Top Referrers show the paths/sources visited during testing.

- [ ] **Step 6: Clean up test data (optional)**

If the test rows from Steps 1-3 aren't wanted in the live analytics history, run `execute_sql` with `delete from analytics_pageviews;` — **confirm with the user before running this**, since it deletes rows from their live database.

---

## Self-review notes
- Spec coverage: data model ✓ (Task 1), tracking flow incl. all 3 exclusion layers + session dedup + referrer classification ✓ (Task 2, Task 3), admin page + sidebar entry ✓ (Task 4, Task 5), non-goals respected (no new deps, no PII, no service-role client, no retention job).
- No placeholders — every step has literal before/after code or a fully specified command.
- Type/name consistency: `AnalyticsSummary` shape matches between `getAnalyticsSummary`'s return (Task 2) and its consumption in Task 5's `page.tsx` (`totalPageviews`, `uniqueVisits`, `todayPageviews`, `dailySeries`, `topPages`, `topReferrers` — same field names in both places). `recordPageview(path, referrer)` signature matches between Task 2's definition and Task 3's call site.
- Deviation from spec, called out explicitly: Task 5 uses a single `page.tsx` instead of the spec's `page.tsx` + `AnalyticsClient.tsx` split, because this page has no interactivity — the Dashboard page (not Works/Gallery) is the correct precedent to follow here. Noted inline in Task 5.
- Two steps involve live, hard-to-reverse-ish actions on the user's real Supabase project (Task 1 Step 2 applying the migration, Task 6 Step 6 deleting test rows) — both are explicitly flagged as requiring user confirmation before running.
