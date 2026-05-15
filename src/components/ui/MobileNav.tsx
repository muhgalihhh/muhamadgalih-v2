"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

export default function MobileNav() {
  const pathname = usePathname();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  // Clear loading when navigation completes
  useEffect(() => {
    setLoadingHref(null);
  }, [pathname]);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[200]">
      <div className="relative h-[72px]">
        {/* SVG curved background */}
        <svg
          viewBox="0 0 375 72"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 0 L 110 0 C 130 0, 148 52, 187.5 52 C 227 52, 245 0, 265 0 L 375 0 L 375 72 L 0 72 Z"
            fill="#120E2D"
          />
        </svg>

        {/* Border curve on top */}
        <svg
          viewBox="0 0 375 4"
          className="absolute top-0 left-0 w-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 2 L 110 2 C 130 2, 148 54, 187.5 54 C 227 54, 245 2, 265 2 L 375 2"
            fill="none"
            stroke="#0D0B1E"
            strokeWidth="2"
          />
        </svg>

        {/* Center button — theme toggle above the notch */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[38px] z-10">
          <div className="scale-110">
            <ThemeToggle />
          </div>
        </div>

        {/* Nav icons */}
        <div className="relative h-full flex items-end pb-3 px-4 z-10">
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
          {/* Center spacer */}
          <div className="w-16 shrink-0" />
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

      {/* Safe area spacer for iPhone home indicator */}
      <div className="bg-navy" style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
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
    <motion.div whileTap={{ scale: 0.78 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
      <Link
        href={item.href}
        onClick={onClick}
        className={`flex flex-col items-center gap-0.5 transition-colors ${
          active ? "text-coral" : loading ? "text-yellow" : "text-cream/50"
        }`}
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <item.Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
        )}
        <span className="text-[9px] font-body font-medium">
          {loading ? "..." : item.label}
        </span>
      </Link>
    </motion.div>
  );
}
