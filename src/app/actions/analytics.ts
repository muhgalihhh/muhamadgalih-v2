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
