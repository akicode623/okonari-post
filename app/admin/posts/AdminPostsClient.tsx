"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DeleteButton from "./DeleteButton";

type Post = {
  id: string;
  createdAt: string | Date;
  age: number;
  gender: string;
  places: string[];
  actions: string[];
  solution: string;
};

export default function AdminPostsClient({
  initialPosts,
  initialQuery,
}: {
  initialPosts: any[];
  initialQuery: { age: string; gender: string; place: string; action: string; keyword: string };
}) {
  const posts: Post[] = initialPosts.map((p) => ({
    ...p,
    createdAt: p.createdAt,
    places: Array.isArray(p.places) ? p.places : [],
    actions: Array.isArray(p.actions) ? p.actions : [],
  }));

  const [age, setAge] = useState(initialQuery.age ?? "");
  const [gender, setGender] = useState(initialQuery.gender ?? "(指定なし)");
  const [place, setPlace] = useState(initialQuery.place ?? "");
  const [action, setAction] = useState(initialQuery.action ?? "");
  const [keyword, setKeyword] = useState(initialQuery.keyword ?? "");

  const count = useMemo(() => posts.length, [posts]);

  return (
    <div className="space-y-6">
      {/* 検索（GETでクエリを付けて再表示） */}
      <form action="/admin/posts" method="GET" className="rounded border p-4">
        <div className="grid gap-3 md:grid-cols-5">
          <div>
            <div className="mb-1 text-sm font-semibold">年齢</div>
            <input
              name="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="例：10"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <div className="mb-1 text-sm font-semibold">性別</div>
            <select
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              <option>(指定なし)</option>
              <option>男の子</option>
              <option>女の子</option>
            </select>
          </div>

          <div>
            <div className="mb-1 text-sm font-semibold">場所（完全一致）</div>
            <input
              name="place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="例：学校"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <div className="mb-1 text-sm font-semibold">行動（完全一致）</div>
            <input
              name="action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="例：怒りっぽい"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <div className="mb-1 text-sm font-semibold">解決策キーワード（部分一致）</div>
            <input
              name="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="例：視覚支援"
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button className="rounded bg-black px-4 py-2 font-semibold text-white">検索</button>
          <Link href="/admin/posts" className="rounded border px-4 py-2 font-semibold">
            クリア
          </Link>
          <div className="ml-auto text-sm text-gray-700">件数：{count} 件</div>
        </div>
      </form>

      {/* 一覧 */}
      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-3 py-3">日時</th>
              <th className="px-3 py-3">年齢</th>
              <th className="px-3 py-3">性別</th>
              <th className="px-3 py-3">場所</th>
              <th className="px-3 py-3">行動</th>
              <th className="px-3 py-3">解決策</th>
              <th className="px-3 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-3">
                  {new Date(p.createdAt).toLocaleString("ja-JP")}
                </td>
                <td className="px-3 py-3">{p.age}</td>
                <td className="px-3 py-3">{p.gender}</td>
                <td className="px-3 py-3">{(p.places ?? []).join(" / ")}</td>
                <td className="px-3 py-3">{(p.actions ?? []).join(" / ")}</td>
                <td className="px-3 py-3">{p.solution}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Link
                      className="rounded border px-3 py-1 font-semibold"
                      href={`/admin/posts/${p.id}/edit`}
                    >
                      編集
                    </Link>
                    <DeleteButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={7}>
                  該当データがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
