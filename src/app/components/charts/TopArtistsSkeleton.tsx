import { Skeleton } from '../ui/Skeleton';
import styles from './TopArtistsChart.module.css';

export function TopArtistsSkeleton() {
  return (
    <div className={styles.wrapper}>
      <Skeleton height="0.7rem" width="20%" style={{ marginBottom: '1.5rem' }} />
      <div className={styles.grid}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardHeader}>
              <Skeleton height="1.1rem" width="24px" borderRadius="var(--radius-sm)" />
              <Skeleton height="52px" width="52px" borderRadius="50%" />
            </div>
            <div className={styles.cardBody}>
              <Skeleton height="0.95rem" width="80%" style={{ marginTop: '0.25rem' }} />
              <div className={styles.playsWrapper}>
                <Skeleton height="1.35rem" width="40%" />
                <Skeleton height="0.65rem" width="28px" style={{ marginTop: '0.25rem' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}