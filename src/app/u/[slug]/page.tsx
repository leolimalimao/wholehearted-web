import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProfileDashboard } from './ProfileDashboard';

const API = process.env.NEXT_PUBLIC_API_URL;

interface ProfileData {
  slug: string;
  displayName: string;
  total: number;
  topTracks: { trackSpotifyId: string; trackName: string; artistName: string; plays: string }[];
  topArtists: { artistName: string; plays: string }[];
}

async function getProfile(slug: string): Promise<ProfileData | null> {
  try {
    const res = await fetch(`${API}/public/profile/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile) return { title: 'Perfil não encontrado — wholehearted.stats' };

  const topArtist = profile.topArtists[0]?.artistName ?? '—';
  const topTrack  = profile.topTracks[0]?.trackName ?? '—';

  const ogUrl = new URL('/og', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000');
  ogUrl.searchParams.set('total', String(profile.total));
  ogUrl.searchParams.set('artist', topArtist);
  ogUrl.searchParams.set('track', topTrack);
  ogUrl.searchParams.set('name', profile.displayName);

  return {
    title: `${profile.displayName} — wholehearted.stats`,
    description: `${profile.total.toLocaleString('pt-BR')} scrobbles registrados. Top artista: ${topArtist}.`,
    openGraph: {
      title: `${profile.displayName} — wholehearted.stats`,
      description: `${profile.total.toLocaleString('pt-BR')} scrobbles registrados`,
      images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profile.displayName} — wholehearted.stats`,
      images: [ogUrl.toString()],
    },
  };
}

export default async function ProfilePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile) notFound();

  return (
    <ProfileDashboard
      slug={profile.slug}
      displayName={profile.displayName}
    />
  );
}