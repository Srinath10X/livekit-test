'use client';

import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  ControlBar,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useRoomStore } from '@/store/room-store';
import { useToken } from '@/lib/use-token';
import { ChatPanel } from '@/components/chat-panel';

function RoomConference() {
  const toggleChat = useRoomStore((s) => s.toggleChat);
  const chatOpen = useRoomStore((s) => s.chatOpen);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <>
      <header className="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
        <span className="font-semibold">Meet</span>
        <button
          type="button"
          onClick={toggleChat}
          className="rounded-md bg-neutral-800 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-700"
        >
          {chatOpen ? 'Hide chat' : 'Show chat'}
        </button>
      </header>
      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1">
            <GridLayout tracks={tracks}>
              <ParticipantTile />
            </GridLayout>
          </div>
          <ControlBar />
        </div>
        {chatOpen && <ChatPanel />}
      </div>
      <RoomAudioRenderer />
    </>
  );
}

export function MeetingRoom() {
  const identity = useRoomStore((s) => s.identity);
  const leave = useRoomStore((s) => s.leave);
  const { data, isLoading, error } = useToken(identity);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-neutral-400">
        Connecting…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-400">
          {error instanceof Error ? error.message : 'Failed to join the room.'}
        </p>
        <button
          type="button"
          onClick={leave}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-500"
        >
          Leave
        </button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={data.token}
      serverUrl={data.serverUrl}
      connect
      audio
      video
      onDisconnected={() => useRoomStore.getState().leave()}
      data-lk-theme="default"
      className="flex h-screen flex-col"
    >
      <RoomConference />
    </LiveKitRoom>
  );
}
