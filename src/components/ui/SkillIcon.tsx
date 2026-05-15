import { ICON_MAP, isRegistryKey } from "@/lib/iconRegistry";

export function isIconUrl(icon: string) {
  return icon.startsWith("http") || icon.startsWith("/") || icon.startsWith("data:");
}

export default function SkillIcon({
  icon,
  className = "w-4 h-4",
}: {
  icon: string;
  className?: string;
}) {
  if (!icon) return null;

  if (isRegistryKey(icon)) {
    const entry = ICON_MAP[icon];
    const Icon = entry.component;
    return <Icon className={className} />;
  }

  if (isIconUrl(icon)) {
    return <img src={icon} alt="" className={`${className} object-contain`} />;
  }

  return <span>{icon}</span>;
}
