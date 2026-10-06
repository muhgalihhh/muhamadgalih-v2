import { test } from "node:test";
import assert from "node:assert/strict";
import {
  slugify, uniqueSlug, safeHref, youtubeId, isContentDoc, parseContent,
  descriptionToDoc, extractContentImageUrls, cleanupUrls,
} from "./projectContent.ts";

test("slugify", () => {
  assert.equal(slugify("Face Recognition App"), "face-recognition-app");
  assert.equal(slugify("  Café   Ünïcode!! "), "cafe-unicode");
  assert.equal(slugify("FoldIn.space - UI/UX Redesign & Design System"), "foldin-space-ui-ux-redesign-design-system");
  assert.equal(slugify("!!!"), "project");
  assert.equal(slugify(""), "project");
  const long = slugify("Implementasi Algoritma Genetika untuk Penentuan Komposisi Portofolio Saham Optimal");
  assert.ok(long.length <= 60, `too long: ${long.length}`);
  assert.equal(long, "implementasi-algoritma-genetika-untuk-penentuan-komposisi");
  assert.equal(slugify("a".repeat(80)), "a".repeat(60));
});

test("uniqueSlug", () => {
  assert.equal(uniqueSlug("app", []), "app");
  assert.equal(uniqueSlug("app", ["app"]), "app-2");
  assert.equal(uniqueSlug("app", ["app", "app-2", "app-3"]), "app-4");
  assert.equal(uniqueSlug("app", ["app-2"]), "app");
});

test("safeHref", () => {
  assert.equal(safeHref("https://github.com/x"), "https://github.com/x");
  assert.equal(safeHref("mailto:a@b.co"), "mailto:a@b.co");
  assert.equal(safeHref("/works/abc"), "/works/abc");
  assert.equal(safeHref("javascript:alert(1)"), null);
  assert.equal(safeHref(" JavaScript:alert(1)"), null);
  assert.equal(safeHref("//evil.com/x"), null);
  assert.equal(safeHref("data:text/html,hi"), null);
  assert.equal(safeHref("not a url"), null);
  assert.equal(safeHref(undefined), null);
});

test("youtubeId", () => {
  const id = "dQw4w9WgXcQ";
  assert.equal(youtubeId(`https://www.youtube.com/watch?v=${id}&t=10`), id);
  assert.equal(youtubeId(`https://youtu.be/${id}?si=abc`), id);
  assert.equal(youtubeId(`https://youtube.com/shorts/${id}`), id);
  assert.equal(youtubeId(`https://www.youtube.com/embed/${id}`), id);
  assert.equal(youtubeId(`https://m.youtube.com/watch?v=${id}`), id);
  assert.equal(youtubeId("https://vimeo.com/123"), null);
  assert.equal(youtubeId("https://www.youtube.com/watch?v=short"), null);
  assert.equal(youtubeId("not a url"), null);
  assert.equal(youtubeId(null), null);
});

test("isContentDoc / parseContent", () => {
  const doc = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "x" }] }] };
  assert.equal(isContentDoc(doc), true);
  assert.equal(isContentDoc({ type: "paragraph" }), false);
  assert.equal(isContentDoc({ type: "doc", content: "nope" }), false);
  assert.equal(isContentDoc(null), false);

  assert.deepEqual(parseContent(""), { ok: true, content: null });
  assert.deepEqual(parseContent(null), { ok: true, content: null });
  assert.deepEqual(parseContent('{"type":"doc","content":[{"type":"paragraph"}]}'), { ok: true, content: null });
  assert.deepEqual(parseContent(JSON.stringify(doc)), { ok: true, content: doc });
  assert.deepEqual(parseContent("{not json"), { ok: false });
  assert.deepEqual(parseContent('{"type":"paragraph"}'), { ok: false });
  assert.deepEqual(parseContent(42), { ok: false });
});

test("descriptionToDoc", () => {
  assert.deepEqual(descriptionToDoc("One.\n\nTwo.\n"), {
    type: "doc",
    content: [
      { type: "paragraph", content: [{ type: "text", text: "One." }] },
      { type: "paragraph", content: [{ type: "text", text: "Two." }] },
    ],
  });
  assert.deepEqual(descriptionToDoc("   "), { type: "doc", content: [{ type: "paragraph" }] });
});

test("extractContentImageUrls", () => {
  const doc = {
    type: "doc",
    content: [
      { type: "image", attrs: { src: "a.webp" } },
      { type: "callout", attrs: { variant: "info" }, content: [{ type: "image", attrs: { src: "b.webp" } }] },
      { type: "gallery", attrs: { images: [{ src: "c.webp", alt: "" }, { src: "a.webp", alt: "" }] } },
      { type: "paragraph", content: [{ type: "text", text: "hi" }] },
    ],
  };
  assert.deepEqual(extractContentImageUrls(doc), ["a.webp", "b.webp", "c.webp"]);
  assert.deepEqual(extractContentImageUrls(null), []);
  assert.deepEqual(extractContentImageUrls({ type: "doc", content: "garbage" }), []);
  assert.deepEqual(extractContentImageUrls({ type: "gallery", attrs: { images: "nope" } }), []);
});

test("cleanupUrls keeps anything still referenced", () => {
  const img = (src: string) => ({ type: "image", attrs: { src } });
  const removed = cleanupUrls(
    { imageUrls: ["shot1", "shot2"], content: { type: "doc", content: [img("c1"), img("c2"), img("shot2")] } },
    { imageUrls: ["shot1", "c1"], content: { type: "doc", content: [img("c2")] } },
  );
  // shot2 moved out of both; c1 left content but became a screenshot; c2 still in content.
  assert.deepEqual(removed, ["shot2"]);
  assert.deepEqual(cleanupUrls({ imageUrls: [], content: null }, { imageUrls: [], content: null }), []);
});
