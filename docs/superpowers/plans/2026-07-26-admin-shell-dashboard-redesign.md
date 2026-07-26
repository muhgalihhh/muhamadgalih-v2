# Admin Shell + Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the admin sidebar and dashboard overview a violet accent (replacing generic indigo) plus a Syne display-font touch and one signature squiggle flourish, per `docs/superpowers/specs/2026-07-26-admin-shell-dashboard-redesign-design.md`.

**Architecture:** Pure Tailwind-class + one CSS-keyframes edit. No new components, no new dependencies. Three files touched: `src/components/admin/AdminSidebar.tsx`, `src/app/globals.css` (new keyframes block only, outside the `@theme` block), `src/app/admin/(dashboard)/page.tsx`.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4 (CSS-first `@theme`), lucide-react icons, no test framework for UI styling — verification is manual via dev server + Playwright browser.

## Global Constraints

- Accent color: `violet` (Tailwind utility already generated from `--color-violet: #845EF7` in `globals.css:10`) — use `bg-violet`, `text-violet`, `border-violet`, with `/NN` opacity modifiers for tints. Never introduce a new hex value.
- Display font: `font-display` utility (maps to Syne via `--font-display` in `globals.css:17`) — only for the sidebar wordmark and the dashboard greeting heading. Nowhere else.
- Do not touch `(dashboard)/layout.tsx`, the login page, or any list/form admin page.
- Do not modify anything inside the `@theme { ... }` block in `globals.css`.
- Respect `prefers-reduced-motion: reduce` for the squiggle animation.

---

### Task 1: Sidebar — violet accent + Syne wordmark

**Files:**
- Modify: `src/components/admin/AdminSidebar.tsx:50-56` (logo block), `:66-78` (nav item active/inactive classes)

**Interfaces:**
- No new exports/props. `AdminSidebar` remains a no-argument default export client component.

- [ ] **Step 1: Update the logo wordmark to use Syne and violet hover**

In `src/components/admin/AdminSidebar.tsx`, replace lines 50-56:

```tsx
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <Link href="/" target="_blank" className="flex items-baseline gap-1 group">
          <span className="font-bold text-xl text-white group-hover:text-indigo-400 transition-colors">MG</span>
          <span className="text-slate-500 text-sm">/ CMS</span>
        </Link>
        <p className="text-slate-600 text-[10px] mt-0.5">Portfolio Admin</p>
      </div>
```

with:

```tsx
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <Link href="/" target="_blank" className="flex items-baseline gap-1 group">
          <span className="font-display font-semibold text-xl text-white group-hover:text-violet transition-colors">MG</span>
          <span className="text-slate-500 text-sm">/ CMS</span>
        </Link>
        <p className="text-slate-600 text-[10px] mt-0.5">Portfolio Admin</p>
      </div>
```

- [ ] **Step 2: Swap the active nav state from solid indigo to a violet accent line**

Replace lines 66-78:

```tsx
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon size={15} className="shrink-0" />
              {item.label}
            </Link>
```

with:

```tsx
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 pr-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-violet/10 text-white border-l-2 border-violet pl-[10px] shadow-violet/20 shadow-sm"
                  : "border-l-2 border-transparent pl-3 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon size={15} className="shrink-0" />
              {item.label}
            </Link>
```

