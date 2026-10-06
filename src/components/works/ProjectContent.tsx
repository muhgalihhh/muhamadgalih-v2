import type { ReactNode } from "react";
import type { JSONContent } from "@tiptap/core";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import { bundledLanguages, codeToHtml } from "shiki";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { CopyCodeButton, ZoomImage } from "@/components/works/ContentInteractive";
import {
  contentExtensions, descriptionToDoc, isContentDoc, safeHref, youtubeId,
  type CalloutVariant, type GalleryImage,
} from "@/lib/projectContent";

type RenderOptions = NonNullable<Parameters<typeof renderToReactElement>[0]["options"]>;

const CALLOUT_CLASS: Record<CalloutVariant, string> = {
  info: "bg-sky text-ink",
  success: "bg-mint text-ink",
  warning: "bg-yellow text-ink",
  highlight: "bg-pink text-ink",
};

const codeKey = (lang: string, code: string) => `${lang}\u0000${code}`;
// Node attrs come from the DB; the mappings run during React render (outside
// renderBlocks' try/catch), so treat every attr as untrusted.
const str = (v: unknown) => (typeof v === "string" ? v : "");

function collectCodeBlocks(node: JSONContent, out: { lang: string; code: string }[]) {
  const children = Array.isArray(node.content) ? node.content : [];
  if (node.type === "codeBlock") {
    out.push({ lang: str(node.attrs?.language), code: children.map((c) => str(c?.text)).join("") });
  }
  children.forEach((child) => collectCodeBlocks(child, out));
}

function buildOptions(highlighted: Map<string, string>): RenderOptions {
  return {
    nodeMapping: {
      codeBlock: ({ node }) => {
        const lang = str(node.attrs.language);
        const html = highlighted.get(codeKey(lang, node.textContent));
        return (
          <div className="cartoon-border rounded-xl overflow-hidden my-6 bg-cream">
            <div className="flex items-center justify-between px-3 py-1.5 border-b-2 border-ink/80">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">{lang || "code"}</span>
              <CopyCodeButton code={node.textContent} />
            </div>
            {html
              ? <div dangerouslySetInnerHTML={{ __html: html }} />
              : <pre className="shiki"><code>{node.textContent}</code></pre>}
          </div>
        );
      },
      image: ({ node }) =>
        str(node.attrs.src) ? (
          <div className="my-6">
            <ZoomImage src={str(node.attrs.src)} alt={str(node.attrs.alt)} className="cartoon-border rounded-xl" />
          </div>
        ) : null,
      gallery: ({ node }) => {
        const images: GalleryImage[] = (Array.isArray(node.attrs.images) ? node.attrs.images : [])
          .filter((img: unknown) => !!str((img as GalleryImage | null)?.src))
          .map((img: GalleryImage) => ({ src: img.src, alt: str(img.alt) }));
        return (
          <div className="columns-2 md:columns-3 gap-3 my-6">
            {images.map((img, i) => (
              <ZoomImage key={i} src={img.src} alt={img.alt} className="cartoon-border-sm rounded-xl mb-3 break-inside-avoid" />
            ))}
          </div>
        );
      },
      callout: ({ node, children }) => (
        <aside className={`card-surface ${CALLOUT_CLASS[node.attrs.variant as CalloutVariant] ?? CALLOUT_CLASS.info} cartoon-border rounded-2xl px-5 py-4 my-6`}>
          {children}
        </aside>
      ),
      table: ({ children }) => (
        <div className="overflow-x-auto my-6 cartoon-border rounded-xl">
          <table><tbody>{children}</tbody></table>
        </div>
      ),
      youtube: ({ node }) => {
        const id = youtubeId(node.attrs.src);
        if (!id) return null;
        return (
          <div className="aspect-video my-6 cartoon-border rounded-xl overflow-hidden bg-ink">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              title="YouTube video"
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              className="w-full h-full"
            />
          </div>
        );
      },
    },
    markMapping: {
      link: ({ mark, children }) => {
        const href = safeHref(mark.attrs.href);
        if (!href) return <>{children}</>;
        return href.startsWith("/")
          ? <a href={href}>{children}</a>
          : <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
      },
    },
  };
}

// Returns null on any failure (unknown node type, malformed JSON) so the
// caller can fall back to the plain description.
async function renderBlocks(doc: JSONContent): Promise<ReactNode[] | null> {
  try {
    const blocks: { lang: string; code: string }[] = [];
    collectCodeBlocks(doc, blocks);
    const highlighted = new Map(
      await Promise.all(
        blocks.map(async ({ lang, code }) => [
          codeKey(lang, code),
          await codeToHtml(code, {
            lang: lang in bundledLanguages ? lang : "text",
            themes: { light: "github-light", dark: "github-dark" },
            defaultColor: false,
          }),
        ] as const),
      ),
    );
    const options = buildOptions(highlighted);
    return (doc.content ?? []).map((block) =>
      renderToReactElement({ content: { type: "doc", content: [block] }, extensions: contentExtensions, options }),
    );
  } catch {
    return null;
  }
}

export default async function ProjectContent({ content, description }: { content: unknown; description: string }) {
  const blocks =
    (isContentDoc(content) && (await renderBlocks(content))) ||
    (await renderBlocks(descriptionToDoc(description))) ||
    [];
  return (
    <div className="project-content">
      {blocks.map((block, i) => (
        <ScrollReveal key={i} variant="fade-up" once>
          {block}
        </ScrollReveal>
      ))}
    </div>
  );
}
