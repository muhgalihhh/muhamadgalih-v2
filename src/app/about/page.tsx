import type { Metadata } from "next";
import { getPublicExperiences, getPublicSkills, getPublicCertificates, getPublicOrganizations } from "@/lib/data/portfolio";
import { getApprovedTestimonials, getOwnTestimonial } from "@/app/actions/testimonials";
import AboutContent from "./AboutContent";
import type { Testimonial } from "@/types/portfolio";

export const metadata: Metadata = {
  title: "About — Muhamad Galih · MIZARIE",
  description: "Full-Stack Engineer, UI/UX Designer & Illustrator based in Indonesia.",
};

export default async function AboutPage() {
  const [experiences, skills, certificates, organizations, testimonials, ownTestimonial] = await Promise.all([
    getPublicExperiences(),
    getPublicSkills(),
    getPublicCertificates(),
    getPublicOrganizations(),
    getApprovedTestimonials(),
    getOwnTestimonial(),
  ]);
  return (
    <AboutContent
      dbExperiences={experiences}
      dbSkills={skills}
      dbCertificates={certificates}
      dbOrganizations={organizations}
      testimonials={testimonials as Testimonial[]}
      ownTestimonial={ownTestimonial}
    />
  );
}
