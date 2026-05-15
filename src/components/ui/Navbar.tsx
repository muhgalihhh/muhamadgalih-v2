"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Works", href: "/works" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-[100] hidden md:flex items-center justify-between px-10 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-md border-b-2 border-ink"
          : "bg-transparent"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-baseline gap-1.5 group">
        <span className="font-display font-extrabold text-2xl text-coral group-hover:scale-105 transition-transform inline-block">
          MG
        </span>
        <span className="font-display font-semibold text-base text-muted">
          / MIZARIE
        </span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-body font-medium text-ink hover:text-coral transition-colors relative group"
          >
            {link.label}
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-coral rounded-full transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>

      {/* Right side: theme toggle + CTA */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/contact"
          className="cartoon-border bg-coral text-cream font-body font-semibold px-5 py-2 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-transform"
        >
          Hire Me ✦
        </Link>
      </div>
    </motion.nav>
  );
}
