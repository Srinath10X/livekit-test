'use client';

import { useState } from 'react';
import { useChat } from '@livekit/components-react';
import { useRoomStore } from '@/store/room-store';

export function ChatPanel() {
  const { chatMessages, send } = useChat();
  const toggleChat = useRoomStore((s) => s.toggleChat);
  const [text, setText] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    await send(value);
    setText('');
  }

  return (
    <aside className="flex h-full w-80 flex-col border-l border-neutral-800 bg-neutral-900">
      <header className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
        <h2 className="font-semibold">Chat</h2>
        <button
          type="button"
          onClick={toggleChat}
          aria-label="Close chat"
          className="rounded-md px-2 py-1 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {chatMessages.length === 0 ? (
          <p className="text-sm text-neutral-500">No messages yet</p>
        ) : (
          chatMessages.map((msg, i) => (
            <div key={msg.id ?? i} className="flex flex-col gap-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-neutral-200">
                  {msg.from?.identity ?? 'Unknown'}
                </span>
                <span className="text-xs text-neutral-500">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="break-words text-sm text-neutral-300">
                {msg.message}
              </p>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-neutral-800 p-3"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Send a message"
          aria-label="Message"
          className="min-w-0 flex-1 rounded-md bg-neutral-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Send
        </button>
      </form>
    </aside>
  );
}
