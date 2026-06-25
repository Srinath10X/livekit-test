'use client';

import { useState } from 'react';
import { joinSchema } from '@/lib/schemas';
import { useRoomStore } from '@/store/room-store';

export function JoinForm() {
  const join = useRoomStore((s) => s.join);
  const [room, setRoom] = useState('demo');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = joinSchema.safeParse({ room, username });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid input');
      return;
    }
    join(result.data);
  }

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8">
        <h1 className="mb-1 text-2xl font-semibold">Join a meeting</h1>
        <p className="mb-6 text-sm text-neutral-400">
          Enter a room name and your display name.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="room" className="text-sm font-medium">
              Room
            </label>
            <input
              id="room"
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="rounded-md bg-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="demo"
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-medium">
              Your name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-md bg-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Jane Doe"
              autoComplete="off"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="mt-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-500"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
