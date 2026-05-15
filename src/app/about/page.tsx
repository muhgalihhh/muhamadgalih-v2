import type { Metadata } from "next";
import { getPublicExperiences, getPublicSkills, getPublicCertificates } from "@/lib/data/portfolio";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About — Muhamad Galih · MIZARIE",
  description: "Full-Stack Engineer, UI/UX Designer & Illustrator based in Indonesia.",
};

export default async function AboutPage() {
  const [experiences, skills, certificates] = await Promise.all([
    getPublicExperiences(),
    getPublicSkills(),
    getPublicCertificates(),
  ]);
  return <AboutContent dbExperiences={experiences} dbSkills={skills} dbCertificates={certificates} />;
}
