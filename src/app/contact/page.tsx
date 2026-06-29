import type { Metadata } from "next";
import { getProfile } from "@/lib/data/portfolio";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact · Muhamad Galih · MIZARIE",
  description: "Get in touch with Muhamad Galih (MIZARIE) for projects, collaborations, or just a hello.",
};

export default async function ContactPage() {
  const profile = await getProfile();
  return <ContactContent profile={profile} />;
}
