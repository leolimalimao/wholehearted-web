'use client';

import Image from 'next/image';
import { Scrobble } from '../../lib/types';
import styles from './TrackRow.module.css';

interface Props {
  scrobbles: Scrobble[];
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);

  if (diffMin < 1) return 'agora';
  if (diffMin < 60) return `${diffMin}min atrás`;
  if (diffH < 24) return `${diffH}h atrás`;

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TrackRow({ scrobbles }: Props) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>recentes</p>
      <div className={styles.list}>
        {scrobbles.map((s, i) => (
          <div key={s.id} className={styles.row}>
            <span className={styles.rank}>{i + 1}</span>

            <div className={styles.coverWrapper}>
              {s.albumImageUrl && (
                <Image
                  src={s.albumImageUrl}
                  alt={s.trackName}
                  fill
                  sizes="56px"
                  className={styles.cover}
                />
              )}
            </div>

            <div className={styles.info}>
              <p className={styles.trackName}>{s.trackName}</p>
              <p className={styles.artistName}>{s.artistName}</p>
            </div>

            <span className={styles.time}>{formatDate(s.playedAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}