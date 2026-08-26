'use client';

import { motion } from 'framer-motion';
import styles from './StatCard.module.css';

interface Props {
  label: string;
  value: string | number;
  sub?: string;
}

export function StatCard({ label, value, sub }: Props) {
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