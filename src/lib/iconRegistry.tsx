import React from "react";
import type { IconType } from "react-icons";
import {
  // Frontend
  SiReact, SiVuedotjs, SiAngular, SiSvelte, SiNextdotjs, SiNuxt, SiAstro, SiRemix,
  // Languages
  SiJavascript, SiTypescript, SiPython, SiGo, SiRust, SiPhp, SiRuby, SiSwift,
  SiKotlin, SiCplusplus, SiC, SiDart, SiElixir,
  // Web
  SiHtml5, SiCss, SiSass, SiTailwindcss, SiBootstrap,
  // Backend / Runtime
  SiNodedotjs, SiDeno, SiBun, SiExpress, SiDjango, SiFastapi, SiLaravel,
  SiRubyonrails, SiSpring, SiFlask,
  // Database / ORM
  SiPostgresql, SiMysql, SiMongodb, SiRedis, SiSqlite, SiSupabase, SiPrisma, SiDrizzle,
  // Cloud / Infra
  SiGooglecloud, SiVercel, SiNetlify, SiCloudflare, SiDocker, SiKubernetes,
  SiTerraform, SiDigitalocean, SiHeroku, SiHetzner, SiNginx,
  // Git & Dev tools
  SiGit, SiGithub, SiGitlab, SiBitbucket,
  // Design tools
  SiFigma, SiSketch, SiFramer, SiBlender,
  // Editors
  SiVscodium, SiJetbrains, SiIntellijidea, SiWebstorm, SiVim, SiNeovim,
  // OS
  SiLinux, SiUbuntu, SiDebian, SiMacos, SiApple,
  // API / AI
  SiGraphql, SiApollographql, SiFirebase, SiOpenai, SiHuggingface,
  // Mobile
  SiFlutter, SiAndroid, SiIos,
  // Build / Test
  SiVite, SiWebpack, SiRollupdotjs, SiBabel, SiEslint,
  SiJest, SiVitest, SiCypress, SiStorybook,
  // Misc tech
  SiThreedotjs, SiElectron, SiTauri, SiStripe, SiPlanetscale,
  // Social media
  SiX, SiInstagram, SiFacebook, SiYoutube, SiTiktok, SiSpotify,
  SiDiscord, SiTelegram, SiWhatsapp, SiReddit,
  // Productivity / PM
  SiNotion, SiJira, SiConfluence, SiZoom, SiSlack, SiMiro,
  SiTrello, SiAsana, SiLinear, SiAirtable, SiZapier,
  // Companies / Platforms
  SiGoogle, SiMeta, SiNetflix, SiShopify, SiWordpress, SiMedium,
  SiGmail, SiGoogleanalytics, SiGooglemaps, SiGoogledrive,
  SiGooglesheets, SiGoogledocs, SiDropbox, SiIcloud,
  // Marketing / Communication
  SiMailchimp, SiSendgrid, SiTwilio,
  // CMS
  SiStrapi, SiContentful, SiSanity,
  // Monitoring / DevOps
  SiSentry, SiDatadog, SiGrafana, SiElasticsearch, SiRabbitmq, SiPagerduty,
} from "react-icons/si";

import {
  Briefcase, Building, Building2, Users, User, UserCheck,
  Code, Code2, Cpu, Database, Globe, Laptop, Monitor, Server,
  Smartphone, Terminal, Wifi,
  Palette, Pen, PenTool, Camera, Image, Music, Video,
  Star, Zap, Shield, Award, Heart, Sparkles, Coffee, BookOpen,
  Rocket, Lightbulb, Layout, LayoutGrid, Package, Layers,
  Command, Settings, Wrench, Hammer, Brush, Pencil,
  School, GraduationCap, MapPin, Home, Store,
} from "lucide-react";

type AnyIcon = IconType | React.ComponentType<{ className?: string; size?: number | string }>;

export interface IconEntry {
  key: string;
  label: string;
  component: AnyIcon;
}

