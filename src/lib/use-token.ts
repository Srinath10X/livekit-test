'use client';

import { useQuery } from '@tanstack/react-query';
import { tokenResponseSchema } from '@/lib/schemas';

export function useToken(identity: { room: string; username: string } | null) {
  return useQuery({
    queryKey: ['token', identity?.room, identity?.username],
    enabled: !!identity,
    queryFn: async () => {
      const params = new URLSearchParams({
        room: identity!.room,
        username: identity!.username,
      });
      const res = await fetch(`/api/token?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch token');
      }
      const json = await res.json();
      return tokenResponseSchema.parse(json);
    },
    staleTime: 1000 * 60 * 50,
    retry: 1,
  });
}
