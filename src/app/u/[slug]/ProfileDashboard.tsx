"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TimeRange } from "../../lib/types";
import { api } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { Container } from "../../components/layout/Container";
import { RangeSelector } from "../../components/ui/RangeSelector";
import { StatCard } from "../../components/ui/StatCard";
import { WaveForm } from "../../components/charts/WaveForm";
import { TopTracksChart } from "../../components/charts/TopTracksChart";
import { TopArtistsChart } from "../../components/charts/TopArtistsChart";
import { TimelineChart } from "../../components/charts/TimelineChart";
import { ActivityHeatmap } from "../../components/charts/ActivityHeatmap";
import { TrackRow } from "../../components/ui/TrackRow";
import { LogoutButton } from "../../components/ui/LogoutButton";
import styles from "./profile.module.css";

interface Props {
  slug: string;
  displayName: string;
}

export function ProfileDashboard({ slug, displayName }: Props) {
  const [range, setRange] = useState<TimeRange>("month");

  const { data: auth } = useAuth();
  const isOwner = auth?.authenticated && auth.slug === slug;

  const { data, isLoading } = useQuery({
    queryKey: ["public-overview", slug, range],
    queryFn: () => api.publicOverview(slug, range),
  });

  const { data: recent } = useQuery({
    queryKey: ["public-recent", slug],
    queryFn: () => api.publicRecent(slug),
  });

  const { data: hours } = useQuery({
    queryKey: ["public-hours", slug, range],
    queryFn: () => api.publicHours(slug, range),
  });

  return (
    <>
      {/* header do perfil */}
      <div className={styles.hero}>
        <Container>
          <div className={styles.heroTop}>
            <div>
              <h1 className={styles.name}>{displayName}</h1>
              <p className={styles.slugLine}>
                wholehearted.stats
                <span className={styles.accent}>/u/{slug}</span>
              </p>
            </div>
            {isOwner && <LogoutButton />}
          </div>

          {data && (
            <div className={styles.total}>
              <span className={styles.totalNumber}>
                {data.total.toLocaleString("pt-BR")}
              </span>
              <span className={styles.totalLabel}>scrobbles</span>
            </div>
          )}
        </Container>
      </div>

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
