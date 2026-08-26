'use client';

import { TimeRange } from '../../lib/types';
import styles from './RangeSelector.module.css';

const RANGES: { value: TimeRange; label: string }[] = [
  { value: 'week',    label: '7d' },
  { value: 'month',   label: '30d' },
  { value: '3months', label: '3m' },
  { value: '6months', label: '6m' },
  { value: 'year',    label: '1a' },
  { value: 'all',     label: 'tudo' },
];

interface Props {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function RangeSelector({ value, onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      {RANGES.map((r) => (
        <button
          key={r.value}
          className={`${styles.button} ${value === r.value ? styles.active : ''}`}
          onClick={() => onChange(r.value)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}