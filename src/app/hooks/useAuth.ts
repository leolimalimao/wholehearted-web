'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useAuth() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: () => api.me(),
    retry: false,           // não tenta de novo se der 401
    staleTime: 5 * 60 * 1000, // considera fresco por 5 minutos
  });
}