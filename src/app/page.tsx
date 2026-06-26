"use client";

import { useEffect } from "react";
import { joinSchema } from "@/lib/schemas";
import { useRoomStore } from "@/store/room-store";

import { JoinForm } from "@/components/join-form";
import { MeetingRoom } from "@/components/meeting-room";

export default function Home() {
  const joined = useRoomStore((s) => s.joined);
  const join = useRoomStore((s) => s.join);

  // deep link: /?room=demo&name=jane joins straight away
  useEffect(() => {
    if (useRoomStore.getState().joined) return;
    const p = new URLSearchParams(window.location.search);
    const parsed = joinSchema.safeParse({
      room: p.get("room") ?? "",
      username: p.get("name") ?? "",
    });
    if (parsed.success) {
      join(parsed.data);
      if (p.get("chat") === "1") useRoomStore.getState().toggleChat();
    }
  }, [join]);

  return <main className="h-dvh">{joined ? <MeetingRoom /> : <JoinForm />}</main>;
}
