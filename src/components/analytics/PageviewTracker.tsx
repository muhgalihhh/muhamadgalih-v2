"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { recordPageview } from "@/app/actions/analytics";

export default function PageviewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    recordPageview(pathname, document.referrer || null).catch(() => {});
  }, [pathname]);

  return null;
}
