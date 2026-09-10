'use client';

import { motion } from 'framer-motion';
import { TopArtist } from '../../lib/types';
import styles from './TopArtistsChart.module.css';

interface Props {
  data: TopArtist[];
}

export function TopArtistsChart({ data }: Props) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>top artistas</p>
      <div className={styles.grid}>
        {data.map((artist, i) => (
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
            <img
              src={`https://via.placeholder.com/50?text=${encodeURIComponent(artist.artistName)}`}
              alt={artist.artistName}
              className={styles.image}
            />
            <span className={styles.rank}>#{i + 1}</span>
            <p className={styles.name}>{artist.artistName}</p>
            <p className={styles.plays}>{parseInt(artist.plays).toLocaleString('pt-BR')}</p>
            <p className={styles.playsLabel}>plays</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}