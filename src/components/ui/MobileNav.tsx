"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, FolderOpen, Mail, Loader2 } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navItems = [
  { label: "Home",    href: "/",        Icon: Home },
  { label: "About",   href: "/about",   Icon: User },
  { label: "Works",   href: "/works",   Icon: FolderOpen },
  { label: "Contact", href: "/contact", Icon: Mail },
];

// Navy background color — matches the SVG fill
const NAV_BG = "#120E2D";

export default function MobileNav() {
  const pathname = usePathname();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  useEffect(() => {
    setLoadingHref(null);
  }, [pathname]);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[200]">
      <div className="relative h-[72px]">

        {/* ── Curved SVG background ── */}
        <svg
          viewBox="0 0 375 72"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow / border layer */}
          <path
            d="M 0 1 L 108 1 C 129 1, 147 55, 187.5 55 C 228 55, 246 1, 267 1 L 375 1"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1.5"
          />
          {/* Main fill */}
          <path
            d="M 0 0 L 108 0 C 129 0, 147 52, 187.5 52 C 228 52, 246 0, 267 0 L 375 0 L 375 72 L 0 72 Z"
            fill={NAV_BG}
          />
        </svg>

        {/* ── Center toggle button — sits in the notch ── */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[36px] z-20">
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-full blur-md opacity-40 pointer-events-none"
            style={{ backgroundColor: "#a78bfa", transform: "scale(1.5)" }}
          />
          <motion.div
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="relative"
          >
            <ThemeToggle />
          </motion.div>
        </div>

        {/* ── Nav icons ── */}
        <div className="relative h-full flex items-end pb-2.5 px-2 z-10">
          {/* Left pair */}
          <div className="flex flex-1 justify-around">
            {navItems.slice(0, 2).map((item) => (
              <NavIcon
                key={item.href}
                item={item}
                active={pathname === item.href}
                loading={loadingHref === item.href}
                onClick={() => { if (pathname !== item.href) setLoadingHref(item.href); }}
              />
            ))}
          </div>
          {/* Center spacer for the notch button */}
          <div className="w-[72px] shrink-0 pointer-events-none" />
          {/* Right pair */}
          <div className="flex flex-1 justify-around">
            {navItems.slice(2).map((item) => (
              <NavIcon
                key={item.href}
                item={item}
                active={pathname === item.href}
                loading={loadingHref === item.href}
                onClick={() => { if (pathname !== item.href) setLoadingHref(item.href); }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Safe-area spacer for iPhone home indicator */}
      <div style={{ backgroundColor: NAV_BG, height: "env(safe-area-inset-bottom, 0px)" }} />
    </div>
  );
}

function NavIcon({
  item,
  active,
  loading,
  onClick,
}: {
  item: (typeof navItems)[number];
  active: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.72 }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
    >
      <Link
        href={item.href}
        onClick={onClick}
        className="flex flex-col items-center gap-0.5 relative"
      >
        {/* Active indicator dot */}
        <AnimatePresence>
          {active && (
            <motion.span
              key="dot"
              layoutId="nav-dot"
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-coral"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            />
          )}
        </AnimatePresence>

        {/* Icon */}
        <div className={`relative transition-colors ${
          active ? "text-coral" : loading ? "text-violet/80" : "text-cream/40"
        }`}>
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <item.Icon
              size={20}
              strokeWidth={active ? 2.5 : 1.6}
            />
          )}
        </div>

        {/* Label */}
        <span className={`text-[9px] font-body font-semibold tracking-wide transition-colors ${
          active ? "text-coral" : loading ? "text-violet/80" : "text-cream/30"
        }`}>
          {loading ? "···" : item.label}
        </span>
      </Link>
    </motion.div>
  );
}