(The inactive branch keeps a transparent 2px left border and matching `pl-3` so the label doesn't shift horizontally when a route becomes active.)

- [ ] **Step 3: Visually verify in the browser**

Run: `source ~/.nvm/nvm.sh && npm run dev` (background), then use the Playwright browser tool to open `http://localhost:3000/admin`, log in if needed, and confirm: "MG" renders in Syne (noticeably different letterforms from the "/ CMS" text next to it), the active nav item ("Overview") shows a violet left border + soft violet tint instead of a solid indigo block, and inactive items are unchanged (slate hover).

- [ ] **Step 4: Commit**

Leave the change unstaged — user commits manually (do not run `git commit`).

---

### Task 2: Squiggle keyframes in globals.css

**Files:**
- Modify: `src/app/globals.css` (append new block after the existing `.cartoon-border-light` / dark-mode overrides section, i.e. after line 154, before the "Grid line pattern" comment at line 156 — or immediately after it; exact insertion point doesn't matter as long as it's outside the `@theme { ... }` block at the top of the file)

**Interfaces:**
- Produces: CSS class `.admin-squiggle path` (animation) consumed by Task 3's SVG in the dashboard page. Produces `@keyframes admin-squiggle-draw`.

- [ ] **Step 1: Add the keyframes + animation class**

Insert this block into `src/app/globals.css` (anywhere outside the `@theme {}` block — e.g. right after the `.dark .cartoon-border-lg` rule around line 154):

```css
/* ── Admin dashboard signature squiggle ── */
.admin-squiggle path {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: admin-squiggle-draw 0.9s ease-out 0.15s forwards;
}

@keyframes admin-squiggle-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .admin-squiggle path {
    animation: none;
    stroke-dashoffset: 0;
  }
}
```

- [ ] **Step 2: Verify the file still builds**

Run: `source ~/.nvm/nvm.sh && npm run build` and confirm no CSS/build errors.

- [ ] **Step 3: Commit**

Leave the change unstaged — user commits manually (do not run `git commit`).

---

### Task 3: Dashboard — greeting heading, squiggle, violet stat card, violet quick-action hover

**Files:**
- Modify: `src/app/admin/(dashboard)/page.tsx:20-27` (Skills stat card colors), `:64-68` (header), `:104` (quick action hover classes)

**Interfaces:**
- Consumes: `.admin-squiggle` CSS class from Task 2.
- No new exports/props — `AdminDashboard` stays a no-argument async default export.

- [ ] **Step 1: Swap the Skills stat card to violet**

In `src/app/admin/(dashboard)/page.tsx`, replace lines 20-27:

```tsx
    {
      label: "Skills",
      count: skillsCount ?? 0,
      href: "/admin/skills",
      icon: Wrench,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
```

with:

```tsx
    {
      label: "Skills",
      count: skillsCount ?? 0,
      href: "/admin/skills",
      icon: Wrench,
      iconBg: "bg-violet/10",
      iconColor: "text-violet",
    },
```

- [ ] **Step 2: Replace the header with a greeting heading + signature squiggle**

Replace lines 64-68:

```tsx
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your portfolio content</p>
      </div>
```

with:

```tsx
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Hey, Mizarie 👋</h1>
        <svg
          className="admin-squiggle mt-1 -mb-1"
          width="120"
          height="10"
          viewBox="0 0 120 10"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 6 Q 16 -1, 30 5 T 58 5 T 86 5 T 118 5"
            stroke="#845EF7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-slate-500 text-sm mt-2">Manage your portfolio content</p>
      </div>
```

- [ ] **Step 3: Update the Quick Actions hover accent**

Replace the `className` on line 104:

```tsx
                className="flex items-center gap-2 text-sm bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 hover:border-indigo-200 px-4 py-2 rounded-xl transition-all font-medium"
```

with:

```tsx
                className="flex items-center gap-2 text-sm bg-slate-50 hover:bg-violet/10 hover:text-violet text-slate-700 border border-slate-200 hover:border-violet/30 px-4 py-2 rounded-xl transition-all font-medium"
```

- [ ] **Step 4: Visually verify in the browser**

With the dev server still running from Task 1, use the Playwright browser tool to reload `http://localhost:3000/admin` and confirm: heading reads "Hey, Mizarie 👋" in Syne, a small violet squiggle draws in beneath it once on load (reload the page to see the draw-in animation each time), the Skills stat tile's icon chip is violet while Experience/Projects/Certificates keep emerald/orange/purple, and hovering a Quick Action pill turns violet instead of indigo. Then, in devtools or OS settings, emulate `prefers-reduced-motion: reduce` (Playwright: `browser_evaluate` with `matchMedia`, or emulate via CDP) and confirm the squiggle shows fully drawn with no animation.

- [ ] **Step 5: Commit**

Leave the change unstaged — user commits manually (do not run `git commit`).

---

## Self-review notes
- Spec coverage: color ✓ (Task 1 sidebar, Task 3 stat card + quick actions), type ✓ (Task 1 wordmark, Task 3 heading), layout/active-nav ✓ (Task 1), signature squiggle ✓ (Task 2 + Task 3), non-goals respected (no layout.tsx, no login, no other pages, no `@theme` edits, no new deps).
- No placeholders — every step has literal before/after code.
- Type/name consistency — `.admin-squiggle` class name matches between Task 2 (defined) and Task 3 (consumed); no prop/signature changes anywhere so nothing to drift.
