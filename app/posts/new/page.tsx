"use client";

import { useMemo, useState } from "react";

const AGE_OPTIONS = Array.from({ length: 18 }, (_, i) => String(i + 1));

const PLACE_OPTIONS = ["学校", "公共の場", "お友達との遊びの場"] as const;
const ACTION_OPTIONS = ["怒りっぽい", "無口", "引っ込み思案"] as const;

export default function NewPostPage() {
  const [age, setAge] = useState("6");
  const [gender, setGender] = useState<"" | "男の子" | "女の子">("");
  const [places, setPlaces] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [solution, setSolution] = useState("");

  const canSubmit = useMemo(() => {
    return (
      Number.isFinite(Number(age)) &&
      gender !== "" &&
      places.length > 0 &&
      actions.length > 0 &&
      solution.trim().length > 0
    );
  }, [age, gender, places, actions, solution]);

  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const payload = {
      age: Number(age),
      gender,
      places,
      actions,
      solution,
    };

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const t = await res.text();
      alert("送信に失敗しました: " + t);
      return;
    }

    alert("送信しました");
    setGender("");
    setPlaces([]);
    setActions([]);
    setSolution("");
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-center text-3xl font-bold text-black">
          お困り行動と解決策　投稿ページ
        </h1>

        <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-3xl space-y-6">
          {/* 年齢 */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <div className="font-semibold">■ 年齢</div>
            <div>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-24 rounded border border-gray-400 px-3 py-2"
              >
                {AGE_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 性別 */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <div className="font-semibold">■ 性別</div>
            <div className="flex flex-wrap items-center gap-8">
              {(["男の子", "女の子"] as const).map((v) => (
                <label key={v} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value={v}
                    checked={gender === v}
                    onChange={() => setGender(v)}
                  />
                  {v}
                </label>
              ))}
            </div>
          </div>

          {/* 場所 */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <div className="font-semibold">■ 場所</div>
            <div className="flex flex-wrap items-center gap-8">
              {PLACE_OPTIONS.map((v) => (
                <label key={v} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={places.includes(v)}
                    onChange={() => setPlaces((prev) => toggle(prev, v))}
                  />
                  {v}
                </label>
              ))}
            </div>
          </div>

          {/* 行動 */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <div className="font-semibold">■ 行動</div>
            <div className="flex flex-wrap items-center gap-8">
              {ACTION_OPTIONS.map((v) => (
                <label key={v} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={actions.includes(v)}
                    onChange={() => setActions((prev) => toggle(prev, v))}
                  />
                  {v}
                </label>
              ))}
            </div>
          </div>

          {/* 解決策 */}
          <div className="grid grid-cols-1 gap-2">
            <div className="font-semibold">■ 解決策</div>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className="h-40 w-full resize-y rounded border border-gray-400 p-3"
              placeholder="解決策を書いてください"
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded bg-blue-600 px-10 py-3 font-semibold text-white disabled:opacity-40"
            >
              送信
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
