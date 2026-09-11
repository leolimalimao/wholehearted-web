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
        x: d.date.slice(0, 10),
        y: parseInt(d.plays),
      })),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>atividade ao longo do tempo</p>
      <div className={styles.chart}>
        <ResponsiveLine
          animate={false}
          data={chartData}
          margin={{ top: 10, right: 40, bottom: 50, left: 40 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, stacked: false }}
          curve="monotoneX"
          /* gradiente vertical sob a linha via defs SVG */
          defs={[
            {
              id: 'area-gradient',
              type: 'linearGradient',
              colors: [
                { offset: 0,   color: '#6C63FF', opacity: 0.35 },
                { offset: 100, color: '#6C63FF', opacity: 0 },
              ],
            },
          ]}
          fill={[{ match: '*', id: 'area-gradient' }]}
          colors={['#8680FF']}
          lineWidth={2.5}
          enablePoints={false}
          enableArea={true}
          areaOpacity={1} // controlado pelo gradiente acima
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: 5,
            tickRotation: 0,
            format: (value: string) => {
              if (!value) return '';
              const parts = String(value).split('-');
              if (parts.length >= 3) {
                return `${parts[2]}/${parts[1]}`;
              }
              return String(value);
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
          crosshairType="bottom"
          tooltip={({ point }) => (
            <div style={{
              background: '#13131A',
              border: '1px solid rgba(108,99,255,0.3)',
              borderRadius: 8,
              padding: '10px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: '#E8E8F0',
              minWidth: 140,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              <span style={{ color: '#6B6B80' }}>{String(point.data.x)}</span>
              <span style={{ color: '#9B8FFF', fontSize: 15, fontWeight: 600 }}>
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
            crosshair: {
              line: {
                stroke: '#6C63FF',
                strokeWidth: 1,
                strokeOpacity: 0.4,
              },
            },
          }}
        />
      </div>
    </div>
  );
}