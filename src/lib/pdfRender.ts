// Client-only. pdf.js loads lazily, and every document shares ONE worker —
// letting getDocument() spawn its own worker per PDF meant 22 threads (each
// parsing a 1.2 MB script) on the certificates grid, which made scrolling lag.
type Pdfjs = typeof import("pdfjs-dist");

let shared: Promise<{ pdfjs: Pdfjs; worker: InstanceType<Pdfjs["PDFWorker"]> }> | null = null;

function load() {
  shared ??= import("pdfjs-dist").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
    return { pdfjs, worker: new pdfjs.PDFWorker() };
  });
  return shared;
}

/** Draws page 1 of a PDF onto `canvas`, `width` px wide, then frees the document. */
export async function renderPdfFirstPage(src: string | ArrayBuffer, canvas: HTMLCanvasElement, width: number) {
  const { pdfjs, worker } = await load();
  const task = pdfjs.getDocument(typeof src === "string" ? { url: src, worker } : { data: new Uint8Array(src), worker });
  try {
    const pdf = await task.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  } finally {
    await task.destroy(); // releases the document; the shared worker stays alive
  }
}
