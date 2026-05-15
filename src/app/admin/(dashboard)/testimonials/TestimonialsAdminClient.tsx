"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Check, Trash2, Star, Clock, Loader2 } from "lucide-react";
import { approveTestimonial, rejectTestimonial } from "@/app/actions/testimonials";
import type { Testimonial } from "@/types/portfolio";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={12}
          className={n <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}
        />
      ))}
    </div>
  );
}

export default function TestimonialsAdminClient({ testimonials: initial }: { testimonials: Testimonial[] }) {
  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const filtered = items.filter((t) =>
    filter === "all" ? true : filter === "pending" ? !t.approved : t.approved
  );

  const handleApprove = (id: string) => {
    setLoadingId(id);
    startTransition(async () => {
      await approveTestimonial(id);
      setItems((prev) => prev.map((t) => t.id === id ? { ...t, approved: true } : t));
      setLoadingId(null);
    });
  };

  const handleReject = (id: string) => {
    if (!confirm("Delete this testimonial? This cannot be undone.")) return;
    setLoadingId(id);
    startTransition(async () => {
      await rejectTestimonial(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
      setLoadingId(null);
    });
  };

  const pendingCount = items.filter((t) => !t.approved).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
          {pendingCount > 0 && (
            <p className="text-sm text-amber-600 font-medium mt-1">
              {pendingCount} pending review
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          No testimonials found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-xl border p-5 flex flex-col gap-3 ${
                t.approved ? "border-slate-200" : "border-amber-300 bg-amber-50/30"
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                {t.author_avatar ? (
                  <Image
                    src={t.author_avatar}
                    alt={t.author_name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm">
                    {t.author_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{t.author_name}</p>
                  {(t.author_role || t.author_company) && (
                    <p className="text-slate-400 text-xs truncate">
                      {[t.author_role, t.author_company].filter(Boolean).join(" @ ")}
                    </p>
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    t.approved
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700 flex items-center gap-1"
                  }`}
                >
                  {!t.approved && <Clock size={9} />}
                  {t.approved ? "Live" : "Pending"}
                </span>
              </div>

              <StarDisplay rating={t.rating} />

              <p className="text-slate-700 text-sm leading-relaxed flex-1 line-clamp-4">
                &ldquo;{t.content}&rdquo;
              </p>

              <p className="text-slate-400 text-[10px]">
                {new Date(t.created_at).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </p>

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t border-slate-100">
                {!t.approved && (
                  <button
                    onClick={() => handleApprove(t.id)}
                    disabled={loadingId === t.id || pending}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loadingId === t.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Check size={12} />
                    )}
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleReject(t.id)}
                  disabled={loadingId === t.id || pending}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
