'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Globals } from '@react-spring/web';
import { createStringInterpolator } from '@react-spring/shared';

if (typeof window !== 'undefined') {
  const origStringInterpolator = createStringInterpolator;
  Globals.assign({
    createStringInterpolator: (config: any) => {
      try {
        return origStringInterpolator(config);
      } catch {
        return (input: number) =>
          input >= 1 ? config.output[config.output.length - 1] : config.output[0];
      }
    },
  });
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // considera dados frescos por 5 minutos
        retry: 1,
      },
    },
  }));

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}