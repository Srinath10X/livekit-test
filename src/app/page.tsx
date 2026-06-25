'use client';

import { useRoomStore } from '@/store/room-store';
import { JoinForm } from '@/components/join-form';
import { MeetingRoom } from '@/components/meeting-room';

export default function Home() {
  const joined = useRoomStore((s) => s.joined);

  return (
    <main className="h-screen">
      {joined ? <MeetingRoom /> : <JoinForm />}
    </main>
  );
}
