import type { Metadata } from "next";
import { getProfile } from "@/lib/data/portfolio";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Muhamad Galih for projects, collaborations, or just a hello.",
};

export default async function ContactPage() {
  const profile = await getProfile();
  return <ContactContent profile={profile} />;
}
