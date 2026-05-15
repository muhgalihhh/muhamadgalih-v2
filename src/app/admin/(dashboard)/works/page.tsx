import { getAdminProjects, getAdminSkills, getAdminCategories } from "@/app/actions/admin";
import WorksAdminClient from "./WorksAdminClient";

export default async function WorksAdminPage() {
  const [projects, skills, categories] = await Promise.all([
    getAdminProjects(),
    getAdminSkills(),
    getAdminCategories(),
  ]);
  return <WorksAdminClient initialProjects={projects} skills={skills} initialCategories={categories} />;
}
