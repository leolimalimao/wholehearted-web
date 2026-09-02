'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useAuth() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: () => api.me(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}