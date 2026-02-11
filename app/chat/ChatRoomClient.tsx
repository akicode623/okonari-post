"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  displayName: string;
  message: string;
  createdAt: string;
};

export default function ChatRoomClient({
  initialMessages,
}: {
  initialMessages: ChatMessage[];
}) {
  const [displayName, setDisplayName] = useState("ゲスト");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorText, setErrorText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const trimmedName = displayName.trim();
  const canSubmit = useMemo(
    () => trimmedName.length > 0 && messageInput.trim().length > 0 && !isSending,
    [trimmedName, messageInput, isSending]
  );

  useEffect(() => {
    const savedName = window.localStorage.getItem("chat-display-name");
    if (savedName && savedName.trim() !== "") {
      setDisplayName(savedName);
    }
  }, []);

  useEffect(() => {
    if (trimmedName) {
      window.localStorage.setItem("chat-display-name", trimmedName);
    }
  }, [trimmedName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function refreshMessages(showError = true) {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/chat/messages?take=80", {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("チャットの取得に失敗しました");
      }
      const data = (await res.json()) as ChatMessage[];
      setMessages(data);
    } catch {
      if (showError) {
        setErrorText("最新メッセージの取得に失敗しました。");
      }
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      void refreshMessages(false);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setIsSending(true);
      setErrorText("");

      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: trimmedName,
          message: messageInput.trim(),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const created = (await res.json()) as ChatMessage;
      setMessages((prev) => [...prev, created]);
      setMessageInput("");
    } catch {
      setErrorText("メッセージ送信に失敗しました。");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="mt-8 grid gap-5 md:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl border border-[#1b1c18]/10 bg-[#fbfaf6] p-5">
        <div className="space-y-3">
          <label htmlFor="displayName" className="block text-sm font-semibold">
            表示名
          </label>
          <input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={30}
            className="w-full rounded-xl border border-[#1b1c18]/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#b05f2b] focus:ring-2 focus:ring-[#b05f2b]/20"
            placeholder="表示名を入力"
          />

          <button
            type="button"
            onClick={() => void refreshMessages(true)}
            disabled={isRefreshing}
            className="inline-flex w-full items-center justify-center rounded-xl border border-[#1b1c18]/20 bg-white px-3 py-2 text-sm font-semibold text-[#1b1c18] transition hover:bg-[#f5f3ec] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRefreshing ? "更新中..." : "最新を取得"}
          </button>

          <p className="text-xs leading-relaxed text-[#3f4137]">
            会員同士で困りごとの気づきや、うまくいった工夫を自由に共有してください。
          </p>
        </div>
      </aside>

      <section className="rounded-2xl border border-[#1b1c18]/10 bg-[#fbfaf6] p-5">
        <div className="h-[420px] overflow-y-auto rounded-xl border border-[#1b1c18]/10 bg-white px-4 py-4">
          <div className="space-y-3">
            {messages.length === 0 && (
              <p className="py-10 text-center text-sm text-[#5c5f55]">
                まだメッセージがありません。最初の投稿をしてみましょう。
              </p>
            )}

            {messages.map((m) => {
              const mine = trimmedName !== "" && m.displayName === trimmedName;
              return (
                <div
                  key={m.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      mine
                        ? "bg-[#1b1c18] text-white"
                        : "border border-[#1b1c18]/10 bg-[#f8f4ea] text-[#1b1c18]"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs opacity-80">
                      <span className="font-semibold">{m.displayName}</span>
                      <span>{new Date(m.createdAt).toLocaleString("ja-JP")}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {m.message}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <label htmlFor="message" className="block text-sm font-semibold">
            メッセージ
          </label>
          <textarea
            id="message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            maxLength={500}
            className="h-28 w-full resize-y rounded-xl border border-[#1b1c18]/20 bg-white p-3 text-sm leading-relaxed outline-none transition focus:border-[#b05f2b] focus:ring-2 focus:ring-[#b05f2b]/20"
            placeholder="共有したいことを入力してください"
          />

          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-xs text-[#5c5f55]">
              {messageInput.trim().length}/500 文字
            </p>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex min-w-40 items-center justify-center rounded-2xl bg-[#1b1c18] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2a2c25] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSending ? "送信中..." : "メッセージ送信"}
            </button>
          </div>
        </form>

        {errorText && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorText}
          </p>
        )}
      </section>
    </div>
  );
}
