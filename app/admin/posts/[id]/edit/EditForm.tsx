"use client";

import { useState } from "react";

const PLACE_OPTIONS = ["学校", "公共の場", "お友達との遊びの場"] as const;
const ACTION_OPTIONS = ["怒りっぽい", "無口", "引っ込み思案"] as const;

export default function EditForm({ post }: { post: any }) {
  const [age, setAge] = useState(String(post.age));
  const [gender, setGender] = useState(post.gender ?? "");
  const [places, setPlaces] = useState<string[]>(Array.isArray(post.places) ? post.places : []);
  const [actions, setActions] = useState<string[]>(Array.isArray(post.actions) ? post.actions : []);
  const [solution, setSolution] = useState(post.solution ?? "");
  const [saving, setSaving] = useState(false);

  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        age: Number(age),
        gender,
        places,
        actions,
        solution,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const t = await res.text();
      alert("保存に失敗しました: " + t);
      return;
    }
    alert("保存しました");
    location.href = "/admin/posts";
  }

  return (
    <form onSubmit={onSave} className="space-y-5 rounded border p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 text-sm font-semibold">年齢</div>
          <input value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <div className="mb-1 text-sm font-semibold">性別</div>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full rounded border px-3 py-2">
            <option value="">選択</option>
            <option value="男の子">男の子</option>
            <option value="女の子">女の子</option>
          </select>
        </div>
      </div>

      <div>
        <div className="mb-1 text-sm font-semibold">場所</div>
        <div className="flex flex-wrap gap-6">
          {PLACE_OPTIONS.map((v) => (
            <label key={v} className="flex items-center gap-2">
              <input type="checkbox" checked={places.includes(v)} onChange={() => setPlaces((p) => toggle(p, v))} />
              {v}
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1 text-sm font-semibold">行動</div>
        <div className="flex flex-wrap gap-6">
          {ACTION_OPTIONS.map((v) => (
            <label key={v} className="flex items-center gap-2">
              <input type="checkbox" checked={actions.includes(v)} onChange={() => setActions((p) => toggle(p, v))} />
              {v}
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1 text-sm font-semibold">解決策</div>
        <textarea value={solution} onChange={(e) => setSolution(e.target.value)} className="h-32 w-full rounded border p-3" />
      </div>

      <button disabled={saving} className="rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50">
        {saving ? "保存中..." : "保存"}
      </button>
    </form>
  );
}
