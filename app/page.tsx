import Link from "next/link";
import { Zen_Maru_Gothic } from "next/font/google";

const zenMaru = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const highlights = [
  "困りごとをすぐに記録",
  "カテゴリで見返しやすい",
  "改善アイデアを資産化",
];

export default function HomePage() {
  return (
    <main
      className={`${zenMaru.className} relative isolate min-h-screen overflow-hidden bg-[#f6f7f3] text-[#1b1c18]`}
    >
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#f0b86b]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-[#79b89f]/45 blur-3xl" />

      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-16 sm:px-8">
        <div className="w-full rounded-[2rem] border border-[#1b1c18]/10 bg-white/80 p-6 shadow-[0_20px_80px_-35px_rgba(0,0,0,0.45)] backdrop-blur md:p-12">
          <div className="animate-fade-up space-y-6">
            <p className="inline-flex rounded-full border border-[#1b1c18]/15 bg-[#f8f4ea] px-4 py-1 text-sm font-medium tracking-wide">
              OKONARI POST
            </p>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              日々の困り行動を
              <span className="block text-[#b05f2b]">解決ノートに変える</span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-[#3f4137] sm:text-lg">
              気づいた瞬間に投稿し、解決策まで一緒に残せるシンプルな記録アプリ。
              あとから振り返ると、行動改善のヒントが見えてきます。
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
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
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .animate-fade-up {
          animation: fade-up 0.8s ease-out both;
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
