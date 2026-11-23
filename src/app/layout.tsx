import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import PublicLayout from "@/components/ui/PublicLayout";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getProfile } from "@/lib/data/portfolio";
import { SITE_URL } from "@/lib/siteUrl";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

// Name and alias come from the profile row, so renaming in the CMS updates every title.
export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile?.name || "Muhamad Galih";
  const site = [name, profile?.alias].filter(Boolean).join(" · ");
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: site, template: `%s · ${site}` },
    description: `Portfolio of ${name}: Full-Stack Engineer, UI/UX Designer, Illustrator, and Data Scientist based in Indonesia.`,
    openGraph: { type: "website", siteName: site },
    twitter: { card: "summary_large_image" },
    icons: {
      icon: "/icon",
      shortcut: "/icon",
      apple: "/icon",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await getProfile();

  return (
    <html lang="en" className={`${syne.variable} ${jakarta.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: apply dark class before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&d)){document.documentElement.classList.add('dark');}if(sessionStorage.getItem('splash-seen')==='1'){document.documentElement.classList.add('splash-seen');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          <PublicLayout musicUrl={profile?.music_url} songTitle={profile?.name ?? undefined} profile={profile} alias={profile?.alias ?? ""}>
            {children}
          </PublicLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
