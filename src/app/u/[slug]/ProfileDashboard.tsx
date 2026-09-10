"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TimeRange } from "../../lib/types";
import { api } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { Container } from "../../components/layout/Container";
import { RangeSelector } from "../../components/ui/RangeSelector";
import { StatCard } from "../../components/ui/StatCard";
import { ActivityCalendar } from "../../components/charts/ActivityCalendar";
import { TopTracksChart } from "../../components/charts/TopTracksChart";
import { TopArtistsChart } from "../../components/charts/TopArtistsChart";
import { TimelineChart } from "../../components/charts/TimelineChart";
import { ActivityHeatmap } from "../../components/charts/ActivityHeatmap";
import { TrackRow } from "../../components/ui/TrackRow";
import { LogoutButton } from "../../components/ui/LogoutButton";
import { ChartSkeleton } from "../../components/charts/ChartSkeleton";
import { TrackRowSkeleton } from "../../components/ui/TrackRowSkeleton";
import { TopArtistsSkeleton } from "../../components/charts/TopArtistsSkeleton";
import { Skeleton } from "../../components/ui/Skeleton";
import styles from "./profile.module.css";

interface Props {
  slug: string;
  displayName: string;
}

export function ProfileDashboard({ slug, displayName }: Props) {
  const [range, setRange] = useState<TimeRange>("month");
  const { data: auth } = useAuth();
  const isOwner = auth?.authenticated && auth.slug === slug;

  const { data, isLoading: overviewLoading } = useQuery({
    queryKey: ["public-overview", slug, range],
    queryFn: () => api.publicOverview(slug, range),
  });

  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ["public-recent", slug],
    queryFn: () => api.publicRecent(slug),
  });

  const { data: hours, isLoading: hoursLoading } = useQuery({
    queryKey: ["public-hours", slug, range],
    queryFn: () => api.publicHours(slug, range),
  });

  const { data: yearTimeline, isLoading: timelineLoading } = useQuery({
    queryKey: ["public-timeline", slug, "year"],
    queryFn: () => api.publicTimeline(slug, "year"),
  });

  return (
    <>
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

          <div className={styles.total}>
            {overviewLoading ? (
              <Skeleton height="3rem" width="120px" />
            ) : (
              <>
                <span className={styles.totalNumber}>
                  {data?.total.toLocaleString("pt-BR")}
                </span>
                <span className={styles.totalLabel}>scrobbles</span>
              </>
            )}
          </div>
        </Container>
      </div>

      <Container>
        <section className={styles.controls}>
          <RangeSelector value={range} onChange={setRange} />
        </section>

        {/* stat cards */}
        <section className={styles.statGrid}>
          <StatCard
            label="scrobbles"
            value={data?.total.toLocaleString("pt-BR")}
            sub="no período selecionado"
            isLoading={overviewLoading}
          />
          <StatCard
            label="faixas únicas"
            value={
              data?.uniqueTracks !== undefined
                ? data.uniqueTracks.toLocaleString("pt-BR")
                : data
                ? new Set(data.topTracks.map((t) => t.trackSpotifyId)).size.toLocaleString("pt-BR")
                : undefined
            }
            sub="músicas distintas"
            isLoading={overviewLoading}
          />
          <StatCard
            label="artistas únicos"
            value={
              data?.uniqueArtists !== undefined
                ? data.uniqueArtists.toLocaleString("pt-BR")
                : data?.topArtists.length.toLocaleString("pt-BR")
            }
            sub="artistas diferentes"
            isLoading={overviewLoading}
          />
          <StatCard
            label="sequência ativa"
            value={
              data?.streak !== undefined
                ? `${data.streak} ${data.streak === 1 ? 'dia' : 'dias'}`
                : undefined
            }
            sub={data?.streak ? "consecutivos ouvindo" : "nenhum dia consecutivo"}
            isLoading={overviewLoading}
          />
        </section>

        {/* activity calendar estilo github */}
        <div className={styles.waveform}>
          {timelineLoading && overviewLoading ? (
            <Skeleton height="140px" width="100%" />
          ) : (yearTimeline ?? data?.perDay) ? (
            <ActivityCalendar data={yearTimeline ?? data!.perDay} />
          ) : null}
        </div>

        {/* gráficos */}
        <section className={styles.charts}>
          {overviewLoading ? (
            <TopArtistsSkeleton />
          ) : data?.topArtists ? (
            <TopArtistsChart data={data.topArtists} recent={recent} />
          ) : null}

          {overviewLoading ? (
            <ChartSkeleton height={320} bars={10} />
          ) : data?.topTracks ? (
            <TopTracksChart data={data.topTracks} />
          ) : null}

          {overviewLoading ? (
            <ChartSkeleton height={220} bars={30} />
          ) : data?.perDay ? (
            <TimelineChart data={data.perDay} />
          ) : null}

          {hoursLoading ? (
            <ChartSkeleton height={180} bars={24} />
          ) : hours ? (
            <ActivityHeatmap data={hours} />
          ) : null}
        </section>

        {/* feed recente */}
        {recentLoading ? (
          <section className={styles.recent}>
            <TrackRowSkeleton rows={8} />
          </section>
        ) : recent ? (
          <section className={styles.recent}>
            <TrackRow scrobbles={recent} />
          </section>
        ) : null}
      </Container>
    </>
  );
}
