import { getAdminProfile } from "@/app/actions/admin";
import ContactAdminClient from "./ContactAdminClient";

export default async function ContactAdminPage() {
  const profile = await getAdminProfile();
  return <ContactAdminClient profile={profile} />;
}
