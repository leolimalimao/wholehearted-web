'use client';

import { ResponsiveBar } from '@nivo/bar';
import { TopTrack } from '../../lib/types';
import styles from './TopTracksChart.module.css';

interface Props {
  data: TopTrack[];
}

export function TopTracksChart({ data }: Props) {
  const chartData = [...data]
    .reverse()
    .map((t) => ({
      track: t.trackName.length > 22 ? t.trackName.slice(0, 22) + '…' : t.trackName,
      plays: parseInt(t.plays),
      artist: t.artistName,
    }));

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>top faixas</p>
      <div className={styles.chart}>
        <ResponsiveBar
          data={chartData}
          keys={['plays']}
          indexBy="track"
          layout="horizontal"
          margin={{ top: 0, right: 40, bottom: 0, left: 160 }}
          padding={0.35}
          colors={['#6C63FF']}
          borderRadius={3}
          axisLeft={{
            tickSize: 0,
            tickPadding: 12,
          }}
          axisBottom={null}
          gridYValues={[]}
          enableGridX={false}
          enableLabel={true}
          labelSkipWidth={24}
          label={(d) => `${d.value}`}
          tooltip={({ data: d, value }) => (
            <div style={{
              background: '#13131A',
              border: '1px solid #6C63FF44',
              borderRadius: 8,
              padding: '10px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: '#E8E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              minWidth: 180,
              whiteSpace: 'nowrap', // <- garante que o texto não quebra linha
            }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{d.track}</span>
              <span style={{ color: '#6B6B80' }}>{d.artist}</span>
              <span style={{ color: '#6C63FF', marginTop: 2 }}>{value} plays</span>
            </div>
          )}
          theme={{
            axis: {
              ticks: {
                text: { fill: '#6B6B80', fontSize: 11, fontFamily: 'var(--font-mono)' },
              },
            },
            labels: {
              text: { fill: '#E8E8F0', fontSize: 11, fontFamily: 'var(--font-mono)' },
            },
          }}
        />
      </div>
    </div>
  );
}