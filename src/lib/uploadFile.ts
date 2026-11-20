import { uploadFile as uploadFileAction } from "@/app/actions/admin";

// Vercel rejects any function request body over 4.5 MB before the server action
// runs, so `bodySizeLimit: "15mb"` only helps in local dev. Big photos are
// downscaled in the browser first; the server re-encodes to 2000px WebP anyway.
// ponytail: GIF/SVG/PDF over ~4.5 MB still fail on Vercel; direct-to-Storage signed uploads if that matters.
const SAFE_BYTES = 4 * 1024 * 1024;
const MAX_SIDE = 2000;

async function shrink(file: File): Promise<File> {
  if (file.size <= SAFE_BYTES || !/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.9));
  if (!blob) return file;
  const ext = blob.type.split("/")[1];
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + "." + ext, { type: blob.type });
}

/** Client-side drop-in for the `uploadFile` server action. */
export async function uploadFile(fd: FormData) {
  const file = fd.get("file");
  if (file instanceof File) fd.set("file", await shrink(file));
  return uploadFileAction(fd);
}
