import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/data/portfolio";

// Default link preview for every page; /works/<slug> overrides it with its own screenshot.
export const alt = "Muhamad Galih · MIZARIE portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The site's display font (Syne), subset to the glyphs we draw. Google serves TTF
// to clients without a browser UA, which is what ImageResponse needs.
async function syne(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Syne:wght@800&text=${encodeURIComponent(text)}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null; // fall back to the default font rather than failing the preview
  }
}

export default async function OpengraphImage() {
  const profile = await getProfile();
  const name = (profile?.name ?? "Muhamad Galih").toUpperCase();
  const roles = profile?.hero_roles?.length ? profile.hero_roles.slice(0, 3).join("  ·  ") : "Full-Stack · UI/UX · Illustration";
  const font = await syne(`MG/MIZARIE${name}${roles}`);
  const display = font ? "Syne" : "sans-serif";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#FFFEF0", color: "#0D0B1E", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 800, fontFamily: display }}>
          <span style={{ color: "#FF5757" }}>MG</span>
          <span style={{ color: "#3D3B52", fontWeight: 600 }}>/ MIZARIE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 800, letterSpacing: -2, lineHeight: 1, fontFamily: display }}>{name}</div>
          <div style={{ display: "flex", alignSelf: "flex-start", background: "#FFD166", border: "5px solid #0D0B1E", boxShadow: "8px 8px 0 #0D0B1E", borderRadius: 999, padding: "14px 32px", fontSize: 26, fontWeight: 800, fontFamily: display }}>
            {roles}
          </div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {["#FF5757", "#3DDC97", "#4CC9F0", "#845EF7", "#FFD166"].map((c) => (
            <div key={c} style={{ width: 26, height: 26, borderRadius: 999, background: c, border: "4px solid #0D0B1E" }} />
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Syne", data: font, weight: 800, style: "normal" }] : undefined }
  );
}
