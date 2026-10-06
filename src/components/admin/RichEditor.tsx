"use client";

import { useState, type ReactNode } from "react";
import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import type { EditorView } from "@tiptap/pm/view";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import Youtube from "@tiptap/extension-youtube";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
  Bold, Italic, Strikethrough, Code, Link2, List, ListOrdered, Quote, Minus,
  Heading2, Heading3, ImagePlus, SquareCode, Table as TableIcon, SquarePlay,
  MessageSquareQuote, Images, Loader2,
} from "lucide-react";
import { Callout, Gallery, CALLOUT_VARIANTS } from "@/lib/projectContent";
import GalleryNodeView, { uploadContentImage } from "@/components/admin/GalleryNodeView";

const lowlight = createLowlight(common);
lowlight.registerAlias({ typescript: ["tsx"] });

const CODE_LANGUAGES = ["plaintext", "javascript", "typescript", "tsx", "python", "sql", "bash", "json", "html", "css"];
const selectCls = "border border-slate-200 rounded-lg px-2 py-1 text-xs bg-white outline-none focus:border-violet";

function imageFiles(list: FileList | null | undefined): File[] {
  return Array.from(list ?? []).filter((f) => f.type.startsWith("image/"));
}

function Btn({ title, active, onClick, children }: { title: string; active?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`w-8 h-8 inline-flex items-center justify-center rounded-lg transition-colors ${active ? "bg-violet/10 text-violet" : "text-slate-600 hover:bg-slate-100"}`}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className="w-px h-5 bg-slate-200 mx-1" />;

export default function RichEditor({ initialContent, onChange }: { initialContent: JSONContent; onChange: (doc: JSONContent) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Uploads then inserts through the ProseMirror view, so it works from
  // paste/drop handlers (which only receive the view) and from the toolbar.
  const insertImages = async (view: EditorView, files: File[], pos?: number) => {
    if (!files.length) return;
    setBusy(true);
    setError("");
    for (const file of files) {
      const res = await uploadContentImage(file);
      if (!res.url) { setError(res.error ?? "Upload gagal"); continue; }
      const node = view.state.schema.nodes.image.create({ src: res.url, alt: "" });
      view.dispatch(pos == null ? view.state.tr.replaceSelectionWith(node) : view.state.tr.insert(pos, node));
    }
    setBusy(false);
  };

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ codeBlock: false, heading: { levels: [2, 3] }, link: { openOnClick: false } }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: "plaintext" }),
      Image,
      TableKit.configure({ table: { resizable: false } }),
      Youtube.configure({ nocookie: true }),
      Callout,
      Gallery.extend({ addNodeView: () => ReactNodeViewRenderer(GalleryNodeView) }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: { class: "rich-editor min-h-[320px] px-4 py-3 outline-none text-sm text-slate-800" },
      handlePaste: (view, event) => {
        const files = imageFiles(event.clipboardData?.files);
        if (!files.length) return false;
        void insertImages(view, files);
        return true;
      },
      handleDrop: (view, event) => {
        const files = imageFiles(event.dataTransfer?.files);
        if (!files.length) return false;
        event.preventDefault();
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        void insertImages(view, files, pos);
        return true;
      },
    },
  });

  if (!editor) return <div className="min-h-[360px] border border-slate-200 rounded-xl bg-slate-50" />;

  const chain = () => editor.chain().focus();
  const pickFiles = (multiple: boolean, then: (files: File[]) => void) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = multiple;
    input.onchange = () => then(imageFiles(input.files));
    input.click();
  };

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL link (kosongkan untuk hapus link)", prev ?? "https://");
    if (url === null) return;
    if (url.trim() === "") chain().extendMarkRange("link").unsetLink().run();
    else chain().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const addYoutube = () => {
    const url = window.prompt("URL video YouTube");
    if (!url) return;
    if (!chain().setYoutubeVideo({ src: url.trim() }).run()) setError("URL YouTube tidak valid");
  };

  const addGallery = () =>
    pickFiles(true, async (files) => {
      if (!files.length) return;
      setBusy(true);
      setError("");
      const results = await Promise.all(files.map(uploadContentImage));
      const failed = results.find((r) => !r.url);
      if (failed) setError(failed.error ?? "Upload gagal");
      const images = results.filter((r) => r.url).map((r) => ({ src: r.url!, alt: "" }));
      if (images.length) chain().insertContent({ type: "gallery", attrs: { images } }).run();
      setBusy(false);
    });

  const inCallout = editor.isActive("callout");
  const inTable = editor.isActive("table");
  const inCode = editor.isActive("codeBlock");
  const inImage = editor.isActive("image");

  return (
    <div className="border border-slate-200 rounded-xl bg-white">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-white/95 backdrop-blur rounded-t-xl">
        <Btn title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></Btn>
        <Btn title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => chain().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></Btn>
        <Sep />
        <Btn title="Bold" active={editor.isActive("bold")} onClick={() => chain().toggleBold().run()}><Bold size={15} /></Btn>
        <Btn title="Italic" active={editor.isActive("italic")} onClick={() => chain().toggleItalic().run()}><Italic size={15} /></Btn>
        <Btn title="Strikethrough" active={editor.isActive("strike")} onClick={() => chain().toggleStrike().run()}><Strikethrough size={15} /></Btn>
        <Btn title="Inline code" active={editor.isActive("code")} onClick={() => chain().toggleCode().run()}><Code size={15} /></Btn>
        <Btn title="Link" active={editor.isActive("link")} onClick={setLink}><Link2 size={15} /></Btn>
        <Sep />
        <Btn title="Bullet list" active={editor.isActive("bulletList")} onClick={() => chain().toggleBulletList().run()}><List size={15} /></Btn>
        <Btn title="Numbered list" active={editor.isActive("orderedList")} onClick={() => chain().toggleOrderedList().run()}><ListOrdered size={15} /></Btn>
        <Btn title="Quote" active={editor.isActive("blockquote")} onClick={() => chain().toggleBlockquote().run()}><Quote size={15} /></Btn>
        <Btn title="Garis pemisah" onClick={() => chain().setHorizontalRule().run()}><Minus size={15} /></Btn>
        <Sep />
        <Btn title="Gambar" onClick={() => pickFiles(false, (files) => void insertImages(editor.view, files))}><ImagePlus size={15} /></Btn>
        <Btn title="Gallery" onClick={addGallery}><Images size={15} /></Btn>
        <Btn title="Blok kode" active={inCode} onClick={() => chain().toggleCodeBlock().run()}><SquareCode size={15} /></Btn>
        <Btn title="Tabel" active={inTable} onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={15} /></Btn>
        <Btn title="YouTube" onClick={addYoutube}><SquarePlay size={15} /></Btn>
        <Btn
          title="Callout"
          active={inCallout}
          onClick={() => (inCallout ? chain().lift("callout").run() : chain().wrapIn("callout", { variant: "info" }).run())}
        >
          <MessageSquareQuote size={15} />
        </Btn>
        {busy && <Loader2 size={15} className="animate-spin text-violet ml-2" />}
      </div>

      {(inCode || inTable || inCallout || inImage) && (
        <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
          {inCode && (
            <label className="flex items-center gap-1.5">
              Bahasa
              <select
                className={selectCls}
                value={(editor.getAttributes("codeBlock").language as string | null) ?? "plaintext"}
                onChange={(e) => chain().updateAttributes("codeBlock", { language: e.target.value }).run()}
              >
                {CODE_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </label>
          )}
          {inImage && (
            <label className="flex flex-1 min-w-[220px] items-center gap-1.5">
              Alt
              <input
                className={`${selectCls} flex-1`}
                placeholder="Alt text — jelaskan isi gambar"
                value={(editor.getAttributes("image").alt as string | null) ?? ""}
                onChange={(e) => editor.commands.updateAttributes("image", { alt: e.target.value })}
              />
            </label>
          )}
          {inCallout && (
            <label className="flex items-center gap-1.5">
              Callout
              <select
                className={selectCls}
                value={(editor.getAttributes("callout").variant as string) ?? "info"}
                onChange={(e) => chain().updateAttributes("callout", { variant: e.target.value }).run()}
              >
                {CALLOUT_VARIANTS.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>
          )}
          {inTable && (
            <span className="flex flex-wrap gap-1">
              {([
                ["+ baris", () => chain().addRowAfter().run()],
                ["− baris", () => chain().deleteRow().run()],
                ["+ kolom", () => chain().addColumnAfter().run()],
                ["− kolom", () => chain().deleteColumn().run()],
                ["hapus tabel", () => chain().deleteTable().run()],
              ] as const).map(([label, fn]) => (
                <button key={label} type="button" onMouseDown={(e) => e.preventDefault()} onClick={fn} className="px-2 py-1 rounded-md border border-slate-200 bg-white hover:border-violet">
                  {label}
                </button>
              ))}
            </span>
          )}
        </div>
      )}

      {error && <p className="mx-3 mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5">{error}</p>}
      <EditorContent editor={editor} />
    </div>
  );
}
