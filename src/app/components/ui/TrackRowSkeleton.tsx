import { Skeleton } from './Skeleton';
import styles from './TrackRow.module.css';

interface Props {
  rows?: number;
}

export function TrackRowSkeleton({ rows = 8 }: Props) {
  return (
    <div className={styles.wrapper}>
      <Skeleton height="0.7rem" width="10%" style={{ marginBottom: '1rem' }} />
      <div className={styles.list}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={styles.row}>
            <Skeleton width="24px" height="0.75rem" />
            <Skeleton width="56px" height="56px" borderRadius="6px" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
              <Skeleton height="0.95rem" width="70%" />
              <Skeleton height="0.8rem" width="45%" />
            </div>
            <Skeleton height="0.7rem" width="60px" />
          </div>
        ))}
      </div>
    </div>
  );
}