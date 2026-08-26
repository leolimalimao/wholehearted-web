import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { TimeRange } from '../lib/types';

export function useOverview(range: TimeRange) {
  return useQuery({
    queryKey: ['overview', range],
    queryFn: () => api.overview(range),
  });
}

export function useRecentScrobbles(limit = 20) {
  return useQuery({
    queryKey: ['recent', limit],
    queryFn: () => api.recent(limit),
  });
}

export function useActivityHours(range: TimeRange) {
  return useQuery({
    queryKey: ['hours', range],
    queryFn: () => api.hours(range),
  });
}