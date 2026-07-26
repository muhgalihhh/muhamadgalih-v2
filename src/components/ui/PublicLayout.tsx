"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import MusicPlayer from "./MusicPlayer";
import CustomCursor from "./CustomCursor";
import SplashScreen from "./SplashScreen";
import PageviewTracker from "@/components/analytics/PageviewTracker";

interface PublicLayoutProps {
  children: React.ReactNode;
  musicUrl?: string | null;
  songTitle?: string | null;
}

export default function PublicLayout({ children, musicUrl, songTitle }: PublicLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <SplashScreen />}
      {!isAdmin && <CustomCursor />}
      {!isAdmin && <Navbar />}
      {!isAdmin && <PageviewTracker />}
      {children}
      {!isAdmin && <MobileNav />}
      {!isAdmin && <MusicPlayer musicUrl={musicUrl} songTitle={songTitle} />}
    </>
  );
}
