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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Muhamad Galih · MIZARIE",
  description:
    "Portfolio of Muhamad Galih (MIZARIE): Full-Stack Engineer, UI/UX Designer, Illustrator, and Data Scientist based in Indonesia.",
  openGraph: { type: "website", siteName: "Muhamad Galih · MIZARIE" },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/icon",
    shortcut: "/icon",
    apple: "/icon",
  },
};

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
          <PublicLayout musicUrl={profile?.music_url} songTitle={profile?.name ?? undefined} profile={profile}>
            {children}
          </PublicLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
