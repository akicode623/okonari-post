import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminPostsClient from "./AdminPostsClient";

type SearchParamsPromise = Promise<Record<string, string | string[] | undefined>>;

function pickString(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : "";
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: SearchParamsPromise;
}) {
  // ① searchParams を await して取り出す（Next.js 16 のポイント）
  const sp = await searchParams;

  // ② クエリ文字列を取り出す
  const ageStr = pickString(sp.age);
  const gender = pickString(sp.gender);
  const place = pickString(sp.place);
  const action = pickString(sp.action);
  const keyword = pickString(sp.keyword);

  // ③ Prisma の where を組み立てる
  const where: any = {};

  if (ageStr.trim() !== "") {
    const age = Number(ageStr);
    if (Number.isFinite(age)) where.age = age;
  }

  if (gender.trim() !== "" && gender !== "(指定なし)") {
    where.gender = gender;
  }

  // places/actions は String[] なので「配列にその値が含まれるか」で絞る
  if (place.trim() !== "") {
    where.places = { has: place }; // 例: "学校" を含む
  }

  if (action.trim() !== "") {
    where.actions = { has: action }; // 例: "怒りっぽい" を含む
  }

  if (keyword.trim() !== "") {
    where.solution = { contains: keyword, mode: "insensitive" };
  }

  // ④ DB から取得
  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  // ⑤ 検索フォーム（UI）は Client 側に任せる
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">管理：投稿一覧</h1>
        <div className="flex gap-2">
          <Link
            className="px-4 py-2 rounded bg-amber-600 text-white"
            href="/admin/news"
          >
            お知らせ管理
          </Link>
          <a
            className="px-4 py-2 rounded bg-green-600 text-white"
            href="/api/posts/csv"
          >
            CSVダウンロード
          </a>
          <Link
            className="px-4 py-2 rounded bg-blue-600 text-white"
            href="/posts/new"
          >
            投稿ページへ
          </Link>
        </div>
      </div>

      <AdminPostsClient
        initialPosts={posts}
        initialQuery={{
          age: ageStr,
          gender,
          place,
          action,
          keyword,
        }}
      />
    </div>
  );
}
