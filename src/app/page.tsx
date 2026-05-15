import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Technologies from "@/components/sections/Technologies";
import Works from "@/components/sections/Works";
import Contact from "@/components/sections/Contact";
import Marquee from "@/components/animations/Marquee";
import { getPublicProjects, getPublicSkills, getProfile } from "@/lib/data/portfolio";

export default async function Home() {
  const [projects, skills, profile] = await Promise.all([
    getPublicProjects(),
    getPublicSkills(),
    getProfile(),
  ]);

  return (
    <main>
      <Hero profile={profile} />
      <Marquee skills={skills} />
      <About profile={profile} skills={skills} projectsCount={projects.length} />
      <Technologies skills={skills} />
      <Works dbProjects={projects} />
      <Contact profile={profile} />
    </main>
  );
}
