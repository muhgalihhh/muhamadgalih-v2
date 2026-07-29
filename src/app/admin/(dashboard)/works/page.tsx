import { getAdminProjects, getAdminSkills, getAdminCategories, getAdminExperiences } from "@/app/actions/admin";
import WorksAdminClient from "./WorksAdminClient";

export default async function WorksAdminPage() {
  const [projects, skills, categories, experiences] = await Promise.all([
    getAdminProjects(),
    getAdminSkills(),
    getAdminCategories(),
    getAdminExperiences(),
  ]);
  return <WorksAdminClient initialProjects={projects} skills={skills} initialCategories={categories} experiences={experiences} />;
}