export const ICON_REGISTRY: IconEntry[] = [
  // ── Frontend frameworks ──────────────────────────────────────────
  { key: "SiReact",        label: "React",           component: SiReact },
  { key: "SiVuedotjs",     label: "Vue.js",          component: SiVuedotjs },
  { key: "SiAngular",      label: "Angular",         component: SiAngular },
  { key: "SiSvelte",       label: "Svelte",          component: SiSvelte },
  { key: "SiNextdotjs",    label: "Next.js",         component: SiNextdotjs },
  { key: "SiNuxt",         label: "Nuxt.js",         component: SiNuxt },
  { key: "SiAstro",        label: "Astro",           component: SiAstro },
  { key: "SiRemix",        label: "Remix",           component: SiRemix },

  // ── Languages ────────────────────────────────────────────────────
  { key: "SiJavascript",   label: "JavaScript",      component: SiJavascript },
  { key: "SiTypescript",   label: "TypeScript",      component: SiTypescript },
  { key: "SiPython",       label: "Python",          component: SiPython },
  { key: "SiGo",           label: "Go",              component: SiGo },
  { key: "SiRust",         label: "Rust",            component: SiRust },
  { key: "SiPhp",          label: "PHP",             component: SiPhp },
  { key: "SiRuby",         label: "Ruby",            component: SiRuby },
  { key: "SiSwift",        label: "Swift",           component: SiSwift },
  { key: "SiKotlin",       label: "Kotlin",          component: SiKotlin },
  { key: "SiCplusplus",    label: "C++",             component: SiCplusplus },
  { key: "SiC",            label: "C",               component: SiC },
  { key: "SiDart",         label: "Dart",            component: SiDart },
  { key: "SiElixir",       label: "Elixir",          component: SiElixir },

  // ── Web / Styling ────────────────────────────────────────────────
  { key: "SiHtml5",        label: "HTML5",           component: SiHtml5 },
  { key: "SiCss",          label: "CSS3",            component: SiCss },
  { key: "SiSass",         label: "Sass",            component: SiSass },
  { key: "SiTailwindcss",  label: "Tailwind CSS",    component: SiTailwindcss },
  { key: "SiBootstrap",    label: "Bootstrap",       component: SiBootstrap },

  // ── Backend / Runtime ────────────────────────────────────────────
  { key: "SiNodedotjs",    label: "Node.js",         component: SiNodedotjs },
  { key: "SiDeno",         label: "Deno",            component: SiDeno },
  { key: "SiBun",          label: "Bun",             component: SiBun },
  { key: "SiExpress",      label: "Express",         component: SiExpress },
  { key: "SiDjango",       label: "Django",          component: SiDjango },
  { key: "SiFastapi",      label: "FastAPI",         component: SiFastapi },
  { key: "SiLaravel",      label: "Laravel",         component: SiLaravel },
  { key: "SiRubyonrails",  label: "Rails",           component: SiRubyonrails },
  { key: "SiSpring",       label: "Spring",          component: SiSpring },
  { key: "SiFlask",        label: "Flask",           component: SiFlask },

  // ── Database / ORM ───────────────────────────────────────────────
  { key: "SiPostgresql",   label: "PostgreSQL",      component: SiPostgresql },
  { key: "SiMysql",        label: "MySQL",           component: SiMysql },
  { key: "SiMongodb",      label: "MongoDB",         component: SiMongodb },
  { key: "SiRedis",        label: "Redis",           component: SiRedis },
  { key: "SiSqlite",       label: "SQLite",          component: SiSqlite },
  { key: "SiSupabase",     label: "Supabase",        component: SiSupabase },
  { key: "SiPrisma",       label: "Prisma",          component: SiPrisma },
  { key: "SiDrizzle",      label: "Drizzle",         component: SiDrizzle },

  // ── Cloud / Infra ────────────────────────────────────────────────
  { key: "SiGooglecloud",  label: "Google Cloud",    component: SiGooglecloud },
  { key: "SiVercel",       label: "Vercel",          component: SiVercel },
  { key: "SiNetlify",      label: "Netlify",         component: SiNetlify },
  { key: "SiCloudflare",   label: "Cloudflare",      component: SiCloudflare },
  { key: "SiDocker",       label: "Docker",          component: SiDocker },
  { key: "SiKubernetes",   label: "Kubernetes",      component: SiKubernetes },
  { key: "SiTerraform",    label: "Terraform",       component: SiTerraform },
  { key: "SiDigitalocean", label: "DigitalOcean",    component: SiDigitalocean },
  { key: "SiHeroku",       label: "Heroku",          component: SiHeroku },
  { key: "SiHetzner",      label: "Hetzner",         component: SiHetzner },
  { key: "SiNginx",        label: "Nginx",           component: SiNginx },

  // ── Git & Dev tools ──────────────────────────────────────────────
  { key: "SiGit",          label: "Git",             component: SiGit },
  { key: "SiGithub",       label: "GitHub",          component: SiGithub },
  { key: "SiGitlab",       label: "GitLab",          component: SiGitlab },
  { key: "SiBitbucket",    label: "Bitbucket",       component: SiBitbucket },

  // ── Design tools ─────────────────────────────────────────────────
  { key: "SiFigma",        label: "Figma",           component: SiFigma },
  { key: "SiSketch",       label: "Sketch",          component: SiSketch },
  { key: "SiFramer",       label: "Framer",          component: SiFramer },
  { key: "SiBlender",      label: "Blender",         component: SiBlender },

  // ── Editors / OS ─────────────────────────────────────────────────
  { key: "SiVscodium",     label: "VS Code",         component: SiVscodium },
  { key: "SiJetbrains",    label: "JetBrains",       component: SiJetbrains },
  { key: "SiIntellijidea", label: "IntelliJ IDEA",   component: SiIntellijidea },
  { key: "SiWebstorm",     label: "WebStorm",        component: SiWebstorm },
  { key: "SiVim",          label: "Vim",             component: SiVim },
  { key: "SiNeovim",       label: "Neovim",          component: SiNeovim },
  { key: "SiLinux",        label: "Linux",           component: SiLinux },
  { key: "SiUbuntu",       label: "Ubuntu",          component: SiUbuntu },
  { key: "SiDebian",       label: "Debian",          component: SiDebian },
  { key: "SiMacos",        label: "macOS",           component: SiMacos },
  { key: "SiApple",        label: "Apple",           component: SiApple },

  // ── API / AI / Misc backend ──────────────────────────────────────
  { key: "SiGraphql",      label: "GraphQL",         component: SiGraphql },
  { key: "SiApollographql",label: "Apollo",          component: SiApollographql },
  { key: "SiFirebase",     label: "Firebase",        component: SiFirebase },
  { key: "SiOpenai",       label: "OpenAI",          component: SiOpenai },
  { key: "SiHuggingface",  label: "Hugging Face",    component: SiHuggingface },

  // ── Mobile ───────────────────────────────────────────────────────
  { key: "SiFlutter",      label: "Flutter",         component: SiFlutter },
  { key: "SiAndroid",      label: "Android",         component: SiAndroid },
  { key: "SiIos",          label: "iOS",             component: SiIos },

  // ── Build / Test ─────────────────────────────────────────────────
  { key: "SiVite",         label: "Vite",            component: SiVite },
  { key: "SiWebpack",      label: "Webpack",         component: SiWebpack },
  { key: "SiRollupdotjs",  label: "Rollup",          component: SiRollupdotjs },
  { key: "SiBabel",        label: "Babel",           component: SiBabel },
  { key: "SiEslint",       label: "ESLint",          component: SiEslint },
  { key: "SiJest",         label: "Jest",            component: SiJest },
  { key: "SiVitest",       label: "Vitest",          component: SiVitest },
  { key: "SiCypress",      label: "Cypress",         component: SiCypress },
  { key: "SiStorybook",    label: "Storybook",       component: SiStorybook },

  // ── Misc tech ────────────────────────────────────────────────────
  { key: "SiThreedotjs",   label: "Three.js",        component: SiThreedotjs },
  { key: "SiElectron",     label: "Electron",        component: SiElectron },
  { key: "SiTauri",        label: "Tauri",           component: SiTauri },
  { key: "SiStripe",       label: "Stripe",          component: SiStripe },
  { key: "SiPlanetscale",  label: "PlanetScale",     component: SiPlanetscale },

  // ── Social media ─────────────────────────────────────────────────
  { key: "SiX",            label: "X (Twitter)",     component: SiX },
  { key: "SiInstagram",    label: "Instagram",       component: SiInstagram },
  { key: "SiFacebook",     label: "Facebook",        component: SiFacebook },
  { key: "SiYoutube",      label: "YouTube",         component: SiYoutube },
  { key: "SiTiktok",       label: "TikTok",          component: SiTiktok },
  { key: "SiSpotify",      label: "Spotify",         component: SiSpotify },
  { key: "SiDiscord",      label: "Discord",         component: SiDiscord },
  { key: "SiTelegram",     label: "Telegram",        component: SiTelegram },
  { key: "SiWhatsapp",     label: "WhatsApp",        component: SiWhatsapp },
  { key: "SiReddit",       label: "Reddit",          component: SiReddit },

  // ── Productivity / PM ────────────────────────────────────────────
  { key: "SiNotion",       label: "Notion",          component: SiNotion },
  { key: "SiJira",         label: "Jira",            component: SiJira },
  { key: "SiConfluence",   label: "Confluence",      component: SiConfluence },
  { key: "SiZoom",         label: "Zoom",            component: SiZoom },
  { key: "SiSlack",        label: "Slack",           component: SiSlack },
  { key: "SiMiro",         label: "Miro",            component: SiMiro },
  { key: "SiTrello",       label: "Trello",          component: SiTrello },
  { key: "SiAsana",        label: "Asana",           component: SiAsana },
  { key: "SiLinear",       label: "Linear",          component: SiLinear },
  { key: "SiAirtable",     label: "Airtable",        component: SiAirtable },
  { key: "SiZapier",       label: "Zapier",          component: SiZapier },

  // ── Companies / Big Tech ─────────────────────────────────────────
  { key: "SiGoogle",       label: "Google",          component: SiGoogle },
  { key: "SiMeta",         label: "Meta",            component: SiMeta },
  { key: "SiNetflix",      label: "Netflix",         component: SiNetflix },
  { key: "SiShopify",      label: "Shopify",         component: SiShopify },
  { key: "SiWordpress",    label: "WordPress",       component: SiWordpress },
  { key: "SiMedium",       label: "Medium",          component: SiMedium },

  // ── Google Workspace ─────────────────────────────────────────────
  { key: "SiGmail",         label: "Gmail",          component: SiGmail },
  { key: "SiGoogleanalytics",label:"Google Analytics",component: SiGoogleanalytics },
  { key: "SiGooglemaps",    label: "Google Maps",    component: SiGooglemaps },
  { key: "SiGoogledrive",   label: "Google Drive",   component: SiGoogledrive },
  { key: "SiGooglesheets",  label: "Google Sheets",  component: SiGooglesheets },
  { key: "SiGoogledocs",    label: "Google Docs",    component: SiGoogledocs },

  // ── Storage / Files ──────────────────────────────────────────────
  { key: "SiDropbox",      label: "Dropbox",         component: SiDropbox },
  { key: "SiIcloud",       label: "iCloud",          component: SiIcloud },

  // ── Marketing / Comms ────────────────────────────────────────────
  { key: "SiMailchimp",    label: "Mailchimp",       component: SiMailchimp },
  { key: "SiSendgrid",     label: "SendGrid",        component: SiSendgrid },
  { key: "SiTwilio",       label: "Twilio",          component: SiTwilio },

  // ── CMS ──────────────────────────────────────────────────────────
  { key: "SiStrapi",       label: "Strapi",          component: SiStrapi },
  { key: "SiContentful",   label: "Contentful",      component: SiContentful },
  { key: "SiSanity",       label: "Sanity",          component: SiSanity },

  // ── Monitoring / Ops ─────────────────────────────────────────────
  { key: "SiSentry",       label: "Sentry",          component: SiSentry },
  { key: "SiDatadog",      label: "Datadog",         component: SiDatadog },
  { key: "SiGrafana",      label: "Grafana",         component: SiGrafana },
  { key: "SiElasticsearch",label: "Elasticsearch",   component: SiElasticsearch },
  { key: "SiRabbitmq",     label: "RabbitMQ",        component: SiRabbitmq },
  { key: "SiPagerduty",    label: "PagerDuty",       component: SiPagerduty },

  // ── Lucide — Work & Business ─────────────────────────────────────
  { key: "LuBriefcase",    label: "Briefcase",       component: Briefcase },
  { key: "LuBuilding",     label: "Building",        component: Building },
  { key: "LuBuilding2",    label: "Company",         component: Building2 },
  { key: "LuUsers",        label: "Team",            component: Users },
  { key: "LuUser",         label: "Person",          component: User },
  { key: "LuUserCheck",    label: "Verified Person", component: UserCheck },
  { key: "LuStore",        label: "Store",           component: Store },
  { key: "LuHome",         label: "Home",            component: Home },
  { key: "LuMapPin",       label: "Location",        component: MapPin },

  // ── Lucide — Tech ────────────────────────────────────────────────
  { key: "LuCode",         label: "Code",            component: Code },
  { key: "LuCode2",        label: "Code Block",      component: Code2 },
  { key: "LuCpu",          label: "CPU",             component: Cpu },
  { key: "LuDatabase",     label: "Database",        component: Database },
  { key: "LuGlobe",        label: "Globe / Web",     component: Globe },
  { key: "LuLaptop",       label: "Laptop",          component: Laptop },
  { key: "LuMonitor",      label: "Monitor",         component: Monitor },
  { key: "LuServer",       label: "Server",          component: Server },
  { key: "LuSmartphone",   label: "Smartphone",      component: Smartphone },
  { key: "LuTerminal",     label: "Terminal",        component: Terminal },
  { key: "LuWifi",         label: "WiFi",            component: Wifi },
  { key: "LuCommand",      label: "Command",         component: Command },
  { key: "LuPackage",      label: "Package",         component: Package },
  { key: "LuLayers",       label: "Layers",          component: Layers },
  { key: "LuLayout",       label: "Layout",          component: Layout },
  { key: "LuLayoutGrid",   label: "Grid",            component: LayoutGrid },
  { key: "LuSettings",     label: "Settings",        component: Settings },
  { key: "LuWrench",       label: "Wrench",          component: Wrench },
  { key: "LuHammer",       label: "Hammer",          component: Hammer },

  // ── Lucide — Creative ────────────────────────────────────────────
  { key: "LuPalette",      label: "Palette",         component: Palette },
  { key: "LuPen",          label: "Pen",             component: Pen },
  { key: "LuPenTool",      label: "Pen Tool",        component: PenTool },
  { key: "LuPencil",       label: "Pencil",          component: Pencil },
  { key: "LuBrush",        label: "Brush",           component: Brush },
  { key: "LuCamera",       label: "Camera",          component: Camera },
  { key: "LuImage",        label: "Image",           component: Image },
  { key: "LuMusic",        label: "Music",           component: Music },
  { key: "LuVideo",        label: "Video",           component: Video },

  // ── Lucide — General ─────────────────────────────────────────────
  { key: "LuStar",         label: "Star",            component: Star },
  { key: "LuZap",          label: "Zap",             component: Zap },
  { key: "LuShield",       label: "Shield",          component: Shield },
  { key: "LuAward",        label: "Award",           component: Award },
  { key: "LuHeart",        label: "Heart",           component: Heart },
  { key: "LuSparkles",     label: "Sparkles",        component: Sparkles },
  { key: "LuCoffee",       label: "Coffee",          component: Coffee },
  { key: "LuBookOpen",     label: "Book",            component: BookOpen },
  { key: "LuRocket",       label: "Rocket",          component: Rocket },
  { key: "LuLightbulb",    label: "Lightbulb",       component: Lightbulb },
  { key: "LuSchool",       label: "School",          component: School },
  { key: "LuGraduationCap",label: "Graduation",      component: GraduationCap },
];

export const ICON_MAP = Object.fromEntries(
  ICON_REGISTRY.map((e) => [e.key, e])
) as Record<string, IconEntry>;

export function isRegistryKey(icon: string) {
  return (icon.startsWith("Si") || icon.startsWith("Lu")) && icon in ICON_MAP;
}
