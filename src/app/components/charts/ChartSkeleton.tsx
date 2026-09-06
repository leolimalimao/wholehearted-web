import { Skeleton } from '../ui/Skeleton';
import styles from './ChartSkeleton.module.css';

// alturas variadas pra parecer um gráfico real
const BAR_HEIGHTS = [60, 85, 45, 100, 70, 55, 90, 40, 75, 65];

interface Props {
  height?: number;
  bars?: number;
}

export function ChartSkeleton({ height = 200, bars = 10 }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>
        <Skeleton height="0.7rem" width="30%" />
      </div>
      <div className={styles.bars} style={{ height }}>
        {Array.from({ length: bars }).map((_, i) => (
          <Skeleton
            key={i}
            className={styles.bar}
            height={`${BAR_HEIGHTS[i % BAR_HEIGHTS.length]}%`}
          />
        ))}
      </div>
    </div>
  );
}