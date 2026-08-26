import type { Metadata } from "next";
import { Dashboard } from "./Dashboard";

const API = process.env.NEXT_PUBLIC_API_URL;

async function getOgData() {
  try {
    const res = await fetch(`${API}/stats/overview?range=month`, {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return {
      total:   data.total ?? 0,
      artist:  data.topArtists?.[0]?.artistName ?? '—',
      track:   data.topTracks?.[0]?.trackName   ?? '—',
      perDay:  data.perDay ?? [],
    };
  } catch {
    return { total: 0, artist: '—', track: '—', perDay: [] };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { total, artist, track, perDay } = await getOgData();

  const bars = perDay.map((d: { plays: string }) => d.plays).join(",");

  const ogUrl = new URL(
    "/og",
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  );
  ogUrl.searchParams.set("total", String(total));
  ogUrl.searchParams.set("artist", artist);
  ogUrl.searchParams.set("track", track);
  ogUrl.searchParams.set("bars", bars);

  return {
    title: "leo.stats — scrobbling via spotify",
    description: `${total.toLocaleString("pt-BR")} scrobbles registrados. Top artista: ${artist}. Top faixa: ${track}.`,
    openGraph: {
      title: "leo.stats",
      description: `${total.toLocaleString("pt-BR")} scrobbles registrados`,
      images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "leo.stats",
      description: `${total.toLocaleString("pt-BR")} scrobbles registrados`,
      images: [ogUrl.toString()],
    },
  };
}

export default function Home() {
  return <Dashboard />;
}
