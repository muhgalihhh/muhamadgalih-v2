import { createClient } from "@/lib/supabase/server";
import { Wrench, Briefcase, FolderOpen, Award, Plus, ExternalLink, LayoutDashboard } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: skillsCount },
    { count: expCount },
    { count: projectsCount },
    { count: certCount },
  ] = await Promise.all([
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("experiences").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("certificates").select("*", { count: "exact", head: true }),
  ]);

  const statCards = [
    {
      label: "Skills",
      count: skillsCount ?? 0,
      href: "/admin/skills",
      icon: Wrench,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      label: "Experience",
      count: expCount ?? 0,
      href: "/admin/experience",
      icon: Briefcase,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "Projects",
      count: projectsCount ?? 0,
      href: "/admin/works",
      icon: FolderOpen,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      label: "Certificates",
      count: certCount ?? 0,
      href: "/admin/certificates",
      icon: Award,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const quickActions = [
    { label: "Add Project",      href: "/admin/works",        icon: Plus },
    { label: "Add Experience",   href: "/admin/experience",   icon: Plus },
    { label: "Add Certificate",  href: "/admin/certificates", icon: Plus },
    { label: "Edit Profile",     href: "/admin/contact",      icon: LayoutDashboard },
    { label: "View Site",        href: "/",                   icon: ExternalLink, target: "_blank" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your portfolio content</p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.label}
              href={card.href}
              className="group rounded-2xl p-6 border border-slate-100 bg-white hover:shadow-md transition-all"
            >
              <div
                className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center mb-4`}
              >
                <Icon size={18} className={card.iconColor} />
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">{card.count}</p>
              <p className="text-sm text-slate-500">{card.label}</p>
            </a>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.label}
                href={action.href}
                target={"target" in action ? action.target : undefined}
                rel={"target" in action ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2 text-sm bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 hover:border-indigo-200 px-4 py-2 rounded-xl transition-all font-medium"
              >
                <Icon size={14} />
                {action.label}
                {"target" in action && <ExternalLink size={11} className="ml-0.5 opacity-60" />}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
