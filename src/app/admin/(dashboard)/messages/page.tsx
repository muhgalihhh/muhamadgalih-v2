import { getContactMessages } from "@/app/actions/admin";
import MessagesAdminClient from "./MessagesAdminClient";

export default async function MessagesAdminPage() {
  const messages = await getContactMessages();
  return <MessagesAdminClient messages={messages} />;
}
