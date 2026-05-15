"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, LogIn, Loader2, CheckCircle, MessageSquareQuote, X } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { submitTestimonial } from "@/app/actions/testimonials";
import ScrollReveal from "@/components/animations/ScrollReveal";
import AnimatedText from "@/components/animations/AnimatedText";
import type { Testimonial } from "@/types/portfolio";

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHovered(n)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={20}
            className={`transition-colors ${
              n <= (hovered || value) ? "text-yellow fill-yellow" : "text-ink/20"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="cartoon-border bg-cream rounded-2xl p-6 flex flex-col gap-4 h-full"
    >
      <StarRating value={t.rating} />
      <p className="font-body text-ink/80 text-sm leading-relaxed flex-1">
        &ldquo;{t.content}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-2 border-t-2 border-ink/10">
        {t.author_avatar ? (
          <Image
            src={t.author_avatar}
            alt={t.author_name}
            width={36}
            height={36}
            className="rounded-full object-cover cartoon-border-sm"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-violet/20 cartoon-border-sm flex items-center justify-center font-display font-bold text-violet text-sm">
            {t.author_name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-body font-semibold text-ink text-sm">{t.author_name}</p>
          {(t.author_role || t.author_company) && (
            <p className="font-body text-muted text-xs">
              {[t.author_role, t.author_company].filter(Boolean).join(" @ ")}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

type ModalState = "closed" | "form" | "success" | "pending";

export default function TestimonialsSection({
  testimonials,
  ownTestimonial,
}: {
  testimonials: Testimonial[];
  ownTestimonial: Testimonial | null;
}) {
  const [modalState, setModalState] = useState<ModalState>(ownTestimonial ? "pending" : "closed");
  const [rating, setRating] = useState(5);
  const [signingIn, setSigningIn] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/#testimonials`,
      },
    });
  };

  const handleAddClick = () => {
    if (ownTestimonial) { setModalState("pending"); return; }
    setModalState("form");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    const fd = new FormData(e.currentTarget);
    fd.set("rating", String(rating));
    startTransition(async () => {
      const res = await submitTestimonial(fd);
      if (res.ok) {
        setModalState("success");
      } else {
        setErrorMsg(res.error ?? "Something went wrong.");
      }
    });
  };

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-violet/10 relative overflow-hidden">
      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="w-full h-full grid-pattern-lines" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <AnimatedText
              text="WHAT PEOPLE SAY ✦"
              className="font-display font-extrabold text-ink text-[clamp(1.6rem,4.5vw,3.5rem)] leading-tight mb-3"
              staggerDelay={0.03}
            />
            <ScrollReveal variant="fade-up" delay={0.2}>
              <p className="font-body text-muted text-base max-w-md">
                Kind words from collaborators and clients I&apos;ve had the pleasure of working with.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal variant="fade-left" delay={0.25}>
            <button
              onClick={handleAddClick}
              className="cartoon-border bg-violet text-cream font-body font-semibold px-5 py-3 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform flex items-center gap-2 shrink-0"
            >
              <MessageSquareQuote size={16} />
              {ownTestimonial ? "Your testimonial" : "Leave a testimonial"}
            </button>
          </ScrollReveal>
        </div>

        {/* Grid */}
        {testimonials.length === 0 ? (
          <ScrollReveal variant="fade-up">
            <div className="text-center py-16 text-muted font-body">
              No testimonials yet — be the first! ✦
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalState !== "closed" && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-ink/50 backdrop-blur-sm flex items-end md:items-center justify-center md:p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setModalState("closed"); }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="cartoon-border bg-cream w-full md:max-w-md rounded-t-3xl md:rounded-2xl relative overflow-y-auto max-h-[85vh]"
              style={{ colorScheme: "light" }}
            >
              {/* Drag handle — mobile only */}
              <div className="flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-10 h-1 rounded-full bg-ink/20" />
              </div>

              <div className="p-6 md:p-8">
              <button
                onClick={() => setModalState("closed")}
                className="absolute top-4 right-4 text-muted hover:text-ink transition-colors"
              >
                <X size={18} />
              </button>

              {/* — Success state — */}
              {modalState === "success" && (
                <div className="text-center py-4">
                  <CheckCircle size={52} className="mx-auto mb-4 text-mint" strokeWidth={1.5} />
                  <h3 className="font-display font-extrabold text-ink text-2xl mb-2">Thank you!</h3>
                  <p className="font-body text-muted text-sm">
                    Your testimonial has been submitted and is pending review. I appreciate it!
                  </p>
                  <button
                    onClick={() => setModalState("closed")}
                    className="mt-6 cartoon-border bg-ink text-cream font-body font-semibold px-6 py-2.5 rounded-full hover:-translate-y-0.5 transition-transform"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* — Pending state (already submitted) — */}
              {modalState === "pending" && ownTestimonial && (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-yellow/30 cartoon-border-sm flex items-center justify-center mx-auto mb-4">
                    <MessageSquareQuote size={22} className="text-ink" />
                  </div>
                  <h3 className="font-display font-extrabold text-ink text-xl mb-2">Your testimonial</h3>
                  <p className="font-body text-muted text-xs mb-4">
                    {ownTestimonial.approved
                      ? "Your testimonial is live ✦"
                      : "Pending review — will appear once approved."}
                  </p>
                  <div className="cartoon-border-sm bg-ink/5 rounded-xl p-4 text-left mb-4">
                    <StarRating value={ownTestimonial.rating} />
                    <p className="font-body text-ink text-sm mt-2 leading-relaxed">
                      &ldquo;{ownTestimonial.content}&rdquo;
                    </p>
                  </div>
                  <button
                    onClick={() => setModalState("closed")}
                    className="cartoon-border bg-ink text-cream font-body font-semibold px-6 py-2.5 rounded-full hover:-translate-y-0.5 transition-transform"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* — Form state — */}
              {modalState === "form" && (
                <>
                  <h3 className="font-display font-extrabold text-ink text-xl mb-1">
                    Leave a testimonial ✦
                  </h3>
                  <p className="font-body text-muted text-xs mb-5">
                    Sign in with Google to submit. Your name & photo will come from your Google account.
                  </p>

                  {/* Google sign-in prompt at top */}
                  <div className="cartoon-border-sm bg-ink/5 rounded-xl p-4 flex items-center justify-between mb-5">
                    <span className="font-body text-sm text-ink/70">Sign in to verify identity</span>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={signingIn}
                      className="cartoon-border bg-navy text-cream font-body font-semibold text-xs px-4 py-2 rounded-full hover:-translate-y-0.5 transition-transform flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {signingIn ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <LogIn size={12} />
                      )}
                      {signingIn ? "Redirecting..." : "Continue with Google"}
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Rating */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body font-semibold text-ink text-sm">Rating</label>
                      <StarRating value={rating} onChange={setRating} />
                    </div>

                    {/* Role + Company */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body font-semibold text-ink text-sm">Your role</label>
                        <input
                          name="author_role"
                          placeholder="e.g. CTO"
                          className="cartoon-border-sm rounded-xl px-3 py-2.5 font-body text-sm text-ink bg-cream outline-none focus:ring-2 focus:ring-violet/40 placeholder:text-muted/50"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body font-semibold text-ink text-sm">Company</label>
                        <input
                          name="author_company"
                          placeholder="e.g. Acme Inc."
                          className="cartoon-border-sm rounded-xl px-3 py-2.5 font-body text-sm text-ink bg-cream outline-none focus:ring-2 focus:ring-violet/40 placeholder:text-muted/50"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body font-semibold text-ink text-sm">Message <span className="text-coral">*</span></label>
                      <textarea
                        name="content"
                        required
                        rows={4}
                        placeholder="Share your experience working with Galih..."
                        className="cartoon-border-sm rounded-xl px-3 py-2.5 font-body text-sm text-ink bg-cream outline-none focus:ring-2 focus:ring-violet/40 placeholder:text-muted/50 resize-none"
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-sm font-body text-red-600 bg-red-50 cartoon-border-sm rounded-xl px-3 py-2">
                        {errorMsg}
                      </p>
                    )}

                    <p className="font-body text-[11px] text-muted leading-relaxed">
                      After submitting, your testimonial will be reviewed before going live.
                    </p>

                    <motion.button
                      type="submit"
                      disabled={isPending}
                      className="cartoon-border bg-violet text-cream font-body font-semibold px-6 py-3 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
                      whileTap={{ scale: 0.96 }}
                    >
                      {isPending ? (
                        <><Loader2 size={14} className="animate-spin" /> Submitting...</>
                      ) : (
                        <><MessageSquareQuote size={14} /> Submit testimonial</>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
              </div>{/* end inner padding div */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
