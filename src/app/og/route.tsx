import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const total = searchParams.get("total") ?? "0";
  const artist = searchParams.get("artist") ?? "—";
  const track = searchParams.get("track") ?? "—";
  const bars = searchParams.get("bars") ?? "";
  const name = searchParams.get("name") ?? "wholehearted.stats";

  // bars vem como string "12,5,30,8,..." — valores de plays por dia
  const barValues = bars
    ? bars.split(",").map(Number)
    : Array.from({ length: 30 }, () => Math.floor(Math.random() * 40) + 5);

  const max = Math.max(...barValues, 1);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0A0A0F",
        padding: "56px 64px",
        fontFamily: "sans-serif",
      }}
    >
      {/* topo */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p
          style={{
            fontSize: 18,
            color: "#6B6B80",
            margin: 0,
            letterSpacing: 4,
          }}
        >
          {name.toUpperCase()}
        </p>
        <p style={{ fontSize: 15, color: "#6C63FF", margin: 0 }}>
          scrobbling via spotify
        </p>
      </div>

      {/* centro — número + waveform */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "#E8E8F0",
              margin: 0,
              lineHeight: 1,
              letterSpacing: -4,
            }}
          >
            {parseInt(total).toLocaleString("pt-BR")}
          </p>
          <p style={{ fontSize: 18, color: "#6B6B80", margin: 0 }}>
            scrobbles registrados
          </p>
        </div>

        {/* waveform estática */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 3,
            height: 60,
            width: "100%",
          }}
        >
          {barValues.map((v, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${Math.max((v / max) * 100, 5)}%`,
                background: "#6C63FF",
                opacity: 0.4 + (v / max) * 0.6,
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* rodapé */}
      <div style={{ display: "flex", gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <p
            style={{
              fontSize: 12,
              color: "#6B6B80",
              margin: 0,
              letterSpacing: 3,
            }}
          >
            TOP ARTISTA
          </p>
          <p
            style={{
              fontSize: 22,
              color: "#E8E8F0",
              margin: 0,
              fontWeight: 600,
            }}
          >
            {artist}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <p
            style={{
              fontSize: 12,
              color: "#6B6B80",
              margin: 0,
              letterSpacing: 3,
            }}
          >
            TOP FAIXA
          </p>
          <p
            style={{
              fontSize: 22,
              color: "#E8E8F0",
              margin: 0,
              fontWeight: 600,
            }}
          >
            {track}
          </p>
        </div>
      </div>

      {/* barra accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "#6C63FF",
        }}
      />
    </div>,
    { width: 1200, height: 630 },
  );
}
