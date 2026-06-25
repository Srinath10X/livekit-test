import { create } from 'zustand';
import type { JoinValues } from '@/lib/schemas';

interface RoomState {
  joined: boolean;
  identity: { room: string; username: string } | null;
  chatOpen: boolean;
  join: (v: JoinValues) => void;
  leave: () => void;
  toggleChat: () => void;
}

export const useRoomStore = create<RoomState>()((set) => ({
  joined: false,
  identity: null,
  chatOpen: false,
  join: (v) => set({ joined: true, identity: { room: v.room, username: v.username } }),
  leave: () => set({ joined: false, identity: null, chatOpen: false }),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
}));
