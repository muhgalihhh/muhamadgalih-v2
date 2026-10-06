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
  const totalDaily = summary.dailySeries.reduce((sum, d) => sum + d.count, 0);

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
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h2 className="font-semibold text-slate-900">Daily Pageviews (14 days)</h2>
          {/* The key numbers stay readable without hovering */}
          <p className="text-xs text-slate-500">
            Total <span className="font-semibold text-slate-900">{totalDaily.toLocaleString("en-US")}</span>
            <span className="mx-2 text-slate-300">·</span>
            Peak <span className="font-semibold text-slate-900">{maxDaily.toLocaleString("en-US")}</span>
          </p>
        </div>
        {/* pt-10 leaves room for the tooltip above the tallest bar */}
        <div className="flex gap-2 h-48 pt-10">
          {summary.dailySeries.map((d) => {
            const pct = (d.count / maxDaily) * 100;
            const day = new Date(`${d.date}T00:00:00Z`).toLocaleDateString("en-GB", {
              weekday: "short", day: "numeric", month: "short", timeZone: "UTC",
            });
            return (
              // The whole column is the hover/focus target, so even a 2px bar is easy to hit.
              <div
                key={d.date}
                tabIndex={0}
                aria-label={`${day}: ${d.count} ${d.count === 1 ? "pageview" : "pageviews"}`}
                className="group flex-1 flex flex-col items-center justify-end h-full gap-1.5 outline-none cursor-default"
              >
                <div className="relative w-full flex-1 flex items-end">
                  <div
                    className="w-full bg-violet/70 group-hover:bg-violet group-focus-visible:bg-violet rounded-t-md min-h-[2px] transition-colors"
                    style={{ height: `${pct}%` }}
                  />
                  <div
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 mb-2 z-10 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-center shadow-lg opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                    style={{ bottom: `${pct}%` }}
                  >
                    <p className="text-sm font-semibold text-white leading-none">{d.count.toLocaleString("en-US")}</p>
                    <p className="text-[10px] text-slate-300 mt-1 leading-none">{day}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-700 group-focus-visible:text-slate-700">
                  {d.date.slice(8, 10)}
                </span>
              </div>
            );
          })}
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
