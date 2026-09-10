import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { TimeRange } from '../lib/types';

export function useOverview(range: TimeRange, enabled = false) {
  return useQuery({
    queryKey: ['overview', range],
    queryFn: () => api.overview(range),
    enabled, // só dispara quando true
  });
}

export function useRecentScrobbles(limit = 20, enabled = false) {
  return useQuery({
    queryKey: ['recent', limit],
    queryFn: () => api.recent(limit),
    enabled,
  });
}

export function useActivityHours(range: TimeRange, enabled = false) {
  return useQuery({
    queryKey: ['hours', range],
    queryFn: () => api.hours(range),
    enabled,
  });
}

export function useActivityTimeline(range: TimeRange = 'year', enabled = false) {
  return useQuery({
    queryKey: ['timeline', range],
    queryFn: () => api.timeline(range),
    enabled,
  });
}