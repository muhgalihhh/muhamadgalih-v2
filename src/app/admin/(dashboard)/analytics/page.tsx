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
        <div className="flex gap-2 h-40">
          {summary.dailySeries.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
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
