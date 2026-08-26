export type TimeRange = 'week' | 'month' | '3months' | '6months' | 'year' | 'all';

export interface TopTrack {
  trackSpotifyId: string;
  trackName: string;
  artistName: string;
  albumImageUrl: string;
  plays: string; // vem como string do COUNT(*) do Postgres
}

export interface TopArtist {
  artistName: string;
  plays: string;
}

export interface DayActivity {
  date: string; // ISO date string
  plays: string;
}

export interface HourActivity {
  hour: string; // "0" a "23"
  plays: string;
}

export interface DowActivity {
  dow: string; // "0" (domingo) a "6" (sábado)
  plays: string;
}

export interface Scrobble {
  id: string;
  trackName: string;
  artistName: string;
  albumName: string;
  albumImageUrl: string;
  playedAt: string;
}

export interface OverviewData {
  total: number;
  topTracks: TopTrack[];
  topArtists: TopArtist[];
  perDay: DayActivity[];
}