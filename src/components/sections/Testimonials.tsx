"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, LogIn, Loader2, CheckCircle, MessageSquareQuote, X, LogOut, User as UserIcon, Pencil, AlertTriangle } from "lucide-react";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { submitTestimonial } from "@/app/actions/testimonials";
import ScrollReveal from "@/components/animations/ScrollReveal";
import AnimatedText from "@/components/animations/AnimatedText";
import type { Testimonial } from "@/types/portfolio";

function Avatar({
  src,
  name,
  size = 36,
  bordered = true,
}: {
  src?: string | null;
  name: string;
  size?: number;
  bordered?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  const showPlaceholder = !src || errored;
  const borderClass = bordered ? "cartoon-border-sm" : "";

  if (showPlaceholder) {
    return (
      <div
        className={`rounded-full bg-violet/20 ${borderClass} flex items-center justify-center text-violet shrink-0`}
        style={{ width: size, height: size }}
        aria-label={name}
      >
        <UserIcon size={Math.round(size * 0.55)} strokeWidth={2.2} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className={`rounded-full object-cover ${borderClass} shrink-0`}
      onError={() => setErrored(true)}
      unoptimized
    />
  );
}

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
        <Avatar src={t.author_avatar} name={t.author_name} size={36} />
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
  const router = useRouter();
  const [modalState, setModalState] = useState<ModalState>(ownTestimonial ? "pending" : "closed");
  const [rating, setRating] = useState(ownTestimonial?.rating ?? 5);
  const [signingIn, setSigningIn] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isEditing = Boolean(ownTestimonial);

  // Check auth state on mount + auto-open form if returning from OAuth
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
      if (user && !ownTestimonial) {
        const params = new URLSearchParams(window.location.search);
        if (params.get("testimonial") === "open") {
          setModalState("form");
          document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" });
          // Clean up the URL param
          const url = new URL(window.location.href);
          url.searchParams.delete("testimonial");
          window.history.replaceState({}, "", url.toString());
        }
      }
    });
  }, [ownTestimonial]);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    const supabase = createClient();
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${base}/auth/callback?next=/?testimonial=open`,
      },
    });
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setCurrentUser(null);
    setModalState("closed");
  };

  const handleAddClick = () => {
    if (ownTestimonial) { setModalState("pending"); return; }
    setModalState("form");
  };

  const handleEditClick = () => {
    if (ownTestimonial) setRating(ownTestimonial.rating);
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
        router.refresh();
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
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={handleAddClick}
                className="cartoon-border bg-violet text-cream font-body font-semibold px-5 py-3 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform flex items-center gap-2 shrink-0"
              >
                {currentUser ? (
                  <Avatar
                    src={currentUser.user_metadata?.avatar_url}
                    name={currentUser.user_metadata?.full_name ?? ""}
                    size={20}
                    bordered={false}
                  />
                ) : (
                  <MessageSquareQuote size={16} />
                )}
                {ownTestimonial ? "Your testimonial" : "Leave a testimonial"}
              </button>
              {/* Signed-in indicator */}
              {currentUser && (
                <div className="flex items-center gap-2">
                  <span className="font-body text-xs text-muted">
                    Signed in as <span className="font-semibold text-ink">{currentUser.user_metadata?.full_name ?? currentUser.email}</span>
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="font-body text-xs text-muted hover:text-coral transition-colors flex items-center gap-1"
                  >
                    <LogOut size={11} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
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
                  <h3 className="font-display font-extrabold text-ink text-2xl mb-2">
                    {isEditing ? "Saved!" : "Thank you!"}
                  </h3>
                  <p className="font-body text-muted text-sm">
                    {isEditing
                      ? "Your changes have been saved and will be reviewed before going live again."
                      : "Your testimonial has been submitted and is pending review. I appreciate it!"}
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
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={handleEditClick}
                      className="cartoon-border bg-violet text-cream font-body font-semibold px-5 py-2.5 rounded-full hover:-translate-y-0.5 transition-transform inline-flex items-center gap-2"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => setModalState("closed")}
                      className="cartoon-border bg-ink text-cream font-body font-semibold px-5 py-2.5 rounded-full hover:-translate-y-0.5 transition-transform"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* — Form state — */}
              {modalState === "form" && (
                <>
                  <h3 className="font-display font-extrabold text-ink text-xl mb-1">
                    {isEditing ? "Edit your testimonial ✦" : "Leave a testimonial ✦"}
                  </h3>
                  <p className="font-body text-muted text-xs mb-5">
                    {isEditing
                      ? "Update your testimonial below. Submitting will re-send it for review."
                      : "Sign in with Google to submit. Your name & photo will come from your Google account."}
                  </p>

                  {isEditing && ownTestimonial?.approved && (
                    <div className="cartoon-border-sm bg-yellow/30 rounded-xl p-3 mb-5 flex items-start gap-2">
                      <AlertTriangle size={14} className="text-ink mt-0.5 shrink-0" />
                      <p className="font-body text-xs text-ink leading-relaxed">
                        Your testimonial is currently live. Editing it will hide it until I review the changes.
                      </p>
                    </div>
                  )}

                  {/* Google sign-in / signed-in indicator */}
                  {currentUser ? (
                    <div className="cartoon-border-sm bg-mint/30 rounded-xl p-4 flex items-center gap-3 mb-5">
                      <Avatar
                        src={currentUser.user_metadata?.avatar_url}
                        name={currentUser.user_metadata?.full_name ?? ""}
                        size={36}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-ink text-sm truncate">
                          {currentUser.user_metadata?.full_name ?? currentUser.email}
                        </p>
                        <p className="font-body text-xs text-mint-dark flex items-center gap-1">
                          <CheckCircle size={11} className="text-green-600" />
                          <span className="text-green-700">Signed in with Google</span>
                        </p>
                      </div>
                    </div>
                  ) : (
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
                  )}

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
                          defaultValue={ownTestimonial?.author_role ?? ""}
                          placeholder="e.g. CTO"
                          className="cartoon-border-sm rounded-xl px-3 py-2.5 font-body text-sm text-ink bg-cream outline-none focus:ring-2 focus:ring-violet/40 placeholder:text-muted/50"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body font-semibold text-ink text-sm">Company</label>
                        <input
                          name="author_company"
                          defaultValue={ownTestimonial?.author_company ?? ""}
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
                        defaultValue={ownTestimonial?.content ?? ""}
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
                      {isEditing
                        ? "After saving, your testimonial will be re-reviewed before going live."
                        : "After submitting, your testimonial will be reviewed before going live."}
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => setModalState("pending")}
                          className="cartoon-border bg-cream text-ink font-body font-semibold px-5 py-3 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                        >
                          Cancel
                        </button>
                      )}
                      <motion.button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 cartoon-border bg-violet text-cream font-body font-semibold px-6 py-3 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
                        whileTap={{ scale: 0.96 }}
                      >
                        {isPending ? (
                          <><Loader2 size={14} className="animate-spin" /> {isEditing ? "Saving..." : "Submitting..."}</>
                        ) : isEditing ? (
                          <><Pencil size={14} /> Save changes</>
                        ) : (
                          <><MessageSquareQuote size={14} /> Submit testimonial</>
                        )}
                      </motion.button>
                    </div>
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
