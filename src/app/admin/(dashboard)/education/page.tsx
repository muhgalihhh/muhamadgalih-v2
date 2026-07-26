import { getAdminEducation } from "@/app/actions/admin";
import EducationClient from "./EducationClient";

export default async function EducationPage() {
  const education = await getAdminEducation();
  return <EducationClient initialEducation={education} />;
}
