'use client';

import { useState } from 'react';
import { useOverview, useRecentScrobbles } from './hooks/useStats';
import { TimeRange } from './lib/types';
import { Container } from './components/layout/Container';
import { Header } from './components/layout/Header';
import { RangeSelector } from './components/ui/RangeSelector';
import { StatCard } from './components/ui/StatCard';
import { TrackRow } from './components/ui/TrackRow';
import { WaveForm } from './components/charts/WaveForm';
import { TopTracksChart } from './components/charts/TopTracksChart';
import { TopArtistsChart } from './components/charts/TopArtistsChart';
import { TimelineChart } from './components/charts/TimelineChart';
import { ActivityHeatmap } from './components/charts/ActivityHeatmap';
import { useActivityHours } from './hooks/useStats';
import styles from './page.module.css';

export default function Home() {
  const [range, setRange] = useState<TimeRange>('month');
  const { data, isLoading } = useOverview(range);
  const { data: recent } = useRecentScrobbles(20);
  const { data: hours } = useActivityHours(range);

  return (
    <>
      <Header />
      <Container>
        <section className={styles.controls}>
          <RangeSelector value={range} onChange={setRange} />
        </section>

        {data && (
          <>
            <WaveForm data={data.perDay} />

            <section className={styles.statGrid}>
              <StatCard
                label="scrobbles"
                value={data.total.toLocaleString('pt-BR')}
                sub={`no período selecionado`}
              />
              <StatCard
                label="faixas únicas"
                value={new Set(data.topTracks.map((t) => t.trackSpotifyId)).size}
              />
              <StatCard
                label="artistas únicos"
                value={data.topArtists.length}
              />
            </section>

            <section className={styles.charts}>
            <TopTracksChart data={data.topTracks} />
            <TopArtistsChart data={data.topArtists} />
            <TimelineChart data={data.perDay} />
            {hours && <ActivityHeatmap data={hours} />}
            </section>
          </>
        )}

        {isLoading && (
          <p className={styles.loading}>carregando...</p>
        )}

        {recent && (
          <section className={styles.recent}>
            <TrackRow scrobbles={recent} />
          </section>
        )}
      </Container>
    </>
  );
}