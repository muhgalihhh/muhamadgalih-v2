import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/data/portfolio";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const profile = await getProfile();
  const avatarUrl = profile?.avatar_url ?? null;

  if (avatarUrl) {
    return new ImageResponse(
      (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#845EF7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl}
            width={32}
            height={32}
            style={{
              objectFit: "cover",
              borderRadius: "50%",
              width: "100%",
              height: "100%",
            }}
            alt=""
          />
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #845EF7 0%, #5C3EC2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 800,
          fontSize: 12,
          fontFamily: "sans-serif",
          letterSpacing: "-0.5px",
        }}
      >
        MG
      </div>
    ),
    { ...size }
  );
}
