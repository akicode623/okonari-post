"use client";

import { useState } from "react";

type NewsCategory = "NOTICE" | "EVENT";

type NewsItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  category: NewsCategory;
  title: string;
  content: string;
  eventDate: string | null;
};

export default function AdminNewsClient({ initialNews }: { initialNews: NewsItem[] }) {
  const [items, setItems] = useState<NewsItem[]>(initialNews);
  const [category, setCategory] = useState<NewsCategory>("NOTICE");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorText("");

    const payload = {
      category,
      title: title.trim(),
      content: content.trim(),
      eventDate: category === "EVENT" ? eventDate : "",
    };

    if (!payload.title || !payload.content) {
      setErrorText("タイトルと本文は必須です。");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t);
      }

      const created = (await res.json()) as NewsItem;
      setItems((prev) => [created, ...prev]);
      setCategory("NOTICE");
      setTitle("");
      setContent("");
      setEventDate("");
    } catch {
      setErrorText("投稿に失敗しました。入力内容を確認してください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    const ok = window.confirm("このお知らせを削除しますか？");
    if (!ok) return;

    const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setErrorText("削除に失敗しました。時間をおいて再試行してください。");
      return;
    }

    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="rounded border p-4">
        <h2 className="mb-4 text-lg font-bold">新規投稿</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-semibold">
              種別
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as NewsCategory)}
              className="w-full rounded border px-3 py-2"
            >
              <option value="NOTICE">お知らせ</option>
              <option value="EVENT">イベント通知</option>
            </select>
          </div>

          <div>
            <label htmlFor="eventDate" className="mb-1 block text-sm font-semibold">
              開催日時（イベント時のみ）
            </label>
            <input
              id="eventDate"
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              disabled={category !== "EVENT"}
              className="w-full rounded border px-3 py-2 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="title" className="mb-1 block text-sm font-semibold">
            タイトル
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            className="w-full rounded border px-3 py-2"
            placeholder="例: 2月の定例ミーティング開催のお知らせ"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="content" className="mb-1 block text-sm font-semibold">
            本文
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={3000}
            className="h-32 w-full rounded border p-3"
            placeholder="案内内容を入力してください"
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-600">投稿数: {items.length}</p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? "投稿中..." : "投稿する"}
          </button>
        </div>

        {errorText && (
          <p className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorText}
          </p>
        )}
      </form>

      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-3 py-3">投稿日</th>
              <th className="px-3 py-3">種別</th>
              <th className="px-3 py-3">タイトル</th>
              <th className="px-3 py-3">本文</th>
              <th className="px-3 py-3">開催日時</th>
              <th className="px-3 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t align-top">
                <td className="px-3 py-3 whitespace-nowrap">
                  {new Date(item.createdAt).toLocaleString("ja-JP")}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {item.category === "EVENT" ? "イベント通知" : "お知らせ"}
                </td>
                <td className="px-3 py-3">{item.title}</td>
                <td className="px-3 py-3 whitespace-pre-wrap">{item.content}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {item.eventDate
                    ? new Date(item.eventDate).toLocaleString("ja-JP")
                    : "-"}
                </td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => void onDelete(item.id)}
                    className="rounded bg-red-600 px-3 py-1 font-semibold text-white"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={6}>
                  投稿データがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
