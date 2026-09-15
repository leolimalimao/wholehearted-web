"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TimeRange } from "../../lib/types";
import { api } from "../../lib/api";
import { isPlaybackActive } from "../../lib/scrobble-status";
import { Container } from "../../components/layout/Container";
import { Header } from "../../components/layout/Header";
import { ProfileHero } from "./ProfileHero";
import { RangeSelector } from "../../components/ui/RangeSelector";
import { StatCard } from "../../components/ui/StatCard";
import { ActivityCalendar, ActivityCalendarSkeleton } from "../../components/charts/ActivityCalendar";
import { TopTracksChart } from "../../components/charts/TopTracksChart";
import { TopArtistsChart } from "../../components/charts/TopArtistsChart";
import { TimelineChart } from "../../components/charts/TimelineChart";
import { ActivityHeatmap } from "../../components/charts/ActivityHeatmap";
import { TrackRow } from "../../components/ui/TrackRow";
import { ChartSkeleton } from "../../components/charts/ChartSkeleton";
import { TrackRowSkeleton } from "../../components/ui/TrackRowSkeleton";
import { TopArtistsSkeleton } from "../../components/charts/TopArtistsSkeleton";
import styles from "./profile.module.css";

interface Props {
  slug: string;
  displayName: string;
  avatarUrl?: string | null;
}

export function ProfileDashboard({ slug, displayName, avatarUrl }: Props) {
  const [range, setRange] = useState<TimeRange>("month");

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

  const calendarLoading = overviewLoading || timelineLoading;

  // Média diária: total / quantidade de dias com atividade no período
  // Usa perDay para o span real em vez de hardcodar os dias do range
  const dailyAvg = (() => {
    if (!data?.total || !data?.perDay?.length) return undefined;
    const rangeDays: Record<TimeRange, number> = {
      week: 7, month: 30, '3months': 90, '6months': 180, year: 365, all: 0,
    };
    const days = range === 'all'
      ? data.perDay.length  // usa a janela real de dias com scrobbles
      : rangeDays[range];
    if (!days) return undefined;
    return Math.round(data.total / days);
  })();

  const isOnline = isPlaybackActive(recent?.[0]?.playedAt);

  return (
    <>
      {/* Header glassmorphic com branding e ações */}
      <Header slug={slug} isOnline={isOnline} />

      {/* Hero musical: avatar, iluminação atmosférica, total + last played */}
      <ProfileHero
        displayName={displayName}
        slug={slug}
        avatarUrl={avatarUrl}
        totalScrobbles={data?.total}
        recent={recent}
        isLoading={overviewLoading || recentLoading}
      />

      <Container>
        {/* Seletor de período */}
        <section className={styles.controls}>
          <RangeSelector value={range} onChange={setRange} />
        </section>

        <section className={styles.statGrid}>
          <StatCard
            label="média diária"
            value={dailyAvg !== undefined ? `${dailyAvg.toLocaleString('pt-BR')}` : undefined}
            sub="plays por dia no período"
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
          {calendarLoading ? (
            <ActivityCalendarSkeleton />
          ) : (yearTimeline ?? data?.perDay) ? (
            <ActivityCalendar data={yearTimeline ?? data!.perDay} />
          ) : null}
        </div>

        {/* gráficos */}
        <section className={styles.charts}>
          {overviewLoading ? (
            <TopArtistsSkeleton />
          ) : data?.topArtists?.length ? (
            <TopArtistsChart key={`artists-${range}`} data={data.topArtists} recent={recent} />
          ) : null}

          {overviewLoading ? (
            <ChartSkeleton height={320} bars={10} />
          ) : data?.topTracks?.length ? (
            <TopTracksChart key={`tracks-${range}`} data={data.topTracks} />
          ) : null}

          {overviewLoading ? (
            <ChartSkeleton height={220} bars={30} />
          ) : data?.perDay?.length ? (
            <TimelineChart key={`timeline-${range}`} data={data.perDay} />
          ) : null}

          {hoursLoading ? (
            <ChartSkeleton height={180} bars={24} />
          ) : hours?.length ? (
            <ActivityHeatmap key={`heatmap-${range}`} data={hours} />
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
