"use client";

import { useState } from "react";
import { ArrowRight, Lock, Hash, User, Video } from "lucide-react";
import { joinSchema } from "@/lib/schemas";
import { useRoomStore } from "@/store/room-store";

export function JoinForm() {
  const join = useRoomStore((s) => s.join);
  const [room, setRoom] = useState("demo");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const result = joinSchema.safeParse({ room, username });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    join(result.data);
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-5 sm:p-6">
      <div className="w-full max-w-[26rem] animate-fade-up">
        {/* brand */}
        <div className="mb-7 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-solid text-on-accent shadow-[0_0_24px_-4px_var(--color-accent-solid)]">
            <Video size={18} strokeWidth={2.4} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            meet<span className="text-faint">.srinath</span>
          </span>
        </div>

        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-balance text-ink">
          Join a meeting
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          Enter a room and your name to hop into a live, self-hosted session.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
          <Field
            id="room"
            label="Room"
            icon={<Hash size={16} />}
            value={room}
            onChange={setRoom}
            placeholder="demo"
            autoFocus={username === ""}
          />
          <Field
            id="username"
            label="Your name"
            icon={<User size={16} />}
            value={username}
            onChange={setUsername}
            placeholder="Jane Doe"
          />

          {error && (
            <p role="alert" className="text-sm font-medium text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="group mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent-solid text-[15px] font-semibold text-on-accent transition-[background-color,transform] duration-150 hover:bg-accent-solid-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:translate-y-px"
          >
            Join meeting
            <ArrowRight
              size={18}
              className="transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </button>
        </form>

        {/* status — terminal readout */}
        <div className="mt-7 flex items-center gap-2.5 font-mono text-[12.5px] text-faint">
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse-ring"
            />
            <span className="text-muted">server online</span>
          </span>
          <span aria-hidden className="text-line-bright">
            ·
          </span>
          <span className="flex items-center gap-1.5">
            <Lock size={12} />
            e2e encrypted
          </span>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  icon,
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[13px] font-medium text-muted">
        {label}
      </label>
      <div className="group relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint transition-colors group-focus-within:text-accent">
          {icon}
        </span>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus={autoFocus}
          className="h-12 w-full rounded-xl border border-line bg-surface pl-10 pr-3.5 text-[15px] text-ink caret-accent outline-none transition-colors placeholder:text-faint hover:border-line-bright focus:border-accent/70 focus:ring-1 focus:ring-accent/40"
        />
      </div>
    </div>
  );
}
