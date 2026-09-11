'use client';

import { Scrobble } from '../../lib/types';
import { isPlaybackActive, formatRelativeTime } from '../../lib/scrobble-status';
import styles from './ProfileHero.module.css';
import { Skeleton } from '../../components/ui/Skeleton';

interface Props {
  displayName: string;
  slug: string;
  totalScrobbles?: number;
  recent?: Scrobble[];
  isLoading?: boolean;
}

export function ProfileHero({ displayName, slug, totalScrobbles, recent, isLoading }: Props) {
  const latestScrobble = recent?.[0];
  const isOnline = latestScrobble ? isPlaybackActive(latestScrobble.playedAt) : false;
  const relativeTime = latestScrobble ? formatRelativeTime(latestScrobble.playedAt) : '';

  // Gera as iniciais para o avatar monograma
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <section className={styles.hero} aria-label="Perfil do ouvinte">
      {/* Fundo com iluminação atmosférica */}
      <div className={styles.ambientGlow} aria-hidden="true">
        <div className={styles.glowViolet} />
        <div className={styles.glowIndigo} />
        <div className={styles.glowEmerald} />
      </div>

      <div className={styles.content}>
        {/* Avatar + Identidade */}
        <div className={styles.identity}>
          <div className={styles.avatarRing} aria-hidden="true">
            <div className={styles.avatar}>{initials}</div>
          </div>

          <div className={styles.meta}>
            <h1 className={styles.name}>{displayName}</h1>
            <p className={styles.slugLine}>
              <span className={styles.slugBase}>wholehearted.stats</span>
              <span className={styles.slugAccent}>/u/{slug}</span>
            </p>
          </div>
        </div>

        {/* Coluna direita: total + last played */}
        <div className={styles.stats}>
          {/* Métrica mestre: total de scrobbles */}
          <div className={styles.totalBlock}>
            {isLoading ? (
              <Skeleton height="3.5rem" width="140px" />
            ) : (
              <>
                <span className={styles.totalNumber}>
                  {totalScrobbles?.toLocaleString('pt-BR') ?? '—'}
                </span>
                <span className={styles.totalLabel}>scrobbles totais</span>
              </>
            )}
          </div>

          {/* Widget: Última faixa ouvida ou tocando agora */}
          {latestScrobble && (
            <div
              className={styles.nowPlaying}
              aria-label={isOnline ? 'Ouvindo agora' : `Último som ouvido ${relativeTime}`}
            >
              <div className={styles.nowPlayingEq} aria-hidden="true">
                <span className={isOnline ? styles.eqBar : styles.eqBarStatic} />
                <span className={isOnline ? styles.eqBar : styles.eqBarStatic} />
                <span className={isOnline ? styles.eqBar : styles.eqBarStatic} />
                <span className={isOnline ? styles.eqBar : styles.eqBarStatic} />
              </div>
              {latestScrobble.albumImageUrl && (
                <img
                  src={latestScrobble.albumImageUrl}
                  alt={`${latestScrobble.trackName} — ${latestScrobble.artistName}`}
                  className={styles.nowPlayingCover}
                  loading="lazy"
                />
              )}
              <div className={styles.nowPlayingText}>
                <span
                  className={`${styles.nowPlayingStatus} ${isOnline ? styles.statusOnline : styles.statusOffline}`}
                >
                  {isOnline ? 'ouvindo agora' : `último som · ${relativeTime}`}
                </span>
                <span className={styles.nowPlayingTrack}>{latestScrobble.trackName}</span>
                <span className={styles.nowPlayingArtist}>{latestScrobble.artistName}</span>
              </div>
            </div>
          )}

          {/* Skeleton enquanto carrega o recent */}
          {isLoading && !latestScrobble && (
            <Skeleton height="52px" width="260px" />
          )}
        </div>
      </div>

      <div className={styles.divider} aria-hidden="true" />
    </section>
  );
}
