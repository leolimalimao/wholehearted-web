'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Scrobble, TopArtist } from '../../lib/types';
import styles from './TopArtistsChart.module.css';

interface Props {
  data: TopArtist[];
  recent?: Scrobble[];
}

function getInitials(name?: string | null) {
  if (!name || !name.trim()) return '?';
  const clean = name.trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2 && parts[0][0] && parts[1][0]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

function ArtistAvatar({ src, name }: { src?: string | null; name: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={styles.avatarFallback} aria-hidden="true">
        {getInitials(name)}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name || 'Artista'}
      fill
      unoptimized
      sizes="52px"
      className={styles.avatarImage}
      onError={() => setError(true)}
    />
  );
}

export function TopArtistsChart({ data, recent }: Props) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>top artistas</p>
      <div className={styles.grid}>
        {data.map((artist, i) => {
          const imageSrc =
            artist.imageUrl ??
            recent?.find(
              (s) => s.artistName.toLowerCase() === artist.artistName.toLowerCase(),
            )?.albumImageUrl;

          return (
            <motion.div
              key={artist.artistName}
              className={styles.card}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.04,
                ease: 'easeOut',
              }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.rank}>#{i + 1}</span>
                <div className={styles.avatarWrapper}>
                  <ArtistAvatar src={imageSrc} name={artist.artistName} />
                </div>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.name} title={artist.artistName}>
                  {artist.artistName}
                </p>
                <div className={styles.playsWrapper}>
                  <p className={styles.plays}>
                    {parseInt(artist.plays).toLocaleString('pt-BR')}
                  </p>
                  <p className={styles.playsLabel}>plays</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}