"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { signOut } from "@/app/actions/admin";
import {
  LayoutDashboard,
  Wrench,
  Briefcase,
  FolderOpen,
  Award,
  Mail,
  LogOut,
  ExternalLink,
  Images,
  MessageSquareQuote,
  Inbox,
} from "lucide-react";

const nav = [
  { label: "Overview",      href: "/admin",               icon: LayoutDashboard },
  { label: "Skills",        href: "/admin/skills",        icon: Wrench },
  { label: "Experience",    href: "/admin/experience",    icon: Briefcase },
  { label: "Works",         href: "/admin/works",         icon: FolderOpen },
  { label: "Gallery",       href: "/admin/gallery",       icon: Images },
  { label: "Certificates",  href: "/admin/certificates",  icon: Award },
  { label: "Testimonials",  href: "/admin/testimonials",  icon: MessageSquareQuote },
  { label: "Messages",      href: "/admin/messages",      icon: Inbox },
  { label: "Contact",       href: "/admin/contact",       icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
      router.push("/admin/login");
    });
  };

  return (
    <aside className="w-56 shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <Link href="/" target="_blank" className="flex items-baseline gap-1 group">
          <span className="font-bold text-xl text-white group-hover:text-indigo-400 transition-colors">MG</span>
          <span className="text-slate-500 text-sm">/ CMS</span>
        </Link>
        <p className="text-slate-600 text-[10px] mt-0.5">Portfolio Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {nav.map((item) => {
          const active = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
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
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-slate-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mb-1"
        >
          <ExternalLink size={15} className="shrink-0" />
          View Site
        </Link>
        <button
          onClick={handleSignOut}
          disabled={isPending}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
        >
          <LogOut size={15} className="shrink-0" />
          {isPending ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
