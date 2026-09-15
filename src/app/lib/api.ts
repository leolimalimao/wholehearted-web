import { OverviewData, TimeRange, TopArtist, TopTrack, DayActivity, HourActivity, Scrobble } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL;

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include', // envia cookie httpOnly em toda req
  });

  if (res.status === 401) {
    // limpa o estado do React Query e redireciona
    window.location.href = '/';
    throw new Error('Sessão expirada');
  }

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  me: () =>
    fetcher<{ authenticated: boolean; spotifyId?: string; slug?: string }>('/auth/me'),

  overview: (range: TimeRange) =>
    fetcher<OverviewData>(`/stats/overview?range=${range}`),

  topTracks: (range: TimeRange, limit = 10) =>
    fetcher<TopTrack[]>(`/stats/top-tracks?range=${range}&limit=${limit}`),

  topArtists: (range: TimeRange, limit = 10) =>
    fetcher<TopArtist[]>(`/stats/top-artists?range=${range}&limit=${limit}`),

  timeline: (range: TimeRange) =>
    fetcher<DayActivity[]>(`/stats/activity/timeline?range=${range}`),

  hours: (range: TimeRange) =>
    fetcher<HourActivity[]>(`/stats/activity/hours?range=${range}`),

  days: (range: TimeRange) =>
    fetcher<any[]>(`/stats/activity/days?range=${range}`),

  recent: (limit = 20) =>
    fetcher<Scrobble[]>(`/stats/recent?limit=${limit}`),

  publicProfile: (slug: string) =>
    fetcher<{ slug: string; displayName: string; avatarUrl?: string | null; total: number; topTracks: TopTrack[]; topArtists: TopArtist[] }>(
      `/public/profile/${slug}`
    ),

  publicOverview: (slug: string, range: TimeRange) =>
    fetcher<OverviewData>(`/public/profile/${slug}/overview?range=${range}`),

  publicRecent: (slug: string, limit = 20) =>
    fetcher<Scrobble[]>(`/public/profile/${slug}/recent?limit=${limit}`),

  publicHours: (slug: string, range: TimeRange) =>
    fetcher<HourActivity[]>(`/public/profile/${slug}/hours?range=${range}`),

  publicTimeline: (slug: string, range: TimeRange = 'year') =>
    fetcher<DayActivity[]>(`/public/profile/${slug}/timeline?range=${range}`),
};