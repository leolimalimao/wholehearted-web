'use client';

import { motion } from 'framer-motion';
import { DayActivity } from '../../lib/types';
import styles from './WaveForm.module.css';

interface Props {
  data: DayActivity[];
}

export function WaveForm({ data }: Props) {
  if (!data?.length) return null;

  const max = Math.max(...data.map((d) => parseInt(d.plays)));

  return (
    <div className={styles.wrapper}>
      {data.map((day, i) => {
        const height = max > 0 ? (parseInt(day.plays) / max) * 100 : 0;
        return (
          <motion.div
            key={day.date}
            className={styles.bar}
            style={{ height: `${Math.max(height, 3)}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{
              duration: 0.4,
              delay: i * 0.01, // stagger sutil entre as barras
              ease: 'easeOut',
            }}
            title={`${day.date}: ${day.plays} plays`}
          />
        );
      })}
    </div>
  );
}