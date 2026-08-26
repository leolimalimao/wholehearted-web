'use client';

import { ResponsiveBar } from '@nivo/bar';
import { HourActivity } from '../../lib/types';
import styles from './ActivityHeatmap.module.css';

interface Props {
  data: HourActivity[];
}

// Preenche horas sem dados com 0 pra o gráfico não ter gaps
function fillAllHours(data: HourActivity[]): { hour: string; plays: number }[] {
  const map = new Map(data.map((d) => [parseInt(d.hour), parseInt(d.plays)]));
  return Array.from({ length: 24 }, (_, i) => ({
    hour: String(i).padStart(2, '0') + 'h',
    plays: map.get(i) ?? 0,
  }));
}

export function ActivityHeatmap({ data }: Props) {
  if (!data?.length) return null;

  const filled = fillAllHours(data);
  const max = Math.max(...filled.map((d) => d.plays));

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>atividade por hora do dia</p>
      <div className={styles.chart}>
        <ResponsiveBar
          data={filled}
          keys={['plays']}
          indexBy="hour"
          margin={{ top: 10, right: 10, bottom: 30, left: 10 }}
          padding={0.2}
          colors={({ data: d }) => {
            // intensidade da cor baseada no valor — mais plays = mais vívido
            const intensity = max > 0 ? d.plays / max : 0;
            const alpha = Math.max(0.15, intensity);
            return `rgba(108, 99, 255, ${alpha})`;
          }}
          borderRadius={3}
          axisLeft={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            // mostra só meia-noite, manhã, tarde, noite
            tickValues: ['00h', '06h', '12h', '18h', '23h'],
          }}
          enableGridY={false}
          enableLabel={false}
          tooltip={({ data: d, value }) => (
            <div style={{
              background: '#13131A',
              border: '1px solid #6C63FF44',
              borderRadius: 8,
              padding: '10px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: '#E8E8F0',
              minWidth: 120,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              <span style={{ color: '#6B6B80' }}>{d.hour}</span>
              <span style={{ color: '#6C63FF', fontSize: 15, fontWeight: 600 }}>
                {value} plays
              </span>
            </div>
          )}
          theme={{
            axis: {
              ticks: {
                text: { fill: '#6B6B80', fontSize: 11, fontFamily: 'JetBrains Mono' },
              },
            },
          }}
        />
      </div>
      <div className={styles.periods}>
        <span className={styles.period}>meia-noite</span>
        <span className={styles.period}>manhã</span>
        <span className={styles.period}>tarde</span>
        <span className={styles.period}>noite</span>
      </div>
    </div>
  );
}