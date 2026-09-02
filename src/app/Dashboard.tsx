"use client";

import { useState, useEffect } from "react";
import {
  useOverview,
  useRecentScrobbles,
  useActivityHours,
} from "./hooks/useStats";
import { useAuth } from "./hooks/useAuth";
import { TimeRange } from "./lib/types";
import { Container } from "./components/layout/Container";
import { Header } from "./components/layout/Header";
import { RangeSelector } from "./components/ui/RangeSelector";
import { StatCard } from "./components/ui/StatCard";
import { TrackRow } from "./components/ui/TrackRow";
import { WaveForm } from "./components/charts/WaveForm";
import { TopTracksChart } from "./components/charts/TopTracksChart";
import { TopArtistsChart } from "./components/charts/TopArtistsChart";
import { TimelineChart } from "./components/charts/TimelineChart";
import { ActivityHeatmap } from "./components/charts/ActivityHeatmap";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import { LoginScreen } from "./components/ui/LoginScreen";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export function Dashboard() {
  const router = useRouter();
  const [range, setRange] = useState<TimeRange>('month');
  const { data: auth, isLoading: authLoading } = useAuth();
  const { data, isLoading } = useOverview(range, auth?.authenticated);
  const { data: recent } = useRecentScrobbles(20, auth?.authenticated);
  const { data: hours } = useActivityHours(range, auth?.authenticated);

  // redireciona pro perfil público quando autenticado
  useEffect(() => {
    if (auth?.authenticated && auth.slug) {
      router.replace(`/u/${auth.slug}`);
    }
  }, [auth, router]);

  if (authLoading) return <LoadingScreen message="verificando sessão..." />;
  if (!auth?.authenticated) return <LoginScreen />;

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
                value={data.total.toLocaleString("pt-BR")}
                sub="no período selecionado"
              />
              <StatCard
                label="faixas únicas"
                value={
                  new Set(data.topTracks.map((t) => t.trackSpotifyId)).size
                }
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

        {isLoading && <p className={styles.loading}>carregando...</p>}

        {recent && (
          <section className={styles.recent}>
            <TrackRow scrobbles={recent} />
          </section>
        )}
      </Container>
    </>
  );
}
