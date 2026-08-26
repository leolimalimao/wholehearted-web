import { OverviewData, TimeRange, TopArtist, TopTrack, DayActivity, HourActivity, DowActivity, Scrobble } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL;

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
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
    fetcher<DowActivity[]>(`/stats/activity/days?range=${range}`),

  recent: (limit = 20) =>
    fetcher<Scrobble[]>(`/stats/recent?limit=${limit}`),
};