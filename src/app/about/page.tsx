import type { Metadata } from "next";
import { getPublicExperiences, getPublicSkills, getPublicCertificates, getPublicOrganizations, getPublicEducation } from "@/lib/data/portfolio";
import { getApprovedTestimonials, getOwnTestimonial } from "@/app/actions/testimonials";
import AboutContent from "./AboutContent";
import type { Testimonial } from "@/types/portfolio";

export const metadata: Metadata = {
  title: "About · Muhamad Galih · MIZARIE",
  description: "Full-Stack Engineer, UI/UX Designer, Illustrator, and Data Scientist based in Indonesia.",
};

export default async function AboutPage() {
  const [experiences, skills, certificates, organizations, education, testimonials, ownTestimonial] = await Promise.all([
    getPublicExperiences(),
    getPublicSkills(),
    getPublicCertificates(),
    getPublicOrganizations(),
    getPublicEducation(),
    getApprovedTestimonials(),
    getOwnTestimonial(),
  ]);
  return (
    <AboutContent
      dbExperiences={experiences}
      dbSkills={skills}
      dbCertificates={certificates}
      dbOrganizations={organizations}
      dbEducation={education}
      testimonials={testimonials as Testimonial[]}
      ownTestimonial={ownTestimonial}
    />
  );
}
