'use client';

import { ResponsiveLine } from '@nivo/line';
import { DayActivity } from '../../lib/types';
import styles from './TimelineChart.module.css';

interface Props {
  data: DayActivity[];
}

export function TimelineChart({ data }: Props) {
  if (!data?.length) return null;

  const chartData = [
    {
      id: 'scrobbles',
      data: data.map((d) => ({
        x: d.date.slice(0, 10), // só a data, sem hora
        y: parseInt(d.plays),
      })),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>atividade ao longo do tempo</p>
      <div className={styles.chart}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 10, right: 40, bottom: 50, left: 40 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, stacked: false }}
          curve="monotoneX"
          colors={['#6C63FF']}
          lineWidth={2}
          enablePoints={false}
          enableArea={true}
          areaOpacity={0.08}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: 5,
            tickRotation: 0,
            format: (value: string) => {
              const [, month, day] = value.split('-');
              return `${day}/${month}`;
            },
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: 4,
          }}
          gridYValues={4}
          enableGridX={false}
          useMesh={true}
          tooltip={({ point }) => (
            <div style={{
              background: '#13131A',
              border: '1px solid #6C63FF44',
              borderRadius: 8,
              padding: '10px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: '#E8E8F0',
              minWidth: 140,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              <span style={{ color: '#6B6B80' }}>{String(point.data.x)}</span>
              <span style={{ color: '#6C63FF', fontSize: 15, fontWeight: 600 }}>
                {String(point.data.y)} plays
              </span>
            </div>
          )}
          theme={{
            grid: {
              line: { stroke: '#1E1E2E', strokeWidth: 1 },
            },
            axis: {
              ticks: {
                text: { fill: '#6B6B80', fontSize: 11, fontFamily: 'JetBrains Mono' },
              },
            },
          }}
        />
      </div>
    </div>
  );
}