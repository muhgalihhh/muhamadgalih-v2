import type { Metadata } from "next";
import { getPublicExperiences, getPublicSkills, getPublicCertificates } from "@/lib/data/portfolio";
import { getApprovedTestimonials, getOwnTestimonial } from "@/app/actions/testimonials";
import AboutContent from "./AboutContent";
import type { Testimonial } from "@/types/portfolio";

export const metadata: Metadata = {
  title: "About — Muhamad Galih · MIZARIE",
  description: "Full-Stack Engineer, UI/UX Designer & Illustrator based in Indonesia.",
};

export default async function AboutPage() {
  const [experiences, skills, certificates, testimonials, ownTestimonial] = await Promise.all([
    getPublicExperiences(),
    getPublicSkills(),
    getPublicCertificates(),
    getApprovedTestimonials(),
    getOwnTestimonial(),
  ]);
  return (
    <AboutContent
      dbExperiences={experiences}
      dbSkills={skills}
      dbCertificates={certificates}
      testimonials={testimonials as Testimonial[]}
      ownTestimonial={ownTestimonial}
    />
  );
}
