'use client';

import { motion } from 'framer-motion';
import { Skeleton } from './Skeleton';
import styles from './StatCard.module.css';

interface Props {
  label: string;
  value?: string | number;
  sub?: string;
  isLoading?: boolean;
}

export function StatCard({ label, value, sub, isLoading = false }: Props) {
  if (isLoading) {
    return (
      <div className={styles.card}>
        <Skeleton height="0.7rem" width="60%" />
        <Skeleton height="2.5rem" width="80%" style={{ marginTop: '0.5rem' }} />
        <Skeleton height="0.75rem" width="40%" style={{ marginTop: '0.5rem' }} />
      </div>
    );
  }

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {sub && <p className={styles.sub}>{sub}</p>}
    </motion.div>
  );
}