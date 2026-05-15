import { getAdminExperiences } from "@/app/actions/admin";
import ExperienceClient from "./ExperienceClient";

export default async function ExperiencePage() {
  const experiences = await getAdminExperiences();
  return <ExperienceClient initialExperiences={experiences} />;
}
