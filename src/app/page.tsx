'use client';

import { useState } from 'react';
import { useOverview } from './hooks/useStats';
import { TimeRange } from './lib/types';

export default function Home() {
  const [range, setRange] = useState<TimeRange>('month');
  const { data, isLoading, isError } = useOverview(range);

  if (isLoading) return <p style={{ color: 'var(--color-muted)', padding: '2rem' }}>Carregando...</p>;
  if (isError) return <p style={{ color: 'var(--color-muted)', padding: '2rem' }}>Erro ao carregar dados. Backend está rodando?</p>;

  return (
    <main style={{ padding: '2rem', fontFamily: 'var(--font-display)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Leo Stats</h1>
      <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
        {data?.total} scrobbles no período
      </p>
    </main>
  );
}