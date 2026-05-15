import { getAdminSkills } from "@/app/actions/admin";
import SkillsClient from "./SkillsClient";

export default async function SkillsPage() {
  const skills = await getAdminSkills();
  return <SkillsClient initialSkills={skills} />;
}
