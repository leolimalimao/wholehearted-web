import { Skeleton } from '../ui/Skeleton';
import styles from './TopArtistsChart.module.css';

export function TopArtistsSkeleton() {
  return (
    <div className={styles.wrapper}>
      <Skeleton height="0.7rem" width="20%" style={{ marginBottom: '1.5rem' }} />
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.card}>
            <Skeleton height="0.65rem" width="30%" />
            <Skeleton height="0.95rem" width="85%" style={{ marginTop: '0.5rem' }} />
            <Skeleton height="1.4rem" width="50%" style={{ marginTop: 'auto', paddingTop: '0.5rem' }} />
          </div>
        ))}
      </div>
    </div>
  );
}