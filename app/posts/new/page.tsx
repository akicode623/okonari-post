"use client";

import Link from "next/link";
import { Zen_Maru_Gothic } from "next/font/google";
import { useMemo, useState } from "react";

const AGE_OPTIONS = Array.from({ length: 18 }, (_, i) => String(i + 1));

const PLACE_OPTIONS = ["学校", "公共の場", "お友達との遊びの場"] as const;
const ACTION_OPTIONS = ["怒りっぽい", "無口", "引っ込み思案"] as const;
const GENDER_OPTIONS = ["男の子", "女の子"] as const;

const zenMaru = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function NewPostPage() {
  const [age, setAge] = useState("6");
  const [gender, setGender] = useState<"" | "男の子" | "女の子">("");
  const [places, setPlaces] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [solution, setSolution] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      Number.isFinite(Number(age)) &&
      gender !== "" &&
      places.length > 0 &&
      actions.length > 0 &&
      solution.trim().length > 0 &&
      !isSubmitting
    );
  }, [age, gender, places, actions, solution, isSubmitting]);

  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);

    try {
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
    } catch {
      alert("通信エラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      className={`${zenMaru.className} relative isolate min-h-screen overflow-hidden bg-[#f6f7f3] text-[#1b1c18]`}
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#f0b86b]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-[#79b89f]/45 blur-3xl" />

      <section className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
        <div className="animate-fade-up rounded-[2rem] border border-[#1b1c18]/10 bg-white/80 p-6 shadow-[0_20px_80px_-35px_rgba(0,0,0,0.45)] backdrop-blur md:p-10">
          <div className="space-y-4">
            <p className="inline-flex rounded-full border border-[#1b1c18]/15 bg-[#f8f4ea] px-4 py-1 text-sm font-medium tracking-wide">
              NEW POST
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              お困り行動と解決策を記録する
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-[#3f4137] sm:text-base">
              気づいた場面・行動・対応策をまとめて残します。項目を選んで入力すると、あとで一覧から見返しやすくなります。
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <section className="rounded-2xl border border-[#1b1c18]/10 bg-[#fbfaf6] p-5">
              <label htmlFor="age" className="mb-3 block text-sm font-semibold">
                年齢
              </label>
              <select
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-32 rounded-xl border border-[#1b1c18]/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#b05f2b] focus:ring-2 focus:ring-[#b05f2b]/20"
              >
                {AGE_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}歳
                  </option>
                ))}
              </select>
            </section>

            <section className="rounded-2xl border border-[#1b1c18]/10 bg-[#fbfaf6] p-5">
              <p className="mb-3 text-sm font-semibold">性別</p>
              <div className="flex flex-wrap gap-3">
                {GENDER_OPTIONS.map((v) => (
                  <label key={v} className="cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={v}
                      checked={gender === v}
                      onChange={() => setGender(v)}
                      className="peer sr-only"
                    />
                    <span className="inline-flex min-w-24 items-center justify-center rounded-xl border border-[#1b1c18]/20 bg-white px-4 py-2 text-sm font-medium text-[#33362f] transition peer-checked:border-[#b05f2b] peer-checked:bg-[#f8e9d8] peer-checked:text-[#8f4d1f]">
                      {v}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#1b1c18]/10 bg-[#fbfaf6] p-5">
              <p className="mb-3 text-sm font-semibold">場所（複数選択可）</p>
              <div className="flex flex-wrap gap-3">
                {PLACE_OPTIONS.map((v) => (
                  <label key={v} className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={places.includes(v)}
                      onChange={() => setPlaces((prev) => toggle(prev, v))}
                      className="peer sr-only"
                    />
                    <span className="inline-flex items-center justify-center rounded-xl border border-[#1b1c18]/20 bg-white px-4 py-2 text-sm font-medium text-[#33362f] transition peer-checked:border-[#b05f2b] peer-checked:bg-[#f8e9d8] peer-checked:text-[#8f4d1f]">
                      {v}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#1b1c18]/10 bg-[#fbfaf6] p-5">
              <p className="mb-3 text-sm font-semibold">行動（複数選択可）</p>
              <div className="flex flex-wrap gap-3">
                {ACTION_OPTIONS.map((v) => (
                  <label key={v} className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={actions.includes(v)}
                      onChange={() => setActions((prev) => toggle(prev, v))}
                      className="peer sr-only"
                    />
                    <span className="inline-flex items-center justify-center rounded-xl border border-[#1b1c18]/20 bg-white px-4 py-2 text-sm font-medium text-[#33362f] transition peer-checked:border-[#b05f2b] peer-checked:bg-[#f8e9d8] peer-checked:text-[#8f4d1f]">
                      {v}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#1b1c18]/10 bg-[#fbfaf6] p-5">
              <label
                htmlFor="solution"
                className="mb-3 block text-sm font-semibold"
              >
                解決策
              </label>
              <textarea
                id="solution"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="h-44 w-full resize-y rounded-xl border border-[#1b1c18]/20 bg-white p-4 text-sm leading-relaxed outline-none transition focus:border-[#b05f2b] focus:ring-2 focus:ring-[#b05f2b]/20"
                placeholder="試してみた対応や有効だった声かけを具体的に書いてください"
              />
            </section>

            <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
              <Link
                href="/"
                className="text-sm font-medium text-[#3f4137] underline-offset-4 transition hover:text-[#1b1c18] hover:underline"
              >
                トップページに戻る
              </Link>
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex min-w-44 items-center justify-center rounded-2xl bg-[#1b1c18] px-8 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2a2c25] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? "送信中..." : "投稿を送信"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
