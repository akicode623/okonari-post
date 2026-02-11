import Link from "next/link";
import { Zen_Maru_Gothic } from "next/font/google";
import { prisma } from "@/lib/prisma";
import MembersChatClient from "./MembersChatClient";

const zenMaru = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

async function getInitialMessages() {
  const messages = await prisma.chatMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return messages.reverse().map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }));
}

export default async function MembersChatPage() {
  const initialMessages = await getInitialMessages();

  return (
    <main
      className={`${zenMaru.className} relative isolate min-h-screen overflow-hidden bg-[#f6f7f3] text-[#1b1c18]`}
    >
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#f0b86b]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-[#79b89f]/45 blur-3xl" />

      <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <div className="animate-fade-up rounded-[2rem] border border-[#1b1c18]/10 bg-white/80 p-6 shadow-[0_20px_80px_-35px_rgba(0,0,0,0.45)] backdrop-blur md:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="inline-flex rounded-full border border-[#1b1c18]/15 bg-[#f8f4ea] px-4 py-1 text-sm font-medium tracking-wide">
                MEMBERS CHAT
              </p>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                会員同士で交流できるチャットルーム
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-[#3f4137] sm:text-base">
                気づきや相談、日々の工夫を気軽に共有できる会員チャットです。表示名を設定して、
                そのままメッセージを送信できます。
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-[#1b1c18]/20 px-5 py-2.5 text-sm font-semibold text-[#1b1c18] transition hover:-translate-y-0.5 hover:bg-white"
            >
              トップへ戻る
            </Link>
          </div>

          <MembersChatClient initialMessages={initialMessages} />
        </div>
      </section>
    </main>
  );
}
