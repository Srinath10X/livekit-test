"use client";

import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  LayoutContextProvider,
  useCreateLayoutContext,
  useLayoutContext,
  usePinnedTracks,
  FocusLayout,
  FocusLayoutContainer,
  CarouselLayout,
  useTracks,
  useParticipants,
  useLocalParticipant,
  useRoomContext,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  MonitorUp,
  MessageSquare,
  PhoneOff,
  Users,
  Loader2,
  WifiOff,
  ArrowLeft,
} from "lucide-react";
import { useRoomStore } from "@/store/room-store";
import { useToken } from "@/lib/use-token";
import { ChatPanel, ChatProvider } from "@/components/chat-panel";

function Topbar() {
  const room = useRoomStore((s) => s.identity?.room ?? "");
  const participants = useParticipants();
  const n = participants.length;

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-panel px-3 sm:px-4">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent-solid text-on-accent">
        <VideoIcon size={15} strokeWidth={2.4} />
      </span>
      <span className="hidden text-sm font-semibold tracking-tight text-ink sm:inline">
        meet<span className="text-faint">.srinath</span>
      </span>

      {/* room readout */}
      <span className="flex min-w-0 items-center gap-2 rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[12.5px]">
        <span
          aria-hidden
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-pulse-ring"
        />
        <span className="truncate text-muted">
          <span className="text-faint">#</span> {room}
        </span>
      </span>

      {/* connection · peers */}
      <span className="ml-auto flex items-center gap-2.5 font-mono text-[12.5px] text-muted sm:gap-3">
        <span className="hidden items-center gap-1.5 sm:flex">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          live
        </span>
        <span aria-hidden className="hidden text-line-bright sm:inline">
          ·
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={14} />
          <span className="tabular-nums">{n}</span> peer{n === 1 ? "" : "s"}
        </span>
      </span>
    </header>
  );
}

function CtrlButton({
  label,
  onClick,
  active,
  variant = "neutral",
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  variant?: "neutral" | "danger" | "leave";
  children: React.ReactNode;
}) {
  const base =
    "grid h-12 w-12 place-items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
  const styles =
    variant === "leave"
      ? "border-transparent bg-danger text-white hover:bg-danger/85"
      : variant === "danger"
        ? "border-danger/30 bg-danger/15 text-danger hover:bg-danger/25"
        : active
          ? "border-accent/35 bg-accent/15 text-accent hover:bg-accent/25"
          : "border-line bg-surface text-ink hover:border-line-bright hover:bg-surface-2";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={variant === "leave" ? undefined : active}
      title={label}
      className={`${base} ${styles}`}
    >
      {children}
    </button>
  );
}

function Controls() {
  const {
    localParticipant,
    isMicrophoneEnabled,
    isCameraEnabled,
    isScreenShareEnabled,
  } = useLocalParticipant();
  const room = useRoomContext();
  const chatOpen = useRoomStore((s) => s.chatOpen);
  const toggleChat = useRoomStore((s) => s.toggleChat);

  return (
    <div className="flex shrink-0 items-center justify-center gap-2 border-t border-line bg-panel px-3 py-3 sm:gap-3">
      <CtrlButton
        label={isMicrophoneEnabled ? "Mute microphone" : "Unmute microphone"}
        variant={isMicrophoneEnabled ? "neutral" : "danger"}
        onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
      >
        {isMicrophoneEnabled ? <Mic size={19} /> : <MicOff size={19} />}
      </CtrlButton>

      <CtrlButton
        label={isCameraEnabled ? "Turn off camera" : "Turn on camera"}
        variant={isCameraEnabled ? "neutral" : "danger"}
        onClick={() => localParticipant.setCameraEnabled(!isCameraEnabled)}
      >
        {isCameraEnabled ? <VideoIcon size={19} /> : <VideoOff size={19} />}
      </CtrlButton>

      <CtrlButton
        label={isScreenShareEnabled ? "Stop sharing" : "Share screen"}
        active={isScreenShareEnabled}
        onClick={() =>
          localParticipant.setScreenShareEnabled(!isScreenShareEnabled)
        }
      >
        <MonitorUp size={19} />
      </CtrlButton>

      <CtrlButton label="Toggle chat" active={chatOpen} onClick={toggleChat}>
        <MessageSquare size={19} />
      </CtrlButton>

      <span aria-hidden className="mx-1 h-7 w-px bg-line" />

      <CtrlButton label="Leave call" variant="leave" onClick={() => room.disconnect()}>
        <PhoneOff size={19} />
      </CtrlButton>
    </div>
  );
}

function Stage() {
  const layoutContext = useLayoutContext();
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  // pinned/focused track drives the focus layout; everything else goes to the rail
  const focusTrack = usePinnedTracks(layoutContext)[0];
  const carousel = focusTrack
    ? tracks.filter(
        (t) =>
          t.participant.identity !== focusTrack.participant.identity ||
          t.source !== focusTrack.source,
      )
    : tracks;

  return (
    <div className="min-h-0 flex-1 bg-bg p-2 sm:p-3">
      {focusTrack ? (
        <FocusLayoutContainer className="h-full">
          <CarouselLayout tracks={carousel}>
            <ParticipantTile />
          </CarouselLayout>
          <FocusLayout trackRef={focusTrack} />
        </FocusLayoutContainer>
      ) : (
        <GridLayout tracks={tracks}>
          <ParticipantTile />
        </GridLayout>
      )}
    </div>
  );
}

function RoomConference() {
  const chatOpen = useRoomStore((s) => s.chatOpen);
  const layoutContext = useCreateLayoutContext();

  return (
    <LayoutContextProvider value={layoutContext}>
      <ChatProvider>
        <Topbar />

        <div className="flex min-h-0 flex-1 flex-col">
          <Stage />
          <Controls />
        </div>

        {chatOpen && <ChatPanel />}
        <RoomAudioRenderer />
      </ChatProvider>
    </LayoutContextProvider>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      {children}
    </div>
  );
}

export function MeetingRoom() {
  const identity = useRoomStore((s) => s.identity);
  const leave = useRoomStore((s) => s.leave);
  const { data, isLoading, error } = useToken(identity);

  if (isLoading) {
    return (
      <Centered>
        <Loader2 size={26} className="animate-spin text-accent" />
        <div>
          <p className="text-[15px] font-medium text-ink">Connecting…</p>
          <p className="mt-1 text-sm text-muted">
            Joining {identity?.room ?? "room"}
          </p>
        </div>
      </Centered>
    );
  }

  if (error || !data) {
    return (
      <Centered>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-danger/15 text-danger">
          <WifiOff size={22} />
        </span>
        <div>
          <p className="text-[15px] font-semibold text-ink">Couldn’t connect</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
            {error instanceof Error ? error.message : "Could not reach the room."}
          </p>
        </div>
        <button
          type="button"
          onClick={leave}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-line-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <ArrowLeft size={16} /> Back to lobby
        </button>
      </Centered>
    );
  }

  return (
    <LiveKitRoom
      token={data.token}
      serverUrl={data.serverUrl}
      connect
      audio
      video
      options={{
        // native browser noise cancellation — zero deps
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      }}
      onDisconnected={() => useRoomStore.getState().leave()}
      data-lk-theme="default"
      className="flex h-dvh flex-col bg-bg"
    >
      <RoomConference />
    </LiveKitRoom>
  );
}
