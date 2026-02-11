import Link from "next/link";
import { Zen_Maru_Gothic } from "next/font/google";
import { prisma } from "@/lib/prisma";

const zenMaru = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const highlights = [
  "困りごとをすぐに記録",
  "カテゴリで見返しやすい",
  "改善アイデアを資産化",
  "会員チャットで交流できる",
];

async function getLatestNews() {
  return prisma.newsPost.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 3,
  });
}

export default async function HomePage() {
  const latestNews = await getLatestNews();

  return (
    <main
      className={`${zenMaru.className} relative isolate min-h-screen overflow-hidden bg-[#f6f7f3] text-[#1b1c18]`}
    >
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#f0b86b]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-[#79b89f]/45 blur-3xl" />

      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-16 sm:px-8">
        <div className="w-full rounded-[2rem] border border-[#1b1c18]/10 bg-white/80 p-6 shadow-[0_20px_80px_-35px_rgba(0,0,0,0.45)] backdrop-blur md:p-12">
          <div className="animate-fade-up space-y-8">
            <div className="space-y-6">
              <p className="inline-flex rounded-full border border-[#1b1c18]/15 bg-[#f8f4ea] px-4 py-1 text-sm font-medium tracking-wide">
                OKONARI POST
              </p>

              <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                日々の困りごとを投稿して
                <span className="block text-[#b05f2b]">解決のヒントに変える</span>
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-[#3f4137] sm:text-lg">
                気づいた課題を記録し、解決方法を共有できるサービスです。
                あとから振り返ると、行動改善のヒントが見えてきます。
              </p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#1b1c18]/10 bg-[#fbfaf6] px-4 py-3 text-sm font-medium text-[#2e302a]"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Link
                  href="/posts/new"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#1b1c18] px-8 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2a2c25]"
                >
                  投稿ページへ進む
                </Link>
                <Link
                  href="/admin/posts"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#1b1c18]/20 px-8 py-3 text-base font-semibold text-[#1b1c18] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  投稿一覧を見る
                </Link>
                <Link
                  href="/members/chat"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#b05f2b]/25 bg-[#f8e9d8] px-8 py-3 text-base font-semibold text-[#8f4d1f] transition hover:-translate-y-0.5 hover:bg-[#f6e2cc]"
                >
                  会員チャットへ
                </Link>
              </div>
            </div>

            <section className="rounded-2xl border border-[#1b1c18]/10 bg-[#fbfaf6] p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold sm:text-xl">最新お知らせ</h2>
                <Link
                  href="/admin/news"
                  className="text-sm font-semibold text-[#8f4d1f] underline-offset-4 hover:underline"
                >
                  すべて見る
                </Link>
              </div>

              <div className="space-y-3">
                {latestNews.length === 0 && (
                  <p className="rounded-xl border border-[#1b1c18]/10 bg-white px-4 py-3 text-sm text-[#4a4d43]">
                    現在お知らせはありません。
                  </p>
                )}

                {latestNews.map((news) => (
                  <article
                    key={news.id}
                    className="rounded-xl border border-[#1b1c18]/10 bg-white px-4 py-3"
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-[#5f6258]">
                      <span className="rounded-full border border-[#1b1c18]/15 bg-[#f8f4ea] px-2 py-0.5 font-semibold">
                        {news.category === "EVENT" ? "イベント通知" : "お知らせ"}
                      </span>
                      <time>{new Date(news.createdAt).toLocaleDateString("ja-JP")}</time>
                      {news.eventDate && (
                        <span>
                          開催: {new Date(news.eventDate).toLocaleString("ja-JP")}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold">{news.title}</h3>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-[#3f4137]">
                      {news.content}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
