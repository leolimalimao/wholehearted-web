'use client';

import Image from 'next/image';
import { Scrobble } from '../../lib/types';
import { isPlaybackActive, formatRelativeTime } from '../../lib/scrobble-status';
import styles from './TrackRow.module.css';

interface Props {
  scrobbles: Scrobble[];
}

export function TrackRow({ scrobbles }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.title}>recentes</p>
        <span className={styles.count}>{scrobbles.length} faixas</span>
      </div>
      <div className={styles.list}>
        {scrobbles.map((s, i) => {
          const label = formatRelativeTime(s.playedAt);
          const isFirst = i === 0;
          const isNow = isFirst && isPlaybackActive(s.playedAt);
          const spotifyUrl = `https://open.spotify.com/track/${s.trackSpotifyId}`;

          return (
            <a
              key={s.id}
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.row} ${isFirst ? styles.rowFirst : ''}`}
              aria-label={`Abrir ${s.trackName} de ${s.artistName} no Spotify`}
            >
              <span className={styles.rank}>{i + 1}</span>

              <div className={styles.coverWrapper}>
                {s.albumImageUrl && (
                  <Image
                    src={s.albumImageUrl}
                    alt={s.trackName}
                    fill
                    sizes="56px"
                    className={styles.cover}
                    unoptimized
                  />
                )}
              </div>

              <div className={styles.info}>
                <p className={styles.trackName}>{s.trackName}</p>
                <p className={styles.artistName}>{s.artistName}</p>
              </div>

              <div className={styles.timeBlock}>
                {isNow && (
                  <span className={styles.liveBadge} aria-label="Ouvindo agora">
                    <span className={styles.liveDot} aria-hidden="true" />
                    ao vivo
                  </span>
                )}
                <span className={styles.time}>{label}</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}