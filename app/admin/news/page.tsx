import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminNewsClient from "./AdminNewsClient";

export default async function AdminNewsPage() {
  const news = await prisma.newsPost.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 200,
  });

  const initialNews = news.map((n) => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
    eventDate: n.eventDate ? n.eventDate.toISOString() : null,
  }));

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">お知らせ・イベント通知 管理</h1>
        <div className="flex gap-2">
          <Link href="/admin/posts" className="rounded border px-4 py-2 font-semibold">
            投稿管理へ
          </Link>
          <Link href="/" className="rounded border px-4 py-2 font-semibold">
            トップへ
          </Link>
        </div>
      </div>

      <AdminNewsClient initialNews={initialNews} />
    </div>
  );
}
