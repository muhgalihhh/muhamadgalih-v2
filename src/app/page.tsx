import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Technologies from "@/components/sections/Technologies";
import Works from "@/components/sections/Works";
import Contact from "@/components/sections/Contact";
import TestimonialsSection from "@/components/sections/Testimonials";
import Marquee from "@/components/animations/Marquee";
import { getPublicProjects, getPublicSkills, getProfile, getPublicCategories, getPublicExperiences } from "@/lib/data/portfolio";
import { getApprovedTestimonials, getOwnTestimonial } from "@/app/actions/testimonials";

export default async function Home() {
  const [projects, skills, profile, testimonials, ownTestimonial, categories, experiences] = await Promise.all([
    getPublicProjects(),
    getPublicSkills(),
    getProfile(),
    getApprovedTestimonials(),
    getOwnTestimonial(),
    getPublicCategories(),
    getPublicExperiences(),
  ]);

  return (
    <main>
      <Hero profile={profile} />
      <Marquee skills={skills} />
      <About profile={profile} skills={skills} projectsCount={projects.length} />
      <Technologies skills={skills} />
      <Works dbProjects={projects} categories={categories} experiences={experiences} />
      <TestimonialsSection testimonials={testimonials} ownTestimonial={ownTestimonial} />
      <Contact profile={profile} />
    </main>
  );
}
