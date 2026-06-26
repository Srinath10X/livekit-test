"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { useChat } from "@livekit/components-react";
import { useRoomStore } from "@/store/room-store";

// Keep one useChat() alive for the whole call so messages survive the sheet
// closing/reopening. ChatPanel only mounts while open, so it must NOT own the
// subscription itself.
type ChatApi = ReturnType<typeof useChat>;
const ChatContext = createContext<ChatApi | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const chat = useChat();
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}

function useRoomChat(): ChatApi {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useRoomChat must be used within <ChatProvider>");
  return ctx;
}

export function ChatPanel() {
  const { chatMessages, send } = useRoomChat();
  const toggleChat = useRoomStore((s) => s.toggleChat);
  const [text, setText] = useState("");
  const [enter, setEnter] = useState(false);
  const [dragY, setDragY] = useState(0);
  const dragging = useRef(false);
  const startY = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // play the slide-up on mount; focus composer; close on Escape
  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && toggleChat();
    document.addEventListener("keydown", onKey);
    inputRef.current?.focus();
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [toggleChat]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [chatMessages.length]);

  // drag the handle/header down to dismiss
  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    startY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (dragging.current) setDragY(Math.max(0, e.clientY - startY.current));
  }
  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragY > 120) toggleChat();
    else setDragY(0);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    await send(value);
    setText("");
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close chat"
        onClick={toggleChat}
        className="absolute inset-0 animate-fade-in bg-black/60"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Chat"
        style={{
          transform: enter ? `translateY(${dragY}px)` : "translateY(100%)",
          transition: dragging.current
            ? "none"
            : "transform 0.34s var(--ease-out-quart)",
        }}
        className="absolute inset-x-0 bottom-0 mx-auto flex h-[80dvh] max-w-[560px] flex-col overflow-hidden rounded-t-2xl border border-line bg-panel shadow-[0_-16px_48px_-16px_rgba(0,0,0,0.8)]"
      >
        <header
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="flex shrink-0 cursor-grab touch-none flex-col active:cursor-grabbing"
        >
          <div className="flex justify-center pt-2.5">
            <span className="h-1.5 w-10 rounded-full bg-line-bright" />
          </div>
          <div className="flex h-12 items-center gap-2.5 px-4">
            <MessageSquare size={17} className="text-accent" />
            <h2 className="text-sm font-semibold text-ink">Chat</h2>
            {chatMessages.length > 0 && (
              <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium tabular-nums text-muted">
                {chatMessages.length}
              </span>
            )}
            <button
              type="button"
              onClick={toggleChat}
              aria-label="Close chat"
              className="ml-auto grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto border-t border-line px-4 py-4">
          {chatMessages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-surface text-faint">
                <MessageSquare size={20} />
              </span>
              <p className="text-sm font-medium text-muted">No messages yet</p>
              <p className="max-w-[14rem] text-[13px] text-faint">
                Say hello — messages are visible to everyone in the room.
              </p>
            </div>
          ) : (
            chatMessages.map((msg, i) => {
              const mine = msg.from?.isLocal ?? false;
              const name = mine ? "You" : msg.from?.identity ?? "Unknown";
              return (
                <div
                  key={msg.id ?? i}
                  className={`flex flex-col gap-1 ${mine ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-baseline gap-2 px-0.5 text-xs">
                    <span
                      className={`font-medium ${mine ? "text-accent" : "text-ink"}`}
                    >
                      {name}
                    </span>
                    <span className="text-faint tabular-nums">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words ${
                      mine
                        ? "rounded-tr-md bg-accent-solid text-on-accent"
                        : "rounded-tl-md bg-surface text-ink"
                    }`}
                  >
                    {msg.message}
                  </p>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex shrink-0 items-center gap-2 border-t border-line p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Send a message…"
            aria-label="Message"
            autoComplete="off"
            className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-surface px-3.5 text-sm text-ink caret-accent outline-none transition-colors placeholder:text-faint hover:border-line-bright focus:border-accent/70 focus:ring-1 focus:ring-accent/40"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            aria-label="Send message"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-solid text-on-accent transition-[background-color,opacity] duration-150 hover:bg-accent-solid-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-40"
          >
            <Send size={17} />
          </button>
        </form>
      </aside>
    </div>
  );
}
