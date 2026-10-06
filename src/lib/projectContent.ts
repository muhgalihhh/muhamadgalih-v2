// Shared by the admin editor (client), the public renderer (server) and the
// server actions. Keep it free of React and of "@/" imports — it also runs
// under plain `node --test`.
import { Node, mergeAttributes, type JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import Youtube from "@tiptap/extension-youtube";

export type CalloutVariant = "info" | "success" | "warning" | "highlight";
export const CALLOUT_VARIANTS: CalloutVariant[] = ["info", "success", "warning", "highlight"];
export type GalleryImage = { src: string; alt: string };

const MAX_SLUG = 60;

export function slugify(text: string): string {
  let s = text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (s.length > MAX_SLUG) {
    const cut = s.slice(0, MAX_SLUG + 1);
    s = cut.includes("-") ? cut.replace(/-[^-]*$/, "") : s.slice(0, MAX_SLUG);
  }
  return s || "project";
}

export function uniqueSlug(base: string, taken: string[]): string {
  const used = new Set(taken);
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export function safeHref(url: unknown): string | null {
  if (typeof url !== "string") return null;
  const s = url.trim();
  if (/^\/(?!\/)/.test(s)) return s;
  try {
    const u = new URL(s);
    return ["http:", "https:", "mailto:"].includes(u.protocol) ? u.href : null;
  } catch {
    return null;
  }
}

const YT_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"]);

export function youtubeId(url: unknown): string | null {
  if (typeof url !== "string") return null;
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }
  let id: string | null = null;
  if (u.hostname === "youtu.be") id = u.pathname.slice(1);
  else if (YT_HOSTS.has(u.hostname)) {
    id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1] ?? null;
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

export function isContentDoc(v: unknown): v is JSONContent {
  return !!v && typeof v === "object" && (v as JSONContent).type === "doc" && Array.isArray((v as JSONContent).content);
}

function isEmptyDoc(doc: JSONContent): boolean {
  const blocks = doc.content ?? [];
  return blocks.length === 0 || (blocks.length === 1 && blocks[0].type === "paragraph" && !blocks[0].content?.length);
}

export function parseContent(raw: unknown): { ok: true; content: JSONContent | null } | { ok: false } {
  if (raw == null || raw === "") return { ok: true, content: null };
  if (typeof raw !== "string") return { ok: false };
  let v: unknown;
  try {
    v = JSON.parse(raw);
  } catch {
    return { ok: false };
  }
  if (!isContentDoc(v)) return { ok: false };
  return { ok: true, content: isEmptyDoc(v) ? null : v };
}

export function descriptionToDoc(description: string): JSONContent {
  const paragraphs = description
    .split(/\n+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((text) => ({ type: "paragraph", content: [{ type: "text", text }] }));
  return { type: "doc", content: paragraphs.length ? paragraphs : [{ type: "paragraph" }] };
}

export function extractContentImageUrls(content: unknown): string[] {
  const out: string[] = [];
  const walk = (n: unknown) => {
    if (!n || typeof n !== "object") return;
    const node = n as JSONContent;
    if (node.type === "image" && typeof node.attrs?.src === "string") out.push(node.attrs.src);
    if (node.type === "gallery" && Array.isArray(node.attrs?.images)) {
      for (const img of node.attrs.images) if (typeof img?.src === "string") out.push(img.src);
    }
    if (Array.isArray(node.content)) node.content.forEach(walk);
  };
  walk(content);
  return [...new Set(out)];
}

/** URLs referenced before but by neither screenshots nor content after. */
export function cleanupUrls(
  old: { imageUrls: string[]; content: unknown },
  next: { imageUrls: string[]; content: unknown },
): string[] {
  const keep = new Set([...next.imageUrls, ...extractContentImageUrls(next.content)]);
  return [...new Set([...old.imageUrls, ...extractContentImageUrls(old.content)])].filter((u) => !keep.has(u));
}

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes() {
    return {
      variant: {
        default: "info",
        parseHTML: (el) => el.getAttribute("data-variant") ?? "info",
        renderHTML: (attrs) => ({ "data-variant": attrs.variant }),
      },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-callout]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-callout": "" }, HTMLAttributes), 0];
  },
});

export const Gallery = Node.create({
  name: "gallery",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return { images: { default: [], rendered: false } };
  },
  parseHTML() {
    return [{ tag: "div[data-gallery]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-gallery": "" }, HTMLAttributes)];
  },
});

/** Schema used by the public renderer. Node names must match the editor's. */
export const contentExtensions = [StarterKit, Image, TableKit, Youtube, Callout, Gallery];
