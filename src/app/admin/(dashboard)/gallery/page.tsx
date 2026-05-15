import { getAdminGalleryItems } from "@/app/actions/admin";
import GalleryAdminClient from "./GalleryAdminClient";

export default async function GalleryPage() {
  const items = await getAdminGalleryItems();
  return <GalleryAdminClient initialItems={items} />;
}
