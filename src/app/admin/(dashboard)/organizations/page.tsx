import { getAdminOrganizations } from "@/app/actions/admin";
import OrganizationsClient from "./OrganizationsClient";

export default async function OrganizationsPage() {
  const organizations = await getAdminOrganizations();
  return <OrganizationsClient initialOrganizations={organizations} />;
}
