import { SiGithub, SiDribbble, SiInstagram, SiWhatsapp } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import type { Profile } from "@/types/portfolio";
import { toWhatsAppUrl } from "@/lib/whatsapp";

const staticSocials = [
  { label: "GitHub",    href: "https://github.com/muhgalihhh", color: "bg-navy text-cream",   Icon: SiGithub    },
  { label: "Dribbble",  href: "#",                              color: "bg-pink text-ink",     Icon: SiDribbble  },
  { label: "LinkedIn",  href: "#",                              color: "bg-sky text-ink",      Icon: FaLinkedin  },
  { label: "Instagram", href: "#",                              color: "bg-coral text-cream",  Icon: SiInstagram },
];

export function getSocials(profile: Profile | null) {
  if (!profile) return staticSocials;
  return [
    { label: "GitHub",    href: profile.github_url    || "#", color: "bg-navy text-cream",  Icon: SiGithub    },
    { label: "Dribbble",  href: profile.dribbble_url  || "#", color: "bg-pink text-ink",     Icon: SiDribbble  },
    { label: "LinkedIn",  href: profile.linkedin_url  || "#", color: "bg-sky text-ink",      Icon: FaLinkedin  },
    { label: "Instagram", href: profile.instagram_url || "#", color: "bg-coral text-cream",  Icon: SiInstagram },
    { label: "WhatsApp",  href: toWhatsAppUrl(profile.phone) || "#", color: "bg-mint text-ink", Icon: SiWhatsapp },
  ].filter((s) => s.href !== "#");
}
